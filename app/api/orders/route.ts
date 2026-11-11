import { NextRequest, NextResponse } from 'next/server';
import { getOrders, updateOrderStatus, getOrderByIdOrUid } from '@/lib/serverStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const status = searchParams.get('status');

    let orders = getOrders();

    if (query) {
      const match = getOrderByIdOrUid(query);
      if (match) {
        return NextResponse.json({ success: true, order: match, orders: [match] });
      }
      return NextResponse.json({ success: true, order: null, orders: [] });
    }

    if (status && status !== 'all') {
      orders = orders.filter(o => o.deliveryStatus === status || o.paymentStatus === status);
    }

    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentStatus, deliveryStatus, fulfillmentNotes } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId is required' }, { status: 400 });
    }

    const updated = updateOrderStatus(orderId, paymentStatus, deliveryStatus, fulfillmentNotes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
