'use client';

import React from 'react';
import Image from 'next/image';
import { TESTIMONIALS } from '@/lib/data';
import { Star, ShieldCheck, CheckCircle2, Diamond } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-20 bg-[#07080e] relative border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold text-[#e6ff00] tracking-widest uppercase">
            Community Trust
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Player Reviews & Testimonials
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Over 50,000+ Free Fire tournament players and guild leaders trust DIAMOND X STORE for instant, ban-free top-ups.
          </p>
        </div>

        {/* Testimonials 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-[#9d4edd]/40 transition-colors"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#e6ff00] text-[#e6ff00]" />
                  ))}
                  <span className="text-[11px] text-slate-400 ml-1.5 font-bold">5.0</span>
                </div>

                {/* Comment quote */}
                <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              {/* Player details footer */}
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{t.playerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      UID: {t.uidMasked} · {t.server}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#e6ff00] bg-[#e6ff00]/10 px-1.5 py-0.5 rounded border border-[#e6ff00]/25">
                    {t.packagePurchased}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Strip */}
        <div className="mt-12 rounded-2xl bg-[#0e101c] border border-white/10 p-5 flex flex-wrap items-center justify-around gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#e6ff00]" />
            <span>100% Authorized Garena UID Direct</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#e6ff00]" />
            <span>Zero Account Risk / Ban-Free Guarantee</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#e6ff00]" />
            <span>Encrypted Razorpay UPI Gateway</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#e6ff00]" />
            <span>24/7 Dedicated WhatsApp Support</span>
          </div>
        </div>

      </div>
    </section>
  );
}
