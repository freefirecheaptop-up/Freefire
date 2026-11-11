import { NextResponse } from 'next/server';
import { resetStoreData } from '@/lib/serverStore';

export async function POST() {
  try {
    const data = resetStoreData();
    return NextResponse.json({ success: true, message: 'Store reset to defaults', data });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
