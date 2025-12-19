import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { compare } from "bcryptjs";
import { db } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();

        const authUserSnap = await db.collection("auth_users").doc(email).get();
        if (!authUserSnap.exists) {
          return null;
        }

        const authUser = authUserSnap.data() as any;

        if (!authUser?.passwordHash) {
          return null;
        }

        const isValid = await compare(credentials.password, authUser.passwordHash);

        if (!isValid) {
          return null;
        }

        const profileSnap = await db.collection("users").doc(email).get();
        const profile = profileSnap.exists ? (profileSnap.data() as any) : {};

        return {
          id: email,
          name: profile?.name ?? undefined,
          email: profile?.email ?? email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && profile) {
        token.provider = account.provider;
        token.name = profile.name ?? token.name;
        const profileEmail = (profile as any)?.email;
        if (typeof profileEmail === "string") {
          (token as any).email = profileEmail;
        }
      }

      if (user) {
        token.name = user.name ?? token.name;
        if (typeof (user as any).email === "string") {
          (token as any).email = (user as any).email;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name ?? session.user.name;
        const tokenEmail = (token as any)?.email;
        if (typeof tokenEmail === "string") {
          session.user.email = tokenEmail;
        }
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      const provider = account?.provider;
      const email =
        typeof profile?.email === "string"
          ? profile.email.trim().toLowerCase()
          : typeof (user as any)?.email === "string"
            ? String((user as any).email).trim().toLowerCase()
            : "";
      const name =
        typeof profile?.name === "string"
          ? profile.name.trim()
          : typeof (user as any)?.name === "string"
            ? String((user as any).name).trim()
            : "";

      if (!provider || !email) return;

      const ref = db.collection("users").doc(email);
      const existing = await ref.get();

      await ref.set(
        {
          email,
          name: name || null,
          provider,
          updatedAt: FieldValue.serverTimestamp(),
          ...(existing.exists
            ? {}
            : {
                createdAt: FieldValue.serverTimestamp(),
                role: "Farmer",
              }),
        },
        { merge: true }
      );
    },
  },
};
