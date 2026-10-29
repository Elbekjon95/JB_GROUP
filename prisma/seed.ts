import { PrismaClient } from '@prisma/client';
import {
  INITIAL_WAREHOUSE,
  INITIAL_TARIFFS,
  INITIAL_CUSTOMS_SERVICES
} from '../src/lib/initial-data';

const prisma = new PrismaClient();

async function main() {
  console.log('--- PostgreSQL bazasini tozalash va bazaviy sozlamalarni (Sektorlar & Preyskurant) saqlash ---');

  // 1. Barcha imitatsiya qilingan ma'lumotlarni tozalash (User, Product, CargoMovement, Client, StockTransaction, StorageInvoice, AuditLog, ActivityLog)
  await prisma.stockTransaction.deleteMany({});
  await prisma.storageInvoice.deleteMany({});
  await prisma.cargoMovement.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.activityLog.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✓ Barcha foydalanuvchilar, mahsulotlar, harakatlar, to\'lovchilar va loglar tozalandi (0 ta).');

  // 2. Asosiy ombor va 6 ta sektorni saqlash (ortiqcha/dublikat sektorlarni o'chirish)
  const validSectorIds = INITIAL_WAREHOUSE.sectors.map(s => s.id);
  await prisma.sector.deleteMany({
    where: { id: { notIn: validSectorIds } }
  });
  await prisma.warehouse.deleteMany({
    where: { id: { not: INITIAL_WAREHOUSE.id } }
  });

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
  console.log(`✓ ${INITIAL_WAREHOUSE.sectors.length} ta sektor (A–F) saqlandi.`);

  // 3. Standart Tariflar va Bojxona Preyskuranti
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
  console.log(`✓ ${INITIAL_CUSTOMS_SERVICES.length} ta rasmiy bojxona preyskurant xizmati saqlandi.`);
  console.log('=== Baza to\'liq tozalandi! Tizim birinchi Super Admin ro\'yxatdan o\'tishiga tayyor. ===');
}

main()
  .catch((e) => {
    console.error('Xatolik yuz berdi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
