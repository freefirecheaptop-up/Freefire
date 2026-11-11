'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { DiamondPackage } from '@/lib/types';
import { Diamond, Zap, Flame, Shield, ArrowUpRight } from 'lucide-react';

interface DiamondCardsProps {
  packages: DiamondPackage[];
  onSelectAndBuy: (pkg: DiamondPackage) => void;
}

export default function DiamondCards({ packages, onSelectAndBuy }: DiamondCardsProps) {
  return (
    <section id="packages" className="py-16 sm:py-24 bg-[#0a0b12] relative border-t border-b border-white/5 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-bold text-[#e6ff00] tracking-widest uppercase">
              Official Authorized Packages
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Diamond Bundles & Special Offers
            </h2>
          </div>
          <div className="text-sm text-slate-300 max-w-md">
            Direct crediting to your Free Fire account via official UID gateway. No password required. Genuine 50% discount applied.
          </div>
        </div>

        {/* 6 Diamond Package Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {packages.map((pkg, idx) => {
            const is50Percent = pkg.discountPercent >= 50;

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className={`relative rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between ${
                  pkg.popular || pkg.bestValue
                    ? 'bg-[#111322] border-2 border-[#9d4edd]/50 hover:border-[#e6ff00] shadow-xl shadow-[#9d4edd]/10'
                    : 'bg-[#0f111d] border border-white/10 hover:border-white/20 hover:bg-[#131524]'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    is50Percent
                      ? 'bg-[#e6ff00] text-black shadow-md shadow-[#e6ff00]/20'
                      : 'bg-[#9d4edd] text-white shadow-md'
                  }`}>
                    {pkg.badge || `${pkg.discountPercent}% OFF`}
                  </span>

                  <span className="text-xs font-bold text-slate-400">
                    Direct UID
                  </span>
                </div>

                {/* Card Diamond Graphic & Diamond Count */}
                <div className="flex items-center gap-4 my-2">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-[#07080e] border border-white/10 p-1 shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/images/diamond_crystals_cluster_1794386327838.jpg"
                      alt={pkg.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-[#9d4edd]/10 mix-blend-overlay" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                      {pkg.name}
                    </h3>
                    {pkg.bonusDiamonds > 0 ? (
                      <p className="text-xs font-bold text-[#e6ff00] mt-0.5 flex items-center gap-1">
                        <Zap className="h-3 w-3 fill-[#e6ff00]" />
                        <span>+{pkg.bonusDiamonds} Free Bonus Drop</span>
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 mt-0.5">Instant delivery</p>
                    )}
                  </div>
                </div>

                {/* Package description */}
                <p className="text-xs text-slate-400 my-4 line-clamp-2 leading-relaxed">
                  {pkg.description || `Fast Free Fire top-up of ${pkg.diamonds} diamonds directly to your UID.`}
                </p>

                {/* Price and CTA Row */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs line-through text-slate-400 tabular-nums">
                        ₹{pkg.originalPrice}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.2 rounded">
                        SAVE {pkg.discountPercent}%
                      </span>
                    </div>
                    <p className="text-2xl font-black text-white tabular-nums tracking-tight mt-0.5">
                      ₹{pkg.discountedPrice}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectAndBuy(pkg)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#e6ff00] hover:bg-[#d9f200] px-4 py-2.5 text-xs font-extrabold text-black uppercase tracking-wider transition-all duration-200 group-hover:shadow-lg group-hover:shadow-[#e6ff00]/25 active:scale-95"
                  >
                    <span>Buy Now</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
