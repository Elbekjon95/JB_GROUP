import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  INITIAL_PAYERS,
  INITIAL_USERS,
  INITIAL_WAREHOUSE,
  INITIAL_STORED_PRODUCTS,
  INITIAL_MOVEMENTS,
  INITIAL_TARIFFS,
  INITIAL_CUSTOMS_SERVICES
} from '../src/lib/initial-data';

const prisma = new PrismaClient();

async function main() {
  console.log('--- PostgreSQL bazasiga to\'liq ma\'lumotlarni kiritish boshlandi ---');

  // 1. Foydalanuvchilar (Parollar bcrypt bilan shifrlanadi)
  console.log('1. Foydalanuvchilar tekshirilmoqda...');
  const defaultHash = await bcrypt.hash('password123', 10);

  for (const u of INITIAL_USERS) {
    const hashedPassword = u.password ? await bcrypt.hash(u.password, 10) : defaultHash;
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        fullName: u.fullName,
        role: u.role,
        avatar: u.avatar || null,
        permissions: u.permissions as any,
        canManageTariffs: !!u.permissions?.canManageTariffs,
        canManageWarehouses: !!u.permissions?.canManageWarehouse,
        canStockMovement: !!u.permissions?.canStockMovement
      },
      create: {
        id: u.id,
        email: u.email,
        password: hashedPassword,
        fullName: u.fullName,
        role: u.role,
        avatar: u.avatar || null,
        permissions: u.permissions as any,
        canManageTariffs: !!u.permissions?.canManageTariffs,
        canManageWarehouses: !!u.permissions?.canManageWarehouse,
        canStockMovement: !!u.permissions?.canStockMovement
      }
    });
  }
  console.log(`✓ ${INITIAL_USERS.length} ta foydalanuvchi PostgreSQL ga saqlandi.`);

  // 2. Ombor va Sektorlar
  console.log('2. Ombor va sektorlar kiritilmoqda...');
  const wh = await prisma.warehouse.upsert({
    where: { id: INITIAL_WAREHOUSE.id },
    update: {
      name: INITIAL_WAREHOUSE.name,
      city: INITIAL_WAREHOUSE.city,
      address: INITIAL_WAREHOUSE.address,
      totalCapacity: INITIAL_WAREHOUSE.totalCapacity,
      manager: INITIAL_WAREHOUSE.manager,
      phone: INITIAL_WAREHOUSE.phone
    },
    create: {
      id: INITIAL_WAREHOUSE.id,
      name: INITIAL_WAREHOUSE.name,
      city: INITIAL_WAREHOUSE.city,
      address: INITIAL_WAREHOUSE.address,
      totalCapacity: INITIAL_WAREHOUSE.totalCapacity,
      manager: INITIAL_WAREHOUSE.manager,
      phone: INITIAL_WAREHOUSE.phone
    }
  });

  for (const s of INITIAL_WAREHOUSE.sectors) {
    await prisma.sector.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        code: s.code,
        type: s.type,
        temperature: s.temperature,
        capacity: s.capacity,
        subSections: s.subSections,
        description: s.description,
        allowedCargoTypes: s.allowedCargoTypes || [],
        status: s.status,
        tariffId: s.tariffId,
        tariffName: s.tariffName,
        warehouseId: wh.id
      },
      create: {
        id: s.id,
        name: s.name,
        code: s.code,
        type: s.type,
        temperature: s.temperature,
        capacity: s.capacity,
        subSections: s.subSections,
        description: s.description,
        allowedCargoTypes: s.allowedCargoTypes || [],
        status: s.status,
        tariffId: s.tariffId,
        tariffName: s.tariffName,
        warehouseId: wh.id
      }
    });
  }
  console.log(`✓ ${INITIAL_WAREHOUSE.sectors.length} ta sektor PostgreSQL ga saqlandi.`);

  // 3. To'lovchilar (Client / ContractPayer)
  console.log('3. To\'lovchilar kiritilmoqda...');
  for (const p of INITIAL_PAYERS) {
    await prisma.client.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        inn: p.inn,
        contractNumber: p.contractNumber,
        contractStartDate: p.contractStartDate,
        contractEndDate: p.contractEndDate,
        contactPerson: p.contactPerson,
        phone: p.phone,
        notes: p.notes
      },
      create: {
        id: p.id,
        name: p.name,
        inn: p.inn,
        contractNumber: p.contractNumber,
        contractStartDate: p.contractStartDate,
        contractEndDate: p.contractEndDate,
        contactPerson: p.contactPerson,
        phone: p.phone,
        notes: p.notes
      }
    });
  }
  console.log(`✓ ${INITIAL_PAYERS.length} ta to'lovchi kompaniya saqlandi.`);

  // 4. Standart Tariflar
  console.log('4. Standart tariflar kiritilmoqda...');
  for (const t of INITIAL_TARIFFS) {
    await prisma.tariff.upsert({
      where: { id: t.id },
      update: {
        name: t.name,
        targetSectorType: t.targetSectorType,
        unitName: t.unitName,
        pricePerUnitDay: t.pricePerUnitDay,
        currency: t.currency,
        minDays: t.minDays,
        features: t.features
      },
      create: {
        id: t.id,
        name: t.name,
        targetSectorType: t.targetSectorType,
        unitName: t.unitName,
        pricePerUnitDay: t.pricePerUnitDay,
        currency: t.currency,
        minDays: t.minDays,
        features: t.features
      }
    });
  }
  console.log(`✓ ${INITIAL_TARIFFS.length} ta tarif saqlandi.`);

  // 5. Bojxona Xizmatlari Preyskuranti (30 ta xizmat)
  console.log('5. Bojxona xizmatlari preyskuranti kiritilmoqda...');
  for (const cs of INITIAL_CUSTOMS_SERVICES) {
    await prisma.customsService.upsert({
      where: { id: cs.id },
      update: {
        itemNo: cs.itemNo,
        category: cs.category,
        name: cs.name,
        nameUz: cs.nameUz,
        unit: cs.unit,
        basePrice: cs.basePrice,
        vatRate: cs.vatRate,
        vatAmount: cs.vatAmount,
        totalPrice: cs.totalPrice,
        description: cs.description
      },
      create: {
        id: cs.id,
        itemNo: cs.itemNo,
        category: cs.category,
        name: cs.name,
        nameUz: cs.nameUz,
        unit: cs.unit,
        basePrice: cs.basePrice,
        vatRate: cs.vatRate,
        vatAmount: cs.vatAmount,
        totalPrice: cs.totalPrice,
        description: cs.description
      }
    });
  }
  console.log(`✓ ${INITIAL_CUSTOMS_SERVICES.length} ta bojxona xizmati saqlandi.`);

  // 6. Ombordagi Tovarlar (Stored Products)
  console.log('6. Ombordagi tovarlar kiritilmoqda...');
  for (const prod of INITIAL_STORED_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        name: prod.name,
        category: prod.category || 'Umumiy',
        initialQuantity: prod.initialQuantity,
        quantity: prod.quantity,
        unit: prod.unit,
        initialWeightKg: prod.initialWeightKg,
        weightKg: prod.weightKg,
        dailyRatePerUnit: prod.dailyRatePerUnit,
        storageTariffId: prod.storageTariffId,
        storageTariffName: prod.storageTariffName,
        storageTariffRate: prod.storageTariffRate,
        storageTariffItemNo: prod.storageTariffItemNo,
        storageTariffUnit: prod.storageTariffUnit,
        tariffId: prod.tariffId,
        tariffName: prod.tariffName,
        unitVolumeM3: prod.unitVolumeM3,
        totalVolumeM3: prod.totalVolumeM3,
        sectorId: prod.sectorId,
        sectorName: prod.sectorName,
        warehouseId: INITIAL_WAREHOUSE.id,
        clientId: prod.payerId,
        clientName: prod.clientName,
        contractNumber: prod.contractNumber,
        contractEndDate: prod.contractEndDate,
        entryDate: new Date(prod.entryDate || '2026-01-01'),
        entryTime: prod.entryTime,
        placedBy: prod.placedBy,
        placedByRole: prod.placedByRole,
        notes: prod.notes,
        obrabotkaService: prod.obrabotkaService,
        obrabotkaCost: prod.obrabotkaCost,
        obrabotkaVat: prod.obrabotkaVat,
        kirimAdditionalServices: prod.kirimAdditionalServices as any,
        exitHistory: prod.exitHistory as any
      },
      create: {
        id: prod.id,
        name: prod.name,
        category: prod.category || 'Umumiy',
        initialQuantity: prod.initialQuantity,
        quantity: prod.quantity,
        unit: prod.unit,
        initialWeightKg: prod.initialWeightKg,
        weightKg: prod.weightKg,
        dailyRatePerUnit: prod.dailyRatePerUnit,
        storageTariffId: prod.storageTariffId,
        storageTariffName: prod.storageTariffName,
        storageTariffRate: prod.storageTariffRate,
        storageTariffItemNo: prod.storageTariffItemNo,
        storageTariffUnit: prod.storageTariffUnit,
        tariffId: prod.tariffId,
        tariffName: prod.tariffName,
        unitVolumeM3: prod.unitVolumeM3,
        totalVolumeM3: prod.totalVolumeM3,
        sectorId: prod.sectorId,
        sectorName: prod.sectorName,
        warehouseId: INITIAL_WAREHOUSE.id,
        clientId: prod.payerId,
        clientName: prod.clientName,
        contractNumber: prod.contractNumber,
        contractEndDate: prod.contractEndDate,
        entryDate: new Date(prod.entryDate || '2026-01-01'),
        entryTime: prod.entryTime,
        placedBy: prod.placedBy,
        placedByRole: prod.placedByRole,
        notes: prod.notes,
        obrabotkaService: prod.obrabotkaService,
        obrabotkaCost: prod.obrabotkaCost,
        obrabotkaVat: prod.obrabotkaVat,
        kirimAdditionalServices: prod.kirimAdditionalServices as any,
        exitHistory: prod.exitHistory as any
      }
    });
  }
  console.log(`✓ ${INITIAL_STORED_PRODUCTS.length} ta ombordagi mahsulot saqlandi.`);

  // 7. Yuklar Harakati Tarixi (Cargo Movements)
  console.log('7. Yuklar harakati tarixi kiritilmoqda...');
  // Boshida harakatlar sonini tekshiramiz
  const existingCount = await prisma.cargoMovement.count();
  if (existingCount === 0) {
    console.log(`Harakatlar bazada mavjud emas. ${INITIAL_MOVEMENTS.length} ta yozuv kiritilmoqda...`);
    // Batch insert for performance
    const batchSize = 50;
    for (let i = 0; i < INITIAL_MOVEMENTS.length; i += batchSize) {
      const slice = INITIAL_MOVEMENTS.slice(i, i + batchSize).map(m => ({
        id: m.id,
        invoiceNo: m.invoiceNo || null,
        productId: m.productId || null,
        sectorId: m.sectorId,
        sectorName: m.sectorName,
        productName: m.productName,
        type: m.type,
        quantity: m.quantity,
        initialQuantity: m.initialQuantity || null,
        remainingQuantity: m.remainingQuantity || null,
        unit: m.unit,
        weightKg: m.weightKg || null,
        initialWeightKg: m.initialWeightKg || null,
        remainingWeightKg: m.remainingWeightKg || null,
        userName: m.userName,
        userRole: m.userRole,
        placedBy: m.placedBy || null,
        placedDate: m.placedDate || null,
        date: m.date,
        time: m.time || null,
        notes: m.notes || null,
        clientName: m.clientName || null,
        transportType: m.transportType || null,
        unloadingType: m.unloadingType || null,
        loadingType: m.loadingType || null,
        loadingCostUZS: m.loadingCostUZS || null,
        obrabotkaCostUZS: m.obrabotkaCostUZS || null,
        storageCostUZS: m.storageCostUZS || null,
        storageTariffName: m.storageTariffName || null,
        storageFormula: m.storageFormula || null,
        additionalCostUZS: m.additionalCostUZS || null,
        servicesApplied: (m.servicesApplied || []) as any,
        daysStored: m.daysStored || null,
        tariffId: m.tariffId || null,
        tariffName: m.tariffName || null,
        tariffDailyRate: m.tariffDailyRate || null,
        totalCostUZS: m.totalCostUZS || null,
        vatTotalUZS: m.vatTotalUZS || null,
        grandTotalUZS: m.grandTotalUZS || null,
        receiverInn: m.receiverInn || null,
        receiverName: m.receiverName || null,
        receiverPerson: m.receiverPerson || null,
        paymentStatus: m.paymentStatus || 'PENDING',
        paidAt: m.paidAt || null
      }));
      await prisma.cargoMovement.createMany({
        data: slice,
        skipDuplicates: true
      });
    }
    console.log(`✓ ${INITIAL_MOVEMENTS.length} ta harakat yozuvi saqlandi.`);
  } else {
    console.log(`✓ Harakatlar tarixi allaqachon bazada mavjud (${existingCount} ta).`);
  }

  console.log('=== Barcha ma\'lumotlar PostgreSQL ga to\'liq va muvaffaqiyatli saqlandi! ===');
}

main()
  .catch((e) => {
    console.error('Xatolik yuz berdi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

