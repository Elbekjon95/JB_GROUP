const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('PostgreSQL bazasiga boshlang\'ich ma\'lumotlar kiritilmoqda...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // 1. Foydalanuvchilar
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@uzw.uz' },
    update: {
      role: 'SUPER_ADMIN',
      fullName: 'Sardor Alimov (Super Admin)',
      canManageTariffs: true,
      canCreateProducts: true,
      canDeleteProducts: true,
      canManageWarehouses: true,
      canStockMovement: true
    },
    create: {
      email: 'superadmin@uzw.uz',
      password: hashedPassword,
      fullName: 'Sardor Alimov (Super Admin)',
      role: 'SUPER_ADMIN',
      company: 'UZW Logistics Group',
      canManageTariffs: true,
      canCreateProducts: true,
      canDeleteProducts: true,
      canManageWarehouses: true,
      canStockMovement: true
    }
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@uzw.uz' },
    update: {
      role: 'ADMIN',
      fullName: 'Akmal Rahimov (Admin)',
      canManageTariffs: true,
      canCreateProducts: true,
      canDeleteProducts: false,
      canManageWarehouses: false,
      canStockMovement: true
    },
    create: {
      email: 'admin@uzw.uz',
      password: hashedPassword,
      fullName: 'Akmal Rahimov (Admin)',
      role: 'ADMIN',
      company: 'UZW Logistics Group',
      canManageTariffs: true,
      canCreateProducts: true,
      canDeleteProducts: false,
      canManageWarehouses: false,
      canStockMovement: true
    }
  });

  const operator = await prisma.user.upsert({
    where: { email: 'user@uzw.uz' },
    update: {
      role: 'USER',
      fullName: 'Botir Qodirov (Omborchi)',
      canManageTariffs: false,
      canCreateProducts: false,
      canDeleteProducts: false,
      canManageWarehouses: false,
      canStockMovement: true
    },
    create: {
      email: 'user@uzw.uz',
      password: userPassword,
      fullName: 'Botir Qodirov (Omborchi)',
      role: 'USER',
      company: 'UZW Logistics Group',
      canManageTariffs: false,
      canCreateProducts: false,
      canDeleteProducts: false,
      canManageWarehouses: false,
      canStockMovement: true
    }
  });
  console.log('Foydalanuvchilar yangilandi.');

  // 2. Tariflar
  const tariffsData = [
    {
      name: 'Standart Pallet Tarifi',
      billingPeriod: 'kunlik',
      pricePerUnit: 15000,
      unitType: 'pallet',
      description: 'Quruq omborda yevro-pallet joyida saqlash (namlik 50-60%)',
      features: ['24/7 video monitoring', 'Yuk ortish-tushirish kafolati', 'Yong\'in xavfsizligi'],
      isPopular: true
    },
    {
      name: 'Muzlatkichli Harorat Tarifi (Xolodilnik)',
      billingPeriod: 'kunlik',
      pricePerUnit: 35000,
      unitType: 'm3',
      description: '-18°C dan -24°C gacha chuqur muzlatkichli maxsus sektorlarda saqlash',
      features: ['Avtomatik termografiya', 'Zaxira generatorlari', 'Tez buziluvchi mahsulotlar'],
      isPopular: true
    },
    {
      name: 'Sovutgichli Zaxira Tarifi (+4°C)',
      billingPeriod: 'kunlik',
      pricePerUnit: 25000,
      unitType: 'm3',
      description: '+2°C dan +6°C gacha sut, meva-sabzavot va dorivor saqlash sektori',
      features: ['Namlik nazorati', 'Havo aylanish tizimi', 'Sanitariya sertifikati'],
      isPopular: false
    },
    {
      name: 'Oylik Katta Hajmli Quruq Tarif',
      billingPeriod: 'oylik',
      pricePerUnit: 280000,
      unitType: 'm3',
      description: 'Uzoq muddatli yirik quruq tovarlar va texnikalar uchun qulay shartlar',
      features: ['Shaxsiy ombor menejeri', 'Barcha sug\'urta qoplamalari'],
      isPopular: false
    }
  ];

  for (const t of tariffsData) {
    const existing = await prisma.tariff.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.tariff.create({ data: t });
    }
  }
  const allTariffs = await prisma.tariff.findMany();

  // 3. Omborlar (Katta asosiy omborlar)
  const warehousesData = [
    {
      name: 'Toshkent Bosh Logistika Markazi',
      city: 'Toshkent shahri, Sergeli tumani',
      address: 'Sanoat ko\'chasi 14-bino',
      type: 'Aralash / Ko\'p tarmoqli Bosh Ombor',
      totalCapacity: 5000,
      occupiedCapacity: 3400,
      manager: 'Javohir Aliyev',
      phone: '+998 90 123 45 67',
      status: 'Faol'
    },
    {
      name: 'Samarqand Ziyokor Muzlatkichli Ombori',
      city: 'Samarqand shahri, Sanoat zonasi',
      address: 'Ulug\'bek shox ko\'chasi',
      type: 'Muzlatkichli & Sovutgichli Markaz',
      totalCapacity: 2500,
      occupiedCapacity: 1200,
      manager: 'Dilshod Karimov',
      phone: '+998 93 987 65 43',
      status: 'Faol'
    },
    {
      name: 'Farg\'ona Tekstil & Zaxira Bazasi',
      city: 'Farg\'ona shahri, Marg\'ilon yo\'li',
      address: 'To\'qimachilar dahasi',
      type: 'Quruq & Eksport Bazasi',
      totalCapacity: 4000,
      occupiedCapacity: 3750,
      manager: 'Nodira Umarova',
      phone: '+998 97 555 12 34',
      status: 'Faol'
    }
  ];

  for (const wh of warehousesData) {
    let w = await prisma.warehouse.findFirst({ where: { name: wh.name } });
    if (!w) {
      w = await prisma.warehouse.create({ data: wh });
    } else {
      await prisma.warehouse.update({ where: { id: w.id }, data: wh });
    }
  }

  const allWarehouses = await prisma.warehouse.findMany();
  const whTashkent = allWarehouses.find(w => w.name.includes('Toshkent'));
  const whSamarqand = allWarehouses.find(w => w.name.includes('Samarqand'));
  const whFargona = allWarehouses.find(w => w.name.includes('Farg\'ona'));

  // 4. Omborlar ichidagi Maxsus Sektorlar (Xolodilnik, Sovutgich, Quruq zaxira va h.k.)
  if (whTashkent) {
    const tashkentSectors = [
      {
        warehouseId: whTashkent.id,
        name: 'Sektor A: Sanoat Xolodilnigi / Chuqur Muzlatkich',
        code: 'TAS-FRZ-01',
        type: 'Xolodilnik / Muzlatkich (-18°C)',
        temperature: '-18°C ... -24°C',
        capacity: 1200,
        occupied: 750,
        status: 'Faol',
        notes: 'Go\'sht, baliq, muzlatilgan yarim tayyor mahsulotlar uchun sanoat xolodilnigi'
      },
      {
        warehouseId: whTashkent.id,
        name: 'Sektor B: O\'rtacha Sovutgich Zonasi',
        code: 'TAS-COLD-02',
        type: 'Sovutgich (+4°C)',
        temperature: '+2°C ... +6°C',
        capacity: 800,
        occupied: 450,
        status: 'Faol',
        notes: 'Sut, pishloq, yangi meva-sabzavot va dorivor preparatlar uchun'
      },
      {
        warehouseId: whTashkent.id,
        name: 'Sektor C: Asosiy Quruq Zaxira',
        code: 'TAS-DRY-03',
        type: 'Standart Quruq',
        temperature: '+18°C ... +22°C',
        capacity: 2200,
        occupied: 1600,
        status: 'Faol',
        notes: 'Un, shakar, don, qadoqlangan oziq-ovqat va nooziq-ovqat tovarlari'
      },
      {
        warehouseId: whTashkent.id,
        name: 'Sektor D: Katta Gabaritli Stellajlar',
        code: 'TAS-HVY-04',
        type: 'Ochiq / Katta Gabarit',
        temperature: 'Standart',
        capacity: 800,
        occupied: 600,
        status: 'Faol',
        notes: 'Og\'ir texnika, elektronika va qurilish aslahalari'
      }
    ];

    for (const sec of tashkentSectors) {
      const ex = await prisma.sector.findFirst({ where: { warehouseId: whTashkent.id, name: sec.name } });
      if (!ex) {
        await prisma.sector.create({ data: sec });
      }
    }
  }

  if (whSamarqand) {
    const samarqandSectors = [
      {
        warehouseId: whSamarqand.id,
        name: 'Sektor X-1: Meva va Go\'sht Muzlatkichi (Xolodilnik)',
        code: 'SAM-FRZ-01',
        type: 'Xolodilnik / Muzlatkich (-18°C)',
        temperature: '-20°C',
        capacity: 1500,
        occupied: 800,
        status: 'Faol',
        notes: 'Chuqur muzlatkichli kamera, eksportga mo\'ljallangan tovarlar'
      },
      {
        warehouseId: whSamarqand.id,
        name: 'Sektor X-2: Sovutgichli Omborxona (+4°C)',
        code: 'SAM-COLD-02',
        type: 'Sovutgich (+4°C)',
        temperature: '+4°C',
        capacity: 1000,
        occupied: 400,
        status: 'Faol',
        notes: 'Sovutish tizimli mahsulotlar saqlanadigan hudud'
      }
    ];

    for (const sec of samarqandSectors) {
      const ex = await prisma.sector.findFirst({ where: { warehouseId: whSamarqand.id, name: sec.name } });
      if (!ex) {
        await prisma.sector.create({ data: sec });
      }
    }
  }

  if (whFargona) {
    const fargonaSectors = [
      {
        warehouseId: whFargona.id,
        name: 'Sektor T-1: Paxta va Xom-ashyo Quruq Zaxirasi',
        code: 'FAR-DRY-01',
        type: 'Standart Quruq',
        temperature: 'Namlik nazorati 45%',
        capacity: 2500,
        occupied: 2350,
        status: 'Faol',
        notes: 'Tekstil xom-ashyosi, ip-kalava va matolar'
      },
      {
        warehouseId: whFargona.id,
        name: 'Sektor T-2: Tayyor Mahsulotlar & Eksport Zonasi',
        code: 'FAR-EXP-02',
        type: 'Standart Quruq',
        temperature: 'Standart',
        capacity: 1500,
        occupied: 1400,
        status: 'Faol',
        notes: 'Qadoqlangan tayyor trikotaj va kiyim-kechak zaxirasi'
      }
    ];

    for (const sec of fargonaSectors) {
      const ex = await prisma.sector.findFirst({ where: { warehouseId: whFargona.id, name: sec.name } });
      if (!ex) {
        await prisma.sector.create({ data: sec });
      }
    }
  }

  // 4.5. Mijozlar (Kontragentlar / Mahsulot Egalari)
  const clientsData = [
    {
      name: 'Shakar Savdo Distribyutsiya MChJ',
      inn: '301290456',
      contactPerson: 'Aziz Ismoilov',
      phone: '+998 93 444 55 66',
      email: 'info@shakarsavdo.uz',
      address: 'Toshkent sh., Sergeli tumani, Sanoat ko\'chasi 12',
      status: 'Faol'
    },
    {
      name: 'Sag Agro Halol Go\'sht MChJ',
      inn: '306781290',
      contactPerson: 'Nodir Karimov',
      phone: '+998 91 111 22 33',
      email: 'agro@sag.uz',
      address: 'Samarqand shahri, Sanoat zonasi 8-hudud',
      status: 'Faol'
    },
    {
      name: 'Pure Milky Sut Mahsulotlari XK',
      inn: '304589123',
      contactPerson: 'Sardor Ahmedov',
      phone: '+998 90 333 44 55',
      email: 'sales@puremilky.uz',
      address: 'Toshkent viloyati, Zangiota tumani',
      status: 'Faol'
    },
    {
      name: 'Farg\'ona Tekstil Ip-Kalava XK',
      inn: '309812456',
      contactPerson: 'Olimbek Yo\'ldoshev',
      phone: '+998 73 222 33 44',
      email: 'textile@fargona.uz',
      address: 'Farg\'ona shahri, To\'qimachilar dahasi 45',
      status: 'Faol'
    },
    {
      name: 'Artel Electronics MChJ',
      inn: '302145896',
      contactPerson: 'Temur Aliyev',
      phone: '+998 71 200 00 00',
      email: 'logistics@artelgroup.org',
      address: 'Toshkent sh., Olmazor tumani, Bobur ko\'chasi 1',
      status: 'Faol'
    }
  ];

  for (const cl of clientsData) {
    const ex = await prisma.client.findFirst({ where: { inn: cl.inn } });
    if (!ex) {
      await prisma.client.create({ data: cl });
    }
  }

  const allClients = await prisma.client.findMany();
  const clShakar = allClients.find(c => c.inn === '301290456');
  const clSag = allClients.find(c => c.inn === '306781290');
  const clPure = allClients.find(c => c.inn === '304589123');
  const clFar = allClients.find(c => c.inn === '309812456');
  const clArtel = allClients.find(c => c.inn === '302145896');

  // 5. Mahsulotlarni sektorlarga biriktirish
  const allSectors = await prisma.sector.findMany();
  const frzSectorTash = allSectors.find(s => s.code === 'TAS-FRZ-01');
  const coldSectorTash = allSectors.find(s => s.code === 'TAS-COLD-02');
  const drySectorTash = allSectors.find(s => s.code === 'TAS-DRY-03');
  const frzSectorSam = allSectors.find(s => s.code === 'SAM-FRZ-01');
  const textSectorFar = allSectors.find(s => s.code === 'FAR-DRY-01');

  const tariffDry = allTariffs.find(t => t.unitType === 'pallet') || allTariffs[0];
  const tariffFreeze = allTariffs.find(t => t.name.includes('Muzlatkich')) || allTariffs[1] || allTariffs[0];

  const sampleProducts = [
    {
      name: 'Oq qand (Shakar) 50kg qopda',
      sku: 'UZ-SHAK-001',
      category: 'Oziq-ovqat',
      warehouseId: whTashkent?.id,
      sectorId: drySectorTash?.id,
      quantity: 450,
      unit: 'qop',
      unitVolume: 0.08,
      tariffId: tariffDry?.id,
      clientId: clShakar?.id,
      minStock: 50,
      notes: 'Quruq C sektorida palletlarda saqlansin'
    },
    {
      name: 'Muzlatilgan tovuq go\'shti (Halol)',
      sku: 'UZ-TOV-882',
      category: 'Go\'sht mahsulotlari',
      warehouseId: whSamarqand?.id,
      sectorId: frzSectorSam?.id,
      quantity: 1200,
      unit: 'kg',
      unitVolume: 0.002,
      tariffId: tariffFreeze?.id,
      clientId: clSag?.id,
      minStock: 200,
      notes: 'Samarqand X-1 Sanoat Xolodilnigida (-20°C)'
    },
    {
      name: 'Muzqaymoq assortiment (Yashiklarda)',
      sku: 'UZ-ICE-104',
      category: 'Muzlatilgan mahsulotlar',
      warehouseId: whTashkent?.id,
      sectorId: frzSectorTash?.id,
      quantity: 350,
      unit: 'quti',
      unitVolume: 0.04,
      tariffId: tariffFreeze?.id,
      clientId: clSag?.id,
      minStock: 80,
      notes: 'Toshkent Sektor A Xolodilnigida (-18°C da saqlansin)'
    },
    {
      name: 'Pasterizatsiyalangan Sut 3.2%',
      sku: 'UZ-MILK-551',
      category: 'Sut mahsulotlari',
      warehouseId: whTashkent?.id,
      sectorId: coldSectorTash?.id,
      quantity: 800,
      unit: 'dona',
      unitVolume: 0.0015,
      tariffId: tariffDry?.id,
      clientId: clPure?.id,
      minStock: 100,
      notes: 'Toshkent Sektor B Sovutgichida (+4°C)'
    },
    {
      name: 'Paxta ip-kalava (№30)',
      sku: 'UZ-TEK-451',
      category: 'Tekstil',
      warehouseId: whFargona?.id,
      sectorId: textSectorFar?.id,
      quantity: 80,
      unit: 'pallet',
      unitVolume: 1.2,
      tariffId: tariffDry?.id,
      clientId: clFar?.id,
      minStock: 20,
      notes: 'Farg\'ona T-1 Quruq zaxira sektorida'
    }
  ];

  for (const pr of sampleProducts) {
    if (pr.warehouseId) {
      const ex = await prisma.product.findFirst({ where: { sku: pr.sku } });
      if (!ex) {
        await prisma.product.create({ data: pr });
      } else {
        await prisma.product.update({
          where: { id: ex.id },
          data: {
            sectorId: pr.sectorId,
            warehouseId: pr.warehouseId,
            clientId: pr.clientId,
            unitVolume: pr.unitVolume
          }
        });
      }
    }
  }

  // 5.5. Saqlash to'lovlari hisob-fakturalari (Demo Invoices)
  const allProds = await prisma.product.findMany();
  const prodSugar = allProds.find(p => p.sku === 'UZ-SHAK-001');
  const prodMeat = allProds.find(p => p.sku === 'UZ-TOV-882');
  const prodMilk = allProds.find(p => p.sku === 'UZ-MILK-551');
  const prodYarn = allProds.find(p => p.sku === 'UZ-TEK-451');

  const demoInvoices = [
    {
      invoiceNumber: 'INV-2026-001',
      clientId: clShakar?.id,
      productId: prodSugar?.id,
      amount: 6750000,
      currency: 'UZS',
      daysStored: 15,
      tariffName: 'Standart Pallet Tarifi',
      tariffRate: 15000,
      status: 'To\'langan',
      notes: '450 qop shakar uchun 15 kunlik saqlash xizmati',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      invoiceNumber: 'INV-2026-002',
      clientId: clSag?.id,
      productId: prodMeat?.id,
      amount: 14000000,
      currency: 'UZS',
      daysStored: 20,
      tariffName: 'Muzlatkichli Harorat Tarifi (-18°C)',
      tariffRate: 35000,
      status: 'Kutilmoqda',
      notes: '1200 kg go\'sht mahsuloti uchun chuqur muzlatkich to\'lovi',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
      invoiceNumber: 'INV-2026-003',
      clientId: clPure?.id,
      productId: prodMilk?.id,
      amount: 2800000,
      currency: 'UZS',
      daysStored: 7,
      tariffName: 'Standart Sovutgich Tarifi',
      tariffRate: 20000,
      status: 'Kutilmoqda',
      notes: '800 dona sut mahsuloti (+4°C sovutgich)',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      invoiceNumber: 'INV-2026-004',
      clientId: clFar?.id,
      productId: prodYarn?.id,
      amount: 36000000,
      currency: 'UZS',
      daysStored: 30,
      tariffName: 'Oylik Katta Hajmli Tarif',
      tariffRate: 280000,
      status: 'To\'langan',
      notes: '80 pallet ip-kalava oylik saqlash to\'lovi to\'liq amalga oshirildi',
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    }
  ];

  for (const inv of demoInvoices) {
    const ex = await prisma.storageInvoice.findUnique({ where: { invoiceNumber: inv.invoiceNumber } });
    if (!ex) {
      await prisma.storageInvoice.create({ data: inv });
    }
  }

  // 6. Dastlabki Kirim va Chiqim Harakatlari (Bugungi va avvalgi tranzaksiyalar)
  const allProducts = await prisma.product.findMany({ include: { warehouse: true, sector: true } });
  const chicken = allProducts.find(p => p.sku === 'UZ-TOV-882');
  const sugar = allProducts.find(p => p.sku === 'UZ-SHAK-001');
  const icecream = allProducts.find(p => p.sku === 'UZ-ICE-104');
  const milk = allProducts.find(p => p.sku === 'UZ-MILK-551');
  const yarn = allProducts.find(p => p.sku === 'UZ-TEK-451');

  await prisma.stockTransaction.deleteMany(); // Eskilarini tozalash

  const now = new Date();
  const transactionsData = [
    // Bugungi Kirimlar
    chicken && {
      productId: chicken.id,
      type: 'IN',
      quantity: 400,
      unit: chicken.unit,
      warehouseName: chicken.warehouse?.name || 'Samarqand Ombori',
      sectorName: chicken.sector?.name || 'Xolodilnik Sektor X-1',
      reason: 'Fermadan yangi sovitilgan partiya qabul qilindi',
      userName: 'Botir Qodirov (Omborchi)',
      date: now
    },
    chicken && {
      productId: chicken.id,
      type: 'OUT',
      quantity: 150,
      unit: chicken.unit,
      warehouseName: chicken.warehouse?.name || 'Samarqand Ombori',
      sectorName: chicken.sector?.name || 'Xolodilnik Sektor X-1',
      reason: 'Korzinka supermarketlar tarmog\'iga yuklandi',
      userName: 'Botir Qodirov (Omborchi)',
      date: now
    },
    sugar && {
      productId: sugar.id,
      type: 'IN',
      quantity: 100,
      unit: sugar.unit,
      warehouseName: sugar.warehouse?.name || 'Toshkent Bosh Ombor',
      sectorName: sugar.sector?.name || 'Sektor C: Quruq Zaxira',
      reason: 'Zavoddan vagon orqali keltirildi (№4512-Hujjat)',
      userName: 'Akmal Rahimov (Admin)',
      date: now
    },
    sugar && {
      productId: sugar.id,
      type: 'OUT',
      quantity: 35,
      unit: sugar.unit,
      warehouseName: sugar.warehouse?.name || 'Toshkent Bosh Ombor',
      sectorName: sugar.sector?.name || 'Sektor C: Quruq Zaxira',
      reason: 'Qandolat fabrikasiga jo\'natildi',
      userName: 'Botir Qodirov (Omborchi)',
      date: now
    },
    icecream && {
      productId: icecream.id,
      type: 'IN',
      quantity: 80,
      unit: icecream.unit,
      warehouseName: icecream.warehouse?.name || 'Toshkent Bosh Ombor',
      sectorName: icecream.sector?.name || 'Sektor A: Xolodilnik',
      reason: 'Ishlab chiqarish sexidan qabul qilindi',
      userName: 'Botir Qodirov (Omborchi)',
      date: now
    },
    icecream && {
      productId: icecream.id,
      type: 'OUT',
      quantity: 25,
      unit: icecream.unit,
      warehouseName: icecream.warehouse?.name || 'Toshkent Bosh Ombor',
      sectorName: icecream.sector?.name || 'Sektor A: Xolodilnik',
      reason: 'Muzlatgichli refrijerator mashinasiga ortildi',
      userName: 'Botir Qodirov (Omborchi)',
      date: now
    },
    milk && {
      productId: milk.id,
      type: 'IN',
      quantity: 300,
      unit: milk.unit,
      warehouseName: milk.warehouse?.name || 'Toshkent Bosh Ombor',
      sectorName: milk.sector?.name || 'Sektor B: Sovutgich',
      reason: 'Sutni qayta ishlash korxonasidan kirim',
      userName: 'Botir Qodirov (Omborchi)',
      date: now
    },
    milk && {
      productId: milk.id,
      type: 'OUT',
      quantity: 120,
      unit: milk.unit,
      warehouseName: milk.warehouse?.name || 'Toshkent Bosh Ombor',
      sectorName: milk.sector?.name || 'Sektor B: Sovutgich',
      reason: 'Chakana savdo do\'konlariga taqsimlandi',
      userName: 'Botir Qodirov (Omborchi)',
      date: now
    },
    yarn && {
      productId: yarn.id,
      type: 'IN',
      quantity: 25,
      unit: yarn.unit,
      warehouseName: yarn.warehouse?.name || 'Farg\'ona Bazasi',
      sectorName: yarn.sector?.name || 'Sektor T-1: Quruq',
      reason: 'Yigiruv fabrikasidan tayyor mahsulot kirimi',
      userName: 'Akmal Rahimov (Admin)',
      date: now
    },
    yarn && {
      productId: yarn.id,
      type: 'OUT',
      quantity: 10,
      unit: yarn.unit,
      warehouseName: yarn.warehouse?.name || 'Farg\'ona Bazasi',
      sectorName: yarn.sector?.name || 'Sektor T-1: Quruq',
      reason: 'Eksportga jo\'natish uchun yuk mashinasiga ortildi',
      userName: 'Botir Qodirov (Omborchi)',
      date: now
    }
  ].filter(Boolean);

  for (const tr of transactionsData) {
    await prisma.stockTransaction.create({ data: tr });
  }

  console.log('✅ Barcha omborlar, ichki sektorlar, mahsulotlar va Kirim/Chiqim tranzaksiyalari yuklandi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
