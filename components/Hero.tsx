'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Clock, ArrowRight, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onTrackOrder: () => void;
  headline?: string;
  subheadline?: string;
}

export default function Hero({
  onShopNow,
  onTrackOrder,
  headline = 'GET YOUR DIAMONDS FOR LESS!',
  subheadline = 'Official authorized Free Fire UID top-up with instant direct delivery in 30 seconds. No password or OTP required.',
}: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-white/5 cyber-grid">
      {/* Background radial glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#9d4edd]/20 via-[#7928ca]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-10 right-10 w-72 h-72 bg-[#e6ff00]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Promo Tag */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#181a29] border border-[#9d4edd]/40 px-3.5 py-1 text-xs mb-5 shadow-lg shadow-[#9d4edd]/10"
            >
              <span className="flex items-center gap-1 font-bold text-[#e6ff00]">
                <Flame className="h-3.5 w-3.5 text-[#e6ff00] fill-[#e6ff00]" />
                LIMITED FLASH EVENT
              </span>
              <span className="text-slate-500">·</span>
              <span className="font-semibold text-white">50% DISCOUNT APPLIED</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08] text-balance"
            >
              GET YOUR DIAMONDS <br />
              <span className="bg-gradient-to-r from-[#e6ff00] via-[#FAFF00] to-white bg-clip-text text-transparent">
                FOR LESS!
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed"
            >
              {subheadline}
            </motion.p>

            {/* Key benefits list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-6 flex flex-wrap gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-300"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#e6ff00]" />
                <span>100% Ban-Free Direct UID</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#e6ff00]" />
                <span>Zero Password or OTP Needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#e6ff00]" />
                <span>Razorpay UPI & Cards</span>
              </div>
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto"
            >
              <button
                onClick={onShopNow}
                className="group relative flex items-center justify-center gap-2.5 rounded-xl bg-[#e6ff00] px-7 py-3.5 text-sm font-extrabold text-black uppercase tracking-wider transition-all duration-200 hover:bg-[#d9f200] hover:shadow-xl hover:shadow-[#e6ff00]/30 active:scale-95"
              >
                <span>Shop Now · 50% Off</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onTrackOrder}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#141624] hover:bg-[#1a1d30] border border-white/15 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-colors"
              >
                <Clock className="h-4 w-4 text-[#9d4edd]" />
                <span>Track Order Live</span>
              </button>
            </motion.div>

            {/* Metrics Trust Strip */}
            <div className="mt-10 pt-6 border-t border-white/10 w-full grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#e6ff00] tabular-nums">30s</p>
                <p className="text-xs text-slate-400 mt-0.5">Average Credit Time</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white tabular-nums">500K+</p>
                <p className="text-xs text-slate-400 mt-0.5">Diamonds Delivered</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#9d4edd] tabular-nums">4.9 / 5</p>
                <p className="text-xs text-slate-400 mt-0.5">Player Rating</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Outer glowing border card */}
              <div className="relative rounded-2xl overflow-hidden p-1.5 bg-gradient-to-br from-[#9d4edd]/50 via-white/5 to-[#e6ff00]/40 shadow-2xl shadow-[#9d4edd]/20">
                <div className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden bg-[#0a0c14]">
                  <Image
                    src="/images/hero_gaming_diamonds_1794386328105.jpg"
                    alt="Free Fire Diamond Top-Up Battle Royale Cyber Arena"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle contrast scrim for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080e] via-[#07080e]/40 to-transparent" />

                  {/* Floating Badge Over Image */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-1.5 rounded-lg bg-black/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-[#e6ff00] border border-[#e6ff00]/40 shadow-lg">
                      <Sparkles className="h-3.5 w-3.5 text-[#e6ff00]" />
                      <span>DIRECT UID API</span>
                    </div>
                  </div>

                  {/* Bottom Glass Card Highlight */}
                  <div className="absolute bottom-4 inset-x-4 z-10 glass-panel rounded-xl p-3 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Featured Offer</p>
                        <p className="text-sm font-bold text-white">520 + 60 Bonus Diamonds</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs line-through text-slate-400 mr-2">₹800</span>
                        <span className="text-base font-extrabold text-[#e6ff00] tabular-nums">₹400</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Corner Glow */}
              <div className="absolute -bottom-4 -right-4 -z-10 w-32 h-32 bg-[#e6ff00]/20 rounded-full blur-2xl" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
