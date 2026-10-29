import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { getTashkentDateStr, getTashkentTimeStr, formatOfficialInvoiceNo } from '@/lib/date-utils';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    const products = await prisma.product.findMany({
      where: {
        warehouseId: 'wh-main',
        quantity: { gt: 0 }
      },
      include: {
        sector: { select: { id: true, type: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const filtered = products.filter(p => {
      if (!user || user.role === 'SUPER_ADMIN') return true;
      const perms = (user.permissions as any) || {};
      if (p.sector?.type === 'HAZARDOUS' && !perms.canHandleHazardous && user.role !== 'ACCOUNTANT') {
        return false;
      }
      const allowedSectors: string[] = Array.isArray(perms.allowedSectorIds) ? perms.allowedSectorIds : [];
      if (!allowedSectors.includes('ALL') && (!p.sectorId || !allowedSectors.includes(p.sectorId))) {
        return false;
      }
      return true;
    });

    const formatted = filtered.map(({ sector, ...p }) => ({
      ...p,
      entryDate: p.entryDate ? getTashkentDateStr(p.entryDate) : '',
    }));

    return NextResponse.json({ products: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    const perms = (user?.permissions as any) || {};
    if (!user || (user.role !== 'SUPER_ADMIN' && !perms.canStockMovement)) {
      return NextResponse.json({ error: 'Yuk kirim qilish huquqi yo\'q!' }, { status: 403 });
    }

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

    // 1. Sektor va Xavfli yuk (HAZARDOUS) ruxsatini serverda tekshirish
    if (user.role !== 'SUPER_ADMIN' && sectorId) {
      const allowedSectors: string[] = Array.isArray(perms.allowedSectorIds) ? perms.allowedSectorIds : [];
      if (!allowedSectors.includes('ALL') && !allowedSectors.includes(sectorId)) {
        return NextResponse.json({ error: 'Tanlangan ombor sektoriga yuk joylashtirish ruxsatingiz yo\'q!' }, { status: 403 });
      }
      const targetSector = await prisma.sector.findUnique({ where: { id: sectorId } });
      if (targetSector?.type === 'HAZARDOUS' && !perms.canHandleHazardous) {
        return NextResponse.json({ error: 'Xavfli yuklar (HAZARDOUS) sektori bilan ishlash ruxsatingiz yo\'q!' }, { status: 403 });
      }
    }

    // 2. Shartnoma muddati tugaganligini serverda tekshirish
    const todayStr = getTashkentDateStr();
    if (payerId) {
      const payer = await prisma.client.findUnique({ where: { id: payerId } });
      if (payer?.contractEndDate && payer.contractEndDate < todayStr) {
        return NextResponse.json(
          { error: `«${payer.name}» shartnoma muddati (${payer.contractEndDate}) tugagan!` },
          { status: 400 }
        );
      }
    }

    const numQty = Number(quantity) || 0;
    const numWeight = Number(weightKg) || 0;

    // Tranzaksiya bilan bajariladi: tovar qo'shiladi va kirim harakati yoziladi
    const result = await prisma.$transaction(async (tx) => {
      const nowStr = entryDate || getTashkentDateStr();
      const timeStr = entryTime || getTashkentTimeStr();
      const invoiceNo = formatOfficialInvoiceNo('NAK-IN');

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
          warehouseId: warehouseId || 'wh-main',
          clientId: payerId || null,
          clientName: clientName || null,
          contractNumber: contractNumber || null,
          contractEndDate: contractEndDate || null,
          entryDate: new Date(`${nowStr}T00:00:00+05:00`),
          entryTime: timeStr,
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
          placedDate: nowStr,
          date: nowStr,
          time: timeStr,
          notes: notes || 'Kirim amali muvaffaqiyatli bajarildi',
          clientName: clientName || null,
          unloadingType: obrabotkaService || null,
          obrabotkaCostUZS: totalKirimCost,
          vatTotalUZS: Number(obrabotkaVat) || 0,
          totalCostUZS: Number(obrabotkaCost) || 0,
          grandTotalUZS: totalKirimCost,
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
        entryDate: result.product.entryDate ? getTashkentDateStr(result.product.entryDate) : ''
      },
      movement: result.movement
    });
  } catch (err: any) {
    console.error('Kirim error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
