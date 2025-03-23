import { NextAuthOptions } from 'next-auth';
import FigmaProvider from 'next-auth/providers/figma';

export const authOptions: NextAuthOptions = {
  providers: [
    FigmaProvider({
      clientId: process.env.NEXT_PUBLIC_FIGMA_CLIENT_ID!,
      clientSecret: process.env.FIGMA_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account }) {
      // Initial sign in
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      
      // Check if token has expired
      const now = Math.floor(Date.now() / 1000);
      if (token.expiresAt && now > token.expiresAt) {
        // Token has expired, you would implement refresh logic here
        // For the scope of this MVP, we'll just let the user re-authenticate
        return token;
      }
      
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

// Add this to your next-auth.d.ts file or create it if it doesn't exist
// to extend the session type with our custom properties
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}