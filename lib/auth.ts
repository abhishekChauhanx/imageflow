import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No account found with this email");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && profile) {
        const email = token.email || (profile as any).email;
        const name = token.name || (profile as any).name;
        const image =
          token.picture ||
          (profile as any).picture ||
          (profile as any).avatar_url;
        const providerAccountId = account.providerAccountId;
        const provider = account.provider;

        if (!email) return token;

        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: { provider, providerAccountId },
          },
          include: { user: true },
        });

        if (existingAccount) {
          token.id = existingAccount.user.id;
          token.email = existingAccount.user.email!;
          token.name = existingAccount.user.name!;
          token.picture = existingAccount.user.image!;
        } else {
          let dbUser = await prisma.user.findUnique({ where: { email } });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: { email, name, image },
            });
          }

          await prisma.account.create({
            data: {
              userId: dbUser.id,
              type: account.type,
              provider,
              providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          });

          token.id = dbUser.id;
          token.email = dbUser.email!;
          token.name = dbUser.name!;
          token.picture = dbUser.image!;
        }
      }

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
};