import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payers = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ payers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, inn, contractNumber, contractStartDate, contractEndDate, contactPerson, phone, notes } = body;

    const newPayer = await prisma.client.create({
      data: {
        name,
        inn,
        contractNumber,
        contractStartDate,
        contractEndDate,
        contactPerson,
        phone,
        notes
      }
    });

    return NextResponse.json({ payer: newPayer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

