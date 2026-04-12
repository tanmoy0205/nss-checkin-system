import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    ...(process.env.EMAIL_SERVER && process.env.EMAIL_FROM
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
          }),
        ]
      : []),
    Credentials({
      name: "NSS Portal Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password || !supabaseAdmin) return null;
        
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (!user || user.password !== password) return null;
        return { id: user.id, name: user.name ?? "", email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("SignIn Attempt:", { email: user.email, provider: account?.provider });
      if (!supabaseAdmin || !user.email) {
        console.error("SignIn Failed: Missing supabaseAdmin or user email");
        return false;
      }
      
      try {
        // Check if user exists in our 'users' table
        const { data: existingUser, error: fetchError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error("Error fetching user:", fetchError);
          return false;
        }

        // If user is an ADMIN, block Google login
        if (existingUser?.role === 'ADMIN' && account?.provider === 'google') {
          console.warn("Admin attempted Google login - Blocked");
          return false;
        }

        if (!existingUser) {
          console.log("Creating new user for first-time Google sign-in");
          // Create user if they don't exist (first-time Google sign-in)
          const { data: newUser, error: insertError } = await supabaseAdmin.from('users').insert({
            email: user.email,
            name: user.name || "NSS Volunteer",
            profile_picture: user.image,
            role: 'VOLUNTEER',
            provider: account?.provider || 'google',
          }).select().single();

          if (insertError) {
            console.error("Error creating user during Google sign-in:", insertError);
            return false;
          }
          
          // Map user id for the session
          if (newUser) {
            user.id = newUser.id;
            (user as any).role = newUser.role;
          }
        } else {
          console.log("Existing user signed in via Google:", existingUser.email);
          // Sync profile picture if it changed
          if (user.image && existingUser.profile_picture !== user.image) {
            await supabaseAdmin.from('users').update({
              profile_picture: user.image,
              name: user.name || existingUser.name,
            }).eq('id', existingUser.id);
          }
          
          // Map existing user data for the session
          user.id = existingUser.id;
          (user as any).role = existingUser.role;
        }
        return true;
      } catch (error) {
        console.error("SignIn Callback Fatal Error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days - stay logged in for a month
    updateAge: 24 * 60 * 60, // 24 hours - update session every day
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.AUTH_SECRET || "development-secret-key",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
