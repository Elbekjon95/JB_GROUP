import { CustomsServiceCategory, Language } from './types';

export interface WarehouseUnitOption {
  value: string;
  category: CustomsServiceCategory | 'ALL';
  labelUz: string;
  labelRu: string;
  labelEn: string;
  calcType: 'PER_TON' | 'PER_KG' | 'PER_PALLET' | 'PER_PIECE' | 'PER_TRANSPORT' | 'FIXED';
}

export const TARIFF_UNIT_OPTIONS: WarehouseUnitOption[] = [
  // =========================================================================
  // 1. STORAGE UNITS (Kunlik saqlash birliklari — kuniga ko'paytiriladi)
  // =========================================================================
  {
    value: '1 tn / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 tn / sutka — tonna bo\'yicha)',
    labelRu: '📅 Посуточно (1 тн / сут — за 1 тонну)',
    labelEn: '📅 Daily (1 ton / day)',
    calcType: 'PER_TON'
  },
  {
    value: '1 tn / sutka',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 tn / sutka — tonna bo\'yicha)',
    labelRu: '📅 Посуточно (1 тн / сут — за 1 тонну)',
    labelEn: '📅 Daily (1 ton / day)',
    calcType: 'PER_TON'
  },
  {
    value: '1 kg / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 kg / sutka — muzlatkich/sovutgich)',
    labelRu: '📅 Посуточно (1 кг / сут — холодильник)',
    labelEn: '📅 Daily (1 kg / day — cold storage)',
    calcType: 'PER_KG'
  },
  {
    value: '1 kg / sutka',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 kg / sutka — muzlatkich/sovutgich)',
    labelRu: '📅 Посуточно (1 кг / сут — холодильник)',
    labelEn: '📅 Daily (1 kg / day — cold storage)',
    calcType: 'PER_KG'
  },
  {
    value: '1 pallet / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 pallet / sutka — poddon o\'rni)',
    labelRu: '📅 Посуточно (1 паллет / сут — паллетоместо)',
    labelEn: '📅 Daily (1 pallet / day)',
    calcType: 'PER_PALLET'
  },
  {
    value: '1 pallet / sutka',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 pallet / sutka — poddon o\'rni)',
    labelRu: '📅 Посуточно (1 паллет / сут — паллетоместо)',
    labelEn: '📅 Daily (1 pallet / day)',
    calcType: 'PER_PALLET'
  },
  {
    value: '1 dona / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 dona / sutka — tovar birligi)',
    labelRu: '📅 Посуточно (1 шт / сут — за 1 штуку)',
    labelEn: '📅 Daily (1 pc / day)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 dona / sutka',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 dona / sutka — tovar birligi)',
    labelRu: '📅 Посуточно (1 шт / сут — за 1 штуку)',
    labelEn: '📅 Daily (1 pc / day)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 avto / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 avto / sutka — avtotransport)',
    labelRu: '📅 Посуточно (1 авто / сут — автотранспорт)',
    labelEn: '📅 Daily (1 vehicle / day)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 fura / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 fura / sutka — to\'liq fura)',
    labelRu: '📅 Посуточно (1 фура / сут — полная фура)',
    labelEn: '📅 Daily (1 truck / day)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 konteyner / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 konteyner / sutka)',
    labelRu: '📅 Посуточно (1 контейнер / сут)',
    labelEn: '📅 Daily (1 container / day)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 birlik / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 birlik / sutka — shartli birlik)',
    labelRu: '📅 Посуточно (1 ед / сут — за единицу)',
    labelEn: '📅 Daily (1 unit / day)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 quti / sutka',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 quti / sutka — karobka)',
    labelRu: '📅 Посуточно (1 коробка / сут — за коробку)',
    labelEn: '📅 Daily (1 box / day)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 qop / sutka',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 qop / sutka — meshok)',
    labelRu: '📅 Посуточно (1 мешок / сут — за мешок)',
    labelEn: '📅 Daily (1 bag / day)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 m² / sutka',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 m² / sutka — kvadrat metr)',
    labelRu: '📅 Посуточно (1 м² / сут — за кв. метр)',
    labelEn: '📅 Daily (1 sq.m / day)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 m³ / sutka',
    category: 'STORAGE',
    labelUz: '📅 Bir kunlik (1 m³ / sutka — kub metr)',
    labelRu: '📅 Посуточно (1 м³ / сут — за куб. метр)',
    labelEn: '📅 Daily (1 cu.m / day)',
    calcType: 'PER_PIECE'
  },

  // =========================================================================
  // 2. UNLOADING / LOADING (Ortish va Tushirish — 1 martalik to'lovlar)
  // =========================================================================
  {
    value: '1 martalik (40ft konteyner)',
    category: 'UNLOADING_LOADING',
    labelUz: '⚡ 1 martalik — 40 futlik konteyner',
    labelRu: '⚡ Разовый — 40-футовый контейнер',
    labelEn: '⚡ One-time — 40ft container',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (20ft konteyner)',
    category: 'UNLOADING_LOADING',
    labelUz: '⚡ 1 martalik — 20 futlik konteyner',
    labelRu: '⚡ Разовый — 20-футовый контейнер',
    labelEn: '⚡ One-time — 20ft container',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (1 vagon)',
    category: 'UNLOADING_LOADING',
    labelUz: '⚡ 1 martalik — Temiryo\'l vagoni (60 tn)',
    labelRu: '⚡ Разовый — ж/д вагон (60 тн)',
    labelEn: '⚡ One-time — railcar (60 tn)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (<90 m³ fura)',
    category: 'UNLOADING_LOADING',
    labelUz: '⚡ 1 martalik — Standart fura (<90 m³)',
    labelRu: '⚡ Разовый — стандартная фура (<90 м³)',
    labelEn: '⚡ One-time — standard truck (<90 m³)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (to\'liq fura)',
    category: 'UNLOADING_LOADING',
    labelUz: '⚡ 1 martalik — To\'liq fura (20 tn gacha)',
    labelRu: '⚡ Разовый — полная фура (до 20 тн)',
    labelEn: '⚡ One-time — full truck (up to 20 tn)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (mega fura)',
    category: 'UNLOADING_LOADING',
    labelUz: '⚡ 1 martalik — Katta fura (>90 m³ / mega fura)',
    labelRu: '⚡ Разовый — большая фура (>90 м³ / мега)',
    labelEn: '⚡ One-time — mega truck (>90 m³)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (1 tn)',
    category: 'UNLOADING_LOADING',
    labelUz: '⚡ 1 martalik — 1 tonna yuk bo\'yicha',
    labelRu: '⚡ Разовый — за 1 тонну груза',
    labelEn: '⚡ One-time — per 1 ton of cargo',
    calcType: 'PER_TON'
  },
  {
    value: '1 martalik (1 pallet)',
    category: 'UNLOADING_LOADING',
    labelUz: '⚡ 1 martalik — 1 pallet (poddon) bo\'yicha',
    labelRu: '⚡ Разовый — за 1 паллет (поддон)',
    labelEn: '⚡ One-time — per 1 pallet',
    calcType: 'PER_PALLET'
  },
  {
    value: '1 martalik (1 dona)',
    category: 'UNLOADING_LOADING',
    labelUz: '⚡ 1 martalik — 1 dona (shtuk) bo\'yicha',
    labelRu: '⚡ Разовый — за 1 штуку',
    labelEn: '⚡ One-time — per 1 piece',
    calcType: 'PER_PIECE'
  },

  // =========================================================================
  // 3. ADDITIONAL SERVICES (Qo'shimcha xizmatlar — 1 martalik to'lovlar)
  // =========================================================================
  {
    value: '1 martalik (1 operatsiya)',
    category: 'ADDITIONAL',
    labelUz: '⚡ 1 martalik — 1 ta operatsiya / xizmat',
    labelRu: '⚡ Разовый — 1 операция / услуga',
    labelEn: '⚡ One-time — 1 operation',
    calcType: 'FIXED'
  },
  {
    value: '1 martalik (1 p/m)',
    category: 'ADDITIONAL',
    labelUz: '⚡ 1 martalik — 1 p/m (streych o\'rash)',
    labelRu: '⚡ Разовый — 1 п/м (стретч-пленка)',
    labelEn: '⚡ One-time — 1 linear meter (stretch)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 martalik (1 poddon)',
    category: 'ADDITIONAL',
    labelUz: '⚡ 1 martalik — 1 ta poddon / pallet',
    labelRu: '⚡ Разовый — 1 поддон / паллет',
    labelEn: '⚡ One-time — 1 pallet',
    calcType: 'PER_PALLET'
  },
  {
    value: '1 martalik (1 tn)',
    category: 'ADDITIONAL',
    labelUz: '⚡ 1 martalik — 1 tonna bo\'yicha',
    labelRu: '⚡ Разовый — за 1 тонну',
    labelEn: '⚡ One-time — per 1 ton',
    calcType: 'PER_TON'
  },
  {
    value: '1 martalik (1 transport)',
    category: 'ADDITIONAL',
    labelUz: '⚡ 1 martalik — 1 ta transport vositasi',
    labelRu: '⚡ Разовый — 1 автотранспорт',
    labelEn: '⚡ One-time — 1 vehicle',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (1 vagon)',
    category: 'ADDITIONAL',
    labelUz: '⚡ 1 martalik — 1 ta temiryo\'l vagoni',
    labelRu: '⚡ Разовый — 1 ж/д вагон',
    labelEn: '⚡ One-time — 1 railcar',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (har bir mijozdan)',
    category: 'ADDITIONAL',
    labelUz: '⚡ 1 martalik — Har bir mijozdan',
    labelRu: '⚡ Разовый — с каждого клиента',
    labelEn: '⚡ One-time — per client',
    calcType: 'FIXED'
  },
  {
    value: '1 martalik (shartnoma bo\'yicha)',
    category: 'ADDITIONAL',
    labelUz: '⚡ 1 martalik — Shartnoma bo\'yicha',
    labelRu: '⚡ Разовый — по договору',
    labelEn: '⚡ One-time — per contract',
    calcType: 'FIXED'
  },
  {
    value: '1 martalik (1 reys)',
    category: 'ADDITIONAL',
    labelUz: '⚡ 1 martalik — 1 ta reys / qatnov',
    labelRu: '⚡ Разовый — 1 рейс',
    labelEn: '⚡ One-time — 1 trip',
    calcType: 'FIXED'
  },
  {
    value: '1 martalik (1 sutka)',
    category: 'ADDITIONAL',
    labelUz: '⚡ 1 martalik — 1 sutka (avtoturargoh / stoyanka)',
    labelRu: '⚡ Разовый — 1 сутки (стоянка)',
    labelEn: '⚡ One-time — 1 day parking',
    calcType: 'FIXED'
  },
  {
    value: '1 martalik (1 kross-doking)',
    category: 'ADDITIONAL',
    labelUz: '⚡ 1 martalik — 1 ta kross-doking operatsiyasi',
    labelRu: '⚡ Разовый — 1 кросс-докинг',
    labelEn: '⚡ One-time — 1 cross-docking',
    calcType: 'FIXED'
  }
];

