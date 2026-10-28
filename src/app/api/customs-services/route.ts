import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.customsService.findMany({
      orderBy: { itemNo: 'asc' }
    });
    return NextResponse.json({ services });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemNo, category, name, nameUz, unit, basePrice, description } = body;

    const base = Number(basePrice) || 0;
    const vat = Math.round(base * 0.12);

    const created = await prisma.customsService.create({
      data: {
        itemNo: Number(itemNo),
        category,
        name,
        nameUz: nameUz || '',
        unit,
        basePrice: base,
        vatRate: 0.12,
        vatAmount: vat,
        totalPrice: base + vat,
        description: description || ''
      }
    });

    return NextResponse.json({ service: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, itemNo, category, name, nameUz, unit, basePrice, description } = body;

    const base = Number(basePrice) || 0;
    const vat = Math.round(base * 0.12);

    const updated = await prisma.customsService.update({
      where: { id },
      data: {
        itemNo: Number(itemNo),
        category,
        name,
        nameUz: nameUz || '',
        unit,
        basePrice: base,
        vatRate: 0.12,
        vatAmount: vat,
        totalPrice: base + vat,
        description: description || ''
      }
    });

    return NextResponse.json({ service: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

