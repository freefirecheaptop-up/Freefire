'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Diamond, 
  MessageCircle, 
  RefreshCw,
  Printer
} from 'lucide-react';
import { Order } from '@/lib/types';

interface OrderTrackingProps {
  initialOrderId?: string;
  onBackToShop: () => void;
  whatsAppNumber?: string;
}

export default function OrderTracking({
  initialOrderId = '',
  onBackToShop,
  whatsAppNumber = '+919876543210',
}: OrderTrackingProps) {
  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/orders?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
        setLastChecked(new Date());
      } else {
        setOrder(null);
        setErrorMsg(`No order found matching "${query}". Check your Order ID or Free Fire Player UID.`);
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to check order status.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialOrderId) return;
    let isSubscribed = true;

    async function loadInitialOrder() {
      try {
        const res = await fetch(`/api/orders?query=${encodeURIComponent(initialOrderId.trim())}`);
        const data = await res.json();
        if (isSubscribed) {
          if (data.success && data.order) {
            setOrder(data.order);
            setLastChecked(new Date());
          } else {
            setOrder(null);
            setErrorMsg(`No order found matching "${initialOrderId}". Check your Order ID or Free Fire Player UID.`);
          }
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          setErrorMsg((err as Error).message || 'Failed to check order status.');
        }
      }
    }

    loadInitialOrder();
    return () => {
      isSubscribed = false;
    };
  }, [initialOrderId]);

  // Auto-refresh order if processing
  useEffect(() => {
    if (!order) return;
    if (order.deliveryStatus === 'processing' || order.paymentStatus === 'processing') {
      const timer = setInterval(() => {
        fetchOrder(order.orderNumber);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [order]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchQuery);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const contactSupportForOrder = () => {
    const text = encodeURIComponent(
      `Hello DIAMOND X STORE, I would like an update on my Free Fire Top-Up Order #${order?.orderNumber || searchQuery} for UID: ${order?.playerUid || ''}`
    );
    window.open(`https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  // Determine active step
  const getStepIndex = (o: Order) => {
    if (o.deliveryStatus === 'delivered') return 4;
    if (o.deliveryStatus === 'processing') return 3;
    if (o.paymentStatus === 'paid') return 2;
    if (o.paymentStatus === 'pending') return 1;
    return 1;
  };

  const step = order ? getStepIndex(order) : 1;

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Title */}
      <div className="text-center mb-8">
        <p className="text-xs font-bold text-[#e6ff00] tracking-widest uppercase">
          Live Delivery Status
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
          Track Your Diamond Order
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Enter your unique Order Number (e.g. DXS-984214) or Free Fire Player UID to view real-time status.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="glass-panel rounded-2xl p-3 border border-white/10 mb-8">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID (DXS-XXXXXX) or Player UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-[#090b14] border border-white/15 pl-11 pr-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:border-[#e6ff00] focus:ring-1 focus:ring-[#e6ff00] focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#e6ff00] hover:bg-[#d9f200] disabled:opacity-50 px-6 py-3 text-xs font-black text-black uppercase tracking-wider transition-colors shrink-0"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin text-black" /> : <Search className="h-4 w-4 text-black" />}
            <span>Check Status</span>
          </button>
        </div>
      </form>

      {/* Error message */}
      {errorMsg && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300 flex items-center gap-3 mb-8">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Order Details Display Card */}
      {order && (
        <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-[#9d4edd]/30 shadow-2xl animate-in fade-in duration-300 print:bg-white print:text-black">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">ORDER NUMBER</span>
                <span className="text-sm font-black text-[#e6ff00] font-mono bg-black/40 px-2 py-0.5 rounded border border-[#e6ff00]/30">
                  {order.orderNumber}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
                {order.packageName}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchOrder(order.orderNumber)}
                className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-slate-300 transition-colors"
                title="Refresh live status"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-[#e6ff00]' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={handlePrintReceipt}
                className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-slate-300 transition-colors"
                title="Print Receipt"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Receipt</span>
              </button>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="py-8">
            <div className="grid grid-cols-4 gap-2 text-center relative">
              {/* Connector line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-white/10 -z-0" />
              <div 
                className="absolute top-4 left-6 h-0.5 bg-gradient-to-r from-[#e6ff00] to-[#9d4edd] transition-all duration-500 -z-0" 
                style={{ width: `${Math.min(100, (step - 1) * 33.33)}%` }}
              />

              {/* Step 1: Placed */}
              <div className="flex flex-col items-center relative z-10">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step >= 1 ? 'bg-[#e6ff00] text-black shadow-lg shadow-[#e6ff00]/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  ✓
                </div>
                <p className="mt-2 text-xs font-bold text-white">Order Placed</p>
                <p className="text-[10px] text-slate-400">UID Registered</p>
              </div>

              {/* Step 2: Payment */}
              <div className="flex flex-col items-center relative z-10">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step >= 2 ? 'bg-[#e6ff00] text-black shadow-lg shadow-[#e6ff00]/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {step >= 2 ? '✓' : '2'}
                </div>
                <p className="mt-2 text-xs font-bold text-white">Payment Verified</p>
                <p className="text-[10px] text-slate-400">Razorpay / UPI</p>
              </div>

              {/* Step 3: Queue */}
              <div className="flex flex-col items-center relative z-10">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step >= 3 ? 'bg-[#9d4edd] text-white shadow-lg shadow-[#9d4edd]/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {step >= 4 ? '✓' : step === 3 ? <RefreshCw className="h-4 w-4 animate-spin text-white" /> : '3'}
                </div>
                <p className="mt-2 text-xs font-bold text-white">Direct Queue</p>
                <p className="text-[10px] text-slate-400">Garena Servers</p>
              </div>

              {/* Step 4: Delivered */}
              <div className="flex flex-col items-center relative z-10">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step >= 4 ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {step >= 4 ? '✓' : '4'}
                </div>
                <p className="mt-2 text-xs font-bold text-white">Delivered</p>
                <p className="text-[10px] text-slate-400">In-Game Mailbox</p>
              </div>
            </div>
          </div>

          {/* Status Alert Banner */}
          <div className={`rounded-xl p-4 mb-6 border flex items-center justify-between text-xs ${
            order.deliveryStatus === 'delivered'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : order.deliveryStatus === 'processing'
              ? 'bg-[#9d4edd]/15 border-[#9d4edd]/40 text-purple-200'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          }`}>
            <div className="flex items-center gap-2.5">
              {order.deliveryStatus === 'delivered' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : (
                <Clock className="h-5 w-5 text-[#e6ff00] animate-spin shrink-0" />
              )}
              <div>
                <p className="font-bold text-sm">
                  {order.deliveryStatus === 'delivered'
                    ? 'Top-Up Successfully Completed!'
                    : order.deliveryStatus === 'processing'
                    ? 'Crediting Diamonds to UID...'
                    : 'Awaiting Payment Confirmation'}
                </p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  {order.fulfillmentNotes || 'Connecting with Free Fire authorized diamond distribution gateway.'}
                </p>
              </div>
            </div>

            <span className="font-mono text-[10px] uppercase font-extrabold px-2 py-1 rounded bg-black/40 border border-current">
              {order.deliveryStatus}
            </span>
          </div>

          {/* Order Details Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-[#090b14] p-4 border border-white/10 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Player Account Info</p>
              <div className="flex justify-between">
                <span className="text-slate-400">Free Fire UID:</span>
                <span className="font-mono font-bold text-[#e6ff00]">{order.playerUid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Player Nickname:</span>
                <span className="font-bold text-white">{order.playerNickname}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Server Region:</span>
                <span className="text-slate-200">{order.serverRegion}</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#090b14] p-4 border border-white/10 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Payment & Receipt</p>
              <div className="flex justify-between">
                <span className="text-slate-400">Diamonds Credited:</span>
                <span className="font-black text-[#e6ff00] tabular-nums">{order.totalDiamonds} 💎</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-black text-white tabular-nums">₹{order.finalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className={`font-bold uppercase ${order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Actions strip */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onBackToShop}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-5 py-2.5 text-xs font-bold text-white uppercase tracking-wider transition-colors"
            >
              <span>Back To Store</span>
            </button>

            <button
              onClick={contactSupportForOrder}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-5 py-2.5 text-xs font-extrabold text-black uppercase tracking-wider transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-black" />
              <span>Need Help? Chat on WhatsApp</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
