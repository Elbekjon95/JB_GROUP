import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

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
    const user = await getUserFromRequest(req);
    const perms = (user?.permissions as any) || {};
    if (!user || (user.role !== 'SUPER_ADMIN' && !perms.canManageWarehouse && !perms.canLinkTariffs)) {
      return NextResponse.json({ error: 'Omborni sozlash huquqi yo\'q!' }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, city, address, totalCapacity, manager, phone, sector } = body;

    // Agar alohida sektor yuborilgan bo'lsa, uni PostgreSQL da upsert qilamiz
    if (sector && sector.id) {
      await prisma.sector.upsert({
        where: { id: sector.id },
        update: {
          name: sector.name,
          code: sector.code || null,
          type: sector.type || 'OTHER',
          capacity: Number(sector.capacity) || 0,
          subSections: sector.subSections || null,
          temperature: sector.temperature || null,
          description: sector.description || null,
          allowedCargoTypes: Array.isArray(sector.allowedCargoTypes) ? sector.allowedCargoTypes : [],
          status: sector.status || 'Faol',
          tariffId: sector.tariffId || null,
          tariffName: sector.tariffName || null
        },
        create: {
          id: sector.id,
          warehouseId: id || 'wh-main',
          name: sector.name,
          code: sector.code || null,
          type: sector.type || 'OTHER',
          capacity: Number(sector.capacity) || 0,
          subSections: sector.subSections || null,
          temperature: sector.temperature || null,
          description: sector.description || null,
          allowedCargoTypes: Array.isArray(sector.allowedCargoTypes) ? sector.allowedCargoTypes : [],
          status: sector.status || 'Faol',
          tariffId: sector.tariffId || null,
          tariffName: sector.tariffName || null
        }
      });
    }

    if (name && id) {
      await prisma.warehouse.update({
        where: { id },
        data: {
          name,
          city,
          address,
          totalCapacity: Number(totalCapacity),
          manager,
          phone
        }
      });
    }

    const updated = await prisma.warehouse.findUnique({
      where: { id: id || 'wh-main' },
      include: { sectors: { orderBy: { name: 'asc' } } }
    });

    return NextResponse.json({ warehouse: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
