import { NextRequest, NextResponse } from 'next/server';
import { getPackages, savePackages } from '@/lib/serverStore';
import { DiamondPackage } from '@/lib/types';

export async function GET() {
  try {
    const packages = getPackages();
    return NextResponse.json({ success: true, packages });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, packageData, packages } = body;

    // Full replacement / reordering
    if (packages && Array.isArray(packages)) {
      const updated = savePackages(packages);
      return NextResponse.json({ success: true, packages: updated });
    }

    const currentPackages = getPackages();

    if (action === 'add') {
      const newPackage: DiamondPackage = {
        ...packageData,
        id: packageData.id || `pack-${Date.now()}`,
        discountPercent: packageData.originalPrice > 0 
          ? Math.round(((packageData.originalPrice - packageData.discountedPrice) / packageData.originalPrice) * 100)
          : 0,
      };
      const updated = [...currentPackages, newPackage];
      savePackages(updated);
      return NextResponse.json({ success: true, packages: updated });
    }

    if (action === 'edit') {
      const updated = currentPackages.map(p => {
        if (p.id === packageData.id) {
          const originalPrice = Number(packageData.originalPrice) || p.originalPrice;
          const discountedPrice = Number(packageData.discountedPrice) || p.discountedPrice;
          const discountPercent = originalPrice > 0
            ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
            : 0;

          return {
            ...p,
            ...packageData,
            originalPrice,
            discountedPrice,
            discountPercent,
          };
        }
        return p;
      });
      savePackages(updated);
      return NextResponse.json({ success: true, packages: updated });
    }

    if (action === 'delete') {
      const updated = currentPackages.filter(p => p.id !== packageData.id);
      savePackages(updated);
      return NextResponse.json({ success: true, packages: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
