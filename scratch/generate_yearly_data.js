const fs = require('fs');
const path = require('path');

const EMPLOYEES = [
  { name: 'Jasur Bekmirzayev (Oddiy Xodim / User)', role: 'USER' },
  { name: 'Nodira Umarova (Katta Omborchi)', role: 'ADMIN' },
  { name: 'Alisher Qodirov (Bosh Rahbar)', role: 'SUPER_ADMIN' }
];

const CLIENTS = [
  { name: 'Sag Agro Logistika MChJ', inn: '308942115', person: 'Sirojiddin Aliyev', contract: 'SH-2026/01' },
  { name: 'Lactalis Central Asia MChJ', inn: '307123984', person: 'Marina Kim', contract: 'SH-2026/02' },
  { name: 'Shakar Savdo Distribyutsiya', inn: '305987654', person: 'Bobur Mirzayev', contract: 'SH-2026/03' },
  { name: 'Kipor Bo\'yoq Kimyo XK', inn: '304567890', person: 'Ravshan Yusupov', contract: 'SH-2026/04' },
  { name: 'Texno Distribyutsiya MChJ', inn: '309112233', person: 'Eldor Qosimov', contract: 'SH-2026/05' },
  { name: 'Artel Electronics MChJ', inn: '302145896', person: 'Temur Aliyev', contract: 'SH-2026/06' },
  { name: 'Pure Milky Sut Mahsulotlari', inn: '304589123', person: 'Sardor Ahmedov', contract: 'SH-2026/07' },
  { name: 'Baraka Un Savdo XK', inn: '303654129', person: 'Farhod Toshev', contract: 'SH-2026/08' },
  { name: 'Samarqand Agro Eksport MChJ', inn: '306781290', person: 'Nodir Karimov', contract: 'SH-2026/09' },
  { name: 'Toshkent Tekstil Sanoat MChJ', inn: '309812456', person: 'Olimbek Yo\'ldoshev', contract: 'SH-2026/10' }
];

const PRODUCTS = [
  {
    name: 'Muzlatilgan mol go\'shti (Halol)',
    unit: 'kg',
    weightPerUnit: 1,
    sectorId: 'sec-a',
    sectorName: 'A Sektor',
    dailyRate: 50,
    tariffName: 'Muzlatkichli Harorat Tarifi (Xolodilnik)',
    clientIndex: 0,
    baseQtyRange: [200, 600]
  },
  {
    name: 'Muzlatilgan tovuq go\'shti (Halol)',
    unit: 'kg',
    weightPerUnit: 1,
    sectorId: 'sec-a',
    sectorName: 'A Sektor',
    dailyRate: 45,
    tariffName: 'Muzlatkichli Harorat Tarifi (Xolodilnik)',
    clientIndex: 8,
    baseQtyRange: [400, 1000]
  },
  {
    name: 'Muzlatilgan forel balig\'i',
    unit: 'kg',
    weightPerUnit: 1,
    sectorId: 'sec-a',
    sectorName: 'A Sektor',
    dailyRate: 55,
    tariffName: 'Muzlatkichli Harorat Tarifi (Xolodilnik)',
    clientIndex: 0,
    baseQtyRange: [150, 450]
  },
  {
    name: 'Golland Pishlog\'i (Gouda 45%)',
    unit: 'kg',
    weightPerUnit: 1,
    sectorId: 'sec-b',
    sectorName: 'B Sektor',
    dailyRate: 600,
    tariffName: 'Sovutilgan Mahsulotlar Tarifi (+4°C)',
    clientIndex: 1,
    baseQtyRange: [100, 250]
  },
  {
    name: 'Pasterizatsiyalangan Sut 3.2%',
    unit: 'dona',
    weightPerUnit: 1,
    sectorId: 'sec-b',
    sectorName: 'B Sektor',
    dailyRate: 100,
    tariffName: 'Sovutilgan Mahsulotlar Tarifi (+4°C)',
    clientIndex: 6,
    baseQtyRange: [300, 800]
  },
  {
    name: 'Qaymoq va Sariyog\' (82.5%)',
    unit: 'kg',
    weightPerUnit: 1,
    sectorId: 'sec-b',
    sectorName: 'B Sektor',
    dailyRate: 500,
    tariffName: 'Sovutilgan Mahsulotlar Tarifi (+4°C)',
    clientIndex: 1,
    baseQtyRange: [100, 300]
  },
  {
    name: 'Oq qand (Shakar 50kg)',
    unit: 'qop',
    weightPerUnit: 50,
    sectorId: 'sec-c',
    sectorName: 'C Sektor',
    dailyRate: 1500,
    tariffName: 'Standart Quruq Saqlash Tarifi',
    clientIndex: 2,
    baseQtyRange: [50, 150]
  },
  {
    name: 'Oliy navli bug\'doy uni (50kg)',
    unit: 'qop',
    weightPerUnit: 50,
    sectorId: 'sec-c',
    sectorName: 'C Sektor',
    dailyRate: 1200,
    tariffName: 'Standart Quruq Saqlash Tarifi',
    clientIndex: 7,
    baseQtyRange: [60, 200]
  },
  {
    name: 'Guruch (Lazer navli 25kg)',
    unit: 'qop',
    weightPerUnit: 25,
    sectorId: 'sec-c',
    sectorName: 'C Sektor',
    dailyRate: 1000,
    tariffName: 'Standart Quruq Saqlash Tarifi',
    clientIndex: 7,
    baseQtyRange: [40, 120]
  },
  {
    name: 'Sanoat Bo\'yoqlari va Emal',
    unit: 'bochka',
    weightPerUnit: 50,
    sectorId: 'sec-d',
    sectorName: 'D Sektor',
    dailyRate: 2000,
    tariffName: 'Xavfli Yuklar Maxsus Saqlash Tarifi',
    clientIndex: 3,
    baseQtyRange: [20, 60]
  },
  {
    name: 'Artel Konditsionerlari (Inverter)',
    unit: 'dona',
    weightPerUnit: 35,
    sectorId: 'sec-e',
    sectorName: 'E Sektor',
    dailyRate: 3000,
    tariffName: 'Qimmatbaho Texnika Saqlash Tarifi',
    clientIndex: 5,
    baseQtyRange: [15, 45]
  },
  {
    name: 'Paxta Ip-kalava (№30)',
    unit: 'pallet',
    weightPerUnit: 400,
    sectorId: 'sec-f',
    sectorName: 'F Sektor',
    dailyRate: 5000,
    tariffName: 'Tekstil & Sanoat Xom-ashyosi Tarifi',
    clientIndex: 9,
    baseQtyRange: [10, 30]
  }
];

