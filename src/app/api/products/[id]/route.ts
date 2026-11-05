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
    const canEdit = !user || user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || Boolean(perms.canEditProducts) || (user.canStockMovement && user.role !== 'ACCOUNTANT');
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
    const newEntryDate = body.entryDate !== undefined && String(body.entryDate).trim() ? String(body.entryDate).trim() : undefined;
    const newEntryTime = body.entryTime !== undefined && String(body.entryTime).trim() ? String(body.entryTime).trim() : undefined;
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
    if (newEntryDate) {
      const oldEntryDateStr = existing.entryDate ? existing.entryDate.toISOString().slice(0, 10) : '';
      if (newEntryDate !== oldEntryDateStr) {
        changes.push({ field: 'entryDate', label: 'Kirim sanasi', oldValue: oldEntryDateStr || '-', newValue: newEntryDate });
      }
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
      // Sektor va Mijozni xavfsiz aniqlash (Foreign key xatoligini oldini olish)
      let validSectorId: string | null = null;
      if (newSectorId) {
        const existingSec = await tx.sector.findUnique({ where: { id: newSectorId }, select: { id: true } });
        if (existingSec) {
          validSectorId = existingSec.id;
        }
      }
      if (!validSectorId) {
        validSectorId = existing.sectorId;
      }

      let validClientId: string | null = null;
      if (newPayerId) {
        const existingClient = await tx.client.findUnique({ where: { id: newPayerId }, select: { id: true } });
        if (existingClient) {
          validClientId = existingClient.id;
        }
      }
      if (!validClientId && newClientName && String(newClientName).trim()) {
        const cleanClientName = String(newClientName).trim();
        const foundClient = await tx.client.findFirst({
          where: { name: { equals: cleanClientName, mode: 'insensitive' } },
          select: { id: true }
        });
        if (foundClient) {
          validClientId = foundClient.id;
        } else {
          try {
            const autoClient = await tx.client.create({
              data: {
                name: cleanClientName,
                contractNumber: newContractNumber || `SH-${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`,
                contractStartDate: dateStr,
                contractEndDate: newContractEndDate || `${new Date().getFullYear()}-12-31`,
                status: 'Faol'
              },
              select: { id: true }
            });
            validClientId = autoClient.id;
          } catch {
            validClientId = null;
          }
        }
      }

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
          sectorId: validSectorId,
          sectorName: newSectorName,
          clientId: validClientId,
          clientName: newClientName,
          contractNumber: newContractNumber,
          contractEndDate: newContractEndDate,
          storageTariffId: newStorageTariffId,
          storageTariffName: newStorageTariffName,
          storageTariffRate: newStorageTariffRate,
          dailyRatePerUnit: newDailyRate,
          notes: newNotes,
          entryDate: newEntryDate ? new Date(`${newEntryDate}T00:00:00+05:00`) : undefined,
          entryTime: newEntryTime !== undefined ? newEntryTime : undefined
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
            notes: newNotes,
            date: newEntryDate || undefined,
            time: newEntryTime || undefined,
            placedDate: newEntryDate ? (newEntryTime ? `${newEntryDate} ${newEntryTime}` : newEntryDate) : undefined
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
    const perms = (user?.permissions as any) || {};
    const canDelete = !user || user.role === 'SUPER_ADMIN' || Boolean(perms.canDeleteProducts) || Boolean(user.canDeleteProducts);

    if (user && !canDelete) {
      return NextResponse.json(
        { error: 'Sizda qabul qilingan yukni o\'chirish huquqi yo\'q! Ushbu ruxsatni Bosh Rahbar (Super Admin) orqali olishingiz mumkin.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    const existing = await prisma.product.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'O\'chirilayotgan yuk bazada topilmadi' }, { status: 404 });
    }

    const now = new Date();
    const tashkentTime = new Date(now.getTime() + 5 * 60 * 60 * 1000);
    const dateStr = tashkentTime.toISOString().slice(0, 10);
    const monthStr = dateStr.slice(0, 7);
    const timeStr = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

    const deleterName = user?.fullName || body.deletedBy || 'Mas\'ul xodim';
    const deleterRole = user?.role || body.deletedByRole || 'USER';
    const deleterId = user?.id || body.deletedById || null;
    const reason = (body.reason || 'Kiritilgan yuk tizimdan butunlay o\'chirildi').trim();

    const changes: ProductEditChange[] = [
      {
        field: 'status',
        label: 'Yuk holati',
        oldValue: `${existing.name} (${existing.quantity} ${existing.unit}, ${existing.weightKg || 0} kg)`,
        newValue: 'BUTUNLAY O\'CHIRILDI'
      },
      {
        field: 'sector',
        label: 'Sektor',
        oldValue: existing.sectorName || '-',
        newValue: '-'
      },
      {
        field: 'client',
        label: 'Mijoz / To\'lovchi',
        oldValue: existing.clientName || '-',
        newValue: '-'
      }
    ];

    const result = await prisma.$transaction(async (tx) => {
      // 1. Ushbu yukka tegishli harakatlar va hisoblarni tozalaymiz
      await tx.cargoMovement.deleteMany({
        where: { productId: id }
      });

      await tx.stockTransaction.deleteMany({
        where: { productId: id }
      });

      // 2. Mahsulotning o'zini o'chiramiz
      await tx.product.delete({
        where: { id }
      });

      // 3. Tahrirlar (AuditLog) bo'limiga to'liq o'chirish tarixi yoziladi
      const auditDetails = {
        actionType: 'DELETE',
        date: dateStr,
        time: timeStr,
        month: monthStr,
        sectorName: existing.sectorName || '',
        clientName: existing.clientName || '',
        reason,
        changes
      };

      const logRecord = await tx.auditLog.create({
        data: {
          userId: deleterId,
          userName: deleterName,
          userRole: deleterRole,
          action: 'PRODUCT_DELETE',
          entity: 'Product',
          entityId: id,
          entityName: existing.name,
          details: JSON.stringify(auditDetails),
          status: 'O\'chirildi'
        }
      });

      return {
        editLog: {
          id: logRecord.id,
          productId: id,
          productName: existing.name,
          sectorName: existing.sectorName || '',
          clientName: existing.clientName || '',
          userId: deleterId || undefined,
          userName: deleterName,
          userRole: deleterRole,
          date: dateStr,
          time: timeStr,
          month: monthStr,
          reason,
          changes,
          actionType: 'DELETE' as const,
          status: 'O\'chirildi',
          createdAt: logRecord.createdAt.toISOString()
        }
      };
    });

    return NextResponse.json({
      success: true,
      editLog: result.editLog
    });
  } catch (err: any) {
    console.error('Product delete error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
