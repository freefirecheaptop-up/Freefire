export interface DiamondPackage {
  id: string;
  name: string;
  diamonds: number;
  bonusDiamonds: number;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  badge?: string;
  popular?: boolean;
  bestValue?: boolean;
  inStock: boolean;
  category: 'instant' | 'weekly' | 'monthly' | 'special';
  description?: string;
}

export type PaymentMethod = 'upi_qr' | 'upi_apps' | 'card' | 'netbanking' | 'razorpay_direct';

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
export type DeliveryStatus = 'pending' | 'verifying_uid' | 'processing' | 'delivered' | 'failed';

export interface Order {
  id: string;
  orderNumber: string; // e.g., DXS-849201
  playerUid: string;
  serverRegion: string;
  playerNickname: string;
  packageId: string;
  packageName: string;
  diamonds: number;
  bonusDiamonds: number;
  totalDiamonds: number;
  originalPrice: number;
  subtotalPrice: number;
  discountAmount: number;
  couponCode?: string;
  couponDiscount: number;
  finalPrice: number;
  currency: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  paymentTransactionId?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  fulfillmentNotes?: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  headline: string;
  subheadline: string;
  promoBannerText: string;
  promoBannerActive: boolean;
  promoBannerDiscount: string;
  currencySymbol: string;
  currencyCode: string;
  whatsAppNumber: string;
  supportEmail: string;
  razorpayKeyId: string;
  isTestMode: boolean;
  minUidLength: number;
  maxUidLength: number;
  deliverySpeedEstimate: string;
}

export interface Testimonial {
  id: string;
  playerName: string;
  uidMasked: string;
  rating: number;
  packagePurchased: string;
  diamonds: number;
  comment: string;
  timeAgo: string;
  server: string;
  verified: boolean;
}

export interface ServerRegion {
  id: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}