export function getUnitsForCategory(category: CustomsServiceCategory): WarehouseUnitOption[] {
  const filtered = TARIFF_UNIT_OPTIONS.filter(u => u.category === category || u.category === 'ALL');
  return filtered.length > 0 ? filtered : TARIFF_UNIT_OPTIONS;
}

export function formatUnitLabel(unitVal: string, lang: Language = 'uz'): string {
  const matched = TARIFF_UNIT_OPTIONS.find(u => u.value === unitVal);
  if (!matched) return unitVal;
  return lang === 'ru' ? matched.labelRu : lang === 'en' ? matched.labelEn : matched.labelUz;
}

/**
 * Berilgan o'lchov birligi (unit) va kategoriya bo'yicha hisoblash turini aniqlash.
 */
export function getUnitCalcType(
  unitStr: string = '',
  category?: CustomsServiceCategory
): 'PER_TON' | 'PER_KG' | 'PER_PALLET' | 'PER_PIECE' | 'PER_TRANSPORT' | 'FIXED' {
  const u = (unitStr || '').toLowerCase().trim();

  // 1. To'liq moslik
  const match = TARIFF_UNIT_OPTIONS.find(o => o.value.toLowerCase() === u);
  if (match) return match.calcType;

  // 2. Kilogramm
  if (u.includes('kg') || u.includes('кг')) return 'PER_KG';

  // 3. Tonna
  if (u.includes('tn') || u.includes('тн') || u.includes('тонн')) return 'PER_TON';

  // 4. Pallet / poddon
  if (u.includes('pallet') || u.includes('паллет') || u.includes('poddon') || u.includes('поддон')) return 'PER_PALLET';

  // 5. Dona, quti, qop, paket
  if (u.includes('dona') || u.includes('шт') || u.includes('quti') || u.includes('короб') || u.includes('qop') || u.includes('мешок') || u.includes('birlik')) {
    return 'PER_PIECE';
  }

  // 6. Transport / Vagon / Fura / Konteyner
  if (
    u.includes('vagon') || u.includes('вагон') ||
    u.includes('fura') || u.includes('фура') ||
    u.includes('konteyner') || u.includes('контейнер') ||
    u.includes('transport') || u.includes('авто')
  ) {
    return 'PER_TRANSPORT';
  }

  // 7. Agar saqlash bo'lsa dona/birlik, aks holda belgilangan (FIXED)
  return category === 'STORAGE' ? 'PER_PIECE' : 'FIXED';
}

