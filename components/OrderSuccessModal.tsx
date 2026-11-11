'use client';

import React from 'react';
import { CheckCircle2, Diamond, ArrowRight, ShieldCheck, Clock, X } from 'lucide-react';
import { Order } from '@/lib/types';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onTrackOrder: (orderNumber: string) => void;
}

export default function OrderSuccessModal({
  isOpen,
  onClose,
  order,
  onTrackOrder,
}: OrderSuccessModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0d0f1a] border border-[#e6ff00]/40 p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-[#e6ff00]/20 blur-2xl pointer-events-none rounded-full" />

        {/* Victory Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6ff00] text-black shadow-lg shadow-[#e6ff00]/30 mb-4 animate-bounce">
          <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
        </div>

        {/* Headline */}
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">
          Payment Confirmed!
        </h3>
        <p className="mt-1 text-xs text-[#e6ff00] font-bold uppercase tracking-wider">
          Diamond Top-Up In Progress
        </p>

        {/* Order Card */}
        <div className="mt-5 rounded-xl bg-[#07080e] border border-white/10 p-4 text-left text-xs space-y-2">
          <div className="flex justify-between pb-2 border-b border-white/10">
            <span className="text-slate-400">Order ID:</span>
            <span className="font-mono font-bold text-[#e6ff00]">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Player UID:</span>
            <span className="font-mono font-bold text-white">{order.playerUid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Server:</span>
            <span className="text-slate-200">{order.serverRegion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Package:</span>
            <span className="font-bold text-white">{order.packageName}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/10">
            <span className="text-slate-400">Crediting Amount:</span>
            <span className="font-black text-[#e6ff00] text-sm tabular-nums">
              {order.totalDiamonds} Diamonds 💎
            </span>
          </div>
        </div>

        {/* Real-time status notice */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-300">
          <Clock className="h-3.5 w-3.5 text-[#e6ff00] animate-spin" />
          <span>Fulfillment underway · Direct Garena API credit</span>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={() => onTrackOrder(order.orderNumber)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#e6ff00] hover:bg-[#d9f200] py-3 text-xs font-black text-black uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#e6ff00]/25"
          >
            <span>Track Order Delivery Live</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-white/10 hover:bg-white/15 py-2.5 text-xs font-bold text-slate-300 uppercase tracking-wider transition-colors"
          >
            Close & Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}
