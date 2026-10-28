
export interface ContractPayer {
  id: string;
  name: string; // To'lovchi / Tashkilot nomi
  inn: string; // STIR / INN
  contractNumber: string; // Shartnoma raqami (masalan: SH-2026/01)
  contractStartDate: string; // YYYY-MM-DD
  contractEndDate: string; // YYYY-MM-DD (Qachongacha tuzilganligi)
  contactPerson: string; // Mas'ul shaxs F.I.SH
  phone: string; // Telefon raqami
  notes?: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'ACCOUNTANT';

export interface UserPermissions {
  canManageTariffs: boolean; // Tariflarni boshqarish (qo'shish / narxini o'zgartirish)
  canManageWarehouse: boolean; // Omborni sozlash (sektor qo'shish / tahrirlash)
  canLinkTariffs: boolean; // Tariflarni ombor/sektorlarga bog'lash
  canHandleHazardous: boolean; // Xavfli yuklar (Hazardous) bilan ishlash ruxsati
  allowedSectorIds: string[]; // Faqat ruxsat etilgan sektorlar ID lari (yoki ['ALL'])
  canStockMovement: boolean; // Yuk kirim/chiqim amallarini bajarish
  canViewFinances: boolean; // 💰 Pul va to'lov ma'lumotlarini ko'rish ruxsati (Moliya)
}

export interface User {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  permissions: UserPermissions;
}

export type SectorType = 
  | 'COLD_FREEZER'   // ❄️ Xolodilnik / Muzlatkich (-18°C ... -24°C)
  | 'CHILLED'        // 🧊 Sovutgich (+2°C ... +6°C)
  | 'DRY_STANDARD'   // 📦 Standart Quruq Zaxira
  | 'HAZARDOUS'      // ☣️ Xavfli Yuklar & Kimyoviy
  | 'HIGH_SECURITY'  // 🔒 Qimmatbaho Texnika & Maxsus
  | 'LIQUID_OIL';    // 🛢️ Suyuqlik & Moylar

export interface ProductExitRecord {
  id: string;
  invoiceNo?: string; // Masalan: NAK-OUT-2026-001
  movementId?: string;
  exitDate: string; // YYYY-MM-DD
  exitTime: string; // HH:mm
  quantity: number; // Chiqarilgan soni (dona/quti/qop/pallet)
  weightKg: number; // Chiqarilgan og'irligi (kg)
  remainingQuantity: number; // Omborda qolgan soni
  remainingWeightKg: number; // Omborda qolgan og'irligi (kg)
  exitedBy: string; // Aniq kim chiqargan (Mas'ul xodim F.I.SH)
  exitedByRole: UserRole;
  daysStored: number; // Qancha kun saqlangan
  storageBaseCost: number; // Xraneniya bazaviy summasi
  storageVat: number; // Xraneniya 12% QQS
  additionalServices?: AppliedService[]; // Ishlatilgan qo'shimcha xizmatlar
  additionalCost?: number;
  totalCost: number; // Jami chiqim to'lovi
  receiverInn?: string; // Yukni qabul qiluvchi tashkilot STIR (INN) raqami
  receiverName?: string; // Yukni qabul qiluvchi tashkilot nomi
  receiverPerson?: string; // Qabul qilib oluvchi mas'ul shaxs / vakil F.I.SH
  unloadingService?: string; // Omborga tushirish xizmati (Разгрузка)
  unloadingCost?: number; // Tushirish to'lovi (QQS bilan)
  storageTariffName?: string; // Tanlangan saqlash tarifi nomi (2-rasm preyskuranti bo'yicha)
  storageFormula?: string; // Saqlash formulasi va tafsiloti
  loadingService?: string; // Yuk ortilgan transport turi (Погрузка: Vagon, Konteyner, Fura)
  loadingCost?: number; // Ortish xizmati to'lovi
  notes?: string;
}

export interface StoredProduct {
  id: string;
  sectorId: string;
  sectorName: string; // FAQAT "A Sektor", "B Sektor", "C Sektor", "D Sektor", "E Sektor", "F Sektor"
  name: string;
  category?: string;
  initialQuantity: number; // Dastlab qabul qilingan soni (masalan: 500 dona)
  quantity: number; // Hozirgi ombordagi qoldiq soni (masalan: 250 dona)
  unit: string; // dona, quti, qop, pallet, pachka
  initialWeightKg: number; // Dastlab qabul qilingan og'irligi (kg)
  weightKg: number; // Hozirgi ombordagi qoldiq og'irligi (kg)
  dailyRatePerUnit: number; // Kunlik stavka (2-rasmdagi saqlash tarifi bo'yicha: UZS/kg, UZS/tn, UZS/pallet va h.k.)
  storageTariffId?: string; // 2-rasm rasmiy preyskuranti (10-19 bandlar) xizmat ID si
  storageTariffName?: string; // 2-rasm saqlash tarifi nomi
  storageTariffRate?: number; // Bazaviy stavka
  storageTariffItemNo?: number; // Preyskurant band raqami (10-19)
  storageTariffUnit?: string; // Birligi ('1 tn / sutka', '1 kg / sutka', '1 pallet / sutka', va h.k.)
  tariffId?: string; // Saqlash tarifi ID si
  tariffName?: string; // Saqlash tarifi nomi
  unitVolumeM3?: number;
  totalVolumeM3?: number;
  entryDate: string; // YYYY-MM-DD
  entryTime: string; // HH:mm
  placedBy: string; // ANIQ KIM KIRGAZGAN (Mas'ul xodim F.I.SH)
  placedByRole: UserRole;
  clientName?: string;
  payerId?: string; // Bog'langan to'lovchi ID si
  contractNumber?: string; // Shartnoma raqami
  contractEndDate?: string; // Shartnoma amal qilish muddati
  notes?: string;
  obrabotkaService?: string; // Aniq qo'llanilgan Obrabotka xizmati (Yuk tushirish)
  obrabotkaCost?: number; // Obrabotka bazaviy narxi
  obrabotkaVat?: number; // Obrabotka 12% QQS
  kirimAdditionalServices?: AppliedService[]; // Ishlatilgan qo'shimcha xizmatlar (agar bo'lsa)
  exitHistory?: ProductExitRecord[]; // Har bir chiqim bo'yicha zanjirli tarix
}

export interface Sector {
  id: string;
  name: string; // FAQAT "A Sektor", "B Sektor", "C Sektor", "D Sektor", "E Sektor", "F Sektor"
  code: string;
  type: SectorType;
  temperature?: string;
  capacity: number; // Rasm bo'yicha: 6676, 1365, 3120, 1560, 1800, 3072 m²
  subSections?: string; // A1 - 731m / A2 - 814m / A3 - 5131m, F1 - 480m / F2 - 2592m
  status: 'Faol' | 'Profilaktika' | 'To\'lgan';
  allowedCargoTypes: string[];
  description: string;
  tariffId?: string; // Ixtiyoriy
  tariffName?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  city: string;
  address: string;
  totalCapacity: number;
  manager: string;
  phone: string;
  sectors: Sector[];
}

export type CustomsServiceCategory = 'UNLOADING_LOADING' | 'STORAGE' | 'ADDITIONAL';

export interface CustomsService {
  id: string;
  itemNo: number; // 1, 2, 3...
  category: CustomsServiceCategory;
  name: string; // Nomi
  nameUz?: string; // O'zbekcha izohi
  unit: string; // Birligi: "1 vagon (60 tn)", "1 tn", "1 kg/sutka", "1 p/m" va h.k.
  basePrice: number; // QQSsiz narx
  vatRate: number; // 0.12
  vatAmount: number; // QQS summasi
  totalPrice: number; // QQS bilan jami
  description?: string;
}

export interface AppliedService {
  serviceId: string;
  name: string;
  quantity: number;
  unit: string;
  basePrice: number;
  vatAmount: number;
  totalPrice: number;
}

export interface CargoMovement {
  id: string;
  invoiceNo?: string; // Masalan: NAK-IN-001 yoki NAK-OUT-002
  productId?: string; // Mahsulot ID si
  sectorId: string;
  sectorName: string;
  productName: string;
  type: 'IN' | 'OUT'; // Kirim yoki Chiqim
  quantity: number; // Ushbu amaldagi soni (dona/quti/qop/pallet)
  initialQuantity?: number; // Dastlab qabul qilingan soni
  remainingQuantity?: number; // Chiqimdan so'ng qolgan soni
  unit: string;
  weightKg?: number; // Ushbu amaldagi og'irligi (kg)
  initialWeightKg?: number; // Dastlabki og'irligi (kg)
  remainingWeightKg?: number; // Chiqimdan so'ng qolgan og'irligi (kg)
  userName: string; // Ushbu amalni bajargan xodim (KIRGIZGAN yoki CHIQARGAN)
  userRole: UserRole;
  placedBy?: string; // Kirimni amalga oshirgan xodim (chiqimda ham saqlanadi)
  placedDate?: string; // Asl kirim sanasi
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  clientName?: string;
  transportType?: string; // Kirimda kelgan transport turi va tushirish (Разгрузка)
  unloadingType?: string; // Tushirish xizmati nomi (Разгрузка)
  loadingType?: string; // Chiqimda yuk ortilgan transport vositasi (Погрузка)
  loadingCostUZS?: number; // Ortish xizmati to'lovi
  obrabotkaCostUZS?: number; // Tushirish to'lovi (QQS bilan)
  storageCostUZS?: number; // Xraneniya to'lovi (QQS bilan)
  storageTariffName?: string; // 2-rasm bo'yicha tanlangan saqlash tarifi
  storageFormula?: string; // Saqlash hisoblash formulasi
  additionalCostUZS?: number; // Qo'shimcha xizmatlar to'lovi
  servicesApplied?: AppliedService[];
  daysStored?: number; // Necha kun saqlandi
  tariffId?: string;
  tariffName?: string;
  tariffDailyRate?: number; // Skladga biriktirilgan kunlik tarif
  totalCostUZS?: number; // Jami bazaviy to'lov (QQS siz)
  vatTotalUZS?: number; // Jami QQS 12%
  grandTotalUZS?: number; // Jami to'lov (12% QQS bilan)
  receiverInn?: string; // Yukni qabul qiluvchi tashkilot STIR (INN) raqami
  receiverName?: string; // Yukni qabul qiluvchi tashkilot nomi
  receiverPerson?: string; // Qabul qilib oluvchi mas'ul shaxs / vakil F.I.SH
  paymentStatus?: 'PAID' | 'PENDING' | 'OVERDUE'; // To'lov holati (Buxgalteriya uchun)
  paidAt?: string; // To'lov sanasi va vaqti
}

export interface Tariff {
  id: string;
  name: string;
  targetSectorType?: SectorType;
  unitName: string; // "kg", "qop", "pallet", "dona"
  pricePerUnitDay: number; // 1 birlik uchun kunlik saqlash narxi
  currency: string;
  minDays: number;
  features: string[];
}



