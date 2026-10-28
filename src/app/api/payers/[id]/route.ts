import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const { id } = await params;
    await prisma.client.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

