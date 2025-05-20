import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/config";

export const { 
  handlers: { GET, POST },
  auth, 
  signIn, 
  signOut 
} = NextAuth({
  adapter: PrismaAdapter(prisma),
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
    }),
  ],
  callbacks: {    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.discordId = user.discordId;
        session.user.isAdmin = siteConfig.adminDiscordIDs.includes(user.discordId);
      }
      return session;
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
