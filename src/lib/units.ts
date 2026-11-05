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
  // 1. STORAGE UNITS (Kunlik saqlash birliklari)
  // =========================================================================
  {
    value: '1 tn / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '1 tn / kun (Tonna bo\'yicha kunlik stavka)',
    labelRu: '1 тн / сут (Посуточно за 1 тонну)',
    labelEn: '1 ton / day (Daily rate per ton)',
    calcType: 'PER_TON'
  },
  {
    value: '1 tn / sutka',
    category: 'STORAGE',
    labelUz: '1 tn / sutka (Tonna bo\'yicha kunlik stavka)',
    labelRu: '1 тн / сут (Посуточно за 1 тонну)',
    labelEn: '1 ton / day (Daily rate per ton)',
    calcType: 'PER_TON'
  },
  {
    value: '1 kg / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '1 kg / kun (Muzlatkich / sovutkich kunlik stavkasi)',
    labelRu: '1 кг / сут (Посуточно за 1 кг — холодильник)',
    labelEn: '1 kg / day (Daily cold storage per kg)',
    calcType: 'PER_KG'
  },
  {
    value: '1 kg / sutka',
    category: 'STORAGE',
    labelUz: '1 kg / sutka (Muzlatkich / sovutkich kunlik stavkasi)',
    labelRu: '1 кг / сут (Посуточно за 1 кг — холодильник)',
    labelEn: '1 kg / day (Daily cold storage per kg)',
    calcType: 'PER_KG'
  },
  {
    value: '1 pallet / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '1 pallet / kun (Pallet o\'rni bo\'yicha kunlik stavka)',
    labelRu: '1 паллет / сут (Посуточно за паллетоместо)',
    labelEn: '1 pallet / day (Daily per pallet space)',
    calcType: 'PER_PALLET'
  },
  {
    value: '1 pallet / sutka',
    category: 'STORAGE',
    labelUz: '1 pallet / sutka (Pallet o\'rni bo\'yicha kunlik stavka)',
    labelRu: '1 паллет / сут (Посуточно за паллетоместо)',
    labelEn: '1 pallet / day (Daily per pallet space)',
    calcType: 'PER_PALLET'
  },
  {
    value: '1 dona / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '1 dona / kun (Dona bo\'yicha kunlik stavka)',
    labelRu: '1 шт / сут (Посуточно за 1 штуку)',
    labelEn: '1 pc / day (Daily rate per piece)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 dona / sutka',
    category: 'STORAGE',
    labelUz: '1 dona / sutka (Dona bo\'yicha kunlik stavka)',
    labelRu: '1 шт / сут (Посуточно за 1 штуку)',
    labelEn: '1 pc / day (Daily rate per piece)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 avto / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '1 avto / kun (Avtotransport kunlik saqlash)',
    labelRu: '1 авто / сут (Посуточно за единицу автотранспорта)',
    labelEn: '1 vehicle / day (Daily rate per vehicle)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 fura / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '1 fura / kun (To\'liq fura kunlik saqlash)',
    labelRu: '1 фура / сут (Посуточно за полную фуру)',
    labelEn: '1 truck / day (Daily rate per truck)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 konteyner / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '1 konteyner / kun (Konteyner kunlik stavkasi)',
    labelRu: '1 контейнер / сут (Посуточно за контейнер)',
    labelEn: '1 container / day (Daily per container)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 birlik / kun (kunlik stavka)',
    category: 'STORAGE',
    labelUz: '1 birlik / kun (Shartli birlik kunlik stavkasi)',
    labelRu: '1 ед / сут (Посуточно за единицу)',
    labelEn: '1 unit / day (Daily rate per unit)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 quti / sutka',
    category: 'STORAGE',
    labelUz: '1 quti / sutka (Karobka / quti bo\'yicha)',
    labelRu: '1 коробка / сут (Посуточно за коробку)',
    labelEn: '1 box / day (Daily rate per box)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 qop / sutka',
    category: 'STORAGE',
    labelUz: '1 qop / sutka (Qop / meshok bo\'yicha)',
    labelRu: '1 мешок / сут (Посуточно за мешок)',
    labelEn: '1 bag / day (Daily rate per bag)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 m² / sutka',
    category: 'STORAGE',
    labelUz: '1 m² / sutka (Maydon bo\'yicha kunlik stavka)',
    labelRu: '1 м² / сут (Посуточно за кв. метр)',
    labelEn: '1 sq.m / day (Daily rate per sq.m)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 m³ / sutka',
    category: 'STORAGE',
    labelUz: '1 m³ / sutka (Hajm bo\'yicha kunlik stavka)',
    labelRu: '1 м³ / сут (Посуточно за куб. метр)',
    labelEn: '1 cu.m / day (Daily rate per cu.m)',
    calcType: 'PER_PIECE'
  },

  // =========================================================================
  // 2. UNLOADING / LOADING (Ortish va Tushirish birliklari — 1 martalik)
  // =========================================================================
  {
    value: '1 martalik (40ft konteyner)',
    category: 'UNLOADING_LOADING',
    labelUz: '1 martalik (40 futlik konteyner)',
    labelRu: 'разовый (контейнер 40 футов)',
    labelEn: 'one-time (40ft container)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (20ft konteyner)',
    category: 'UNLOADING_LOADING',
    labelUz: '1 martalik (20 futlik konteyner)',
    labelRu: 'разовый (контейнер 20 футов)',
    labelEn: 'one-time (20ft container)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (1 vagon)',
    category: 'UNLOADING_LOADING',
    labelUz: '1 martalik (Temiryo\'l vagoni 60 tn)',
    labelRu: 'разовый (ж/д вагон 60 тн)',
    labelEn: 'one-time (railcar 60 tn)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (<90 m³ fura)',
    category: 'UNLOADING_LOADING',
    labelUz: '1 martalik (Standart fura <90 m³)',
    labelRu: 'разовый (фура <90 м³)',
    labelEn: 'one-time (truck <90 m³)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (to\'liq fura)',
    category: 'UNLOADING_LOADING',
    labelUz: '1 martalik (To\'liq fura / 20 tn gacha)',
    labelRu: 'разовый (полная фура / до 20 тн)',
    labelEn: 'one-time (full truck / up to 20 tn)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (mega fura)',
    category: 'UNLOADING_LOADING',
    labelUz: '1 martalik (Katta fura >90 m³ / mega fura)',
    labelRu: 'разовый (фура >90 м³ / мега фура)',
    labelEn: 'one-time (truck >90 m³ / mega truck)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (1 tn)',
    category: 'UNLOADING_LOADING',
    labelUz: '1 martalik (1 tn yuk / tonna bo\'yicha)',
    labelRu: 'разовый (за 1 тн груза)',
    labelEn: 'one-time (per 1 ton of cargo)',
    calcType: 'PER_TON'
  },
  {
    value: '1 martalik (1 pallet)',
    category: 'UNLOADING_LOADING',
    labelUz: '1 martalik (1 pallet / poddon bo\'yicha)',
    labelRu: 'разовый (за 1 паллет / поддон)',
    labelEn: 'one-time (per 1 pallet)',
    calcType: 'PER_PALLET'
  },
  {
    value: '1 martalik (1 dona)',
    category: 'UNLOADING_LOADING',
    labelUz: '1 martalik (1 dona / tovar birligi bo\'yicha)',
    labelRu: 'разовый (за 1 штуку)',
    labelEn: 'one-time (per 1 piece)',
    calcType: 'PER_PIECE'
  },

  // =========================================================================
  // 3. ADDITIONAL SERVICES (Qo'shimcha xizmatlar)
  // =========================================================================
  {
    value: '1 martalik (1 operatsiya)',
    category: 'ADDITIONAL',
    labelUz: '1 martalik (1 operatsiya / xizmat)',
    labelRu: 'разовый (1 операция / услуга)',
    labelEn: 'one-time (1 operation)',
    calcType: 'FIXED'
  },
  {
    value: '1 martalik (1 p/m)',
    category: 'ADDITIONAL',
    labelUz: '1 martalik (1 p/m — streych / o\'rash)',
    labelRu: 'разовый (1 п/м — стретч-пленка)',
    labelEn: 'one-time (1 linear meter)',
    calcType: 'PER_PIECE'
  },
  {
    value: '1 martalik (1 poddon)',
    category: 'ADDITIONAL',
    labelUz: '1 martalik (1 poddon / pallet)',
    labelRu: 'разовый (1 поддон)',
    labelEn: 'one-time (1 pallet)',
    calcType: 'PER_PALLET'
  },
  {
    value: '1 martalik (1 tn)',
    category: 'ADDITIONAL',
    labelUz: '1 martalik (1 tn yuk / tonna bo\'yicha)',
    labelRu: 'разовый (за 1 тн)',
    labelEn: 'one-time (per 1 ton)',
    calcType: 'PER_TON'
  },
  {
    value: '1 martalik (1 transport)',
    category: 'ADDITIONAL',
    labelUz: '1 martalik (1 transport vositasi)',
    labelRu: 'разовый (1 автотранспорт)',
    labelEn: 'one-time (1 vehicle)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (1 vagon)',
    category: 'ADDITIONAL',
    labelUz: '1 martalik (1 temiryo\'l vagoni)',
    labelRu: 'разовый (1 ж/д вагон)',
    labelEn: 'one-time (1 railcar)',
    calcType: 'PER_TRANSPORT'
  },
  {
    value: '1 martalik (har bir mijozdan)',
    category: 'ADDITIONAL',
    labelUz: '1 martalik (Har bir mijozdan / shartnomaviy)',
    labelRu: 'разовый (с каждого клиента)',
    labelEn: 'one-time (per client)',
    calcType: 'FIXED'
  },
  {
    value: '1 martalik (shartnoma bo\'yicha)',
    category: 'ADDITIONAL',
    labelUz: '1 martalik (Shartnoma bo\'yicha kelishilgan)',
    labelRu: 'разовый (по договору)',
    labelEn: 'one-time (per contract)',
    calcType: 'FIXED'
  },
  {
    value: '1 martalik (1 reys)',
    category: 'ADDITIONAL',
    labelUz: '1 martalik (1 reys / qatnov)',
    labelRu: 'разовый (1 рейс)',
    labelEn: 'one-time (1 trip)',
    calcType: 'FIXED'
  },
  {
    value: '1 martalik (1 sutka)',
    category: 'ADDITIONAL',
    labelUz: '1 martalik (1 sutka — stoyanka)',
    labelRu: 'разовый (1 сутки — стоянка)',
    labelEn: 'one-time (1 day parking)',
    calcType: 'FIXED'
  },
  {
    value: '1 martalik (1 kross-doking)',
    category: 'ADDITIONAL',
    labelUz: '1 martalik (1 kross-doking)',
    labelRu: 'разовый (1 кросс-докинг)',
    labelEn: 'one-time (1 cross-docking)',
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
