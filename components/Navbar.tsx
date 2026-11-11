'use client';

import React, { useState } from 'react';
import { ShieldCheck, MessageCircle, Menu, X, Search, SlidersHorizontal, Diamond } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  activeSection?: string;
  whatsAppNumber?: string;
}

export default function Navbar({
  onNavigate,
  onOpenAdmin,
  onOpenTracking,
  activeSection = 'home',
  whatsAppNumber = '+919876543210',
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent('Hi DIAMOND X STORE! I need help with my Free Fire Diamond Top-Up.');
    window.open(`https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#07080e]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('hero')}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#9d4edd] to-[#7b2cbf] shadow-md shadow-[#9d4edd]/30 ring-1 ring-[#e6ff00]/40 group-hover:scale-105 transition-transform">
            <Diamond className="h-5 w-5 text-[#e6ff00] fill-[#e6ff00]/20" />
          </div>
          <span className="text-xl font-black tracking-wider text-white uppercase sm:text-2xl">
            DIAMOND <span className="text-[#e6ff00]">X</span> STORE
          </span>
        </button>

        {/* Zone 2: Navigation Links (Clean 1-line text links) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('topup')}
            className={`whitespace-nowrap transition-colors hover:text-[#e6ff00] ${
              activeSection === 'topup' ? 'text-[#e6ff00] font-semibold' : ''
            }`}
          >
            Instant Top-Up
          </button>
          <button
            onClick={() => handleNavClick('packages')}
            className={`whitespace-nowrap transition-colors hover:text-[#e6ff00] ${
              activeSection === 'packages' ? 'text-[#e6ff00] font-semibold' : ''
            }`}
          >
            Diamond Bundles
          </button>
          <button
            onClick={onOpenTracking}
            className="whitespace-nowrap transition-colors hover:text-[#e6ff00] flex items-center gap-1.5"
          >
            <Search className="h-3.5 w-3.5 text-[#9d4edd]" />
            Track Order
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="whitespace-nowrap transition-colors hover:text-[#e6ff00]"
          >
            FAQs
          </button>
          <button
            onClick={onOpenAdmin}
            className="whitespace-nowrap text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <SlidersHorizontal className="h-3 w-3 text-slate-500" />
            Admin
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={openWhatsApp}
            className="flex items-center gap-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 px-3 py-1.5 text-xs font-semibold text-[#25D366] transition-all"
            title="Chat with 24/7 Gamer Support on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Support</span>
          </button>

          <button
            onClick={() => handleNavClick('topup')}
            className="relative group overflow-hidden rounded-lg bg-[#e6ff00] px-4 py-2 text-xs font-bold text-black uppercase tracking-wider transition-all hover:bg-[#d8f000] hover:shadow-lg hover:shadow-[#e6ff00]/20 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Top-Up Now</span>
              <span className="text-[10px] bg-black text-[#e6ff00] px-1 py-0.2 rounded font-extrabold">-50%</span>
            </span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenTracking}
            className="p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Track Order"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#0c0e18] px-4 py-4 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3 text-sm font-medium">
            <button
              onClick={() => handleNavClick('topup')}
              className="flex items-center justify-between rounded-lg p-2.5 text-left text-slate-200 hover:bg-white/5 hover:text-[#e6ff00]"
            >
              <span>Instant Top-Up (UID)</span>
              <span className="text-[10px] font-bold text-[#e6ff00] bg-[#e6ff00]/10 px-2 py-0.5 rounded">50% OFF</span>
            </button>
            <button
              onClick={() => handleNavClick('packages')}
              className="rounded-lg p-2.5 text-left text-slate-200 hover:bg-white/5 hover:text-[#e6ff00]"
            >
              Diamond Packages
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracking();
              }}
              className="flex items-center gap-2 rounded-lg p-2.5 text-left text-slate-200 hover:bg-white/5 hover:text-[#e6ff00]"
            >
              <Search className="h-4 w-4 text-[#9d4edd]" />
              <span>Track Order Live</span>
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="rounded-lg p-2.5 text-left text-slate-200 hover:bg-white/5 hover:text-[#e6ff00]"
            >
              Frequently Asked Questions
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-2 rounded-lg p-2.5 text-left text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </button>

            <div className="pt-2 border-t border-white/10 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openWhatsApp();
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#25D366]/20 border border-[#25D366]/30 py-2.5 text-xs font-semibold text-[#25D366]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Help
              </button>
              <button
                onClick={() => handleNavClick('topup')}
                className="flex-1 rounded-lg bg-[#e6ff00] py-2.5 text-xs font-bold text-black uppercase"
              >
                Top-Up Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
