'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export default function OtpPage() {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<{ name: string; email: string; role: string } | null>(null);
  const router = useRouter();
  const { setUser, setToken, setRefreshToken, setIsNewUser } = useAuthStore();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('jewelra_pending');
    if (saved) {
      setPending(JSON.parse(saved));
    } else {
      router.push('/auth/signup');
    }
  }, [router]);

  const handleDigitChange = (digit: string, index: number) => {
    if (digit.length > 1) {
      // Handle paste
      const pastedDigits = digit.split('').slice(0, 6);
      const newDigits = [...otpDigits];
      pastedDigits.forEach((d, i) => {
        if (index + i < 6) newDigits[index + i] = d;
      });
      setOtpDigits(newDigits);
      // Focus the last filled box
      const nextIndex = Math.min(index + pastedDigits.length - 1, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-focus move forward
    if (digit !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const finalOtp = otpDigits.join('');
    if (finalOtp.length < 6) {
      toast.error('Please enter all 6 digits');
      return;
    }
    
    if (!pending) return;
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pending.email, otp: finalOtp })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'OTP verification failed');
      
      const userData = { 
        _id: data.user?._id || data.user?.id,
        id: data.user?.id || data.user?._id,
        name: pending.name, 
        email: pending.email, 
        avatar: data.user?.avatar || data.user?.image || data.user?.profileImage // Handle different field names
      };
      setUser(userData);
      setToken(data.token);
      setIsNewUser(true); // First-time signup
      if (data.refreshToken) setRefreshToken(data.refreshToken); // Add this
      
      localStorage.removeItem('jewelra_pending');
      localStorage.setItem('jewelra_token', data.token);
      if (data.refreshToken) localStorage.setItem('jewelra_refresh', data.refreshToken);
      localStorage.setItem('jewelra_user', JSON.stringify(userData));
      localStorage.setItem('jewelra_new_user', 'true');
      toast.success('OTP verified, welcome!');
      router.push('/profile');
    } catch (error) {
      toast.error('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#fafafa] px-4 py-14 md:px-8 lg:px-16">
      <div className="w-full max-w-[500px] rounded-[2.5rem] bg-white p-12 shadow-xl shadow-black/[0.03] border border-[#f0e8e0]">
        <p className="text-xs uppercase tracking-[0.3em] text-muted text-center font-bold">Verification Code</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 text-center">Verify Your Account</h1>
        <p className="mt-4 text-muted text-center text-sm">
          Please enter the 6-digit code sent to <br/>
          <span className="font-bold text-[#751A20]">{pending?.email}</span>
        </p>
        
        <form onSubmit={handleSubmit} className="mt-12 flex flex-col items-center">
          <div className="flex gap-3 mb-10 w-full justify-between">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={6} // Allowing one box to take more during paste
                value={digit}
                onChange={(e) => handleDigitChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-16 text-center text-2xl font-bold border-2 border-[#f0e8e0] rounded-2xl focus:border-[#751A20] focus:ring-4 focus:ring-[#751A20]/5 outline-none transition-all bg-[#faf9f8]"
              />
            ))}
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full md:w-auto px-10 h-14 rounded-2xl bg-[#751A20] text-sm font-bold text-white transition-all hover:bg-[#5b1419] shadow-lg shadow-[#751A20]/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Successfully'}
          </button>
          
          <p className="mt-8 text-xs text-muted text-center">
            Didn't receive the code? <button type="button" className="text-[#751A20] font-bold underline hover:no-underline">Resend OTP</button>
          </p>
        </form>
      </div>
    </div>
  );
}
