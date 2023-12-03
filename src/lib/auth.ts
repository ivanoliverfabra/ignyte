import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "@/lib/db"
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string 
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session(params) {

      if (!params.session?.user?.email) return Promise.resolve(params.session);

      const userData = await db.user.findUnique({
        where: {
          email: params.session.user?.email!,
        },
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          _count: {
            select: {
              followers: true,
              following: true,
              chats: true,
            }
          },
          role: true
        }
      });

      params.session.user = { ...userData };

      return Promise.resolve(params.session);
    },
  },
}