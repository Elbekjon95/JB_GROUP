import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { getTashkentDateStr, getTashkentTimeStr } from '@/lib/date-utils';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    const movements = await prisma.cargoMovement.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (!user || user.role === 'SUPER_ADMIN') {
      return NextResponse.json({ movements });
    }

    const perms = (user.permissions as any) || {};
    const allowedSectors: string[] = Array.isArray(perms.allowedSectorIds) ? perms.allowedSectorIds : [];
    const sectors = await prisma.sector.findMany({
      select: { id: true, name: true, type: true }
    });

    const permittedSectors = sectors.filter(s => {
      if (s.type === 'HAZARDOUS' && !perms.canHandleHazardous && user.role !== 'ACCOUNTANT') {
        return false;
      }
      if (!allowedSectors.includes('ALL') && !allowedSectors.includes(s.id)) {
        return false;
      }
      return true;
    });

    const permittedIds = new Set(permittedSectors.map(s => s.id));
    const permittedNames = new Set(permittedSectors.map(s => s.name.toLowerCase().trim()));

    const filtered = movements.filter(m => {
      if (m.sectorId) {
        return permittedIds.has(m.sectorId);
      }
      const secName = (m.sectorName || '').toLowerCase().trim();
      return permittedNames.has(secName);
    });

    return NextResponse.json({ movements: filtered });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    const perms = (user?.permissions as any) || {};
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ACCOUNTANT' && !perms.canViewFinances)) {
      return NextResponse.json({ error: 'To\'lov holatini o\'zgartirish huquqi yo\'q!' }, { status: 403 });
    }

    const body = await req.json();
    const { id, paymentStatus, paidAt } = body;

    const updated = await prisma.cargoMovement.update({
      where: { id },
      data: {
        paymentStatus,
        paidAt: paymentStatus === 'PAID'
          ? (paidAt || `${getTashkentDateStr()} ${getTashkentTimeStr()}`)
          : null
      }
    });

    return NextResponse.json({ movement: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
