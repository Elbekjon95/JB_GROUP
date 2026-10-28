import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    // Faqat SUPER_ADMIN yoki ADMIN ko'rishi mumkin
    if (user && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        company: true,
        avatar: true,
        permissions: true,
        canManageTariffs: true,
        canManageWarehouses: true,
        canStockMovement: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (user && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Faqat Bosh Rahbar xodim qo\'sha oladi' }, { status: 403 });
    }

    const body = await req.json();
    const { email, password, fullName, role, permissions } = body;

    if (!email || !fullName) {
      return NextResponse.json({ error: 'Email va Ism kiritilishi shart' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password || 'password123', 10);

    const created = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        fullName,
        role: role || 'USER',
        permissions: permissions || {},
        canManageTariffs: !!permissions?.canManageTariffs,
        canManageWarehouses: !!permissions?.canManageWarehouse,
        canStockMovement: permissions?.canStockMovement !== false
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        permissions: true,
        createdAt: true
      }
    });

    return NextResponse.json({ user: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

