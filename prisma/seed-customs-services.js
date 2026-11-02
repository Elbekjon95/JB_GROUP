const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// JB GROUP Bojxona Ombori Rasmiy Preyskuranti (30 ta xizmat turi va 12% QQS stavkalari)
const SERVICES = [
  {
    id: 'cs-1',
    itemNo: 1,
    category: 'UNLOADING_LOADING',
    name: 'ж/д вагон (60 тн)',
    nameUz: 'Temiryo\'l vagoni (60 tn) ortish / tushirish',
    unit: '1 martalik (1 vagon)',
    basePrice: 2000000,
    vatRate: 0.12,
    vatAmount: 240000,
    totalPrice: 2240000,
    description: 'Temiryo\'l shoxobcha yo\'lida 60 tonnalik vagonni to\'liq tushirish yoki yuklash (1 martalik xizmat)'
  },
  {
    id: 'cs-2',
    itemNo: 1.1,
    category: 'UNLOADING_LOADING',
    name: 'контейнер 40 футов',
    nameUz: '40 futlik konteyner yuklash / tushirish',
    unit: '1 martalik (40ft konteyner)',
    basePrice: 1100000,
    vatRate: 0.12,
    vatAmount: 132000,
    totalPrice: 1232000,
    description: '40 futlik dengiz yoki temiryo\'l konteyneridan yuk tushirish/yuklash (1 martalik xizmat)'
  },
  {
    id: 'cs-3',
    itemNo: 1.2,
    category: 'UNLOADING_LOADING',
    name: 'контейнер 20 футов',
    nameUz: '20 futlik konteyner yuklash / tushirish',
    unit: '1 martalik (20ft konteyner)',
    basePrice: 800000,
    vatRate: 0.12,
    vatAmount: 96000,
    totalPrice: 896000,
    description: '20 futlik standart konteynerdan yuk tushirish/yuklash (1 martalik xizmat)'
  },
  {
    id: 'cs-4',
    itemNo: 2,
    category: 'UNLOADING_LOADING',
    name: 'Погрузка или разгрузка части груза с помощью кара-погрузчика до 1 тн/за 1тн',
    nameUz: 'Kara-pogruzchik yordamida qisman yuk tushirish/ortish (1 tn gacha / 1 tn uchun)',
    unit: '1 martalik (1 tn)',
    basePrice: 65000,
    vatRate: 0.12,
    vatAmount: 7800,
    totalPrice: 72800,
    description: 'Avtokara yordamida mexanizatsiyalashgan usulda ortish-tushirish (1 martalik to\'lov)'
  },
  {
    id: 'cs-5',
    itemNo: 3,
    category: 'UNLOADING_LOADING',
    name: 'Погрузка или разгрузка части груза россыпью до 1 тн/за 1тн',
    nameUz: 'Sochilma (qo\'lda) qisman yuk tushirish/ortish (1 tn gacha / 1 tn uchun)',
    unit: '1 martalik (1 tn)',
    basePrice: 70000,
    vatRate: 0.12,
    vatAmount: 8400,
    totalPrice: 78400,
    description: 'Poddonsiz, sochilma holatdagi yuklarni qo\'lda yuklash/tushirish (1 martalik to\'lov)'
  },
  {
    id: 'cs-6',
    itemNo: 4,
    category: 'UNLOADING_LOADING',
    name: 'Погрузка или разгрузка тарно-упакованного груза с помощью кара-погрузчика для полного объёма меньше 90 кб.м',
    nameUz: 'Kichik hajm (<90 m³) o\'ralgan yukni kara bilan tushirish/ortish',
    unit: '1 martalik (<90 m³ fura)',
    basePrice: 600000,
    vatRate: 0.12,
    vatAmount: 72000,
    totalPrice: 672000,
    description: '90 m³ gacha bo\'lgan transport vositalari uchun to\'liq paket (1 martalik to\'lov)'
  },
  {
    id: 'cs-7',
    itemNo: 5,
    category: 'UNLOADING_LOADING',
    name: 'Погрузка или разгрузка груза россыпью для полного объёма меньше 90 кб.м',
    nameUz: 'Kichik hajm (<90 m³) sochilma yukni to\'liq tushirish/ortish',
    unit: '1 martalik (<90 m³ fura)',
    basePrice: 700000,
    vatRate: 0.12,
    vatAmount: 84000,
    totalPrice: 784000,
    description: '90 m³ dan kam bo\'lgan yuk avtomobilidagi sochilma yuklar (1 martalik to\'lov)'
  },
  {
    id: 'cs-8',
    itemNo: 6,
    category: 'UNLOADING_LOADING',
    name: 'Погрузка или разгрузка тарно-упакованного груза с помощью кара-погрузчика для полной фуры до 90 кб.м',
    nameUz: 'To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan tushirish/ortish',
    unit: '1 martalik (to\'liq fura)',
    basePrice: 800000,
    vatRate: 0.12,
    vatAmount: 96000,
    totalPrice: 896000,
    description: 'Standart xalqaro tentli furalar (82–90 m³) uchun 1 martalik tushirish/ortish'
  },
  {
    id: 'cs-9',
    itemNo: 7,
    category: 'UNLOADING_LOADING',
    name: 'Погрузка или разгрузка груза россыпью для полной фуры до 90 кб.м',
    nameUz: 'To\'liq fura (90 m³ gacha) sochilma yukni tushirish/ortish',
    unit: '1 martalik (to\'liq fura)',
    basePrice: 900000,
    vatRate: 0.12,
    vatAmount: 108000,
    totalPrice: 1008000,
    description: 'Standart furalardagi o\'ramlanmagan sochilma tovarlar (1 martalik to\'lov)'
  },
  {
    id: 'cs-10',
    itemNo: 8,
    category: 'UNLOADING_LOADING',
    name: 'Погрузка или разгрузка тарно-упакованного груза с помощью кара-погрузчика для полной фуры свыше 90 кб.м',
    nameUz: 'Katta fura (>90 m³) o\'ralgan yukni kara bilan tushirish/ortish',
    unit: '1 martalik (mega fura)',
    basePrice: 900000,
    vatRate: 0.12,
    vatAmount: 108000,
    totalPrice: 1008000,
    description: 'Mega-treyler, katta hajmli furalar (100–120 m³) uchun 1 martalik to\'lov'
  },
  {
    id: 'cs-11',
    itemNo: 9,
    category: 'UNLOADING_LOADING',
    name: 'Погрузка или разгрузка груза россыпью для полной фуры свыше 90 кб.м',
    nameUz: 'Katta fura (>90 m³) sochilma yukni tushirish/ortish',
    unit: '1 martalik (mega fura)',
    basePrice: 1000000,
    vatRate: 0.12,
    vatAmount: 120000,
    totalPrice: 1120000,
    description: 'Mega-treylerdagi to\'liq sochilma yuklar (1 martalik to\'lov)'
  },
  {
    id: 'cs-12',
    itemNo: 10,
    category: 'STORAGE',
    name: 'Хранение 1тн груза в сутки (без паллетоместа)',
    nameUz: '1 tn yuk saqlash (palletasiz) / kuniga',
    unit: '1 tn / kun (kunlik stavka)',
    basePrice: 8000,
    vatRate: 0.12,
    vatAmount: 960,
    totalPrice: 8960,
    description: 'Bojxona omborida 1 tonna yukni kunlik saqlash stavkasi (saqlangan kuniga ko\'paytiriladi)'
  },
  {
    id: 'cs-13',
    itemNo: 11,
    category: 'STORAGE',
    name: 'Хранение за объем груза свыше 100 тн, за 1тн в сутки (без паллетоместа)',
    nameUz: 'Katta hajm (>100 tn) saqlash / 1 tn kuniga (palletasiz)',
    unit: '1 tn / kun (kunlik stavka)',
    basePrice: 7000,
    vatRate: 0.12,
    vatAmount: 840,
    totalPrice: 7840,
    description: '100 tonnadan ortiq partiyalar uchun kunlik saqlash stavkasi (kuniga ko\'paytiriladi)'
  },
  {
    id: 'cs-14',
    itemNo: 12,
    category: 'STORAGE',
    name: 'Хранение 1тн груза сроком свыше 60 дней с момента выгрузки в сутки',
    nameUz: 'Uzoq muddat (>60 kun) saqlash / 1 tn kuniga',
    unit: '1 tn / kun (kunlik stavka)',
    basePrice: 5000,
    vatRate: 0.12,
    vatAmount: 600,
    totalPrice: 5600,
    description: '60 kundan ortiq turgan yuklar uchun kunlik rag\'batlantiruvchi stavka (kuniga ko\'paytiriladi)'
  },
  {
    id: 'cs-15',
    itemNo: 13,
    category: 'STORAGE',
    name: 'Хранение габаритного груза за одну единицу, в сутки',
    nameUz: 'Katta gabaritli yuk saqlash / 1 dona kuniga',
    unit: '1 dona / kun (kunlik stavka)',
    basePrice: 10000,
    vatRate: 0.12,
    vatAmount: 1200,
    totalPrice: 11200,
    description: 'Nostandart, og\'ir yoki katta o\'lchamli yuklar uchun kunlik stavka (kuniga ko\'paytiriladi)'
  },
  {
    id: 'cs-16',
    itemNo: 14,
    category: 'STORAGE',
    name: 'Хранение грузов 1 места по паллетам, в сутки',
    nameUz: 'Palletali joyda yuk saqlash / 1 pallet kuniga',
    unit: '1 pallet / kun (kunlik stavka)',
    basePrice: 25000,
    vatRate: 0.12,
    vatAmount: 3000,
    totalPrice: 28000,
    description: 'Yevro-pallet stellaj tizimida kunlik saqlash stavkasi (kuniga ko\'paytiriladi)'
  },
  {
    id: 'cs-17',
    itemNo: 15,
    category: 'STORAGE',
    name: 'Хранение 1 ед. легкового автотранспортного средства в сутки',
    nameUz: 'Yengil avtotransport saqlash / 1 mashina kuniga',
    unit: '1 avto / kun (kunlik stavka)',
    basePrice: 30000,
    vatRate: 0.12,
    vatAmount: 3600,
    totalPrice: 33600,
    description: 'Qo\'riqlanadigan avtoturargohda yengil avtomobil kunlik saqlash stavkasi (kuniga ko\'paytiriladi)'
  },
  {
    id: 'cs-18',
    itemNo: 16,
    category: 'STORAGE',
    name: 'Хранение 1 ед. грузового автотранспортного средства в сутки',
    nameUz: 'Yuk avtotransporti (fura) saqlash / 1 fura kuniga',
    unit: '1 fura / kun (kunlik stavka)',
    basePrice: 50000,
    vatRate: 0.12,
    vatAmount: 6000,
    totalPrice: 56000,
    description: 'Yuk mashinasi yoki furani bojxona hududida kunlik saqlash stavkasi (kuniga ko\'paytiriladi)'
  },
  {
    id: 'cs-19',
    itemNo: 17,
    category: 'STORAGE',
    name: 'Хранение 1 ед. прочих транспортных средств',
    nameUz: 'Boshqa / maxsus transport vositalari saqlash / kuniga',
    unit: '1 birlik / kun (kunlik stavka)',
    basePrice: 50000,
    vatRate: 0.12,
    vatAmount: 6000,
    totalPrice: 56000,
    description: 'Traktor, maxsus qurilish texnikasi va boshqa vositalar kunlik stavkasi (kuniga ko\'paytiriladi)'
  },
  {
    id: 'cs-20',
    itemNo: 18,
    category: 'STORAGE',
    name: 'Хранение 20/40 футового контейнера в сутки',
    nameUz: '20/40 futlik konteyner saqlash / 1 konteyner kuniga',
    unit: '1 konteyner / kun (kunlik stavka)',
    basePrice: 50000,
    vatRate: 0.12,
    vatAmount: 6000,
    totalPrice: 56000,
    description: 'Konteyner maydonchasida 20 yoki 40 futlik konteyner kunlik saqlash stavkasi (kuniga ko\'paytiriladi)'
  },
  {
    id: 'cs-21',
    itemNo: 19,
    category: 'STORAGE',
    name: 'Хранение груза в холодильниках в сутки',
    nameUz: 'Sovutgich / Muzlatkich (xolodilnik)da saqlash / 1 kg kuniga',
    unit: '1 kg / kun (kunlik stavka)',
    basePrice: 50,
    vatRate: 0.12,
    vatAmount: 6,
    totalPrice: 56,
    description: 'Harorat nazorat qilinadigan sanoat xolodilniklarida kunlik saqlash stavkasi (56 so\'m/kg/kun)'
  },
  {
    id: 'cs-22',
    itemNo: 20,
    category: 'ADDITIONAL',
    name: 'Упаковка стрейч-пленкой за 1плм',
    nameUz: 'Streych-plyonka bilan o\'rash (1 p/m uchun)',
    unit: '1 martalik (1 p/m)',
    basePrice: 25000,
    vatRate: 0.12,
    vatAmount: 3000,
    totalPrice: 28000,
    description: 'Tovarlarni chang va namlikdan himoyalovchi mustahkam streych o\'rami (1 martalik xizmat)'
  },
  {
    id: 'cs-23',
    itemNo: 21,
    category: 'ADDITIONAL',
    name: 'Формирование тарно-упакованного груза (мешки, коробки и т.п) на поддон (без сортировки по видам), за один поддон',
    nameUz: 'Poddonga terish va shakllantirish (saralashsiz) / 1 poddon',
    unit: '1 martalik (1 poddon)',
    basePrice: 30000,
    vatRate: 0.12,
    vatAmount: 3600,
    totalPrice: 33600,
    description: 'Qop, qutilarni yagona poddonga joylashtirish va tekislash (1 martalik to\'lov)'
  },
  {
    id: 'cs-24',
    itemNo: 22,
    category: 'ADDITIONAL',
    name: 'Формирование тарно-упакованного груза (мешки, коробки и т.п) на поддон с сортировкой по видам, за один поддон',
    nameUz: 'Poddonga terish (turlar bo\'yicha saralash bilan) / 1 poddon',
    unit: '1 martalik (1 poddon)',
    basePrice: 50000,
    vatRate: 0.12,
    vatAmount: 6000,
    totalPrice: 56000,
    description: 'Artikullar va partiyalar bo\'yicha alohida saralab terish (1 martalik to\'lov)'
  },
  {
    id: 'cs-25',
    itemNo: 23,
    category: 'ADDITIONAL',
    name: 'Сортировка и формирование груза до 1 тн/за 1тн (при каждой частичной отгрузке)',
    nameUz: 'Yukni saralash va shakllantirish (har bir qisman jo\'natishda) / 1 tn',
    unit: '1 martalik (1 tn)',
    basePrice: 35000,
    vatRate: 0.12,
    vatAmount: 4200,
    totalPrice: 39200,
    description: 'Tovarlarni chiqim qilishda ajratish va saralash (1 martalik to\'lov)'
  },
  {
    id: 'cs-26',
    itemNo: 24,
    category: 'ADDITIONAL',
    name: 'Стоянка за 1 день на территории склада для прибывших грузовых транспортов, готовых к выгрузке для одного грузополучателя',
    nameUz: 'Yuk furasining stoyankasi (1 ta yuk oluvchi uchun)',
    unit: '1 martalik (1 transport)',
    basePrice: 50000,
    vatRate: 0.12,
    vatAmount: 6000,
    totalPrice: 56000,
    description: 'Ombor hududida tushirishga tayyor turgan transport stoyankasi (1 martalik to\'lov, kunlik ko\'paytirilmaydi)'
  },
  {
    id: 'cs-27',
    itemNo: 25,
    category: 'ADDITIONAL',
    name: 'Стоянка за 1 день на территории склада для прибывших грузовых транспортных средств, готовых к выгрузке для нескольких грузополучателей (оплата с каждого грузополучателя)',
    nameUz: 'Yuk furasining stoyankasi (bir nechta yuk oluvchi — har biridan)',
    unit: '1 martalik (har bir mijozdan)',
    basePrice: 30000,
    vatRate: 0.12,
    vatAmount: 3600,
    totalPrice: 33600,
    description: 'Terma yuklar (sborniy gruz) furalari uchun har bir qabul qiluvchidan 1 martalik to\'lov'
  },
  {
    id: 'cs-28',
    itemNo: 26,
    category: 'ADDITIONAL',
    name: 'Провозная плата со станции до таможенного склада «JB GROUP»',
    nameUz: 'Temiryo\'l stansiyasidan «JB GROUP» bojxona omboriga tashish to\'lovi',
    unit: '1 martalik (shartnoma bo\'yicha)',
    basePrice: 500000,
    vatRate: 0.12,
    vatAmount: 60000,
    totalPrice: 560000,
    description: 'Stansiyadan omborga vagon yoki platformalarni yetkazish (1 martalik to\'lov)'
  },
  {
    id: 'cs-29',
    itemNo: 27,
    category: 'ADDITIONAL',
    name: 'Очистка грузового отсека грузовых транспортных средств (за 1 ед.)',
    nameUz: 'Yuk mashinasi yuk xonasini tozalash / yuvish (1 ta transport)',
    unit: '1 martalik (1 transport)',
    basePrice: 150000,
    vatRate: 0.12,
    vatAmount: 18000,
    totalPrice: 168000,
    description: 'Yuk tushirilgandan so\'ng fura kuzovini tozalash (1 martalik to\'lov)'
  },
  {
    id: 'cs-30',
    itemNo: 28,
    category: 'ADDITIONAL',
    name: 'Простой вагона на подъездном пути (за один вагон) в сутки',
    nameUz: 'Vagon shoxobcha yo\'lida bekor turishi (prostoy) / 1 vagon',
    unit: '1 martalik (1 vagon)',
    basePrice: 250000,
    vatRate: 0.12,
    vatAmount: 30000,
    totalPrice: 280000,
    description: 'Shoxobcha temiryo\'lida vagon bekor turgan holat uchun 1 martalik to\'lov (saqlash kuniga ko\'paytirilmaydi)'
  },
  {
    id: 'cs-31',
    itemNo: 29,
    category: 'ADDITIONAL',
    name: 'Очистка вагона (за один вагон)',
    nameUz: 'Temiryo\'l vagonini tozalash / 1 vagon',
    unit: '1 martalik (1 vagon)',
    basePrice: 250000,
    vatRate: 0.12,
    vatAmount: 30000,
    totalPrice: 280000,
    description: 'Vagon ichidagi chiqindilarni tozalash (1 martalik xizmat)'
  },
  {
    id: 'cs-32',
    itemNo: 30,
    category: 'ADDITIONAL',
    name: 'Кросс-докинг оформление грузов через территорию таможенного склада на условиях выпуска для свободного обращения',
    nameUz: 'Kross-doking bojxona rasmiylashtiruvi (erkin muomala shartida)',
    unit: '1 martalik (1 transport)',
    basePrice: 400000,
    vatRate: 0.12,
    vatAmount: 48000,
    totalPrice: 448000,
    description: 'Omborga joylamasdan to\'g\'ridan-to\'g\'ri transportdan transportga o\'tkazish (1 martalik to\'lov)'
  }
];

async function seed() {
  console.log('Bojxona xizmatlari (Preyskurant) bazaga yuklanmoqda...');
  for (const s of SERVICES) {
    await prisma.customsService.upsert({
      where: { id: s.id },
      update: s,
      create: s
    });
  }
  console.log(`✅ ${SERVICES.length} ta bojxona xizmati bazaga muvaffaqiyatli saqlandi!`);
}

seed()
  .catch(err => {
    console.error('Xatolik:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

