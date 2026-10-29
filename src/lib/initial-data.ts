
import { User, Warehouse, CargoMovement, Tariff, StoredProduct, CustomsService, ContractPayer } from './types';

export const INITIAL_PAYERS: ContractPayer[] = [];

export const INITIAL_USERS: User[] = [];

export const INITIAL_WAREHOUSE: Warehouse = {
  id: 'wh-main',
  name: 'JB GROUP Bojxona va Markaziy Logistika Majmuasi',
  city: 'Toshkent viloyati',
  address: 'Yangiyo\'l tumani, Bojxona logistika markazi',
  totalCapacity: 17593, // 6676 + 1365 + 3120 + 1560 + 1800 + 3072 = 17 593 m²
  manager: 'Bosh Rahbar',
  phone: '+998 71 200 88 00',
  sectors: [
    {
      id: 'sec-a',
      name: 'A Sektor',
      code: 'SECTOR-A',
      type: 'COLD_FREEZER',
      temperature: '-18°C ... -24°C',
      capacity: 6676,
      subSections: 'A1 - 731 m / A2 - 814 m / A3 - 5 131 m',
      status: 'Faol',
      allowedCargoTypes: ['Muzlatilgan go\'sht', 'Baliq mahsulotlari', 'Muzqaymoq', 'Tez buziluvchi oziq-ovqat'],
      description: 'Bojxona ombori (har bir otsek: A1 - 731 m, A2 - 814 m, A3 - 5 131 m)'
    },
    {
      id: 'sec-b',
      name: 'B Sektor',
      code: 'SECTOR-B',
      type: 'CHILLED',
      temperature: '+2°C ... +6°C',
      capacity: 1365,
      status: 'Faol',
      allowedCargoTypes: ['Sut mahsulotlari', 'Pishloqlar', 'Sarxil meva-sabzavotlar'],
      description: 'Kichik ombor (1 365 m²)'
    },
    {
      id: 'sec-c',
      name: 'C Sektor',
      code: 'SECTOR-C',
      type: 'DRY_STANDARD',
      temperature: '+18°C ... +22°C',
      capacity: 3120,
      status: 'Faol',
      allowedCargoTypes: ['Un va g\'alla', 'Shakar', 'Paxta ip-kalava', 'Qadoqlangan oziq-ovqat'],
      description: '3 120 m² hajmli ombor'
    },
    {
      id: 'sec-d',
      name: 'D Sektor',
      code: 'SECTOR-D',
      type: 'HAZARDOUS',
      temperature: '+15°C ... +20°C',
      capacity: 1560,
      status: 'Faol',
      allowedCargoTypes: ['Bo\'yoq va loklar', 'Kimyoviy reagentlar', 'Yengil yonuvchi moddalar'],
      description: '1 560 m² hajmli ombor'
    },
    {
      id: 'sec-e',
      name: 'E Sektor',
      code: 'SECTOR-E',
      type: 'HIGH_SECURITY',
      temperature: '+20°C',
      capacity: 1800,
      status: 'Faol',
      allowedCargoTypes: ['Smartfon va noutbuklar', 'Server uskunalari', 'Nozik elektronika'],
      description: '1 800 m² hajmli ombor'
    },
    {
      id: 'sec-f',
      name: 'F Sektor',
      code: 'SECTOR-F',
      type: 'DRY_STANDARD',
      temperature: '+16°C ... +22°C',
      capacity: 3072,
      subSections: 'F1 - 480 m / F2 - 2 592 m',
      status: 'Faol',
      allowedCargoTypes: ['Yog\'och, metall, asbob-uskunalar', 'Garaj texnikasi', 'Katta gabaritli yuklar'],
      description: '3 072 m² (F1 - 480 m / F2 - 2 592 m garaj bilan)'
    }
  ]
};

export const INITIAL_STORED_PRODUCTS: StoredProduct[] = [];

export const INITIAL_MOVEMENTS: CargoMovement[] = [];

