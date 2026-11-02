const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function run() {
  const p1 = await bcrypt.hash('password123', 10);
  const p2 = await bcrypt.hash('admin123', 10);
  
  const users = [
    { email: 'superadmin@jbgroup.uz', password: p1, fullName: 'Sardor Alimov (Super Admin)', role: 'SUPER_ADMIN', canManageTariffs: true, canCreateProducts: true, canDeleteProducts: true, canManageWarehouses: true, canStockMovement: true },
    { email: 'admin@jbgroup.uz', password: p1, fullName: 'Akmal Rahimov (Admin)', role: 'ADMIN', canManageTariffs: true, canCreateProducts: true, canDeleteProducts: false, canManageWarehouses: false, canStockMovement: true },
    { email: 'buxgalter@jbgroup.uz', password: p1, fullName: 'Shahnoza Karimova (Buxgalter)', role: 'ACCOUNTANT', canManageTariffs: false, canCreateProducts: false, canDeleteProducts: false, canManageWarehouses: false, canStockMovement: false },
    { email: 'user@jbgroup.uz', password: p1, fullName: 'Botir Qodirov (Omborchi)', role: 'USER', canManageTariffs: false, canCreateProducts: false, canDeleteProducts: false, canManageWarehouses: false, canStockMovement: true },
    // Also support admin123 on uzw.uz
    { email: 'superadmin@uzw.uz', password: p2, fullName: 'Sardor Alimov (Super Admin)', role: 'SUPER_ADMIN', canManageTariffs: true, canCreateProducts: true, canDeleteProducts: true, canManageWarehouses: true, canStockMovement: true },
    { email: 'admin@uzw.uz', password: p2, fullName: 'Akmal Rahimov (Admin)', role: 'ADMIN', canManageTariffs: true, canCreateProducts: true, canDeleteProducts: false, canManageWarehouses: false, canStockMovement: true },
    { email: 'user@uzw.uz', password: p2, fullName: 'Botir Qodirov (Omborchi)', role: 'USER', canManageTariffs: false, canCreateProducts: false, canDeleteProducts: false, canManageWarehouses: false, canStockMovement: true }
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: u
    });
  }
  console.log('✅ JB GROUP & UZW barcha sinov foydalanuvchilari bazaga muvaffaqiyatli yuklandi!');
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
