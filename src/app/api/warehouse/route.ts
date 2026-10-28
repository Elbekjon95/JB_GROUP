import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let warehouse = await prisma.warehouse.findUnique({
      where: { id: 'wh-main' },
      include: {
        sectors: {
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!warehouse) {
      warehouse = await prisma.warehouse.findFirst({
        include: {
          sectors: {
            orderBy: { name: 'asc' }
          }
        }
      });
    }

    if (!warehouse) {
      return NextResponse.json({ error: 'Ombor topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ warehouse });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, city, address, totalCapacity, manager, phone } = body;

    const updated = await prisma.warehouse.update({
      where: { id },
      data: {
        name,
        city,
        address,
        totalCapacity: Number(totalCapacity),
        manager,
        phone
      },
      include: { sectors: true }
    });

    return NextResponse.json({ warehouse: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
