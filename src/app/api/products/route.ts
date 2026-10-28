import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { warehouseId: 'wh-main' },
      orderBy: { createdAt: 'desc' }
    });

    // Format products for frontend consumption
    const formatted = products.map(p => ({
      ...p,
      entryDate: p.entryDate ? p.entryDate.toISOString().split('T')[0] : '',
    }));

    return NextResponse.json({ products: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();

    const {
      name,
      category,
      quantity,
      unit,
      weightKg,
      dailyRatePerUnit,
      storageTariffId,
      storageTariffName,
      storageTariffRate,
      storageTariffItemNo,
      storageTariffUnit,
      sectorId,
      sectorName,
      warehouseId,
      payerId,
      clientName,
      contractNumber,
      contractEndDate,
      entryDate,
      entryTime,
      placedBy,
      placedByRole,
      notes,
      obrabotkaService,
      obrabotkaCost,
      obrabotkaVat,
      kirimAdditionalServices
    } = body;

    const numQty = Number(quantity) || 0;
    const numWeight = Number(weightKg) || 0;

    // Tranzaksiya bilan bajariladi: tovar qo'shiladi va kirim harakati yoziladi
    const result = await prisma.$transaction(async (tx) => {
      // 1. Tovar yaratish
      const newProduct = await tx.product.create({
        data: {
          name,
          category: category || 'Umumiy',
          initialQuantity: numQty,
          quantity: numQty,
          unit: unit || 'dona',
          initialWeightKg: numWeight,
          weightKg: numWeight,
          dailyRatePerUnit: Number(dailyRatePerUnit) || 0,
          storageTariffId: storageTariffId || null,
          storageTariffName: storageTariffName || null,
          storageTariffRate: Number(storageTariffRate) || 0,
          storageTariffItemNo: Number(storageTariffItemNo) || null,
          storageTariffUnit: storageTariffUnit || null,
          sectorId: sectorId || null,
          sectorName: sectorName || null,
          warehouseId: warehouseId || null,
          clientId: payerId || null,
          clientName: clientName || null,
          contractNumber: contractNumber || null,
          contractEndDate: contractEndDate || null,
          entryDate: entryDate ? new Date(entryDate) : new Date(),
          entryTime: entryTime || new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
          placedBy: placedBy || user?.fullName || 'Omborchi',
          placedByRole: placedByRole || user?.role || 'USER',
          notes: notes || null,
          obrabotkaService: obrabotkaService || null,
          obrabotkaCost: Number(obrabotkaCost) || 0,
          obrabotkaVat: Number(obrabotkaVat) || 0,
          kirimAdditionalServices: kirimAdditionalServices || [],
          exitHistory: []
        }
      });

      // 2. Harakatlar tarixiga Kirim (IN) yozish
      const nowStr = new Date().toISOString().split('T')[0];
      const timeStr = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
      const invoiceNo = `NAK-IN-${Date.now().toString().slice(-6)}`;

      const totalKirimCost = (Number(obrabotkaCost) || 0) + (Number(obrabotkaVat) || 0);

      const movement = await tx.cargoMovement.create({
        data: {
          invoiceNo,
          productId: newProduct.id,
          sectorId: sectorId || '',
          sectorName: sectorName || '',
          productName: name,
          type: 'IN',
          quantity: numQty,
          initialQuantity: numQty,
          remainingQuantity: numQty,
          unit: unit || 'dona',
          weightKg: numWeight,
          initialWeightKg: numWeight,
          remainingWeightKg: numWeight,
          userName: placedBy || user?.fullName || 'Omborchi',
          userRole: placedByRole || user?.role || 'USER',
          placedBy: placedBy || user?.fullName || 'Omborchi',
          placedDate: entryDate || nowStr,
          date: entryDate || nowStr,
          time: entryTime || timeStr,
          notes: notes || 'Kirim amali muvaffaqiyatli bajarildi',
          clientName: clientName || null,
          unloadingType: obrabotkaService || null,
          obrabotkaCostUZS: totalKirimCost,
          storageTariffName: storageTariffName || null,
          paymentStatus: 'PENDING'
        }
      });

      return { product: newProduct, movement };
    });

    return NextResponse.json({
      success: true,
      product: {
        ...result.product,
        entryDate: result.product.entryDate ? result.product.entryDate.toISOString().split('T')[0] : ''
      },
      movement: result.movement
    });
  } catch (err: any) {
    console.error('Kirim error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
