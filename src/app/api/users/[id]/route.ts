import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Faqat Bosh Rahbar tahrirlay oladi' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const dataToUpdate: any = {
      fullName: body.fullName,
      email: body.email ? body.email.trim().toLowerCase() : undefined,
      role: body.role,
      permissions: body.permissions,
      canManageTariffs: !!body.permissions?.canManageTariffs,
      canManageWarehouses: !!body.permissions?.canManageWarehouse,
      canStockMovement: body.permissions?.canStockMovement !== false
    };

    if (body.password && body.password.trim().length > 0) {
      dataToUpdate.password = await bcrypt.hash(body.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        permissions: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Faqat Bosh Rahbar o\'chira oladi' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

