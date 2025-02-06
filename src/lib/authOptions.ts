import { NextAuthOptions, Session, User, DefaultSession } from 'next-auth'; 
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import connectToDatabase from '@/lib/db';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import UserModel from '@/models/User';

declare module 'next-auth' {
  interface Session {
    user: {
      _id: string;
      name?: string | null;
      email?: string | null;
      role?: string | null;
      /** We'll add "valid" so the client can see if they're valid. */
      valid?: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string | null; 
    /** Optionally add "valid" if you want to store it directly on the user object. */
    valid?: boolean;
  }
}

/** A helper for environment variables. */
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const googleClientId: string = getEnvVar('GOOGLE_CLIENT_ID');
const googleClientSecret: string = getEnvVar('GOOGLE_CLIENT_SECRET');
const nextAuthSecret: string = getEnvVar('NEXTAUTH_SECRET');

type UserType = {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  role?: string | null; 
  // Possibly you have isverified or other fields; add them here if needed.
  isverified?: boolean;
  save: () => Promise<UserType>;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: { scope: 'openid email profile' },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          console.error('Missing credentials');
          return null;
        }

        try {
          await connectToDatabase();

          // For demonstration, also check isverified: true
          const user = await UserModel.findOne({
            email: credentials.email,
            isverified: true,
          }).exec() as UserType | null;

          if (!user) {
            console.error('No user found or user not verified for:', credentials.email);
            return null;
          }

          const isPasswordValid = bcrypt.compareSync(credentials.password, user.password || '');
          if (!isPasswordValid) {
            console.error('Invalid password for user:', credentials.email);
            return null;
          }

          // Return the user object in the format NextAuth expects
          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
            role: user.role || null,
            // If you want to set 'valid' here based on role, do so:
            // valid: user.role !== 'Visiteur',
          };
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  callbacks: {
    /** 
     * The `jwt` callback is called when the token is first created (sign in),
     * and on subsequent requests **if** you return an updated token.
     */
    async jwt({ token, user }: { token: JWT; user?: User }) {
      /** If it's the initial sign-in, `user` will be defined. */
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // Decide how to set `valid`. Example logic:
        token.valid = user.role && user.role !== 'Visiteur';
      } 
      else {
        /** If `user` is NOT provided, it's a subsequent request. 
            We can load from DB if we need the role/valid to be up to date. */
        if (token.id && typeof token.id === 'string') {
          await connectToDatabase();
          try {
            const objectId = new mongoose.Types.ObjectId(token.id);
            const dbUser = await UserModel.findById(objectId).lean().exec();
            if (dbUser) {
              token.role = dbUser.role || null;
              // Example logic for `valid`:
              token.valid = dbUser.role && dbUser.role !== 'Visiteur';
            } else {
              console.error('User not found for ID:', token.id);
            }
          } catch (error) {
            console.error('Error fetching user by token.id:', error);
          }
        }
      }
      return token;
    },

    /**
     * The `session` callback makes token fields available via `session.user`.
     */
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        // Ensure we map the token fields onto the session user
        session.user._id = token.id as string;
        session.user.role = (token.role as string) || null;
        // Provide the boolean in the session so the client or other places can read it
        session.user.valid = Boolean(token.valid);
      }
      return session;
    },

    /**
     * The `signIn` callback runs **before** the `jwt` callback on sign in.
     * This is a good place to create or update your user in the DB if needed.
     */
    async signIn({ user }: { user: User }) {
      try {
        await connectToDatabase();
        const existingUser = await UserModel.findOne({ email: user.email }).exec() as UserType | null;

        if (!existingUser) {
          // Create new user if they don't exist
          const newUser = new UserModel({
            _id: new mongoose.Types.ObjectId(),
            username: user.name || '', 
            email: user.email,
            role: user.role,
          });
          const savedUser = await newUser.save();
          user.id = savedUser._id.toString();
          user.role = savedUser.role || null;
        } else {
          // Sync user object in NextAuth with existing DB user
          user.id = existingUser._id.toString();
          user.role = existingUser.role || null;
        }
        return true; 
      } catch (error) {
        console.error('Error during sign-in:', error);
        return false;
      }
    },

    /** 
     * The `redirect` callback is used to control where the user is directed after sign in / sign out. 
     */
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Keep default behavior: if the user is going to a relative path, allow it; otherwise use baseUrl.
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  secret: nextAuthSecret,
  debug: false,
};
