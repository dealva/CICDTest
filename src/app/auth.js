import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { verifyRecaptcha } from '@/contexts/recaptcha/server';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password, recaptchaToken } = credentials;
        const isValidCaptcha = await verifyRecaptcha(recaptchaToken, 'login');
        if (!isValidCaptcha) {
          throw new Error('reCAPTCHA verification failed');
        }
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) return null;

        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        console.log('User:', user);
        console.log('Is valid:', isValid);
        if (!isValid) return null;
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user=user
      }
      return token;
    },
    async session({ session, token, user }) {
        session.user=token.user
        return session;
    }
    
  },
  secret: process.env.NEXTAUTH_SECRET,
};
