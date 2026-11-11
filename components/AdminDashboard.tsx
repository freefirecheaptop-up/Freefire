'use client';

import React, { useState, useEffect, useId } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Lock, 
  LogOut, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Key, 
  Save, 
  RotateCcw,
  Diamond,
  ArrowUpRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { DiamondPackage, Order, StoreSettings } from '@/lib/types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onPackagesUpdated: (packages: DiamondPackage[]) => void;
  onSettingsUpdated: (settings: StoreSettings) => void;
  settings: StoreSettings;
  packages: DiamondPackage[];
}

export default function AdminDashboard({
  isOpen,
  onClose,
  onPackagesUpdated,
  onSettingsUpdated,
  settings,
  packages,
}: AdminDashboardProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const adminEmailInputId = useId();
  const adminPasswordInputId = useId();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'packages' | 'orders' | 'settings'>('analytics');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Package editor modal state
  const [editingPackage, setEditingPackage] = useState<DiamondPackage | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [packageFormData, setPackageFormData] = useState({
    name: '',
    diamonds: 100,
    bonusDiamonds: 10,
    originalPrice: 160,
    discountedPrice: 80,
    badge: '50% OFF',
    popular: false,
    bestValue: false,
    inStock: true,
  });

  // Store settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    let isSubscribed = true;

    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (isSubscribed && data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (e) {
        console.error('Failed to fetch orders:', e);
      }
    }

    loadOrders();
    return () => {
      isSubscribed = false;
    };
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    // Demo admin authentication credentials
    if (
      (adminEmail === 'admin@diamondx.store' && adminPassword === 'admin123') ||
      (adminEmail === 'admin' && adminPassword === 'admin')
    ) {
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid credentials. Use admin@diamondx.store and admin123');
    }
  };

  const handleFillDemoCredentials = () => {
    setAdminEmail('admin@diamondx.store');
    setAdminPassword('admin123');
    setAuthError('');
  };

  // Analytics calculations
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.finalPrice, 0);

  const totalDiamondsSold = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalDiamonds, 0);

  const deliveredCount = orders.filter(o => o.deliveryStatus === 'delivered').length;
  const pendingCount = orders.filter(o => o.deliveryStatus === 'pending' || o.deliveryStatus === 'processing').length;

  // Package Management Handlers
  const openEditPackage = (pkg: DiamondPackage) => {
    setEditingPackage(pkg);
    setIsAddingNew(false);
    setPackageFormData({
      name: pkg.name,
      diamonds: pkg.diamonds,
      bonusDiamonds: pkg.bonusDiamonds || 0,
      originalPrice: pkg.originalPrice,
      discountedPrice: pkg.discountedPrice,
      badge: pkg.badge || '',
      popular: !!pkg.popular,
      bestValue: !!pkg.bestValue,
      inStock: pkg.inStock,
    });
  };

  const openAddNewPackage = () => {
    setEditingPackage(null);
    setIsAddingNew(true);
    setPackageFormData({
      name: '750 Diamonds',
      diamonds: 750,
      bonusDiamonds: 75,
      originalPrice: 1200,
      discountedPrice: 600,
      badge: 'NEW BUNDLE',
      popular: false,
      bestValue: false,
      inStock: true,
    });
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();

    const originalPrice = Number(packageFormData.originalPrice);
    const discountedPrice = Number(packageFormData.discountedPrice);
    const discountPercent = originalPrice > 0 
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;

    const payload = {
      action: isAddingNew ? 'add' : 'edit',
      packageData: {
        ...(editingPackage || {}),
        ...packageFormData,
        diamonds: Number(packageFormData.diamonds),
        bonusDiamonds: Number(packageFormData.bonusDiamonds),
        originalPrice,
        discountedPrice,
        discountPercent,
        category: 'instant',
      }
    };

    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.packages) {
        onPackagesUpdated(data.packages);
        setEditingPackage(null);
        setIsAddingNew(false);
      }
    } catch (err) {
      console.error('Error saving package:', err);
    }
  };

  const handleDeletePackage = async (pkgId: string) => {
    if (!confirm('Are you sure you want to delete this diamond package?')) return;

    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', packageData: { id: pkgId } }),
      });
      const data = await res.json();
      if (data.success && data.packages) {
        onPackagesUpdated(data.packages);
      }
    } catch (err) {
      console.error('Error deleting package:', err);
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, deliveryStatus: Order['deliveryStatus']) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          deliveryStatus,
          fulfillmentNotes: deliveryStatus === 'delivered'
            ? 'Manually confirmed and delivered by Store Admin.'
            : 'Order status updated in Admin console.'
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders(prev => prev.map(o => o.id === data.order.id ? data.order : o));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Save store settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (data.success && data.settings) {
        onSettingsUpdated(data.settings);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2500);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  // Reset store
  const handleResetStore = async () => {
    if (!confirm('Reset entire store packages, seed orders, and settings back to factory defaults?')) return;
    try {
      const res = await fetch('/api/store/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Store reset successfully!');
        window.location.reload();
      }
    } catch (e) {
      console.error('Failed to reset store:', e);
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderFilter === 'all' || o.deliveryStatus === orderFilter || o.paymentStatus === orderFilter;
    const matchesSearch = !orderSearch.trim() || 
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.playerUid.includes(orderSearch.trim()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#0b0d17] border border-[#9d4edd]/40 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#17192c] to-[#0b0d17] p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6ff00] text-black">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>DIAMOND X STORE</span>
                <span className="text-xs bg-[#9d4edd]/30 text-[#e6ff00] px-2 py-0.5 rounded border border-[#9d4edd]/50">
                  ADMIN CONSOLE
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-slate-300 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close admin dashboard"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* LOGIN SCREEN */
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center flex-1 flex flex-col justify-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#141629] border border-[#9d4edd]/50 text-[#e6ff00] mb-4">
              <Lock className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Admin Access</h3>
            <p className="mt-1 text-xs text-slate-400">
              Sign in to manage diamond bundles, edit 50% discounts, and track order fulfillment.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
              <div>
                <label htmlFor={adminEmailInputId} className="block text-xs font-semibold text-slate-300 mb-1">
                  Admin Email
                </label>
                <input
                  id={adminEmailInputId}
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@diamondx.store"
                  className="w-full rounded-xl bg-[#07080e] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#e6ff00] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor={adminPasswordInputId} className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <input
                  id={adminPasswordInputId}
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-[#07080e] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#e6ff00] focus:outline-none"
                  required
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#e6ff00] hover:bg-[#d9f200] py-3 text-sm font-extrabold text-black uppercase tracking-wider transition-colors"
              >
                <Lock className="h-4 w-4" />
                <span>Enter Admin Console</span>
              </button>

              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="w-full text-center text-xs font-semibold text-[#9d4edd] hover:text-[#c084fc] transition-colors py-1"
              >
                ⚡ Click to fill demo credentials (admin@diamondx.store / admin123)
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN PANEL */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar tabs */}
            <div className="w-full md:w-56 bg-[#080911] border-b md:border-b-0 md:border-r border-white/10 p-3 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-[#e6ff00] text-black shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'packages'
                    ? 'bg-[#e6ff00] text-black shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Diamond Packages</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-[#e6ff00] text-black shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Customer Orders</span>
                {orders.length > 0 && (
                  <span className="ml-auto text-[10px] bg-black/30 px-1.5 py-0.2 rounded">
                    {orders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-[#e6ff00] text-black shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Store & Promo</span>
              </button>
            </div>

            {/* Main content body */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
              
              {/* TAB 1: ANALYTICS & OVERVIEW */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase">Sales & Revenue Analytics</h3>
                    <p className="text-xs text-slate-400">Live operational top-up metrics and fulfillment stats.</p>
                  </div>

                  {/* 4 KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-xl bg-[#121422] p-4 border border-white/10">
                      <p className="text-xs text-slate-400 flex items-center justify-between">
                        <span>Total Revenue</span>
                        <DollarSign className="h-3.5 w-3.5 text-[#e6ff00]" />
                      </p>
                      <p className="text-2xl font-black text-[#e6ff00] mt-1 tabular-nums">
                        ₹{totalRevenue}
                      </p>
                      <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Verified Razorpay/UPI</span>
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#121422] p-4 border border-white/10">
                      <p className="text-xs text-slate-400 flex items-center justify-between">
                        <span>Diamonds Delivered</span>
                        <Diamond className="h-3.5 w-3.5 text-[#9d4edd]" />
                      </p>
                      <p className="text-2xl font-black text-white mt-1 tabular-nums">
                        {totalDiamondsSold.toLocaleString()} 💎
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Direct UID Credits</p>
                    </div>

                    <div className="rounded-xl bg-[#121422] p-4 border border-white/10">
                      <p className="text-xs text-slate-400 flex items-center justify-between">
                        <span>Delivered Orders</span>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      </p>
                      <p className="text-2xl font-black text-emerald-400 mt-1 tabular-nums">
                        {deliveredCount}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Avg 30s fulfillment</p>
                    </div>

                    <div className="rounded-xl bg-[#121422] p-4 border border-white/10">
                      <p className="text-xs text-slate-400 flex items-center justify-between">
                        <span>Active Bundles</span>
                        <Package className="h-3.5 w-3.5 text-cyan-400" />
                      </p>
                      <p className="text-2xl font-black text-white mt-1 tabular-nums">
                        {packages.length}
                      </p>
                      <p className="text-[10px] text-[#e6ff00] mt-1">All with 50% discount</p>
                    </div>
                  </div>

                  {/* Revenue Breakdown by Package */}
                  <div className="rounded-xl bg-[#121422] p-5 border border-white/10">
                    <h4 className="text-sm font-bold text-white uppercase mb-4">
                      Top-Selling Diamond Packages
                    </h4>
                    <div className="space-y-3">
                      {packages.map((pkg) => {
                        const count = orders.filter(o => o.packageId === pkg.id).length;
                        const percent = orders.length > 0 ? Math.round((count / orders.length) * 100) : 15;
                        return (
                          <div key={pkg.id}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-bold text-white">{pkg.name} (₹{pkg.discountedPrice})</span>
                              <span className="text-[#e6ff00] font-mono font-bold tabular-nums">
                                {count} orders ({percent}%)
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#9d4edd] to-[#e6ff00] rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(8, percent)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Documentation Notice */}
                  <div className="rounded-xl bg-purple-950/30 border border-[#9d4edd]/30 p-4 text-xs text-slate-300">
                    <p className="font-bold text-white flex items-center gap-1.5 mb-1">
                      <Key className="h-4 w-4 text-[#e6ff00]" />
                      Payment & Garena API Production Readiness
                    </p>
                    <p className="leading-relaxed">
                      This store is configured with Razorpay and Garena UID direct verification routes. To run live transactions with your bank merchant account, configure <code className="bg-black/50 px-1 py-0.5 rounded text-[#e6ff00]">RAZORPAY_KEY_ID</code> and <code className="bg-black/50 px-1 py-0.5 rounded text-[#e6ff00]">RAZORPAY_KEY_SECRET</code> in the project secrets. The app includes active cryptographic HMAC validation and automated sandbox execution.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: PACKAGES MANAGEMENT */}
              {activeTab === 'packages' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white uppercase">Manage Diamond Packages</h3>
                      <p className="text-xs text-slate-400">Edit prices, discount rates, and bonus diamonds dynamically.</p>
                    </div>
                    <button
                      onClick={openAddNewPackage}
                      className="flex items-center gap-1.5 rounded-xl bg-[#e6ff00] hover:bg-[#d9f200] px-4 py-2 text-xs font-black text-black uppercase tracking-wider transition-colors"
                    >
                      <Plus className="h-4 w-4 text-black" />
                      <span>Add Package</span>
                    </button>
                  </div>

                  {/* Packages Table */}
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#121422] text-slate-400 font-bold uppercase border-b border-white/10">
                        <tr>
                          <th className="p-3">Package</th>
                          <th className="p-3">Diamonds</th>
                          <th className="p-3">Bonus</th>
                          <th className="p-3">Original</th>
                          <th className="p-3">Discounted</th>
                          <th className="p-3">Discount %</th>
                          <th className="p-3">Badge</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-[#090b14]">
                        {packages.map((pkg) => (
                          <tr key={pkg.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-bold text-white">{pkg.name}</td>
                            <td className="p-3 font-mono font-bold text-[#e6ff00]">{pkg.diamonds}</td>
                            <td className="p-3 font-mono text-emerald-400">+{pkg.bonusDiamonds || 0}</td>
                            <td className="p-3 font-mono text-slate-400 line-through">₹{pkg.originalPrice}</td>
                            <td className="p-3 font-mono font-black text-white">₹{pkg.discountedPrice}</td>
                            <td className="p-3 font-bold text-emerald-400">{pkg.discountPercent}%</td>
                            <td className="p-3">
                              {pkg.badge && (
                                <span className="text-[10px] bg-[#9d4edd]/20 text-[#e6ff00] px-1.5 py-0.5 rounded font-extrabold border border-[#9d4edd]/30">
                                  {pkg.badge}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openEditPackage(pkg)}
                                  className="p-1.5 rounded-lg bg-white/10 hover:bg-[#e6ff00] hover:text-black text-slate-300 transition-colors"
                                  title="Edit package price and details"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePackage(pkg.id)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                                  title="Delete package"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Edit/Add Package Form Modal */}
                  {(editingPackage || isAddingNew) && (
                    <div className="rounded-xl bg-[#141626] border border-[#e6ff00]/40 p-5 shadow-2xl mt-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                        <h4 className="text-sm font-black text-white uppercase">
                          {isAddingNew ? 'Create New Diamond Package' : `Edit ${editingPackage?.name}`}
                        </h4>
                        <button
                          onClick={() => {
                            setEditingPackage(null);
                            setIsAddingNew(false);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSavePackage} className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Package Name</label>
                          <input
                            type="text"
                            value={packageFormData.name}
                            onChange={(e) => setPackageFormData({ ...packageFormData, name: e.target.value })}
                            className="w-full rounded-lg bg-[#07080e] border border-white/15 px-3 py-2 text-white font-bold"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Diamonds Amount</label>
                          <input
                            type="number"
                            value={packageFormData.diamonds}
                            onChange={(e) => setPackageFormData({ ...packageFormData, diamonds: Number(e.target.value) })}
                            className="w-full rounded-lg bg-[#07080e] border border-white/15 px-3 py-2 text-white font-mono"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Bonus Diamonds</label>
                          <input
                            type="number"
                            value={packageFormData.bonusDiamonds}
                            onChange={(e) => setPackageFormData({ ...packageFormData, bonusDiamonds: Number(e.target.value) })}
                            className="w-full rounded-lg bg-[#07080e] border border-white/15 px-3 py-2 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Original Price (₹)</label>
                          <input
                            type="number"
                            value={packageFormData.originalPrice}
                            onChange={(e) => setPackageFormData({ ...packageFormData, originalPrice: Number(e.target.value) })}
                            className="w-full rounded-lg bg-[#07080e] border border-white/15 px-3 py-2 text-white font-mono"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Discounted Price (₹)</label>
                          <input
                            type="number"
                            value={packageFormData.discountedPrice}
                            onChange={(e) => setPackageFormData({ ...packageFormData, discountedPrice: Number(e.target.value) })}
                            className="w-full rounded-lg bg-[#07080e] border border-white/15 px-3 py-2 text-white font-mono font-bold text-[#e6ff00]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Badge / Tag</label>
                          <input
                            type="text"
                            value={packageFormData.badge}
                            onChange={(e) => setPackageFormData({ ...packageFormData, badge: e.target.value })}
                            placeholder="e.g. 50% OFF PROMO"
                            className="w-full rounded-lg bg-[#07080e] border border-white/15 px-3 py-2 text-white"
                          />
                        </div>

                        <div className="col-span-2 sm:col-span-3 flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPackage(null);
                              setIsAddingNew(false);
                            }}
                            className="rounded-lg bg-white/10 px-4 py-2 font-bold text-white hover:bg-white/15"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded-lg bg-[#e6ff00] px-5 py-2 font-black text-black uppercase hover:bg-[#d9f200]"
                          >
                            Save Changes & Update Store
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CUSTOMER ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-white uppercase">Customer Orders</h3>
                      <p className="text-xs text-slate-400">View payment confirmation and control diamond delivery status.</p>
                    </div>
                    <button
                      onClick={fetchOrders}
                      className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5 text-xs text-slate-300 w-fit"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${ordersLoading ? 'animate-spin text-[#e6ff00]' : ''}`} />
                      <span>Refresh Orders</span>
                    </button>
                  </div>

                  {/* Filters & Search */}
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      placeholder="Search Order Number, UID, or Email..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="flex-1 rounded-xl bg-[#090b14] border border-white/15 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e6ff00]"
                    />
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="rounded-xl bg-[#090b14] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="paid">Payment: Paid</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Fulfillment: Processing</option>
                      <option value="delivered">Fulfillment: Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  {/* Orders Table */}
                  <div className="rounded-xl border border-white/10 overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-[#121422] text-slate-400 font-bold uppercase border-b border-white/10">
                        <tr>
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Player UID</th>
                          <th className="p-3">Region</th>
                          <th className="p-3">Package</th>
                          <th className="p-3">Diamonds</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Delivery</th>
                          <th className="p-3 text-right">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-[#090b14]">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-6 text-center text-slate-500">
                              No orders match the current filter.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-3 font-mono font-bold text-[#e6ff00]">{ord.orderNumber}</td>
                              <td className="p-3 font-mono text-white">{ord.playerUid}</td>
                              <td className="p-3 text-slate-300">{ord.serverRegion}</td>
                              <td className="p-3 font-bold text-white">{ord.packageName}</td>
                              <td className="p-3 font-black text-[#e6ff00] tabular-nums">{ord.totalDiamonds} 💎</td>
                              <td className="p-3 font-mono font-bold text-white">₹{ord.finalPrice}</td>
                              <td className="p-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                  ord.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {ord.paymentStatus}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                  ord.deliveryStatus === 'delivered'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : ord.deliveryStatus === 'processing'
                                    ? 'bg-[#9d4edd]/25 text-purple-300'
                                    : 'bg-slate-700 text-slate-300'
                                }`}>
                                  {ord.deliveryStatus}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                {ord.deliveryStatus !== 'delivered' ? (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                                    className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-2.5 py-1 text-[11px] font-black uppercase transition-colors"
                                  >
                                    Mark Delivered
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                                    <Check className="h-3 w-3" /> Credited
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: STORE & PROMO SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase">Store & Promotional Settings</h3>
                    <p className="text-xs text-slate-400">Configure promotional text, 50% discount banner, and WhatsApp support.</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Store Headline</label>
                      <input
                        type="text"
                        value={settingsForm.headline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, headline: e.target.value })}
                        className="w-full rounded-xl bg-[#07080e] border border-white/15 px-3 py-2 text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Promotional Banner Announcement</label>
                      <input
                        type="text"
                        value={settingsForm.promoBannerText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, promoBannerText: e.target.value })}
                        className="w-full rounded-xl bg-[#07080e] border border-white/15 px-3 py-2 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Discount Badge Text</label>
                        <input
                          type="text"
                          value={settingsForm.promoBannerDiscount}
                          onChange={(e) => setSettingsForm({ ...settingsForm, promoBannerDiscount: e.target.value })}
                          className="w-full rounded-xl bg-[#07080e] border border-white/15 px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">WhatsApp Support Number</label>
                        <input
                          type="text"
                          value={settingsForm.whatsAppNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsAppNumber: e.target.value })}
                          className="w-full rounded-xl bg-[#07080e] border border-white/15 px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="bannerActive"
                        checked={settingsForm.promoBannerActive}
                        onChange={(e) => setSettingsForm({ ...settingsForm, promoBannerActive: e.target.checked })}
                        className="rounded border-white/20 text-[#e6ff00] focus:ring-0"
                      />
                      <label htmlFor="bannerActive" className="text-white font-medium">
                        Show Top Announcement Banner (50% OFF promo)
                      </label>
                    </div>

                    <div className="pt-4 flex items-center gap-3">
                      <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-[#e6ff00] hover:bg-[#d9f200] px-6 py-2.5 text-xs font-black text-black uppercase tracking-wider transition-colors"
                      >
                        <Save className="h-4 w-4 text-black" />
                        <span>Save Store Settings</span>
                      </button>

                      {settingsSaved && (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" />
                          <span>Settings updated!</span>
                        </span>
                      )}
                    </div>
                  </form>

                  <div className="pt-8 border-t border-white/10">
                    <h4 className="text-sm font-bold text-rose-400 uppercase mb-2">Danger Zone</h4>
                    <p className="text-xs text-slate-400 mb-3">
                      Reset all packages, seed test orders, and configurations back to standard factory defaults.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetStore}
                      className="flex items-center gap-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 px-4 py-2 text-xs font-bold text-rose-300 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset Store State to Factory Defaults</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
