'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf9f6] p-6 font-[inter]">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#f0e8e0] text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100">
          <Icon icon="solar:shield-warning-bold" className="text-4xl text-red-500" />
        </div>
        
        <h1 className="text-2xl font-serif text-gray-900 mb-2">Authentication Error</h1>
        <p className="text-gray-500 mb-8">Something went wrong during the sign-in process.</p>
        
        <div className="bg-[#fff7f7] rounded-2xl p-6 border border-red-50 mb-8 text-left">
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Error Code</p>
          <code className="text-sm font-mono text-gray-700 bg-white/50 px-2 py-1 rounded">
            {error || 'Unknown Error'}
          </code>
          {error === 'Configuration' && (
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              There is a problem with the server configuration. Check if your NEXTAUTH_SECRET and GOOGLE_CLIENT_ID are correct.
            </p>
          )}
          {error === 'AccessDenied' && (
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Access was denied. You might not have permission to log in.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/auth/login"
            className="w-full py-4 bg-[#751A20] text-white rounded-full font-bold shadow-lg hover:bg-[#5b1419] transition-all flex items-center justify-center gap-2"
          >
            <Icon icon="solar:refresh-linear" />
            Try Again
          </Link>
          
          <Link
            href="/"
            className="w-full py-4 border-2 border-[#f0e8e0] text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
