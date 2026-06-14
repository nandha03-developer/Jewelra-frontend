'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function GoldSchemePage() {
  const [amount, setAmount] = useState('5000');

  const benefits = [
    { title: 'Zero Making Charges', description: 'Enjoy 100% discount on making charges for up to 18% of the product value.', icon: 'solar:dollar-minimalistic-linear' },
    { title: 'Trusted Purity', description: 'Accumulate gold weight based on every monthly installment with 100% hallmarked quality.', icon: 'solar:verified-check-linear' },
    { title: 'Flexible Tenures', description: 'Choose between 11-month or 18-month plans tailored to your future milestones.', icon: 'solar:calendar-minimalistic-linear' },
    { title: 'Bonus Month', description: 'Jewelra contributes your final month’s installment as a premium loyalty bonus.', icon: 'solar:gift-linear' },
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f6] font-[inter]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#751A20] via-[#5b1419] to-[#3a0b0f] text-white py-32 px-4 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Gold Elements */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
           <Icon icon="solar:crown-bold" className="w-[80%] h-auto text-white rotate-12" />
        </div>

        <div className="max-w-[1200px] mx-auto text-center relative z-10 space-y-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4 font-bold uppercase tracking-widest text-xs">
            <Icon icon="solar:alt-arrow-left-linear" width="18" />
            Back to Home
          </Link>
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-5xl lg:text-7xl font-serif leading-tight">Elite Gold Savings</h1>
            <p className="text-white/60 text-xl leading-relaxed font-light">
              Transform your monthly savings into timeless treasures with Jewelra’s signature gold investment programs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            <button className="px-10 py-5 bg-[#d4af37] text-white font-bold rounded-2xl shadow-2xl shadow-yellow-900/30 hover:scale-105 hover:bg-[#b8962d] transition-all">
              Enroll Now
            </button>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              Calculate Benefits
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-24 mb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {benefits.map((benefit, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all space-y-6 group">
                <div className="w-16 h-16 bg-[#751A20]/5 text-[#751A20] rounded-[1.5rem] flex items-center justify-center transition-colors group-hover:bg-[#751A20] group-hover:text-white">
                  <Icon icon={benefit.icon} width="32" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{benefit.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{benefit.description}</p>
              </div>
           ))}
        </div>

        {/* Enrollment Card */}
        <div className="mt-32 bg-white rounded-[3rem] p-8 lg:p-20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col lg:flex-row gap-16 items-center">
           <div className="lg:w-1/2 space-y-8">
              <div className="bg-yellow-50 px-5 py-2 w-fit rounded-full text-[#b8962d] text-[10px] font-bold uppercase tracking-widest border border-yellow-100">
                Premium Jewelra Scheme
              </div>
              <h2 className="text-4xl font-serif text-gray-900 leading-tight">Start Small, <br/> Celebrate Big.</h2>
              <p className="text-gray-500 leading-relaxed text-lg">
                Our flagship "Easy Buy Gold" plan allows you to start your savings with as little as ₹1,000 per month. Perfect for weddings, anniversaries, or an elegant gift for yourself.
              </p>
              <div className="space-y-4 pt-4 text-sm font-bold text-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                    <Icon icon="solar:check-read-linear" width="14" />
                  </div>
                  Simple Online Processing
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                    <Icon icon="solar:check-read-linear" width="14" />
                  </div>
                  Instant Enrollment
                </div>
              </div>
           </div>

           <div className="lg:w-1/2 w-full bg-[#fcf9f6] p-10 rounded-[2.5rem] border border-gray-100 space-y-8">
              <h4 className="text-2xl font-serif text-gray-900">Instant Enrollment</h4>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 block">Monthly Contribution (₹)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full h-14 bg-white border border-gray-200 rounded-xl px-6 text-xl font-bold text-[#751A20] outline-none focus:border-[#751A20] transition-colors"
                    />
                 </div>
                 <div className="flex items-center gap-4 p-4 bg-[#751A20]/5 rounded-xl border border-[#751A20]/10">
                    <Icon icon="solar:graph-up-linear" className="text-[#751A20]" width="24" />
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold uppercase leading-none mb-1">Maturity Value after 11 Months</p>
                      <p className="text-lg font-bold text-gray-900 leading-none">₹ {parseInt(amount || '0') * 11 + parseInt(amount || '0')}</p>
                    </div>
                 </div>
                 <button className="w-full py-5 bg-[#751A20] text-white font-bold rounded-2xl shadow-xl shadow-[#751A20]/20 hover:bg-[#5b1419] transition-all">
                   Join the Scheme
                 </button>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
