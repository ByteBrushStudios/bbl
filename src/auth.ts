import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/config";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
          discordId: profile.id,
        };
      },
    }),  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.discordId = user.discordId;
        session.user.isAdmin = siteConfig.adminDiscordIDs.includes(user.discordId);
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Allow sign in only if the user's Discord ID is in the admin list
      if (account?.provider === 'discord') {
        return siteConfig.adminDiscordIDs.includes(user.discordId);
      }
      return false;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
});
