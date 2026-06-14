'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Icon } from '@iconify/react';

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      ) : (
        <Icon icon="logos:google-icon" className="text-xl group-hover:scale-110 transition-transform" />
      )}
      <span className="text-gray-700 font-medium">
        {isLoading ? 'Connecting...' : 'Continue with Google'}
      </span>
    </button>
  );
}
