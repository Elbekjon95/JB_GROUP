import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi!' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.client.update({
      where: { id },
      data: {
        name: body.name,
        inn: body.inn,
        contractNumber: body.contractNumber,
        contractStartDate: body.contractStartDate,
        contractEndDate: body.contractEndDate,
        contactPerson: body.contactPerson,
        phone: body.phone,
        notes: body.notes
      }
    });

    return NextResponse.json({ payer: updated });
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
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Shartnomani o\'chirish huquqi yo\'q!' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.client.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
