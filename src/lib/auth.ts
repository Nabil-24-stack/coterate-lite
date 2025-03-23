import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// In a real application, you would use a database to store users
// This is a simple in-memory implementation for demonstration purposes
const users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'user@example.com',
    password: 'password123',
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user with matching email and password
        const user = users.find(
          (user) => 
            user.email === credentials.email && 
            user.password === credentials.password
        );

        if (!user) {
          return null;
        }

        // Return user without password
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
};

// Add this to your next-auth.d.ts file or create it if it doesn't exist
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}