'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsAppNumber?: string;
}

export default function FloatingWhatsApp({
  whatsAppNumber = '+919876543210',
}: FloatingWhatsAppProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  const openWhatsApp = () => {
    const text = encodeURIComponent('Hi DIAMOND X STORE, I need help with my Free Fire Top-Up.');
    window.open(`https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip notice */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 rounded-xl bg-[#0e101c] border border-[#25D366]/40 px-3 py-1.5 text-xs text-white shadow-xl shadow-black/50 animate-in fade-in slide-in-from-right-2 duration-300">
          <span className="text-[#25D366] font-bold">24/7 Support</span>
          <span className="text-slate-400">·</span>
          <span>Online Now</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-500 hover:text-white ml-1"
            aria-label="Dismiss tooltip"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={openWhatsApp}
        className="relative flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 hover:scale-110 active:scale-95 transition-all duration-200 group focus:outline-none"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e6ff00] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#e6ff00]"></span>
        </span>
        <MessageCircle className="h-6 w-6 text-white fill-white" />
      </button>
    </div>
  );
}