export const INITIAL_TARIFFS: Tariff[] = [
  {
    id: 'cs-12',
    name: 'Хранение 1тн груза в сутки (без паллетоместа)',
    unitName: 'tn',
    pricePerUnitDay: 8000,
    currency: 'UZS',
    minDays: 1,
    features: ['1 tonna yuk uchun', 'Palletasiz saqlash', '12% QQS: +960 UZS (Jami: 8 960 UZS)']
  },
  {
    id: 'cs-13',
    name: 'Хранение за объем груза свыше 100 тн, за 1тн в сутки (без паллетоместа)',
    unitName: 'tn',
    pricePerUnitDay: 7000,
    currency: 'UZS',
    minDays: 1,
    features: ['100 tonnadan ortiq hajm uchun', 'Imtiyozli stavka', '12% QQS: +840 UZS (Jami: 7 840 UZS)']
  },
  {
    id: 'cs-14',
    name: 'Хранение 1тн груза сроком свыше 60 дней с момента выгрузки в сутки',
    unitName: 'tn',
    pricePerUnitDay: 5000,
    currency: 'UZS',
    minDays: 1,
    features: ['60 kundan ortiq saqlash muddati', 'Uzoq muddatli stavka', '12% QQS: +600 UZS (Jami: 5 600 UZS)']
  },
  {
    id: 'cs-15',
    name: 'Хранение габаритного груза за одну единицу, в сутки',
    unitName: 'dona',
    pricePerUnitDay: 10000,
    currency: 'UZS',
    minDays: 1,
    features: ['Katta gabaritli yuk 1 dona', 'Nostandart uskunalar', '12% QQS: +1 200 UZS (Jami: 11 200 UZS)']
  },
  {
    id: 'cs-16',
    name: 'Хранение грузов 1 места по паллетам, в сутки',
    unitName: 'pallet',
    pricePerUnitDay: 25000,
    currency: 'UZS',
    minDays: 1,
    features: ['1 ta pallet joyi uchun', 'Yevro-stellaj tizimi', '12% QQS: +3 000 UZS (Jami: 28 000 UZS)']
  },
  {
    id: 'cs-17',
    name: 'Хранение 1 ед. легкового автотранспортного средства в сутки',
    unitName: 'avto',
    pricePerUnitDay: 30000,
    currency: 'UZS',
    minDays: 1,
    features: ['1 dona yengil avtomobil', 'Qo\'riqlanadigan avtoturargoh', '12% QQS: +3 600 UZS (Jami: 33 600 UZS)']
  },
  {
    id: 'cs-18',
    name: 'Хранение 1 ед. грузового автотранспортного средства в сутки',
    unitName: 'fura',
    pricePerUnitDay: 50000,
    currency: 'UZS',
    minDays: 1,
    features: ['1 dona yuk avtotransporti (fura)', 'Bojxona nazorati ostida', '12% QQS: +6 000 UZS (Jami: 56 000 UZS)']
  },
  {
    id: 'cs-19',
    name: 'Хранение 1 ед. прочих транспортных средств',
    unitName: 'birlik',
    pricePerUnitDay: 50000,
    currency: 'UZS',
    minDays: 1,
    features: ['Traktor, maxsus qurilish texnikasi', 'Maxsus transport vositalari', '12% QQS: +6 000 UZS (Jami: 56 000 UZS)']
  },
  {
    id: 'cs-20',
    name: 'Хранение 20/40 футового контейнера в сутки',
    unitName: 'konteyner',
    pricePerUnitDay: 50000,
    currency: 'UZS',
    minDays: 1,
    features: ['20 yoki 40 futlik konteyner', 'Konteyner maydonchasi', '12% QQS: +6 000 UZS (Jami: 56 000 UZS)']
  },
  {
    id: 'cs-21',
    name: 'Хранение груза в холодильниках в сутки',
    unitName: 'kg',
    pricePerUnitDay: 50,
    currency: 'UZS',
    minDays: 1,
    features: ['Sanoat sovutgich va muzlatkichlarida', 'Harorat nazorati ostida', '12% QQS: +6 UZS (Jami: 56 UZS/kg)']
  }
];

// JB GROUP Bojxona Ombori Rasmiy Preyskuranti (30 ta xizmat turi va 12% QQS stavkalari)
export const INITIAL_CUSTOMS_SERVICES: CustomsService[] = [
  // 1. РАЗГРУЗКА/ПОГРУЗКА (Yuk ortish va tushirish — 1 MARTALIK XIZMATLAR)
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

  // 2. ХРАНЕНИЕ (FAQAT USHBU SAQLASH XIZMATLARI KUNLAR SONIGA KO'PAYTIRILADI)
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

  // 3. ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ (1 MARTALIK XIZMATLAR — KUNLIK EMAS)
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

