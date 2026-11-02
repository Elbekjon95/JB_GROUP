const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Ombordagi barcha tovarlar va harakatlar tarixi tozalanmoqda...');

  // 1. StorageInvoices
  const delInvoices = await prisma.storageInvoice.deleteMany();
  console.log(`- StorageInvoice o'chirildi: ${delInvoices.count} ta`);

  // 2. StockTransactions
  const delTx = await prisma.stockTransaction.deleteMany();
  console.log(`- StockTransaction o'chirildi: ${delTx.count} ta`);

  // 3. CargoMovements (Kirim / Chiqim to'liq tarixi)
  const delMovements = await prisma.cargoMovement.deleteMany();
  console.log(`- CargoMovement (Harakatlar tarixi) o'chirildi: ${delMovements.count} ta`);

  // 4. Products (Ombordagi barcha saqlanayotgan tovarlar)
  const delProducts = await prisma.product.deleteMany();
  console.log(`- Product (Ombordagi tovarlar) o'chirildi: ${delProducts.count} ta`);

  // 5. AuditLog & ActivityLog (Tahrirlar va amallar loglari)
  const delAudit = await prisma.auditLog.deleteMany();
  const delActivity = await prisma.activityLog.deleteMany();
  console.log(`- AuditLog / ActivityLog o'chirildi: ${delAudit.count + delActivity.count} ta`);

  // 6. Ombor va sektorlardagi occupied ko'rsatkichini 0 ga tushirish
  await prisma.warehouse.updateMany({
    data: { occupiedCapacity: 0 }
  });
  await prisma.sector.updateMany({
    data: { occupied: 0 }
  });
  console.log('- Ombor va sektorlar bandligi (occupied) 0 ga tushirildi.');

  console.log('\n✅ Baza muvaffaqiyatli tozalandi! Ombor 0 dan toza holatga keltirildi.');
}

main()
  .catch(err => {
    console.error('Xatolik:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
