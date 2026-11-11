'use client';

import React, { useState } from 'react';
import { Sparkles, X, Copy, Check } from 'lucide-react';

interface PromoBannerProps {
  bannerText?: string;
  code?: string;
  discountText?: string;
}

export default function PromoBanner({
  bannerText = '🔥 LIMITED TIME: GET 50% OFF ON FREE FIRE DIAMONDS WITH CODE: DXS50',
  code = 'DXS50',
  discountText = '50% OFF',
}: PromoBannerProps) {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative z-50 bg-gradient-to-r from-[#9d4edd] via-[#240046] to-[#07080e] border-b border-[#9d4edd]/30 text-white text-xs py-2 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap overflow-hidden">
          <span className="flex items-center gap-1 font-bold text-[#e6ff00] uppercase tracking-wider shrink-0 bg-black/40 px-2 py-0.5 rounded text-[11px] border border-[#e6ff00]/40">
            <Sparkles className="h-3 w-3 text-[#e6ff00]" />
            {discountText}
          </span>
          <span className="text-slate-200 truncate font-medium text-xs sm:text-[13px]">
            {bannerText}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copyCode}
            className="flex items-center gap-1 bg-[#e6ff00] text-black font-extrabold text-[11px] px-2 py-0.5 rounded hover:bg-white transition-colors"
            title="Copy promo code"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-black" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-black" />
                <span>USE {code}</span>
              </>
            )}
          </button>
          <button
            onClick={() => setVisible(false)}
            className="text-slate-400 hover:text-white p-0.5 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
