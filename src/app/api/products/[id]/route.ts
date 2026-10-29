import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { ProductEditChange } from '@/lib/types';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });
    }

    return NextResponse.json({
      product: {
        ...product,
        entryDate: product.entryDate ? product.entryDate.toISOString().split('T')[0] : ''
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    const { id } = await params;
    const body = await req.json();

    const perms = (user?.permissions as any) || {};
    const canEdit = !user || user.role === 'SUPER_ADMIN' || Boolean(perms.canEditProducts);
    if (user && !canEdit) {
      return NextResponse.json(
        { error: 'Sizda kiritilgan yuk ma\'lumotlarini tahrirlash (to\'g\'rilash) huquqi yo\'q!' },
        { status: 403 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Tahrirlanayotgan yuk bazada topilmadi' }, { status: 404 });
    }

    const newName = body.name !== undefined ? String(body.name).trim() : existing.name;
    const newCategory = body.category !== undefined ? String(body.category).trim() : existing.category;
    const newQuantity = body.quantity !== undefined ? Number(body.quantity) : existing.quantity;
    const newWeightKg = body.weightKg !== undefined ? Number(body.weightKg) : (existing.weightKg || 0);
    const newUnit = body.unit !== undefined ? String(body.unit).trim() : existing.unit;
    const newSectorId = body.sectorId !== undefined ? body.sectorId : existing.sectorId;
    const newSectorName = body.sectorName !== undefined ? body.sectorName : existing.sectorName;
    const newClientName = body.clientName !== undefined ? body.clientName : existing.clientName;
    const newPayerId = body.payerId !== undefined ? body.payerId : existing.clientId;
    const newContractNumber = body.contractNumber !== undefined ? body.contractNumber : existing.contractNumber;
    const newContractEndDate = body.contractEndDate !== undefined ? body.contractEndDate : existing.contractEndDate;
    const newStorageTariffId = body.storageTariffId !== undefined ? body.storageTariffId : existing.storageTariffId;
    const newStorageTariffName = body.storageTariffName !== undefined ? body.storageTariffName : existing.storageTariffName;
    const newStorageTariffRate = body.storageTariffRate !== undefined ? Number(body.storageTariffRate) : existing.storageTariffRate;
    const newDailyRate = body.dailyRatePerUnit !== undefined ? Number(body.dailyRatePerUnit) : existing.dailyRatePerUnit;
    const newNotes = body.notes !== undefined ? body.notes : existing.notes;
    const reason = (body.reason || 'Kirim ma\'lumotlariga tuzatish kiritildi').trim();

    // O'zgarishlarni aniqlash
    const changes: ProductEditChange[] = [];

    if (newName !== existing.name) {
      changes.push({ field: 'name', label: 'Yuk nomi', oldValue: existing.name, newValue: newName });
    }
    if (newSectorName && newSectorName !== existing.sectorName) {
      changes.push({ field: 'sectorName', label: 'Sektor', oldValue: existing.sectorName || '-', newValue: newSectorName });
    }
    if (newQuantity !== existing.quantity) {
      changes.push({ field: 'quantity', label: 'Miqdori (soni)', oldValue: `${existing.quantity} ${existing.unit}`, newValue: `${newQuantity} ${newUnit}` });
    } else if (newUnit !== existing.unit) {
      changes.push({ field: 'unit', label: 'Birligi', oldValue: existing.unit, newValue: newUnit });
    }
    if (newWeightKg !== (existing.weightKg || 0)) {
      changes.push({ field: 'weightKg', label: 'Og\'irligi (kg)', oldValue: `${existing.weightKg || 0} kg`, newValue: `${newWeightKg} kg` });
    }
    if ((newClientName || '') !== (existing.clientName || '')) {
      changes.push({ field: 'clientName', label: 'Mijoz / To\'lovchi', oldValue: existing.clientName || '-', newValue: newClientName || '-' });
    }
    if ((newStorageTariffName || '') !== (existing.storageTariffName || '')) {
      changes.push({ field: 'storageTariffName', label: 'Saqlash tarifi', oldValue: existing.storageTariffName || '-', newValue: newStorageTariffName || '-' });
    }
    if ((newNotes || '') !== (existing.notes || '')) {
      changes.push({ field: 'notes', label: 'Izoh / Hujjat', oldValue: existing.notes || '-', newValue: newNotes || '-' });
    }

    const hasExitedBefore = Array.isArray(existing.exitHistory) && existing.exitHistory.length > 0;
    const now = new Date();
    const tashkentTime = new Date(now.getTime() + 5 * 60 * 60 * 1000);
    const dateStr = tashkentTime.toISOString().slice(0, 10);
    const monthStr = dateStr.slice(0, 7);
    const timeStr = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

    const editorName = user?.fullName || body.editedBy || 'Mas\'ul xodim';
    const editorRole = user?.role || body.editedByRole || 'USER';
    const editorId = user?.id || body.editedById || null;

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: {
          name: newName,
          category: newCategory,
          quantity: newQuantity,
          initialQuantity: hasExitedBefore ? existing.initialQuantity : newQuantity,
          weightKg: newWeightKg,
          initialWeightKg: hasExitedBefore ? existing.initialWeightKg : newWeightKg,
          unit: newUnit,
          sectorId: newSectorId,
          sectorName: newSectorName,
          clientId: newPayerId || null,
          clientName: newClientName,
          contractNumber: newContractNumber,
          contractEndDate: newContractEndDate,
          storageTariffId: newStorageTariffId,
          storageTariffName: newStorageTariffName,
          storageTariffRate: newStorageTariffRate,
          dailyRatePerUnit: newDailyRate,
          notes: newNotes
        }
      });

      // Agar chiqim bo'lmagan bo'lsa, Kirim (IN) harakatini ham moslashtiramiz
      if (!hasExitedBefore) {
        await tx.cargoMovement.updateMany({
          where: { productId: id, type: 'IN' },
          data: {
            productName: newName,
            sectorId: newSectorId || '',
            sectorName: newSectorName || '',
            quantity: newQuantity,
            initialQuantity: newQuantity,
            remainingQuantity: newQuantity,
            unit: newUnit,
            weightKg: newWeightKg,
            initialWeightKg: newWeightKg,
            remainingWeightKg: newWeightKg,
            clientName: newClientName,
            notes: newNotes
          }
        });
      }

      // AuditLog jadvaliga tahrir tarixini yozamiz
      const auditDetails = {
        date: dateStr,
        time: timeStr,
        month: monthStr,
        sectorName: newSectorName || '',
        clientName: newClientName || '',
        reason,
        changes
      };

      const logRecord = await tx.auditLog.create({
        data: {
          userId: editorId,
          userName: editorName,
          userRole: editorRole,
          action: 'PRODUCT_EDIT',
          entity: 'Product',
          entityId: id,
          entityName: newName,
          details: JSON.stringify(auditDetails),
          status: 'Tahrirlandi'
        }
      });

      return {
        updated,
        editLog: {
          id: logRecord.id,
          productId: id,
          productName: newName,
          sectorName: newSectorName || '',
          clientName: newClientName || '',
          userId: editorId || undefined,
          userName: editorName,
          userRole: editorRole,
          date: dateStr,
          time: timeStr,
          month: monthStr,
          reason,
          changes,
          createdAt: logRecord.createdAt.toISOString()
        }
      };
    });

    return NextResponse.json({
      success: true,
      product: {
        ...result.updated,
        entryDate: result.updated.entryDate ? result.updated.entryDate.toISOString().split('T')[0] : ''
      },
      editLog: result.editLog
    });
  } catch (err: any) {
    console.error('Product edit error:', err);
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
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
