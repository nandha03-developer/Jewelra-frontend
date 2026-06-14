'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

function SessionWatcher() {
  const { data: session } = useSession();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (session?.user && !user) {
      // Sync NextAuth session to AuthStore if store is empty
      setUser({
        name: session.user.name || '',
        email: session.user.email || '',
        avatar: session.user.image || '',
      });
    }
  }, [session, user, setUser]);

  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionWatcher />
      {children}
    </SessionProvider>
  );
}
