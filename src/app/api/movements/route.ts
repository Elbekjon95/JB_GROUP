import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const movements = await prisma.cargoMovement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ movements });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, paymentStatus, paidAt } = body;

    const updated = await prisma.cargoMovement.update({
      where: { id },
      data: {
        paymentStatus,
        paidAt: paidAt || new Date().toISOString()
      }
    });

    return NextResponse.json({ movement: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

