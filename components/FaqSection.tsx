'use client';

import React, { useState } from 'react';
import { FAQS } from '@/lib/data';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-[#0a0b12] relative cyber-grid">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-[#e6ff00] tracking-widest uppercase">
            Got Questions?
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Everything you need to know about Free Fire Diamond top-ups, UID safety, and Razorpay payments.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-white focus:outline-none hover:text-[#e6ff00] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#9d4edd]/20 text-[#e6ff00] text-xs font-black shrink-0">
                      Q
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                      isOpen ? 'rotate-180 text-[#e6ff00]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Safety Banner */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#17192c] to-[#0e101c] border border-[#e6ff00]/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6ff00] text-black shrink-0">
              <ShieldCheck className="h-6 w-6 text-black" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white uppercase">
                100% Security & Account Safety Guarantee
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                We strictly use official authorized Free Fire top-up APIs. We will never ask for your game password or OTP.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
