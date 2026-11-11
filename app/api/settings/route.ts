import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/serverStore';

export async function GET() {
  try {
    const settings = getSettings();
    // Exclude private secrets if any
    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
