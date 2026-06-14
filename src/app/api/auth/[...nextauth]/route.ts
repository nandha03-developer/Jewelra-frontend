import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
// console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Exists' : 'MISSING');

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // console.log('SignIn Callback Triggered');
      if (account?.provider === 'google') {
        try {
          await connectDB();
          const { name, email, image } = user;

          await User.findOneAndUpdate(
            { email },
            { name, email, image },
            { upsert: true, new: true }
          );

          // console.log('User synced with DB');
          return true;
        } catch (dbError) {
          console.error('Database Sync Error:', dbError);
          // Return true even if DB fails to see if we can at least log in
          return true;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export { handler as GET, handler as POST };
