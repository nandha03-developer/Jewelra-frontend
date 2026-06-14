'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f6]">
        <div className="w-10 h-10 border-4 border-[#751A20] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f6] p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-[#f0e8e0] text-center">
          <div className="w-20 h-20 bg-[#fff7f7] rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="solar:user-block-linear" className="text-4xl text-[#751A20]" />
          </div>
          <h1 className="text-2xl font-serif text-gray-900 mb-2">Not logged in</h1>
          <p className="text-gray-500 mb-8">Please sign in to view your profile and manage your account.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full py-4 bg-[#751A20] text-white rounded-full font-bold shadow-lg hover:bg-[#5b1419] transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f6] py-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#f0e8e0]">
          {/* Header/Cover */}
          <div className="h-32 bg-[#751A20]" />
          
          <div className="px-8 pb-10 -mt-16">
            <div className="relative">
              <img
                src={session.user?.image || 'https://ui-avatars.com/api/?name=' + session.user?.name}
                alt={session.user?.name || 'User'}
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
              />
              <div className="absolute bottom-2 left-24 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-sm"></div>
            </div>

            <div className="mt-6">
              <h1 className="text-3xl font-serif text-gray-900">{session.user?.name}</h1>
              <p className="text-[#751A20] font-medium flex items-center gap-2 mt-1">
                <Icon icon="solar:letter-linear" />
                {session.user?.email}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4">
              <div className="p-4 bg-[#fff7f7] rounded-2xl border border-[#f0e8e0] flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <Icon icon="solar:shield-check-linear" className="text-2xl text-[#751A20]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Account Type</p>
                  <p className="text-gray-900 font-medium">Google Verified</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4">
              <button
                onClick={() => router.push('/')}
                className="w-full py-4 border-2 border-[#f0e8e0] text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Icon icon="solar:home-2-linear" className="text-xl" />
                Return Home
              </button>
              
              <button
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <Icon icon="solar:logout-3-linear" className="text-xl" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
