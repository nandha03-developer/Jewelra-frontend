'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array based OTP state
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Timer for resending OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not send OTP');
      
      setStep('otp');
      setResendCooldown(60);
      toast.success('Verification code sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Could not send OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      toast.error('Please enter the full 6-digit verification code');
      return;
    }
    // We simply advance the UI. The server requires both OTP and Password in the same /verify request.
    setStep('reset');
    toast.success('Code entered. Please set your new password.');
  };

  const handleResetSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const otpString = otp.join('').trim();
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setSubmitting(true);
    try {
      // Trying all casing combinations due to strict/unconventional API naming requirements
      const payload = {
        email: emailTrimmed,
        Email: emailTrimmed,
        otp: otpString,
        OTP: otpString,
        password: passwordTrimmed,
        new_password: passwordTrimmed,
        newPassword: passwordTrimmed,
        confirm_password: confirm.trim(),
        confirmPassword: confirm.trim()
      };

      const response = await fetch('/api/auth/forgot-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Unable to reset password');

      toast.success('Success! Your password has been updated.');
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Unable to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        setResendCooldown(60);
        toast.success('New code sent to your email');
      }
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcf9f6] items-center justify-center p-4 lg:p-10 font-[inter]">
      <div className="w-full max-w-[1000px] flex min-h-[600px] rounded-[2rem] overflow-hidden bg-white shadow-[0_30px_70px_-15px_rgba(117,26,32,0.1)] border border-[#f0e8e0]">
        
        {/* Left Side: Dynamic Flow */}
        <div className="w-full lg:w-[55%] p-8 lg:p-16 flex flex-col justify-center">
          
          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="w-fit px-6 py-2 bg-[#751A20]/5 border border-[#751A20]/10 rounded-full">
                    <span className="text-[10px] font-bold text-[#751A20] uppercase tracking-widest">Account Recovery</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 tracking-tight">Forgot Password?</h1>
                  <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                    No worries! Enter your registered email address and we'll send you a secure link to reset your account.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-10 pt-4">
                  <div className="relative group">
                    <div className="w-fit px-3 py-1 bg-[#fff7f7] border border-[#f0e8e0] rounded-full mb-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block transition-colors group-focus-within:text-[#751A20]">Email Address</label>
                    </div>
                    <div className="relative">
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="yourname@example.com"
                        required
                        className="w-full bg-transparent py-3 text-[15px] text-gray-800 placeholder-gray-300 outline-none"
                      />
                      <div className="h-[1px] w-full bg-gray-200 group-focus-within:bg-[#751A20] group-focus-within:h-[2px] transition-all duration-300"></div>
                    </div>
                  </div>

                  <button
                    disabled={submitting}
                    type="submit"
                    className="group relative w-full h-14 bg-[#751A20] text-white rounded-2xl font-bold shadow-xl shadow-[#751A20]/20 hover:bg-[#5b1419] transition-all duration-300 flex items-center justify-center overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {submitting ? 'Authenticating...' : 'Send Reset Code'}
                      {!submitting && <Icon icon="solar:letter-linear" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />}
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="w-fit px-6 py-2 bg-gold/5 border border-gold/10 rounded-full">
                    <span className="text-[10px] font-bold text-[#b4912e] uppercase tracking-widest">Verification Status</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 tracking-tight">Check Mail</h1>
                  <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                    We've sent a 6-digit verification code to <span className="text-gray-900 font-semibold">{email}</span>. Please enter it below.
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-10 pt-4">
                  <div className="flex justify-between items-center gap-2 lg:gap-3 p-4 bg-gray-50/50 rounded-2xl border border-[#f0e8e0]">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val) {
                            const newOtp = [...otp];
                            newOtp[index] = val;
                            setOtp(newOtp);
                            if (index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otp[index] && index > 0) {
                            document.getElementById(`otp-${index - 1}`)?.focus();
                            const newOtp = [...otp];
                            newOtp[index-1] = '';
                            setOtp(newOtp);
                          }
                        }}
                        className="w-10 h-14 lg:w-12 lg:h-16 text-center text-2xl font-bold rounded-xl border border-gray-200 bg-white focus:border-[#751A20] focus:bg-[#fff7f7] focus:ring-0 outline-none transition-all duration-300 text-[#751A20] shadow-sm"
                      />
                    ))}
                  </div>

                  <div className="space-y-6">
                    <button
                      disabled={submitting}
                      type="submit"
                      className="group relative w-full h-14 bg-[#751A20] text-white rounded-2xl font-bold shadow-xl shadow-[#751A20]/20 hover:bg-[#5b1419] transition-all duration-300 flex items-center justify-center overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {submitting ? 'Preparing...' : 'Set New Password'}
                        {!submitting && <Icon icon="solar:shield-keyhole-linear" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />}
                      </span>
                    </button>

                    <p className="text-center text-sm text-gray-500">
                      Didn't receive the code?{' '}
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0 || submitting}
                        className={`font-bold transition-colors ${resendCooldown > 0 ? 'text-gray-300' : 'text-[#751A20] hover:text-[#5b1419]'}`}
                      >
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                      </button>
                    </p>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'reset' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="w-fit px-6 py-2 bg-green-50 border border-green-100 rounded-full">
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Authenticated Code</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 tracking-tight">Set New Password</h1>
                  <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                    IDENTITY CONFIRMED. Choose a strong, new password to protect your account.
                  </p>
                </div>

                <form onSubmit={handleResetSubmit} className="space-y-8 pt-4">
                  <div className="relative group">
                    <div className="w-fit px-3 py-1 bg-[#fff7f7] border border-[#f0e8e0] rounded-full mb-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block transition-colors group-focus-within:text-[#751A20]">New Password</label>
                    </div>
                    <div className="relative">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        className="w-full bg-transparent py-3 pr-10 text-[15px] text-gray-800 placeholder-gray-300 outline-none"
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
                  </div>

                  <div className="relative group">
                    <div className="w-fit px-3 py-1 bg-[#fff7f7] border border-[#f0e8e0] rounded-full mb-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block transition-colors group-focus-within:text-[#751A20]">Confirm Password</label>
                    </div>
                    <div className="relative">
                      <input
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        className="w-full bg-transparent py-3 pr-10 text-[15px] text-gray-800 placeholder-gray-300 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#751A20] transition-colors"
                      >
                        <Icon
                          icon={showConfirmPassword ? 'ant-design:eye-outlined' : 'ant-design:eye-invisible-outlined'}
                          className="w-5 h-5"
                        />
                      </button>
                      <div className="h-[1px] w-full bg-gray-200 group-focus-within:bg-[#751A20] group-focus-within:h-[2px] transition-all duration-300"></div>
                    </div>
                  </div>

                  <button
                    disabled={submitting}
                    type="submit"
                    className="group relative w-full h-14 bg-[#751A20] text-white rounded-2xl font-bold shadow-xl shadow-[#751A20]/20 hover:bg-[#5b1419] transition-all duration-300 flex items-center justify-center overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {submitting ? 'Resetting...' : 'Change Password'}
                      {!submitting && <Icon icon="solar:check-read-linear" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />}
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-center">
            <Link 
              href="/auth/login" 
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#751A20] font-bold transition-all group"
            >
              <Icon 
                icon="solar:alt-arrow-left-linear" 
                className="w-5 h-5 transition-transform group-hover:-translate-x-1" 
              />
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Right Side: Luxury Aesthetic */}
        <div className="hidden lg:block w-[45%] relative overflow-hidden">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://res.cloudinary.com/dtusyew0a/image/upload/v1775039623/forget_uqlsex.jpg"
            alt="Jewelra Security"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#751A20]/40 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/10" />
          
          <div className="absolute bottom-12 left-12 right-12 text-white space-y-4">
            <div className="w-12 h-[2px] bg-white/50" />
            <h3 className="text-2xl font-serif leading-tight">Elevating Secured Luxury</h3>
            <p className="text-white/70 text-sm font-light">Experience the future of fine jewelry with our enhanced security protocols.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
