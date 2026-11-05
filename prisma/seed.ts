import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  INITIAL_WAREHOUSE,
  INITIAL_TARIFFS,
  INITIAL_CUSTOMS_SERVICES
} from '../src/lib/initial-data';

const prisma = new PrismaClient();

async function main() {
  console.log('--- PostgreSQL bazasini tozalash va bazaviy sozlamalarni (Sektorlar & Preyskurant) saqlash ---');

  // 1. Barcha tovarlar, harakatlar va amallarni tozalash (Foydalanuvchilar (User) jadvali o'zgarishsiz saqlanadi!)
  await prisma.stockTransaction.deleteMany({});
  await prisma.storageInvoice.deleteMany({});
  await prisma.cargoMovement.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.activityLog.deleteMany({});
  console.log('✓ Barcha mahsulotlar, harakatlar va operatsiyalar tozalandi (Foydalanuvchilar saqlandi).');

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

  // 4. Standart Tizim Foydalanuvchilari va Login/Parollari (Mavjud bo'lsa tegilmaydi, yo'q bo'lsa yaratiladi)
  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  const defaultUsers = [
    {
      email: 'superadmin@jbgroup.uz',
      fullName: 'Sardor Alimov (Super Admin)',
      role: 'SUPER_ADMIN',
      company: 'JB GROUP',
      canManageTariffs: true,
      canCreateProducts: true,
      canDeleteProducts: true,
      canManageWarehouses: true,
      canStockMovement: true,
      permissions: {
        canManageTariffs: true,
        canManageWarehouse: true,
        canLinkTariffs: true,
        canHandleHazardous: true,
        allowedSectorIds: ['ALL'],
        canManageUsers: true,
        canDeleteProducts: true,
        canEditHistoricalData: true,
        canViewAuditLogs: true,
        canViewFinances: true
      }
    },
    {
      email: 'admin@jbgroup.uz',
      fullName: 'Akmal Rahimov (Katta Admin)',
      role: 'ADMIN',
      company: 'JB GROUP',
      canManageTariffs: true,
      canCreateProducts: true,
      canDeleteProducts: false,
      canManageWarehouses: false,
      canStockMovement: true,
      permissions: {
        canManageTariffs: true,
        canManageWarehouse: false,
        canLinkTariffs: true,
        canHandleHazardous: true,
        allowedSectorIds: ['ALL'],
        canManageUsers: false,
        canDeleteProducts: false,
        canEditHistoricalData: false,
        canViewAuditLogs: true,
        canViewFinances: true
      }
    },
    {
      email: 'buxgalter@jbgroup.uz',
      fullName: 'Shahnoza Karimova (Bosh Buxgalter)',
      role: 'ACCOUNTANT',
      company: 'JB GROUP',
      canManageTariffs: false,
      canCreateProducts: false,
      canDeleteProducts: false,
      canManageWarehouses: false,
      canStockMovement: false,
      permissions: {
        canManageTariffs: false,
        canManageWarehouse: false,
        canLinkTariffs: false,
        canHandleHazardous: false,
        allowedSectorIds: ['ALL'],
        canManageUsers: false,
        canDeleteProducts: false,
        canEditHistoricalData: false,
        canViewAuditLogs: true,
        canViewFinances: true
      }
    },
    {
      email: 'user@jbgroup.uz',
      fullName: 'Botir Qodirov (Katta Omborchi)',
      role: 'USER',
      company: 'JB GROUP',
      canManageTariffs: false,
      canCreateProducts: false,
      canDeleteProducts: false,
      canManageWarehouses: false,
      canStockMovement: true,
      permissions: {
        canManageTariffs: false,
        canManageWarehouse: false,
        canLinkTariffs: false,
        canHandleHazardous: false,
        allowedSectorIds: ['ALL'],
        canManageUsers: false,
        canDeleteProducts: false,
        canEditHistoricalData: false,
        canViewAuditLogs: false,
        canViewFinances: false
      }
    }
  ];

  for (const u of defaultUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {}, // Mavjud foydalanuvchi ma'lumotlari saqlanadi, o'zgartirilmaydi!
      create: {
        ...u,
        password: defaultPasswordHash
      }
    });
  }
  console.log('✓ Foydalanuvchilar tekshirildi (Super Admin paroli: password123).');

  console.log('=== Baza tayyor va barcha login-parollar faol! ===');
}

main()
  .catch((e) => {
    console.error('Xatolik yuz berdi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
