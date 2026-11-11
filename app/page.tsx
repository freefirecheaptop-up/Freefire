'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PromoBanner from '@/components/PromoBanner';
import Hero from '@/components/Hero';
import TopUpSection from '@/components/TopUpSection';
import DiamondCards from '@/components/DiamondCards';
import Testimonials from '@/components/Testimonials';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderSuccessModal from '@/components/OrderSuccessModal';
import OrderTracking from '@/components/OrderTracking';
import AdminDashboard from '@/components/AdminDashboard';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { INITIAL_PACKAGES, INITIAL_SETTINGS } from '@/lib/data';
import { DiamondPackage, Order, StoreSettings } from '@/lib/types';

export default function HomePage() {
  const [packages, setPackages] = useState<DiamondPackage[]>(INITIAL_PACKAGES);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(INITIAL_PACKAGES[2]?.id || 'pack-520');

  // View state: 'store' or 'tracking'
  const [currentView, setCurrentView] = useState<'store' | 'tracking'>('store');
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load packages & settings from server store
  useEffect(() => {
    async function loadStoreData() {
      try {
        const [pkgRes, setRes] = await Promise.all([
          fetch('/api/packages'),
          fetch('/api/settings'),
        ]);

        if (pkgRes.ok) {
          const pkgData = await pkgRes.json();
          if (pkgData.success && pkgData.packages) {
            setPackages(pkgData.packages);
          }
        }

        if (setRes.ok) {
          const setData = await setRes.json();
          if (setData.success && setData.settings) {
            setSettings(setData.settings);
          }
        }
      } catch (err) {
        console.error('Error initializing store data:', err);
      }
    }

    loadStoreData();
  }, []);

  // Smooth scroll handler
  const handleNavigate = (sectionId: string) => {
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When clicking Buy Now from product card
  const handleSelectAndBuy = (pkg: DiamondPackage) => {
    setSelectedPackageId(pkg.id);
    handleNavigate('topup');
  };

  // Top-Up proceed to checkout
  const handleProceedToCheckout = async (payload: {
    playerUid: string;
    serverRegion: string;
    playerNickname: string;
    packageId: string;
    couponCode: string;
  }) => {
    try {
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Could not initialize order.');
        return;
      }

      setActiveOrder(data.order);
      setIsCheckoutOpen(true);
    } catch (err: unknown) {
      alert((err as Error).message || 'Checkout initiation failed.');
    }
  };

  // When payment is verified
  const handlePaymentSuccess = (updatedOrder: Order) => {
    setIsCheckoutOpen(false);
    setCompletedOrder(updatedOrder);
    setIsSuccessOpen(true);
  };

  // Switch to Tracking view
  const handleOpenTrackingWithId = (orderNumber: string) => {
    setIsSuccessOpen(false);
    setTrackingOrderId(orderNumber);
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07080e] text-slate-100 flex flex-col">
      {/* Top Promotional Announcement Banner */}
      {settings.promoBannerActive && (
        <PromoBanner
          bannerText={settings.promoBannerText}
          discountText={settings.promoBannerDiscount}
          code="DXS50"
        />
      )}

      {/* Primary Navigation Bar */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracking={() => {
          setCurrentView('tracking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        whatsAppNumber={settings.whatsAppNumber}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'store' ? (
          <>
            {/* Hero Section */}
            <Hero
              onShopNow={() => handleNavigate('topup')}
              onTrackOrder={() => {
                setCurrentView('tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              headline={settings.headline}
              subheadline={settings.subheadline}
            />

            {/* Core Interactive Top-Up Section */}
            <TopUpSection
              packages={packages}
              selectedPackageId={selectedPackageId}
              onSelectPackage={(pkg) => setSelectedPackageId(pkg.id)}
              onProceedToCheckout={handleProceedToCheckout}
            />

            {/* Diamond Packages Product Cards Grid */}
            <DiamondCards
              packages={packages}
              onSelectAndBuy={handleSelectAndBuy}
            />

            {/* Special Offers & Gamer Reviews */}
            <Testimonials />

            {/* Frequently Asked Questions */}
            <FaqSection />
          </>
        ) : (
          /* Dedicated Order Tracking View */
          <OrderTracking
            initialOrderId={trackingOrderId}
            onBackToShop={() => {
              setCurrentView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            whatsAppNumber={settings.whatsAppNumber}
          />
        )}
      </main>

      {/* Professional Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenTracking={() => {
          setCurrentView('tracking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        whatsAppNumber={settings.whatsAppNumber}
      />

      {/* Floating 24/7 WhatsApp Action */}
      <FloatingWhatsApp whatsAppNumber={settings.whatsAppNumber} />

      {/* Razorpay & UPI Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        order={activeOrder}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Post-Payment Victory Success Modal */}
      <OrderSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        order={completedOrder}
        onTrackOrder={handleOpenTrackingWithId}
      />

      {/* Admin Dashboard Console Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onPackagesUpdated={(updated) => setPackages(updated)}
        onSettingsUpdated={(updated) => setSettings(updated)}
        settings={settings}
        packages={packages}
      />
    </div>
  );
}
