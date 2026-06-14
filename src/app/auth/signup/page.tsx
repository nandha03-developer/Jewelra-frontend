'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';


export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('customer');
  const [submitting, setSubmitting] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/signup/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Sign up failed');
      localStorage.setItem('jewelra_pending', JSON.stringify({ name, email, role }));
      toast.success('OTP sent to your email');
      router.push('/auth/otp');
    } catch (error) {
      toast.error('Unable to send OTP');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcf9f6] items-center justify-center p-4 lg:p-10 font-[inter]">
      <div className="w-full max-w-[1000px] flex min-h-[650px] rounded-3xl overflow-hidden bg-white shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] border border-[#f0e8e0]">
        {/* Left Side: Elegant Image */}
        <div className="hidden lg:block w-[45%] relative">
          <img
            src="https://res.cloudinary.com/dtusyew0a/image/upload/v1775035376/signup_qisrr0.png"
            alt="Jewelra Signup"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-[#751A20]/10" />
        </div>

        <div className="w-full lg:w-[55%] p-10 lg:p-14 flex flex-col justify-center">
          <div className="mb-8 w-fit px-8 py-6 bg-[#fff7f7] border border-[#f0e8e0] rounded-[2rem]">
            <h1 className="text-3xl font-serif text-gray-900 mb-2 text-center">Create Account</h1>
            <p className="text-gray-500 text-sm">Welcome! Let's get you set up with a Jewelra account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="relative group">
                <div className="w-fit px-3 py-1 bg-[#fff7f7] border border-[#f0e8e0] rounded-full mb-3">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block transition-colors group-focus-within:text-[#751A20]">Full Name</label>
                </div>
                <div className="relative">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-transparent py-2 text-[14px] text-gray-800 placeholder-gray-200 outline-none"
                  />
                  <div className="h-[1px] w-full bg-gray-200 group-focus-within:bg-[#751A20] group-focus-within:h-[2px] transition-all duration-300"></div>
                </div>
              </div>
              <div className="relative group">
                <div className="w-fit px-3 py-1 bg-[#fff7f7] border border-[#f0e8e0] rounded-full mb-3">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block transition-colors group-focus-within:text-[#751A20]">Email Address</label>
                </div>
                <div className="relative">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="email@example.com"
                    required
                    className="w-full bg-transparent py-2 text-[14px] text-gray-800 placeholder-gray-200 outline-none"
                  />
                  <div className="h-[1px] w-full bg-gray-200 group-focus-within:bg-[#751A20] group-focus-within:h-[2px] transition-all duration-300"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="relative group">
                <div className="w-fit px-3 py-1 bg-[#fff7f7] border border-[#f0e8e0] rounded-full mb-3">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block transition-colors group-focus-within:text-[#751A20]">Password</label>
                </div>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    className="w-full bg-transparent py-2 pr-10 text-[14px] text-gray-800 placeholder-gray-200 outline-none"
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
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block transition-colors group-focus-within:text-[#751A20]">Confirm</label>
                </div>
                <div className="relative">
                  <input
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    className="w-full bg-transparent py-2 pr-10 text-[14px] text-gray-800 placeholder-gray-200 outline-none"
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
            </div>

            <div className="relative group" ref={dropdownRef}>
              <div className="w-fit px-3 py-1 bg-[#fff7f7] border border-[#f0e8e0] rounded-full mb-3">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block transition-colors group-focus-within:text-[#751A20]">Role</label>
              </div>
              <div
                className="relative cursor-pointer"
                onClick={() => setIsRoleOpen(!isRoleOpen)}
              >
                <div className="w-full bg-transparent py-2 text-[14px] text-gray-800 flex items-center justify-between">
                  <span className="capitalize">{role}</span>
                  <Icon
                    icon="solar:alt-arrow-down-linear"
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isRoleOpen ? 'rotate-180' : ''}`}
                  />
                </div>
                <div className={`h-[1px] w-full transition-all duration-300 ${isRoleOpen ? 'bg-[#751A20] h-[2px]' : 'bg-gray-200'}`}></div>

                <AnimatePresence>
                  {isRoleOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-[#f0e8e0] overflow-hidden z-50 p-1.5"
                    >
                      {[
                        { label: 'customer', icon: 'solar:user-circle-linear' },
                        { label: 'Admin', icon: 'solar:shield-bold-duotone' }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRole(item.label);
                            setIsRoleOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between group/opt ${role === item.label ? 'bg-[#fff7f7] text-[#751A20] font-semibold' : 'text-gray-600 hover:bg-[#fcf9f6] hover:text-gray-900'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              icon={item.icon}
                              className={`w-5 h-5 transition-colors ${role === item.label ? 'text-[#751A20]' : 'text-gray-400 group-hover/opt:text-gray-600'}`}
                            />
                            <span className="capitalize">{item.label}</span>
                          </div>
                          {role === item.label && <Icon icon="solar:check-read-linear" className="w-4 h-4" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              disabled={submitting}
              type="submit"
              className="group relative w-full h-14 bg-[#751A20] text-white rounded-full font-bold shadow-lg shadow-[#751A20]/20 hover:bg-[#5b1419] transition-all duration-300 flex items-center justify-center overflow-hidden uppercase tracking-widest text-sm mt-4"
            >
              <span className="relative z-10 flex items-center gap-2">
                {submitting ? 'Creating...' : 'Sign Up'}
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




          <p className="mt-10 text-center text-sm text-gray-400 font-medium tracking-tight">
            Already have an account? <a href="/auth/login" className="text-[#751A20] font-bold border-b  border-[#751A20]  ml-1 hover:text-[#5b1419] hover:border-[#5b1419] transition-all">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
