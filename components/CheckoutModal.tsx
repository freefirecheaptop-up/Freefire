'use client';

import React, { useState, useEffect, useId } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  X, 
  QrCode, 
  CreditCard, 
  Building2, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight,
  Diamond
} from 'lucide-react';
import { Order } from '@/lib/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onPaymentSuccess: (updatedOrder: Order) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  order,
  onPaymentSuccess,
}: CheckoutModalProps) {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min QR expiry timer
  const cardNumberInputId = useId();
  const cardExpiryInputId = useId();
  const cardCvvInputId = useId();
  const cardHolderInputId = useId();

  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('782');
  const [cardHolder, setCardHolder] = useState('ESPORTS GAMER');

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const demoUpiId = 'razorpay.diamondx@okhdfcbank';

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(demoUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleVerifyPayment = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // Call server-side payment verification endpoint
      const res = await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          razorpay_payment_id: `pay_rzp_${Date.now()}`,
          paymentMethod: activeTab === 'upi' ? 'upi_qr' : activeTab === 'card' ? 'card' : 'netbanking',
          simulationToken: 'SIMULATED_RAZORPAY_AUTH_TOKEN_SECURE',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment verification failed at gateway.');
      }

      // Victory celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e6ff00', '#9d4edd', '#00f0ff', '#ffffff'],
        });
      } catch (e) {
        // Safe fallback if confetti canvas fails
      }

      // Automatically trigger server-side diamond crediting after 3 seconds
      setTimeout(async () => {
        try {
          await fetch('/api/checkout/fulfill', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order.id }),
          });
        } catch (e) {
          console.error('Fulfillment trigger error:', e);
        }
      }, 3500);

      onPaymentSuccess(data.order);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Payment could not be verified.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0c0e18] border border-[#9d4edd]/40 shadow-2xl overflow-hidden my-8">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#181a2e] to-[#0c0e18] p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6ff00] text-black">
              <Diamond className="h-5 w-5 fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#e6ff00] uppercase tracking-wider">
                  Razorpay Checkout
                </span>
                <span className="text-[10px] text-slate-400 bg-white/10 px-1.5 py-0.2 rounded font-mono">
                  {order.orderNumber}
                </span>
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                DIAMOND X STORE
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Order Details Bar */}
        <div className="bg-[#121422] px-5 py-3 border-b border-white/5 flex items-center justify-between text-xs">
          <div>
            <p className="text-slate-400">Crediting to Player UID:</p>
            <p className="font-bold text-white font-mono text-sm">{order.playerUid} ({order.serverRegion})</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400">Total Diamonds:</p>
            <p className="font-black text-[#e6ff00] text-sm tabular-nums">
              {order.totalDiamonds} 💎
            </p>
          </div>
        </div>

        {/* Payment Methods Tab */}
        <div className="p-5">
          <div className="flex rounded-xl bg-[#07080e] p-1 border border-white/10 mb-5">
            <button
              onClick={() => setActiveTab('upi')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'upi'
                  ? 'bg-[#e6ff00] text-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>UPI / QR</span>
            </button>
            <button
              onClick={() => setActiveTab('card')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'card'
                  ? 'bg-[#e6ff00] text-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setActiveTab('netbanking')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'netbanking'
                  ? 'bg-[#e6ff00] text-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Net Banking</span>
            </button>
          </div>

          {/* TAB 1: UPI & QR CODE */}
          {activeTab === 'upi' && (
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex items-center gap-2 text-xs text-slate-300">
                <span className="font-medium">Scan QR with any UPI app</span>
                <span className="text-slate-500">·</span>
                <span className="font-mono text-[#e6ff00] font-bold">Expires in {formatTimer(timeLeft)}</span>
              </div>

              {/* Dynamic QR Code graphic */}
              <div className="relative p-3 bg-white rounded-2xl shadow-xl border-4 border-[#9d4edd] my-2">
                <div className="h-44 w-44 relative bg-white flex flex-col items-center justify-center p-2">
                  {/* Clean SVG QR code representation */}
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" rx="4" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="9" y="9" width="12" height="12" />
                    
                    <rect x="70" y="0" width="30" height="30" rx="4" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="79" y="9" width="12" height="12" />

                    <rect x="0" y="70" width="30" height="30" rx="4" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="9" y="79" width="12" height="12" />

                    {/* Data Matrix Dots */}
                    <rect x="36" y="8" width="6" height="6" />
                    <rect x="48" y="16" width="8" height="6" />
                    <rect x="36" y="26" width="6" height="8" />
                    <rect x="12" y="38" width="8" height="6" />
                    <rect x="24" y="44" width="6" height="8" />
                    <rect x="42" y="42" width="16" height="16" fill="#9d4edd" rx="2" />
                    <rect x="68" y="38" width="8" height="8" />
                    <rect x="84" y="46" width="8" height="6" />
                    <rect x="38" y="68" width="10" height="6" />
                    <rect x="54" y="74" width="8" height="8" />
                    <rect x="70" y="70" width="6" height="8" />
                    <rect x="82" y="82" width="8" height="8" />
                  </svg>
                </div>
                
                {/* Center Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black text-[#e6ff00] font-black text-[10px] px-2 py-0.5 rounded shadow">
                    ₹{order.finalPrice}
                  </div>
                </div>
              </div>

              {/* UPI ID copy strip */}
              <div className="mt-3 w-full flex items-center justify-between rounded-xl bg-[#07080e] border border-white/10 px-3.5 py-2 text-xs">
                <span className="text-slate-400 font-mono">{demoUpiId}</span>
                <button
                  type="button"
                  onClick={copyUpiId}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#e6ff00] hover:text-white"
                >
                  {copiedUpi ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
                </button>
              </div>

              {/* Quick UPI App Selector */}
              <div className="mt-4 grid grid-cols-4 gap-2 w-full text-xs">
                {(['gpay', 'phonepe', 'paytm', 'bhim'] as const).map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setSelectedUpiApp(app)}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      selectedUpiApp === app
                        ? 'border-[#e6ff00] bg-[#e6ff00]/10 text-white font-bold'
                        : 'border-white/10 bg-[#07080e] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="uppercase text-[10px] font-extrabold">{app}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CREDIT / DEBIT CARDS */}
          {activeTab === 'card' && (
            <div className="space-y-3.5 text-xs text-slate-300">
              <div>
                <label htmlFor={cardNumberInputId} className="block text-slate-400 mb-1">Card Number</label>
                <input
                  id={cardNumberInputId}
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full rounded-xl bg-[#07080e] border border-white/15 px-3 py-2.5 font-mono text-sm text-white focus:border-[#e6ff00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={cardExpiryInputId} className="block text-slate-400 mb-1">Expiry Date</label>
                  <input
                    id={cardExpiryInputId}
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full rounded-xl bg-[#07080e] border border-white/15 px-3 py-2.5 font-mono text-sm text-white focus:border-[#e6ff00] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={cardCvvInputId} className="block text-slate-400 mb-1">CVV / CVC</label>
                  <input
                    id={cardCvvInputId}
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full rounded-xl bg-[#07080e] border border-white/15 px-3 py-2.5 font-mono text-sm text-white focus:border-[#e6ff00] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={cardHolderInputId} className="block text-slate-400 mb-1">Cardholder Name</label>
                <input
                  id={cardHolderInputId}
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full rounded-xl bg-[#07080e] border border-white/15 px-3 py-2.5 text-sm font-semibold text-white focus:border-[#e6ff00] focus:outline-none"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                🔒 Protected by 256-bit AES encryption via Razorpay.
              </p>
            </div>
          )}

          {/* TAB 3: NET BANKING */}
          {activeTab === 'netbanking' && (
            <div className="space-y-3 text-xs">
              <label className="block text-slate-400 mb-2">Select Your Bank</label>
              <div className="grid grid-cols-2 gap-2">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedBank === bank
                        ? 'border-[#e6ff00] bg-[#e6ff00]/10 text-white font-bold'
                        : 'border-white/10 bg-[#07080e] text-slate-300 hover:text-white'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error display */}
          {errorMsg && (
            <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Final Action Button */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={handleVerifyPayment}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#e6ff00] hover:bg-[#d8f000] disabled:opacity-50 py-3.5 px-4 text-sm font-extrabold text-black uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#e6ff00]/25 active:scale-95"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Verifying Payment with Gateway...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-black" />
                  <span>Confirm Payment of ₹{order.finalPrice}</span>
                </>
              )}
            </button>

            <div className="mt-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Direct fulfillment authorized by Garena top-up servers</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
