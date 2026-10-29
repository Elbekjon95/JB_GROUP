import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const tariffs = await prisma.tariff.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json({ tariffs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    const perms = (user?.permissions as any) || {};
    if (!user || (user.role !== 'SUPER_ADMIN' && !perms.canManageTariffs)) {
      return NextResponse.json({ error: 'Tarif yaratish huquqi yo\'q!' }, { status: 403 });
    }

    const body = await req.json();
    const created = await prisma.tariff.create({
      data: {
        name: body.name,
        targetSectorType: body.targetSectorType || null,
        unitName: body.unitName || 'dona',
        pricePerUnitDay: Number(body.pricePerUnitDay) || 0,
        currency: body.currency || 'UZS',
        minDays: Number(body.minDays) || 1,
        features: body.features || []
      }
    });
    return NextResponse.json({ tariff: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    const perms = (user?.permissions as any) || {};
    if (!user || (user.role !== 'SUPER_ADMIN' && !perms.canManageTariffs)) {
      return NextResponse.json({ error: 'Tarifni tahrirlash huquqi yo\'q!' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await prisma.tariff.upsert({
      where: { id: body.id || 'new-tariff' },
      update: {
        name: body.name,
        targetSectorType: body.targetSectorType || null,
        unitName: body.unitName || 'dona',
        pricePerUnitDay: Number(body.pricePerUnitDay) || 0,
        currency: body.currency || 'UZS',
        minDays: Number(body.minDays) || 1,
        features: body.features || []
      },
      create: {
        id: body.id,
        name: body.name,
        targetSectorType: body.targetSectorType || null,
        unitName: body.unitName || 'dona',
        pricePerUnitDay: Number(body.pricePerUnitDay) || 0,
        currency: body.currency || 'UZS',
        minDays: Number(body.minDays) || 1,
        features: body.features || []
      }
    });
    return NextResponse.json({ tariff: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
