import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
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
      storageTariffId,
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

      if (validExitQty > product.quantity) {
        throw new Error(`Chiqarilayotgan miqdor (${validExitQty}) ombordagi qoldiqdan (${product.quantity}) ko'p bo'lishi mumkin emas!`);
      }

      const remainingQty = Math.max(0, product.quantity - validExitQty);
      const currentWeight = product.weightKg || 0;
      const remainingWeight = Math.max(0, currentWeight - validExitWeight);

      const nowStr = new Date().toISOString().split('T')[0];
      const timeStr = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
      const invoiceNo = `NAK-OUT-${Date.now().toString().slice(-6)}`;

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
        totalCost: Number(grandTotalCost || totalCost) || 0,
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

      let updatedProduct: any = null;

      if (remainingQty <= 0) {
        // Tovar to'liq chiqib ketgan bo'lsa, ombordan o'chirish yoki qoldig'ini 0 qilish
        // Biz arxiv/tarix uchun qoldig'ini 0 qilib saqlashimiz yoki o'chirishimiz mumkin.
        // Hozirgi frontend to'liq chiqqanda ombor ro'yxatidan olib tashlaydi.
        await tx.product.delete({
          where: { id: productId }
        });
      } else {
        // Qisman chiqim: qoldiq kamayadi
        updatedProduct = await tx.product.update({
          where: { id: productId },
          data: {
            quantity: remainingQty,
            weightKg: remainingWeight,
            exitHistory: updatedHistory as any
          }
        });
      }

      // 2. Harakatlar tarixiga Chiqim (OUT) yozish
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
          remainingWeightKg: remainingWeight,
          userName: user?.fullName || 'Omborchi',
          userRole: user?.role || 'USER',
          placedBy: product.placedBy || null,
          placedDate: product.entryDate ? product.entryDate.toISOString().split('T')[0] : null,
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
          totalCostUZS: Number(totalCost) || 0,
          vatTotalUZS: Number(storageVat) || 0,
          grandTotalUZS: Number(grandTotalCost || totalCost) || 0,
          receiverInn: receiverInn || null,
          receiverName: receiverName || null,
          receiverPerson: receiverPerson || null,
          paymentStatus: 'PENDING'
        }
      });

      return {
        product: updatedProduct ? {
          ...updatedProduct,
          entryDate: updatedProduct.entryDate ? updatedProduct.entryDate.toISOString().split('T')[0] : ''
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

