import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { User } from "@prisma/client";
import { getSettings } from "@/lib/settings";

// Helper to get allowed domains
async function getAllowedDomains() {
    try {
        const settings = await prisma.setting.findUnique({
            where: { key: 'allowedDomains' }
        });
        return settings ? JSON.parse(settings.value) : ['bytebrush.dev'];
    } catch (error) {
        console.error('Failed to get allowed domains:', error);
        return ['bytebrush.dev']; // Fallback
    }
}

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            }, async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    return null;
                }

                const passwordMatch = await compare(credentials.password, user.password);

                if (!passwordMatch) {
                    return null;
                }

                // Check if the email domain is allowed
                if (user.email) {
                    const allowedDomains = await getAllowedDomains();
                    if (allowedDomains.length > 0) {
                        const emailDomain = user.email.split('@')[1];

                        // Super admin email (from env) is always allowed
                        if (user.email === process.env.INITIAL_ADMIN_EMAIL) {
                            return user;
                        }

                        // Check if domain is in allowed list
                        if (!allowedDomains.includes(emailDomain)) {
                            return null;
                        }
                    }
                }

                return user;
            }
        })
    ], callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;

                // Check if user is super admin based on email
                const isSuperAdminByEmail = user.email && process.env.INITIAL_ADMIN_EMAIL === user.email;

                // Check if email domain is allowed (if domains are specified)
                let isAllowedDomain = true;
                if (user.email) {
                    const allowedDomains = await getAllowedDomains();
                    if (allowedDomains.length > 0) {
                        const emailDomain = user.email.split('@')[1];
                        isAllowedDomain = allowedDomains.includes(emailDomain);
                    }
                }

                // Set admin status based on role or checks
                token.isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN" || isSuperAdminByEmail;
                token.isSuperAdmin = user.role === "SUPERADMIN" || isSuperAdminByEmail;
                token.hasAllowedDomain = isAllowedDomain;
            }
            return token;
        }, async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.isAdmin = token.isAdmin as boolean;
                session.user.isSuperAdmin = token.isSuperAdmin as boolean;
                session.user.hasAllowedDomain = token.hasAllowedDomain as boolean;
            }
            return session;
        }, async signIn({ user }) {
            // Check email domain restrictions if applicable
            if (user.email) {
                const allowedDomains = await getAllowedDomains();
                if (allowedDomains.length > 0) {
                    const emailDomain = user.email.split('@')[1];

                    // Super admin email always allowed
                    if (user.email === process.env.INITIAL_ADMIN_EMAIL) {
                        return true;
                    }

                    // Check if domain is in allowed list
                    if (!allowedDomains.includes(emailDomain)) {
                        return false;
                    }
                }
            }

            return true;
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
    },
});
