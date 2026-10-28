import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