const MONTHS = [
  { year: 2025, month: 11, count: 7 },
  { year: 2025, month: 12, count: 9 },
  { year: 2026, month: 1, count: 8 },
  { year: 2026, month: 2, count: 8 },
  { year: 2026, month: 3, count: 10 },
  { year: 2026, month: 4, count: 9 },
  { year: 2026, month: 5, count: 11 },
  { year: 2026, month: 6, count: 10 },
  { year: 2026, month: 7, count: 10 },
  { year: 2026, month: 8, count: 11 },
  { year: 2026, month: 9, count: 12 },
  { year: 2026, month: 10, count: 16 }
];

const UNLOADING_TYPES = [
  { name: 'To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan tushirish', cost: 896000 },
  { name: 'ж/д вагон 60 tn (kara va mexanizm yordamida tushirish)', cost: 2240000 },
  { name: 'Kara-pogruzchik yordamida yuk tushirish (1 tn)', cost: 72800 },
  { name: 'Avtomashina yoki gazel (sochma yuk tushirish)', cost: 280000 }
];

const LOADING_TYPES = [
  { name: 'Kara-pogruzchik yordamida yuk ortish (1 tn)', cost: 72800 },
  { name: 'Yuk mashinasi / Fura (sochma yuk ortish)', cost: 78400 },
  { name: 'Refrijerator furasiga yuk ortish', cost: 112000 },
  { name: 'Konteynerga yuklash (20 futlik)', cost: 448000 }
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const movements = [];
let serialCounter = 1;

MONTHS.forEach(mObj => {
  const y = mObj.year;
  const m = String(mObj.month).padStart(2, '0');
  const count = mObj.count;

  for (let i = 0; i < count; i++) {
    const isOut = i % 3 !== 0; // ~67% OUT, ~33% IN
    const prod = PRODUCTS[i % PRODUCTS.length];
    const client = CLIENTS[prod.clientIndex % CLIENTS.length];
    const employee = EMPLOYEES[(i + mObj.month) % EMPLOYEES.length];

    const maxDay = mObj.month === 10 && y === 2026 ? 26 : (mObj.month === 2 ? 28 : 30);
    const dayNum = Math.min(maxDay, Math.max(1, Math.round(((i + 1) / (count + 1)) * maxDay) + randomBetween(-1, 1)));
    const day = String(dayNum).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const timeStr = `${String(randomBetween(8, 17)).padStart(2, '0')}:${String(randomBetween(10, 55)).padStart(2, '0')}`;

    const qty = randomBetween(prod.baseQtyRange[0], prod.baseQtyRange[1]);
    const weightKg = Math.round(qty * prod.weightPerUnit);
    const initialQty = qty + randomBetween(50, 300);
    const initialWeightKg = Math.round(initialQty * prod.weightPerUnit);
    const remainingQty = initialQty - qty;
    const remainingWeightKg = Math.round(remainingQty * prod.weightPerUnit);

    const invSerial = String(serialCounter++).padStart(4, '0');

    if (!isOut) {
      // IN (Kirim)
      const unl = UNLOADING_TYPES[i % UNLOADING_TYPES.length];
      const unlCost = unl.cost;
      const baseCost = Math.round(unlCost / 1.12);
      const vatCost = unlCost - baseCost;

      movements.push({
        id: `mov-${y}${m}-${invSerial}-in`,
        invoiceNo: `NAK-IN-${y}-${invSerial}`,
        sectorId: prod.sectorId,
        sectorName: prod.sectorName,
        productName: prod.name,
        type: 'IN',
        quantity: initialQty,
        initialQuantity: initialQty,
        remainingQuantity: initialQty,
        unit: prod.unit,
        weightKg: initialWeightKg,
        initialWeightKg: initialWeightKg,
        remainingWeightKg: initialWeightKg,
        userName: employee.name,
        userRole: employee.role,
        placedBy: employee.name,
        placedDate: dateStr,
        date: dateStr,
        time: timeStr,
        clientName: client.name,
        transportType: unl.name,
        obrabotkaCostUZS: unlCost,
        storageCostUZS: 0,
        loadingCostUZS: 0,
        additionalCostUZS: 0,
        totalCostUZS: baseCost,
        vatTotalUZS: vatCost,
        grandTotalUZS: unlCost,
        notes: `${client.name} dan ${initialQty} ${prod.unit} partiya qabul qilindi. Hujjat: ${client.contract}`
      });
    } else {
      // OUT (Chiqim)
      const daysStored = randomBetween(4, 25);
      const storageBase = prod.dailyRate * (prod.unit === 'kg' ? weightKg : qty) * daysStored;
      const storageTotal = Math.round(storageBase * 1.12);

      const unl = UNLOADING_TYPES[(i + 1) % UNLOADING_TYPES.length];
      const lod = LOADING_TYPES[(i + 2) % LOADING_TYPES.length];

      const grandTotal = storageTotal + unl.cost + lod.cost;
      const totalBase = Math.round(grandTotal / 1.12);
      const totalVat = grandTotal - totalBase;

      // Status: if past month -> 100% PAID. If current month (2026-10) -> 70% PAID, 30% PENDING
      const isPastMonth = y < 2026 || (y === 2026 && mObj.month < 10);
      const isPaid = isPastMonth ? true : (i % 3 !== 0);
      const paidDate = isPaid ? `${dateStr} ${timeStr}` : undefined;

      movements.push({
        id: `mov-${y}${m}-${invSerial}-out`,
        invoiceNo: `NAK-OUT-${y}-${invSerial}`,
        sectorId: prod.sectorId,
        sectorName: prod.sectorName,
        productName: prod.name,
        type: 'OUT',
        quantity: qty,
        initialQuantity: initialQty,
        remainingQuantity: remainingQty,
        unit: prod.unit,
        weightKg: weightKg,
        initialWeightKg: initialWeightKg,
        remainingWeightKg: remainingWeightKg,
        userName: employee.name,
        userRole: employee.role,
        placedBy: 'Alisher Qodirov (Bosh Rahbar)',
        placedDate: `${y}-${m}-01 09:00`,
        date: dateStr,
        time: timeStr,
        clientName: client.name,
        daysStored: daysStored,
        tariffDailyRate: prod.dailyRate,
        tariffName: prod.tariffName,
        storageTariffName: prod.tariffName,
        storageFormula: `Hajmi: ${qty} ${prod.unit} × ${prod.dailyRate.toLocaleString('uz-UZ')} UZS/kun × ${daysStored} kun`,
        unloadingType: unl.name,
        obrabotkaCostUZS: unl.cost,
        loadingType: lod.name,
        loadingCostUZS: lod.cost,
        storageCostUZS: storageTotal,
        additionalCostUZS: 0,
        totalCostUZS: totalBase,
        vatTotalUZS: totalVat,
        grandTotalUZS: grandTotal,
        paymentStatus: isPaid ? 'PAID' : 'PENDING',
        paidAt: paidDate,
        receiverInn: client.inn,
        receiverName: client.name,
        receiverPerson: client.person,
        notes: `${client.name} buyurtmasiga ko'ra ${qty} ${prod.unit} (${weightKg.toLocaleString('uz-UZ')} kg) chiqarildi.`
      });
    }
  }
});

// Sort chronological descending (latest first)
movements.sort((a, b) => {
  const dtA = `${a.date} ${a.time}`;
  const dtB = `${b.date} ${b.time}`;
  return dtB.localeCompare(dtA);
});

console.log(`Generated ${movements.length} movements across 12 months!`);
const outCount = movements.filter(m => m.type === 'OUT').length;
const inCount = movements.filter(m => m.type === 'IN').length;
console.log(`OUT: ${outCount}, IN: ${inCount}`);

const code = `import { CargoMovement } from './types';

export const YEARLY_MOVEMENTS: CargoMovement[] = ${JSON.stringify(movements, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/lib/yearly-movements.ts'), code, 'utf8');
console.log('Successfully written to src/lib/yearly-movements.ts');
