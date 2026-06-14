'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '@iconify/react';
import { useAuthStore } from '@/store/authStore';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { setUser, setToken, setRefreshToken, setIsNewUser } = useAuthStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Login failed');

      const userData = {
        _id: data.user?._id || data.user?.id,
        id: data.user?.id || data.user?._id,
        name: data.user?.name || 'Member',
        email,
        phone: data.user?.phone,
        avatar: data.user?.avatar || data.user?.image || data.user?.profileImage // Handle different field names from backend
      };

      setUser(userData);
      setToken(data.token);
      setIsNewUser(false); // Existing user login
      if (data.refreshToken) setRefreshToken(data.refreshToken); // Store refresh token

      localStorage.setItem('jewelra_token', data.token);
      if (data.refreshToken) localStorage.setItem('jewelra_refresh', data.refreshToken);
      localStorage.setItem('jewelra_user', JSON.stringify(userData));
      localStorage.setItem('jewelra_new_user', 'false');
      toast.success('Welcome back to Jewelra');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed, please try again');
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="flex min-h-screen bg-[#fcf9f6] items-center justify-center p-4 lg:p-10 font-[inter]">
      <div className="w-full max-w-[1000px] flex min-h-[600px] rounded-xl overflow-hidden bg-white shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] border border-[#f0e8e0]">
        {/* Left Side: Elegant Image */}
        <div className="hidden lg:block w-[45%] relative">
          <img
            src="https://res.cloudinary.com/dtusyew0a/image/upload/v1775037525/login_2_zjtwhd.png"
            alt="Jewelra Login"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-[#751A20]/10" />
        </div>

        {/* Right Side: Minimalist Form */}
        <div className="w-full lg:w-[55%] p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-12 w-fit px-8 py-6 bg-[#fff7f7] border border-[#f0e8e0] rounded-[2rem]">
            <h1 className="text-3xl font-serif  text-gray-900 mb-2 text-center">Welcome back!</h1>
            <p className="text-gray-500 text-sm">Please enter your details to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10" suppressHydrationWarning>
            <div className="relative group">
              <div className="w-fit px-3 py-1 bg-[#fff7f7] border border-[#f0e8e0] rounded-full mb-3">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block transition-colors group-focus-within:text-gray-900">Email Address</label>
              </div>
              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="email@example.com"
                  required
                  className="w-full bg-transparent py-2 text-[15px] text-gray-800 placeholder-gray-200 outline-none"
                  suppressHydrationWarning
                />
                <div className="h-[1px] w-full bg-gray-200 group-focus-within:bg-[#751A20] group-focus-within:h-[2px] transition-all duration-300"></div>
              </div>
            </div>

            <div className="relative group">
              <div className="mb-3">
                <div className="w-fit px-3 py-1 bg-[#fff7f7] border border-[#f0e8e0] rounded-full">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block transition-colors group-focus-within:text-[#751A20]">Password</label>
                </div>
              </div>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent py-2 pr-10 text-[15px] text-gray-800 placeholder-gray-200 outline-none"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#751A20] transition-colors"
                >
                  <Icon
                    icon={showPassword ? 'ant-design:eye-outlined' : 'ant-design:eye-invisible-outlined'}
                    className="w-5 h-5"
                  />
                </button>
                <div className="h-[1px] w-full bg-gray-200 group-focus-within:bg-[#751A20] group-focus-within:h-[2px] transition-all duration-300"></div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <label className="flex items-center gap-2 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-gray-200 rounded-md bg-transparent transition-all peer-checked:bg-[#751A20] peer-checked:border-[#751A20]"></div>
                    <Icon
                      icon="solar:check-read-linear"
                      className="absolute w-3 h-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                    />
                  </div>
                  <span className="text-[12px] font-medium text-gray-500 group-hover/check:text-gray-800 transition-colors">Remember me</span>
                </label>

                <a href="/auth/forgot-password" className="text-[12px] font-medium text-gray-400 hover:text-[#751A20] transition-colors border-b border-transparent hover:border-[#751A20] pb-0.5">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              disabled={submitting}
              type="submit"
              className="group relative w-full h-14 bg-[#751A20] text-white rounded-full font-bold shadow-lg shadow-[#751A20]/20 hover:bg-[#5b1419] transition-all duration-300 flex items-center justify-center overflow-hidden"
              suppressHydrationWarning
            >
              <span className="relative z-10 flex items-center gap-2">
                {submitting ? 'Authenticating...' : 'Sign In'}
                {!submitting && (
                  <Icon
                    icon="solar:alt-arrow-right-linear"
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-gray-100"></div>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Or login with</span>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>

          <div className="mt-8">
            <GoogleLoginButton />
          </div>

          <p className="mt-10 text-center text-sm text-gray-400 font-medium tracking-tight">
            Don't have an account? <a href="/auth/signup" className="text-[#751A20] font-bold border-b border-[#751A20] ml-1 hover:text-[#5b1419] hover:border-[#5b1419] transition-all">Create Account</a>
          </p>

        </div>
      </div>
    </div>
  );
}
