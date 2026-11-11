'use client';

import React, { useState, useId } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { DiamondPackage, ServerRegion } from '@/lib/types';
import { SERVER_REGIONS } from '@/lib/data';
import { 
  Diamond, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  AlertCircle,
  UserCheck
} from 'lucide-react';

interface TopUpSectionProps {
  packages: DiamondPackage[];
  selectedPackageId: string;
  onSelectPackage: (pkg: DiamondPackage) => void;
  onProceedToCheckout: (payload: {
    playerUid: string;
    serverRegion: string;
    playerNickname: string;
    packageId: string;
    couponCode: string;
  }) => void;
}

export default function TopUpSection({
  packages,
  selectedPackageId,
  onSelectPackage,
  onProceedToCheckout,
}: TopUpSectionProps) {
  const [playerUid, setPlayerUid] = useState('');
  const [serverRegion, setServerRegion] = useState('India (IND)');
  const [couponCode, setCouponCode] = useState('DXS50');
  const [appliedCoupon, setAppliedCoupon] = useState('DXS50');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('50% promo code applied! Save extra on eligible orders.');
  const [uidError, setUidError] = useState('');
  const [showUidGuide, setShowUidGuide] = useState(false);
  const uidInputId = useId();
  const regionSelectId = useId();
  const couponInputId = useId();

  const selectedPkg = packages.find(p => p.id === selectedPackageId) || packages[2] || packages[0];

  // Simulated player nickname check based on UID
  const getPlayerNickname = (uid: string) => {
    if (!uid || uid.length < 8) return null;
    const names = ['⚡ VORTEX_PRO', '🔥 KRAIT_HUNTER', '👑 AURA_SNIPER', '⚡ TIGER_PRO', 'PHOENIX_FF'];
    const idx = parseInt(uid.slice(-1), 10) % names.length;
    return names[idx];
  };

  const detectedNickname = getPlayerNickname(playerUid);

  // Calculate pricing breakdown
  const basePrice = selectedPkg?.originalPrice || 0;
  const bundleDiscount = basePrice - (selectedPkg?.discountedPrice || 0);
  const subtotal = selectedPkg?.discountedPrice || 0;

  // Coupon calculation
  let couponDiscount = 0;
  if (appliedCoupon === 'DXS50') {
    couponDiscount = Math.round(subtotal * 0.5);
    if (couponDiscount > 500) couponDiscount = 500;
  } else if (appliedCoupon === 'BOOYAH10') {
    couponDiscount = Math.round(subtotal * 0.1);
  } else if (appliedCoupon === 'FIRE50') {
    couponDiscount = Math.min(50, subtotal);
  } else if (appliedCoupon === 'FREEFIRE20') {
    couponDiscount = Math.round(subtotal * 0.2);
  }

  const finalAmount = Math.max(1, subtotal - couponDiscount);

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setAppliedCoupon('');
      return;
    }
    if (['DXS50', 'BOOYAH10', 'FIRE50', 'FREEFIRE20'].includes(code)) {
      setAppliedCoupon(code);
      setCouponSuccess(`Coupon code "${code}" applied successfully!`);
    } else {
      setCouponError('Invalid promo code. Try "DXS50" for 50% off or "BOOYAH10" for 10% off.');
      setAppliedCoupon('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUidError('');

    const cleanUid = playerUid.trim();
    if (!cleanUid) {
      setUidError('Please enter your Free Fire Player UID.');
      return;
    }
    if (!/^\d+$/.test(cleanUid) || cleanUid.length < 8 || cleanUid.length > 12) {
      setUidError('Valid Free Fire UID must be between 8 and 12 digits (numbers only).');
      return;
    }

    onProceedToCheckout({
      playerUid: cleanUid,
      serverRegion,
      playerNickname: detectedNickname || `Player_${cleanUid.slice(-4)}`,
      packageId: selectedPkg.id,
      couponCode: appliedCoupon,
    });
  };

  return (
    <section id="topup" className="py-14 sm:py-20 relative bg-[#07080e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold text-[#e6ff00] tracking-widest uppercase">
            Fast · Authorized · Direct
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Instant Diamond Top-Up
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Select your package, enter your Free Fire Player UID, and receive diamonds directly in your game account.
          </p>
        </div>

        {/* Top-Up Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main 2-Column Form on Left */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Step 1: Player Identification */}
            <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e6ff00] text-black font-extrabold text-sm">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide uppercase">
                    Enter Free Fire Player Details
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUidGuide(!showUidGuide)}
                  className="text-xs text-[#9d4edd] hover:text-[#c084fc] flex items-center gap-1 font-medium transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Where is my UID?</span>
                </button>
              </div>

              {/* UID Guide Modal Callout */}
              {showUidGuide && (
                <div className="mb-5 rounded-xl bg-[#141626] border border-[#9d4edd]/30 p-4 text-xs text-slate-300 animate-in fade-in duration-200">
                  <p className="font-semibold text-white mb-1.5 flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="h-4 w-4 text-[#e6ff00]" />
                    How to find your Free Fire UID:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 ml-1">
                    <li>Launch Garena Free Fire on your device.</li>
                    <li>Tap your profile avatar/banner in the top-left corner of the lobby.</li>
                    <li>Your 8–10 digit Player UID is shown under your nickname.</li>
                    <li>Tap the copy button next to your UID and paste it below.</li>
                  </ol>
                  <p className="mt-2 text-[11px] text-[#e6ff00] font-medium">
                    ⚠️ We will NEVER ask for your game password or OTP. UID is completely safe.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* UID Input */}
                <div>
                  <label htmlFor={uidInputId} className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Player UID Number <span className="text-[#e6ff00]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id={uidInputId}
                      type="text"
                      maxLength={12}
                      placeholder="e.g. 2847193021"
                      value={playerUid}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setPlayerUid(val);
                        if (uidError) setUidError('');
                      }}
                      className="w-full rounded-xl bg-[#090b14] border border-white/15 px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:border-[#e6ff00] focus:ring-1 focus:ring-[#e6ff00] focus:outline-none transition-all tabular-nums"
                    />
                    {playerUid.length >= 8 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-bold text-[#e6ff00] bg-[#e6ff00]/10 px-2 py-0.5 rounded">
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Valid</span>
                      </div>
                    )}
                  </div>
                  {uidError ? (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {uidError}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Numeric 8-12 digits. Double-check before submitting.
                    </p>
                  )}
                </div>

                {/* Region Selector */}
                <div>
                  <label htmlFor={regionSelectId} className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Server / Region <span className="text-[#e6ff00]">*</span>
                  </label>
                  <select
                    id={regionSelectId}
                    value={serverRegion}
                    onChange={(e) => setServerRegion(e.target.value)}
                    className="w-full rounded-xl bg-[#090b14] border border-white/15 px-4 py-3 text-sm font-semibold text-white focus:border-[#e6ff00] focus:ring-1 focus:ring-[#e6ff00] focus:outline-none transition-all"
                  >
                    {SERVER_REGIONS.map((reg) => (
                      <option key={reg.id} value={reg.name} className="bg-[#0f111d] text-white">
                        {reg.flag} {reg.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Diamonds will be credited to this server region.
                  </p>
                </div>
              </div>

              {/* Verified Nickname Banner */}
              {detectedNickname && (
                <div className="mt-4 rounded-xl bg-[#141624] border border-[#9d4edd]/40 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg overflow-hidden relative bg-[#9d4edd]/20 border border-[#9d4edd]/40">
                      <Image
                        src="/images/customer_avatar_gamer_1794386328745.jpg"
                        alt="Player Avatar"
                        fill
                        className="object-cover"
                        sizes="36px"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Detected Player Profile
                      </p>
                      <p className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{detectedNickname}</span>
                        <span className="text-[10px] text-[#e6ff00] bg-[#e6ff00]/15 px-1.5 py-0.2 rounded font-mono">
                          UID: {playerUid}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Verified</span>
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Diamond Package Selection */}
            <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e6ff00] text-black font-extrabold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide uppercase">
                      Select Diamond Package
                    </h3>
                    <p className="text-xs text-slate-400">
                      All packages feature official authorized direct UID top-up with bonus drops.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#e6ff00] bg-[#e6ff00]/10 px-2.5 py-1 rounded-md border border-[#e6ff00]/30 hidden sm:inline-block">
                  UP TO 50% SAVINGS
                </span>
              </div>

              {/* Package Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
                {packages.map((pkg) => {
                  const isSelected = pkg.id === selectedPkg?.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => onSelectPackage(pkg)}
                      className={`relative rounded-xl p-4 text-left transition-all duration-200 group flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#181a2e] border-2 border-[#e6ff00] shadow-xl shadow-[#e6ff00]/15 -translate-y-0.5'
                          : 'bg-[#0e101c] border border-white/10 hover:border-white/25 hover:bg-[#131524]'
                      }`}
                    >
                      {/* Badge */}
                      {pkg.badge && (
                        <div className="absolute -top-2.5 right-2 z-10">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            pkg.badge.includes('50%') || pkg.badge.includes('HOT')
                              ? 'bg-[#e6ff00] text-black shadow-md'
                              : 'bg-[#9d4edd] text-white shadow-md'
                          }`}>
                            {pkg.badge}
                          </span>
                        </div>
                      )}

                      {/* Header with Diamond Icon */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9d4edd]/20 border border-[#9d4edd]/30 group-hover:scale-105 transition-transform">
                          <Diamond className="h-4 w-4 text-[#e6ff00] fill-[#e6ff00]/20" />
                        </div>
                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-[#e6ff00] flex items-center justify-center">
                            <Check className="h-3 w-3 text-black stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Diamond Counts */}
                      <div>
                        <p className="text-base sm:text-lg font-black text-white tabular-nums tracking-tight">
                          {pkg.diamonds}
                          <span className="text-xs font-semibold text-slate-300 ml-1">Diamonds</span>
                        </p>
                        {pkg.bonusDiamonds > 0 && (
                          <p className="text-[11px] font-bold text-[#e6ff00] tabular-nums mt-0.5">
                            +{pkg.bonusDiamonds} Free Bonus
                          </p>
                        )}
                      </div>

                      {/* Pricing baseline */}
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-baseline justify-between">
                        <span className="text-xs text-slate-400 line-through tabular-nums">
                          ₹{pkg.originalPrice}
                        </span>
                        <div className="text-right">
                          <span className="text-base sm:text-lg font-black text-white tabular-nums">
                            ₹{pkg.discountedPrice}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Apply Coupon Promo Code */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e6ff00] text-black font-extrabold text-sm">
                  3
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide uppercase">
                  Apply Discount Voucher
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    id={couponInputId}
                    type="text"
                    placeholder="Enter Coupon (e.g. DXS50)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full rounded-xl bg-[#090b14] border border-white/15 pl-9 pr-4 py-2.5 text-sm font-bold text-white uppercase placeholder-slate-500 focus:border-[#e6ff00] focus:ring-1 focus:ring-[#e6ff00] focus:outline-none transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  className="rounded-xl bg-[#9d4edd] hover:bg-[#8b3ad4] px-5 py-2.5 text-xs font-bold text-white uppercase tracking-wider transition-colors shrink-0"
                >
                  Apply Voucher
                </button>
              </div>

              {couponSuccess && (
                <p className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="mt-2 text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {couponError}
                </p>
              )}

              {/* Quick Coupon Chips */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400">Quick Apply:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCouponCode('DXS50');
                    setAppliedCoupon('DXS50');
                    setCouponSuccess('50% promotional voucher DXS50 applied!');
                    setCouponError('');
                  }}
                  className="text-[11px] font-bold text-[#e6ff00] bg-[#e6ff00]/10 hover:bg-[#e6ff00]/20 border border-[#e6ff00]/30 px-2 py-0.5 rounded transition-colors"
                >
                  DXS50 (50% OFF)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCouponCode('BOOYAH10');
                    setAppliedCoupon('BOOYAH10');
                    setCouponSuccess('10% voucher BOOYAH10 applied!');
                    setCouponError('');
                  }}
                  className="text-[11px] font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-0.5 rounded transition-colors"
                >
                  BOOYAH10 (10% OFF)
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Checkout Trigger */}
          <div className="lg:col-span-4 sticky top-20">
            <div className="glass-panel-elevated rounded-2xl p-6 border border-[#9d4edd]/30 shadow-2xl relative overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-base font-black text-white tracking-wide uppercase flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#e6ff00]" />
                  Order Summary
                </h3>
                <span className="text-[10px] font-extrabold text-[#e6ff00] bg-[#e6ff00]/15 px-2 py-0.5 rounded uppercase">
                  DIRECT DELIVERY
                </span>
              </div>

              {/* Selected Package Spotlight */}
              <div className="my-5 p-3.5 rounded-xl bg-[#090b14] border border-white/10 flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#9d4edd]/30 to-[#7b2cbf]/20 border border-[#9d4edd]/40 flex items-center justify-center shrink-0">
                  <Diamond className="h-6 w-6 text-[#e6ff00]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-white truncate">
                    {selectedPkg.name}
                  </p>
                  <p className="text-xs text-[#e6ff00] font-semibold tabular-nums">
                    Total: {selectedPkg.diamonds + (selectedPkg.bonusDiamonds || 0)} Diamonds
                  </p>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Regular Store Price</span>
                  <span className="line-through text-slate-400 tabular-nums">₹{basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Bundle Discount</span>
                  <span className="font-semibold text-emerald-400 tabular-nums">- ₹{bundleDiscount}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#e6ff00] font-semibold flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Voucher ({appliedCoupon})
                    </span>
                    <span className="font-bold text-[#e6ff00] tabular-nums">- ₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">UID Verification & Gateway Fee</span>
                  <span className="text-emerald-400 font-semibold uppercase text-[11px]">FREE</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="mt-5 pt-4 border-t border-white/15 flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Payable</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Inclusive of all taxes</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-[#e6ff00] tabular-nums tracking-tight">
                    ₹{finalAmount}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold">
                    You save ₹{bundleDiscount + couponDiscount} (50% OFF)
                  </p>
                </div>
              </div>

              {/* UID Confirmation Card */}
              <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Player UID:</span>
                  <span className="font-mono font-bold text-white">
                    {playerUid || 'Enter above'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300 mt-1">
                  <span className="text-slate-400">Region:</span>
                  <span className="font-medium text-slate-200">{serverRegion}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-[#e6ff00] hover:bg-[#d9f200] py-3.5 px-4 text-sm font-extrabold text-black uppercase tracking-wider transition-all duration-200 hover:shadow-xl hover:shadow-[#e6ff00]/25 active:scale-95"
              >
                <span>Proceed To Payment</span>
                <ArrowRight className="h-4 w-4 text-black" />
              </button>

              {/* Security badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#e6ff00]" />
                  <span>Razorpay Verified</span>
                </div>
                <span className="text-slate-600">·</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#9d4edd]" />
                  <span>Instant Credit</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