export interface ServiceCostResult {
  calcType: 'PER_TON' | 'PER_KG' | 'PER_PALLET' | 'PER_PIECE' | 'PER_TRANSPORT' | 'FIXED';
  baseCost: number;
  vatAmount: number;
  totalCost: number;
  formulaText: string;
  detailNote: string;
}

/**
 * Bojxona xizmati (tushirish, ortish, saqlash, qo'shimcha) narxini o'lchov birligiga asosan aniq hisoblash.
 */
export function calculateServiceCharge({
  unit,
  category,
  basePrice,
  weightKg = 0,
  quantity = 1,
  days = 1,
  transportCount = 1
}: {
  unit: string;
  category: CustomsServiceCategory;
  basePrice: number;
  weightKg?: number;
  quantity?: number;
  days?: number;
  transportCount?: number;
}): ServiceCostResult {
  const calcType = getUnitCalcType(unit, category);
  const safeDays = Math.max(1, days);
  const safeQty = Math.max(0, quantity);
  const safeWeightKg = Math.max(0, weightKg);
  const weightTn = +(safeWeightKg / 1000).toFixed(3);
  const safeTransportCount = Math.max(1, transportCount);

  let baseCost = 0;
  let formulaText = '';
  let detailNote = '';

  if (category === 'STORAGE') {
    switch (calcType) {
      case 'PER_TON': {
        baseCost = Math.round(weightTn * basePrice * safeDays);
        formulaText = `${weightTn} tn (${safeWeightKg.toLocaleString('uz-UZ')} kg) × ${basePrice.toLocaleString('uz-UZ')} UZS/tn × ${safeDays} kun`;
        detailNote = `Hajmi: ${weightTn} tn (${safeWeightKg.toLocaleString('uz-UZ')} kg) × ${basePrice.toLocaleString('uz-UZ')} so'm/tn/kun`;
        break;
      }
      case 'PER_KG': {
        baseCost = Math.round(safeWeightKg * basePrice * safeDays);
        formulaText = `${safeWeightKg.toLocaleString('uz-UZ')} kg × ${basePrice.toLocaleString('uz-UZ')} so'm/kg × ${safeDays} kun`;
        detailNote = `Hajmi: ${safeWeightKg.toLocaleString('uz-UZ')} kg × ${basePrice.toLocaleString('uz-UZ')} so'm/kg/kun`;
        break;
      }
      case 'PER_PALLET': {
        baseCost = Math.round(safeQty * basePrice * safeDays);
        formulaText = `${safeQty} pallet × ${basePrice.toLocaleString('uz-UZ')} UZS/pallet × ${safeDays} kun`;
        detailNote = `Hajmi: ${safeQty} pallet × ${basePrice.toLocaleString('uz-UZ')} so'm/pallet/kun`;
        break;
      }
      case 'PER_TRANSPORT': {
        baseCost = Math.round(safeTransportCount * basePrice * safeDays);
        formulaText = `${safeTransportCount} avto/konteyner × ${basePrice.toLocaleString('uz-UZ')} UZS × ${safeDays} kun`;
        detailNote = `Hajmi: ${safeTransportCount} birlik × ${basePrice.toLocaleString('uz-UZ')} so'm/kun`;
        break;
      }
      case 'PER_PIECE':
      default: {
        baseCost = Math.round(safeQty * basePrice * safeDays);
        formulaText = `${safeQty} dona/birlik × ${basePrice.toLocaleString('uz-UZ')} UZS × ${safeDays} kun`;
        detailNote = `Hajmi: ${safeQty} dona × ${basePrice.toLocaleString('uz-UZ')} so'm/kun`;
        break;
      }
    }
  } else {
    // UNLOADING_LOADING va ADDITIONAL (1 martalik xizmatlar)
    switch (calcType) {
      case 'PER_TON': {
        baseCost = Math.round(weightTn * basePrice);
        formulaText = `${weightTn} tn (${safeWeightKg.toLocaleString('uz-UZ')} kg) × ${basePrice.toLocaleString('uz-UZ')} UZS/tn`;
        detailNote = `1 martalik: ${weightTn} tn × ${basePrice.toLocaleString('uz-UZ')} so'm/tn`;
        break;
      }
      case 'PER_KG': {
        baseCost = Math.round(safeWeightKg * basePrice);
        formulaText = `${safeWeightKg.toLocaleString('uz-UZ')} kg × ${basePrice.toLocaleString('uz-UZ')} so'm/kg`;
        detailNote = `1 martalik: ${safeWeightKg.toLocaleString('uz-UZ')} kg × ${basePrice.toLocaleString('uz-UZ')} so'm/kg`;
        break;
      }
      case 'PER_PALLET': {
        baseCost = Math.round(safeQty * basePrice);
        formulaText = `${safeQty} pallet × ${basePrice.toLocaleString('uz-UZ')} UZS/pallet`;
        detailNote = `1 martalik: ${safeQty} pallet × ${basePrice.toLocaleString('uz-UZ')} so'm/pallet`;
        break;
      }
      case 'PER_PIECE': {
        baseCost = Math.round(safeQty * basePrice);
        formulaText = `${safeQty} dona × ${basePrice.toLocaleString('uz-UZ')} UZS/dona`;
        detailNote = `1 martalik: ${safeQty} dona × ${basePrice.toLocaleString('uz-UZ')} so'm/dona`;
        break;
      }
      case 'PER_TRANSPORT': {
        baseCost = Math.round(basePrice * safeTransportCount);
        formulaText = safeTransportCount > 1 
          ? `${safeTransportCount} ta transport × ${basePrice.toLocaleString('uz-UZ')} UZS`
          : `1 ta transport × ${basePrice.toLocaleString('uz-UZ')} UZS`;
        detailNote = `1 martalik: ${basePrice.toLocaleString('uz-UZ')} so'm/transport`;
        break;
      }
      case 'FIXED':
      default: {
        baseCost = Math.round(basePrice);
        formulaText = `1 martalik to'lov: ${basePrice.toLocaleString('uz-UZ')} UZS`;
        detailNote = `1 martalik: ${basePrice.toLocaleString('uz-UZ')} so'm`;
        break;
      }
    }
  }

  const vatAmount = Math.round(baseCost * 0.12);
  const totalCost = baseCost + vatAmount;

  return {
    calcType,
    baseCost,
    vatAmount,
    totalCost,
    formulaText,
    detailNote
  };
}
