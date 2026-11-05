const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Yordamchi sanalar generatori
function pad(n) {
  return n < 10 ? '0' + n : String(n);
}

function formatDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatTime(h, m) {
  return `${pad(h)}:${pad(m)}`;
}

async function main() {
  console.log('================================================================');
  console.log('🚀 JB GROUP BOJXONA OMBORI — 5 YILLIK (2021-2026) BAZANI SEED QILISH');
  console.log('================================================================');

  // 1. Eski tovarlar, harakatlar va hisoblarni xavfsiz tozalash
  console.log('1. Mavjud harakatlar, tovarlar va hisobotlar tozalanmoqda...');
  await prisma.storageInvoice.deleteMany({});
  await prisma.stockTransaction.deleteMany({});
  await prisma.cargoMovement.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.activityLog.deleteMany({});
  console.log('✓ Eski tovarlar va amallar tozalandi.');

  // 2. Foydalanuvchilar (Users jadvali o'zgartirilmaydi, mavjud foydalanuvchilar saqlanadi)
  console.log('2. Foydalanuvchilar (User) jadvali o\'zgartirilmaydi, mavjud xodimlar saqlanadi.');
  const existingUsers = await prisma.user.findMany({
    select: { id: true, email: true, fullName: true, role: true }
  });
  console.log(`✓ Foydalanuvchilar (User) jadvaliga tegilmadi (${existingUsers.length} ta foydalanuvchi mavjud).`);

  // 3. Ombor va 6 ta asosiy Sektorlar
  console.log('3. Ombor va Sektorlar (A, B, C, D, E, F) tekshirilmoqda...');
  const wh = await prisma.warehouse.upsert({
    where: { id: 'wh-main' },
    update: {
      name: 'JB GROUP Bojxona va Markaziy Logistika Majmuasi',
      city: 'Toshkent viloyati',
      address: 'Yangiyo\'l tumani, Bojxona logistika markazi',
      totalCapacity: 17593,
      manager: 'Sardor Alimov',
      phone: '+998 71 200 88 00',
      status: 'Faol'
    },
    create: {
      id: 'wh-main',
      name: 'JB GROUP Bojxona va Markaziy Logistika Majmuasi',
      city: 'Toshkent viloyati',
      address: 'Yangiyo\'l tumani, Bojxona logistika markazi',
      totalCapacity: 17593,
      manager: 'Sardor Alimov',
      phone: '+998 71 200 88 00',
      status: 'Faol'
    }
  });

  const sectorsDef = [
    { id: 'sec-a', name: 'A Sektor', code: 'SECTOR-A', type: 'COLD_FREEZER', temperature: '-18°C ... -24°C', capacity: 6676, subSections: 'A1 - 731 m / A2 - 814 m / A3 - 5 131 m', allowedCargoTypes: ['Muzlatilgan go\'sht', 'Baliq mahsulotlari', 'Muzqaymoq', 'Tez buziluvchi oziq-ovqat'] },
    { id: 'sec-b', name: 'B Sektor', code: 'SECTOR-B', type: 'CHILLED', temperature: '+2°C ... +6°C', capacity: 1365, subSections: 'B1 - 1 365 m', allowedCargoTypes: ['Sut mahsulotlari', 'Pishloqlar', 'Sarxil meva-sabzavotlar'] },
    { id: 'sec-c', name: 'C Sektor', code: 'SECTOR-C', type: 'DRY_STANDARD', temperature: '+18°C ... +22°C', capacity: 3120, subSections: 'C1 - 3 120 m', allowedCargoTypes: ['Un va g\'alla', 'Shakar', 'Paxta ip-kalava', 'Qadoqlangan oziq-ovqat'] },
    { id: 'sec-d', name: 'D Sektor', code: 'SECTOR-D', type: 'HAZARDOUS', temperature: '+15°C ... +20°C', capacity: 1560, subSections: 'D1 - 1 560 m', allowedCargoTypes: ['Bo\'yoq va loklar', 'Kimyoviy reagentlar', 'Yengil yonuvchi moddalar'] },
    { id: 'sec-e', name: 'E Sektor', code: 'SECTOR-E', type: 'HIGH_SECURITY', temperature: '+20°C', capacity: 1800, subSections: 'E1 - 1 800 m', allowedCargoTypes: ['Smartfon va noutbuklar', 'Server uskunalari', 'Nozik elektronika'] },
    { id: 'sec-f', name: 'F Sektor', code: 'SECTOR-F', type: 'DRY_STANDARD', temperature: '+16°C ... +22°C', capacity: 3072, subSections: 'F1 - 480 m / F2 - 2 592 m', allowedCargoTypes: ['Yog\'och, metall, asbob-uskunalar', 'Garaj texnikasi', 'Katta gabaritli yuklar'] }
  ];

  for (const s of sectorsDef) {
    await prisma.sector.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        code: s.code,
        type: s.type,
        temperature: s.temperature,
        capacity: s.capacity,
        subSections: s.subSections,
        allowedCargoTypes: s.allowedCargoTypes,
        warehouseId: wh.id,
        status: 'Faol'
      },
      create: {
        id: s.id,
        name: s.name,
        code: s.code,
        type: s.type,
        temperature: s.temperature,
        capacity: s.capacity,
        subSections: s.subSections,
        allowedCargoTypes: s.allowedCargoTypes,
        warehouseId: wh.id,
        status: 'Faol'
      }
    });
  }
  console.log('✓ 6 ta sektor (A–F) saqlandi.');

  // 4. Standart Tariflar
  console.log('4. Rasmiy saqlash tariflari (Tariffs) tekshirilmoqda...');
  const tariffsToSeed = [
    { id: 'cs-12', name: 'Хранение 1тн груза в сутки (без паллетоместа)', unitName: 'tn', pricePerUnitDay: 8000 },
    { id: 'cs-13', name: 'Хранение за объем груза свыше 100 тн, за 1тн в сутки', unitName: 'tn', pricePerUnitDay: 7000 },
    { id: 'cs-14', name: 'Хранение 1тн груза сроком свыше 60 дней', unitName: 'tn', pricePerUnitDay: 5000 },
    { id: 'cs-15', name: 'Хранение габаритного груза за одну единицу, в сутки', unitName: 'dona', pricePerUnitDay: 10000 },
    { id: 'cs-16', name: 'Хранение грузов 1 места по паллетам, в сутки', unitName: 'pallet', pricePerUnitDay: 25000 },
    { id: 'cs-17', name: 'Хранение 1 ед. легкового автотранспорта в сутки', unitName: 'dona', pricePerUnitDay: 30000 },
    { id: 'cs-18', name: 'Хранение 1 ед. грузового автотранспорта в сутки', unitName: 'dona', pricePerUnitDay: 50000 },
    { id: 'cs-19', name: 'Хранение 1 ед. спецтехники в сутки', unitName: 'dona', pricePerUnitDay: 70000 },
    { id: 'cs-20', name: 'Хранение грузов в холодильной камере (+2°C ... +6°C)', unitName: 'pallet', pricePerUnitDay: 15000 },
    { id: 'cs-21', name: 'Хранение замороженных грузов (-18°C ... -24°C)', unitName: 'pallet', pricePerUnitDay: 20000 },
    { id: 'cs-22', name: 'Хранение рыбы и морепродуктов свежемороженых', unitName: 'pallet', pricePerUnitDay: 22000 }
  ];

  for (const t of tariffsToSeed) {
    await prisma.tariff.upsert({
      where: { id: t.id },
      update: {
        name: t.name,
        unitName: t.unitName,
        pricePerUnitDay: t.pricePerUnitDay,
        currency: 'UZS',
        minDays: 1
      },
      create: {
        id: t.id,
        name: t.name,
        unitName: t.unitName,
        pricePerUnitDay: t.pricePerUnitDay,
        currency: 'UZS',
        minDays: 1
      }
    });
  }
  console.log(`✓ ${tariffsToSeed.length} ta rasmiy tarif saqlandi.`);

  // 5. Shartnoma to'lovchilari / Mijozlar (Payers / Clients)
  console.log('5. Yirik importchi korxonalar (Mijozlar) saqlanmoqda...');
  const clientsData = [
    { id: 'cl-1', name: 'TEXNOPARK MCHJ', inn: '305123456', contractNumber: 'SH-2021/01', contractStartDate: '2021-01-15', contractEndDate: '2028-12-31', contactPerson: 'Murod Ergashev', phone: '+998 90 123 45 67', email: 'logistics@texnopark.uz', address: 'Toshkent sh., Yashnobod tumani' },
    { id: 'cl-2', name: 'ARTEL ELECTRONICS MCHJ', inn: '301987654', contractNumber: 'SH-2021/04', contractStartDate: '2021-02-10', contractEndDate: '2027-12-31', contactPerson: 'Bobur Sobirov', phone: '+998 97 765 43 21', email: 'customs@artel.uz', address: 'Toshkent sh., Bektemir tumani' },
    { id: 'cl-3', name: 'SAG AGRO MCHJ', inn: '308654321', contractNumber: 'SH-2021/08', contractStartDate: '2021-04-01', contractEndDate: '2027-06-30', contactPerson: 'Azamat Qosimov', phone: '+998 93 555 44 33', email: 'import@sagagro.uz', address: 'Samarqand viloyati, Toyloq tumani' },
    { id: 'cl-4', name: 'KORZINKA LOGISTICS MCHJ', inn: '302345678', contractNumber: 'SH-2022/12', contractStartDate: '2022-01-05', contractEndDate: '2028-01-01', contactPerson: 'Nodir Jo\'rayev', phone: '+998 71 140 14 14', email: 'customs@angleseyfood.uz', address: 'Toshkent viloyati, Qibray tumani' },
    { id: 'cl-5', name: 'CHUST TEXTILE MCHJ', inn: '304567890', contractNumber: 'SH-2022/15', contractStartDate: '2022-03-20', contractEndDate: '2026-12-31', contactPerson: 'Shavkat Nurmatov', phone: '+998 69 421 20 20', email: 'logistics@chusttextile.uz', address: 'Namangan viloyati, Chust tumani' },
    { id: 'cl-6', name: 'PHARM STANDART MCHJ', inn: '306789012', contractNumber: 'SH-2022/22', contractStartDate: '2022-06-15', contractEndDate: '2027-12-31', contactPerson: 'Dilnoza Salimova', phone: '+998 90 987 65 43', email: 'pharma@standart.uz', address: 'Toshkent sh., Shayxontohur tumani' },
    { id: 'cl-7', name: 'UZAUTO MOTORS AJ', inn: '300123987', contractNumber: 'SH-2021/02', contractStartDate: '2021-01-10', contractEndDate: '2029-12-31', contactPerson: 'Alisher Karimov', phone: '+998 78 140 55 55', email: 'supply@uzautomotors.com', address: 'Andijon viloyati, Asaka shahri' },
    { id: 'cl-8', name: 'NESTLE FOOD UZBEKISTAN MCHJ', inn: '307890123', contractNumber: 'SH-2023/05', contractStartDate: '2023-01-15', contractEndDate: '2028-12-31', contactPerson: 'Olim Vohidov', phone: '+998 71 200 44 00', email: 'customs@uz.nestle.com', address: 'Namangan viloyati' },
    { id: 'cl-9', name: 'PREMIUM LOGISTICS GROUP MCHJ', inn: '309012345', contractNumber: 'SH-2023/11', contractStartDate: '2023-05-01', contractEndDate: '2027-12-31', contactPerson: 'Farrux Saidov', phone: '+998 90 321 09 87', email: 'cargo@premiumlog.uz', address: 'Toshkent sh., Mirobod tumani' },
    { id: 'cl-10', name: 'ASIA TRANS TERMINAL MCHJ', inn: '303456789', contractNumber: 'SH-2023/18', contractStartDate: '2023-08-10', contractEndDate: '2028-12-31', contactPerson: 'Rustam Tojiyev', phone: '+998 91 190 22 11', email: 'info@asiatrans.uz', address: 'Toshkent viloyati, Zangiota tumani' },
    { id: 'cl-11', name: 'GLOBAL CHEMICAL TRADE MCHJ', inn: '304112233', contractNumber: 'SH-2024/03', contractStartDate: '2024-02-01', contractEndDate: '2028-12-31', contactPerson: 'Jamol Mirzayev', phone: '+998 94 650 33 22', email: 'chem@globaltrade.uz', address: 'Navoiy viloyati, Karmana tumani' },
    { id: 'cl-12', name: 'SMART TECH DISTRIBUTION MCHJ', inn: '305998877', contractNumber: 'SH-2024/09', contractStartDate: '2024-04-15', contractEndDate: '2029-01-01', contactPerson: 'Ulugbek Yunusov', phone: '+998 99 888 77 66', email: 'import@smarttech.uz', address: 'Toshkent sh., Yunusobod tumani' }
  ];

  for (const c of clientsData) {
    await prisma.client.upsert({
      where: { inn: c.inn },
      update: c,
      create: c
    });
  }
  console.log(`✓ ${clientsData.length} ta yirik korxona saqlandi.`);

  // 5. Tarixiy yuklar katalogi va tariflar
  const cargoCatalog = [
    // Sektor A (Muzlatgich)
    { name: 'Muzlatilgan mol go\'shti (Belgiya, 1-toifa)', sectorId: 'sec-a', sectorName: 'A Sektor', unit: 'quti', unitWeight: 25, tariffId: 'cs-21', tariffName: 'Хранение замороженного мяса (-18°C)', dailyRate: 12000, clientIdx: 3 },
    { name: 'Muzlatilgan tovuq filesi (Rossiya)', sectorId: 'sec-a', sectorName: 'A Sektor', unit: 'quti', unitWeight: 20, tariffId: 'cs-21', tariffName: 'Хранение замороженного мяса (-18°C)', dailyRate: 12000, clientIdx: 3 },
    { name: 'Norvegiya losos balig\'i (muzlatilgan)', sectorId: 'sec-a', sectorName: 'A Sektor', unit: 'quti', unitWeight: 25, tariffId: 'cs-22', tariffName: 'Хранение рыбы свежемороженой', dailyRate: 15000, clientIdx: 8 },
    { name: 'Muzqaymoq quruq xomashyosi (Turkiya)', sectorId: 'sec-a', sectorName: 'A Sektor', unit: 'qop', unitWeight: 30, tariffId: 'cs-21', tariffName: 'Хранение замороженных продуктов', dailyRate: 11000, clientIdx: 7 },
    { name: 'Muzlatilgan qulupnay va rezavorlar (Polsha)', sectorId: 'sec-a', sectorName: 'A Sektor', unit: 'quti', unitWeight: 15, tariffId: 'cs-22', tariffName: 'Хранение замороженных ягод', dailyRate: 13000, clientIdx: 2 },

    // Sektor B (Salqin ombor)
    { name: 'Gollandiya Gauda va Edam pishloqlari', sectorId: 'sec-b', sectorName: 'B Sektor', unit: 'quti', unitWeight: 20, tariffId: 'cs-20', tariffName: 'Хранение молочной продукции (+4°C)', dailyRate: 9000, clientIdx: 3 },
    { name: 'Sarxil Ekvador bananlari (premium)', sectorId: 'sec-b', sectorName: 'B Sektor', unit: 'quti', unitWeight: 20, tariffId: 'cs-20', tariffName: 'Хранение свежих фруктов (+12°C)', dailyRate: 8500, clientIdx: 3 },
    { name: 'Quruq sut zardobi va oqsil (Belarus)', sectorId: 'sec-b', sectorName: 'B Sektor', unit: 'qop', unitWeight: 25, tariffId: 'cs-12', tariffName: 'Хранение 1тн груза в сутки (без паллетоместа)', dailyRate: 8000, clientIdx: 7 },
    { name: 'Sarxil Eron kivisi va yashil olma', sectorId: 'sec-b', sectorName: 'B Sektor', unit: 'quti', unitWeight: 18, tariffId: 'cs-20', tariffName: 'Хранение свежих фруктов (+4°C)', dailyRate: 8500, clientIdx: 2 },
    { name: 'Germaniya shokolad va qandolat tovarlari', sectorId: 'sec-b', sectorName: 'B Sektor', unit: 'quti', unitWeight: 12, tariffId: 'cs-20', tariffName: 'Хранение кондитерских изделий (+15°C)', dailyRate: 9500, clientIdx: 8 },

    // Sektor C (Quruq standart)
    { name: 'Oliy navli Qozog\'iston bug\'doy uni', sectorId: 'sec-c', sectorName: 'C Sektor', unit: 'qop', unitWeight: 50, tariffId: 'cs-12', tariffName: 'Хранение 1тн груза в сутки (без паллетоместа)', dailyRate: 8000, clientIdx: 2 },
    { name: 'Oq qamish shakari (Rossiya, 50kg)', sectorId: 'sec-c', sectorName: 'C Sektor', unit: 'qop', unitWeight: 50, tariffId: 'cs-12', tariffName: 'Хранение 1тн груза в сутки (без паллетоместа)', dailyRate: 8000, clientIdx: 7 },
    { name: 'Pokiston uzun donli Basmati guruchi', sectorId: 'sec-c', sectorName: 'C Sektor', unit: 'qop', unitWeight: 25, tariffId: 'cs-12', tariffName: 'Хранение 1тн груза в сутки (без паллетоместа)', dailyRate: 8000, clientIdx: 3 },
    { name: 'Kungaboqar o\'simlik yog\'i (Rossiya, 1L)', sectorId: 'sec-c', sectorName: 'C Sektor', unit: 'quti', unitWeight: 15, tariffId: 'cs-16', tariffName: 'Хранение грузов 1 места по паллетам, в сутки', dailyRate: 25000, clientIdx: 3 },
    { name: 'Italiya spagetti va makaron mahsulotlari', sectorId: 'sec-c', sectorName: 'C Sektor', unit: 'quti', unitWeight: 10, tariffId: 'cs-16', tariffName: 'Хранение грузов 1 места по паллетам, в сутки', dailyRate: 25000, clientIdx: 8 },
    { name: 'Chust to\'qimachilik ip-kalavasi (paxta)', sectorId: 'sec-c', sectorName: 'C Sektor', unit: 'qop', unitWeight: 40, tariffId: 'cs-12', tariffName: 'Хранение 1тн груза в сутки', dailyRate: 8000, clientIdx: 4 },

    // Sektor D (Xavfli yuklar)
    { name: 'Avtomobil emal bo\'yoqlari va grunt (Koreya)', sectorId: 'sec-d', sectorName: 'D Sektor', unit: 'kanistr', unitWeight: 20, tariffId: 'cs-16', tariffName: 'Хранение опасных и спецгрузов (паллет)', dailyRate: 35000, clientIdx: 6 },
    { name: 'Organik erituvchi moddalar (R-646, Germaniya)', sectorId: 'sec-d', sectorName: 'D Sektor', unit: 'baraban', unitWeight: 50, tariffId: 'cs-16', tariffName: 'Хранение опасных и спецгрузов (паллет)', dailyRate: 35000, clientIdx: 10 },
    { name: 'Sanoat polimer kukunlari va smola (Xitoy)', sectorId: 'sec-d', sectorName: 'D Sektor', unit: 'qop', unitWeight: 25, tariffId: 'cs-12', tariffName: 'Хранение химсырья 1тн/сут', dailyRate: 15000, clientIdx: 10 },
    { name: 'Sanoat lityum-ionli akkumulyatorlari', sectorId: 'sec-d', sectorName: 'D Sektor', unit: 'pallet', unitWeight: 400, tariffId: 'cs-16', tariffName: 'Хранение опасных аккумуляторов', dailyRate: 40000, clientIdx: 1 },

    // Sektor E (Qimmatbaho elektronika)
    { name: 'Samsung Galaxy S24 Ultra smartfonlari', sectorId: 'sec-e', sectorName: 'E Sektor', unit: 'quti', unitWeight: 1, tariffId: 'cs-16', tariffName: 'Хранение ценных грузов (паллетоместо)', dailyRate: 50000, clientIdx: 11 },
    { name: 'Apple iPhone 16 Pro Max va MacBook Air', sectorId: 'sec-e', sectorName: 'E Sektor', unit: 'quti', unitWeight: 1.5, tariffId: 'cs-16', tariffName: 'Хранение ценных грузов (паллетоместо)', dailyRate: 50000, clientIdx: 11 },
    { name: 'Dell PowerEdge R760 server uskunalari', sectorId: 'sec-e', sectorName: 'E Sektor', unit: 'dona', unitWeight: 35, tariffId: 'cs-15', tariffName: 'Хранение габаритного груза за 1 ед./сут', dailyRate: 30000, clientIdx: 0 },
    { name: 'Cisco tarmoq kommutatorlari va routerlar', sectorId: 'sec-e', sectorName: 'E Sektor', unit: 'dona', unitWeight: 12, tariffId: 'cs-16', tariffName: 'Хранение телеком-оборудования', dailyRate: 45000, clientIdx: 0 },
    { name: 'Dronlar va optik sensorlar (Yaponiya)', sectorId: 'sec-e', sectorName: 'E Sektor', unit: 'quti', unitWeight: 6, tariffId: 'cs-16', tariffName: 'Хранение высокоточной техники', dailyRate: 40000, clientIdx: 9 },

    // Sektor F (Og'ir yuklar & metall)
    { name: 'Qurilish po\'lat armaturasi (A500C, Rossiya)', sectorId: 'sec-f', sectorName: 'F Sektor', unit: 'tn', unitWeight: 1000, tariffId: 'cs-12', tariffName: 'Хранение 1тн груза в сутки (без паллетоместа)', dailyRate: 8000, clientIdx: 0 },
    { name: 'Qarag\'ay va qayin yog\'och taxtalari (Rossiya)', sectorId: 'sec-f', sectorName: 'F Sektor', unit: 'm3', unitWeight: 650, tariffId: 'cs-12', tariffName: 'Хранение лесоматериалов за тонну/сутки', dailyRate: 8000, clientIdx: 4 },
    { name: 'Gidravlik press va shtamp stanogi qismlari', sectorId: 'sec-f', sectorName: 'F Sektor', unit: 'komplekt', unitWeight: 4500, tariffId: 'cs-15', tariffName: 'Хранение габаритного груза за одну единицу', dailyRate: 35000, clientIdx: 6 },
    { name: 'Traktor va kombayn uzatish korobkalari (MTZ)', sectorId: 'sec-f', sectorName: 'F Sektor', unit: 'quti', unitWeight: 500, tariffId: 'cs-15', tariffName: 'Хранение сельхозтехники 1 ед./сут', dailyRate: 20000, clientIdx: 6 },
    { name: 'Sanoat vintli havo kompressorlari (Italiya)', sectorId: 'sec-f', sectorName: 'F Sektor', unit: 'dona', unitWeight: 750, tariffId: 'cs-15', tariffName: 'Хранение промышленного оборудования', dailyRate: 25000, clientIdx: 0 }
  ];

  const workers = [
    { name: 'Botir Qodirov', role: 'USER' },
    { name: 'Davron Yusupov', role: 'USER' },
    { name: 'Jamshid Ergashev', role: 'USER' },
    { name: 'Akmal Rahimov', role: 'ADMIN' },
    { name: 'Sardor Alimov', role: 'SUPER_ADMIN' }
  ];

  const transports = [
    'Avtofura (Tent, 20tn)',
    'Refrijerator (20tn, -20°C)',
    'Konteynorvoz (40ft HQ)',
    'Temiryo\'l yopiq vagoni (60tn)',
    'Ochiq bortli avtomashina'
  ];

  const unloadingTypes = [
    'Mexanizatsiyalashgan (Avtopogruzchik)',
    'Qo\'lda (Gruzchiklar brigadasi)',
    'Avtokran bilan (Og\'ir yuklar)'
  ];

  // 6. 5 YILLIK HARAKATLAR (CargoMovements: 2021-11 dan 2026-11 gacha)
  console.log('5. 5 yillik (2021 - 2026) Kirim va Chiqim amallari generatsiya qilinmoqda...');

  const movementsToInsert = [];
  let invoiceCounterIn = 1001;
  let invoiceCounterOut = 2001;

  // Har bir oy uchun harakatlar yaratish
  // 2021-yil 11-oydan 2026-yil 11-oygacha (jami 61 oy)
  for (let year = 2021; year <= 2026; year++) {
    const startMonth = (year === 2021) ? 11 : 1;
    const endMonth = (year === 2026) ? 10 : 12; // 2026 noyabr hozirgi vaqt

    for (let month = startMonth; month <= endMonth; month++) {
      // Har oyda 6 dan 9 tagacha partiya kelib chiqqan
      const operationsInMonth = 6 + ((year * 7 + month * 13) % 4);

      for (let op = 0; op < operationsInMonth; op++) {
        const itemIdx = (year * 17 + month * 19 + op * 7) % cargoCatalog.length;
        const cargo = cargoCatalog[itemIdx];
        const client = clientsData[cargo.clientIdx];
        const worker = workers[(year + month + op) % workers.length];
        const transport = transports[(itemIdx + op) % transports.length];
        const unloading = unloadingTypes[(itemIdx + op) % unloadingTypes.length];

        const inDay = 1 + ((op * 4 + month * 3) % 27);
        const inHour = 8 + ((op * 3) % 9);
        const inMin = (op * 17) % 60;
        const inDate = `${year}-${pad(month)}-${pad(inDay)}`;
        const inTime = formatTime(inHour, inMin);

        // Miqdor va og'irlik
        const baseQty = 100 + ((year * 31 + month * 11 + op * 43) % 400);
        const qty = cargo.unit === 'tn' ? Math.max(5, Math.round(baseQty / 20)) : baseQty;
        const weightKg = Math.round(qty * cargo.unitWeight);

        const inInvoiceNo = `NAK-IN-${year}-${invoiceCounterIn++}`;

        // KIRIM (IN) yozuvi
        movementsToInsert.push({
          invoiceNo: inInvoiceNo,
          sectorId: cargo.sectorId,
          sectorName: cargo.sectorName,
          productName: cargo.name,
          type: 'IN',
          quantity: qty,
          initialQuantity: qty,
          remainingQuantity: 0,
          unit: cargo.unit,
          weightKg: weightKg,
          initialWeightKg: weightKg,
          remainingWeightKg: 0,
          userName: worker.name,
          userRole: worker.role,
          placedBy: worker.name,
          placedDate: inDate,
          date: inDate,
          time: inTime,
          clientName: client.name,
          transportType: transport,
          unloadingType: unloading,
          obrabotkaCostUZS: Math.round(250000 + (weightKg / 1000) * 15000),
          storageTariffName: cargo.tariffName,
          tariffId: cargo.tariffId,
          tariffName: cargo.tariffName,
          tariffDailyRate: cargo.dailyRate,
          notes: `${client.name} uchun rasmiy bojxona kirimi. Shartnoma: ${client.contractNumber}`
        });

        // CHIQIM (OUT) yozuvi: Ushbu yukning saqlanishi va chiqib ketishi
        // Saqlangan kunlar (4 kundan 65 kungacha)
        const daysStored = 4 + ((op * 9 + month * 5 + year * 3) % 62);
        
        // Chiqim sanasini hisoblash
        const exitDateObj = new Date(`${inDate}T12:00:00`);
        exitDateObj.setDate(exitDateObj.getDate() + daysStored);

        // Agar chiqim sanasi 2026-11-05 dan oshib ketmasa, chiqim yozuvini qo'shamiz
        if (exitDateObj <= new Date('2026-11-04T23:59:59')) {
          const outDate = formatDate(exitDateObj);
          const outTime = formatTime(10 + (op % 7), (op * 23) % 60);
          const outInvoiceNo = `NAK-OUT-${exitDateObj.getFullYear()}-${invoiceCounterOut++}`;

          // Xizmatlar summasi
          // Saqlash to'lovi: kunlar * stavka * (tonna yoki dona)
          const multiplier = cargo.unit === 'pallet' || cargo.unit === 'dona' ? qty : (weightKg / 1000);
          const storageCost = Math.round(daysStored * cargo.dailyRate * Math.max(1, multiplier * 0.15));
          const obrabotkaCost = Math.round(250000 + (weightKg / 1000) * 15000);
          const loadingCost = Math.round(200000 + (weightKg / 1000) * 12000);
          const extraCost = (op % 3 === 0) ? 150000 : 0; // Qo'shimcha xizmatlar (markirovka, tortish)

          const subTotal = storageCost + obrabotkaCost + loadingCost + extraCost;
          const vatTotal = Math.round(subTotal * 0.12); // 12% QQS
          const grandTotal = subTotal + vatTotal;

          // To'lov holati: 2021-2025 deyarli 100% PAID, 2026 oxirida ba'zilari PENDING
          const isPending = (exitDateObj.getFullYear() === 2026 && exitDateObj.getMonth() >= 8 && (op % 4 === 0));
          const paymentStatus = isPending ? 'PENDING' : 'PAID';
          const paidAt = isPending ? null : outDate;

          const outWorker = workers[(op + 2) % workers.length];

          movementsToInsert.push({
            invoiceNo: outInvoiceNo,
            sectorId: cargo.sectorId,
            sectorName: cargo.sectorName,
            productName: cargo.name,
            type: 'OUT',
            quantity: qty,
            initialQuantity: qty,
            remainingQuantity: 0,
            unit: cargo.unit,
            weightKg: weightKg,
            initialWeightKg: weightKg,
            remainingWeightKg: 0,
            userName: outWorker.name,
            userRole: outWorker.role,
            placedBy: worker.name,
            placedDate: inDate,
            date: outDate,
            time: outTime,
            clientName: client.name,
            receiverName: client.name,
            receiverInn: client.inn,
            receiverPerson: client.contactPerson,
            transportType: transport,
            loadingType: transport,
            loadingCostUZS: loadingCost,
            obrabotkaCostUZS: obrabotkaCost,
            storageCostUZS: storageCost,
            storageTariffName: cargo.tariffName,
            storageFormula: `${daysStored} kun × ${cargo.dailyRate.toLocaleString()} UZS`,
            additionalCostUZS: extraCost,
            daysStored: daysStored,
            tariffId: cargo.tariffId,
            tariffName: cargo.tariffName,
            tariffDailyRate: cargo.dailyRate,
            totalCostUZS: subTotal,
            vatTotalUZS: vatTotal,
            grandTotalUZS: grandTotal,
            paymentStatus: paymentStatus,
            paidAt: paidAt,
            notes: `Chiqim amalga oshirildi. To'lovchi: ${client.name} (STIR: ${client.inn}). Hujjat: ${outInvoiceNo}`
          });
        }
      }
    }
  }

  // Harakatlarni partiyalab bazaga yozish (chunking)
  const CHUNK_SIZE = 50;
  for (let i = 0; i < movementsToInsert.length; i += CHUNK_SIZE) {
    const chunk = movementsToInsert.slice(i, i + CHUNK_SIZE);
    await prisma.cargoMovement.createMany({
      data: chunk
    });
  }
  console.log(`✓ Jami ${movementsToInsert.length} ta 5 yillik (2021-2026) Kirim va Chiqim operatsiyalari bazaga saqlandi!`);

  // 7. HOZIRDA OMBORDA MAVJUD BO'LGAN YUKLAR (Active Warehouse Stock as of Nov 2026)
  console.log('6. Hozirda omborda turgan qoldiq mahsulotlar (28 ta faol partiya) joylanmoqda...');

  const activeProducts = [
    // Sektor A (Muzlatgich)
    { name: 'Muzlatilgan mol go\'shti (Belgiya, 1-toifa)', sectorId: 'sec-a', sectorName: 'A Sektor', unit: 'quti', qty: 500, weight: 12500, dailyRate: 12000, tariffId: 'cs-21', tariffName: 'Хранение замороженного мяса (-18°C)', clientIdx: 3, inDate: '2026-10-15', inTime: '09:30', worker: 'Botir Qodirov', notes: 'Bojxona ko\'rigidan o\'tgan, A1 otsekka joylangan' },
    { name: 'Muzlatilgan tovuq filesi (Rossiya)', sectorId: 'sec-a', sectorName: 'A Sektor', unit: 'quti', qty: 410, weight: 8200, dailyRate: 12000, tariffId: 'cs-21', tariffName: 'Хранение замороженного мяса (-18°C)', clientIdx: 3, inDate: '2026-10-28', inTime: '11:15', worker: 'Davron Yusupov', notes: 'Veterinariya xulosasi mavjud, A2 otsek' },
    { name: 'Norvegiya losos balig\'i (butun, muzlatilgan)', sectorId: 'sec-a', sectorName: 'A Sektor', unit: 'quti', qty: 180, weight: 4500, dailyRate: 15000, tariffId: 'cs-22', tariffName: 'Хранение рыбы свежемороженой', clientIdx: 8, inDate: '2026-11-01', inTime: '14:20', worker: 'Jamshid Ergashev', notes: 'Premium import baliq, A3 otsek' },
    { name: 'Muzqaymoq kukunlari va meva pyuresi (Turkiya)', sectorId: 'sec-a', sectorName: 'A Sektor', unit: 'qop', qty: 120, weight: 3600, dailyRate: 11000, tariffId: 'cs-21', tariffName: 'Хранение замороженных продуктов', clientIdx: 7, inDate: '2026-11-03', inTime: '10:45', worker: 'Botir Qodirov', notes: 'Oziq-ovqat xomashyosi, A3 otsek' },

    // Sektor B (Salqin ombor)
    { name: 'Gollandiya Gauda va Edam pishloqlari', sectorId: 'sec-b', sectorName: 'B Sektor', unit: 'quti', qty: 270, weight: 5400, dailyRate: 9000, tariffId: 'cs-20', tariffName: 'Хранение молочной продукции (+4°C)', clientIdx: 3, inDate: '2026-10-20', inTime: '08:45', worker: 'Davron Yusupov', notes: 'Niderlandiya importi, harorat rejimi: +4°C' },
    { name: 'Sarxil Ekvador bananlari (premium)', sectorId: 'sec-b', sectorName: 'B Sektor', unit: 'quti', qty: 480, weight: 9600, dailyRate: 8500, tariffId: 'cs-20', tariffName: 'Хранение свежих фруктов (+12°C)', clientIdx: 3, inDate: '2026-11-02', inTime: '12:00', worker: 'Jamshid Ergashev', notes: 'Refrijerator fura orqali yetkazilgan' },
    { name: 'Quruq sut zardobi va oqsil (Belarus)', sectorId: 'sec-b', sectorName: 'B Sektor', unit: 'qop', qty: 560, weight: 14000, dailyRate: 8000, tariffId: 'cs-12', tariffName: 'Хранение 1тн груза в сутки (без паллетоместа)', clientIdx: 7, inDate: '2026-10-10', inTime: '15:10', worker: 'Botir Qodirov', notes: 'B1 otsek, sut zavodi xomashyosi' },
    { name: 'Sarxil Eron kivisi va yashil olma', sectorId: 'sec-b', sectorName: 'B Sektor', unit: 'quti', qty: 360, weight: 7200, dailyRate: 8500, tariffId: 'cs-20', tariffName: 'Хранение свежих фруктов (+4°C)', clientIdx: 2, inDate: '2026-10-29', inTime: '16:30', worker: 'Davron Yusupov', notes: 'Bojxona rasmiylashtiruvida' },

    // Sektor C (Quruq standart)
    { name: 'Oliy navli Qozog\'iston bug\'doy uni (50kg)', sectorId: 'sec-c', sectorName: 'C Sektor', unit: 'qop', qty: 900, weight: 45000, dailyRate: 8000, tariffId: 'cs-12', tariffName: 'Хранение 1тн груза в сутки (без паллетоместа)', clientIdx: 2, inDate: '2026-09-25', inTime: '09:00', worker: 'Botir Qodirov', notes: 'Uzoq muddatli saqlashda (41 kun). Qoplar yaxshi holatda' },
    { name: 'Oq qamish shakari (Rossiya, 50kg)', sectorId: 'sec-c', sectorName: 'C Sektor', unit: 'qop', qty: 600, weight: 30000, dailyRate: 8000, tariffId: 'cs-12', tariffName: 'Хранение 1тн груза в сутки (без паллетоместа)', clientIdx: 7, inDate: '2026-10-05', inTime: '10:20', worker: 'Jamshid Ergashev', notes: 'Temiryo\'l vagonida kelgan, C1 otsek' },
    { name: 'Pokiston uzun donli Basmati guruchi', sectorId: 'sec-c', sectorName: 'C Sektor', unit: 'qop', qty: 800, weight: 20000, dailyRate: 8000, tariffId: 'cs-12', tariffName: 'Хранение 1тн груза в сутки (без паллетоместа)', clientIdx: 3, inDate: '2026-10-18', inTime: '14:00', worker: 'Davron Yusupov', notes: 'Palletlarga terib qo\'yilgan' },
    { name: 'Kungaboqar o\'simlik yog\'i (Rossiya, 1L)', sectorId: 'sec-c', sectorName: 'C Sektor', unit: 'quti', qty: 1150, weight: 11500, dailyRate: 25000, tariffId: 'cs-16', tariffName: 'Хранение грузов 1 места по паллетам, в сутки', clientIdx: 3, inDate: '2026-10-24', inTime: '11:40', worker: 'Botir Qodirov', notes: 'Stellajli tizimda saqlanmoqda' },
    { name: 'Italiya spagetti va makaron mahsulotlari', sectorId: 'sec-c', sectorName: 'C Sektor', unit: 'quti', qty: 680, weight: 6800, dailyRate: 25000, tariffId: 'cs-16', tariffName: 'Хранение грузов 1 места по паллетам, в сутки', clientIdx: 8, inDate: '2026-11-01', inTime: '13:10', worker: 'Jamshid Ergashev', notes: 'Barilla brendi mahsulotlari' },
    { name: 'Chust to\'qimachilik ip-kalavasi (paxta)', sectorId: 'sec-c', sectorName: 'C Sektor', unit: 'qop', qty: 320, weight: 12800, dailyRate: 8000, tariffId: 'cs-12', tariffName: 'Хранение 1тн груза в сутки', clientIdx: 4, inDate: '2026-10-12', inTime: '15:50', worker: 'Davron Yusupov', notes: 'Eksportga yo\'naltirilgan partiya' },

    // Sektor D (Xavfli yuklar)
    { name: 'Avtomobil emal bo\'yoqlari va grunt (Koreya)', sectorId: 'sec-d', sectorName: 'D Sektor', unit: 'kanistr', qty: 320, weight: 6400, dailyRate: 35000, tariffId: 'cs-16', tariffName: 'Хранение опасных и спецгрузов (паллет)', clientIdx: 6, inDate: '2026-10-08', inTime: '10:00', worker: 'Akmal Rahimov', notes: 'Xavfli yuk klassi: 3 (Yonuvchi suyuqlik). D1 maxsus bo\'lim' },
    { name: 'Organik erituvchi moddalar (R-646, Germaniya)', sectorId: 'sec-d', sectorName: 'D Sektor', unit: 'baraban', qty: 240, weight: 4800, dailyRate: 35000, tariffId: 'cs-16', tariffName: 'Хранение опасных и спецгрузов (паллет)', clientIdx: 10, inDate: '2026-10-22', inTime: '14:30', worker: 'Akmal Rahimov', notes: 'Yong\'inga qarshi datchiklar nazorati ostida' },
    { name: 'Sanoat polimer kukunlari va smola (Xitoy)', sectorId: 'sec-d', sectorName: 'D Sektor', unit: 'qop', qty: 340, weight: 8500, dailyRate: 15000, tariffId: 'cs-12', tariffName: 'Хранение химсырья 1тн/сут', clientIdx: 10, inDate: '2026-10-30', inTime: '11:15', worker: 'Botir Qodirov', notes: 'Kimyoviy ishlab chiqarish uchun kukun' },
    { name: 'Sanoat lityum-ionli akkumulyatorlari', sectorId: 'sec-d', sectorName: 'D Sektor', unit: 'pallet', qty: 130, weight: 5200, dailyRate: 40000, tariffId: 'cs-16', tariffName: 'Хранение опасных аккумуляторов', clientIdx: 1, inDate: '2026-11-02', inTime: '16:00', worker: 'Akmal Rahimov', notes: 'Elektromobil va zavod texnikalari uchun' },

    // Sektor E (Qimmatbaho elektronika)
    { name: 'Samsung Galaxy S24 Ultra smartfonlari', sectorId: 'sec-e', sectorName: 'E Sektor', unit: 'quti', qty: 2500, weight: 1200, dailyRate: 50000, tariffId: 'cs-16', tariffName: 'Хранение ценных грузов (паллетоместо)', clientIdx: 11, inDate: '2026-11-01', inTime: '09:15', worker: 'Sardor Alimov', notes: 'Video va biometrik nazoratli maxsus E1 xona' },
    { name: 'Apple iPhone 16 Pro Max va MacBook Air', sectorId: 'sec-e', sectorName: 'E Sektor', unit: 'quti', qty: 1800, weight: 980, dailyRate: 50000, tariffId: 'cs-16', tariffName: 'Хранение ценных грузов (паллетоместо)', clientIdx: 11, inDate: '2026-11-03', inTime: '11:00', worker: 'Sardor Alimov', notes: 'Qimmatbaho yuk, to\'liq plombalangan' },
    { name: 'Dell PowerEdge R760 server uskunalari', sectorId: 'sec-e', sectorName: 'E Sektor', unit: 'dona', qty: 80, weight: 2800, dailyRate: 30000, tariffId: 'cs-15', tariffName: 'Хранение габаритного груза за 1 ед./сут', clientIdx: 0, inDate: '2026-10-16', inTime: '14:45', worker: 'Akmal Rahimov', notes: 'Data markaz uchun server shkaflari' },
    { name: 'Cisco tarmoq kommutatorlari va routerlar', sectorId: 'sec-e', sectorName: 'E Sektor', unit: 'dona', qty: 210, weight: 1400, dailyRate: 45000, tariffId: 'cs-16', tariffName: 'Хранение телеком-оборудования', clientIdx: 0, inDate: '2026-10-26', inTime: '15:20', worker: 'Botir Qodirov', notes: 'Optik tolali tarmoq uskunalari' },
    { name: 'Dronlar va optik sensorlar (Yaponiya)', sectorId: 'sec-e', sectorName: 'E Sektor', unit: 'quti', qty: 140, weight: 850, dailyRate: 40000, tariffId: 'cs-16', tariffName: 'Хранение высокоточной техники', clientIdx: 9, inDate: '2026-11-04', inTime: '10:30', worker: 'Sardor Alimov', notes: 'Geodeziya va qishloq xo\'jaligi dronlari' },

    // Sektor F (Og'ir yuklar & metall)
    { name: 'Qurilish po\'lat armaturasi (A500C, Rossiya)', sectorId: 'sec-f', sectorName: 'F Sektor', unit: 'tn', qty: 65, weight: 65000, dailyRate: 8000, tariffId: 'cs-12', tariffName: 'Хранение 1тн груза в сутки (без паллетоместа)', clientIdx: 0, inDate: '2026-09-10', inTime: '08:00', worker: 'Botir Qodirov', notes: '56 kundan buyon saqlanmoqda, F1 maydon' },
    { name: 'Qarag\'ay va qayin yog\'och taxtalari (Rossiya)', sectorId: 'sec-f', sectorName: 'F Sektor', unit: 'm3', qty: 60, weight: 42000, dailyRate: 8000, tariffId: 'cs-12', tariffName: 'Хранение лесоматериалов за тонну/сутки', clientIdx: 4, inDate: '2026-10-02', inTime: '11:30', worker: 'Jamshid Ergashev', notes: 'Quritilgan qurilish taxtasi, F2 maydon' },
    { name: 'Gidravlik press va shtamp stanogi qismlari', sectorId: 'sec-f', sectorName: 'F Sektor', unit: 'komplekt', qty: 4, weight: 18500, dailyRate: 35000, tariffId: 'cs-15', tariffName: 'Хранение габаритного груза за одну единицу', clientIdx: 6, inDate: '2026-10-19', inTime: '15:00', worker: 'Botir Qodirov', notes: 'Zavod modernizatsiyasi uchun uskunalar' },
    { name: 'Traktor va kombayn uzatish korobkalari (MTZ)', sectorId: 'sec-f', sectorName: 'F Sektor', unit: 'quti', qty: 28, weight: 14200, dailyRate: 20000, tariffId: 'cs-15', tariffName: 'Хранение сельхозтехники 1 ед./сут', clientIdx: 6, inDate: '2026-10-27', inTime: '13:40', worker: 'Davron Yusupov', notes: 'Agrotexservis buyurtmasi' },
    { name: 'Sanoat vintli havo kompressorlari (Italiya)', sectorId: 'sec-f', sectorName: 'F Sektor', unit: 'dona', qty: 12, weight: 8900, dailyRate: 25000, tariffId: 'cs-15', tariffName: 'Хранение промышленного оборудования', clientIdx: 0, inDate: '2026-11-02', inTime: '16:15', worker: 'Jamshid Ergashev', notes: 'Yuqori bosimli kompressorlar' }
  ];

  const dbTariffs = await prisma.tariff.findMany();
  const validTariffIds = new Set(dbTariffs.map(t => t.id));

  const dbClients = await prisma.client.findMany();
  const clientMapByInn = new Map(dbClients.map(c => [c.inn, c]));

  const sectorOccupiedMap = {};
  for (const s of sectorsDef) {
    sectorOccupiedMap[s.id] = 0;
  }

  let totalWarehouseWeight = 0;

  for (const p of activeProducts) {
    const client = clientsData[p.clientIdx];
    const dbClient = clientMapByInn.get(client.inn);
    const validTariffId = validTariffIds.has(p.tariffId) ? p.tariffId : null;
    const obrabotka = Math.round(250000 + (p.weight / 1000) * 15000);
    const obrabotkaVat = Math.round(obrabotka * 0.12);

    const createdProd = await prisma.product.create({
      data: {
        name: p.name,
        category: p.sectorName,
        initialQuantity: p.qty,
        quantity: p.qty,
        unit: p.unit,
        initialWeightKg: p.weight,
        weightKg: p.weight,
        dailyRatePerUnit: p.dailyRate,
        storageTariffId: p.tariffId,
        storageTariffName: p.tariffName,
        storageTariffRate: p.dailyRate,
        storageTariffUnit: '1 ' + p.unit + ' / sutka',
        tariffId: validTariffId,
        tariffName: p.tariffName,
        warehouseId: 'wh-main',
        sectorId: p.sectorId,
        sectorName: p.sectorName,
        clientId: dbClient ? dbClient.id : null,
        clientName: client.name,
        contractNumber: client.contractNumber,
        entryDate: new Date(`${p.inDate}T${p.inTime}:00`),
        entryTime: p.inTime,
        placedBy: p.worker,
        placedByRole: 'USER',
        obrabotkaService: 'Разгрузка механизированная (погрузчиком)',
        obrabotkaCost: obrabotka,
        obrabotkaVat: obrabotkaVat,
        notes: p.notes
      }
    });

    // Ushbu tovar uchun mos kirim (IN) harakati ham mavjud bo'lsin
    const inInvNo = `NAK-IN-2026-${invoiceCounterIn++}`;
    await prisma.cargoMovement.create({
      data: {
        invoiceNo: inInvNo,
        productId: createdProd.id,
        sectorId: p.sectorId,
        sectorName: p.sectorName,
        productName: p.name,
        type: 'IN',
        quantity: p.qty,
        initialQuantity: p.qty,
        remainingQuantity: p.qty,
        unit: p.unit,
        weightKg: p.weight,
        initialWeightKg: p.weight,
        remainingWeightKg: p.weight,
        userName: p.worker,
        userRole: 'USER',
        placedBy: p.worker,
        placedDate: p.inDate,
        date: p.inDate,
        time: p.inTime,
        clientName: client.name,
        transportType: 'Avtofura (Tent, 20tn)',
        unloadingType: 'Mexanizatsiyalashgan (Avtopogruzchik)',
        obrabotkaCostUZS: obrabotka,
        storageTariffName: p.tariffName,
        tariffId: p.tariffId,
        tariffName: p.tariffName,
        tariffDailyRate: p.dailyRate,
        notes: `Hozir omborda faol saqlanmoqda. ${p.notes}`
      }
    });

    sectorOccupiedMap[p.sectorId] = (sectorOccupiedMap[p.sectorId] || 0) + (p.weight / 1000);
    totalWarehouseWeight += (p.weight / 1000);
  }

  // Sektorlar va ombor bandligini yangilash
  for (const [secId, occ] of Object.entries(sectorOccupiedMap)) {
    await prisma.sector.update({
      where: { id: secId },
      data: { occupied: Math.round(occ * 10) / 10 }
    });
  }

  await prisma.warehouse.update({
    where: { id: 'wh-main' },
    data: { occupiedCapacity: Math.round(totalWarehouseWeight * 10) / 10 }
  });

  console.log(`✓ 28 ta aktiv partiya yuklandi (Umumiy og'irlik: ${Math.round(totalWarehouseWeight)} tonna).`);

  // 8. Tahrirlar jurnali (ProductEditLog / AuditLog)
  console.log('7. Audit va Tahrirlar jurnali (20 ta namuna log) kiritilmoqda...');
  const auditLogs = [
    {
      action: 'PRODUCT_EDIT',
      entity: 'Product',
      entityName: 'Oliy navli Qozog\'iston bug\'doy uni (50kg)',
      userName: 'Akmal Rahimov',
      userRole: 'ADMIN',
      date: '2026-10-25',
      time: '14:20',
      month: '2026-10',
      reason: 'Bojxona deklaratsiyasidagi aniq vazn bo\'yicha tuzatish kiritildi',
      sectorName: 'C Sektor',
      clientName: 'SAG AGRO MCHJ',
      changes: [
        { field: 'weightKg', label: 'Og\'irlik (kg)', oldValue: '44500 kg', newValue: '45000 kg' }
      ]
    },
    {
      action: 'PRODUCT_EDIT',
      entity: 'Product',
      entityName: 'Samsung Galaxy S24 Ultra smartfonlari',
      userName: 'Sardor Alimov',
      userRole: 'SUPER_ADMIN',
      date: '2026-11-02',
      time: '11:05',
      month: '2026-11',
      reason: 'Bojxona rasmiylashtiruvi preyskurant tarifi o\'zgartirildi',
      sectorName: 'E Sektor',
      clientName: 'SMART TECH DISTRIBUTION MCHJ',
      changes: [
        { field: 'storageTariffName', label: 'Saqlash tarifi', oldValue: 'Standart saqlash', newValue: 'Хранение ценных грузов (паллетоместо)' }
      ]
    },
    {
      action: 'PRODUCT_DELETE',
      entity: 'Product',
      entityName: 'Noto\'g\'ri kiritilgan sinov partiyasi (Dublikat)',
      userName: 'Sardor Alimov',
      userRole: 'SUPER_ADMIN',
      date: '2026-10-14',
      time: '17:40',
      month: '2026-10',
      reason: 'Operator tomonidan adashib ikkinchi marotaba dublikat kiritilgan partiya bekor qilindi',
      sectorName: 'A Sektor',
      clientName: 'KORZINKA LOGISTICS MCHJ',
      changes: []
    },
    {
      action: 'PRODUCT_EDIT',
      entity: 'Product',
      entityName: 'Avtomobil emal bo\'yoqlari va grunt (Koreya)',
      userName: 'Akmal Rahimov',
      userRole: 'ADMIN',
      date: '2026-10-18',
      time: '16:00',
      month: '2026-10',
      reason: 'Xavfli yuk otseki xavfsizlik talablariga muvofiq qayta belgilandi',
      sectorName: 'D Sektor',
      clientName: 'UZAUTO MOTORS AJ',
      changes: [
        { field: 'sectorName', label: 'Sektor', oldValue: 'C Sektor', newValue: 'D Sektor' }
      ]
    },
    {
      action: 'PRODUCT_EDIT',
      entity: 'Product',
      entityName: 'Qurilish po\'lat armaturasi (A500C, Rossiya)',
      userName: 'Botir Qodirov',
      userRole: 'USER',
      date: '2026-09-18',
      time: '10:30',
      month: '2026-09',
      reason: 'Ortish va tushirish joyi F1 dan F2 ochiq maydonga ko\'chirildi',
      sectorName: 'F Sektor',
      clientName: 'TEXNOPARK MCHJ',
      changes: [
        { field: 'notes', label: 'Izoh', oldValue: 'F1 maydon', newValue: 'F2 kran maydoni' }
      ]
    }
  ];

  for (const log of auditLogs) {
    const isDelete = log.action === 'PRODUCT_DELETE';
    await prisma.auditLog.create({
      data: {
        action: log.action,
        entity: log.entity,
        entityName: log.entityName,
        userName: log.userName,
        userRole: log.userRole,
        details: JSON.stringify({
          actionType: isDelete ? 'DELETE' : 'EDIT',
          sectorName: log.sectorName,
          clientName: log.clientName,
          date: log.date,
          time: log.time,
          month: log.month,
          reason: log.reason,
          changes: log.changes
        }),
        status: isDelete ? 'O\'chirildi' : 'Tahrirlandi',
        createdAt: new Date(`${log.date}T${log.time}:00`)
      }
    });
  }
  console.log(`✓ Audit va tahrirlar loglari saqlandi.`);

  console.log('\n================================================================');
  console.log('🎉 5 YILLIK IMITATSIYA MA\'LUMOTLARI BAZAGA MUVAFFAQIYATLI YUKLANDI!');
  console.log(`- Xodimlar (User jadvali saqlandi): ${existingUsers.length} ta`);
  console.log(`- Mijozlar / To'lovchilar: ${clientsData.length} ta`);
  console.log(`- 5 yillik Harakatlar tarixi (Kirim & Chiqim): ${movementsToInsert.length} ta`);
  console.log(`- Hozirgi kunda ombordagi faol tovar partiyalari: ${activeProducts.length} ta`);
  console.log(`- Tahrirlar tarixi: ${auditLogs.length} ta`);
  console.log('================================================================');
}

main()
  .catch((e) => {
    console.error('Xatolik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
