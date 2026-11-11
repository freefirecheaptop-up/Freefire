'use client';

import React from 'react';
import { Diamond, ShieldCheck, MessageCircle, Heart, Lock, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  whatsAppNumber?: string;
}

export default function Footer({
  onNavigate,
  onOpenTracking,
  onOpenAdmin,
  whatsAppNumber = '+919876543210',
}: FooterProps) {
  const openWhatsApp = () => {
    const text = encodeURIComponent('Hi DIAMOND X STORE! I need assistance with Free Fire diamond top-up.');
    window.open(`https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-[#05060a] border-t border-white/10 text-slate-400 text-xs">
      {/* Top Footer Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#9d4edd] to-[#7b2cbf] text-[#e6ff00]">
                <Diamond className="h-4 w-4" />
              </div>
              <span className="text-xl font-black tracking-wider text-white uppercase">
                DIAMOND <span className="text-[#e6ff00]">X</span> STORE
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The premier authorized Free Fire Diamond Top-Up store. Direct UID crediting within 30 seconds, genuine 50% discount offers, and secure 256-bit encrypted Razorpay checkout.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={openWhatsApp}
                className="flex items-center gap-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 px-3.5 py-2 text-xs font-bold text-[#25D366] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>24/7 WhatsApp Support</span>
              </button>
            </div>
          </div>

          {/* Col 3: Quick Top-Up Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Top-Up Bundles</p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('topup')} className="hover:text-[#e6ff00] transition-colors">
                  100 Diamonds (+10 Bonus)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('topup')} className="hover:text-[#e6ff00] transition-colors">
                  310 Diamonds (+31 Bonus)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('topup')} className="hover:text-[#e6ff00] transition-colors">
                  520 Diamonds (+60 Bonus)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('topup')} className="hover:text-[#e6ff00] transition-colors">
                  1060 Diamonds (50% OFF)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('topup')} className="hover:text-[#e6ff00] transition-colors">
                  5600 VIP Guild Pack
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Services */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Customer Care</p>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenTracking} className="hover:text-[#e6ff00] transition-colors">
                  Track Live Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#e6ff00] transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={openWhatsApp} className="hover:text-[#e6ff00] transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-white text-slate-500 transition-colors">
                  Admin Console
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Verification */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Security & Gateway</p>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Lock className="h-3.5 w-3.5 text-[#e6ff00]" />
                <span>Razorpay Secured Gateway</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>100% Ban-Free UID Delivery</span>
              </div>
              <p className="mt-2 text-[10px] text-slate-500 leading-normal">
                Supported Payments: UPI, Google Pay, PhonePe, Paytm, RuPay, Visa, MasterCard & Netbanking.
              </p>
            </div>
          </div>

        </div>

        {/* Disclaimer & Trademark strip */}
        <div className="mt-10 pt-6 border-t border-white/5 text-[11px] text-slate-400 space-y-2">
          <p>
            <strong>Disclaimer:</strong> Garena Free Fire and related marks are registered trademarks of Garena International I Private Limited. DIAMOND X STORE is an independent authorized top-up distribution store operating via official gaming publisher direct UID API gateways. We do not require or ask for customer passwords or OTPs.
          </p>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} DIAMOND X STORE. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#e6ff00] font-bold">100% Genuine 50% Discounts</span>
            <span>·</span>
            <span>Official Instant Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
