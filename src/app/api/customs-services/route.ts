import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { INITIAL_CUSTOMS_SERVICES } from '../../../lib/initial-data';

export async function GET() {
  try {
    let services = await prisma.customsService.findMany({
      orderBy: { itemNo: 'asc' }
    });

    // Agar bazada rasmiy 30+ ta preyskurant xizmatlari to'liq bo'lmasa, avtomatik to'ldirish
    if (services.length === 0) {
      for (const s of INITIAL_CUSTOMS_SERVICES) {
        await prisma.customsService.upsert({
          where: { id: s.id },
          update: {},
          create: {
            id: s.id,
            itemNo: s.itemNo,
            category: s.category,
            name: s.name,
            nameUz: s.nameUz,
            unit: s.unit,
            basePrice: s.basePrice,
            vatRate: s.vatRate,
            vatAmount: s.vatAmount,
            totalPrice: s.totalPrice,
            description: s.description || ''
          }
        });
      }
      services = await prisma.customsService.findMany({
        orderBy: { itemNo: 'asc' }
      });
    }

    return NextResponse.json({ services });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    const perms = (user?.permissions as any) || {};
    const canManageTariffs = !user || user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.canManageTariffs || Boolean(perms.canManageTariffs);
    if (!canManageTariffs) {
      return NextResponse.json({ error: 'Tarif qo\'shish huquqi yo\'q!' }, { status: 403 });
    }

    const body = await req.json();
    const { itemNo, category, name, nameUz, unit, basePrice, description } = body;

    const base = Number(basePrice) || 0;
    const vat = Math.round(base * 0.12);

    const created = await prisma.customsService.create({
      data: {
        itemNo: Number(itemNo),
        category,
        name,
        nameUz: nameUz || name,
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
    const user = await getUserFromRequest(req);
    const perms = (user?.permissions as any) || {};
    const canManageTariffs = !user || user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.canManageTariffs || Boolean(perms.canManageTariffs);
    if (!canManageTariffs) {
      return NextResponse.json({ error: 'Tarif narxini o\'zgartirish huquqi yo\'q!' }, { status: 403 });
    }

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
        nameUz: nameUz || name,
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

export async function DELETE(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    const perms = (user?.permissions as any) || {};
    const canManageTariffs = !user || user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.canManageTariffs || Boolean(perms.canManageTariffs);
    if (!canManageTariffs) {
      return NextResponse.json({ error: 'Tarifni o\'chirish huquqi yo\'q!' }, { status: 403 });
    }

    const url = new URL(req.url);
    let id = url.searchParams.get('id');
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: 'Tarif ID ko\'rsatilmadi!' }, { status: 400 });
    }

    await prisma.customsService.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
