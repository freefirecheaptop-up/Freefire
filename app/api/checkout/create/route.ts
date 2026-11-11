import { NextRequest, NextResponse } from 'next/server';
import { getPackages, getCoupons, createOrder } from '@/lib/serverStore';
import { Order, PaymentMethod } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      playerUid,
      serverRegion,
      playerNickname,
      packageId,
      couponCode,
      customerEmail,
      customerPhone,
      paymentMethod = 'upi_qr'
    } = body;

    // Validate UID
    if (!playerUid || playerUid.length < 7 || !/^\d+$/.test(playerUid)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid numeric Free Fire Player UID (8-12 digits).' },
        { status: 400 }
      );
    }

    // Find package
    const packages = getPackages();
    const selectedPackage = packages.find(p => p.id === packageId);
    if (!selectedPackage) {
      return NextResponse.json({ success: false, error: 'Selected diamond package was not found.' }, { status: 404 });
    }

    // Calculate coupon discount
    let couponDiscount = 0;
    let appliedCoupon = '';
    if (couponCode && couponCode.trim()) {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupons = getCoupons();
      const match = coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);

      if (match) {
        if (selectedPackage.discountedPrice >= match.minOrder) {
          if (match.discountPercent) {
            const rawDiscount = (selectedPackage.discountedPrice * match.discountPercent) / 100;
            couponDiscount = match.maxDiscount ? Math.min(rawDiscount, match.maxDiscount) : rawDiscount;
          } else if (match.discountAmount) {
            couponDiscount = match.discountAmount;
          }
          appliedCoupon = match.code;
        }
      }
    }

    const subtotalPrice = selectedPackage.discountedPrice;
    const finalPrice = Math.max(1, Math.round(subtotalPrice - couponDiscount));
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `DXS-${randomSuffix}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      playerUid,
      serverRegion: serverRegion || 'India (IND)',
      playerNickname: playerNickname || `Survivor_${playerUid.slice(-4)}`,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      diamonds: selectedPackage.diamonds,
      bonusDiamonds: selectedPackage.bonusDiamonds || 0,
      totalDiamonds: selectedPackage.diamonds + (selectedPackage.bonusDiamonds || 0),
      originalPrice: selectedPackage.originalPrice,
      subtotalPrice,
      discountAmount: selectedPackage.originalPrice - selectedPackage.discountedPrice,
      couponCode: appliedCoupon || undefined,
      couponDiscount,
      finalPrice,
      currency: '₹',
      customerEmail: customerEmail || 'customer@player.com',
      customerPhone: customerPhone || '+91 98765 43210',
      paymentMethod: paymentMethod as PaymentMethod,
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
      paymentTransactionId: `rzp_tx_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fulfillmentNotes: 'Awaiting payment confirmation via Razorpay/UPI gateway.',
    };

    const savedOrder = createOrder(newOrder);

    // Provide Razorpay checkout metadata
    const razorpayOptions = {
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dxstore_gateway',
      orderId: savedOrder.orderNumber,
      amount: finalPrice * 100, // paise
      currency: 'INR',
      name: 'DIAMOND X STORE',
      description: `${savedOrder.packageName} Top-Up for UID ${savedOrder.playerUid}`,
      prefill: {
        email: savedOrder.customerEmail,
        contact: savedOrder.customerPhone,
      },
      notes: {
        playerUid: savedOrder.playerUid,
        serverRegion: savedOrder.serverRegion,
      }
    };

    return NextResponse.json({
      success: true,
      order: savedOrder,
      razorpay: razorpayOptions,
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
