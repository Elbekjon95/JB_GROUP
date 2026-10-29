import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { getTashkentDateStr, getTashkentTimeStr, formatOfficialInvoiceNo } from '@/lib/date-utils';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    const perms = (user?.permissions as any) || {};
    if (!user || (user.role !== 'SUPER_ADMIN' && !perms.canStockMovement)) {
      return NextResponse.json({ error: 'Yuk chiqim qilish huquqi yo\'q!' }, { status: 403 });
    }

    const body = await req.json();

    const {
      productId,
      exitQuantity,
      exitWeightKg,
      receiverInn,
      receiverName,
      receiverPerson,
      unloadingService,
      unloadingCost,
      storageTariffName,
      storageBaseCost,
      storageVat,
      storageFormula,
      loadingService,
      loadingCost,
      additionalServices,
      additionalCost,
      totalCost,
      grandTotalCost,
      daysStored,
      notes
    } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Mahsulot tanlanmagan' }, { status: 400 });
    }

    const validExitQty = Number(exitQuantity) || 0;
    const validExitWeight = Number(exitWeightKg) || 0;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Mahsulotni bazadan olish
      const product = await tx.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        throw new Error('Mahsulot bazada topilmadi');
      }

      // 2. Sektor va Xavfli yuk (HAZARDOUS) ruxsatini serverda tekshirish
      if (user.role !== 'SUPER_ADMIN' && product.sectorId) {
        const allowedSectors: string[] = Array.isArray(perms.allowedSectorIds) ? perms.allowedSectorIds : [];
        if (!allowedSectors.includes('ALL') && !allowedSectors.includes(product.sectorId)) {
          throw new Error('Ushbu sektordan yuk chiqarish ruxsatingiz yo\'q!');
        }
        const targetSector = await tx.sector.findUnique({ where: { id: product.sectorId } });
        if (targetSector?.type === 'HAZARDOUS' && !perms.canHandleHazardous) {
          throw new Error('Xavfli yuklar (HAZARDOUS) sektori bilan ishlash ruxsatingiz yo\'q!');
        }
      }

      // 3. Shartnoma muddati tugaganligini serverda tekshirish
      const nowStr = getTashkentDateStr();
      if (product.clientId) {
        const payer = await tx.client.findUnique({ where: { id: product.clientId } });
        if (payer?.contractEndDate && payer.contractEndDate < nowStr) {
          throw new Error(`«${payer.name}» shartnoma muddati (${payer.contractEndDate}) tugagan! Yuk chiqim qilishdan oldin shartnomani yangilang.`);
        }
      }

      if (validExitQty > product.quantity) {
        throw new Error(`Chiqarilayotgan miqdor (${validExitQty}) ombordagi qoldiqdan (${product.quantity}) ko'p bo'lishi mumkin emas!`);
      }

      const remainingQty = Math.max(0, product.quantity - validExitQty);
      const currentWeight = product.weightKg || 0;
      const remainingWeight = Math.max(0, currentWeight - validExitWeight);

      const timeStr = getTashkentTimeStr();
      const invoiceNo = formatOfficialInvoiceNo('NAK-OUT');

      const baseCostNum = Number(totalCost) || 0;
      const grandTotalNum = Number(grandTotalCost || totalCost) || 0;
      // Barcha xizmatlarning (tushirish + saqlash + ortish + qo'shimcha) jami 12% QQSi
      const totalVatNum = grandTotalNum > baseCostNum
        ? (grandTotalNum - baseCostNum)
        : (Number(storageVat) || Math.round(baseCostNum * 0.12));

      const exitRecord = {
        id: `exit-${Date.now()}`,
        invoiceNo,
        exitDate: nowStr,
        exitTime: timeStr,
        quantity: validExitQty,
        weightKg: validExitWeight,
        remainingQuantity: remainingQty,
        remainingWeightKg: remainingWeight,
        exitedBy: user?.fullName || 'Omborchi',
        exitedByRole: user?.role || 'USER',
        daysStored: Number(daysStored) || 0,
        storageBaseCost: Number(storageBaseCost) || 0,
        storageVat: Number(storageVat) || 0,
        additionalServices: additionalServices || [],
        additionalCost: Number(additionalCost) || 0,
        totalCost: grandTotalNum,
        receiverInn: receiverInn || '',
        receiverName: receiverName || '',
        receiverPerson: receiverPerson || '',
        unloadingService: unloadingService || '',
        unloadingCost: Number(unloadingCost) || 0,
        storageTariffName: storageTariffName || '',
        storageFormula: storageFormula || '',
        loadingService: loadingService || '',
        loadingCost: Number(loadingCost) || 0,
        notes: notes || ''
      };

      const existingHistory = Array.isArray(product.exitHistory) ? product.exitHistory : [];
      const updatedHistory = [...existingHistory, exitRecord];

      // 4. Tovar 100% chiqib ketsa ham bazadan DELETE qilmasdan, quantity: 0 qilib arxivda saqlaymiz (exitHistory yo'qolmasligi uchun!)
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          quantity: remainingQty,
          weightKg: remainingQty <= 0 ? 0 : remainingWeight,
          exitHistory: updatedHistory as any
        }
      });

      // 5. Harakatlar tarixiga Chiqim (OUT) yozish
      const movement = await tx.cargoMovement.create({
        data: {
          invoiceNo,
          productId: product.id,
          sectorId: product.sectorId || '',
          sectorName: product.sectorName || '',
          productName: product.name,
          type: 'OUT',
          quantity: validExitQty,
          initialQuantity: product.initialQuantity,
          remainingQuantity: remainingQty,
          unit: product.unit,
          weightKg: validExitWeight,
          initialWeightKg: product.initialWeightKg,
          remainingWeightKg: remainingQty <= 0 ? 0 : remainingWeight,
          userName: user?.fullName || 'Omborchi',
          userRole: user?.role || 'USER',
          placedBy: product.placedBy || null,
          placedDate: product.entryDate ? getTashkentDateStr(product.entryDate) : null,
          date: nowStr,
          time: timeStr,
          notes: notes || 'Chiqim amali muvaffaqiyatli bajarildi',
          clientName: product.clientName || null,
          unloadingType: unloadingService || null,
          obrabotkaCostUZS: Number(unloadingCost) || 0,
          storageCostUZS: (Number(storageBaseCost) || 0) + (Number(storageVat) || 0),
          storageTariffName: storageTariffName || null,
          storageFormula: storageFormula || null,
          loadingType: loadingService || null,
          loadingCostUZS: Number(loadingCost) || 0,
          additionalCostUZS: Number(additionalCost) || 0,
          servicesApplied: additionalServices || [],
          daysStored: Number(daysStored) || 0,
          totalCostUZS: baseCostNum,
          vatTotalUZS: totalVatNum,
          grandTotalUZS: grandTotalNum,
          receiverInn: receiverInn || null,
          receiverName: receiverName || null,
          receiverPerson: receiverPerson || null,
          paymentStatus: 'PENDING'
        }
      });

      return {
        product: remainingQty > 0 ? {
          ...updatedProduct,
          entryDate: updatedProduct.entryDate ? getTashkentDateStr(updatedProduct.entryDate) : ''
        } : null,
        movement,
        isFullyExited: remainingQty <= 0
      };
    });

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (err: any) {
    console.error('Chiqim error:', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
