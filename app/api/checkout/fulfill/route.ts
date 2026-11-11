import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus, getOrderByIdOrUid } from '@/lib/serverStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const order = getOrderByIdOrUid(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentStatus !== 'paid') {
      return NextResponse.json({
        success: false,
        error: 'Order is not marked as paid. Cannot fulfill unverified top-ups.'
      }, { status: 400 });
    }

    const notes = `Official Free Fire Direct UID API: ${order.totalDiamonds} Diamonds successfully credited to UID ${order.playerUid} (${order.serverRegion}). In-game mail confirmed.`;

    const updated = updateOrderStatus(
      order.id,
      'paid',
      'delivered',
      notes
    );

    return NextResponse.json({
      success: true,
      message: 'Diamonds successfully credited to Player UID.',
      order: updated,
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
