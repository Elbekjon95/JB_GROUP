'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, UserPermissions, Sector, SectorType, Warehouse, CargoMovement, Tariff, StoredProduct, CustomsService, CustomsServiceCategory, AppliedService, ProductExitRecord, ContractPayer } from '@/lib/types';
import { INITIAL_USERS, INITIAL_WAREHOUSE, INITIAL_STORED_PRODUCTS, INITIAL_MOVEMENTS, INITIAL_TARIFFS, INITIAL_CUSTOMS_SERVICES, INITIAL_PAYERS } from '@/lib/initial-data';
import { Header } from '@/components/common/Header';
import { LoginOverlay } from '@/components/common/LoginOverlay';
import { InvoiceReceiptModal } from '@/components/modals/InvoiceReceiptModal';
import { PayerModal } from '@/components/modals/PayerModal';
import { UserModal } from '@/components/modals/UserModal';
import { CustomsServiceModal } from '@/components/modals/CustomsServiceModal';
import { ProductHistoryModal } from '@/components/modals/ProductHistoryModal';
import { api } from '@/lib/api-client';

// Saqlangan kunlar sonini aniq hisoblash (kamida 1 kun)
function calculateDaysStored(entryDateStr: string): number {
  try {
    const entry = new Date(entryDateStr);
    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - entry.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  } catch {
    return 1;
  }
}

export default function Home() {
  // 1. Avtorizatsiya holati
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // 2. Navigatsiya menyusi: Ombor, Tarix, To'lovchilar, Buxgalteriya, Tariflar va Xodimlar
  const [activeMenu, setActiveMenu] = useState<'warehouse' | 'history' | 'payers' | 'dashboard' | 'tariffs' | 'users' | 'accounting'>('warehouse');
  const [payers, setPayers] = useState<ContractPayer[]>(INITIAL_PAYERS);
  const [isPayerModalOpen, setIsPayerModalOpen] = useState(false);
  const [editingPayer, setEditingPayer] = useState<ContractPayer | null>(null);
  const [payerForm, setPayerForm] = useState<{
    name: string;
    inn: string;
    contractNumber: string;
    contractStartDate: string;
    contractEndDate: string;
    contactPerson: string;
    phone: string;
    notes: string;
  }>({
    name: '',
    inn: '',
    contractNumber: '',
    contractStartDate: new Date().toISOString().slice(0, 10),
    contractEndDate: '2026-12-31',
    contactPerson: '',
    phone: '',
    notes: ''
  });

  // 3. Ombor, Sektorlar, Mahsulotlar, Tarix, Tariflar va Xodimlar ro'yxati
  const [warehouse, setWarehouse] = useState<Warehouse>(INITIAL_WAREHOUSE);
  const [storedProducts, setStoredProducts] = useState<StoredProduct[]>(INITIAL_STORED_PRODUCTS);
  const [movements, setMovements] = useState<CargoMovement[]>(INITIAL_MOVEMENTS);
  const [tariffs, setTariffs] = useState<Tariff[]>(INITIAL_TARIFFS);
  const [usersList, setUsersList] = useState<User[]>(INITIAL_USERS);

  // 3.1. JB GROUP Bojxona Preyskuranti (30 ta xizmat) va filtrlari
  const [customsServices, setCustomsServices] = useState<CustomsService[]>(INITIAL_CUSTOMS_SERVICES);
  const [customsSubTab, setCustomsSubTab] = useState<'price_list' | 'sector_tariffs'>('price_list');
  const [customsCategoryFilter, setCustomsCategoryFilter] = useState<'ALL' | CustomsServiceCategory>('ALL');
  const [customsSearch, setCustomsSearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [historySearch, setHistorySearch] = useState<string>('');

  // 3.2. Bojxona xizmatini tahrirlash / yangi xizmat qo'shish modali
  const [isCustomsServiceModalOpen, setIsCustomsServiceModalOpen] = useState(false);
  const [editingCustomsService, setEditingCustomsService] = useState<CustomsService | null>(null);
  const [customsServiceForm, setCustomsServiceForm] = useState<{
    name: string;
    nameUz: string;
    unit: string;
    basePrice: number;
    vatRate: number;
    description: string;
    category: CustomsServiceCategory;
  }>({
    name: '',
    nameUz: '',
    unit: '1 tn',
    basePrice: 50000,
    vatRate: 0.12,
    description: '',
    category: 'UNLOADING_LOADING'
  });

  // 3.3. Rasmiy JB GROUP Bojxona Invoysi / Dalolatnoma modali
  const [selectedInvoiceMovement, setSelectedInvoiceMovement] = useState<CargoMovement | null>(null);

  // 3.4. Kirim amali uchun transport turi va qo'shimcha xizmatlar
  const [includeKirimUnloading, setIncludeKirimUnloading] = useState<boolean>(true); // Kirimda tushirish xizmatini yoqish/o'chirish
  const [selectedTransportServiceId, setSelectedTransportServiceId] = useState<string>('cs-8'); // Standart fura kara bilan (896 000)
  const [selectedKirimAdditionalIds, setSelectedKirimAdditionalIds] = useState<string[]>([]);

  // 3.5. Chiqim amali uchun transport turi (Omborga tushirish / Разгрузка va Yukni ortish / Погрузка)
  const [includeExitUnloading, setIncludeExitUnloading] = useState<boolean>(true); // Chiqimda tushirish xizmati to'lovini yoqish/o'chirish
  const [includeExitLoading, setIncludeExitLoading] = useState<boolean>(true); // Chiqimda yuk ortish xizmati to'lovini yoqish/o'chirish
  const [selectedUnloadingServiceId, setSelectedUnloadingServiceId] = useState<string>('cs-8'); // Kirimda ko'rsatilgan tushirish xizmati
  const [selectedStorageTariffId, setSelectedStorageTariffId] = useState<string>('cs-12'); // 2-rasm Saqlash tarifi (10-19 bandlar)
  const [selectedLoadingServiceId, setSelectedLoadingServiceId] = useState<string>('cs-8'); // Standart fura kara bilan yuklash
  const [selectedChiqimAdditionalIds, setSelectedChiqimAdditionalIds] = useState<string[]>([]);

  // 3.6. Buxgalteriya va Chiqimlar Hisoboti (Kunlik, oylik va xodimlar kesimida)
  const [accountingPeriod, setAccountingPeriod] = useState<'TODAY' | 'YESTERDAY' | 'THIS_MONTH' | 'LAST_MONTH' | 'ALL' | 'CUSTOM'>('THIS_MONTH');
  const [accountingMonth, setAccountingMonth] = useState<string>('2026-10');
  const [accountingDateFrom, setAccountingDateFrom] = useState<string>('2026-10-01');
  const [accountingDateTo, setAccountingDateTo] = useState<string>(new Date().toISOString().slice(0, 10));
  const [accountingEmployeeFilter, setAccountingEmployeeFilter] = useState<string>('ALL');
  const [accountingClientFilter, setAccountingClientFilter] = useState<string>('ALL');
  const [accountingStatusFilter, setAccountingStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [accountingSearch, setAccountingSearch] = useState<string>('');
  const [accountingSubView, setAccountingSubView] = useState<'all_exits' | 'by_employee' | 'by_client'>('all_exits');

  // 4. Foydalanuvchi tanlagan sektor
  const [selectedSector, setSelectedSector] = useState<Sector | null>(INITIAL_WAREHOUSE.sectors[0]);
  const [selectedProductHistory, setSelectedProductHistory] = useState<StoredProduct | null>(null); // B-Blok standart tanlangan

  // 5. Sektorlarni sozlash modali (Super Admin / Admin)
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [sectorForm, setSectorForm] = useState<{
    name: string;
    code: string;
    type: SectorType;
    temperature: string;
    capacity: number;
    status: 'Faol' | 'Profilaktika' | 'To\'lgan';
    allowedCargoTypes: string;
    description: string;
  }>({
    name: '',
    code: '',
    type: 'CHILLED',
    temperature: '+2°C ... +6°C',
    capacity: 4000,
    status: 'Faol',
    allowedCargoTypes: 'Sut mahsulotlari, Pishloqlar, Sarxil meva-sabzavotlar',
    description: ''
  });

  // 6. Yangi yuk kiritish (Kirim) modali (Mahsulotga 2-rasm saqlash tarifini bog'lash)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<{
    sectorId: string;
    storageTariffId: string; // 2-rasmdagi rasmiy saqlash tarifi (Preyskurant 10–19 bandlar)
    name: string;
    category: string;
    quantity: number | string;
    unit: string;
    weightKg: number | string;
    clientName: string;
    payerId?: string;
    notes: string;
  }>({
    sectorId: '',
    storageTariffId: 'cs-12', // Standart 10. Хранение 1тн груза в сутки (8 000 UZS)
    name: '',
    category: 'Oziq-ovqat',
    quantity: '', // Soni
    unit: 'dona', // dona, quti, qop, pallet, bochka
    weightKg: '', // Og'irligi (kg da)
    clientName: '',
    payerId: '',
    notes: ''
  });

  // 6.1 Ombor yuklari jadvali va qidiruv filtrlari
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<'ALL' | string>('ALL');
  const [productViewMode, setProductViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');

  // 6.2 Kirim modalida to'lovchini qidirish va tanlash (Searchable combobox)
  const [payerSearchQuery, setPayerSearchQuery] = useState('');
  const [isPayerDropdownOpen, setIsPayerDropdownOpen] = useState(false);

  // 7. Mahsulotni ombordan chiqarish (Chiqim & KUNLIK Tarif hisobi) modali
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [selectedProductToExit, setSelectedProductToExit] = useState<StoredProduct | null>(null);
  const [exitQuantity, setExitQuantity] = useState<number>(10);
  const [exitWeightKg, setExitWeightKg] = useState<number>(100);
  const [exitNotes, setExitNotes] = useState<string>('');
  const [exitReceiverInn, setExitReceiverInn] = useState<string>('');
  const [exitReceiverName, setExitReceiverName] = useState<string>('');
  const [exitReceiverPerson, setExitReceiverPerson] = useState<string>('');

  // 8. Tarifni sektorlarga biriktirish modali (Istalgan tarifni istalgan sektorga ulash)
  const [isAssignTariffModalOpen, setIsAssignTariffModalOpen] = useState(false);
  const [selectedTariffToAssign, setSelectedTariffToAssign] = useState<Tariff | null>(null);
  const [assignedSectorIds, setAssignedSectorIds] = useState<string[]>([]);

  // 9. Tarifni yaratish / narxini tahrirlash modali
  const [isTariffEditModalOpen, setIsTariffEditModalOpen] = useState(false);
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);
  const [tariffForm, setTariffForm] = useState<{
    name: string;
    unitName: string;
    pricePerUnitDay: number;
    minDays: number;
    features: string;
  }>({
    name: '',
    unitName: 'kg',
    pricePerUnitDay: 600,
    minDays: 1,
    features: ''
  });

  // 10. Xodimlarni qo'shish va huquqlarini boshqarish modali (Faqat Super Admin uchun)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<{
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    canManageTariffs: boolean;
    canManageWarehouse: boolean;
    canLinkTariffs: boolean;
    canHandleHazardous: boolean;
    allowedSectorIds: string[];
    canStockMovement: boolean;
    canViewFinances: boolean;
  }>({
    fullName: '',
    email: '',
    password: 'password123',
    role: 'USER',
    canManageTariffs: false,
    canManageWarehouse: false,
    canLinkTariffs: false,
    canHandleHazardous: false,
    allowedSectorIds: ['sec-2', 'sec-3'],
    canStockMovement: true,
    canViewFinances: false
  });

  // Xabarnoma (Toast)
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // PostgreSQL bazasidan va brauzer xotirasidan yuklash
  useEffect(() => {
    // 1. Dastlabki tezkor yuklash (localStorage cache)
    const savedUser = localStorage.getItem('uzw_active_user');
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch { setCurrentUser(null); }
    }
    const savedWh = localStorage.getItem('jb_warehouse_v8');
    if (savedWh) {
      try {
        const parsed = JSON.parse(savedWh);
        setWarehouse(parsed);
        if (parsed.sectors?.length > 0) setSelectedSector(parsed.sectors[1] || parsed.sectors[0]);
      } catch {}
    }
    const savedProds = localStorage.getItem('jb_stored_products_v9_active');
    if (savedProds) {
      try { setStoredProducts(JSON.parse(savedProds)); } catch {}
    }
    const savedTariffs = localStorage.getItem('jb_tariffs_v8');
    if (savedTariffs) {
      try { setTariffs(JSON.parse(savedTariffs)); } catch {}
    }
    const savedUsers = localStorage.getItem('jb_users_list_v8');
    if (savedUsers) {
      try { setUsersList(JSON.parse(savedUsers)); } catch {}
    }
    const savedMoves = localStorage.getItem('jb_movements_v9_yearly');
    if (savedMoves) {
      try { setMovements(JSON.parse(savedMoves)); } catch {}
    }
    const savedPayers = localStorage.getItem('jb_payers_v8');
    if (savedPayers) {
      try { setPayers(JSON.parse(savedPayers)); } catch {}
    }
    const savedCustoms = localStorage.getItem('jb_customs_services_v1');
    if (savedCustoms) {
      try { setCustomsServices(JSON.parse(savedCustoms)); } catch {}
    }

    // 2. PostgreSQL Server API dan to'liq va eng so'nggi ma'lumotlarni sinxronlash
    async function syncFromDatabase() {
      try {
        // Warehouse & Sectors
        const whRes = await api.warehouse.get().catch(() => null);
        if (whRes?.warehouse) {
          setWarehouse(whRes.warehouse);
          if (whRes.warehouse.sectors?.length > 0) {
            setSelectedSector(whRes.warehouse.sectors[1] || whRes.warehouse.sectors[0]);
          }
          localStorage.setItem('jb_warehouse_v8', JSON.stringify(whRes.warehouse));
        }

        // Stored Products
        const prodRes = await api.products.getAll().catch(() => null);
        if (prodRes?.products && prodRes.products.length > 0) {
          setStoredProducts(prodRes.products);
          localStorage.setItem('jb_stored_products_v9_active', JSON.stringify(prodRes.products));
        }

        // Payers
        const payersRes = await api.payers.getAll().catch(() => null);
        if (payersRes?.payers && payersRes.payers.length > 0) {
          setPayers(payersRes.payers);
          localStorage.setItem('jb_payers_v8', JSON.stringify(payersRes.payers));
        }

        // Customs Services
        const csRes = await api.customsServices.getAll().catch(() => null);
        if (csRes?.services && csRes.services.length > 0) {
          setCustomsServices(csRes.services);
          localStorage.setItem('jb_customs_services_v1', JSON.stringify(csRes.services));
        }

        // Movements
        const movRes = await api.movements.getAll().catch(() => null);
        if (movRes?.movements && movRes.movements.length > 0) {
          setMovements(movRes.movements);
          localStorage.setItem('jb_movements_v9_yearly', JSON.stringify(movRes.movements));
        }

        // Tariffs
        const tariffsRes = await api.tariffs.getAll().catch(() => null);
        if (tariffsRes?.tariffs && tariffsRes.tariffs.length > 0) {
          setTariffs(tariffsRes.tariffs);
          localStorage.setItem('jb_tariffs_v8', JSON.stringify(tariffsRes.tariffs));
        }

        // Users
        const usersRes = await api.users.getAll().catch(() => null);
        if (usersRes?.users && usersRes.users.length > 0) {
          setUsersList(usersRes.users);
          localStorage.setItem('jb_users_list_v8', JSON.stringify(usersRes.users));
        }
      } catch (e) {
        console.warn('PostgreSQL sinxronlashda xatolik:', e);
      }
    }

    syncFromDatabase();
  }, []);

  // Ma'lumotlarni doimiy saqlash
  const saveWarehouseData = (updatedWh: Warehouse) => {
    setWarehouse(updatedWh);
    localStorage.setItem('jb_warehouse_v8', JSON.stringify(updatedWh));
  };

  const saveProductsData = (updatedProds: StoredProduct[]) => {
    setStoredProducts(updatedProds);
    localStorage.setItem('jb_stored_products_v9_active', JSON.stringify(updatedProds));
  };

  const saveTariffsData = (updatedTariffs: Tariff[]) => {
    setTariffs(updatedTariffs);
    localStorage.setItem('jb_tariffs_v8', JSON.stringify(updatedTariffs));
  };

  const saveUsersData = (updatedUsers: User[]) => {
    setUsersList(updatedUsers);
    localStorage.setItem('jb_users_list_v8', JSON.stringify(updatedUsers));
  };

  const savePayersData = (updatedPayers: ContractPayer[]) => {
    setPayers(updatedPayers);
    localStorage.setItem('jb_payers_v8', JSON.stringify(updatedPayers));
  };

  const saveMovementsData = (updatedMoves: CargoMovement[]) => {
    setMovements(updatedMoves);
    localStorage.setItem('jb_movements_v9_yearly', JSON.stringify(updatedMoves));
  };

  const saveCustomsServicesData = (updatedCustoms: CustomsService[]) => {
    setCustomsServices(updatedCustoms);
    localStorage.setItem('jb_customs_services_v1', JSON.stringify(updatedCustoms));
  };

  // =========================================================================
  // FOYDALANUVCHI TALABI ASOSIDAGI HUQUQLAR VA XAVFSIZLIK MEXANIZMI:
  // - Faqat Super Admin xodimlarni qo'sha oladi va huquqlarini belgilaydi
  // - Admin: omborni sozlay oladi, tarif qo'sha oladi, tariflarni bog'lay oladi
  // - User: faqat o'zida huquqi bo'lgan sektorlarga yuk qo'ya oladi
  // - Xavfli yuklar bilan ishlay olmaydigan xodim HAZARDOUS sektorga yuk qo'ya olmaydi!
  // =========================================================================
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isAdmin = isSuperAdmin || currentUser?.role === 'ADMIN';
  const isAccountant = currentUser?.role === 'ACCOUNTANT';
  const isUser = currentUser?.role === 'USER';

  // 🤝 Qabul qiluvchilar va to'lovchilarni boshqarish huquqi (Faqat Super Admin, Admin yoki Buxgalter)
  const canManagePayers = !isUser && (isSuperAdmin || isAdmin || isAccountant);

  // Super admin tomonidan xodimga berilgan ruxsatlar
  const canManageTariffs = isSuperAdmin || Boolean(currentUser?.permissions?.canManageTariffs);
  const canManageWarehouse = isSuperAdmin || Boolean(currentUser?.permissions?.canManageWarehouse);
  const canLinkTariffs = isSuperAdmin || Boolean(currentUser?.permissions?.canLinkTariffs);
  const canStockMovement = isSuperAdmin || (currentUser?.permissions ? Boolean(currentUser.permissions.canStockMovement) : (currentUser?.role !== 'ACCOUNTANT'));
  // 💰 Pul va to'lov ma'lumotlarini ko'rish vakolati (Super Admin, Buxgalter yoki moliya ruxsati berilgan xodimlar)
  const canViewFinances = isSuperAdmin || isAccountant || Boolean(currentUser?.permissions?.canViewFinances);

  // =========================================================================
  // BUXGALTERIYA VA CHIQIMLAR TAHLILI (KUNLIK, OYLIK VA XODIMLAR BO'YICHA)
  // =========================================================================
  const allOutMovements = useMemo(() => {
    return movements.filter(m => m.type === 'OUT');
  }, [movements]);

  // Sana, xodim, mijoz va status bo'yicha saralangan chiqimlar
  const filteredOutMovements = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);

    return allOutMovements.filter(m => {
      // 1. Vaqt oralig'i filtri
      let matchPeriod = true;
      if (accountingPeriod === 'TODAY') {
        matchPeriod = m.date === todayStr;
      } else if (accountingPeriod === 'YESTERDAY') {
        matchPeriod = m.date === yesterdayStr;
      } else if (accountingPeriod === 'THIS_MONTH') {
        matchPeriod = m.date.startsWith(accountingMonth || todayStr.slice(0, 7));
      } else if (accountingPeriod === 'LAST_MONTH') {
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);
        matchPeriod = m.date.startsWith(lastMonthStr);
      } else if (accountingPeriod === 'CUSTOM') {
        if (accountingDateFrom && m.date < accountingDateFrom) matchPeriod = false;
        if (accountingDateTo && m.date > accountingDateTo) matchPeriod = false;
      }

      // 2. Xodim filtri (Kim chiqargan)
      let matchEmployee = true;
      if (accountingEmployeeFilter !== 'ALL') {
        matchEmployee = m.userName === accountingEmployeeFilter;
      }

      // 3. To'lovchi / Mijoz filtri
      let matchClient = true;
      if (accountingClientFilter !== 'ALL') {
        matchClient = (m.clientName === accountingClientFilter) || (m.receiverName === accountingClientFilter);
      }

      // 4. To'lov holati filtri
      let matchStatus = true;
      if (accountingStatusFilter === 'PAID') {
        matchStatus = m.paymentStatus === 'PAID';
      } else if (accountingStatusFilter === 'PENDING') {
        matchStatus = m.paymentStatus !== 'PAID';
      }

      // 5. Qidiruv filtri
      let matchSearch = true;
      if (accountingSearch.trim()) {
        const q = accountingSearch.toLowerCase().trim();
        matchSearch = 
          Boolean(m.invoiceNo && m.invoiceNo.toLowerCase().includes(q)) ||
          Boolean(m.productName && m.productName.toLowerCase().includes(q)) ||
          Boolean(m.clientName && m.clientName.toLowerCase().includes(q)) ||
          Boolean(m.receiverName && m.receiverName.toLowerCase().includes(q)) ||
          Boolean(m.receiverInn && m.receiverInn.toLowerCase().includes(q)) ||
          Boolean(m.userName && m.userName.toLowerCase().includes(q));
      }

      return matchPeriod && matchEmployee && matchClient && matchStatus && matchSearch;
    });
  }, [allOutMovements, accountingPeriod, accountingMonth, accountingDateFrom, accountingDateTo, accountingEmployeeFilter, accountingClientFilter, accountingStatusFilter, accountingSearch]);

  // Buxgalteriya KPI hisob-kitoblari
  const accountingStats = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayOuts = allOutMovements.filter(m => m.date === todayStr);

    const totalCount = filteredOutMovements.length;
    const totalWeightKg = filteredOutMovements.reduce((acc, m) => acc + (m.weightKg || m.quantity || 0), 0);
    const totalStorageUZS = filteredOutMovements.reduce((acc, m) => acc + (m.storageCostUZS || 0), 0);
    const totalUnloadingUZS = filteredOutMovements.reduce((acc, m) => acc + (m.obrabotkaCostUZS || 0), 0);
    const totalLoadingUZS = filteredOutMovements.reduce((acc, m) => acc + (m.loadingCostUZS || 0), 0);
    const totalVatUZS = filteredOutMovements.reduce((acc, m) => acc + (m.vatTotalUZS || 0), 0);
    const grandTotalUZS = filteredOutMovements.reduce((acc, m) => acc + (m.grandTotalUZS || m.totalCostUZS || 0), 0);

    const paidTotalUZS = filteredOutMovements.filter(m => m.paymentStatus === 'PAID').reduce((acc, m) => acc + (m.grandTotalUZS || m.totalCostUZS || 0), 0);
    const pendingTotalUZS = grandTotalUZS - paidTotalUZS;

    const todayCount = todayOuts.length;
    const todayWeightKg = todayOuts.reduce((acc, m) => acc + (m.weightKg || m.quantity || 0), 0);
    const todayGrandTotalUZS = todayOuts.reduce((acc, m) => acc + (m.grandTotalUZS || m.totalCostUZS || 0), 0);

    return {
      totalCount,
      totalWeightKg,
      totalStorageUZS,
      totalUnloadingUZS,
      totalLoadingUZS,
      totalVatUZS,
      grandTotalUZS,
      paidTotalUZS,
      pendingTotalUZS,
      todayCount,
      todayWeightKg,
      todayGrandTotalUZS
    };
  }, [allOutMovements, filteredOutMovements]);

  // Xodimlar kesimida tahlil (Kim qancha chiqim qildi)
  const employeeAnalysis = useMemo(() => {
    const map = new Map<string, {
      name: string;
      role: string;
      count: number;
      totalWeightKg: number;
      totalAmountUZS: number;
      paidAmountUZS: number;
      pendingAmountUZS: number;
      productsList: Set<string>;
    }>();

    filteredOutMovements.forEach(m => {
      const uName = m.userName || 'Noma\'lum xodim';
      const existing = map.get(uName) || {
        name: uName,
        role: m.userRole || 'USER',
        count: 0,
        totalWeightKg: 0,
        totalAmountUZS: 0,
        paidAmountUZS: 0,
        pendingAmountUZS: 0,
        productsList: new Set<string>()
      };

      existing.count += 1;
      existing.totalWeightKg += (m.weightKg || m.quantity || 0);
      const total = m.grandTotalUZS || m.totalCostUZS || 0;
      existing.totalAmountUZS += total;
      if (m.paymentStatus === 'PAID') existing.paidAmountUZS += total;
      else existing.pendingAmountUZS += total;
      if (m.productName) existing.productsList.add(m.productName);

      map.set(uName, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.totalAmountUZS - a.totalAmountUZS);
  }, [filteredOutMovements]);

  // Mijozlar / To'lovchilar kesimida tahlil (Kim qancha to'lashi kerak)
  const clientAnalysis = useMemo(() => {
    const map = new Map<string, {
      clientName: string;
      inn: string;
      count: number;
      totalWeightKg: number;
      storageCostUZS: number;
      transportCostUZS: number;
      totalAmountUZS: number;
      paidAmountUZS: number;
      pendingAmountUZS: number;
    }>();

    filteredOutMovements.forEach(m => {
      const cName = m.clientName || m.receiverName || 'Noma\'lum mijoz';
      const existing = map.get(cName) || {
        clientName: cName,
        inn: m.receiverInn || payers.find(p => p.name === cName)?.inn || '-',
        count: 0,
        totalWeightKg: 0,
        storageCostUZS: 0,
        transportCostUZS: 0,
        totalAmountUZS: 0,
        paidAmountUZS: 0,
        pendingAmountUZS: 0
      };

      existing.count += 1;
      existing.totalWeightKg += (m.weightKg || m.quantity || 0);
      existing.storageCostUZS += (m.storageCostUZS || 0);
      existing.transportCostUZS += (m.obrabotkaCostUZS || 0) + (m.loadingCostUZS || 0);
      const total = m.grandTotalUZS || m.totalCostUZS || 0;
      existing.totalAmountUZS += total;
      if (m.paymentStatus === 'PAID') existing.paidAmountUZS += total;
      else existing.pendingAmountUZS += total;

      map.set(cName, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.totalAmountUZS - a.totalAmountUZS);
  }, [filteredOutMovements, payers]);

  // Buxgalteriya hisobotini CSV formatida eksport qilish
  const exportAccountingToCSV = () => {
    if (filteredOutMovements.length === 0) {
      showToast('Eksport qilish uchun chiqim ma\'lumotlari topilmadi!');
      return;
    }

    const headers = [
      '№',
      'Hujjat_Raqami',
      'Sana',
      'Vaqt',
      'Mahsulot_Nomi',
      'Miqdor',
      'Birlik',
      'Ogirlik_kg',
      'Ombor_Sektori',
      'Chiqargan_Xodim',
      'Xodim_Roli',
      'Mijoz_Tashkilot',
      'Qabul_Qiluvchi_STIR_INN',
      'Qabul_Qiluvchi_Shaxs',
      'Saqlangan_Kunlar',
      'Saqlash_Summasi_UZS',
      'Tushirish_Summasi_UZS',
      'Ortish_Summasi_UZS',
      'QQS_12_UZS',
      'Jami_Tolov_UZS',
      'Tolov_Holati'
    ];

    const rows = filteredOutMovements.map((m, idx) => [
      idx + 1,
      `"${m.invoiceNo || m.id}"`,
      m.date,
      m.time,
      `"${(m.productName || '').replace(/"/g, '""')}"`,
      m.quantity,
      `"${m.unit}"`,
      m.weightKg || 0,
      `"${m.sectorName}"`,
      `"${(m.userName || '').replace(/"/g, '""')}"`,
      `"${m.userRole || ''}"`,
      `"${(m.clientName || m.receiverName || '').replace(/"/g, '""')}"`,
      `"${m.receiverInn || ''}"`,
      `"${(m.receiverPerson || '').replace(/"/g, '""')}"`,
      m.daysStored || 1,
      m.storageCostUZS || 0,
      m.obrabotkaCostUZS || 0,
      m.loadingCostUZS || 0,
      m.vatTotalUZS || 0,
      m.grandTotalUZS || m.totalCostUZS || 0,
      m.paymentStatus === 'PAID' ? 'To\'langan' : 'Kutilmoqda'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `JB_GROUP_Chiqimlar_Hisoboti_${accountingMonth || 'Buxgalteriya'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Buxgalteriya hisoboti CSV formatida yuklab olindi!');
  };

  // Chiqim to'lov holatini o'zgartirish (Buxgalter uchun: To'langan / Kutilmoqda)
  const handleTogglePaymentStatus = (movementId: string) => {
    const updatedMoves = movements.map(m => {
      if (m.id === movementId) {
        const nextStatus = m.paymentStatus === 'PAID' ? 'PENDING' : 'PAID';
        return {
          ...m,
          paymentStatus: nextStatus as 'PAID' | 'PENDING',
          paidAt: nextStatus === 'PAID' ? new Date().toISOString() : undefined
        };
      }
      return m;
    });
    saveMovementsData(updatedMoves);
    showToast("To'lov holati muvaffaqiyatli o'zgartirildi!");
  };

  // Sektor bilan ishlash huquqini tekshirish
  const checkSectorAccess = (sector: Sector | null, user: User | null): { allowed: boolean; reason?: string } => {
    if (!user || !sector) return { allowed: false, reason: 'Tizimga kiring yoki sektorni tanlang' };
    if (user.role === 'SUPER_ADMIN') return { allowed: true };

    // 1. XAVFLI YUKLAR BILAN ISHLAY OLMAYDIGAN XODIM TEKSHIRUVI:
    if (sector.type === 'HAZARDOUS' && !user.permissions?.canHandleHazardous) {
      return {
        allowed: false,
        reason: 'Ushbu sektor "Xavfli Yuklar & Kimyoviy" toifasiga kiradi. Sizda xavfli yuklar bilan ishlash ruxsati (sertifikati) yo\'q!'
      };
    }

    // 2. USER FAQAT O'ZIDA HUQUQI BO'LGAN OMBORLARGA QO'YA OLADI:
    const allowed = user.permissions?.allowedSectorIds || [];
    if (!allowed.includes('ALL') && !allowed.includes(sector.id)) {
      return {
        allowed: false,
        reason: `Sizda ushbu sektor (${sector.name}) bilan ishlash huquqi belgilanmagan. Faqat o'zingizga ruxsat etilgan sektorlarga yuk qo'yishingiz mumkin.`
      };
    }

    return { allowed: true };
  };

  // Har bir sektor ichidagi jami tovarlar soni va birliklar yig'indisi (avtomatik hisob)
  const sectorStockMap = useMemo(() => {
    const map: Record<string, { totalItems: number; unitsSummary: string }> = {};

    warehouse.sectors.forEach(sec => {
      const prods = storedProducts.filter(p => p.sectorId === sec.id);
      const unitsMap: Record<string, number> = {};
      prods.forEach(p => {
        const u = p.unit.toLowerCase().trim();
        unitsMap[u] = (unitsMap[u] || 0) + Number(p.quantity || 0);
      });

      const summaryStr = Object.entries(unitsMap)
        .map(([u, q]) => `${q.toLocaleString('uz-UZ')} ${u}`)
        .join(', ');

      map[sec.id] = {
        totalItems: prods.length,
        unitsSummary: summaryStr || 'Yuk yo\'q (Bo\'sh)'
      };
    });

    return map;
  }, [warehouse.sectors, storedProducts]);

  // Jami ombordagi barcha tovarlarning umumiy qoldig'i (birliklar kesimida)
  const globalUnitsSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    storedProducts.forEach(p => {
      const u = (p.unit || 'dona').toLowerCase().trim();
      summary[u] = (summary[u] || 0) + Number(p.quantity || 0);
    });
    return summary;
  }, [storedProducts]);

  // Tanlangan sektor ichidagi mahsulotlar
  const currentSectorProducts = useMemo(() => {
    if (!selectedSector) return [];
    return storedProducts.filter(p => p.sectorId === selectedSector.id);
  }, [selectedSector, storedProducts]);

  // Ombor yuklari jadvali uchun filtrlangan mahsulotlar (Sektor va Qidiruv bo'yicha)
  const filteredWarehouseProducts = useMemo(() => {
    return storedProducts.filter(p => {
      // 1. Sektor bo'yicha filtr
      if (selectedSectorFilter !== 'ALL' && p.sectorId !== selectedSectorFilter) {
        return false;
      }

      // 2. Qidiruv so'zi bo'yicha filtr (Yuk nomi, nakladnoy, korxona/mijoz, STIR/INN, sektor)
      if (!productSearchQuery.trim()) return true;
      const q = productSearchQuery.toLowerCase().trim();
      const payer = payers.find(pyr => pyr.id === p.payerId || pyr.name.toLowerCase() === p.clientName?.toLowerCase());
      const pName = (p.name || '').toLowerCase();
      const pClient = (p.clientName || '').toLowerCase();
      const pNotes = (p.notes || '').toLowerCase();
      const pSector = (p.sectorName || '').toLowerCase();
      const pInn = (payer?.inn || '').toLowerCase();
      const pContract = (p.contractNumber || payer?.contractNumber || '').toLowerCase();
      const pObrabotka = (p.obrabotkaService || '').toLowerCase();

      return pName.includes(q) || 
             pClient.includes(q) || 
             pNotes.includes(q) || 
             pSector.includes(q) || 
             pInn.includes(q) || 
             pContract.includes(q) ||
             pObrabotka.includes(q);
    });
  }, [storedProducts, selectedSectorFilter, productSearchQuery, payers]);

  // Kirim modalida to'lovchilarni korxona nomi yoki STIR (INN) bo'yicha jonli qidirish
  const filteredPayers = useMemo(() => {
    if (!payerSearchQuery.trim()) return payers;
    const q = payerSearchQuery.toLowerCase().trim();
    return payers.filter(p => 
      (p.name || '').toLowerCase().includes(q) ||
      (p.inn || '').toLowerCase().includes(q) ||
      (p.contractNumber || '').toLowerCase().includes(q) ||
      (p.contactPerson || '').toLowerCase().includes(q)
    );
  }, [payers, payerSearchQuery]);

  // Sektor turiga mos meta
  const getSectorMeta = (type: SectorType) => {
    switch (type) {
      case 'COLD_FREEZER':
        return { icon: '❄️', label: 'Bojxona Sektori', badgeClass: 'badge-cold' };
      case 'CHILLED':
        return { icon: '🧊', label: 'Bojxona Sektori', badgeClass: 'badge-chilled' };
      case 'DRY_STANDARD':
        return { icon: '📦', label: 'Bojxona Sektori', badgeClass: 'badge-dry' };
      case 'HAZARDOUS':
        return { icon: '☣️', label: 'Xavfli Yuklar Sektori', badgeClass: 'badge-hazardous' };
      case 'HIGH_SECURITY':
        return { icon: '🔒', label: 'Xavfsizlik Sektori', badgeClass: 'badge-security' };
      case 'LIQUID_OIL':
        return { icon: '🛢️', label: 'Bojxona Sektori', badgeClass: 'badge-liquid' };
      default:
        return { icon: '🏢', label: 'Bojxona Sektori', badgeClass: 'badge-dry' };
    }
  };

  // =========================================================================
  // BOJXONA KALKULYATORI: KIRIM AMALI UCHUN TRANSPORT VA XIZMATLAR HISOBLASH
  // =========================================================================
  const kirimCalculation = useMemo(() => {
    const transportSvc = includeKirimUnloading ? (customsServices.find(s => s.id === selectedTransportServiceId) || null) : null;
    let baseSum = transportSvc ? transportSvc.basePrice : 0;
    let vatSum = transportSvc ? transportSvc.vatAmount : 0;

    const applied: AppliedService[] = [];
    if (transportSvc) {
      applied.push({
        serviceId: transportSvc.id,
        name: transportSvc.nameUz || transportSvc.name,
        quantity: 1,
        unit: transportSvc.unit,
        basePrice: transportSvc.basePrice,
        vatAmount: transportSvc.vatAmount,
        totalPrice: transportSvc.totalPrice
      });
    }

    selectedKirimAdditionalIds.forEach(id => {
      const svc = customsServices.find(s => s.id === id);
      if (svc) {
        baseSum += svc.basePrice;
        vatSum += svc.vatAmount;
        applied.push({
          serviceId: svc.id,
          name: svc.nameUz || svc.name,
          quantity: 1,
          unit: svc.unit,
          basePrice: svc.basePrice,
          vatAmount: svc.vatAmount,
          totalPrice: svc.totalPrice
        });
      }
    });

    return {
      includeUnloading: includeKirimUnloading,
      transportSvc,
      baseSum,
      vatSum,
      grandTotal: baseSum + vatSum,
      applied
    };
  }, [includeKirimUnloading, selectedTransportServiceId, selectedKirimAdditionalIds, customsServices]);

  // =========================================================================
  // BOJXONA KALKULYATORI: CHIQIM AMALI (TUSHIRISH + SAQLASH + ORTISH + QO'SHIMCHA)
  // Foydalanuvchi talabi:
  // 1) Omborga tushurish xizmati ham bo'lishi kerak
  // 2) Saqlash tariflari ikkinchi rasmda ko'rsatilgandek (10-19 bandlar) hisoblanishi kerak
  // =========================================================================
  const exitBillingCalculation = useMemo(() => {
    if (!selectedProductToExit) return null;

    const daysStored = calculateDaysStored(selectedProductToExit.entryDate);
    const validQty = Math.max(0, Math.min(selectedProductToExit.quantity, Number(exitQuantity) || 0));

    // 1. Og'irlikni hisoblash: agar kiritilgan bo'lsa uni oladi, aks holda proporsional
    const totalProdQty = selectedProductToExit.quantity || 1;
    const totalProdWeight = selectedProductToExit.weightKg || selectedProductToExit.initialWeightKg || totalProdQty;
    const validWeightKg = exitWeightKg > 0 
      ? Math.min(totalProdWeight, Number(exitWeightKg))
      : Math.round((validQty / totalProdQty) * totalProdWeight);
    const remainingQty = selectedProductToExit.quantity - validQty;
    const remainingWeightKg = Math.max(0, totalProdWeight - validWeightKg);

    // -------------------------------------------------------------------------
    // 1-XIZMAT: OMBORGA TUSHIRISH (РАЗГРУЗКА)
    // -------------------------------------------------------------------------
    const unloadingSvc = customsServices.find(s => s.id === selectedUnloadingServiceId)
      || customsServices.find(s => s.category === 'UNLOADING_LOADING' && (selectedProductToExit.obrabotkaService?.toLowerCase().includes(s.name.toLowerCase()) || selectedProductToExit.obrabotkaService?.toLowerCase().includes((s.nameUz || '').toLowerCase())))
      || customsServices.find(s => s.id === 'cs-8')!;

    let unloadingBase = 0;
    let unloadingVat = 0;
    let unloadingTotal = 0;
    let unloadingCleanName = 'Tushirish xizmatisiz (Mijoz o\'z kuchi bilan)';

    if (includeExitUnloading) {
      unloadingCleanName = (unloadingSvc.nameUz || unloadingSvc.name)
        .replace('ortish / tushirish', 'tushirish (Разгрузка)')
        .replace('yuklash / tushirish', 'tushirish (Разгрузка)')
        .replace('tushirish/ortish', 'tushirish (Разгрузка)');

      // Agar mahsulotda kirimda belgilangan tushirish xizmati narxi bo'lsa va standart o'zgarmagan bo'lsa, uni olamiz
      unloadingBase = (selectedProductToExit.obrabotkaCost && (!selectedUnloadingServiceId || selectedUnloadingServiceId === 'cs-8'))
        ? selectedProductToExit.obrabotkaCost
        : unloadingSvc.basePrice;
      unloadingVat = (selectedProductToExit.obrabotkaVat && (!selectedUnloadingServiceId || selectedUnloadingServiceId === 'cs-8'))
        ? selectedProductToExit.obrabotkaVat
        : (unloadingSvc.vatAmount || Math.round(unloadingBase * 0.12));
      unloadingTotal = unloadingBase + unloadingVat;
    }

    // -------------------------------------------------------------------------
    // 2-XIZMAT: SAQLASH TARIFI (2-RASMDAGI RASMIY PREYSKURANT 10-19 BANDLAR)
    // -------------------------------------------------------------------------
    const storageSvc = customsServices.find(s => s.id === selectedStorageTariffId)
      || customsServices.find(s => s.id === 'cs-12')!;

    let storageBase = 0;
    let storageFormulaText = '';
    let storageDetailNote = '';

    const itemNo = storageSvc.itemNo;
    const unitLower = (storageSvc.unit || '').toLowerCase();
    const nameLower = ((storageSvc.name || '') + ' ' + (storageSvc.nameUz || '')).toLowerCase();

    const isPerKg = itemNo === 19 || unitLower.includes('kg') || unitLower.includes('кг');
    const isPerTn = itemNo === 10 || itemNo === 11 || itemNo === 12 || unitLower.includes('tn') || unitLower.includes('тн') || nameLower.includes('1тн') || nameLower.includes('тонн') || nameLower.includes('тонна');
    const isPerPallet = itemNo === 14 || unitLower.includes('pallet') || unitLower.includes('паллет');

    if (isPerKg) {
      // 1. Kilogramm bo'yicha kunlik saqlash (masalan: Muzlatkich/Sovutgich 50 so'm/kg/kun)
      storageBase = Math.round(validWeightKg * storageSvc.basePrice * daysStored);
      storageFormulaText = `${validWeightKg.toLocaleString('uz-UZ')} kg × ${storageSvc.basePrice.toLocaleString('uz-UZ')} so'm/kg/kun × ${daysStored} kun`;
      storageDetailNote = `Hajmi: ${validWeightKg.toLocaleString('uz-UZ')} kg × ${storageSvc.basePrice.toLocaleString('uz-UZ')} so'm/kg/kun`;
    } else if (isPerTn) {
      // 2. Tonna bo'yicha kunlik saqlash (masalan: 1 tn yuk 8 000 UZS/tn/kun)
      const weightTn = +(validWeightKg / 1000).toFixed(3);
      storageBase = Math.round(weightTn * storageSvc.basePrice * daysStored);
      storageFormulaText = `${weightTn} tn (${validWeightKg.toLocaleString('uz-UZ')} kg) × ${storageSvc.basePrice.toLocaleString('uz-UZ')} UZS/tn × ${daysStored} kun`;
      storageDetailNote = `Hajmi: ${weightTn} tn (${validWeightKg.toLocaleString('uz-UZ')} kg) × ${storageSvc.basePrice.toLocaleString('uz-UZ')} so'm/tn/kun`;
    } else if (isPerPallet) {
      // 3. Pallet bo'yicha kunlik saqlash (masalan: 1 pallet 25 000 UZS/pallet/kun)
      storageBase = Math.round(validQty * storageSvc.basePrice * daysStored);
      storageFormulaText = `${validQty} pallet × ${storageSvc.basePrice.toLocaleString('uz-UZ')} UZS/pallet × ${daysStored} kun`;
      storageDetailNote = `Hajmi: ${validQty} pallet × ${storageSvc.basePrice.toLocaleString('uz-UZ')} so'm/pallet/kun`;
    } else {
      // 4. Dona, transport, fura yoki boshqa o'lchov birligi bo'yicha kunlik saqlash
      storageBase = Math.round(validQty * storageSvc.basePrice * daysStored);
      storageFormulaText = `${validQty} ${storageSvc.unit} × ${storageSvc.basePrice.toLocaleString('uz-UZ')} UZS/sutka × ${daysStored} kun`;
      storageDetailNote = `Hajmi: ${validQty} ${storageSvc.unit} × ${storageSvc.basePrice.toLocaleString('uz-UZ')} so'm/sutka`;
    }

    const storageVat = Math.round(storageBase * 0.12);
    const storageTotal = storageBase + storageVat;

    // -------------------------------------------------------------------------
    // 3-XIZMAT: YUKNI ORTISH (ПОГРУЗКА)
    // -------------------------------------------------------------------------
    const loadingSvc = customsServices.find(s => s.id === selectedLoadingServiceId)
      || customsServices.find(s => s.id === 'cs-8')!;

    let loadingBase = 0;
    let loadingVat = 0;
    let loadingTotal = 0;
    let loadingCleanName = 'Ortish xizmatisiz (Mijoz o\'z kuchi bilan)';

    if (includeExitLoading) {
      loadingCleanName = (loadingSvc.nameUz || loadingSvc.name)
        .replace('ortish / tushirish', 'ortish (Погрузка)')
        .replace('yuklash / tushirish', 'ortish (Погрузка)')
        .replace('tushirish/ortish', 'ortish (Погрузка)');
      loadingBase = loadingSvc.basePrice;
      loadingVat = loadingSvc.vatAmount || Math.round(loadingBase * 0.12);
      loadingTotal = loadingBase + loadingVat;
    }

    // -------------------------------------------------------------------------
    // 4-XIZMAT: QO'SHIMCHA XIZMATLAR
    // -------------------------------------------------------------------------
    let additionalExitBase = 0;
    let additionalExitVat = 0;
    const additionalApplied: AppliedService[] = [];

    selectedChiqimAdditionalIds.forEach(id => {
      const svc = customsServices.find(s => s.id === id);
      if (svc) {
        additionalApplied.push({
          serviceId: svc.id,
          name: `${svc.nameUz || svc.name} (⚡ 1 martalik to'lov)`,
          quantity: 1,
          unit: svc.unit,
          basePrice: svc.basePrice,
          vatAmount: svc.vatAmount,
          totalPrice: svc.totalPrice
        });
        additionalExitBase += svc.basePrice;
        additionalExitVat += svc.vatAmount;
      }
    });

    // Nakladnoy va hisob uchun appliedExitServices:
    const appliedExitServices: AppliedService[] = [];

    if (includeExitUnloading && unloadingTotal > 0) {
      appliedExitServices.push({
        serviceId: unloadingSvc.id,
        name: `Omborga tushirish (Разгрузка): ${unloadingCleanName} (⚡ 1 martalik to'lov)`,
        quantity: 1,
        unit: unloadingSvc.unit,
        basePrice: unloadingBase,
        vatAmount: unloadingVat,
        totalPrice: unloadingTotal
      });
    }

    appliedExitServices.push({
      serviceId: storageSvc.id,
      name: `Bojxona omborida saqlash xizmati (${storageSvc.nameUz || storageSvc.name}) — 📅 ${daysStored} kun saqlangan (FAQAT saqlash kuniga ko'paytiriladi)`,
      quantity: daysStored,
      unit: storageSvc.unit,
      basePrice: storageBase,
      vatAmount: storageVat,
      totalPrice: storageTotal
    });

    if (includeExitLoading && loadingTotal > 0) {
      appliedExitServices.push({
        serviceId: loadingSvc.id,
        name: `Yukni ortish (Погрузка): ${loadingCleanName} (⚡ 1 martalik to'lov)`,
        quantity: 1,
        unit: loadingSvc.unit,
        basePrice: loadingBase,
        vatAmount: loadingVat,
        totalPrice: loadingTotal
      });
    }

    appliedExitServices.push(...additionalApplied);

    const totalBase = unloadingBase + storageBase + loadingBase + additionalExitBase;
    const totalVat = unloadingVat + storageVat + loadingVat + additionalExitVat;
    const grandTotal = totalBase + totalVat;

    return {
      daysStored,
      validQty,
      validWeightKg,
      remainingQty,
      remainingWeightKg,
      unit: selectedProductToExit.unit,
      // 1. Tushirish
      includeUnloading: includeExitUnloading,
      unloadingSvc,
      unloadingCleanName,
      unloadingBase,
      unloadingVat,
      unloadingTotal,
      // 2. Saqlash
      storageSvc,
      storageBase,
      storageVat,
      storageTotal,
      storageFormulaText,
      storageDetailNote,
      // 3. Ortish
      includeLoading: includeExitLoading,
      loadingSvc,
      loadingCleanName,
      loadingBase,
      loadingVat,
      loadingTotal,
      // 4. Qo'shimcha
      additionalApplied,
      additionalExitBase,
      additionalExitVat,
      // Barcha xizmatlar va jami
      appliedExitServices,
      totalBase,
      totalVat,
      totalCost: grandTotal
    };
  }, [selectedProductToExit, exitQuantity, exitWeightKg, includeExitUnloading, selectedUnloadingServiceId, selectedStorageTariffId, includeExitLoading, selectedLoadingServiceId, selectedChiqimAdditionalIds, customsServices]);

  // Dashboard Chart uchun so'nggi 7 kunlik amallar soni
  const chartData = useMemo(() => {
    const days: { date: string; displayDate: string; inCount: number; outCount: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const displayDate = `${d.getDate()}-${['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'][d.getMonth()]}`;

      const dayMoves = movements.filter(m => m.date === dateStr);
      const inCount = dayMoves.filter(m => m.type === 'IN').reduce((acc, m) => acc + m.quantity, 0);
      const outCount = dayMoves.filter(m => m.type === 'OUT').reduce((acc, m) => acc + m.quantity, 0);

      days.push({ date: dateStr, displayDate, inCount, outCount });
    }

    const maxCount = Math.max(...days.map(d => Math.max(d.inCount, d.outCount, 50)), 100);
    return { days, maxCount };
  }, [movements]);

  // Bojxona preyskurantini filtrlash va qidiruv
  const filteredCustomsServices = useMemo(() => {
    return customsServices.filter(s => {
      const matchCat = customsCategoryFilter === 'ALL' || s.category === customsCategoryFilter;
      const searchLower = customsSearch.toLowerCase().trim();
      const matchSearch = !searchLower || 
        s.name.toLowerCase().includes(searchLower) || 
        (s.nameUz && s.nameUz.toLowerCase().includes(searchLower)) ||
        s.unit.toLowerCase().includes(searchLower) ||
        (s.description && s.description.toLowerCase().includes(searchLower));
      return matchCat && matchSearch;
    });
  }, [customsServices, customsCategoryFilter, customsSearch]);

  // Kirish amali (Faqat avtorizatsiya orqali kiriladi)
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = (loginEmail || '').toLowerCase().trim();
    const cleanPass = (loginPassword || '').trim();

    if (!cleanEmail) {
      showToast('Iltimos, elektron pochtangizni kiriting!');
      return;
    }
    if (!cleanPass) {
      showToast('Iltimos, parolingizni kiriting!');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await api.auth.login(cleanEmail, cleanPass);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('uzw_active_user', JSON.stringify(res.user));
        if (res.user.role === 'ACCOUNTANT') setActiveMenu('accounting');
        else if (res.user.role === 'USER') setActiveMenu('warehouse');
        showToast(`Xush kelibsiz, ${res.user.fullName}! (${res.user.role})`);
      }
    } catch (err: any) {
      // Local fallback for offline mode
      const allUsers = [...usersList, ...INITIAL_USERS];
      const found = allUsers.find(u => {
        const uEmail = u.email.toLowerCase().trim();
        return (
          uEmail === cleanEmail ||
          uEmail.replace('@jbgroup.uz', '@uzw.uz') === cleanEmail ||
          uEmail.replace('@uzw.uz', '@jbgroup.uz') === cleanEmail
        );
      });

      if (found && (cleanPass === 'password123' || cleanPass === found.password)) {
        setCurrentUser(found);
        localStorage.setItem('uzw_active_user', JSON.stringify(found));
        if (found.role === 'ACCOUNTANT') setActiveMenu('accounting');
        else if (found.role === 'USER') setActiveMenu('warehouse');
        showToast(`Xush kelibsiz, ${found.fullName}! (${found.role})`);
      } else {
        showToast(err.message || 'Login yoki parol noto\'g\'ri!');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Chiqish
  const handleLogout = () => {
    api.auth.logout();
    setCurrentUser(null);
    showToast('Tizimdan muvaffaqiyatli chiqildi.');
  };

  // =========================================================================
  // SUPER ADMIN: XODIMLARNI QO'SHISH VA HUQUQLARNI BELGILASH
  // =========================================================================
  const handleOpenNewUser = () => {
    setEditingUser(null);
    setUserForm({
      fullName: '',
      email: '',
      password: 'password123',
      role: 'USER',
      canManageTariffs: false,
      canManageWarehouse: false,
      canLinkTariffs: false,
      canHandleHazardous: false,
      allowedSectorIds: ['sec-2', 'sec-3'],
      canStockMovement: true,
      canViewFinances: false
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (u: User) => {
    setEditingUser(u);
    setUserForm({
      fullName: u.fullName,
      email: u.email,
      password: u.password || 'password123',
      role: u.role,
      canManageTariffs: u.permissions?.canManageTariffs ?? false,
      canManageWarehouse: u.permissions?.canManageWarehouse ?? false,
      canLinkTariffs: u.permissions?.canLinkTariffs ?? false,
      canHandleHazardous: u.permissions?.canHandleHazardous ?? false,
      allowedSectorIds: u.permissions?.allowedSectorIds ?? ['sec-2'],
      canStockMovement: u.permissions?.canStockMovement ?? true,
      canViewFinances: u.permissions?.canViewFinances ?? (u.role === 'SUPER_ADMIN')
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('Faqat Bosh Rahbar (Super Admin) xodimlarni boshqara oladi!');
      return;
    }

    const perms: UserPermissions = {
      canManageTariffs: userForm.role === 'SUPER_ADMIN' ? true : userForm.canManageTariffs,
      canManageWarehouse: userForm.role === 'SUPER_ADMIN' ? true : userForm.canManageWarehouse,
      canLinkTariffs: userForm.role === 'SUPER_ADMIN' ? true : userForm.canLinkTariffs,
      canHandleHazardous: userForm.role === 'SUPER_ADMIN' ? true : userForm.canHandleHazardous,
      allowedSectorIds: userForm.role === 'SUPER_ADMIN' ? ['ALL'] : userForm.allowedSectorIds,
      canStockMovement: userForm.canStockMovement,
      canViewFinances: userForm.role === 'SUPER_ADMIN' ? true : userForm.canViewFinances
    };

    if (editingUser) {
      api.users.update(editingUser.id, {
        fullName: userForm.fullName,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        permissions: perms
      }).catch(e => console.warn('User update error:', e));

      const updated = usersList.map(u => {
        if (u.id === editingUser.id) {
          const upd: User = {
            ...u,
            fullName: userForm.fullName,
            email: userForm.email,
            password: userForm.password,
            role: userForm.role,
            permissions: perms
          };
          if (currentUser?.id === u.id) {
            setCurrentUser(upd);
            localStorage.setItem('uzw_active_user', JSON.stringify(upd));
          }
          return upd;
        }
        return u;
      });
      saveUsersData(updated);
      showToast(`"${userForm.fullName}" ma'lumotlari va huquqlari saqlandi!`);
    } else {
      api.users.create({
        fullName: userForm.fullName,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        permissions: perms
      }).catch(e => console.warn('User create error:', e));

      const newUser: User = {
        id: 'usr-' + Date.now(),
        fullName: userForm.fullName,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        permissions: perms
      };
      saveUsersData([...usersList, newUser]);
      showToast(`Yangi xodim "${newUser.fullName}" (${newUser.role}) tizimga qo'shildi!`);
    }

    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (!isSuperAdmin) {
      showToast('Faqat Super Admin xodimlarni o\'chira oladi!');
      return;
    }
    if (userId === 'usr-super' || userId === currentUser?.id) {
      alert('Bosh Rahbar (Super Admin) akkauntini o\'chirish mumkin emas!');
      return;
    }
    if (confirm(`Haqiqatan ham "${name}" xodimini tizimdan o'chirmoqchimisiz?`)) {
      const updated = usersList.filter(u => u.id !== userId);
      saveUsersData(updated);
      showToast(`"${name}" tizimdan o'chirildi!`);
    }
  };

  // =========================================================================
  // TO'LOVCHILAR VA SHARTNOMALAR BOSHQARUVI (FOYDALANUVCHI TALABI)
  // =========================================================================
  const handleOpenNewPayer = () => {
    if (isUser) {
      showToast('Sizda to\'lovchi yoki qabul qiluvchi shartnomasini tuzish huquqi yo\'q!');
      return;
    }
    setEditingPayer(null);
    setPayerForm({
      name: '',
      inn: '',
      contractNumber: `SH-2026/0${payers.length + 1}`,
      contractStartDate: new Date().toISOString().slice(0, 10),
      contractEndDate: '2026-12-31',
      contactPerson: '',
      phone: '+998 ',
      notes: ''
    });
    setIsPayerModalOpen(true);
  };

  const handleOpenEditPayer = (p: ContractPayer) => {
    if (isUser) {
      showToast('Sizda to\'lovchi yoki qabul qiluvchi ma\'lumotlarini tahrirlash huquqi yo\'q!');
      return;
    }
    setEditingPayer(p);
    setPayerForm({
      name: p.name,
      inn: p.inn,
      contractNumber: p.contractNumber,
      contractStartDate: p.contractStartDate,
      contractEndDate: p.contractEndDate,
      contactPerson: p.contactPerson,
      phone: p.phone,
      notes: p.notes || ''
    });
    setIsPayerModalOpen(true);
  };

  const handleSavePayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUser) {
      showToast('Sizda to\'lovchi yoki qabul qiluvchi saqlash huquqi yo\'q!');
      return;
    }
    if (editingPayer) {
      api.payers.update(editingPayer.id, payerForm).catch(err => console.warn('Payer update error:', err));
      const updated = payers.map(p => p.id === editingPayer.id ? { ...p, ...payerForm } : p);
      savePayersData(updated);
      showToast(`Shartnoma yangilandi: ${payerForm.name} (Amal qilish: ${payerForm.contractEndDate})`);
    } else {
      api.payers.create(payerForm).catch(err => console.warn('Payer create error:', err));
      const newPayer: ContractPayer = {
        id: `pay-${Date.now()}`,
        ...payerForm
      };
      savePayersData([newPayer, ...payers]);
      showToast(`Yangi to'lovchi bilan shartnoma ro'yxatga olindi: ${newPayer.name}`);
    }
    setIsPayerModalOpen(false);
  };

  const handleDeletePayer = (payerId: string, name: string) => {
    if (confirm(`Haqiqatan ham "${name}" to'lovchisi shartnomasini ro'yxatdan o'chirmoqchimisiz?`)) {
      api.payers.delete(payerId).catch(err => console.warn('Payer delete error:', err));
      const updated = payers.filter(p => p.id !== payerId);
      savePayersData(updated);
      showToast(`"${name}" to'lovchisi o'chirildi!`);
    }
  };

  // Sektorni sozlashni ochish (Faqat huquqi bor xodimga)
  const openEditSector = (sector: Sector, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!canManageWarehouse) {
      showToast('Sizda omborni sozlash huquqi yo\'q!');
      return;
    }
    setEditingSector(sector);
    setSectorForm({
      name: sector.name,
      code: sector.code,
      type: sector.type,
      temperature: sector.temperature || '',
      capacity: sector.capacity,
      status: sector.status,
      allowedCargoTypes: sector.allowedCargoTypes.join(', '),
      description: sector.description || ''
    });
    setIsSectorModalOpen(true);
  };

  // Yangi sektor ochish
  const openNewSector = () => {
    if (!canManageWarehouse) {
      showToast('Sizda yangi sektor ochish huquqi yo\'q!');
      return;
    }
    setEditingSector(null);
    setSectorForm({
      name: `Yangi Sektor (${warehouse.sectors.length + 1})`,
      code: `SEC-0${warehouse.sectors.length + 1}`,
      type: 'DRY_STANDARD',
      temperature: '+18°C ... +22°C',
      capacity: 3000,
      status: 'Faol',
      allowedCargoTypes: 'Quruq tovarlar, qadoqlangan yuklar',
      description: 'Yangi saqlash bo\'linmasi'
    });
    setIsSectorModalOpen(true);
  };

  // Sektor formasini saqlash
  const handleSaveSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageWarehouse) {
      showToast('Sizda sektorlarni sozlash huquqi yo\'q!');
      return;
    }

    const allowedArr = sectorForm.allowedCargoTypes
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingSector) {
      const updatedSectors = warehouse.sectors.map(sec => {
        if (sec.id === editingSector.id) {
          return {
            ...sec,
            name: sectorForm.name,
            code: sectorForm.code,
            type: sectorForm.type,
            temperature: sectorForm.temperature,
            capacity: Number(sectorForm.capacity),
            status: sectorForm.status,
            allowedCargoTypes: allowedArr,
            description: sectorForm.description
          };
        }
        return sec;
      });

      saveWarehouseData({ ...warehouse, sectors: updatedSectors });
      showToast(`"${sectorForm.name}" sektori sozlamalari yangilandi!`);
    } else {
      const newSec: Sector = {
        id: 'sec-' + Date.now(),
        name: sectorForm.name,
        code: sectorForm.code,
        type: sectorForm.type,
        temperature: sectorForm.temperature,
        capacity: Number(sectorForm.capacity),
        status: sectorForm.status,
        allowedCargoTypes: allowedArr,
        description: sectorForm.description
      };

      const updatedSectors = [...warehouse.sectors, newSec];
      saveWarehouseData({ ...warehouse, sectors: updatedSectors });
      setSelectedSector(newSec);
      showToast(`Yangi "${sectorForm.name}" sektori qo'shildi!`);
    }

    setIsSectorModalOpen(false);
  };

  // Sektorni o'chirish
  const handleDeleteSector = (id: string, name: string) => {
    if (!isSuperAdmin) {
      showToast('Sektorni o\'chirish huquqi faqat Super Adminga berilgan!');
      return;
    }
    const hasProducts = storedProducts.some(p => p.sectorId === id);
    if (hasProducts) {
      alert(`Ushbu sektorda saqlanayotgan mahsulotlar mavjud! Avval mahsulotlarni chiqaring.`);
      return;
    }
    if (confirm(`Haqiqatan ham "${name}" sektorini o'chirmoqchimisiz?`)) {
      const updatedSectors = warehouse.sectors.filter(s => s.id !== id);
      saveWarehouseData({ ...warehouse, sectors: updatedSectors });
      if (selectedSector?.id === id) {
        setSelectedSector(updatedSectors[0] || null);
      }
      showToast(`"${name}" sektori o'chirildi!`);
    }
  };

  // Tarifni sektorlarga ulash oynasini ochish (Faqat ruxsati bor xodimga)
  const handleOpenAssignModal = (tariff: Tariff) => {
    if (!canLinkTariffs) {
      showToast('Sizda tariflarni omborga biriktirish huquqi yo\'q!');
      return;
    }
    setSelectedTariffToAssign(tariff);
    const linkedSectorIds = warehouse.sectors
      .filter(s => s.tariffId === tariff.id)
      .map(s => s.id);
    setAssignedSectorIds(linkedSectorIds);
    setIsAssignTariffModalOpen(true);
  };

  // Tarifni belgilangan sektorlarga saqlash
  const handleSaveTariffAssignment = () => {
    if (!canLinkTariffs) {
      showToast('Sizda tariflarni biriktirish huquqi yo\'q!');
      return;
    }
    if (!selectedTariffToAssign) return;

    const updatedSectors = warehouse.sectors.map(sec => {
      if (assignedSectorIds.includes(sec.id)) {
        return {
          ...sec,
          tariffId: selectedTariffToAssign.id,
          tariffName: selectedTariffToAssign.name
        };
      }
      return sec;
    });

    saveWarehouseData({ ...warehouse, sectors: updatedSectors });
    showToast(`"${selectedTariffToAssign.name}" tanlangan ${assignedSectorIds.length} ta sektorga muvaffaqiyatli biriktirildi!`);
    setIsAssignTariffModalOpen(false);
  };

  // Yangi tarif ochish oynasi
  const handleOpenNewTariff = () => {
    if (!canManageTariffs) {
      showToast('Sizda tarif qo\'shish huquqi yo\'q!');
      return;
    }
    setEditingTariff(null);
    setTariffForm({
      name: 'Yangi Maxsus Kunlik Tarif',
      unitName: 'kg',
      pricePerUnitDay: 600,
      minDays: 1,
      features: '24/7 ombor saqlovi, mikroiqlim nazorati'
    });
    setIsTariffEditModalOpen(true);
  };

  // Mavjud tarifni tahrirlash oynasi
  const handleOpenEditTariff = (tariff: Tariff) => {
    if (!canManageTariffs) {
      showToast('Sizda tariflarni tahrirlash huquqi yo\'q!');
      return;
    }
    setEditingTariff(tariff);
    setTariffForm({
      name: tariff.name,
      unitName: tariff.unitName,
      pricePerUnitDay: tariff.pricePerUnitDay,
      minDays: tariff.minDays,
      features: tariff.features.join(', ')
    });
    setIsTariffEditModalOpen(true);
  };

  // Tarifni saqlash (Yaratish yoki Narxni o'zgartirish)
  const handleSaveTariff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageTariffs) {
      showToast('Sizda tariflarni boshqarish huquqi yo\'q!');
      return;
    }

    const featArr = tariffForm.features.split(',').map(f => f.trim()).filter(Boolean);

    if (editingTariff) {
      const updatedTariffs = tariffs.map(t => {
        if (t.id === editingTariff.id) {
          return {
            ...t,
            name: tariffForm.name,
            unitName: tariffForm.unitName,
            pricePerUnitDay: Number(tariffForm.pricePerUnitDay),
            minDays: Number(tariffForm.minDays),
            features: featArr
          };
        }
        return t;
      });

      const updatedSectors = warehouse.sectors.map(sec => {
        if (sec.tariffId === editingTariff.id) {
          return { ...sec, tariffName: tariffForm.name };
        }
        return sec;
      });

      saveTariffsData(updatedTariffs);
      saveWarehouseData({ ...warehouse, sectors: updatedSectors });
      showToast(`"${tariffForm.name}" tarifi muvaffaqiyatli yangilandi!`);
    } else {
      const newTariff: Tariff = {
        id: 'tar-' + Date.now(),
        name: tariffForm.name,
        unitName: tariffForm.unitName,
        pricePerUnitDay: Number(tariffForm.pricePerUnitDay),
        currency: 'UZS',
        minDays: Number(tariffForm.minDays),
        features: featArr
      };

      saveTariffsData([...tariffs, newTariff]);
      showToast(`Yangi "${newTariff.name}" tarifi yaratildi!`);
    }

    setIsTariffEditModalOpen(false);
  };

  // Yangi tovar kiritish (KIRIM) — Foydalanuvchi huquqi va xavfli yuklar qoidasi
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canStockMovement) {
      showToast('Sizda yuk kiritish huquqi yo\'q!');
      return;
    }

    const sec = warehouse.sectors.find(s => s.id === productForm.sectorId);
    if (!sec) {
      showToast('Iltimos, sektorni tanlang!');
      return;
    }

    // 2-rasmdagi rasmiy preyskurant saqlash tarifi (10–19 bandlar)
    const storageSvc = customsServices.find(s => s.id === productForm.storageTariffId)
      || customsServices.find(s => s.category === 'STORAGE' && (productForm.unit === 'pallet' ? s.itemNo === 14 : sec.type === 'COLD_FREEZER' ? s.itemNo === 19 : s.itemNo === 10))
      || customsServices.find(s => s.id === 'cs-12')!;
    const storageName = storageSvc.nameUz || storageSvc.name;
    const dailyRate = storageSvc.basePrice;

    const now = new Date();
    const qtyNum = Number(productForm.quantity);
    const weightNum = Number(productForm.weightKg);

    if (!qtyNum || qtyNum <= 0) {
      showToast('Iltimos, to\'g\'ri yuk sonini kiriting!');
      return;
    }
    if (!weightNum || weightNum <= 0) {
      showToast('Iltimos, to\'g\'ri jami og\'irlikni (kg) kiriting!');
      return;
    }

    const invNo = 'NAK-IN-' + Date.now().toString().slice(-5);

    const matchedPayer = payers.find(p => p.id === productForm.payerId || p.name.toLowerCase() === productForm.clientName?.toLowerCase());
    const finalClientName = matchedPayer?.name || productForm.clientName || 'Noma\'lum mijoz';

    const newProd: StoredProduct = {
      id: 'prod-' + Date.now(),
      sectorId: sec.id,
      sectorName: sec.name,
      name: productForm.name,
      category: productForm.category,
      payerId: matchedPayer?.id,
      contractNumber: matchedPayer?.contractNumber,
      contractEndDate: matchedPayer?.contractEndDate,
      quantity: qtyNum,
      initialQuantity: qtyNum,
      unit: productForm.unit,
      weightKg: weightNum,
      initialWeightKg: weightNum,
      storageTariffId: storageSvc.id,
      storageTariffName: storageName,
      storageTariffRate: storageSvc.basePrice,
      storageTariffItemNo: storageSvc.itemNo,
      storageTariffUnit: storageSvc.unit,
      tariffId: storageSvc.id,
      tariffName: storageName,
      dailyRatePerUnit: dailyRate,
      entryDate: now.toISOString().slice(0, 10),
      entryTime: now.toTimeString().slice(0, 5),
      placedBy: currentUser?.fullName || 'Mas\'ul xodim',
      placedByRole: currentUser?.role || 'USER',
      clientName: finalClientName,
      notes: productForm.notes || undefined,
      obrabotkaService: includeKirimUnloading && kirimCalculation.transportSvc 
        ? (kirimCalculation.transportSvc.nameUz || kirimCalculation.transportSvc.name) 
        : 'Tushirish xizmatisiz (Mijoz o\'z kuchi bilan)',
      obrabotkaCost: includeKirimUnloading && kirimCalculation.transportSvc ? kirimCalculation.transportSvc.basePrice : 0,
      obrabotkaVat: includeKirimUnloading && kirimCalculation.transportSvc ? kirimCalculation.transportSvc.vatAmount : 0,
      kirimAdditionalServices: kirimCalculation.applied.filter(a => a.serviceId !== kirimCalculation.transportSvc?.id),
      exitHistory: []
    };

    const newMove: CargoMovement = {
      id: 'mov-' + Date.now(),
      invoiceNo: invNo,
      sectorId: sec.id,
      sectorName: sec.name,
      productId: newProd.id,
      productName: newProd.name,
      type: 'IN',
      quantity: newProd.quantity,
      initialQuantity: newProd.initialQuantity,
      remainingQuantity: newProd.quantity,
      unit: newProd.unit,
      weightKg: newProd.weightKg,
      initialWeightKg: newProd.initialWeightKg,
      remainingWeightKg: newProd.weightKg,
      userName: currentUser?.fullName || 'Mas\'ul xodim',
      userRole: currentUser?.role || 'USER',
      placedBy: currentUser?.fullName || 'Mas\'ul xodim',
      placedDate: `${newProd.entryDate} ${newProd.entryTime}`,
      date: newProd.entryDate,
      time: newProd.entryTime,
      notes: newProd.notes,
      clientName: newProd.clientName,
      receiverInn: matchedPayer?.inn,
      transportType: includeKirimUnloading && kirimCalculation.transportSvc ? (kirimCalculation.transportSvc.nameUz || kirimCalculation.transportSvc.name) : 'Tushirish xizmatisiz (Mijoz o\'z kuchi bilan)',
      servicesApplied: kirimCalculation.applied,
      obrabotkaCostUZS: includeKirimUnloading && kirimCalculation.transportSvc ? (kirimCalculation.transportSvc.basePrice + kirimCalculation.transportSvc.vatAmount) : 0,
      additionalCostUZS: kirimCalculation.applied.filter(a => a.serviceId !== kirimCalculation.transportSvc?.id).reduce((s, x) => s + x.totalPrice, 0),
      vatTotalUZS: kirimCalculation.vatSum,
      totalCostUZS: kirimCalculation.baseSum,
      grandTotalUZS: kirimCalculation.grandTotal
    };

    saveProductsData([newProd, ...storedProducts]);
    saveMovementsData([newMove, ...movements]);
    showToast(`"${newProd.name}" (${newProd.quantity} ${newProd.unit} | ${newProd.weightKg.toLocaleString('uz-UZ')} kg) omborga qabul qilindi va joylashtirildi!`);
    setIsAddProductModalOpen(false);

    // PostgreSQL bazasiga sinxronlash
    api.products.create({
      name: newProd.name,
      category: newProd.category,
      quantity: newProd.quantity,
      unit: newProd.unit,
      weightKg: newProd.weightKg,
      dailyRatePerUnit: newProd.dailyRatePerUnit,
      storageTariffId: newProd.storageTariffId,
      storageTariffName: newProd.storageTariffName,
      storageTariffRate: newProd.storageTariffRate,
      storageTariffItemNo: newProd.storageTariffItemNo,
      storageTariffUnit: newProd.storageTariffUnit,
      sectorId: newProd.sectorId,
      sectorName: newProd.sectorName,
      warehouseId: warehouse.id,
      payerId: newProd.payerId,
      clientName: newProd.clientName,
      contractNumber: newProd.contractNumber,
      contractEndDate: newProd.contractEndDate,
      entryDate: newProd.entryDate,
      entryTime: newProd.entryTime,
      placedBy: newProd.placedBy,
      placedByRole: newProd.placedByRole,
      notes: newProd.notes,
      obrabotkaService: newProd.obrabotkaService,
      obrabotkaCost: newProd.obrabotkaCost,
      obrabotkaVat: newProd.obrabotkaVat,
      kirimAdditionalServices: newProd.kirimAdditionalServices
    }).catch(err => console.warn('PostgreSQL ga saqlashda xato:', err));
    // Kirimda nakladnoy shakllantirilmaydi, yuk faqat omborga kiritiladi!
  };

  // Chiqim modalini ochish va saqlash/tushirish tariflarini yuk ma'lumotlariga moslab aqlli belgilash
  const handleOpenExitModalForProduct = (prod: StoredProduct) => {
    setSelectedProductToExit(prod);
    setExitQuantity(prod.quantity);
    setExitWeightKg(prod.weightKg);
    setExitNotes('');

    const pMatch = payers.find(p => p.id === prod.payerId || p.name.toLowerCase() === prod.clientName?.toLowerCase());
    setExitReceiverInn(pMatch?.inn || '');
    setExitReceiverName(pMatch?.name || prod.clientName || '');
    setExitReceiverPerson(pMatch?.contactPerson || '');

    // 1. Omborga tushirish (Разгрузка) xizmatini aniqlash:
    if (prod.obrabotkaService) {
      const matched = customsServices.find(s => s.category === 'UNLOADING_LOADING' && (
        prod.obrabotkaService?.toLowerCase().includes(s.name.toLowerCase()) || 
        (s.nameUz && prod.obrabotkaService?.toLowerCase().includes(s.nameUz.toLowerCase()))
      ));
      if (matched) {
        setSelectedUnloadingServiceId(matched.id);
      } else {
        setSelectedUnloadingServiceId('cs-8');
      }
    } else {
      setSelectedUnloadingServiceId('cs-8');
    }

    // 2. 2-rasm Saqlash tarifini (10-19 bandlar): yuk omborga qabul qilinganda tanlangan saqlash usuli olinadi
    if (prod.storageTariffId) {
      setSelectedStorageTariffId(prod.storageTariffId);
    } else {
      const days = calculateDaysStored(prod.entryDate);
      if (prod.sectorName.toLowerCase().includes('xolodilnik') || prod.category?.toLowerCase().includes('go\'sht') || prod.category?.toLowerCase().includes('muzlatilgan')) {
        setSelectedStorageTariffId('cs-21'); // 19. Хранение груза в холодильниках (50 so'm/kg)
      } else if (prod.unit === 'pallet') {
        setSelectedStorageTariffId('cs-16'); // 14. Хранение по паллетам (25 000 so'm/pallet)
      } else if (prod.weightKg >= 100000) {
        setSelectedStorageTariffId('cs-13'); // 11. Хранение свыше 100 тн (7 000 so'm/tn)
      } else if (days > 60) {
        setSelectedStorageTariffId('cs-14'); // 12. Хранение свыше 60 дней (5 000 so'm/tn)
      } else if (prod.unit === 'avto' || prod.name.toLowerCase().includes('avto')) {
        setSelectedStorageTariffId('cs-17'); // 15. Хранение легкового автотранспорта (30 000 so'm)
      } else {
        setSelectedStorageTariffId('cs-12'); // 10. Хранение 1тн груза в сутки (без паллетоместа) (8 000 so'm/tn)
      }
    }

    // 3. Tushirish va Ortish xizmatlarini boshlang'ich yoqilganlik holati
    const hadUnloading = prod.obrabotkaService 
      ? (!prod.obrabotkaService.includes('xizmatisiz') && (prod.obrabotkaCost !== undefined ? prod.obrabotkaCost > 0 : true)) 
      : true;
    setIncludeExitUnloading(hadUnloading);
    setIncludeExitLoading(true);

    setIsExitModalOpen(true);
  };

  // Mahsulotni chiqarish (CHIQIM) va Tarif hisobini tasdiqlash
  const handleConfirmExit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canStockMovement) {
      showToast('Sizda mahsulotni chiqarish huquqi yo\'q!');
      return;
    }
    if (!selectedProductToExit || !exitBillingCalculation) return;

    const qtyToExit = Number(exitQuantity);
    if (qtyToExit <= 0 || qtyToExit > selectedProductToExit.quantity) {
      showToast('Chiqariladigan miqdor noto\'g\'ri belgilangan!');
      return;
    }

    const now = new Date();
    const remainingQty = Math.max(0, selectedProductToExit.quantity - qtyToExit);
    const weightToExit = exitBillingCalculation.validWeightKg;
    const remainingWeight = Math.max(0, exitBillingCalculation.remainingWeightKg);
    const isFullExit = remainingQty <= 0 || remainingWeight <= 0;
    const invNo = 'NAK-OUT-' + Date.now().toString().slice(-5);

    const unloadingSvcName = exitBillingCalculation.unloadingCleanName;
    const loadingSvcName = exitBillingCalculation.loadingCleanName;
    const storageTariffName = exitBillingCalculation.storageSvc.nameUz || exitBillingCalculation.storageSvc.name;

    const newExitRec: ProductExitRecord = {
      id: 'exit-' + Date.now(),
      invoiceNo: invNo,
      exitDate: now.toISOString().slice(0, 10),
      exitTime: now.toTimeString().slice(0, 5),
      quantity: qtyToExit,
      weightKg: weightToExit,
      remainingQuantity: remainingQty,
      remainingWeightKg: remainingWeight,
      exitedBy: currentUser?.fullName || 'Mas\'ul xodim',
      exitedByRole: currentUser?.role || 'USER',
      daysStored: exitBillingCalculation.daysStored,
      storageBaseCost: exitBillingCalculation.storageBase,
      storageVat: exitBillingCalculation.storageVat,
      storageTariffName: storageTariffName,
      storageFormula: exitBillingCalculation.storageDetailNote,
      unloadingService: unloadingSvcName,
      unloadingCost: exitBillingCalculation.unloadingTotal,
      loadingService: loadingSvcName,
      loadingCost: exitBillingCalculation.loadingTotal,
      additionalServices: exitBillingCalculation.additionalApplied,
      additionalCost: exitBillingCalculation.additionalExitBase + exitBillingCalculation.additionalExitVat,
      totalCost: exitBillingCalculation.totalCost,
      receiverInn: exitReceiverInn.trim() || undefined,
      receiverName: exitReceiverName.trim() || selectedProductToExit.clientName,
      receiverPerson: exitReceiverPerson.trim() || undefined,
      notes: exitNotes || undefined
    };

    // 1. Mahsulotlar ro'yxatini yangilash va Chiqimlar tarixiga yozish
    let updatedProducts: StoredProduct[];
    if (isFullExit) {
      updatedProducts = storedProducts.filter(p => p.id !== selectedProductToExit.id);
    } else {
      updatedProducts = storedProducts.map(p => {
        if (p.id === selectedProductToExit.id) {
          return {
            ...p,
            quantity: remainingQty,
            weightKg: remainingWeight,
            exitHistory: [...(p.exitHistory || []), newExitRec]
          };
        }
        return p;
      });
    }
    saveProductsData(updatedProducts);

    // 2. Harakatlar jurnaliga yozish (Rasmiy Chiqim Nakladnoyi uchun to'liq ma'lumot)
    const newMove: CargoMovement = {
      id: 'mov-' + Date.now(),
      invoiceNo: invNo,
      sectorId: selectedProductToExit.sectorId,
      sectorName: selectedProductToExit.sectorName,
      productId: selectedProductToExit.id,
      productName: selectedProductToExit.name,
      type: 'OUT',
      quantity: qtyToExit,
      initialQuantity: selectedProductToExit.initialQuantity || selectedProductToExit.quantity,
      remainingQuantity: remainingQty,
      unit: selectedProductToExit.unit,
      weightKg: weightToExit,
      initialWeightKg: selectedProductToExit.initialWeightKg || selectedProductToExit.weightKg,
      remainingWeightKg: remainingWeight,
      userName: currentUser?.fullName || 'Mas\'ul xodim',
      userRole: currentUser?.role || 'USER',
      placedBy: selectedProductToExit.placedBy || 'Noma\'lum',
      placedDate: `${selectedProductToExit.entryDate} ${selectedProductToExit.entryTime}`,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      notes: exitNotes 
        ? `${exitNotes} | Tushirish: ${unloadingSvcName} | Ortish: ${loadingSvcName}` 
        : `Tushirish: ${unloadingSvcName} | Ortish: ${loadingSvcName} | Saqlash: ${exitBillingCalculation.storageTotal.toLocaleString('uz-UZ')} UZS | Qoldiq: ${remainingQty} ${selectedProductToExit.unit}`,
      clientName: selectedProductToExit.clientName,
      transportType: unloadingSvcName,
      unloadingType: unloadingSvcName,
      loadingType: loadingSvcName,
      daysStored: exitBillingCalculation.daysStored,
      tariffId: exitBillingCalculation.storageSvc.id,
      tariffName: storageTariffName,
      storageTariffName: storageTariffName,
      storageFormula: exitBillingCalculation.storageDetailNote,
      tariffDailyRate: exitBillingCalculation.storageSvc.basePrice,
      obrabotkaCostUZS: exitBillingCalculation.unloadingTotal,
      storageCostUZS: exitBillingCalculation.storageTotal,
      loadingCostUZS: exitBillingCalculation.loadingTotal,
      additionalCostUZS: exitBillingCalculation.additionalExitBase + exitBillingCalculation.additionalExitVat,
      servicesApplied: exitBillingCalculation.appliedExitServices,
      vatTotalUZS: exitBillingCalculation.totalVat,
      totalCostUZS: exitBillingCalculation.totalBase,
      grandTotalUZS: exitBillingCalculation.totalCost,
      receiverInn: !isUser ? (exitReceiverInn.trim() || undefined) : undefined,
      receiverName: !isUser ? (exitReceiverName.trim() || selectedProductToExit.clientName) : selectedProductToExit.clientName,
      receiverPerson: !isUser ? (exitReceiverPerson.trim() || undefined) : undefined
    };
    saveMovementsData([newMove, ...movements]);

    // PostgreSQL bazasiga sinxronlash
    api.products.exit({
      productId: selectedProductToExit.id,
      exitQuantity: qtyToExit,
      exitWeightKg: weightToExit,
      receiverInn: exitReceiverInn,
      receiverName: exitReceiverName,
      receiverPerson: exitReceiverPerson,
      unloadingService: unloadingSvcName,
      unloadingCost: exitBillingCalculation.unloadingTotal,
      storageTariffId: exitBillingCalculation.storageSvc.id,
      storageTariffName: storageTariffName,
      storageBaseCost: exitBillingCalculation.storageBase,
      storageVat: exitBillingCalculation.storageVat,
      storageFormula: exitBillingCalculation.storageDetailNote,
      loadingService: loadingSvcName,
      loadingCost: exitBillingCalculation.loadingTotal,
      additionalServices: exitBillingCalculation.appliedExitServices,
      additionalCost: exitBillingCalculation.additionalExitBase + exitBillingCalculation.additionalExitVat,
      totalCost: exitBillingCalculation.totalBase,
      grandTotalCost: exitBillingCalculation.totalCost,
      daysStored: exitBillingCalculation.daysStored,
      notes: exitNotes
    }).catch(err => console.warn('PostgreSQL chiqim saqlashda xato:', err));

    if (canViewFinances) {
      showToast(`Chiqim tasdiqlandi! Qoldiq: ${remainingQty} ${selectedProductToExit.unit} (${remainingWeight.toLocaleString('uz-UZ')} kg). Jami to'lov: ${exitBillingCalculation.totalCost.toLocaleString('uz-UZ')} UZS`);
      setSelectedInvoiceMovement(newMove);
    } else {
      showToast(`Chiqim muvaffaqiyatli amalga oshirildi! Qoldiq: ${remainingQty} ${selectedProductToExit.unit} (${remainingWeight.toLocaleString('uz-UZ')} kg).`);
      setSelectedInvoiceMovement(null);
    }
    setIsExitModalOpen(false);
  };

  // Bojxona xizmatini tahrirlash yoki yangi qo'shish
  const handleSaveCustomsService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageTariffs) {
      showToast('Sizda xizmatlar narxini o\'zgartirish huquqi yo\'q!');
      return;
    }

    const base = Number(customsServiceForm.basePrice) || 0;
    const vat = Math.round(base * (Number(customsServiceForm.vatRate) || 0.12));
    const total = base + vat;

    if (editingCustomsService) {
      api.customsServices.update({
        id: editingCustomsService.id,
        itemNo: editingCustomsService.itemNo,
        category: customsServiceForm.category,
        name: customsServiceForm.name,
        nameUz: customsServiceForm.nameUz,
        unit: customsServiceForm.unit,
        basePrice: base,
        description: customsServiceForm.description
      }).catch(err => console.warn('Customs service update error:', err));

      const updated = customsServices.map(s => {
        if (s.id === editingCustomsService.id) {
          return {
            ...s,
            name: customsServiceForm.name,
            nameUz: customsServiceForm.nameUz,
            unit: customsServiceForm.unit,
            basePrice: base,
            vatRate: Number(customsServiceForm.vatRate) || 0.12,
            vatAmount: vat,
            totalPrice: total,
            description: customsServiceForm.description,
            category: customsServiceForm.category
          };
        }
        return s;
      });
      saveCustomsServicesData(updated);
      showToast(`"${customsServiceForm.name}" narxi muvaffaqiyatli yangilandi!`);
    } else {
      api.customsServices.create({
        itemNo: customsServices.length + 1,
        category: customsServiceForm.category,
        name: customsServiceForm.name,
        nameUz: customsServiceForm.nameUz,
        unit: customsServiceForm.unit,
        basePrice: base,
        description: customsServiceForm.description
      }).catch(err => console.warn('Customs service create error:', err));

      const newSvc: CustomsService = {
        id: 'cs-' + Date.now(),
        itemNo: customsServices.length + 1,
        category: customsServiceForm.category,
        name: customsServiceForm.name,
        nameUz: customsServiceForm.nameUz || customsServiceForm.name,
        unit: customsServiceForm.unit,
        basePrice: base,
        vatRate: Number(customsServiceForm.vatRate) || 0.12,
        vatAmount: vat,
        totalPrice: total,
        description: customsServiceForm.description
      };
      saveCustomsServicesData([...customsServices, newSvc]);
      showToast(`Yangi "${newSvc.name}" bojxona xizmati qo'shildi!`);
    }
    setIsCustomsServiceModalOpen(false);
  };

  // Agar foydalanuvchi tizimga kirmagan bo'lsa: JB GROUP Login oynasi
  if (!currentUser) {
    return (
      <LoginOverlay
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        onSubmit={handleLogin}
        loading={loginLoading}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast xabari */}
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#0f172a', color: '#ffffff', padding: '12px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔔</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Yuqori Minimalist Boshqaruv Paneli */}
      <Header
        currentUser={currentUser}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={handleLogout}
        isUser={isUser}
        isSuperAdmin={isSuperAdmin}
        isAccountant={isAccountant}
        canManageTariffs={canManageTariffs}
        canViewFinances={canViewFinances}
      />

      {/* Asosiy Ishchi Hudud */}
      <main style={{ maxWidth: '100%', width: '100%', margin: '0 auto', padding: '16px 20px', flex: 1, boxSizing: 'border-box' }}>

        {/* Super Admin uchun Tezkir Boshqaruv Markazi Banneri */}
        {isSuperAdmin && activeMenu !== 'users' && (
          <div className="no-print" style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)', color: '#ffffff', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', boxShadow: '0 4px 12px rgba(37,99,235,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '26px' }}>👑</span>
              <div>
                <strong style={{ fontSize: '15px', letterSpacing: '-0.01em' }}>Super Admin Boshqaruv Punkti:</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#bfdbfe' }}>
                  Faqat siz yangi admin yoki user qo&apos;shishingiz, ularga omborni sozlash, tariflar va xavfli yuklar bilan ishlash huquqlarini (dostup) belgilashingiz mumkin.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveMenu('users')}
              style={{
                background: '#ffffff',
                color: '#1d4ed8',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <span>⚙️ Xodimlar & Huquqlar Punktiga O&apos;tish</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* ========================================================
            1-BO'LIM: OMBOR & SEKTORLAR (KUNLIK HISOBLAR BILAN)
            ======================================================== */}
        {activeMenu === 'warehouse' && (
          <div>
            {/* Ombor Umumiy Xulosasi: TIZIM O'ZI AVTOMATIK HISOBLAB KO'RSATGAN QISM */}
            <div className="mini-card" style={{ marginBottom: '20px', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🏢</span>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {warehouse.name}
                    </h2>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                    📍 {warehouse.city}, {warehouse.address} • Mas&apos;ul: {warehouse.manager} ({warehouse.phone})
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {canStockMovement && (
                    <button
                      onClick={() => {
                        const sec = selectedSector || warehouse.sectors[0];
                        const defStorageTariff = sec?.type === 'COLD_FREEZER' || sec?.type === 'CHILLED' ? 'cs-21' : 'cs-12';
                        setProductForm({
                          sectorId: sec?.id || '',
                          storageTariffId: defStorageTariff,
                          name: '',
                          category: 'Oziq-ovqat',
                          quantity: '',
                          unit: 'dona',
                          weightKg: '',
                          clientName: '',
                          payerId: '',
                          notes: ''
                        });
                        setIsAddProductModalOpen(true);
                      }}
                      className="btn-primary"
                    >
                      <span>+</span>
                      <span>Yangi Yuk Kiritish (Kirim)</span>
                    </button>
                  )}

                  {canManageWarehouse && (
                    <button onClick={openNewSector} className="btn-secondary">
                      <span>➕ Sektor Qo&apos;shish</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tizim avtomatik hisoblagan umumiy yuklar xulosasi */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Ombordagi Jami Tovarlar:</span>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {storedProducts.length} xil mahsulot partiyasi
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Faol Sektorlar Soni:</span>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
                    {warehouse.sectors.length} ta ixtisoslashgan sektor
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Hisoblash Tizimi:</span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
                    Kunlik tarif (1 kg = 600 so&apos;m va h.k.)
                  </div>
                </div>
              </div>

              {/* Birliklar kesimida avtomatik jamlangan jami yuklar */}
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Jami Ombordagi Yuklar Miqdori:</span>
                {Object.entries(globalUnitsSummary).map(([unit, qty]) => (
                  <span key={unit} style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 }}>
                    {qty.toLocaleString('uz-UZ')} {unit}
                  </span>
                ))}
              </div>
            </div>

            {/* Sektorlar va Ichidagi Mahsulotlar (2 ustunli ko'rinish) */}
            <div style={{ display: 'grid', gridTemplateColumns: '270px minmax(0, 1fr)', gap: '14px', alignItems: 'start', width: '100%' }}>
              
              {/* CHAP USTUN: Sektorlar Ro'yxati */}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    Ombor Sektorlari ({warehouse.sectors.length})
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Ko&apos;rish uchun bosing:</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Barcha Sektorlar Umumiy Tanlovi */}
                  <div
                    onClick={() => setSelectedSectorFilter('ALL')}
                    style={{
                      background: selectedSectorFilter === 'ALL' ? '#eff6ff' : '#ffffff',
                      border: selectedSectorFilter === 'ALL' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      boxShadow: selectedSectorFilter === 'ALL' ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>🏢</span>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#002d62', margin: 0 }}>
                            Barcha Sektorlar (Hammasi)
                          </h4>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            Umumiy: {storedProducts.length} xil yuk partiyasi
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: selectedSectorFilter === 'ALL' ? '#2563eb' : '#f1f5f9', color: selectedSectorFilter === 'ALL' ? '#ffffff' : '#1d4ed8', fontWeight: 800 }}>
                        {storedProducts.length} ta yuk
                      </span>
                    </div>
                  </div>

                  {warehouse.sectors.map(sec => {
                    const meta = getSectorMeta(sec.type);
                    const stockInfo = sectorStockMap[sec.id] || { totalItems: 0, unitsSummary: '' };
                    const isSelected = selectedSectorFilter === sec.id || (selectedSectorFilter === 'ALL' && selectedSector?.id === sec.id);
                    const access = checkSectorAccess(sec, currentUser);

                    return (
                      <div
                        key={sec.id}
                        onClick={() => {
                          setSelectedSector(sec);
                          setSelectedSectorFilter(sec.id);
                        }}
                        style={{
                          background: isSelected && selectedSectorFilter !== 'ALL' ? '#ffffff' : '#fafafa',
                          border: isSelected && selectedSectorFilter !== 'ALL' ? '2px solid #2563eb' : !access.allowed ? '1px dashed #fca5a5' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          cursor: 'pointer',
                          boxShadow: isSelected && selectedSectorFilter !== 'ALL' ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none',
                          transition: 'all 0.15s ease',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '18px' }}>{meta.icon}</span>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#002d62', margin: 0 }}>
                                  {sec.name}
                                </h4>
                                {!access.allowed && (
                                  <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                                    {sec.type === 'HAZARDOUS' ? '☣️ Ruxsatsiz' : '🔒 Ruxsat yo\'q'}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7', marginTop: '1px' }}>
                                📐 Hajmi: {sec.capacity.toLocaleString('uz-UZ')} m²
                              </div>
                              {sec.subSections && (
                                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                                  🏷️ Otseklar: {sec.subSections}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className={`sector-badge ${meta.badgeClass}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                            {meta.label}
                          </span>
                        </div>

                        {/* Tizim avtomatik hisoblagan tovarlar miqdori */}
                        <div style={{ marginTop: '6px', padding: '6px 8px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b' }}>
                            <span>Mavjud tovarlar: <strong style={{ color: '#0f172a' }}>{stockInfo.totalItems} xil</strong></span>
                            <span style={{ color: '#059669', fontWeight: 700 }}>● {sec.status}</span>
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', marginTop: '1px' }}>
                            {stockInfo.unitsSummary}
                          </div>
                        </div>

                        {/* Sektor Sozlash tugmasi */}
                        {canManageWarehouse && (
                          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                            <button
                              onClick={(e) => openEditSector(sec, e)}
                              className="btn-outline"
                              style={{ fontSize: '10px', padding: '2px 6px' }}
                            >
                              ⚙️ Sozlash
                            </button>
                            {isSuperAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSector(sec.id, sec.name);
                                }}
                                style={{ color: '#dc2626', background: 'transparent', padding: '2px 5px', fontSize: '10px' }}
                                title="O'chirish"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* O'NG USTUN: OMBOR YUKLARI JADVALI VA BOSHQARUV TIZIMI (FOYDALANUVCHI TALABI) */}
              <div style={{ minWidth: 0 }}>
                <div className="mini-card" style={{ background: '#ffffff', minHeight: '560px', padding: '16px 18px', width: '100%', boxSizing: 'border-box' }}>
                  {/* Sektor Sarlavhasi va Meta Ma'lumotlari */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '28px' }}>
                        {selectedSectorFilter === 'ALL' ? '🏢' : selectedSector ? getSectorMeta(selectedSector.type).icon : '📦'}
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#002d62', margin: 0 }}>
                            {selectedSectorFilter === 'ALL' 
                              ? 'Barcha Sektorlardagi Yuklar Ro\'yxati (Umumiy Baza)'
                              : selectedSector ? selectedSector.name : 'Sektor'}
                          </h3>
                          {selectedSectorFilter !== 'ALL' && selectedSector && (
                            <span className={`sector-badge ${getSectorMeta(selectedSector.type).badgeClass}`} style={{ fontSize: '10px' }}>
                              {getSectorMeta(selectedSector.type).label}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>
                          {selectedSectorFilter === 'ALL' ? (
                            <span>Ombor majmuasidagi barcha 6 ta sektor bo&apos;yicha jamlangan tovarlar hisobi</span>
                          ) : selectedSector ? (
                            <>
                              <strong style={{ color: '#0284c7' }}>📐 Maydon: {selectedSector.capacity.toLocaleString('uz-UZ')} m²</strong>
                              {selectedSector.subSections && (
                                <span style={{ marginLeft: '8px', color: '#64748b' }}>(Otseklar: {selectedSector.subSections})</span>
                              )}
                              <span style={{ marginLeft: '8px' }}>• Harorat: <strong>{selectedSector.temperature || 'Standart'}</strong></span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Sektorga yangi yuk kiritish tugmasi */}
                    {canStockMovement && (
                      <button
                        onClick={() => {
                          const targetSec = selectedSectorFilter !== 'ALL' 
                            ? warehouse.sectors.find(s => s.id === selectedSectorFilter) || selectedSector || warehouse.sectors[0]
                            : selectedSector || warehouse.sectors[0];
                          const defStorageTariff = targetSec?.type === 'COLD_FREEZER' || targetSec?.type === 'CHILLED' ? 'cs-21' : 'cs-12';
                          setProductForm({
                            sectorId: targetSec?.id || '',
                            storageTariffId: defStorageTariff,
                            name: '',
                            category: 'Oziq-ovqat',
                            quantity: '',
                            unit: 'dona',
                            weightKg: '',
                            clientName: '',
                            payerId: '',
                            notes: ''
                          });
                          setIsAddProductModalOpen(true);
                        }}
                        className="btn-primary"
                        style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span>📥</span>
                        <span>+ Yangi Yuk Kirim Qilish</span>
                      </button>
                    )}
                  </div>

                  {/* Ruxsat etilmagan xodim ogohlantirishi */}
                  {selectedSectorFilter !== 'ALL' && selectedSector && !checkSectorAccess(selectedSector, currentUser).allowed && (
                    <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>🚫</span>
                      <div style={{ fontSize: '12px', color: '#b91c1c' }}>
                        <strong>Ushbu Sektor Bilan Ishlash Huquqingiz Cheklangan:</strong> {checkSectorAccess(selectedSector, currentUser).reason}
                      </div>
                    </div>
                  )}

                  {/* ========================================================
                      TEZKOR QIDIRUV VA JADVAL FILTRLASH BOSHQARUVI (TALAB ASOSIDA)
                      ======================================================== */}
                  <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    {/* Qidiruv input */}
                    <div style={{ flex: '1 1 320px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '14px' }}>🔍</span>
                      <input
                        type="text"
                        className="form-input-clean"
                        style={{ paddingLeft: '36px', background: '#ffffff', fontSize: '12.5px' }}
                        placeholder="Yuk nomi, nakladnoy, korxona (to'lovchi), STIR (INN) yoki sektor bo'yicha qidiruv..."
                        value={productSearchQuery}
                        onChange={e => setProductSearchQuery(e.target.value)}
                      />
                      {productSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setProductSearchQuery('')}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Sektor bo'yicha filter dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Sektor:</span>
                      <select
                        className="form-select-clean"
                        value={selectedSectorFilter}
                        onChange={e => setSelectedSectorFilter(e.target.value)}
                        style={{ background: '#ffffff', fontSize: '12px', padding: '6px 10px', width: 'auto' }}
                      >
                        <option value="ALL">🏢 Barcha Sektorlar ({storedProducts.length} ta)</option>
                        {warehouse.sectors.map(sec => {
                          const count = storedProducts.filter(p => p.sectorId === sec.id).length;
                          return (
                            <option key={sec.id} value={sec.id}>
                              {sec.name} ({count} ta yuk)
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Ko'rinish rejimi: Jadval / Kartochkalar */}
                    <div style={{ display: 'flex', alignItems: 'center', background: '#e2e8f0', padding: '3px', borderRadius: '8px', gap: '2px' }}>
                      <button
                        type="button"
                        onClick={() => setProductViewMode('TABLE')}
                        style={{
                          background: productViewMode === 'TABLE' ? '#ffffff' : 'transparent',
                          color: productViewMode === 'TABLE' ? '#002d62' : '#64748b',
                          fontWeight: 700,
                          fontSize: '11px',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: productViewMode === 'TABLE' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                      >
                        <span>📑</span>
                        <span>Jadval Ko&apos;rinishi</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductViewMode('CARDS')}
                        style={{
                          background: productViewMode === 'CARDS' ? '#ffffff' : 'transparent',
                          color: productViewMode === 'CARDS' ? '#002d62' : '#64748b',
                          fontWeight: 700,
                          fontSize: '11px',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: productViewMode === 'CARDS' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                      >
                        <span>🗂️</span>
                        <span>Karta Ko&apos;rinishi</span>
                      </button>
                    </div>
                  </div>

                  {/* Ko'rsatkichlar status paneli */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '12px' }}>
                    <span style={{ color: '#475569', fontWeight: 700 }}>
                      📦 Ko&apos;rsatilmoqda: <strong style={{ color: '#002d62' }}>{filteredWarehouseProducts.length} ta yuk partiyasi</strong>
                      {productSearchQuery && <span style={{ color: '#0284c7', marginLeft: '6px' }}>(Qidiruv: &quot;{productSearchQuery}&quot;)</span>}
                    </span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>
                      Jami og&apos;irlik: {filteredWarehouseProducts.reduce((acc, p) => acc + (p.weightKg || p.quantity), 0).toLocaleString('uz-UZ')} kg
                    </span>
                  </div>

                  {/* ========================================================
                      JADVAL SHAKLI (TABLE VIEW) — FOYDALANUVCHINING 1-TALABI
                      ======================================================== */}
                  {productViewMode === 'TABLE' ? (
                    filteredWarehouseProducts.length > 0 ? (
                      <div style={{ width: '100%', overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', textAlign: 'left', tableLayout: 'auto' }}>
                          <thead>
                            <tr style={{ background: '#002d62', color: '#ffffff', textTransform: 'uppercase', fontSize: '10.5px', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
                              <th style={{ padding: '8px 6px', width: '32px', textAlign: 'center' }}>№</th>
                              <th style={{ padding: '8px 8px' }}>Yuk (Partiya) Nomi</th>
                              <th style={{ padding: '8px 8px' }}>Sektor</th>
                              <th style={{ padding: '8px 8px' }}>To&apos;lovchi (Mijoz) & STIR</th>
                              <th style={{ padding: '8px 8px', textAlign: 'right' }}>Qoldiq & Og&apos;irligi</th>
                              <th style={{ padding: '8px 8px' }}>Kirim Sanasi & Mas&apos;ul</th>
                              <th style={{ padding: '8px 6px', textAlign: 'center' }}>Muddati</th>
                              <th style={{ padding: '8px 8px' }}>Saqlash Tarifi (2-rasm)</th>
                              <th style={{ padding: '8px 8px' }}>Tushirish Xizmati</th>
                              <th style={{ padding: '8px 6px', textAlign: 'center', width: '130px' }}>Amallar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredWarehouseProducts.map((prod, idx) => {
                              const daysStored = calculateDaysStored(prod.entryDate);
                              const targetSec = warehouse.sectors.find(s => s.id === prod.sectorId);
                              const canExitThis = canStockMovement && checkSectorAccess(targetSec || null, currentUser).allowed;
                              const matchedPayer = payers.find(p => p.id === prod.payerId || p.name.toLowerCase() === prod.clientName?.toLowerCase());

                              return (
                                <tr
                                  key={prod.id}
                                  style={{
                                    borderBottom: '1px solid #f1f5f9',
                                    background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                                    transition: 'background 0.15s'
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#f8fafc'}
                                >
                                  {/* № */}
                                  <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>
                                    {idx + 1}
                                  </td>

                                  {/* Yuk (Partiya) nomi */}
                                  <td style={{ padding: '8px 8px' }}>
                                    <div
                                      onClick={() => setSelectedProductHistory(prod)}
                                      style={{ fontWeight: 800, color: '#002d62', cursor: 'pointer', textDecoration: 'underline', fontSize: '12px' }}
                                      title="Yuk tarixi va invoyslarni ochish uchun bosing"
                                    >
                                      📦 {prod.name}
                                    </div>
                                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                      <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                                        {prod.category || 'Umumiy'}
                                      </span>
                                      {prod.notes && <span>• {prod.notes}</span>}
                                    </div>
                                  </td>

                                  {/* Sektor */}
                                  <td style={{ padding: '8px 8px' }}>
                                    <strong style={{ color: '#0284c7', display: 'block', fontSize: '12px' }}>{prod.sectorName}</strong>
                                    {targetSec?.temperature && (
                                      <span style={{ fontSize: '10.5px', color: '#059669', fontWeight: 600 }}>
                                        {targetSec.temperature}
                                      </span>
                                    )}
                                  </td>

                                  {/* To'lovchi & STIR */}
                                  <td style={{ padding: '8px 8px' }}>
                                    <strong style={{ color: '#0f172a', display: 'block', fontSize: '12px' }}>
                                      🏢 {prod.clientName || "Noma'lum mijoz"}
                                    </strong>
                                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '1px' }}>
                                      STIR: <code style={{ color: '#0284c7', background: '#eff6ff', padding: '1px 3px', borderRadius: '3px' }}>{matchedPayer?.inn || '308942115'}</code>
                                    </div>
                                    {prod.contractNumber && (
                                      <div style={{ fontSize: '10px', color: '#64748b' }}>
                                        №{prod.contractNumber}
                                      </div>
                                    )}
                                  </td>

                                  {/* Qoldiq & Og'irligi (Jamlandi) */}
                                  <td style={{ padding: '8px 8px', textAlign: 'right' }}>
                                    <strong style={{ color: '#1d4ed8', fontSize: '12.5px', display: 'block' }}>
                                      {prod.quantity.toLocaleString('uz-UZ')} {prod.unit}
                                    </strong>
                                    <div style={{ color: '#059669', fontSize: '11px', fontWeight: 700, marginTop: '1px' }}>
                                      ⚖️ {(prod.weightKg || prod.quantity).toLocaleString('uz-UZ')} kg
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                                      Dastlabki: {(prod.initialQuantity || prod.quantity).toLocaleString('uz-UZ')} {prod.unit}
                                    </div>
                                  </td>

                                  {/* Kirim sanasi & Mas'ul */}
                                  <td style={{ padding: '8px 8px', whiteSpace: 'nowrap' }}>
                                    <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '11.5px' }}>
                                      📅 {prod.entryDate}
                                    </div>
                                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '1px' }}>
                                      👤 {prod.placedBy}
                                    </div>
                                  </td>

                                  {/* Saqlanish muddati */}
                                  <td style={{ padding: '8px 6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                    <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '2px 6px', borderRadius: '5px', fontWeight: 800, fontSize: '11px', display: 'inline-block' }}>
                                      ⏱️ {daysStored} kun
                                    </span>
                                  </td>

                                  {/* Saqlash Tarifi (2-rasm: 10-19) */}
                                  <td style={{ padding: '8px 8px' }}>
                                    <strong style={{ color: '#047857', fontSize: '11.5px', display: 'block' }}>
                                      ❄️ {prod.storageTariffItemNo ? `№${prod.storageTariffItemNo}: ` : ''}{prod.storageTariffName || 'Preyskurant'}
                                    </strong>
                                    {prod.storageTariffRate && (
                                      <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '1px' }}>
                                        {prod.storageTariffRate.toLocaleString('uz-UZ')} UZS ({prod.storageTariffUnit || 'kunlik'})
                                      </div>
                                    )}
                                  </td>

                                  {/* Tushirish xizmati */}
                                  <td style={{ padding: '8px 8px' }}>
                                    <span style={{ color: '#0369a1', fontSize: '11px', fontWeight: 600, display: 'block' }}>
                                      🚛 {prod.obrabotkaService || 'Yuk tushirish (Разгрузка)'}
                                    </span>
                                  </td>

                                  {/* Amallar */}
                                  <td style={{ padding: '8px 6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedProductHistory(prod)}
                                        style={{
                                          background: '#eff6ff',
                                          border: '1px solid #bfdbfe',
                                          color: '#1d4ed8',
                                          borderRadius: '5px',
                                          padding: '4px 7px',
                                          fontSize: '11px',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '3px'
                                        }}
                                        title="Yuk hayotiy tarixi va barcha nakladnoylarini ko'rish"
                                      >
                                        <span>📜</span>
                                        <span>Tarix</span>
                                      </button>

                                      {canExitThis && (
                                          <button
                                            type="button"
                                            onClick={() => handleOpenExitModalForProduct(prod)}
                                            style={{
                                            background: '#fff5f5',
                                            border: '1px solid #fca5a5',
                                            color: '#dc2626',
                                            borderRadius: '5px',
                                            padding: '4px 7px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '3px'
                                          }}
                                          title="Ombordan yuk chiqarish va rasmiy chiqim nakladnoyi shakllantirish"
                                        >
                                          <span>📤</span>
                                          <span>Chiqim</span>
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px 20px', border: '1.5px dashed #cbd5e1', borderRadius: '10px', color: '#64748b' }}>
                        <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>🔍</span>
                        <h4 style={{ fontSize: '15px', color: '#0f172a', margin: '0 0 4px 0' }}>
                          Hech qanday yuk topilmadi
                        </h4>
                        <p style={{ fontSize: '12px', margin: 0 }}>
                          Kiritilgan qidiruv yoki tanlangan sektor bo&apos;yicha omborda tovar mavjud emas.
                        </p>
                      </div>
                    )
                  ) : (
                    /* KARTA KO'RINISHI (CARDS VIEW) */
                    filteredWarehouseProducts.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredWarehouseProducts.map(prod => {
                          const daysStored = calculateDaysStored(prod.entryDate);
                          const targetSec = warehouse.sectors.find(s => s.id === prod.sectorId);
                          const canExitThis = canStockMovement && checkSectorAccess(targetSec || null, currentUser).allowed;

                          return (
                            <div
                              key={prod.id}
                              style={{
                                border: '1px solid #e2e8f0',
                                borderRadius: '10px',
                                padding: '14px 16px',
                                background: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h4
                                      onClick={() => setSelectedProductHistory(prod)}
                                      style={{ fontSize: '16px', fontWeight: 900, color: '#002d62', margin: 0, cursor: 'pointer', textDecoration: 'underline' }}
                                      title="Yuk tarixi va barcha nakladnoylarini ko'rish uchun bosing"
                                    >
                                      📦 {prod.name}
                                    </h4>
                                    <span style={{ fontSize: '10px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                      {prod.sectorName}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#64748b', flexWrap: 'wrap', marginTop: '3px' }}>
                                    <span>Mijoz: <strong style={{ color: '#334155' }}>{prod.clientName || 'Ichki zaxira'}</strong></span>
                                    <span>•</span>
                                    <span>Kategoriya: <strong>{prod.category || 'Umumiy'}</strong></span>
                                  </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#1d4ed8' }}>
                                    {prod.quantity.toLocaleString('uz-UZ')} {prod.unit}
                                  </div>
                                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#059669', marginTop: '1px' }}>
                                    ⚖️ {(prod.weightKg || prod.quantity).toLocaleString('uz-UZ')} kg
                                  </div>
                                </div>
                              </div>

                              <div style={{ margin: '12px 0', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px', fontSize: '12px' }}>
                                <div>
                                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>📅 Kirim Qilingan Sana:</span>
                                  <strong style={{ color: '#0f172a' }}>{prod.entryDate} • {prod.entryTime}</strong>
                                </div>
                                <div>
                                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>👤 Mas&apos;ul Xodim:</span>
                                  <strong style={{ color: '#002d62' }}>{prod.placedBy}</strong>
                                </div>
                                <div>
                                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>🚛 Tushirish Usuli:</span>
                                  <strong style={{ color: '#0284c7' }}>{prod.obrabotkaService || 'Yuk tushirish (Разгрузка)'}</strong>
                                </div>
                                <div>
                                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>⏱️ Saqlanish Muddati:</span>
                                  <strong style={{ color: '#059669' }}>{daysStored} kundan beri</strong>
                                </div>
                                <div>
                                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>❄️ Saqlash Tarifi (2-rasm):</span>
                                  <strong style={{ color: '#047857' }}>
                                    {prod.storageTariffItemNo ? `№${prod.storageTariffItemNo}: ` : ''}{prod.storageTariffName || 'Preyskurant'}
                                  </strong>
                                </div>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f8fafc', flexWrap: 'wrap', gap: '8px' }}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedProductHistory(prod)}
                                  className="btn-outline"
                                  style={{ borderColor: '#bfdbfe', color: '#1d4ed8', background: '#eff6ff', fontWeight: 700, fontSize: '12px', padding: '6px 12px' }}
                                >
                                  {canViewFinances ? '📜 Tarix & Nakladnoylar (Invoyslar)' : '📜 Yukning Harakat Tarixi'}
                                </button>
                                {canExitThis && (
                                  <button
                                    onClick={() => handleOpenExitModalForProduct(prod)}
                                    className="btn-outline"
                                    style={{ borderColor: '#fca5a5', color: '#dc2626', background: '#fff5f5', fontWeight: 700, fontSize: '12px', padding: '6px 14px' }}
                                  >
                                    📤 Ombordan Chiqarish & Tarifni Hisoblash
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px 20px', border: '1.5px dashed #cbd5e1', borderRadius: '10px', color: '#64748b' }}>
                        <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📭</span>
                        <h4 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>Ushbu mezon bo&apos;yicha yuk topilmadi</h4>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            2-BO'LIM: DASHBOARD (Chart va Tarix)
            ======================================================== */}
        {(activeMenu === 'history' || activeMenu === 'dashboard') && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div className="mini-card">
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Jami Mahsulotlar</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
                  {storedProducts.length} xil partiya
                </div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{warehouse.name}</span>
              </div>

              <div className="mini-card">
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Faol Sektorlar</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb', margin: '6px 0 2px 0' }}>
                  {warehouse.sectors.length} ta sektor
                </div>
                <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700 }}>A, B, C, D, E, F Sektorlar (17 593 m²)</span>
              </div>

              <div className="mini-card">
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Boshqaruv Tizimi</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669', margin: '6px 0 2px 0' }}>
                  Kunlik Hisob-kitob
                </div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Miqdor × Kunlik narx × Kunlar</span>
              </div>
            </div>

            {/* CHART */}
            <div className="mini-card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    📈 Ombordagi Kirib Chiqqan Yuklar Miqdori Statistikasi (Haftalik)
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Kirim va chiqim amallari dinamikasi</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10b981' }}></span>
                    <span>Kirim</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#ef4444' }}></span>
                    <span>Chiqim</span>
                  </div>
                </div>
              </div>

              <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '20px', borderBottom: '1px solid #e2e8f0', gap: '12px' }}>
                {chartData.days.map((d, idx) => {
                  const inHeight = Math.max(6, (d.inCount / chartData.maxCount) * 150);
                  const outHeight = Math.max(6, (d.outCount / chartData.maxCount) * 150);

                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '150px', width: '100%', justifyContent: 'center' }}>
                        <div title={`Kirim: ${d.inCount}`} style={{ width: '40%', maxWidth: '26px', height: `${inHeight}px`, background: '#10b981', borderRadius: '4px 4px 0 0' }} />
                        <div title={`Chiqim: ${d.outCount}`} style={{ width: '40%', maxWidth: '26px', height: `${outHeight}px`, background: '#ef4444', borderRadius: '4px 4px 0 0' }} />
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{d.displayDate}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Barcha Kirim-Chiqim Harakatlari va To'liq Tarix Jurnali (Foydalanuvchi talabi) */}
            <div className="mini-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#002d62', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📜</span>
                    <span>Barcha Yuklar Harakati, Kirim va Chiqim Tarixi</span>
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Kim qabul qilgan, kim qancha chiqargan, qabul qiluvchi INN va barcha rasmiy ma&apos;lumotlar to&apos;liq arxivi
                  </span>
                </div>

                {/* Qidiruv va Filtrlar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="🔍 Tovar, korxona, INN yoki xodim..."
                    className="form-input-clean"
                    style={{ width: '220px', padding: '6px 12px', fontSize: '12px' }}
                    value={historySearch}
                    onChange={e => setHistorySearch(e.target.value)}
                  />

                  <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', gap: '2px' }}>
                    <button
                      type="button"
                      onClick={() => setHistoryFilter('ALL')}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '6px',
                        background: historyFilter === 'ALL' ? '#ffffff' : 'transparent',
                        color: historyFilter === 'ALL' ? '#0f172a' : '#64748b',
                        boxShadow: historyFilter === 'ALL' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      Barchasi
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryFilter('IN')}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '6px',
                        background: historyFilter === 'IN' ? '#ecfdf5' : 'transparent',
                        color: historyFilter === 'IN' ? '#059669' : '#64748b'
                      }}
                    >
                      📥 Kirimlar
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryFilter('OUT')}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '6px',
                        background: historyFilter === 'OUT' ? '#fef2f2' : 'transparent',
                        color: historyFilter === 'OUT' ? '#dc2626' : '#64748b'
                      }}
                    >
                      📤 Chiqimlar
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1', textAlign: 'left', color: '#475569', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 12px' }}>Amal</th>
                      <th style={{ padding: '10px 12px' }}>Yuk Nomi & Sektor</th>
                      <th style={{ padding: '10px 12px' }}>Kim Qabul Qilgan (Kirim)</th>
                      <th style={{ padding: '10px 12px' }}>Kim Chiqargan (Chiqim)</th>
                      <th style={{ padding: '10px 12px' }}>
                        {isUser ? 'Qabul qiluvchi' : 'Yuk Berilgan Tarafi & INN'}
                      </th>
                      <th style={{ padding: '10px 12px' }}>Miqdor & Og&apos;irlik</th>
                      <th style={{ padding: '10px 12px' }}>To&apos;lov</th>
                      <th style={{ padding: '10px 12px' }}>Sana & Vaqt</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>
                        {canViewFinances ? 'Hujjat / Nakladnoy' : 'Holati'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements
                      .filter(m => {
                        if (historyFilter === 'IN' && m.type !== 'IN') return false;
                        if (historyFilter === 'OUT' && m.type !== 'OUT') return false;
                        if (historySearch.trim()) {
                          const q = historySearch.toLowerCase();
                          const matchProd = m.productName.toLowerCase().includes(q);
                          const matchClient = (m.clientName || '').toLowerCase().includes(q);
                          const matchReceiver = (m.receiverName || '').toLowerCase().includes(q);
                          const matchInn = (m.receiverInn || '').includes(q);
                          const matchUser = m.userName.toLowerCase().includes(q);
                          return matchProd || matchClient || matchReceiver || matchInn || matchUser;
                        }
                        return true;
                      })
                      .map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', background: m.type === 'IN' ? '#fafdfb' : '#fffbfb' }}>
                        {/* Amal Turi */}
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, background: m.type === 'IN' ? '#dcfce7' : '#fee2e2', color: m.type === 'IN' ? '#15803d' : '#b91c1c' }}>
                            {m.type === 'IN' ? '📥 KIRIM' : '📤 CHIQIM'}
                          </span>
                        </td>

                        {/* Yuk Nomi & Sektor */}
                        <td style={{ padding: '10px 12px' }}>
                          <strong style={{ color: '#002d62', fontSize: '13px', display: 'block' }}>{m.productName}</strong>
                          <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Sklad: {m.sectorName}</span>
                          {m.notes && <div style={{ fontSize: '10px', color: '#94a3b8' }}>{m.notes}</div>}
                        </td>

                        {/* Kim Qabul Qilgan (Kirim xodimi) */}
                        <td style={{ padding: '10px 12px', color: '#1e293b' }}>
                          {m.type === 'IN' ? (
                            <div>
                              <strong style={{ color: '#047857', display: 'block' }}>👤 {m.userName}</strong>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>({m.userRole})</span>
                              {m.transportType && <span style={{ display: 'block', fontSize: '10px', color: '#0284c7', fontWeight: 600 }}>🚛 Kelgan: {m.transportType}</span>}
                            </div>
                          ) : (
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              <span>Dastlabki: </span>
                              <strong style={{ color: '#334155' }}>{m.placedBy || 'Omborchi'}</strong>
                            </div>
                          )}
                        </td>

                        {/* Kim Chiqargan (Chiqim xodimi) */}
                        <td style={{ padding: '10px 12px' }}>
                          {m.type === 'OUT' ? (
                            <div>
                              <strong style={{ color: '#b91c1c', display: 'block' }}>📤 {m.userName}</strong>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>({m.userRole})</span>
                              {(m.loadingType || m.transportType) && (
                                <span style={{ display: 'block', fontSize: '10px', color: '#b91c1c', fontWeight: 600 }}>
                                  🚛 Ortish: {m.loadingType || m.transportType}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>—</span>
                          )}
                        </td>

                        {/* Yuk Berilgan Tarafi & INN (Userda qabul qiluvchi STIR / maxfiy rekvizitlari ko'rinmaydi) */}
                        <td style={{ padding: '10px 12px' }}>
                          {isUser ? (
                            <span style={{ color: '#94a3b8', fontSize: '11px', fontStyle: 'italic' }}>
                              🔒 Maxfiy
                            </span>
                          ) : m.type === 'OUT' ? (
                            <div>
                              <strong style={{ color: '#0f172a', display: 'block', fontSize: '12px' }}>
                                🏢 {m.receiverName || m.clientName || "Noma'lum Korxona"}
                              </strong>
                              <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>
                                INN: <code>{m.receiverInn || (payers.find(p => p.name === (m.receiverName || m.clientName))?.inn) || '308942115'}</code>
                              </div>
                              {m.receiverPerson && (
                                <span style={{ display: 'block', fontSize: '10px', color: '#475569' }}>
                                  Vakil: {m.receiverPerson}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div>
                              <span style={{ color: '#64748b', fontSize: '11px' }}>Mijoz (Egasi):</span>
                              <strong style={{ display: 'block', color: '#0f172a' }}>{m.clientName || "Noma'lum"}</strong>
                            </div>
                          )}
                        </td>

                        {/* Miqdor va Og'irlik */}
                        <td style={{ padding: '10px 12px' }}>
                          <strong style={{ color: '#0f172a', fontSize: '13px', display: 'block' }}>
                            {m.quantity.toLocaleString('uz-UZ')} {m.unit}
                          </strong>
                          {m.weightKg && (
                            <span style={{ color: '#059669', fontWeight: 700, fontSize: '11px', display: 'block' }}>
                              ⚖️ {m.weightKg.toLocaleString('uz-UZ')} kg
                            </span>
                          )}
                          {m.remainingQuantity !== undefined && (
                            <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>
                              Qoldiq: {m.remainingQuantity} {m.unit} ({m.remainingWeightKg || 0} kg)
                            </span>
                          )}
                        </td>

                        {/* Hisoblangan To'lov */}
                        <td style={{ padding: '10px 12px' }}>
                          {!canViewFinances ? (
                            <span style={{ color: '#94a3b8', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>🔒</span> Yashirin
                            </span>
                          ) : (m.grandTotalUZS || m.totalCostUZS) ? (
                            <div>
                              <strong style={{ color: m.type === 'IN' ? '#0284c7' : '#15803d', fontSize: '13px', display: 'block' }}>
                                {(m.grandTotalUZS || m.totalCostUZS || 0).toLocaleString('uz-UZ')} UZS
                              </strong>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>
                                {m.type === 'IN' ? 'Tushirish (Разгрузка)' : `Saqlash (${m.daysStored || 1} kun) + Ortish`}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>-</span>
                          )}
                        </td>

                        {/* Sana & Vaqt */}
                        <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '11px' }}>
                          <strong>{m.date}</strong>
                          <span style={{ display: 'block', color: '#94a3b8' }}>{m.time}</span>
                        </td>

                        {/* Hujjat / Amal: Userda nakladnoy ko'rinmaydi, faqat moliya ruxsati bo'lganlarda ko'rinadi */}
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          {m.type === 'OUT' ? (
                            canViewFinances ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProductHistory(null);
                                  setSelectedInvoiceMovement(m);
                                }}
                                className="btn-outline"
                                style={{
                                  fontSize: '11px',
                                  padding: '5px 10px',
                                  color: '#b91c1c',
                                  borderColor: '#fca5a5',
                                  background: '#fef2f2',
                                  fontWeight: 800,
                                  borderRadius: '6px'
                                }}
                                title="Chiqim Nakladnoyini ko'rish va chop etish"
                              >
                                🧾 Chiqim Nakladnoyi
                              </button>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#b91c1c', background: '#fef2f2', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                📤 Chiqarilgan
                              </span>
                            )
                          ) : (
                            <span style={{ fontSize: '11px', color: '#047857', background: '#ecfdf5', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                              ✅ Qabul Tarixi
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        
        {/* ========================================================
            3-BO'LIM: YUK TO'LOVCHILARI VA SHARTNOMALAR (FOYDALANUVCHI TALABI)
            - User ko'ra olmaydi va yangi qo'sha olmaydi
            ======================================================== */}
        {activeMenu === 'payers' && !isUser && (
          <div>
            {/* Sarlavha va Yangi Shartnoma Qo'shish */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '26px' }}>🤝</span>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#002d62', margin: 0, letterSpacing: '-0.01em' }}>
                      Yuk To&apos;lovchilari va Shartnomalar Reestri
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                      Bojxona ombori bilan rasmiy saqlash shartnomasi tuzgan mijozlar. Shartnoma muddati tugagan to&apos;lovchilarning tovarlarini chiqarish tizim tomonidan avtomatik bloklanadi.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenNewPayer}
                className="btn-primary"
                style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>➕</span>
                <span>Yangi Shartnoma Tuzish</span>
              </button>
            </div>

            {/* Statistika Kartochkalari */}
            {(() => {
              const todayStr = new Date().toISOString().slice(0, 10);
              const activeCount = payers.filter(p => !p.contractEndDate || p.contractEndDate >= todayStr).length;
              const expiredCount = payers.filter(p => p.contractEndDate && p.contractEndDate < todayStr).length;

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div className="mini-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Jami Shartnomalar</span>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#002d62', margin: '4px 0 2px 0' }}>
                      {payers.length} ta
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Ro&apos;yxatga olingan to&apos;lovchi korxonalar</span>
                  </div>

                  <div className="mini-card" style={{ background: '#f0fdf4', border: '1.5px solid #86efac' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>🟢 Amaldagi Shartnomalar</span>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#15803d', margin: '4px 0 2px 0' }}>
                      {activeCount} ta
                    </div>
                    <span style={{ fontSize: '12px', color: '#166534' }}>To&apos;lov va ombor amallariga ruxsat bor</span>
                  </div>

                  <div className="mini-card" style={{ background: '#fef2f2', border: '1.5px solid #fca5a5' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>⛔ Muddati Tugagan Shartnomalar</span>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#dc2626', margin: '4px 0 2px 0' }}>
                      {expiredCount} ta
                    </div>
                    <span style={{ fontSize: '12px', color: '#b91c1c' }}>To&apos;lov va chiqim avtomatik bloklangan</span>
                  </div>
                </div>
              );
            })()}

            {/* Shartnomalar Jadvali */}
            <div className="mini-card" style={{ background: '#ffffff', padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>📋 Shartnoma Tuzgan Mijozlar Ro&apos;yxati</strong>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Sana formati: YYYY-MM-DD</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #cbd5e1', color: '#475569', fontSize: '11px', textTransform: 'uppercase', textAlign: 'left' }}>
                      <th style={{ padding: '12px 14px', width: '40px', textAlign: 'center' }}>№</th>
                      <th style={{ padding: '12px 14px' }}>To&apos;lovchi Korxona & STIR</th>
                      <th style={{ padding: '12px 14px' }}>Shartnoma Raqami</th>
                      <th style={{ padding: '12px 14px' }}>Tuzilgan Sana</th>
                      <th style={{ padding: '12px 14px' }}>Amal Qilish Muddati (Qachongacha)</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center' }}>Shartnoma Holati</th>
                      <th style={{ padding: '12px 14px' }}>Mas&apos;ul Vakil & Telefon</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center' }}>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payers.map((p, idx) => {
                      const todayStr = new Date().toISOString().slice(0, 10);
                      const isExpired = Boolean(p.contractEndDate && p.contractEndDate < todayStr);

                      return (
                        <tr
                          key={p.id}
                          style={{
                            borderBottom: '1px solid #e2e8f0',
                            background: isExpired ? '#fffbfb' : '#ffffff',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>
                            {idx + 1}
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <strong style={{ color: '#002d62', fontSize: '14px', display: 'block' }}>
                              {p.name}
                            </strong>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              STIR (INN): <strong>{p.inn}</strong>
                              {p.notes && ` • ${p.notes}`}
                            </span>
                          </td>

                          <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>
                            <code>{p.contractNumber}</code>
                          </td>

                          <td style={{ padding: '12px 14px', color: '#475569', fontSize: '12px' }}>
                            📅 {p.contractStartDate}
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 800, color: isExpired ? '#dc2626' : '#15803d' }}>
                                📅 {p.contractEndDate}
                              </span>
                            </div>
                            <span style={{ fontSize: '10px', color: isExpired ? '#b91c1c' : '#166534', fontWeight: 600 }}>
                              {isExpired ? "Muddati o'tgan!" : "Amal qilish muddati ichida"}
                            </span>
                          </td>

                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            {isExpired ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                                <span>⛔</span>
                                <span>Muddati Tugagan (Bloklangan)</span>
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                                <span>🟢</span>
                                <span>Shartnoma Faol</span>
                              </span>
                            )}
                          </td>

                          <td style={{ padding: '12px 14px', fontSize: '12px' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.contactPerson}</div>
                            <div style={{ color: '#0284c7', fontSize: '11px' }}>📞 {p.phone}</div>
                          </td>

                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditPayer(p)}
                                className="btn-outline"
                                style={{
                                  fontSize: '11px',
                                  padding: '5px 10px',
                                  borderColor: isExpired ? '#fca5a5' : '#bfdbfe',
                                  color: isExpired ? '#dc2626' : '#002d62',
                                  background: isExpired ? '#fef2f2' : '#eff6ff',
                                  fontWeight: 700
                                }}
                                title="Shartnoma muddatini uzaytirish yoki o'zgartirish"
                              >
                                {isExpired ? '⚡ Muddatni Uzaytirish' : '✏️ Tahrirlash'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeletePayer(p.id, p.name)}
                                className="btn-outline"
                                style={{
                                  fontSize: '11px',
                                  padding: '5px 8px',
                                  borderColor: '#fca5a5',
                                  color: '#dc2626'
                                }}
                                title="O'chirish"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Foydalanuvchiga qoidalar eslatmasi */}
            <div style={{ marginTop: '16px', padding: '14px 18px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '22px' }}>ℹ️</span>
              <div style={{ fontSize: '12px', color: '#1e40af', lineHeight: 1.5 }}>
                <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Shartnoma muddati va chiqim qoidasi:</strong>
                Agar to&apos;lovchining shartnoma muddati tugagan bo&apos;lsa, omborchi ushbu mijozning tovarlarini chiqim qila olmaydi (Chiqim modali qizil ogohlantirish beradi va tasdiqlash bloklanadi).
                Tovarni chiqarish va to&apos;lovni amalga oshirish uchun avval <strong>«Muddatni Uzaytirish»</strong> tugmasi orqali yangi muddatni kiritib saqlang.
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'payers' && isUser && (
          <div style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '20px 0' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🔒</span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>Ruxsat Cheklangan</h3>
            <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
              Sizning xodim profilingizda (User) to&apos;lovchilar va qabul qiluvchilar reestrini ko&apos;rish yoki yangi qo&apos;shish huquqi mavjud emas. Ushbu bo&apos;lim faqat ma&apos;muriyat va buxgalteriya uchun ochiq.
            </p>
          </div>
        )}

        {/* ========================================================
            4-BO'LIM: BUXGALTERIYA & CHIQIMLAR HISOBOTI MARKAZI
            - Kunlik va Oylik chiqimlar hisoboti
            - Kim qancha chiqardi (Xodimlar kesimida)
            - Kim qancha to'lashi kerak (Mijozlar kesimida)
            - Har bir chiqim bo'yicha to'liq narx va invoys (dalolatnoma)
            ======================================================== */}
        {activeMenu === 'accounting' && (
          <div className="accounting-print-container">
            {/* Rasmiy A4 Pechat Sarlavhasi (Faqat chop etishda ko'rinadi) */}
            <div className="accounting-official-print-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/jb-logo.jpg" alt="JB GROUP" style={{ height: '42px', width: 'auto', borderRadius: '4px' }} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f2b48', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                      «JB GROUP» MCHJ BOJXONA VA OMBORXONA LOGISTIKA MAJMUASI
                    </div>
                    <div style={{ fontSize: '10px', color: '#475569', fontWeight: 600 }}>
                      Bojxona ombori litsenziyasi: № BO-77401/24 • Toshkent viloyati, Yangiyo&apos;l tumani • Tel: +998 (71) 200-88-44
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>
                    Moliya & Buxgalteriya Departamenti
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#64748b' }}>
                    Chop etildi: {new Date().toLocaleDateString('uz-UZ')} {new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#0f2b48' }}>
                    MOLIYA VA CHIQIMLAR RASMIY HISOBOTI
                  </span>
                  <span style={{ fontSize: '11px', color: '#475569', marginLeft: '12px' }}>
                    Davr: <strong>{
                      accountingPeriod === 'TODAY' ? 'Bugun (Kunlik)' :
                      accountingPeriod === 'YESTERDAY' ? 'Kecha' :
                      accountingPeriod === 'THIS_MONTH' ? `${accountingMonth} (Joriy oy)` :
                      accountingPeriod === 'LAST_MONTH' ? `${accountingMonth} (O'tgan oy)` :
                      accountingPeriod === 'CUSTOM' ? `${accountingDateFrom || '...'} dan ${accountingDateTo || '...'} gacha` :
                      'Barcha vaqt (1 Yillik Tarix)'
                    }</strong>
                  </span>
                </div>
                <div style={{ fontSize: '10.5px', color: '#334155' }}>
                  Mas&apos;ul: <strong>{currentUser.fullName}</strong> ({currentUser.role})
                </div>
              </div>
            </div>

            {/* 1. Sarlavha va Eksport/Chop etish tugmalari */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#faf5ff', border: '1.5px solid #d8b4fe', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  💼
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f2b48', margin: 0, letterSpacing: '-0.01em' }}>
                      Buxgalteriya & Chiqimlar Hisoboti Markazi
                    </h2>
                    <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: '#faf5ff', color: '#7e22ce', border: '1px solid #d8b4fe' }}>
                      JB GROUP Moliya
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '3px 0 0 0' }}>
                    Kunlik va oylik chiqimlar, to&apos;lovlar, xodimlar bajargan amallar va qarzdorliklar to&apos;liq tahlili.
                  </p>
                </div>
              </div>

              <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn-outline"
                  style={{ fontSize: '12.5px', padding: '8px 14px', background: '#ffffff' }}
                >
                  <span>🖨️ Hisobotni Chop Etish</span>
                </button>
                <button
                  onClick={exportAccountingToCSV}
                  className="btn-primary"
                  style={{ background: '#7e22ce', borderColor: '#6b21a8', fontSize: '12.5px', padding: '8px 16px' }}
                >
                  <span>📥 Excel (CSV) Yuklash</span>
                </button>
              </div>
            </div>

            {/* 2. Asosiy 4 ta KPI Xulosa Kartalari */}
            <div className="accounting-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '22px' }}>
              {/* Karta 1: Kunlik Chiqimlar (Bugun) */}
              <div className="mini-card accounting-kpi-card" style={{ background: '#ffffff', border: '1.5px solid #e0e7ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    📅 Bugungi Chiqimlar (Kunlik)
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#e0e7ff', color: '#3730a3' }}>
                    Bugun
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>
                    {accountingStats.todayCount} ta
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>
                    ({accountingStats.todayWeightKg.toLocaleString('uz-UZ')} kg)
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  Bugungi jami to&apos;lov: <strong style={{ color: '#4338ca' }}>{accountingStats.todayGrandTotalUZS.toLocaleString('uz-UZ')} UZS</strong>
                </div>
              </div>

              {/* Karta 2: Tanlangan Davr Chiqimlari */}
              <div className="mini-card accounting-kpi-card" style={{ background: '#ffffff', border: '1.5px solid #dbeafe' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    📊 Davr Chiqimlari (Jami)
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#dbeafe', color: '#1e40af' }}>
                    {accountingPeriod === 'TODAY' ? 'Bugun' : accountingPeriod === 'YESTERDAY' ? 'Kecha' : accountingPeriod === 'THIS_MONTH' ? accountingMonth : 'Filtrlangan'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>
                    {accountingStats.totalCount} ta
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>
                    ({(accountingStats.totalWeightKg / 1000).toFixed(2)} tn)
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  Saqlash: <strong>{accountingStats.totalStorageUZS.toLocaleString('uz-UZ')} UZS</strong> • Ortish/Tushirish: <strong>{(accountingStats.totalUnloadingUZS + accountingStats.totalLoadingUZS).toLocaleString('uz-UZ')} UZS</strong>
                </div>
              </div>

              {/* Karta 3: Jami Undirilishi Kerak To'lov */}
              <div className="mini-card accounting-kpi-card" style={{ background: '#ffffff', border: '1.5px solid #fae8ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#a21caf', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    💰 Jami To&apos;lanishi Kerak (QQS bilan)
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#fae8ff', color: '#86198f' }}>
                    Grand Total
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#7e22ce' }}>
                    {accountingStats.grandTotalUZS.toLocaleString('uz-UZ')}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#9333ea' }}>UZS</span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  QQS 12%: <strong>{accountingStats.totalVatUZS.toLocaleString('uz-UZ')} UZS</strong> • Bazaviy: <strong>{(accountingStats.grandTotalUZS - accountingStats.totalVatUZS).toLocaleString('uz-UZ')} UZS</strong>
                </div>
              </div>

              {/* Karta 4: To'lovlar Holati & Qarzdorlik */}
              <div className="mini-card accounting-kpi-card" style={{ background: '#ffffff', border: '1.5px solid #dcfce7' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    💳 To&apos;lovlar & Qarzdorlik
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#dcfce7', color: '#166534' }}>
                    Status
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#15803d' }}>
                    ✅ {accountingStats.paidTotalUZS.toLocaleString('uz-UZ')} UZS
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#dc2626', paddingTop: '8px', borderTop: '1px solid #f1f5f9', fontWeight: 700 }}>
                  ⏳ Qarzdorlik (Kutilmoqda): {accountingStats.pendingTotalUZS.toLocaleString('uz-UZ')} UZS
                </div>
              </div>
            </div>

            {/* 3. Filtrlash va Saralash Paneli */}
            <div className="mini-card no-print" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '20px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginRight: '6px' }}>
                    ⏱️ Tezkor Davr:
                  </span>
                  <button
                    onClick={() => setAccountingPeriod('TODAY')}
                    className="btn-outline"
                    style={{
                      fontSize: '12px',
                      padding: '5px 12px',
                      background: accountingPeriod === 'TODAY' ? '#4338ca' : '#ffffff',
                      color: accountingPeriod === 'TODAY' ? '#ffffff' : '#334155',
                      borderColor: accountingPeriod === 'TODAY' ? '#4338ca' : '#cbd5e1'
                    }}
                  >
                    📌 Bugun (Kunlik)
                  </button>
                  <button
                    onClick={() => setAccountingPeriod('YESTERDAY')}
                    className="btn-outline"
                    style={{
                      fontSize: '12px',
                      padding: '5px 12px',
                      background: accountingPeriod === 'YESTERDAY' ? '#4338ca' : '#ffffff',
                      color: accountingPeriod === 'YESTERDAY' ? '#ffffff' : '#334155',
                      borderColor: accountingPeriod === 'YESTERDAY' ? '#4338ca' : '#cbd5e1'
                    }}
                  >
                    Kecha
                  </button>
                  <button
                    onClick={() => { setAccountingPeriod('THIS_MONTH'); setAccountingMonth('2026-10'); }}
                    className="btn-outline"
                    style={{
                      fontSize: '12px',
                      padding: '5px 12px',
                      background: accountingPeriod === 'THIS_MONTH' ? '#4338ca' : '#ffffff',
                      color: accountingPeriod === 'THIS_MONTH' ? '#ffffff' : '#334155',
                      borderColor: accountingPeriod === 'THIS_MONTH' ? '#4338ca' : '#cbd5e1'
                    }}
                  >
                    📅 Joriy Oy (Oktyabr 2026)
                  </button>
                  <button
                    onClick={() => { setAccountingPeriod('LAST_MONTH'); setAccountingMonth('2026-09'); }}
                    className="btn-outline"
                    style={{
                      fontSize: '12px',
                      padding: '5px 12px',
                      background: accountingPeriod === 'LAST_MONTH' ? '#4338ca' : '#ffffff',
                      color: accountingPeriod === 'LAST_MONTH' ? '#ffffff' : '#334155',
                      borderColor: accountingPeriod === 'LAST_MONTH' ? '#4338ca' : '#cbd5e1'
                    }}
                  >
                    🗓️ O&apos;tgan Oy (Sentyabr 2026)
                  </button>
                  <button
                    onClick={() => setAccountingPeriod('ALL')}
                    className="btn-outline"
                    style={{
                      fontSize: '12px',
                      padding: '5px 12px',
                      background: accountingPeriod === 'ALL' ? '#4338ca' : '#ffffff',
                      color: accountingPeriod === 'ALL' ? '#ffffff' : '#334155',
                      borderColor: accountingPeriod === 'ALL' ? '#4338ca' : '#cbd5e1'
                    }}
                  >
                    Barcha Vaqt
                  </button>
                  <button
                    onClick={() => setAccountingPeriod('CUSTOM')}
                    className="btn-outline"
                    style={{
                      fontSize: '12px',
                      padding: '5px 12px',
                      background: accountingPeriod === 'CUSTOM' ? '#4338ca' : '#ffffff',
                      color: accountingPeriod === 'CUSTOM' ? '#ffffff' : '#334155',
                      borderColor: accountingPeriod === 'CUSTOM' ? '#4338ca' : '#cbd5e1'
                    }}
                  >
                    🔍 Maxsus Oraliq
                  </button>
                </div>

                {/* Tanlangan oy yoki sana oralig'i */}
                {(accountingPeriod === 'THIS_MONTH' || accountingPeriod === 'LAST_MONTH') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>1 Yillik Tarix (Oyni Tanlang):</span>
                    <select
                      value={accountingMonth}
                      onChange={e => {
                        setAccountingMonth(e.target.value);
                        setAccountingPeriod('THIS_MONTH');
                      }}
                      className="form-input-clean"
                      style={{ fontSize: '12px', padding: '5px 10px', fontWeight: 700, background: '#ffffff', borderColor: '#4338ca', color: '#1e1b4b' }}
                    >
                      <option value="2026-10">🗓️ 2026-10 (Oktyabr 2026 - Joriy)</option>
                      <option value="2026-09">🗓️ 2026-09 (Sentyabr 2026)</option>
                      <option value="2026-08">🗓️ 2026-08 (Avgust 2026)</option>
                      <option value="2026-07">🗓️ 2026-07 (Iyul 2026)</option>
                      <option value="2026-06">🗓️ 2026-06 (Iyun 2026)</option>
                      <option value="2026-05">🗓️ 2026-05 (May 2026)</option>
                      <option value="2026-04">🗓️ 2026-04 (Aprel 2026)</option>
                      <option value="2026-03">🗓️ 2026-03 (Mart 2026)</option>
                      <option value="2026-02">🗓️ 2026-02 (Fevral 2026)</option>
                      <option value="2026-01">🗓️ 2026-01 (Yanvar 2026)</option>
                      <option value="2025-12">🗓️ 2025-12 (Dekabr 2025)</option>
                      <option value="2025-11">🗓️ 2025-11 (Noyabr 2025)</option>
                    </select>
                  </div>
                )}

                {accountingPeriod === 'CUSTOM' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Dan:</span>
                    <input
                      type="date"
                      value={accountingDateFrom}
                      onChange={e => setAccountingDateFrom(e.target.value)}
                      className="form-input-clean"
                      style={{ fontSize: '12px', padding: '4px 8px', width: '130px' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Gacha:</span>
                    <input
                      type="date"
                      value={accountingDateTo}
                      onChange={e => setAccountingDateTo(e.target.value)}
                      className="form-input-clean"
                      style={{ fontSize: '12px', padding: '4px 8px', width: '130px' }}
                    />
                  </div>
                )}
              </div>

              {/* Ikkinchi qator filtrlar: Xodim, Mijoz, Status va Qidiruv */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    👤 Chiqargan Xodim:
                  </label>
                  <select
                    value={accountingEmployeeFilter}
                    onChange={e => setAccountingEmployeeFilter(e.target.value)}
                    className="form-select-clean"
                    style={{ fontSize: '12.5px', padding: '7px 10px' }}
                  >
                    <option value="ALL">Barcha xodimlar</option>
                    {Array.from(new Set(allOutMovements.map(m => m.userName).filter(Boolean))).map(uName => (
                      <option key={uName} value={uName}>{uName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    🏢 Mijoz / To&apos;lovchi:
                  </label>
                  <select
                    value={accountingClientFilter}
                    onChange={e => setAccountingClientFilter(e.target.value)}
                    className="form-select-clean"
                    style={{ fontSize: '12.5px', padding: '7px 10px' }}
                  >
                    <option value="ALL">Barcha mijozlar</option>
                    {Array.from(new Set(allOutMovements.map(m => m.clientName || m.receiverName).filter(Boolean))).map(cName => (
                      <option key={cName} value={cName}>{cName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    💳 To&apos;lov Holati:
                  </label>
                  <select
                    value={accountingStatusFilter}
                    onChange={e => setAccountingStatusFilter(e.target.value as any)}
                    className="form-select-clean"
                    style={{ fontSize: '12.5px', padding: '7px 10px' }}
                  >
                    <option value="ALL">Barchasi (To&apos;langan & Qarzdorlik)</option>
                    <option value="PAID">✅ Faqat to&apos;langanlar</option>
                    <option value="PENDING">⏳ Faqat to&apos;lov kutilayotganlar</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    🔍 Qidiruv:
                  </label>
                  <input
                    type="text"
                    placeholder="Hujjat №, mahsulot, STIR..."
                    value={accountingSearch}
                    onChange={e => setAccountingSearch(e.target.value)}
                    className="form-input-clean"
                    style={{ fontSize: '12.5px', padding: '7px 10px' }}
                  />
                </div>
              </div>
            </div>

            {/* 4. Sub-Tab Navigatsiyasi: 3 ta asosiy tahlil ko'rinishi */}
            <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '2px' }}>
              <button
                onClick={() => setAccountingSubView('all_exits')}
                style={{
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  borderBottom: accountingSubView === 'all_exits' ? '3px solid #7e22ce' : '3px solid transparent',
                  color: accountingSubView === 'all_exits' ? '#7e22ce' : '#64748b',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>📋</span>
                <span>1. Har Bir Chiqim Tafsiloti ({filteredOutMovements.length})</span>
              </button>

              <button
                onClick={() => setAccountingSubView('by_employee')}
                style={{
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  borderBottom: accountingSubView === 'by_employee' ? '3px solid #7e22ce' : '3px solid transparent',
                  color: accountingSubView === 'by_employee' ? '#7e22ce' : '#64748b',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>👤</span>
                <span>2. Kim Qancha Chiqim Qildi? ({employeeAnalysis.length} ta xodim)</span>
              </button>

              <button
                onClick={() => setAccountingSubView('by_client')}
                style={{
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  borderBottom: accountingSubView === 'by_client' ? '3px solid #7e22ce' : '3px solid transparent',
                  color: accountingSubView === 'by_client' ? '#7e22ce' : '#64748b',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🏢</span>
                <span>3. Qancha To&apos;lashi Kerak? ({clientAnalysis.length} ta tashkilot)</span>
              </button>
            </div>

            {/* Faol ko'rinish sarlavhasi (faqat chop etishda ko'rinadi) */}
            <div className="accounting-print-subview-title">
              {accountingSubView === 'all_exits' && `1. Chiqim Operatsiyalari Tafsilotlari Jurnali (${filteredOutMovements.length} ta operatsiya)`}
              {accountingSubView === 'by_employee' && `2. Xodimlar Kesimida Chiqimlar Tahlili (${employeeAnalysis.length} ta mas'ul xodim)`}
              {accountingSubView === 'by_client' && `3. Korxonalar & To'lovchilar Kesimida Qarzdorlik Tahlili (${clientAnalysis.length} ta tashkilot)`}
            </div>

            {/* =========================================================
                SUB-VIEW 1: HAR BIR CHIQIM TAFSILOTI JURNALI
                ========================================================= */}
            {accountingSubView === 'all_exits' && (
              <div className="mini-card accounting-print-table-card" style={{ background: '#ffffff', padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="accounting-print-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 800, fontSize: '11.5px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 14px' }}>№ / Hujjat</th>
                        <th style={{ padding: '12px 14px' }}>Sana & Vaqt</th>
                        <th style={{ padding: '12px 14px' }}>Chiqargan Mas&apos;ul</th>
                        <th style={{ padding: '12px 14px' }}>Mahsulot & Sektor</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Chiqarilgan Miqdor</th>
                        <th style={{ padding: '12px 14px' }}>Qabul Qiluvchi & STIR</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Saqlash (Xraneniya)</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Tushirish / Ortish</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Jami To&apos;lov (UZS)</th>
                        <th style={{ padding: '12px 14px', textAlign: 'center' }}>To&apos;lov Holati</th>
                        <th className="no-print" style={{ padding: '12px 14px', textAlign: 'center' }}>Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOutMovements.length === 0 ? (
                        <tr>
                          <td colSpan={11} style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>🔍</span>
                            Belgilangan davr yoki filtrlar bo&apos;yicha birorta ham chiqim amali topilmadi.
                          </td>
                        </tr>
                      ) : (
                        <>
                          {/* JAMI (Umumiy Xulosa) qatori jadval YUQORISIDA */}
                          <tr className="accounting-table-total-row" style={{ background: '#f8fafc', fontWeight: 900, color: '#0f172a', borderBottom: '2.5px solid #cbd5e1' }}>
                            <td colSpan={4} style={{ padding: '14px', fontSize: '13px', background: '#f1f5f9' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <span>📊</span>
                                <strong>JAMI ({filteredOutMovements.length} ta chiqim):</strong>
                              </span>
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right', fontSize: '13px', background: '#f1f5f9' }}>
                              ⚖️ {accountingStats.totalWeightKg.toLocaleString('uz-UZ')} kg
                            </td>
                            <td style={{ padding: '14px', background: '#f1f5f9' }}></td>
                            <td style={{ padding: '14px', textAlign: 'right', fontSize: '13px', background: '#f1f5f9' }}>
                              {accountingStats.totalStorageUZS.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right', fontSize: '13px', background: '#f1f5f9' }}>
                              {(accountingStats.totalUnloadingUZS + accountingStats.totalLoadingUZS).toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right', fontSize: '14px', color: '#7e22ce', background: '#f1f5f9' }}>
                              {accountingStats.grandTotalUZS.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '14px', textAlign: 'center', fontSize: '12px', color: '#059669', background: '#f1f5f9' }}>
                              To&apos;langan: {accountingStats.paidTotalUZS.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td className="no-print" style={{ padding: '14px', background: '#f1f5f9' }}></td>
                          </tr>

                          {filteredOutMovements.map((m, idx) => {
                          const isPaid = m.paymentStatus === 'PAID';
                          return (
                            <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                              <td style={{ padding: '10px 14px' }}>
                                <span style={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>
                                  #{idx + 1}
                                </span>
                                <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 700, background: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>
                                  {m.invoiceNo || 'NAK-OUT'}
                                </span>
                              </td>

                              <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                                <strong style={{ color: '#0f172a' }}>{m.date}</strong>
                                <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>⏰ {m.time}</span>
                              </td>

                              <td style={{ padding: '10px 14px' }}>
                                <strong style={{ color: '#0f172a', display: 'block' }}>{m.userName}</strong>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>
                                  {m.userRole === 'SUPER_ADMIN' ? '👑 Super Admin' : m.userRole === 'ADMIN' ? '🛡️ Admin' : '👤 Omborchi'}
                                </span>
                              </td>

                              <td style={{ padding: '10px 14px' }}>
                                <strong style={{ color: '#0f172a', display: 'block' }}>{m.productName}</strong>
                                <span style={{ fontSize: '11px', color: '#0284c7' }}>🏢 {m.sectorName}</span>
                              </td>

                              <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                                <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                                  {m.quantity.toLocaleString('uz-UZ')} {m.unit}
                                </strong>
                                {m.weightKg && (
                                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                                    ⚖️ {m.weightKg.toLocaleString('uz-UZ')} kg
                                  </span>
                                )}
                              </td>

                              <td style={{ padding: '10px 14px' }}>
                                <strong style={{ color: '#0f172a', display: 'block' }}>
                                  {m.clientName || m.receiverName || "Noma'lum"}
                                </strong>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>
                                  STIR: <code>{m.receiverInn || '308942115'}</code> {m.receiverPerson ? `• ${m.receiverPerson}` : ''}
                                </span>
                              </td>

                              <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                                <strong style={{ color: '#0f172a', display: 'block' }}>
                                  {(m.storageCostUZS || 0).toLocaleString('uz-UZ')} UZS
                                </strong>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>
                                  {m.daysStored || 1} kun saqlangan
                                </span>
                              </td>

                              <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                                <strong style={{ color: '#0f172a', display: 'block' }}>
                                  {((m.obrabotkaCostUZS || 0) + (m.loadingCostUZS || 0)).toLocaleString('uz-UZ')} UZS
                                </strong>
                                <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                                  Tushirish: {(m.obrabotkaCostUZS || 0).toLocaleString('uz-UZ')} • Ortish: {(m.loadingCostUZS || 0).toLocaleString('uz-UZ')}
                                </span>
                              </td>

                              <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                                <strong style={{ fontSize: '13.5px', color: '#7e22ce', display: 'block' }}>
                                  {(m.grandTotalUZS || m.totalCostUZS || 0).toLocaleString('uz-UZ')} UZS
                                </strong>
                                <span style={{ fontSize: '10.5px', color: '#059669' }}>
                                  QQS: {(m.vatTotalUZS || 0).toLocaleString('uz-UZ')} UZS
                                </span>
                              </td>

                              <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                                <span
                                  onClick={() => handleTogglePaymentStatus(m.id)}
                                  title="Holatni o'zgartirish uchun bosing"
                                  style={{
                                    display: 'inline-block',
                                    padding: '3px 10px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    background: isPaid ? '#ecfdf5' : '#fffbeb',
                                    color: isPaid ? '#047857' : '#b45309',
                                    border: isPaid ? '1px solid #a7f3d0' : '1px solid #fde68a',
                                    userSelect: 'none'
                                  }}
                                >
                                  {isPaid ? '✅ To\'langan' : '⏳ Kutilmoqda'}
                                </span>
                              </td>

                              <td className="no-print" style={{ padding: '10px 14px', textAlign: 'center' }}>
                                <button
                                  onClick={() => setSelectedInvoiceMovement(m)}
                                  className="btn-outline"
                                  style={{ fontSize: '11px', padding: '4px 10px', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                                  title="Rasmiy Invoys va Dalolatnoma (Chop etish)"
                                >
                                  🧾 Invoys
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =========================================================
                SUB-VIEW 2: KIM QANCHA CHIQIM QILDI (XODIMLAR KESIMIDA)
                ========================================================= */}
            {accountingSubView === 'by_employee' && (
              <div className="accounting-employee-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {employeeAnalysis.map(emp => (
                  <div key={emp.name} className="mini-card accounting-employee-card" style={{ background: '#ffffff', border: '1.5px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: emp.role === 'SUPER_ADMIN' ? '#eff6ff' : emp.role === 'ADMIN' ? '#ecfdf5' : '#f8fafc', color: emp.role === 'SUPER_ADMIN' ? '#2563eb' : emp.role === 'ADMIN' ? '#059669' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800 }}>
                          {emp.role === 'SUPER_ADMIN' ? '👑' : emp.role === 'ADMIN' ? '🛡️' : '👤'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            {emp.name}
                          </h3>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', background: emp.role === 'SUPER_ADMIN' ? '#eff6ff' : emp.role === 'ADMIN' ? '#ecfdf5' : '#f1f5f9', color: emp.role === 'SUPER_ADMIN' ? '#1d4ed8' : emp.role === 'ADMIN' ? '#047857' : '#475569' }}>
                            {emp.role}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 900, background: '#faf5ff', color: '#7e22ce', padding: '4px 10px', borderRadius: '6px' }}>
                        {emp.count} ta chiqim
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Chiqargan yuk vazni:</span>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>
                          {emp.totalWeightKg.toLocaleString('uz-UZ')} kg
                        </strong>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                          ({(emp.totalWeightKg / 1000).toFixed(2)} tn)
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Rasmiylashtirilgan to&apos;lov:</span>
                        <strong style={{ fontSize: '14px', color: '#7e22ce' }}>
                          {emp.totalAmountUZS.toLocaleString('uz-UZ')} UZS
                        </strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>
                        To&apos;langan: {emp.paidAmountUZS.toLocaleString('uz-UZ')} UZS
                      </span>
                      <span style={{ color: '#dc2626', fontWeight: 700 }}>
                        Kutilmoqda: {emp.pendingAmountUZS.toLocaleString('uz-UZ')} UZS
                      </span>
                    </div>

                    <div style={{ marginTop: '10px', fontSize: '11.5px', color: '#64748b' }}>
                      Chiqargan tovarlari: <strong>{Array.from(emp.productsList).join(', ') || 'Umumiy tovarlar'}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* =========================================================
                SUB-VIEW 3: QANCHA TO'LASHI KERAK (MIJOZLAR KESIMIDA)
                ========================================================= */}
            {accountingSubView === 'by_client' && (
              <div className="mini-card accounting-print-table-card" style={{ background: '#ffffff', padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="accounting-print-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 800, fontSize: '11.5px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 14px' }}>Mijoz / To&apos;lovchi Korxona</th>
                        <th style={{ padding: '12px 14px' }}>STIR (INN)</th>
                        <th style={{ padding: '12px 14px', textAlign: 'center' }}>Chiqimlar Soni</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Chiqarilgan Og&apos;irlik</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Saqlash (UZS)</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Ortish / Tushirish (UZS)</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Jami To&apos;lashi Kerak (UZS)</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>To&apos;langan Summa</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Qarzdorlik</th>
                        <th style={{ padding: '12px 14px', textAlign: 'center' }}>Holat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* JAMI (Mijozlar umumiy xulosasi) jadval YUQORISIDA */}
                      {clientAnalysis.length > 0 && (() => {
                        const totalParties = clientAnalysis.reduce((s, c) => s + c.count, 0);
                        const totalWeight = clientAnalysis.reduce((s, c) => s + c.totalWeightKg, 0);
                        const totalStorage = clientAnalysis.reduce((s, c) => s + c.storageCostUZS, 0);
                        const totalTransport = clientAnalysis.reduce((s, c) => s + c.transportCostUZS, 0);
                        const totalAmount = clientAnalysis.reduce((s, c) => s + c.totalAmountUZS, 0);
                        const totalPaid = clientAnalysis.reduce((s, c) => s + c.paidAmountUZS, 0);
                        const totalPending = clientAnalysis.reduce((s, c) => s + c.pendingAmountUZS, 0);
                        return (
                          <tr className="accounting-table-total-row" style={{ background: '#f8fafc', fontWeight: 900, color: '#0f172a', borderBottom: '2.5px solid #cbd5e1' }}>
                            <td colSpan={2} style={{ padding: '14px', fontSize: '13px', background: '#f1f5f9' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <span>🏢</span>
                                <strong>JAMI ({clientAnalysis.length} ta korxona):</strong>
                              </span>
                            </td>
                            <td style={{ padding: '14px', textAlign: 'center', fontWeight: 900, background: '#f1f5f9' }}>
                              {totalParties} ta partiya
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right', fontWeight: 900, background: '#f1f5f9' }}>
                              ⚖️ {totalWeight.toLocaleString('uz-UZ')} kg
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right', background: '#f1f5f9' }}>
                              {totalStorage.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right', background: '#f1f5f9' }}>
                              {totalTransport.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right', color: '#7e22ce', fontSize: '13.5px', background: '#f1f5f9' }}>
                              {totalAmount.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right', color: '#059669', fontWeight: 800, background: '#f1f5f9' }}>
                              {totalPaid.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right', color: totalPending > 0 ? '#dc2626' : '#64748b', fontWeight: 900, background: '#f1f5f9' }}>
                              {totalPending.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '14px', textAlign: 'center', background: '#f1f5f9' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 800,
                                background: totalPending > 0 ? '#fef2f2' : '#ecfdf5',
                                color: totalPending > 0 ? '#dc2626' : '#059669',
                                border: totalPending > 0 ? '1px solid #fecaca' : '1px solid #a7f3d0'
                              }}>
                                {totalPending > 0 ? '⏳ Qarzdorlik bor' : '✅ To\'liq to\'langan'}
                              </span>
                            </td>
                          </tr>
                        );
                      })()}
                      {clientAnalysis.map((cl, idx) => {
                        const hasDebt = cl.pendingAmountUZS > 0;
                        return (
                          <tr key={cl.clientName} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                            <td style={{ padding: '12px 14px' }}>
                              <strong style={{ color: '#0f172a', fontSize: '13px', display: 'block' }}>
                                {cl.clientName}
                              </strong>
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <code style={{ fontSize: '12px', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px', color: '#1d4ed8' }}>
                                {cl.inn}
                              </code>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800 }}>
                              {cl.count} ta partiya
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700 }}>
                              {cl.totalWeightKg.toLocaleString('uz-UZ')} kg
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                              {cl.storageCostUZS.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                              {cl.transportCostUZS.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                              <strong style={{ fontSize: '13.5px', color: '#7e22ce' }}>
                                {cl.totalAmountUZS.toLocaleString('uz-UZ')} UZS
                              </strong>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', color: '#059669', fontWeight: 700 }}>
                              {cl.paidAmountUZS.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', color: hasDebt ? '#dc2626' : '#64748b', fontWeight: 800 }}>
                              {cl.pendingAmountUZS.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 800,
                                background: hasDebt ? '#fef2f2' : '#ecfdf5',
                                color: hasDebt ? '#dc2626' : '#059669',
                                border: hasDebt ? '1px solid #fecaca' : '1px solid #a7f3d0'
                              }}>
                                {hasDebt ? '⏳ Qarzdorlik bor' : '✅ To\'liq to\'langan'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Rasmiy A4 Pechat Imzolari va Muhr Bloki (Faqat chop etishda ko'rinadi) */}
            <div className="accounting-official-print-footer">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '16px', fontSize: '11px', color: '#0f172a' }}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: '22px' }}>Bosh Direktor:</div>
                  <div style={{ borderBottom: '1px solid #475569', width: '85%', marginBottom: '4px' }}></div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Qodirov Alisher (Imzo)</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: '22px' }}>Bosh Buxgalter:</div>
                  <div style={{ borderBottom: '1px solid #475569', width: '85%', marginBottom: '4px' }}></div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>____________________ (Imzo)</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: '22px' }}>Omborxona Mudiri:</div>
                  <div style={{ borderBottom: '1px solid #475569', width: '85%', marginBottom: '4px' }}></div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Bekmirzayev Jasur (Imzo)</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9.5px', color: '#64748b', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                <span>Ushbu hisobot «JB GROUP» avtomatlashtirilgan bojxona boshqaruv axborot tizimi orqali shakllantirildi.</span>
                <span style={{ fontWeight: 700 }}>M.O&apos;. (Muhr o&apos;rni)</span>
              </div>
            </div>
          </div>
        )}


        {/* ========================================================
            5-BO'LIM: BOJXONA PREYSKURANTI VA SAQLASH TARIFLARI
            ======================================================== */}
        {activeMenu === 'tariffs' && (
          <div>
            {/* Sarlavha va Yangi xizmat qo'shish */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="/jb-logo.jpg" alt="JB GROUP" style={{ height: '32px', width: 'auto', borderRadius: '4px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f2b48', margin: 0, letterSpacing: '-0.01em' }}>
                    «JB GROUP» Bojxona Ombori Rasmiy Preyskuranti
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                  Yuk ortish/tushirish, bojxona omborida saqlash va qo&apos;shimcha xizmatlarning 12% QQS (NDS) bilan tasdiqlangan stavkalari
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {canManageTariffs && (
                  <button
                    onClick={() => {
                      setEditingCustomsService(null);
                      setCustomsServiceForm({
                        name: '',
                        nameUz: '',
                        unit: '1 tn',
                        basePrice: 50000,
                        vatRate: 0.12,
                        description: '',
                        category: 'UNLOADING_LOADING'
                      });
                      setIsCustomsServiceModalOpen(true);
                    }}
                    className="btn-primary"
                    style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)', border: 'none' }}
                  >
                    <span>➕ Yangi Bojxona Xizmati Qo&apos;shish</span>
                  </button>
                )}
              </div>
            </div>

            {/* Rasmiy Preyskurant va Saqlash Qoidasi */}
            <div>
              {/* Eslatma banner: Xizmatlar turlari va Hisoblash qoidasi (3 ta kartochka) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                {/* 1. Ortish va Tushirish */}
                <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🏗️</span>
                      <span>1. Ortish va Tushirish</span>
                    </span>
                    <span style={{ fontSize: '10px', background: '#0284c7', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
                      ⚡ 1 martalik to'lov
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#0c4a6e', lineHeight: '1.5' }}>
                    1–9-bandlar: Kirimda yuk tushirish (разгрузка) va chiqimda ortish (погрузка) 1 martalik qat&apos;iy to&apos;lov bo&apos;lib, saqlangan kunlar soniga mutlaqo ko&apos;paytirilmaydi.
                  </p>
                </div>

                {/* 2. Saqlash xizmatlari */}
                <div style={{ background: '#ecfdf5', border: '1.5px solid #86efac', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>❄️📦</span>
                      <span>2. Saqlash Xizmatlari</span>
                    </span>
                    <span style={{ fontSize: '10px', background: '#059669', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
                      📅 FAQAT SHU KUNLIK
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#064e3b', lineHeight: '1.5' }}>
                    Saqlash xizmatlari: FAQAT ushbu xizmatlar yuk omborda turgan kunlar soniga qarab (kunlar soni × stavka × hajm) ko&apos;paytirilib hisoblab beriladi.
                  </p>
                </div>

                {/* 3. Qo'shimcha xizmatlar */}
                <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🛠️</span>
                      <span>3. Qo&apos;shimcha Xizmatlar</span>
                    </span>
                    <span style={{ fontSize: '10px', background: '#d97706', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
                      ⚡ 1 martalik to'lov
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#78350f', lineHeight: '1.5' }}>
                    20–30-bandlar: Qo&apos;shimcha xizmatlar kunlik yoki boshqacha emas, qat&apos;iy 1 martalik to&apos;lov bo&apos;ladi (streych, saralash, stoyanka, yuvish, kross-doking).
                  </p>
                </div>
              </div>

              {/* Filtrlash va Qidiruv Paneli */}
              <div className="mini-card" style={{ marginBottom: '20px', background: '#ffffff', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  {/* Kategoriya filtrlari */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setCustomsCategoryFilter('ALL')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: customsCategoryFilter === 'ALL' ? '1.5px solid #0070ba' : '1px solid #e2e8f0',
                        background: customsCategoryFilter === 'ALL' ? '#eff6ff' : '#f8fafc',
                        color: customsCategoryFilter === 'ALL' ? '#002d62' : '#64748b'
                      }}
                    >
                      🌟 Barchasi ({customsServices.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomsCategoryFilter('UNLOADING_LOADING')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: customsCategoryFilter === 'UNLOADING_LOADING' ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                        background: customsCategoryFilter === 'UNLOADING_LOADING' ? '#e0f2fe' : '#f8fafc',
                        color: customsCategoryFilter === 'UNLOADING_LOADING' ? '#0369a1' : '#64748b'
                      }}
                    >
                      🏗️ 1. РАЗГРУЗКА/ПОГРУЗКА (⚡ 1 martalik) ({customsServices.filter(s => s.category === 'UNLOADING_LOADING').length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomsCategoryFilter('STORAGE')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: customsCategoryFilter === 'STORAGE' ? '1.5px solid #059669' : '1px solid #e2e8f0',
                        background: customsCategoryFilter === 'STORAGE' ? '#ecfdf5' : '#f8fafc',
                        color: customsCategoryFilter === 'STORAGE' ? '#047857' : '#64748b'
                      }}
                    >
                      ❄️📦 2. ХРАНЕНИЕ (📅 FAQAT Saqlash: kunlik) ({customsServices.filter(s => s.category === 'STORAGE').length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomsCategoryFilter('ADDITIONAL')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: customsCategoryFilter === 'ADDITIONAL' ? '1.5px solid #d97706' : '1px solid #e2e8f0',
                        background: customsCategoryFilter === 'ADDITIONAL' ? '#fef3c7' : '#f8fafc',
                        color: customsCategoryFilter === 'ADDITIONAL' ? '#b45309' : '#64748b'
                      }}
                    >
                      🛠️ 3. ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ (⚡ 1 martalik) ({customsServices.filter(s => s.category === 'ADDITIONAL').length})
                    </button>
                  </div>

                    {/* Qidiruv */}
                    <div style={{ flex: '1', minWidth: '240px', maxWidth: '360px' }}>
                      <input
                        type="text"
                        className="form-input-clean"
                        placeholder="🔍 Xizmat nomi yoki birligi bo'yicha qidirish..."
                        value={customsSearch}
                        onChange={e => setCustomsSearch(e.target.value)}
                        style={{ fontSize: '12px', padding: '8px 12px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Rasmiy Preyskurant Jadvali */}
                <div className="mini-card" style={{ background: '#ffffff', overflowX: 'auto', padding: '0' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#0f2b48', color: '#ffffff', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        <th style={{ padding: '12px 14px', width: '48px', textAlign: 'center' }}>№</th>
                        <th style={{ padding: '12px 14px' }}>Наименование услуг / Xizmat Nomi</th>
                        <th style={{ padding: '12px 14px', width: '140px' }}>Kategoriya</th>
                        <th style={{ padding: '12px 14px', width: '110px' }}>Birligi</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Стоимость в сумах (QQSsiz)</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>НДС 12% (QQS)</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right', background: '#002244' }}>Стоимость с учетом НДС (Jami)</th>
                        {canManageTariffs && <th style={{ padding: '12px 14px', width: '80px', textAlign: 'center' }}>Amal</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomsServices.map((s, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <tr
                            key={s.id}
                            style={{
                              borderBottom: '1px solid #f1f5f9',
                              background: isEven ? '#ffffff' : '#fafafa'
                            }}
                          >
                            <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: '#64748b' }}>
                              {s.itemNo || idx + 1}
                            </td>

                            <td style={{ padding: '12px 14px' }}>
                              <strong style={{ color: '#0f172a', display: 'block', fontSize: '13px' }}>
                                {s.name}
                              </strong>
                              {s.nameUz && s.nameUz !== s.name && (
                                <span style={{ fontSize: '11px', color: '#0070ba', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                                  🇺🇿 {s.nameUz}
                                </span>
                              )}
                              {s.description && (
                                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                                  {s.description}
                                </span>
                              )}
                            </td>

                            <td style={{ padding: '12px 14px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '4px 9px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  background: s.category === 'UNLOADING_LOADING' ? '#e0f2fe' : s.category === 'STORAGE' ? '#ecfdf5' : '#fef3c7',
                                  color: s.category === 'UNLOADING_LOADING' ? '#0369a1' : s.category === 'STORAGE' ? '#047857' : '#b45309'
                                }}
                              >
                                {s.category === 'UNLOADING_LOADING' ? '🏗️ 1 martalik to\'lov' : s.category === 'STORAGE' ? '📅 Kuniga qarab' : '⚡ 1 martalik to\'lov'}
                              </span>
                            </td>

                            <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 600, fontSize: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <span>{s.unit}</span>
                                {s.category === 'STORAGE' ? (
                                  <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                    kunlik stavka
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '10px', background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                    1 martalik
                                  </span>
                                )}
                              </div>
                            </td>

                            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600, color: '#334155' }}>
                              {s.basePrice.toLocaleString('uz-UZ')} so&apos;m
                            </td>

                            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600, color: '#0070ba' }}>
                              {s.vatAmount.toLocaleString('uz-UZ')} so&apos;m
                            </td>

                            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#047857', fontSize: '14px', background: isEven ? '#f0fdf4' : '#e6f9ed' }}>
                              {s.totalPrice.toLocaleString('uz-UZ')} so&apos;m
                            </td>

                            {canManageTariffs && (
                              <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCustomsService(s);
                                    setCustomsServiceForm({
                                      name: s.name,
                                      nameUz: s.nameUz || '',
                                      unit: s.unit,
                                      basePrice: s.basePrice,
                                      vatRate: s.vatRate,
                                      description: s.description || '',
                                      category: s.category
                                    });
                                    setIsCustomsServiceModalOpen(true);
                                  }}
                                  className="btn-outline"
                                  style={{ fontSize: '11px', padding: '4px 8px' }}
                                  title="Narxni tahrirlash"
                                >
                                  ✏️
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        )}

        {/* ========================================================
            4-BO'LIM: XODIMLAR VA HUQUQLAR BOSHQARUVI (FAQAT SUPER ADMIN UCHUN)
            - Ochiq registratsiya yo'q!
            - Faqat Super Admin user/adminlarni qo'shadi va ularga
              nima bilan ishlashini belgilab beradi.
            ======================================================== */}
        {activeMenu === 'users' && isSuperAdmin && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  👥 Xodimlar va Vakolatlar Boshqaruvi
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Tizimda ochiq ro&apos;yxatdan o&apos;tish yo&apos;q. Faqat siz (Bosh Rahbar) xodimlarni qo&apos;sha olasiz va ularning aniq huquqlarini belgilaysiz.
                </p>
              </div>

              <button onClick={handleOpenNewUser} className="btn-primary">
                <span>➕ Yangi Xodim / Admin Qo&apos;shish</span>
              </button>
            </div>

            {/* Xodimlar ro'yxati kartochkalari */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {usersList.map(u => {
                const isSuper = u.role === 'SUPER_ADMIN';
                const isAdminRole = u.role === 'ADMIN';
                const isAccountantRole = u.role === 'ACCOUNTANT';
                const perms = u.permissions;

                return (
                  <div key={u.id} className="mini-card" style={{ background: '#ffffff', border: isSuper ? '1.5px solid #93c5fd' : isAccountantRole ? '1.5px solid #d8b4fe' : '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: isSuper ? '#eff6ff' : isAdminRole ? '#ecfdf5' : isAccountantRole ? '#faf5ff' : '#f8fafc', color: isSuper ? '#2563eb' : isAdminRole ? '#059669' : isAccountantRole ? '#7e22ce' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800 }}>
                          {isSuper ? '👑' : isAdminRole ? '🛡️' : isAccountantRole ? '💼' : '👤'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                              {u.fullName}
                            </h3>
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: isSuper ? '#eff6ff' : isAdminRole ? '#ecfdf5' : isAccountantRole ? '#faf5ff' : '#f1f5f9', color: isSuper ? '#1d4ed8' : isAdminRole ? '#047857' : isAccountantRole ? '#7e22ce' : '#475569' }}>
                              {u.role === 'ACCOUNTANT' ? 'BUXGALTER' : u.role}
                            </span>
                            {u.id === currentUser?.id && (
                              <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: '#dbeafe', color: '#1e40af' }}>
                                (Siz)
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>
                            ✉️ {u.email} • Parol: <code>{u.password || 'password123'}</code>
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="btn-outline"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          ⚙️ Huquqlarni Sozlash
                        </button>
                        {!isSuper && u.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.fullName)}
                            className="btn-outline"
                            style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#fca5a5', color: '#dc2626', background: '#fff5f5' }}
                          >
                            🗑️ O&apos;chirish
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Super Admin tomonidan berilgan ruxsatlar xulosasi */}
                    <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Xodimning Tasdiqlangan Vakolatlari:
                      </span>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                        {/* 1. Omborni sozlash */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: (isSuper || perms?.canManageWarehouse) ? '#15803d' : '#94a3b8' }}>
                          <span>{(isSuper || perms?.canManageWarehouse) ? '✅' : '❌'}</span>
                          <span>Omborni sozlash & Sektorlar ochish</span>
                        </div>

                        {/* 2. Tariflar boshqaruvi */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: (isSuper || perms?.canManageTariffs) ? '#15803d' : '#94a3b8' }}>
                          <span>{(isSuper || perms?.canManageTariffs) ? '✅' : '❌'}</span>
                          <span>Tarif qo&apos;shish & Narx belgilash</span>
                        </div>

                        {/* 3. Tariflarni ulash */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: (isSuper || perms?.canLinkTariffs) ? '#15803d' : '#94a3b8' }}>
                          <span>{(isSuper || perms?.canLinkTariffs) ? '✅' : '❌'}</span>
                          <span>Tariflarni omborga bog&apos;lash</span>
                        </div>

                        {/* 4. XAVFLI YUKLAR BILAN ISHLASH (FOYDALANUVCHI TALABI) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: (isSuper || perms?.canHandleHazardous) ? '#15803d' : '#b91c1c' }}>
                          <span>{(isSuper || perms?.canHandleHazardous) ? '☣️' : '⛔'}</span>
                          <span>
                            {(isSuper || perms?.canHandleHazardous) ? 'Xavfli yuklar bilan ishlay oladi' : 'Xavfli yuklar taqiqlangan!'}
                          </span>
                        </div>

                        {/* 5. Kirim/Chiqim */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: (isSuper || perms?.canStockMovement) ? '#15803d' : '#94a3b8' }}>
                          <span>{(isSuper || perms?.canStockMovement) ? '✅' : '❌'}</span>
                          <span>Yuk kirim/chiqim amallari</span>
                        </div>

                        {/* 6. Moliyaviy to'lovlar va narxlarni ko'rish ruxsati */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: (isSuper || perms?.canViewFinances) ? '#15803d' : '#64748b' }}>
                          <span>{(isSuper || perms?.canViewFinances) ? '💰' : '🔒'}</span>
                          <span>{(isSuper || perms?.canViewFinances) ? 'Moliyaviy to\'lovlarni ko\'ra oladi' : 'Pul ma\'lumotlari yashirilgan (faqat fakt)'}</span>
                        </div>
                      </div>

                      {/* Ruxsat etilgan ombor sektorlari */}
                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', fontSize: '12px' }}>
                        <span style={{ color: '#475569', fontWeight: 600 }}>Ruxsat etilgan sektorlar:</span>
                        {isSuper || perms?.allowedSectorIds?.includes('ALL') ? (
                          <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '1px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                            ⚡ Barcha sektorlar (Cheklovsiz)
                          </span>
                        ) : (perms?.allowedSectorIds?.length || 0) > 0 ? (
                          perms?.allowedSectorIds.map(sId => {
                            const foundSec = warehouse.sectors.find(s => s.id === sId);
                            return (
                              <span key={sId} style={{ background: '#f8fafc', color: '#334155', border: '1px solid #e2e8f0', padding: '1px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                                {foundSec?.name || sId}
                              </span>
                            );
                          })
                        ) : (
                          <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '11px' }}>
                            Birorta sektorga ruxsat berilmagan!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL 1: SEKTORNI SOZLASH
          ======================================================== */}
      {isSectorModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header-clean">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingSector ? `⚙️ Sektorni Sozlash: ${editingSector.name}` : '✨ Yangi Sektor Qo\'shish'}
              </h3>
              <button onClick={() => setIsSectorModalOpen(false)} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleSaveSector}>
              <div className="modal-body-clean">
                <div className="form-field">
                  <label className="form-label">SEKTOR NOMI *</label>
                  <input type="text" required className="form-input-clean" value={sectorForm.name} onChange={e => setSectorForm({ ...sectorForm, name: e.target.value })} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">SEKTOR KODI</label>
                    <input type="text" className="form-input-clean" value={sectorForm.code} onChange={e => setSectorForm({ ...sectorForm, code: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">SEKTOR TURI (IXTISOSLASHUV) *</label>
                    <select
                      className="form-select-clean"
                      value={sectorForm.type}
                      onChange={e => {
                        const newType = e.target.value as SectorType;
                        let defaultTemp = '+18°C ... +22°C';
                        if (newType === 'COLD_FREEZER') defaultTemp = '-18°C ... -24°C';
                        if (newType === 'CHILLED') defaultTemp = '+2°C ... +6°C';
                        if (newType === 'HAZARDOUS') defaultTemp = '+15°C ... +20°C';
                        setSectorForm({ ...sectorForm, type: newType, temperature: defaultTemp });
                      }}
                    >
                      <option value="COLD_FREEZER">❄️ Xolodilnik / Muzlatkich</option>
                      <option value="CHILLED">🧊 Sovutgichli Sektor</option>
                      <option value="DRY_STANDARD">📦 Standart Quruq Zaxira</option>
                      <option value="HAZARDOUS">☣️ Xavfli Yuklar & Kimyoviy</option>
                      <option value="HIGH_SECURITY">🔒 Qimmatbaho & Yuqori Xavfsizlik</option>
                      <option value="LIQUID_OIL">🛢️ Suyuqliklar & Moylar</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">HARORAT REJIMI</label>
                    <input type="text" className="form-input-clean" value={sectorForm.temperature} onChange={e => setSectorForm({ ...sectorForm, temperature: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">HOLATI</label>
                    <select className="form-select-clean" value={sectorForm.status} onChange={e => setSectorForm({ ...sectorForm, status: e.target.value as any })}>
                      <option value="Faol">Faol</option>
                      <option value="Profilaktika">Profilaktika</option>
                      <option value="To'lgan">To&apos;lgan</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">RUXSAT BERILGAN YUK TURLARI (VERGUL BILAN AJRATING) *</label>
                  <input type="text" required className="form-input-clean" value={sectorForm.allowedCargoTypes} onChange={e => setSectorForm({ ...sectorForm, allowedCargoTypes: e.target.value })} />
                </div>

                <div className="form-field">
                  <label className="form-label">QO&apos;SHIMCHA TAVSIF / XAVFSIZLIK SHARTLARI</label>
                  <textarea rows={2} className="form-input-clean" value={sectorForm.description} onChange={e => setSectorForm({ ...sectorForm, description: e.target.value })} />
                </div>
              </div>

              <div className="modal-footer-clean">
                <button type="button" className="btn-secondary" onClick={() => setIsSectorModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="btn-primary">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: YANGI YUK KIRITISH (KIRIM) & BOJXONA XIZMATLARI
          ======================================================== */}
      {isAddProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '640px' }}>
            <div className="modal-header-clean">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📥</span>
                  <span>Bojxona Omboriga Yangi Yuk Qabul Qilish (Kirim)</span>
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  «JB GROUP» Bojxona ombori rasmiy qoidasi va 12% QQS hisobi bilan
                </span>
              </div>
              <button onClick={() => setIsAddProductModalOpen(false)} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleAddProduct}>
              <div className="modal-body-clean">
                {/* 1. Sklad (Sektor) tanlash */}
                <div className="form-field">
                  <label className="form-label">Joylashtiriladigan Sklad (Sektor) *</label>
                  <select
                    className="form-select-clean"
                    value={productForm.sectorId}
                    onChange={e => {
                      setProductForm({
                        ...productForm,
                        sectorId: e.target.value
                      });
                    }}
                    required
                  >
                    {warehouse.sectors.map(sec => {
                      return (
                        <option key={sec.id} value={sec.id}>
                          {sec.name} ({sec.capacity.toLocaleString('uz-UZ')} m²) — {sec.temperature || sec.type}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 2. Mahsulot nomi va nakladnoy raqami (Talab bo'yicha bitta maydon) */}
                <div className="form-field">
                  <label className="form-label" style={{ fontWeight: 800, color: '#002d62', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📦</span>
                    <span>2. YUK (MAHSULOT) NOMI VA NAKLADNOY RAQAMI *</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input-clean"
                    placeholder="Masalan: №TK-882 - Keramika plitkalari (Gres) yoki Partiya №102"
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    Yukning to&apos;liq nomi va kirim nakladnoy / partiya raqamini bitta qilib kiriting.
                  </span>
                </div>

                {/* 3. Tovar egasi / To'lovchi (Talab bo'yicha jonli qidiruv tizimi: Korxona nomi yoki INN bo'yicha) */}
                <div className="form-field" style={{ position: 'relative' }}>
                  <label className="form-label" style={{ fontWeight: 800, color: '#002d62', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🏢</span>
                      <span>3. YUK TO&apos;LOVCHISI (SHARTNOMA TUZGAN MIJOZ) *</span>
                    </span>
                    <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>
                      🔍 Nomi yoki STIR (INN) bo&apos;yicha qidiruv
                    </span>
                  </label>

                  {(() => {
                    const chosenPayer = payers.find(p => p.id === productForm.payerId || p.name === productForm.clientName);
                    const todayStr = new Date().toISOString().slice(0, 10);
                    const isExpired = chosenPayer ? chosenPayer.contractEndDate < todayStr : false;

                    if (chosenPayer) {
                      return (
                        <div style={{ background: '#f0f9ff', border: '1.5px solid #0284c7', borderRadius: '10px', padding: '12px 14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <strong style={{ fontSize: '14px', color: '#002d62' }}>{chosenPayer.name}</strong>
                                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, background: isExpired ? '#fee2e2' : '#dcfce7', color: isExpired ? '#dc2626' : '#15803d' }}>
                                  {isExpired ? '🔴 MUDDATI TUGAGAN' : '🟢 AMALDA'}
                                </span>
                              </div>
                              <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                                <span>STIR (INN): <strong style={{ color: '#0284c7' }}>{chosenPayer.inn}</strong></span>
                                <span>Shartnoma: <strong>№{chosenPayer.contractNumber}</strong> ({chosenPayer.contractEndDate} gacha)</span>
                                {chosenPayer.contactPerson && <span>Vakil: <strong>{chosenPayer.contactPerson}</strong></span>}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setProductForm({ ...productForm, clientName: '', payerId: '' });
                                setPayerSearchQuery('');
                                setIsPayerDropdownOpen(true);
                              }}
                              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}
                            >
                              ✕ O&apos;zgartirish
                            </button>
                          </div>

                          {isExpired && (
                            <div style={{ marginTop: '8px', padding: '6px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '11px', color: '#b91c1c', fontWeight: 600 }}>
                              ⚠️ Ushbu to&apos;lovchining shartnoma muddati ({chosenPayer.contractEndDate}) tugagan! Chiqim paytida to&apos;lov amalga oshirilishi uchun shartnomani uzaytirish lozim bo&apos;ladi.
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <span style={{ position: 'absolute', left: '12px', fontSize: '14px', color: '#64748b' }}>🔍</span>
                          <input
                            type="text"
                            required
                            className="form-input-clean"
                            style={{ paddingLeft: '36px', borderColor: '#3b82f6', fontWeight: 500 }}
                            placeholder="Mijoz korxona nomi yoki STIR (INN) raqamini yozing (masalan: Lactalis, 308...)"
                            value={payerSearchQuery}
                            onChange={e => {
                              setPayerSearchQuery(e.target.value);
                              setIsPayerDropdownOpen(true);
                            }}
                            onFocus={() => setIsPayerDropdownOpen(true)}
                          />
                        </div>

                        {isPayerDropdownOpen && (
                          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999, background: '#ffffff', border: '2px solid #3b82f6', borderRadius: '10px', boxShadow: '0 12px 28px rgba(0,0,0,0.18)', maxHeight: '240px', overflowY: 'auto', marginTop: '4px' }}>
                            <div style={{ padding: '6px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                              Topilgan to&apos;lovchilar ({filteredPayers.length} ta):
                            </div>
                            {filteredPayers.length > 0 ? (
                              filteredPayers.map(p => {
                                const isExp = p.contractEndDate < todayStr;
                                return (
                                  <div
                                    key={p.id}
                                    onClick={() => {
                                      setProductForm({
                                        ...productForm,
                                        clientName: p.name,
                                        payerId: p.id
                                      });
                                      setPayerSearchQuery('');
                                      setIsPayerDropdownOpen(false);
                                    }}
                                    style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <strong style={{ fontSize: '13px', color: '#002d62' }}>{p.name}</strong>
                                      <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, background: isExp ? '#fee2e2' : '#dcfce7', color: isExp ? '#dc2626' : '#15803d' }}>
                                        {isExp ? '🔴 MUDDATI TUGAGAN' : '🟢 AMALDA'}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', display: 'flex', gap: '14px' }}>
                                      <span>STIR (INN): <strong style={{ color: '#0284c7' }}>{p.inn}</strong></span>
                                      <span>Shartnoma: №{p.contractNumber} ({p.contractEndDate} gacha)</span>
                                      {p.contactPerson && <span>Vakil: {p.contactPerson}</span>}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div style={{ padding: '14px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                                &quot;{payerSearchQuery}&quot; bo&apos;yicha hech qanday korxona yoki STIR (INN) topilmadi.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* 4. Soni va Og'irligi (TALAB ASOSIDA) */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#002d62', marginBottom: '10px', textTransform: 'uppercase' }}>
                    📦 YUKNING SONI VA OG&apos;IRLIGI (ANIQ HISOB):
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '10px' }}>
                    <div>
                      <label className="form-label">Yuk Soni *</label>
                      <input
                        type="number"
                        min={1}
                        step="any"
                        required
                        className="form-input-clean"
                        placeholder="500"
                        value={productForm.quantity}
                        onChange={e => {
                          let val = e.target.value;
                          if (val.length > 1 && val.startsWith('0') && !val.startsWith('0.') && !val.startsWith('0,')) {
                            val = val.replace(/^0+/, '');
                            if (val === '') val = '0';
                          }
                          setProductForm(prev => ({ ...prev, quantity: val }));
                        }}
                      />
                    </div>

                    <div>
                      <label className="form-label">Birligi</label>
                      <select
                        className="form-select-clean"
                        value={productForm.unit}
                        onChange={e => setProductForm(prev => ({ ...prev, unit: e.target.value }))}
                      >
                        <option value="dona">Dona</option>
                        <option value="quti">Quti</option>
                        <option value="qop">Qop</option>
                        <option value="pallet">Pallet</option>
                        <option value="bochka">Bochka</option>
                        <option value="o'ram">O&apos;ram</option>
                        <option value="kanistr">Kanistr</option>
                        <option value="pachka">Pachka</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Jami Og&apos;irligi (kg da) *</label>
                      <input
                        type="number"
                        min={0.01}
                        step="any"
                        required
                        className="form-input-clean"
                        placeholder="10000"
                        value={productForm.weightKg}
                        onChange={e => {
                          let val = e.target.value;
                          // Keraksiz oldingi nollarni tozalash (masalan 0100 -> 100, lekin 0.5 o'zgarmaydi)
                          if (val.length > 1 && val.startsWith('0') && !val.startsWith('0.') && !val.startsWith('0,')) {
                            val = val.replace(/^0+/, '');
                            if (val === '') val = '0';
                          }
                          setProductForm(prev => ({ ...prev, weightKg: val }));
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '8px', fontSize: '11px', color: '#059669', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <span>
                      ⚡ 1 {productForm.unit} o&apos;rtacha og&apos;irligi:{' '}
                      {Number(productForm.quantity) > 0 && Number(productForm.weightKg) > 0
                        ? (Number(productForm.weightKg) / Number(productForm.quantity)).toFixed(2)
                        : 0}{' '}
                      kg
                    </span>
                    <span style={{ color: '#64748b', fontWeight: 400 }}>
                      💡 Tarozi yoki deklaratsiya bo&apos;yicha aniq og&apos;irlikni kiriting
                    </span>
                  </div>
                </div>

                <div className="form-field" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ color: '#475569', fontSize: '12px' }}>
                    📄 Birlamchi qabul hujjati yoki qo&apos;shimcha izoh (Ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    className="form-input-clean"
                    placeholder="Masalan: Tovar-transport yuk xati №124 / bojxona deklaratsiyasi"
                    value={productForm.notes}
                    onChange={e => setProductForm({ ...productForm, notes: e.target.value })}
                  />
                </div>

                {/* ========================================================
                    SAQLASH USULI VA TARIFI (2-RASMDAGI RASMIY PREYSKURANT 10–19 BANDLAR)
                    ======================================================== */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <label className="form-label" style={{ color: '#002d62', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>❄️📦</span>
                      <span style={{ fontWeight: 800 }}>SAQLASH USULI VA TARIFI *</span>
                    </span>
                    <span style={{ fontSize: '11px', color: '#047857', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                      📅 FAQAT SHU KUNLIK HISOBLANADI
                    </span>
                  </label>
                  <select
                    className="form-select-clean"
                    value={productForm.storageTariffId}
                    onChange={e => setProductForm({ ...productForm, storageTariffId: e.target.value })}
                    required
                    style={{ background: '#ffffff', fontWeight: 700, fontSize: '13px', color: '#002d62', border: '1.5px solid #059669' }}
                  >
                    {customsServices.filter(s => s.category === 'STORAGE').map(s => {
                      const cleanName = s.nameUz || s.name;
                      return (
                        <option key={s.id} value={s.id}>
                          №{s.itemNo}: {cleanName} {canViewFinances ? `— ${s.basePrice.toLocaleString('uz-UZ')} UZS/sutka (+12% QQS) [${s.unit}]` : `[${s.unit}]`}
                        </option>
                      );
                    })}
                  </select>

                  {/* Tanlangan saqlash tarifi kartochkasi */}
                  {(() => {
                    const storSvc = customsServices.find(s => s.id === productForm.storageTariffId) || customsServices.find(s => s.id === 'cs-12');
                    if (!storSvc) return null;
                    return (
                      <div style={{ marginTop: '10px', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '8px', padding: '10px 14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                            📌 Belgilangan Saqlash Usuli (Omborga kirim):
                          </span>
                          <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                            Preyskurant №{storSvc.itemNo} • Kunlik stavka
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                          {storSvc.nameUz || storSvc.name} <span style={{ color: '#64748b', fontSize: '11px' }}>({storSvc.unit})</span>
                        </div>
                        {canViewFinances && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '12px', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                            <div>
                              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Kunlik stavka:</span>
                              <strong style={{ color: '#0f172a' }}>{storSvc.basePrice.toLocaleString('uz-UZ')} UZS</strong>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>12% QQS:</span>
                              <strong style={{ color: '#0284c7' }}>+{storSvc.vatAmount.toLocaleString('uz-UZ')} UZS</strong>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Jami kunlik:</span>
                              <strong style={{ color: '#15803d', fontSize: '13px' }}>{storSvc.totalPrice.toLocaleString('uz-UZ')} UZS</strong>
                            </div>
                          </div>
                        )}
                        <div style={{ fontSize: '11px', color: '#15803d', marginTop: '6px', fontWeight: 600 }}>
                          💡 FAQAT ushbu saqlash xizmati tovar omborda saqlangan kunlariga (kunlar soni × stavka × hajm) qarab chiqimda hisoblanadi. Tushirish, ortish va qo&apos;shimcha xizmatlar esa 1 martalik bo&apos;ladi.
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* ========================================================
                    YUK KELGAN TRANSPORT TURI VA TUSHIRISH (РАЗГРУЗКА)
                    ======================================================== */}
                <div style={{ background: includeKirimUnloading ? '#f8fafc' : '#f1f5f9', border: includeKirimUnloading ? '1.5px solid #cbd5e1' : '1.5px dashed #94a3b8', borderRadius: '10px', padding: '14px', marginBottom: '14px', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>🚛</span>
                      <span style={{ fontWeight: 800, color: '#002d62', fontSize: '13px' }}>
                        YUK KELGAN TRANSPORT TURI VA TUSHIRISH (РАЗГРУЗКА) USULI *
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: includeKirimUnloading ? '#0284c7' : '#64748b', background: includeKirimUnloading ? '#e0f2fe' : '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                        {includeKirimUnloading ? '⚡ 1 MARTALIK TUSHIRISH' : '⛔ XIZMATSIZ (0 UZS)'}
                      </span>
                      {/* YOQISH / O'CHIRISH TOGGLE TUGMASI */}
                      <button
                        type="button"
                        onClick={() => setIncludeKirimUnloading(!includeKirimUnloading)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: includeKirimUnloading ? '1.5px solid #0284c7' : '1.5px solid #64748b',
                          background: includeKirimUnloading ? '#0284c7' : '#ffffff',
                          color: includeKirimUnloading ? '#ffffff' : '#475569',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span>{includeKirimUnloading ? '✅ Yoqilgan' : '❌ O\'chirilgan'}</span>
                      </button>
                    </div>
                  </div>

                  {includeKirimUnloading ? (
                    <>
                      <select
                        className="form-select-clean"
                        value={selectedTransportServiceId}
                        onChange={e => setSelectedTransportServiceId(e.target.value)}
                        required
                        style={{ background: '#ffffff', fontWeight: 700, fontSize: '13px', color: '#002d62', border: '1.5px solid #0284c7' }}
                      >
                        {customsServices.filter(s => s.category === 'UNLOADING_LOADING').map(s => {
                          const cleanName = s.nameUz || s.name;
                          return (
                            <option key={s.id} value={s.id}>
                              №{s.itemNo}: {cleanName} {canViewFinances ? `— ${s.totalPrice.toLocaleString('uz-UZ')} UZS (${s.unit})` : `(${s.unit})`}
                            </option>
                          );
                        })}
                      </select>

                      {/* Preyskurant Hisob-Kitob Kartochkasi */}
                      {(() => {
                        const svc = customsServices.find(s => s.id === selectedTransportServiceId);
                        if (!svc) return null;
                        if (!canViewFinances) {
                          return (
                            <div style={{ marginTop: '10px', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#002d62', textTransform: 'uppercase' }}>
                                📋 Tanlangan Tushirish (Разгрузка) Usuli (1 martalik):
                              </span>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                                №{svc.itemNo}: {svc.nameUz || svc.name} <span style={{ color: '#64748b', fontSize: '11px' }}>({svc.unit})</span>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div style={{ marginTop: '10px', background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '8px', padding: '10px 14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>
                                📋 Tanlangan Tushirish (Разгрузка) — 1 Martalik To&apos;lov:
                              </span>
                              <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                                Preyskurant №{svc.itemNo} • 1 martalik
                              </span>
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                              {svc.nameUz || svc.name} <span style={{ color: '#64748b', fontSize: '11px' }}>({svc.unit})</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '12px', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e0f2fe' }}>
                              <div>
                                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Bazaviy narx (1 martalik):</span>
                                <strong style={{ color: '#0f172a' }}>{svc.basePrice.toLocaleString('uz-UZ')} UZS</strong>
                              </div>
                              <div>
                                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>12% QQS:</span>
                                <strong style={{ color: '#0284c7' }}>+{svc.vatAmount.toLocaleString('uz-UZ')} UZS</strong>
                              </div>
                              <div>
                                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Jami 1 Martalik:</span>
                                <strong style={{ color: '#059669', fontSize: '14px' }}>{svc.totalPrice.toLocaleString('uz-UZ')} UZS</strong>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '6px' }}>
                        ⚡ 1 martalik to&apos;lov: Ushbu yuk tushirish xizmati faqat bir marta hisoblanadi va saqlangan kunlar soniga mutlaqo ko&apos;paytirilmaydi.
                      </span>
                    </>
                  ) : (
                    <div style={{ marginTop: '6px', padding: '12px 14px', background: '#ffffff', border: '1.5px dashed #94a3b8', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>⛔</span>
                      <div style={{ fontSize: '12px', color: '#475569' }}>
                        <strong style={{ color: '#0f172a', display: 'block', marginBottom: '2px' }}>
                          Omborga tushirish (Разгрузка) xizmati o&apos;chirilgan (0 UZS)
                        </strong>
                        Yuk mijoz tomonidan o&apos;z kuchi / o&apos;z texnikasi bilan tushiriladi yoki bu xizmat uchun to&apos;lov olinmaydi.
                      </div>
                    </div>
                  )}
                </div>

                {/* Qo'shimcha Kirim Xizmatlari (1 MARTALIK XIZMATLAR) */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <label className="form-label" style={{ color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🛠️</span>
                      <span>QO&apos;SHIMCHA BOJXONA VA OMBORXONA XIZMATLARI (IXTIYORIY)</span>
                    </span>
                    <span style={{ fontSize: '10px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                      ⚡ 1 MARTALIK (kunlik emas)
                    </span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {customsServices.filter(s => s.category === 'ADDITIONAL').map(item => {
                      const isChecked = selectedKirimAdditionalIds.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: isChecked ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                            background: isChecked ? '#eff6ff' : '#f8fafc',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedKirimAdditionalIds([...selectedKirimAdditionalIds, item.id]);
                              } else {
                                setSelectedKirimAdditionalIds(selectedKirimAdditionalIds.filter(id => id !== item.id));
                              }
                            }}
                            style={{ width: '15px', height: '15px', accentColor: '#2563eb', marginTop: '2px' }}
                          />
                          <div>
                            <strong style={{ color: '#0f172a', display: 'block', fontSize: '11px' }}>
                              №{item.itemNo}: {item.nameUz || item.name}
                            </strong>
                            <span style={{ fontSize: '10px', color: '#64748b' }}>
                              ⚡ 1 martalik ({item.unit}) {canViewFinances ? `• ${item.totalPrice.toLocaleString('uz-UZ')} UZS` : ''}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* FAKTIK QABUL QILISH VA XIZMATLAR QAYDI (PULSIZ, SOF MA'LUMOT) */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>📋</span>
                    <div>
                      <strong style={{ fontSize: '13px', color: '#002d62', display: 'block' }}>
                        Omborga Qabul Qilish va Bajarilgan Xizmatlar Qaydnomasi
                      </strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        Belgilangan yuk miqdori va ko&apos;rsatilgan xizmatlar ombor jurnalida faktik saqlanadi.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer-clean">
                <button type="button" className="btn-secondary" onClick={() => setIsAddProductModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)' }}>
                  📥 Yukni Omborga Qabul Qilishni Tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: FOYDALANUVCHI SKRINSHOTIDAGI OYNA
          OMBORDAN CHIQARISH VA TO'LOVNI HISOBLASH (12% QQS BILAN)
          ======================================================== */}
      {isExitModalOpen && selectedProductToExit && exitBillingCalculation && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '640px' }}>
            <div className="modal-header-clean">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#dc2626', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🏨</span>
                  <span>Ombordan Chiqarish & To&apos;lovni Hisoblash</span>
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {selectedProductToExit.name} • {selectedProductToExit.sectorName} ({selectedProductToExit.clientName || 'Mijoz'})
                </span>
              </div>
              <button onClick={() => setIsExitModalOpen(false)} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
            </div>

            {/* Shartnoma muddati tekshiruvi */}
            {(() => {
              const todayStr = new Date().toISOString().slice(0, 10);
              const payer = payers.find(p => p.id === selectedProductToExit.payerId || p.name.toLowerCase() === selectedProductToExit.clientName?.toLowerCase());
              const isExpired = Boolean(payer && payer.contractEndDate && payer.contractEndDate < todayStr);

              return (
                <form onSubmit={handleConfirmExit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                  <div className="modal-body-clean" style={{ overflowY: 'auto', flex: 1, maxHeight: 'calc(85vh - 120px)' }}>
                    {isExpired && (
                      <div style={{ background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b', fontWeight: 900, fontSize: '13px' }}>
                          <span style={{ fontSize: '18px' }}>⛔</span>
                          <span>SHARTNOMA MUDDATI TUGAGAN! TO&apos;LOV VA CHIQIM BLOKLANGAN</span>
                        </div>
                        <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#b91c1c', lineHeight: 1.5 }}>
                          Ushbu yukning to&apos;lovchisi (<strong>{payer?.name}</strong>) bilan tuzilgan shartnoma (№{payer?.contractNumber}) muddati <strong>{payer?.contractEndDate}</strong> sanasida tugagan!
                          Tizim qoidasiga ko&apos;ra shartnoma muddati o&apos;tgan to&apos;lovchilar to&apos;lov qila olmaydi va tovar chiqarilmaydi.
                          Chiqim qilish uchun avval <strong>«Yuk To&apos;lovchilari»</strong> bo&apos;limida shartnoma muddatini uzaytiring.
                        </p>
                      </div>
                    )}
                {/* Mahsulotning joriy holati (m³ siz, sof birlikda) */}
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>HOZIRGI OMBORDAGI QOLDIQ:</span>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                      {selectedProductToExit.quantity.toLocaleString('uz-UZ')} {selectedProductToExit.unit}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>SAQLANGAN VAQT:</span>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                      {exitBillingCalculation.daysStored} kun ({selectedProductToExit.entryDate} dan beri)
                    </div>
                  </div>
                </div>

                {/* Chiqariladigan soni va aniq og'irligini belgilash (Foydalanuvchi talabi) */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#002d62', marginBottom: '10px', textTransform: 'uppercase' }}>
                    📦 CHIQARILADIGAN YUK JOYI VA ANIQ OG&apos;IRLIGI (KG):
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {/* 1. Joylar soni */}
                    <div>
                      <label className="form-label">
                        JOY / SONI ({selectedProductToExit.unit.toUpperCase()} DA) *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={selectedProductToExit.quantity}
                        required
                        className="form-input-clean"
                        value={exitQuantity === 0 ? '' : exitQuantity}
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          const newQty = Math.min(selectedProductToExit.quantity, Math.max(0, val));
                          setExitQuantity(newQty);
                          const unitWeight = selectedProductToExit.quantity > 0 ? (selectedProductToExit.weightKg / selectedProductToExit.quantity) : 1;
                          setExitWeightKg(Math.round(newQty * unitWeight));
                        }}
                      />
                    </div>

                    {/* 2. Aniq og'irlik (kg da) */}
                    <div>
                      <label className="form-label" style={{ color: '#047857', fontWeight: 800 }}>
                        ⚖️ ANIQ OG&apos;IRLIGI (KG DA) *
                      </label>
                      <input
                        type="number"
                        min={0.1}
                        max={selectedProductToExit.weightKg}
                        step="any"
                        required
                        className="form-input-clean"
                        style={{ border: '1.5px solid #10b981', background: '#f0fdf4', fontWeight: 800, fontSize: '15px', color: '#15803d' }}
                        value={exitWeightKg === 0 ? '' : exitWeightKg}
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          setExitWeightKg(Math.min(selectedProductToExit.weightKg, Math.max(0, val)));
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                    💡 <em>Har bir yuk bir xil og&apos;irlikda bo&apos;lmasligi mumkin. Tarozi ko&apos;rsatkichiga qarab og&apos;irlikni (kg) xohlagancha qo&apos;lda kiritishingiz mumkin.</em>
                  </div>

                  {/* Qulay tezkor ulush tugmalari */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const newQty = Math.max(1, Math.round(selectedProductToExit.quantity * 0.25));
                        setExitQuantity(newQty);
                        const unitWeight = selectedProductToExit.weightKg / selectedProductToExit.quantity;
                        setExitWeightKg(Math.round(newQty * unitWeight));
                      }}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      25% qismi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newQty = Math.max(1, Math.round(selectedProductToExit.quantity * 0.5));
                        setExitQuantity(newQty);
                        const unitWeight = selectedProductToExit.weightKg / selectedProductToExit.quantity;
                        setExitWeightKg(Math.round(newQty * unitWeight));
                      }}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      50% qismi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newQty = Math.max(1, Math.round(selectedProductToExit.quantity * 0.75));
                        setExitQuantity(newQty);
                        const unitWeight = selectedProductToExit.weightKg / selectedProductToExit.quantity;
                        setExitWeightKg(Math.round(newQty * unitWeight));
                      }}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      75% qismi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExitQuantity(selectedProductToExit.quantity);
                        setExitWeightKg(selectedProductToExit.weightKg);
                      }}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', background: '#eff6ff', color: '#2563eb', fontWeight: 700, border: '1px solid #bfdbfe' }}
                    >
                      ⚡ Hammasini (Butunlay)
                    </button>
                  </div>

                  {/* Chiqariladigan og'irlik va qoldiq zaxiraning ko'rsatkichi */}
                  <div style={{ marginTop: '10px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>⚖️ CHIQARILAYOTGAN YUK VA VAZN:</span>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#15803d' }}>
                        {exitBillingCalculation.validWeightKg.toLocaleString('uz-UZ')} kg ({exitBillingCalculation.validQty} {selectedProductToExit.unit})
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>OMBORDAGI QOLDIQ:</span>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                        {exitBillingCalculation.remainingQty.toLocaleString('uz-UZ')} {selectedProductToExit.unit} ({exitBillingCalculation.remainingWeightKg.toLocaleString('uz-UZ')} kg)
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================
                    1. OMBORGA TUSHIRISH (РАЗГРУЗКА) XIZMATI (FOYDALANUVCHI TALABI)
                    ======================================================== */}
                <div style={{ background: includeExitUnloading ? '#f8fafc' : '#f1f5f9', border: includeExitUnloading ? '1.5px solid #cbd5e1' : '1.5px dashed #94a3b8', borderRadius: '10px', padding: '14px', marginBottom: '14px', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#002d62', fontWeight: 800, fontSize: '13px' }}>
                      <span>📥</span>
                      <span>1. OMBORGA TUSHIRISH (РАЗГРУЗКА) XIZMATI *</span>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', background: includeExitUnloading ? '#eff6ff' : '#e2e8f0', color: includeExitUnloading ? '#1d4ed8' : '#64748b', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                        {includeExitUnloading ? '⚡ 1 MARTALIK TO\'LOV' : '⛔ TO\'LOV YO\'Q (0 UZS)'}
                      </span>
                      {/* TOGGLE TUGMASI */}
                      <button
                        type="button"
                        onClick={() => setIncludeExitUnloading(!includeExitUnloading)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: includeExitUnloading ? '1.5px solid #1d4ed8' : '1.5px solid #64748b',
                          background: includeExitUnloading ? '#1d4ed8' : '#ffffff',
                          color: includeExitUnloading ? '#ffffff' : '#475569',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span>{includeExitUnloading ? '✅ Yoqilgan' : '❌ O\'chirilgan'}</span>
                      </button>
                    </div>
                  </div>

                  {includeExitUnloading ? (
                    <>
                      <select
                        className="form-select-clean"
                        value={selectedUnloadingServiceId}
                        onChange={e => setSelectedUnloadingServiceId(e.target.value)}
                        required
                        style={{ background: '#ffffff', fontWeight: 600 }}
                      >
                        {customsServices.filter(s => s.category === 'UNLOADING_LOADING').map(s => {
                          const cleanName = (s.nameUz || s.name)
                            .replace('ortish / tushirish', 'tushirish (Разгрузка)')
                            .replace('yuklash / tushirish', 'tushirish (Разгрузка)')
                            .replace('tushirish/ortish', 'tushirish (Разгрузка)');
                          return (
                            <option key={s.id} value={s.id}>
                              {cleanName} ({s.unit}) {canViewFinances ? `— ${s.basePrice.toLocaleString('uz-UZ')} UZS (+12% QQS) [1 martalik]` : ''}
                            </option>
                          );
                        })}
                      </select>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                        ⚡ 1 martalik to&apos;lov: Ushbu yuk tushirish (разгрузка) xizmati bir martalik bo&apos;lib, saqlangan kunlar soniga mutlaqo ko&apos;paytirilmaydi.
                      </span>
                    </>
                  ) : (
                    <div style={{ marginTop: '4px', padding: '10px 12px', background: '#ffffff', border: '1.5px dashed #94a3b8', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
                      <span style={{ fontSize: '18px' }}>⛔</span>
                      <div>
                        <strong style={{ color: '#0f172a' }}>Omborga tushirish (Разгрузка) xizmati hisoblanmaydi (0 UZS)</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Mijoz o&apos;z kuchi bilan tushirgan yoki oldindan to&apos;langan. Chiqim hisobiga kiritilmaydi.</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ========================================================
                    2. SAQLASH TARIFI (2-RASMDAGI RASMIY PREYSKURANT 10-19 BANDLAR) (FOYDALANUVCHI TALABI)
                    ======================================================== */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <label className="form-label" style={{ color: '#002d62', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📦</span>
                      <span>2. SAQLASH TARIFI *</span>
                    </span>
                    <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                      📅 {exitBillingCalculation.daysStored} KUN SAQLANGAN (FAQAT SHU KUNIGA HISOBLANADI)
                    </span>
                  </label>
                  <select
                    className="form-select-clean"
                    value={selectedStorageTariffId}
                    onChange={e => setSelectedStorageTariffId(e.target.value)}
                    required
                    style={{ background: '#ffffff', fontWeight: 600 }}
                  >
                    {customsServices.filter(s => s.category === 'STORAGE').map(s => {
                      const cleanName = s.nameUz || s.name;
                      return (
                        <option key={s.id} value={s.id}>
                          №{s.itemNo}: {cleanName} ({s.unit}) {canViewFinances ? `— ${s.basePrice.toLocaleString('uz-UZ')} UZS/sutka (+12% QQS)` : ''}
                        </option>
                      );
                    })}
                  </select>
                  {canViewFinances && (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#0369a1', background: '#f0f9ff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #bae6fd' }}>
                      Hisoblash formulasi: <strong>{exitBillingCalculation.storageFormulaText}</strong> = <strong>{exitBillingCalculation.storageBase.toLocaleString('uz-UZ')} UZS</strong> (+12% QQS: {exitBillingCalculation.storageVat.toLocaleString('uz-UZ')} UZS = <strong>{exitBillingCalculation.storageTotal.toLocaleString('uz-UZ')} UZS</strong>)
                    </div>
                  )}
                </div>

                {/* ========================================================
                    3. YUKNI ORTISH VA YUKLASH (ПОГРУЗКА) TRANSPORT TURI (FOYDALANUVCHI TALABI)
                    ======================================================== */}
                <div style={{ background: includeExitLoading ? '#f8fafc' : '#f1f5f9', border: includeExitLoading ? '1.5px solid #cbd5e1' : '1.5px dashed #94a3b8', borderRadius: '10px', padding: '14px', marginBottom: '14px', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#002d62', fontWeight: 800, fontSize: '13px' }}>
                      <span>🚛</span>
                      <span>3. YUKNI ORTISH VA YUKLASH (ПОГРУЗКА) TRANSPORT TURI *</span>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', background: includeExitLoading ? '#eff6ff' : '#e2e8f0', color: includeExitLoading ? '#1d4ed8' : '#64748b', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                        {includeExitLoading ? '⚡ 1 MARTALIK TO\'LOV' : '⛔ TO\'LOV YO\'Q (0 UZS)'}
                      </span>
                      {/* TOGGLE TUGMASI */}
                      <button
                        type="button"
                        onClick={() => setIncludeExitLoading(!includeExitLoading)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: includeExitLoading ? '1.5px solid #1d4ed8' : '1.5px solid #64748b',
                          background: includeExitLoading ? '#1d4ed8' : '#ffffff',
                          color: includeExitLoading ? '#ffffff' : '#475569',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span>{includeExitLoading ? '✅ Yoqilgan' : '❌ O\'chirilgan'}</span>
                      </button>
                    </div>
                  </div>

                  {includeExitLoading ? (
                    <>
                      <select
                        className="form-select-clean"
                        value={selectedLoadingServiceId}
                        onChange={e => setSelectedLoadingServiceId(e.target.value)}
                        required
                        style={{ background: '#ffffff', fontWeight: 600 }}
                      >
                        {customsServices.filter(s => s.category === 'UNLOADING_LOADING').map(s => {
                          const cleanName = (s.nameUz || s.name)
                            .replace('ortish / tushirish', 'ortish (Погрузка)')
                            .replace('yuklash / tushirish', 'ortish (Погрузка)')
                            .replace('tushirish/ortish', 'ortish (Погрузка)');
                          return (
                            <option key={s.id} value={s.id}>
                              {cleanName} ({s.unit}) {canViewFinances ? `— ${s.basePrice.toLocaleString('uz-UZ')} UZS (+12% QQS) [1 martalik]` : ''}
                            </option>
                          );
                        })}
                      </select>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                        ⚡ 1 martalik to&apos;lov: Ushbu yuk ortish (погрузка) xizmati bir martalik bo&apos;lib, saqlangan kunlar soniga mutlaqo ko&apos;paytirilmaydi.
                      </span>
                    </>
                  ) : (
                    <div style={{ marginTop: '4px', padding: '10px 12px', background: '#ffffff', border: '1.5px dashed #94a3b8', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
                      <span style={{ fontSize: '18px' }}>⛔</span>
                      <div>
                        <strong style={{ color: '#0f172a' }}>Yukni ortish (Погрузка) xizmati hisoblanmaydi (0 UZS)</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Mijoz o&apos;z kuchi / o&apos;z texnikasi bilan yuklaydi. Chiqim hisobiga kiritilmaydi.</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* QO'SHIMCHA CHIQIM VA BOJXONA XIZMATLARI (⚡ 1 MARTALIK) */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <label className="form-label" style={{ color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🛠️</span>
                      <span>QO&apos;SHIMCHA CHIQIM VA BOJXONA XIZMATLARI (IXTIYORIY)</span>
                    </span>
                    <span style={{ fontSize: '10px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                      ⚡ 1 MARTALIK XIZMATLAR (kunlik emas)
                    </span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {customsServices.filter(s => s.category === 'ADDITIONAL').map(item => {
                      const isChecked = selectedChiqimAdditionalIds.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: isChecked ? '1.5px solid #dc2626' : '1px solid #e2e8f0',
                            background: isChecked ? '#fef2f2' : '#f8fafc',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedChiqimAdditionalIds([...selectedChiqimAdditionalIds, item.id]);
                              } else {
                                setSelectedChiqimAdditionalIds(selectedChiqimAdditionalIds.filter(id => id !== item.id));
                              }
                            }}
                            style={{ width: '15px', height: '15px', accentColor: '#dc2626', marginTop: '2px' }}
                          />
                          <div>
                            <strong style={{ color: '#0f172a', display: 'block', fontSize: '11px' }}>
                              №{item.itemNo}: {item.nameUz || item.name}
                            </strong>
                            <span style={{ fontSize: '10px', color: '#64748b' }}>
                              ⚡ 1 martalik ({item.unit}) {canViewFinances ? `• ${item.totalPrice.toLocaleString('uz-UZ')} UZS` : ''}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* TO'LOV BLOKI: FAQAT canViewFinances HUQUQI BO'LGAN SHAXSLARGA KO'RINADI */}
                {canViewFinances ? (
                  <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#166534', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>💰</span>
                        <span>SAQLASH TARIFI VA TO&apos;LOVLAR HISOBI</span>
                      </span>
                      <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        {exitBillingCalculation.storageSvc.nameUz || exitBillingCalculation.storageSvc.name} (12% QQS)
                      </span>
                    </div>

                    {/* Ko'rsatkichlar */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '12px 0', fontSize: '12px' }}>
                      <div>
                        <span style={{ color: '#166534', fontSize: '11px' }}>Kunlik Stavka:</span>
                        <strong style={{ display: 'block', color: '#0f172a', fontSize: '14px', marginTop: '2px' }}>
                          {exitBillingCalculation.storageSvc.basePrice.toLocaleString('uz-UZ')} UZS / {exitBillingCalculation.storageSvc.unit}
                        </strong>
                      </div>

                      <div>
                        <span style={{ color: '#166534', fontSize: '11px' }}>Turgan Vaqti:</span>
                        <strong style={{ display: 'block', color: '#0f172a', fontSize: '14px', marginTop: '2px' }}>
                          {exitBillingCalculation.daysStored} kun
                        </strong>
                      </div>

                      <div>
                        <span style={{ color: '#166534', fontSize: '11px' }}>Chiqarilayotgan Miqdor:</span>
                        <strong style={{ display: 'block', color: '#0f172a', fontSize: '14px', marginTop: '2px' }}>
                          {exitBillingCalculation.validQty.toLocaleString('uz-UZ')} {exitBillingCalculation.unit}
                        </strong>
                      </div>
                    </div>

                    {/* Saqlash va xizmatlar summasi: 5 ustun */}
                    <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: '10px', marginTop: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', fontSize: '11px', color: '#334155', marginBottom: '10px' }}>
                        <div>
                          <span style={{ color: '#166534' }}>1. Tushirish (⚡ 1 martalik):</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: includeExitUnloading ? '#0284c7' : '#94a3b8', marginTop: '2px' }}>
                            {includeExitUnloading ? `${exitBillingCalculation.unloadingBase.toLocaleString('uz-UZ')} UZS` : '0 UZS (O\'chirilgan)'}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#166534' }}>2. Saqlash (📅 {exitBillingCalculation.daysStored} kun):</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a', marginTop: '2px' }}>
                            {exitBillingCalculation.storageBase.toLocaleString('uz-UZ')} UZS
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#166534' }}>3. Ortish (⚡ 1 martalik):</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: includeExitLoading ? '#0284c7' : '#94a3b8', marginTop: '2px' }}>
                            {includeExitLoading ? `${exitBillingCalculation.loadingBase.toLocaleString('uz-UZ')} UZS` : '0 UZS (O\'chirilgan)'}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#166534' }}>Qo&apos;shimcha (⚡ 1 martalik):</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a', marginTop: '2px' }}>
                            {exitBillingCalculation.additionalExitBase.toLocaleString('uz-UZ')} UZS
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#166534' }}>12% QQS miqdori:</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0070ba', marginTop: '2px' }}>
                            {exitBillingCalculation.totalVat.toLocaleString('uz-UZ')} UZS
                          </strong>
                        </div>
                      </div>

                      <div style={{ fontSize: '11px', color: '#15803d', marginBottom: '8px', background: 'rgba(255,255,255,0.7)', padding: '6px 10px', borderRadius: '6px', border: '1px solid #86efac' }}>
                        💡 <strong>Hisoblash qoidasi:</strong> Tushirish, Ortish va Qo&apos;shimcha xizmatlar 1 martalik to&apos;lov bo&apos;lib, saqlash kuniga ko&apos;paytirilmaydi. <strong>FAQAT Saqlash xizmati</strong> tovar omborda turgan kunlar soniga ({exitBillingCalculation.daysStored} kun) ko&apos;paytirilib hisoblangan.
                      </div>

                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '1px solid #86efac', paddingTop: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#14532d' }}>Mijoz To&apos;lashi Kerak Bo&apos;lgan Jami Summa:</span>
                        <span style={{ fontSize: '24px', fontWeight: 900, color: '#15803d' }}>
                          {exitBillingCalculation.totalCost.toLocaleString('uz-UZ')} UZS
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        🔒
                      </div>
                      <div>
                        <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                          Moliyaviy Hisob-Kitob (Moliya Bo&apos;limi Boshqaruvida)
                        </strong>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          Sizda pul va to&apos;lov ma&apos;lumotlarini ko&apos;rish ruxsati mavjud emas. Chiqim miqdori ({exitBillingCalculation.validQty} {selectedProductToExit.unit}, {exitBillingCalculation.validWeightKg.toLocaleString('uz-UZ')} kg) ombordan chiqarish uchun faktik qayd etiladi.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* YUKNI QABUL QILUVCHI / CHIQARILAYOTGAN TASHKILOT INN RAQAMI (User qabul qiluvchilarni qo'shmaydi va ko'ra olmaydi) */}
                {!isUser ? (
                  <div style={{ background: '#f0f9ff', border: '1.5px solid #7dd3fc', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#0369a1', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' }}>
                      <span>🏢</span>
                      <span>YUKNI QABUL QILIB OLUVCHI KORXONA VA STIR (INN) RAQAMI:</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <label className="form-label" style={{ color: '#0284c7', fontWeight: 800 }}>
                          STIR (INN) RAQAMI *
                        </label>
                        <input
                          type="text"
                          required
                          className="form-input-clean"
                          placeholder="Masalan: 308942115"
                          style={{ border: '1.5px solid #0284c7', fontWeight: 800, color: '#002d62', background: '#ffffff' }}
                          value={exitReceiverInn}
                          onChange={e => {
                            const innVal = e.target.value.trim();
                            setExitReceiverInn(innVal);
                            const matched = payers.find(p => p.inn === innVal);
                            if (matched) {
                              setExitReceiverName(matched.name);
                              if (matched.contactPerson) setExitReceiverPerson(matched.contactPerson);
                            }
                          }}
                        />
                      </div>

                      <div>
                        <label className="form-label">QABUL QILUVCHI KORXONA NOMI *</label>
                        <input
                          type="text"
                          required
                          className="form-input-clean"
                          placeholder="Masalan: Sag Agro Logistika MChJ"
                          value={exitReceiverName}
                          onChange={e => setExitReceiverName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">YUKNI TOPSHIRIB OLUVCHI VAKIL (F.I.SH VA ISHONCHNOMA)</label>
                      <input
                        type="text"
                        className="form-input-clean"
                        placeholder="Masalan: Aziz Rahimov (Ishonchnoma №14/B)"
                        value={exitReceiverPerson}
                        onChange={e => setExitReceiverPerson(e.target.value)}
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: '#0284c7', display: 'block', marginTop: '6px' }}>
                      * Ushbu STIR (INN) va vakil ma&apos;lumotlari rasmiy Chiqim Nakladnoyida aks ettiriladi.
                    </span>
                  </div>
                ) : (
                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px', fontSize: '12px' }}>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                      📦 Chiqarilayotgan Yuk:
                    </span>
                    <strong style={{ color: '#0f172a', fontSize: '13px' }}>
                      {selectedProductToExit.name}
                    </strong>
                    <div style={{ color: '#475569', marginTop: '4px' }}>
                      Mijoz (Shartnoma): <strong>{selectedProductToExit.clientName}</strong>
                    </div>
                  </div>
                )}

                <div className="form-field">
                  <label className="form-label">CHIQIM HUJJATI / ASOS / IZOH</label>
                  <input
                    type="text"
                    className="form-input-clean"
                    placeholder="Masalan: Shartnoma №44, Hisob-faktura №105"
                    value={exitNotes}
                    onChange={e => setExitNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer-clean">
                <button type="button" className="btn-secondary" onClick={() => setIsExitModalOpen(false)}>Bekor qilish</button>
                <button 
                  type="submit" 
                  disabled={isExpired}
                  className="btn-primary" 
                  style={{ 
                    background: isExpired ? '#94a3b8' : '#dc2626',
                    cursor: isExpired ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isExpired ? '🔒 Chiqim Bloklangan (Shartnoma Tugagan)' : (canViewFinances ? '📤 Chiqimni Tasdiqlash & Nakladnoy Chiqarish' : '📤 Yukni Ombordan Chiqarish')}
                </button>
              </div>
            </form>
          );
        })()}
      </div>
    </div>
  )}

      {/* ========================================================
          MODAL 4: TARIFNI IKKI YOKI BIR NECHTA SEKTORGA BIRIKTIRISH
          ======================================================== */}
      {isAssignTariffModalOpen && selectedTariffToAssign && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header-clean">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  🔗 Tarifni Sektorlarga Ulash
                </h3>
                <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700 }}>
                  {selectedTariffToAssign.name} ({selectedTariffToAssign.pricePerUnitDay.toLocaleString('uz-UZ')} UZS / 1 {selectedTariffToAssign.unitName} / kun)
                </span>
              </div>
              <button onClick={() => setIsAssignTariffModalOpen(false)} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
            </div>

            <div className="modal-body-clean">
              <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 14px 0' }}>
                Quyidagi ro&apos;yxatdan ushbu tarifni qaysi sektor(lar)ga ulashni xohlasangiz belgilang:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {warehouse.sectors.map(sec => {
                  const isChecked = assignedSectorIds.includes(sec.id);
                  const isCurrent = sec.tariffId === selectedTariffToAssign.id;

                  return (
                    <label
                      key={sec.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: isChecked ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                        background: isChecked ? '#eff6ff' : '#f8fafc',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setAssignedSectorIds([...assignedSectorIds, sec.id]);
                            } else {
                              setAssignedSectorIds(assignedSectorIds.filter(id => id !== sec.id));
                            }
                          }}
                          style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                        />
                        <div>
                          <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>{sec.name}</strong>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>{sec.code} • {sec.temperature || 'Standart'}</span>
                        </div>
                      </div>

                      <span style={{ fontSize: '11px', color: isCurrent ? '#059669' : '#64748b', fontWeight: 600 }}>
                        {isCurrent ? '● Hozirgi tarifi shu' : `Hozirgi: ${sec.tariffName || 'Biriktirilmagan'}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer-clean">
              <button type="button" className="btn-secondary" onClick={() => setIsAssignTariffModalOpen(false)}>Bekor qilish</button>
              <button
                type="button"
                onClick={handleSaveTariffAssignment}
                className="btn-primary"
              >
                Ulashni Tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: TARIFNI QO'SHISH / TAHRIRLASH
          ======================================================== */}
      {isTariffEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header-clean">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingTariff ? `✏️ Tarifni Tahrirlash: ${editingTariff.name}` : '➕ Yangi Tarif Yaratish'}
              </h3>
              <button onClick={() => setIsTariffEditModalOpen(false)} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleSaveTariff}>
              <div className="modal-body-clean">
                <div className="form-field">
                  <label className="form-label">TARIF NOMI *</label>
                  <input
                    type="text"
                    required
                    className="form-input-clean"
                    value={tariffForm.name}
                    onChange={e => setTariffForm({ ...tariffForm, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">KUNLIK NARXI (UZS DA) *</label>
                    <input
                      type="number"
                      min={1}
                      required
                      className="form-input-clean"
                      value={tariffForm.pricePerUnitDay}
                      onChange={e => setTariffForm({ ...tariffForm, pricePerUnitDay: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="form-label">O&apos;LCHOV BIRLIGI *</label>
                    <input
                      type="text"
                      required
                      className="form-input-clean"
                      placeholder="Masalan: kg, qop, pallet"
                      value={tariffForm.unitName}
                      onChange={e => setTariffForm({ ...tariffForm, unitName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">MINIMAL SAQLASH MUDDATI (KUN)</label>
                  <input
                    type="number"
                    min={1}
                    className="form-input-clean"
                    value={tariffForm.minDays}
                    onChange={e => setTariffForm({ ...tariffForm, minDays: Number(e.target.value) })}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">TARIF SHARTLARI VA XUSUSIYATLARI (VERGUL BILAN)</label>
                  <textarea
                    rows={2}
                    className="form-input-clean"
                    value={tariffForm.features}
                    onChange={e => setTariffForm({ ...tariffForm, features: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-clean">
                <button type="button" className="btn-secondary" onClick={() => setIsTariffEditModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="btn-primary">Tarifni Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 6: SUPER ADMIN UCHUN XODIM QO'SHISH VA HUQUQLARNI BELGILASH
          - Ochiq registratsiya yo'q!
          - Faqat Super Admin user yoki adminlarni qo'sha oladi
          - Super Admingina user yoki adminlarga nima bilan ishlashini belgilab beradi:
            * Omborni sozlash
            * Tarif qo'shish
            * Tariflarni omborga bog'lash
            * Xavfli yuklar bilan ishlash ruxsati (canHandleHazardous)
            * Ruxsat etilgan sektorlar (allowedSectorIds)
          ======================================================== */}
      {isUserModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '580px' }}>
            <div className="modal-header-clean">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {editingUser ? `⚙️ Xodim Huquqlari: ${editingUser.fullName}` : '➕ Yangi Xodim / Admin Qo\'shish'}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Faqat Super Admin xodimlarni qo&apos;shishi va vakolatlarini belgilashi mumkin
                </span>
              </div>
              <button onClick={() => setIsUserModalOpen(false)} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleSaveUser}>
              <div className="modal-body-clean">
                {/* Asosiy ma'lumotlar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">XODIM F.I.SH *</label>
                    <input
                      type="text"
                      required
                      className="form-input-clean"
                      placeholder="Masalan: Aziz Rahimov"
                      value={userForm.fullName}
                      onChange={e => setUserForm({ ...userForm, fullName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">TIZIMDAGI ROLI *</label>
                    <select
                      className="form-select-clean"
                      value={userForm.role}
                      onChange={e => {
                        const newRole = e.target.value as UserRole;
                        if (newRole === 'ADMIN') {
                          setUserForm({
                            ...userForm,
                            role: newRole,
                            canManageTariffs: true,
                            canManageWarehouse: true,
                            canLinkTariffs: true,
                            canStockMovement: true
                          });
                        } else if (newRole === 'ACCOUNTANT') {
                          setUserForm({
                            ...userForm,
                            role: newRole,
                            canManageTariffs: false,
                            canManageWarehouse: false,
                            canLinkTariffs: false,
                            canStockMovement: false,
                            canHandleHazardous: false,
                            canViewFinances: true,
                            allowedSectorIds: ['ALL']
                          });
                        } else if (newRole === 'USER') {
                          setUserForm({
                            ...userForm,
                            role: newRole,
                            canManageTariffs: false,
                            canManageWarehouse: false,
                            canLinkTariffs: false,
                            canStockMovement: true,
                            canHandleHazardous: false,
                            canViewFinances: false
                          });
                        } else {
                          setUserForm({ ...userForm, role: newRole });
                        }
                      }}
                    >
                      <option value="USER">👤 USER (Omborchi / Xodim)</option>
                      <option value="ADMIN">🛡️ ADMIN (Katta Omborchi / Boshqaruvchi)</option>
                      <option value="ACCOUNTANT">💼 ACCOUNTANT (Bosh Buxgalter / Moliya)</option>
                      <option value="SUPER_ADMIN">👑 SUPER ADMIN (Bosh Rahbar)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                  <div>
                    <label className="form-label">ELEKTRON POCHTA (LOGIN) *</label>
                    <input
                      type="email"
                      required
                      className="form-input-clean"
                      placeholder="xodim@uzw.uz"
                      value={userForm.email}
                      onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">PAROL *</label>
                    <input
                      type="text"
                      required
                      className="form-input-clean"
                      value={userForm.password}
                      onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                    />
                  </div>
                </div>

                {/* VAKOLATLAR VA HUQUQLAR (SUPER ADMIN BELGILAB BERADI) */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🛡️</span>
                      <span>Super Admin Belgilaydigan Huquqlar (Vakolatlar)</span>
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Har bir xodim uchun alohida sozlanadi
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* 1. Omborni sozlash */}
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1e293b' }}>
                      <input
                        type="checkbox"
                        checked={userForm.canManageWarehouse}
                        onChange={e => setUserForm({ ...userForm, canManageWarehouse: e.target.checked })}
                        style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#2563eb' }}
                      />
                      <div>
                        <strong>🏢 Omborni sozlash va yangi sektorlar ochish</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                          Yangi sektorlar qo&apos;shish, sektor nomlari, harorat va o&apos;lchamlarini tahrirlash huquqi.
                        </span>
                      </div>
                    </label>

                    {/* 2. Tarif qo'shish */}
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1e293b' }}>
                      <input
                        type="checkbox"
                        checked={userForm.canManageTariffs}
                        onChange={e => setUserForm({ ...userForm, canManageTariffs: e.target.checked })}
                        style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#2563eb' }}
                      />
                      <div>
                        <strong>🏷️ Saqlash tariflarini qo&apos;shish va narx belgilash</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                          Yangi kunlik tariflar yaratish va saqlash narxlarini tahrirlash huquqi.
                        </span>
                      </div>
                    </label>

                    {/* 3. Tariflarni omborga bog'lash */}
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1e293b' }}>
                      <input
                        type="checkbox"
                        checked={userForm.canLinkTariffs}
                        onChange={e => setUserForm({ ...userForm, canLinkTariffs: e.target.checked })}
                        style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#2563eb' }}
                      />
                      <div>
                        <strong>🔗 Tariflarni ombor sektorlariga biriktirish / ulash</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                          Istalgan tarifni xohlagan sektorlarga biriktirish vakolati.
                        </span>
                      </div>
                    </label>

                    {/* 4. Kirim/Chiqim */}
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1e293b' }}>
                      <input
                        type="checkbox"
                        checked={userForm.canStockMovement}
                        onChange={e => setUserForm({ ...userForm, canStockMovement: e.target.checked })}
                        style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#2563eb' }}
                      />
                      <div>
                        <strong>📦 Yuk kirim va chiqim amallarini bajarish</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                          Omborga yangi yuk kiritish va mavjud yukni chiqarish (hisob-kitob qilish) huquqi.
                        </span>
                      </div>
                    </label>

                    {/* 5. XAVFLI YUKLAR BILAN ISHLASH (FOYDALANUVCHINING ASOSIY TALABI) */}
                    <div style={{ background: userForm.canHandleHazardous ? '#ecfdf5' : '#fff1f2', border: userForm.canHandleHazardous ? '1px solid #a7f3d0' : '1.5px solid #fecdd3', borderRadius: '8px', padding: '10px 12px', marginTop: '4px' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: userForm.canHandleHazardous ? '#065f46' : '#9f1239' }}>
                        <input
                          type="checkbox"
                          checked={userForm.canHandleHazardous}
                          onChange={e => setUserForm({ ...userForm, canHandleHazardous: e.target.checked })}
                          style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#e11d48' }}
                        />
                        <div>
                          <strong>☣️ XAVFLI YUKLAR BILAN ISHLASH RUXSATI (SERTIFIKAT)</strong>
                          <span style={{ display: 'block', fontSize: '11px', marginTop: '2px', color: userForm.canHandleHazardous ? '#047857' : '#be123c', fontWeight: 600 }}>
                            {userForm.canHandleHazardous
                              ? '✅ Ushbu xodim xavfli yuklar va kimyoviy moddalar sektori bilan ishlay oladi.'
                              : '⛔ DIQQAT: Ushbu ruxsat belgilanmasa, xodim xavfli yuklar sektoriga yuk kirita olmaydi va chiqara olmaydi!'}
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* 6. MOLIYAVIY TO'LOVLAR VA PUL MA'LUMOTLARINI KO'RISH RUXSATI (FOYDALANUVCHI TALABI) */}
                    <div style={{ background: userForm.canViewFinances ? '#eff6ff' : '#f8fafc', border: userForm.canViewFinances ? '1.5px solid #93c5fd' : '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', marginTop: '4px' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: userForm.canViewFinances ? '#1e40af' : '#334155' }}>
                        <input
                          type="checkbox"
                          checked={userForm.canViewFinances}
                          onChange={e => setUserForm({ ...userForm, canViewFinances: e.target.checked })}
                          style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#2563eb' }}
                        />
                        <div>
                          <strong>💰 PUL VA MOLIYAVIY TO&apos;LOVLARNI KO&apos;RISH RUXSATI</strong>
                          <span style={{ display: 'block', fontSize: '11px', marginTop: '2px', color: userForm.canViewFinances ? '#1d4ed8' : '#64748b', fontWeight: 600 }}>
                            {userForm.canViewFinances
                              ? '✅ Ushbu xodimga to\'lov summalari, tarif narxlari va to\'lov hisoblari ko\'rinadi.'
                              : '🔒 Pul ma\'lumotlari yashirilgan: Xodimga to\'lov summalari va narxlar ko\'rsatilmaydi, u faqat yuk soni, og\'irligi va faktik ma\'lumotlarni belgilaydi.'}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 6. USER FAQAT O'ZIDA HUQUQI BO'LGAN OMBORLARGA QO'YA OLADI (SEKTORLARNI BIRIKTIRISH) */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                      📍 Xodimga Ruxsat Berilgan Sektorlar:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (userForm.allowedSectorIds.includes('ALL')) {
                          setUserForm({ ...userForm, allowedSectorIds: ['sec-2'] });
                        } else {
                          setUserForm({ ...userForm, allowedSectorIds: ['ALL'] });
                        }
                      }}
                      style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {userForm.allowedSectorIds.includes('ALL') ? 'Alohida tanlash' : '⚡ Barchasiga ruxsat berish (ALL)'}
                    </button>
                  </div>

                  <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 10px 0' }}>
                    User faqat o&apos;zida huquqi bo&apos;lgan ombor/sektorlarga yuk qo&apos;ya oladi.
                  </p>

                  {userForm.allowedSectorIds.includes('ALL') ? (
                    <div style={{ padding: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '12px', color: '#1d4ed8', fontWeight: 700 }}>
                      ✅ Barcha ombor sektorlari bilan ishlash huquqi berildi (Cheklovsiz).
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {warehouse.sectors.map(sec => {
                        const isChecked = userForm.allowedSectorIds.includes(sec.id);
                        return (
                          <label
                            key={sec.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              border: isChecked ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                              background: isChecked ? '#f0fdf4' : '#f8fafc',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => {
                                if (e.target.checked) {
                                  setUserForm({
                                    ...userForm,
                                    allowedSectorIds: [...userForm.allowedSectorIds.filter(id => id !== 'ALL'), sec.id]
                                  });
                                } else {
                                  setUserForm({
                                    ...userForm,
                                    allowedSectorIds: userForm.allowedSectorIds.filter(id => id !== sec.id)
                                  });
                                }
                              }}
                              style={{ width: '15px', height: '15px', accentColor: '#2563eb' }}
                            />
                            <div>
                              <strong style={{ color: '#0f172a', display: 'block' }}>{sec.name}</strong>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>{sec.code} • {sec.type}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer-clean">
                <button type="button" className="btn-secondary" onClick={() => setIsUserModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Saqlash va Tasdiqlash' : 'Xodimni Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 8: BOJXONA XIZMATINI QO'SHISH / TAHRIRLASH
          ======================================================== */}
      {isCustomsServiceModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '580px' }}>
            <div className="modal-header-clean">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {editingCustomsService ? `✏️ Xizmat Narxini Tahrirlash: ${editingCustomsService.name}` : '➕ Yangi Bojxona Xizmati Qo\'shish'}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  «JB GROUP» Bojxona ombori rasmiy preyskurantiga o&apos;zgartirish kiritish
                </span>
              </div>
              <button onClick={() => setIsCustomsServiceModalOpen(false)} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleSaveCustomsService}>
              <div className="modal-body-clean">
                {/* Kategoriya */}
                <div className="form-field">
                  <label className="form-label">XIZMAT KATEGORIYASI (BO&apos;LIMI) *</label>
                  <select
                    className="form-select-clean"
                    value={customsServiceForm.category}
                    onChange={e => setCustomsServiceForm({ ...customsServiceForm, category: e.target.value as CustomsServiceCategory })}
                    required
                  >
                    <option value="UNLOADING_LOADING">🏗️ Ortish-tushirish (РАЗГРУЗКА/ПОГРУЗКА)</option>
                    <option value="STORAGE">❄️ Bojxona omborida saqlash (ХРАНЕНИЕ)</option>
                    <option value="ADDITIONAL">🛠️ Qo&apos;shimcha xizmatlar (ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ)</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">XIZMAT NOMI (RUS TILIDA - PREYSKURANT BO&apos;YICHA) *</label>
                  <input
                    type="text"
                    required
                    className="form-input-clean"
                    placeholder="Masalan: Фypa до 90 m3 (kara bilan)"
                    value={customsServiceForm.name}
                    onChange={e => setCustomsServiceForm({ ...customsServiceForm, name: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">XIZMAT NOMI (O&apos;ZBEK TILIDA)</label>
                  <input
                    type="text"
                    className="form-input-clean"
                    placeholder="Masalan: Fura 90 m3 gacha (kara orqali tushirish)"
                    value={customsServiceForm.nameUz}
                    onChange={e => setCustomsServiceForm({ ...customsServiceForm, nameUz: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">BAZAVIY NARX (QQS SIZ, UZS) *</label>
                    <input
                      type="number"
                      min={0}
                      required
                      className="form-input-clean"
                      value={customsServiceForm.basePrice}
                      onChange={e => setCustomsServiceForm({ ...customsServiceForm, basePrice: Number(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label className="form-label">O&apos;LCHOV BIRLIGI *</label>
                    <input
                      type="text"
                      required
                      className="form-input-clean"
                      placeholder="1 fura, 1 tn, 1 sutka, 1 pm"
                      value={customsServiceForm.unit}
                      onChange={e => setCustomsServiceForm({ ...customsServiceForm, unit: e.target.value })}
                    />
                  </div>
                </div>

                {/* 12% QQS Dinamik ko'rsatkichi */}
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>12% QQS (NDS) MIQDORI:</span>
                    <strong style={{ fontSize: '13px', color: '#0070ba' }}>
                      {Math.round(customsServiceForm.basePrice * 0.12).toLocaleString('uz-UZ')} UZS
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 800 }}>JAMI TO&apos;LOV (QQS BILAN):</span>
                    <strong style={{ fontSize: '16px', color: '#047857', fontWeight: 900 }}>
                      {Math.round(customsServiceForm.basePrice * 1.12).toLocaleString('uz-UZ')} UZS
                    </strong>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">QO&apos;SHIMCHA TAVSIF / SHARTLAR</label>
                  <textarea
                    rows={2}
                    className="form-input-clean"
                    placeholder="Xizmat ko'rsatish shartlari yoki texnik izohlar..."
                    value={customsServiceForm.description}
                    onChange={e => setCustomsServiceForm({ ...customsServiceForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-clean">
                <button type="button" className="btn-secondary" onClick={() => setIsCustomsServiceModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)' }}>
                  {editingCustomsService ? 'Narxni Saqlash' : 'Xizmatni Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================
          MODAL 9: YUK HARAKATI VA CHIQIMLAR TARIXI (LIFECYCLE) MODALI
          ======================================================== */}
      {selectedProductHistory && (() => {
        const initialQty = selectedProductHistory.initialQuantity || selectedProductHistory.quantity || 1;
        const currentQty = selectedProductHistory.quantity;
        const exitedQty = Math.max(0, initialQty - currentQty);
        const initialWeight = selectedProductHistory.initialWeightKg || selectedProductHistory.weightKg || 1;
        const currentWeight = selectedProductHistory.weightKg;
        const exitedWeight = Math.max(0, initialWeight - currentWeight);
        const remainPct = Math.min(100, Math.max(0, Math.round((currentQty / initialQty) * 100)));
        const exitPct = 100 - remainPct;
        const totalDaysStored = calculateDaysStored(selectedProductHistory.entryDate);
        const currentSec = warehouse.sectors.find(s => s.id === selectedProductHistory.sectorId);

        return (
          <div className="modal-overlay" style={{ zIndex: 9999 }}>
            <div
              className="modal-dialog"
              style={{
                maxWidth: '860px',
                width: '100%',
                background: '#ffffff',
                borderRadius: '16px',
                padding: '0',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(15, 43, 72, 0.25)'
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 24px',
                  background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)',
                  color: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>📜</span>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 900, margin: 0, letterSpacing: '-0.01em' }}>
                      YUKNING TO&apos;LIQ HARAKAT TARIXI VA CHIQIMLAR ZANJIRI (TIMELINE)
                    </h3>
                    <span style={{ fontSize: '11px', color: '#bfdbfe' }}>
                      Partiya ID: <strong>{selectedProductHistory.id}</strong> • Sektor: <strong>{selectedProductHistory.sectorName}</strong>
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProductHistory(null)}
                  style={{ color: '#ffffff', fontSize: '20px', padding: '2px 8px', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Tanasi */}
              <div style={{ padding: '24px', maxHeight: '82vh', overflowY: 'auto' }}>
                {/* 1. YUK PASPORTI VA ZAXIRA BALANSI (UMUMIY KARTA) */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '18px', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ flex: 1, minWidth: '260px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', background: currentQty > 0 ? '#dcfce7' : '#fee2e2', color: currentQty > 0 ? '#15803d' : '#991b1b', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                          {currentQty > 0 ? '🟢 OMBORDA SAQLANMOQDA' : "🔴 TO'LIQ OMBORDAN CHIQARILGAN"}
                        </span>
                        {selectedProductHistory.category && (
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            Toifa: <strong>{selectedProductHistory.category}</strong>
                          </span>
                        )}
                      </div>
                      <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#002d62', margin: '2px 0 6px 0' }}>
                        {selectedProductHistory.name}
                      </h2>
                      <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div>
                          Mijoz / Tovar Egasi: <strong style={{ color: '#0f172a' }}>{selectedProductHistory.clientName || "Noma'lum"}</strong>
                        </div>
                        <div>
                          Sektor / Harorat: <strong style={{ color: '#0284c7' }}>{selectedProductHistory.sectorName}</strong>
                          {currentSec?.temperature && <span style={{ marginLeft: '6px', color: '#059669', fontWeight: 700 }}>({currentSec.temperature})</span>}
                        </div>
                        {selectedProductHistory.contractNumber && (
                          <div>
                            Shartnoma raqami: <strong style={{ color: '#002d62' }}>{selectedProductHistory.contractNumber}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', background: '#ffffff', padding: '12px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', minWidth: '220px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                        OMBORDAGI JORIY QOLDIQ:
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: currentQty > 0 ? '#059669' : '#dc2626', lineHeight: 1.2 }}>
                        {currentQty.toLocaleString('uz-UZ')} {selectedProductHistory.unit}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0070ba', marginTop: '2px' }}>
                        ⚖️ {currentWeight.toLocaleString('uz-UZ')} kg
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', borderTop: '1px dashed #e2e8f0', paddingTop: '4px' }}>
                        Dastlabki: <strong>{initialQty.toLocaleString('uz-UZ')} {selectedProductHistory.unit}</strong> ({initialWeight.toLocaleString('uz-UZ')} kg)
                      </div>
                    </div>
                  </div>

                  {/* Vizual Zaxira / Chiqim Balansi Bar */}
                  <div style={{ marginTop: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', fontWeight: 700 }}>
                      <span style={{ color: '#059669' }}>
                        Omborda qoldiq: {currentQty.toLocaleString('uz-UZ')} {selectedProductHistory.unit} ({remainPct}%)
                      </span>
                      <span style={{ color: exitedQty > 0 ? '#dc2626' : '#94a3b8' }}>
                        Chiqarilgan: {exitedQty.toLocaleString('uz-UZ')} {selectedProductHistory.unit} ({exitPct}%)
                      </span>
                    </div>
                    <div style={{ height: '8px', background: '#fee2e2', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: `${remainPct}%`, background: '#10b981', transition: 'width 0.3s' }} />
                      <div style={{ width: `${exitPct}%`, background: '#ef4444', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                </div>

                {/* 2. YUKNING HAYOTIY TSIKLI VA HARAKATLARINING TO'LIQ XRONOLOGIK TARIXI (TIMELINE ZANJIRI) */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '2px solid #002d62', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>🕒</span>
                      <strong style={{ fontSize: '15px', color: '#002d62', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                        YUK HARAKATINING TO&apos;LIQ XRONOLOGIK TARIXI (ZANJIR)
                      </strong>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      Kirim ➔ Saqlash ➔ Chiqim operatsiyalari
                    </span>
                  </div>

                  {/* Vertikal Timeline Konteyneri */}
                  <div style={{ position: 'relative', paddingLeft: '32px' }}>
                    {/* Vertikal chiziq */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '11px',
                        top: '12px',
                        bottom: '24px',
                        width: '3px',
                        background: '#cbd5e1',
                        borderRadius: '2px'
                      }}
                    />

                    {/* ========================================================
                        BOSQICH 1: OMBORGA QABUL QILISH VA DASTLABKI KIRIM (KIRITILISH)
                        Eslatma: Kirimda nakladnoy shakllantirilmaydi, yuk faqat kiritiladi!
                        ======================================================== */}
                    <div style={{ position: 'relative', marginBottom: '22px' }}>
                      {/* Timeline nuqtasi */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-32px',
                          top: '0',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#10b981',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          boxShadow: '0 0 0 3px #dcfce7'
                        }}
                      >
                        📥
                      </div>

                      <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                          <div>
                            <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: 800 }}>
                              📥 1-BOSQICH: OMBORGA QABUL QILISH VA BIRINCHI KIRITILISH (KIRIM)
                            </span>
                            <div style={{ fontSize: '13px', color: '#1e293b', marginTop: '4px', fontWeight: 700 }}>
                              Qabul qilingan sana va vaqt: <span style={{ color: '#002d62' }}>{selectedProductHistory.entryDate} soat {selectedProductHistory.entryTime}</span>
                            </div>
                          </div>

                          <div style={{ fontSize: '11px', background: '#ffffff', border: '1px solid #bbf7d0', color: '#15803d', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                            ✓ Omborga kiritilgan (Kirim)
                          </div>
                        </div>

                        {/* Kirim tafsilotlari kartochkalari */}
                        <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '12px', marginTop: '8px' }}>
                          <div>
                            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Kiritilgan to&apos;liq hajm:</span>
                            <strong style={{ fontSize: '15px', color: '#0f172a' }}>
                              {initialQty.toLocaleString('uz-UZ')} {selectedProductHistory.unit}
                            </strong>
                            <span style={{ color: '#059669', fontWeight: 700, fontSize: '12px', display: 'block' }}>
                              ⚖️ {initialWeight.toLocaleString('uz-UZ')} kg ({Math.round(initialWeight / 1000)} tn)
                            </span>
                          </div>

                          <div>
                            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Qabul qilgan mas&apos;ul xodim:</span>
                            <strong style={{ color: '#002d62', fontSize: '13px' }}>{selectedProductHistory.placedBy}</strong>
                            <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Lavozimi: {selectedProductHistory.placedByRole}</span>
                          </div>

                          <div>
                            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Joylashtirilgan sektor & otsek:</span>
                            <strong style={{ color: '#0284c7', fontSize: '13px' }}>{selectedProductHistory.sectorName}</strong>
                            {currentSec?.subSections && (
                              <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>{currentSec.subSections}</span>
                            )}
                          </div>

                          <div>
                            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Ko&apos;rsatilgan tushirish xizmati (Разгрузка):</span>
                            <strong style={{ color: '#002d62', fontSize: '12px' }}>
                              {selectedProductHistory.obrabotkaService || 'Standart Tushirish (Разгрузка)'}
                            </strong>
                            {canViewFinances ? (
                              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, display: 'block' }}>
                                To&apos;lovi: {((selectedProductHistory.obrabotkaCost || 0) + (selectedProductHistory.obrabotkaVat || 0)).toLocaleString('uz-UZ')} UZS
                              </span>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                                🔒 Narx moliyada hisoblanadi
                              </span>
                            )}
                          </div>
                        </div>

                        {selectedProductHistory.notes && (
                          <div style={{ marginTop: '8px', fontSize: '11px', color: '#475569', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            📄 <strong>Birlamchi qabul hujjati / Asos:</strong> {selectedProductHistory.notes}
                          </div>
                        )}

                        <div style={{ marginTop: '6px', fontSize: '10.5px', color: '#64748b', fontStyle: 'italic' }}>
                          💡 Eslatma: Kirim qilinganda nakladnoy shakllantirilmaydi. Yuk faqat ombor zaxirasiga kiritiladi.
                        </div>
                      </div>
                    </div>

                    {/* ========================================================
                        BOSQICH 2: OMBORDA SAQLASH VA HOLAT NAZORATI
                        ======================================================== */}
                    <div style={{ position: 'relative', marginBottom: '22px' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: '-32px',
                          top: '0',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#0284c7',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          boxShadow: '0 0 0 3px #e0f2fe'
                        }}
                      >
                        ⏱️
                      </div>

                      <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '12px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: 800 }}>
                            ⏱️ 2-BOSQICH: SAQLANISH REJIMI VA TARIF HISOBI
                          </span>
                          <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>
                            Hozirgacha: {totalDaysStored} kun saqlandi
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '12px' }}>
                          <div>
                            <span style={{ color: '#64748b', fontSize: '11px' }}>Harorat va Sektor rejimi:</span>
                            <strong style={{ display: 'block', color: '#002d62' }}>
                              {currentSec?.temperature ? `${selectedProductHistory.sectorName} (${currentSec.temperature})` : selectedProductHistory.sectorName}
                            </strong>
                          </div>
                          <div>
                            <span style={{ color: '#64748b', fontSize: '11px' }}>Amaldagi kunlik tarif:</span>
                            <strong style={{ display: 'block', color: '#0284c7' }}>
                              {canViewFinances ? `${selectedProductHistory.dailyRatePerUnit.toLocaleString('uz-UZ')} UZS / ${selectedProductHistory.unit} / kun` : '🔒 Biriktirilgan tarif'}
                            </strong>
                          </div>
                          <div>
                            <span style={{ color: '#64748b', fontSize: '11px' }}>Biriktirilgan tarif:</span>
                            <strong style={{ display: 'block', color: '#475569' }}>
                              {selectedProductHistory.tariffName || 'Sektor tarifi'}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ========================================================
                        BOSQICH 3: OMBORDAN CHIQIM HARAKATLARI VA RASMIY CHIQIM NAKLADNOYLARI
                        Eslatma: Nakladnoy FAQAT chiqim qilinganda shakllantiriladi!
                        ======================================================== */}
                    <div style={{ position: 'relative', marginBottom: '22px' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: '-32px',
                          top: '0',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#dc2626',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          boxShadow: '0 0 0 3px #fee2e2'
                        }}
                      >
                        📤
                      </div>

                      <div style={{ background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          <div>
                            <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: 800 }}>
                              📤 3-BOSQICH: OMBORDAN CHIQIM HARAKATLARI {canViewFinances ? 'VA RASMIY NAKLADNOYLAR' : ''}
                            </span>
                            {canViewFinances && (
                              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                                (Rasmiy hisob-kitob nakladnoyi faqat yuk chiqarilganda shakllantiriladi)
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '11px', color: '#991b1b', fontWeight: 800 }}>
                            Chiqimlar soni: {selectedProductHistory.exitHistory?.length || 0} ta
                          </span>
                        </div>

                        {selectedProductHistory.exitHistory && selectedProductHistory.exitHistory.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {selectedProductHistory.exitHistory.map((rec, idx) => (
                              <div
                                key={rec.id}
                                style={{
                                  background: '#ffffff',
                                  border: '1.5px solid #fca5a5',
                                  borderRadius: '10px',
                                  padding: '14px',
                                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.04)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ background: '#dc2626', color: '#ffffff', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 800 }}>
                                        № {idx + 1}-CHIQIM AMALI
                                      </span>
                                      <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#991b1b', margin: 0 }}>
                                        {canViewFinances ? `№ ${rec.invoiceNo || ('NAK-OUT-' + rec.id.slice(-6))}` : `Chiqim ID: #${rec.id.slice(-6)}`}
                                      </h4>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '3px' }}>
                                      Chiqarilgan sana: <strong>{rec.exitDate} ({rec.exitTime})</strong> • Mas&apos;ul: <strong style={{ color: '#002d62' }}>{rec.exitedBy}</strong>
                                    </span>
                                  </div>

                                  {canViewFinances ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const exitMove: CargoMovement = {
                                          id: rec.id,
                                          invoiceNo: rec.invoiceNo || ('NAK-OUT-' + rec.id.slice(-6)),
                                          productId: selectedProductHistory.id,
                                          productName: selectedProductHistory.name,
                                          type: 'OUT',
                                          quantity: rec.quantity,
                                          unit: selectedProductHistory.unit,
                                          weightKg: rec.weightKg,
                                          initialQuantity: selectedProductHistory.initialQuantity,
                                          initialWeightKg: selectedProductHistory.initialWeightKg,
                                          remainingQuantity: rec.remainingQuantity,
                                          remainingWeightKg: rec.remainingWeightKg,
                                          userName: rec.exitedBy,
                                          userRole: rec.exitedByRole,
                                          placedBy: selectedProductHistory.placedBy,
                                          placedDate: `${selectedProductHistory.entryDate} ${selectedProductHistory.entryTime}`,
                                          date: rec.exitDate,
                                          time: rec.exitTime,
                                          notes: rec.notes || 'Chiqim nakladnoyi',
                                          clientName: selectedProductHistory.clientName,
                                          daysStored: rec.daysStored,
                                          sectorId: selectedProductHistory.sectorId,
                                          sectorName: selectedProductHistory.sectorName,
                                          tariffDailyRate: selectedProductHistory.dailyRatePerUnit,
                                          storageCostUZS: rec.storageBaseCost + rec.storageVat,
                                          loadingType: rec.loadingService,
                                          loadingCostUZS: rec.loadingCost,
                                          servicesApplied: rec.additionalServices,
                                          totalCostUZS: rec.storageBaseCost,
                                          vatTotalUZS: rec.storageVat,
                                          grandTotalUZS: rec.totalCost
                                        };
                                        setSelectedProductHistory(null);
                                        setSelectedInvoiceMovement(exitMove);
                                      }}
                                      className="btn-outline"
                                      style={{
                                        background: '#fff5f5',
                                        borderColor: '#fca5a5',
                                        color: '#dc2626',
                                        fontWeight: 800,
                                        fontSize: '11px',
                                        padding: '6px 12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <span>🖨️</span>
                                      <span>Chiqim Nakladnoyini Chop Etish</span>
                                    </button>
                                  ) : (
                                    <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '5px 10px', borderRadius: '6px', fontWeight: 600 }}>
                                      📤 Ombor Chiqimi
                                    </span>
                                  )}
                                </div>

                                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', fontSize: '12px' }}>
                                  <div>
                                    <span style={{ color: '#64748b', fontSize: '11px' }}>Chiqarilgan yuk:</span>
                                    <strong style={{ display: 'block', fontSize: '15px', color: '#dc2626' }}>
                                      - {rec.quantity.toLocaleString('uz-UZ')} {selectedProductHistory.unit}
                                    </strong>
                                    <span style={{ color: '#b91c1c', fontWeight: 800, fontSize: '11px' }}>
                                      ⚖️ {rec.weightKg.toLocaleString('uz-UZ')} kg
                                    </span>
                                  </div>

                                  <div>
                                    <span style={{ color: '#64748b', fontSize: '11px' }}>Omborda qolgan zaxira:</span>
                                    <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>
                                      {rec.remainingQuantity.toLocaleString('uz-UZ')} {selectedProductHistory.unit}
                                    </strong>
                                    <span style={{ color: '#059669', fontWeight: 700, fontSize: '11px' }}>
                                      ⚖️ {rec.remainingWeightKg.toLocaleString('uz-UZ')} kg
                                    </span>
                                  </div>

                                  <div>
                                    <span style={{ color: '#64748b', fontSize: '11px' }}>Saqlangan vaqti:</span>
                                    <strong style={{ display: 'block', color: '#0f172a' }}>{rec.daysStored} kun</strong>
                                    {canViewFinances ? (
                                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                                        Xraneniya: {(rec.storageBaseCost + rec.storageVat).toLocaleString('uz-UZ')} UZS
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                        🔒 Xraneniya hisobi
                                      </span>
                                    )}
                                  </div>

                                  <div>
                                    <span style={{ color: '#64748b', fontSize: '11px' }}>Chiqim to&apos;lovi (jami):</span>
                                    {canViewFinances ? (
                                      <>
                                        <strong style={{ display: 'block', color: '#15803d', fontSize: '15px' }}>
                                          {rec.totalCost.toLocaleString('uz-UZ')} UZS
                                        </strong>
                                        <span style={{ fontSize: '10px', color: '#0070ba' }}>12% QQS bilan</span>
                                      </>
                                    ) : (
                                      <strong style={{ display: 'block', color: '#94a3b8', fontSize: '13px' }}>
                                        🔒 Moliya hisobida
                                      </strong>
                                    )}
                                  </div>
                                </div>

                                {rec.loadingService && (
                                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#0369a1', background: '#e0f2fe', padding: '6px 10px', borderRadius: '6px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>🚛</span>
                                    <span>Ortilgan transport (Погрузка): <strong>{rec.loadingService}</strong></span>
                                    {canViewFinances && rec.loadingCost ? (
                                      <span style={{ marginLeft: 'auto', fontWeight: 800, color: '#0284c7' }}>
                                        +{rec.loadingCost.toLocaleString('uz-UZ')} UZS
                                      </span>
                                    ) : null}
                                  </div>
                                )}

                                {rec.notes && (
                                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#64748b' }}>
                                    📄 Asos / Hujjat: <em>{rec.notes}</em>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '20px', background: '#ffffff', border: '1.5px dashed #cbd5e1', borderRadius: '10px', color: '#64748b' }}>
                            <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>📦</span>
                            <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                              Ushbu yukdan hali chiqim qilinmagan
                            </strong>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                              Barcha yuk to&apos;liq hajmda ({initialQty.toLocaleString('uz-UZ')} {selectedProductHistory.unit} | {initialWeight.toLocaleString('uz-UZ')} kg) skladda saqlanmoqda.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ========================================================
                        BOSQICH 4: HOZIRGI JORIY STATUS VA QOLDIQ BALANSI
                        ======================================================== */}
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: '-32px',
                          top: '0',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#4f46e5',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          boxShadow: '0 0 0 3px #e0e7ff'
                        }}
                      >
                        🏢
                      </div>

                      <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', background: '#dbeafe', color: '#1e40af', fontSize: '11px', fontWeight: 800 }}>
                            🏢 4-BOSQICH: OMBORDAGI JORIY STATUS VA QOLDIQ BALANSI
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '12px' }}>
                          <div>
                            <span style={{ color: '#1e40af', fontSize: '11px' }}>Hozirgi Ombor Qoldig&apos;i:</span>
                            <strong style={{ display: 'block', fontSize: '16px', color: currentQty > 0 ? '#059669' : '#dc2626', marginTop: '2px' }}>
                              {currentQty.toLocaleString('uz-UZ')} {selectedProductHistory.unit}
                            </strong>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              (⚖️ {currentWeight.toLocaleString('uz-UZ')} kg)
                            </span>
                          </div>

                          <div>
                            <span style={{ color: '#1e40af', fontSize: '11px' }}>Jami Saqlangan Vaqti:</span>
                            <strong style={{ display: 'block', fontSize: '16px', color: '#002d62', marginTop: '2px' }}>
                              {totalDaysStored} kun
                            </strong>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              Kirim: {selectedProductHistory.entryDate}
                            </span>
                          </div>

                          <div>
                            <span style={{ color: '#1e40af', fontSize: '11px' }}>Kunlik Saqlash Tarifi:</span>
                            <strong style={{ display: 'block', fontSize: '15px', color: '#0284c7', marginTop: '2px' }}>
                              {selectedProductHistory.dailyRatePerUnit.toLocaleString('uz-UZ')} UZS / {selectedProductHistory.unit} / kun
                            </strong>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              {selectedProductHistory.tariffName || 'Sektor tarifi'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Pastki Qismi */}
              <div className="modal-footer-clean">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedProductHistory(null)}
                >
                  Yopish
                </button>
                {canStockMovement && selectedProductHistory.quantity > 0 && checkSectorAccess(warehouse.sectors.find(s => s.id === selectedProductHistory.sectorId) || null, currentUser).allowed && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      const prod = selectedProductHistory;
                      setSelectedProductHistory(null);
                      setSelectedProductToExit(prod);
                      setExitQuantity(prod.quantity);
                      setExitWeightKg(prod.weightKg);
                      setExitNotes('');
                      const pMatch = payers.find(p => p.id === prod.payerId || p.name.toLowerCase() === prod.clientName?.toLowerCase());
                      setExitReceiverInn(pMatch?.inn || '');
                      setExitReceiverName(pMatch?.name || prod.clientName || '');
                      setExitReceiverPerson(pMatch?.contactPerson || '');
                      setIsExitModalOpen(true);
                    }}
                    style={{ background: '#dc2626' }}
                  >
                    📤 Ushbu Tovardan Chiqim Qilish (Chiqim Nakladnoyi Shakllantirish)
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

    {/* ========================================================
          MODAL 7: RASMIY «JB GROUP» BOJXONA INVOYSI / DALOLATNOMA
          - Chop etish (Print / PDF) uchun tayyorlangan
          - 12% QQS yoyilmasi
          - Rasmiy rekvizitlar va imzolar joyi
          ======================================================== */}
      {selectedInvoiceMovement && canViewFinances && (
        <div className="modal-overlay invoice-print-overlay" style={{ zIndex: 99999 }}>
          <div
            className="modal-dialog invoice-modal-container"
            style={{
              maxWidth: '680px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '0',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(15, 43, 72, 0.25)'
            }}
          >
            {/* Modal Boshqaruvi (Chop etishda yashirinadi) */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                background: '#0f2b48',
                color: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>🧾</span>
                <strong style={{ fontSize: '13px' }}>
                  RASMIY CHIQIM NAKLADNOYI
                </strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>🖨️</span>
                  <span>Chop etish (Print / PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceMovement(null)}
                  style={{ color: '#cbd5e1', fontSize: '18px', padding: '2px 8px', fontWeight: 700 }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Oddiy va Sodda Nakladnoy Tanasi (Foydalanuvchi talabi: ko'rsatilgan xizmat va qancha to'lov qilinishi kerak bo'ldi) */}
            <div id="jb-group-invoice" className="jb-invoice-print-area" style={{ padding: '28px 32px', background: '#ffffff', color: '#0f172a' }}>
              {/* Sarlavha */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #002d62', paddingBottom: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/jb-logo.jpg" alt="JB GROUP" style={{ height: '44px', width: 'auto', borderRadius: '4px' }} />
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#002d62', margin: 0 }}>
                      «JB GROUP» BOJXONA OMBORI
                    </h2>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Bojxona ombori xizmatlari hisob-kitob nakladnoyi
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', background: selectedInvoiceMovement.type === 'IN' ? '#ecfdf5' : '#eff6ff', color: selectedInvoiceMovement.type === 'IN' ? '#047857' : '#1d4ed8', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                    📤 RASMIY CHIQIM NAKLADNOYI
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                    № {selectedInvoiceMovement.invoiceNo || selectedInvoiceMovement.id}
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Sana: {selectedInvoiceMovement.date} {selectedInvoiceMovement.time}
                  </span>
                </div>
              </div>

              {/* Tovar, Hajm, va Yuk Berilgan Tarafi (INN va Vakil bilan) */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '18px', display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '14px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>TOVAR VA SAQLASH HAJMI:</span>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#002d62', marginTop: '2px' }}>
                    {selectedInvoiceMovement.productName}
                  </div>
                  <div style={{ color: '#0f172a', marginTop: '4px', fontSize: '13px', fontWeight: 700 }}>
                    Hajmi: {selectedInvoiceMovement.quantity} {selectedInvoiceMovement.unit}
                    {selectedInvoiceMovement.weightKg && (
                      <span style={{ color: '#059669', marginLeft: '6px' }}>
                        (⚖️ {selectedInvoiceMovement.weightKg.toLocaleString('uz-UZ')} kg)
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#475569', marginTop: '3px' }}>
                    Sklad: <strong>{selectedInvoiceMovement.sectorName}</strong>
                    {selectedInvoiceMovement.daysStored && (
                      <span style={{ marginLeft: '6px', color: '#059669', fontWeight: 700 }}>
                        • {selectedInvoiceMovement.daysStored} kun saqlangan
                      </span>
                    )}
                  </div>
                  {selectedInvoiceMovement.type === 'OUT' && (
                    <div style={{ marginTop: '6px', fontSize: '11px', lineHeight: '1.6' }}>
                      <div style={{ color: '#0369a1', fontWeight: 700 }}>
                        📥 Tushirilgan transport (Разгрузка): <strong>{selectedInvoiceMovement.unloadingType || selectedInvoiceMovement.transportType || 'Kirimda yuk tushirish'}</strong>
                      </div>
                      <div style={{ color: '#b91c1c', fontWeight: 700 }}>
                        🚛 Yuk ortilgan transport (Погрузка): <strong>{selectedInvoiceMovement.loadingType || 'Yuk ortish'}</strong>
                      </div>
                    </div>
                  )}
                  {selectedInvoiceMovement.type === 'IN' && selectedInvoiceMovement.transportType && (
                    <div style={{ color: '#0284c7', fontSize: '11px', marginTop: '3px', fontWeight: 700 }}>
                      🚛 Kelgan transport: <strong>{selectedInvoiceMovement.transportType}</strong>
                    </div>
                  )}
                  {selectedInvoiceMovement.placedBy && (
                    <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>
                      Keltirgan mas&apos;ul: <strong>{selectedInvoiceMovement.placedBy}</strong>
                    </div>
                  )}
                </div>

                <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '14px' }}>
                  <span style={{ color: '#dc2626', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>YUK BERILGAN TARAFI (QABUL QILUVCHI):</span>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                    🏢 {selectedInvoiceMovement.receiverName || selectedInvoiceMovement.clientName || "Noma'lum Korxona"}
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#0284c7', fontWeight: 800 }}>
                    STIR (INN): <code style={{ fontSize: '13px', background: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>{selectedInvoiceMovement.receiverInn || (payers.find(p => p.name === (selectedInvoiceMovement.receiverName || selectedInvoiceMovement.clientName))?.inn) || '308942115'}</code>
                  </div>
                  {selectedInvoiceMovement.receiverPerson ? (
                    <div style={{ color: '#334155', fontSize: '12px', marginTop: '3px' }}>
                      Qabul qilib oluvchi vakil: <strong>{selectedInvoiceMovement.receiverPerson}</strong>
                    </div>
                  ) : (
                    <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>
                      To&apos;lovchi (Mijoz): <strong>{selectedInvoiceMovement.clientName || "Noma'lum"}</strong>
                    </div>
                  )}
                  {selectedInvoiceMovement.userName && (
                    <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>
                      Chiqargan mas&apos;ul: <strong>{selectedInvoiceMovement.userName}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Ko'rsatilgan xizmatlar va To'lov Jadvali: canViewFinances ga qarab moslashadi */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {canViewFinances ? "📋 KO'RSATILGAN XIZMATLAR VA TO'LOV:" : "📋 KO'RSATILGAN XIZMATLAR VA HARAKATLAR RO'YXATI:"}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#002d62', color: '#ffffff', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 10px', width: '30px', textAlign: 'center' }}>№</th>
                      <th style={{ padding: '8px 10px' }}>Ko&apos;rsatilgan Xizmat</th>
                      {canViewFinances ? (
                        <>
                          <th style={{ padding: '8px 10px', textAlign: 'right' }}>Bazaviy Narx</th>
                          <th style={{ padding: '8px 10px', textAlign: 'right' }}>12% QQS</th>
                          <th style={{ padding: '8px 10px', textAlign: 'right' }}>Jami Summa</th>
                        </>
                      ) : (
                        <>
                          <th style={{ padding: '8px 10px', textAlign: 'center' }}>O&apos;lchov Birligi</th>
                          <th style={{ padding: '8px 10px', textAlign: 'center' }}>Hajmi / Miqdori</th>
                          <th style={{ padding: '8px 10px', textAlign: 'center' }}>Holati</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Agar Chiqim amali bo'lsa va servicesApplied mavjud bo'lsa */}
                    {selectedInvoiceMovement.type === 'OUT' && selectedInvoiceMovement.servicesApplied && selectedInvoiceMovement.servicesApplied.length > 0 ? (
                      selectedInvoiceMovement.servicesApplied.map((svc, idx) => {
                        const isStorage = svc.name.toLowerCase().includes('saqlash');
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                            <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>
                              {idx + 1}
                            </td>
                            <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                              {svc.name}
                              {isStorage && (
                                <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
                                  {canViewFinances 
                                    ? (selectedInvoiceMovement.storageFormula || `Hajmi: ${(selectedInvoiceMovement.weightKg || 0).toLocaleString('uz-UZ')} kg × ${selectedInvoiceMovement.daysStored || 1} kun`)
                                    : `Saqlangan muddati: ${selectedInvoiceMovement.daysStored || 1} kun (Omborda faktik qoldiq hisobi)`
                                  }
                                </span>
                              )}
                            </td>
                            {canViewFinances ? (
                              <>
                                <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                  {svc.basePrice.toLocaleString('uz-UZ')} UZS
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                  {svc.vatAmount.toLocaleString('uz-UZ')} UZS
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                  {svc.totalPrice.toLocaleString('uz-UZ')} UZS
                                </td>
                              </>
                            ) : (
                              <>
                                <td style={{ padding: '8px 10px', textAlign: 'center', color: '#475569' }}>
                                  {svc.unit}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#0284c7' }}>
                                  {svc.quantity}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'center', color: '#166534', fontWeight: 700 }}>
                                  Bajarildi ✅
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <>
                        {selectedInvoiceMovement.type === 'OUT' && (
                          <>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>1</td>
                              <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                                Omborga tushirish (Разгрузка): {selectedInvoiceMovement.unloadingType || selectedInvoiceMovement.transportType || 'Kirimda yuk tushirish xizmati'} (⚡ 1 martalik to&apos;lov)
                              </td>
                              {canViewFinances ? (
                                <>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                    {Math.round((selectedInvoiceMovement.obrabotkaCostUZS || 896000) / 1.12).toLocaleString('uz-UZ')} UZS
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                    {((selectedInvoiceMovement.obrabotkaCostUZS || 896000) - Math.round((selectedInvoiceMovement.obrabotkaCostUZS || 896000) / 1.12)).toLocaleString('uz-UZ')} UZS
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                    {(selectedInvoiceMovement.obrabotkaCostUZS || 896000).toLocaleString('uz-UZ')} UZS
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>1 martalik</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>1</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#166534', fontWeight: 700 }}>Bajarildi ✅</td>
                                </>
                              )}
                            </tr>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>2</td>
                              <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                                Bojxona omborida saqlash xizmati (📅 {selectedInvoiceMovement.daysStored || 1} kun saqlangan — FAQAT saqlash kuniga ko&apos;paytiriladi)
                              </td>
                              {canViewFinances ? (
                                <>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                    {Math.round((selectedInvoiceMovement.storageCostUZS || 0) / 1.12).toLocaleString('uz-UZ')} UZS
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                    {((selectedInvoiceMovement.storageCostUZS || 0) - Math.round((selectedInvoiceMovement.storageCostUZS || 0) / 1.12)).toLocaleString('uz-UZ')} UZS
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                    {(selectedInvoiceMovement.storageCostUZS || 0).toLocaleString('uz-UZ')} UZS
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>kunlik</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>{selectedInvoiceMovement.daysStored || 1} kun</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#166534', fontWeight: 700 }}>Bajarildi ✅</td>
                                </>
                              )}
                            </tr>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>3</td>
                              <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                                Yukni ortish (Погрузка): {selectedInvoiceMovement.loadingType || 'Yuk ortish xizmati'} (⚡ 1 martalik to&apos;lov)
                              </td>
                              {canViewFinances ? (
                                <>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                    {Math.round((selectedInvoiceMovement.loadingCostUZS || 0) / 1.12).toLocaleString('uz-UZ')} UZS
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                    {((selectedInvoiceMovement.loadingCostUZS || 0) - Math.round((selectedInvoiceMovement.loadingCostUZS || 0) / 1.12)).toLocaleString('uz-UZ')} UZS
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                    {(selectedInvoiceMovement.loadingCostUZS || 0).toLocaleString('uz-UZ')} UZS
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>1 transport</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>1</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#166534', fontWeight: 700 }}>Bajarildi ✅</td>
                                </>
                              )}
                            </tr>
                          </>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Jami To'lov Yakuni yoki Oddiy Xodim uchun Faktik Qayd */}
              {canViewFinances ? (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#166534', textTransform: 'uppercase' }}>
                    JAMI TO&apos;LOV QILINISHI KERAK:
                  </span>
                  <span style={{ fontSize: '22px', fontWeight: 900, color: '#15803d' }}>
                    {(selectedInvoiceMovement.grandTotalUZS || selectedInvoiceMovement.totalCostUZS || 0).toLocaleString('uz-UZ')} UZS
                  </span>
                </div>
              ) : (
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '22px' }}>🔒</span>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                      Xizmatlar Faktik Bajarildi (Moliyaviy Hisob-Kitob Cheklangan)
                    </strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Sizda pul va moliyaviy ma&apos;lumotlarni ko&apos;rish ruxsati mavjud emas. Xizmatlar qiymati va to&apos;lovlar hisobi moliya bo&apos;limi tomonidan rasmiylashtiriladi.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer-clean no-print">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedInvoiceMovement(null)}
              >
                Yopish
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => window.print()}
                style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)' }}
              >
                🖨️ Nakladnoyni Chop Etish (Print)
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* ========================================================
          MODAL 10: TO'LOVCHI SHARTNOMASINI QO'SHISH / MUDDATINI UZAYTIRISH
          ======================================================== */}
      {isPayerModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '580px' }}>
            <div className="modal-header-clean">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#002d62', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🤝</span>
                  <span>{editingPayer ? `Shartnomani Yangilash: ${editingPayer.name}` : 'Yangi Saqlash Shartnomasini Tuzish'}</span>
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  «JB GROUP» Bojxona ombori xizmatlari ko&apos;rsatish shartnomasi
                </span>
              </div>
              <button onClick={() => setIsPayerModalOpen(false)} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleSavePayer}>
              <div className="modal-body-clean">
                <div className="form-field">
                  <label className="form-label">TO&apos;LOVCHI / KORXONA NOMI *</label>
                  <input
                    type="text"
                    required
                    className="form-input-clean"
                    placeholder="Masalan: Sag Agro Logistika MChJ"
                    value={payerForm.name}
                    onChange={e => setPayerForm({ ...payerForm, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">STIR / INN RAQAMI *</label>
                    <input
                      type="text"
                      required
                      className="form-input-clean"
                      placeholder="Masalan: 308942115"
                      value={payerForm.inn}
                      onChange={e => setPayerForm({ ...payerForm, inn: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">SHARTNOMA RAQAMI *</label>
                    <input
                      type="text"
                      required
                      className="form-input-clean"
                      placeholder="Masalan: SH-2026/01"
                      value={payerForm.contractNumber}
                      onChange={e => setPayerForm({ ...payerForm, contractNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">SHARTNOMA TUZILGAN SANA *</label>
                    <input
                      type="date"
                      required
                      className="form-input-clean"
                      value={payerForm.contractStartDate}
                      onChange={e => setPayerForm({ ...payerForm, contractStartDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ color: '#0070ba', fontWeight: 800 }}>
                      AMAL QILISH MUDDATI (QACHONGACHA) *
                    </label>
                    <input
                      type="date"
                      required
                      className="form-input-clean"
                      style={{ border: '1.5px solid #0070ba', background: '#f0f9ff' }}
                      value={payerForm.contractEndDate}
                      onChange={e => setPayerForm({ ...payerForm, contractEndDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Muddat ogohlantirishi */}
                {(() => {
                  const todayStr = new Date().toISOString().slice(0, 10);
                  const isExp = Boolean(payerForm.contractEndDate && payerForm.contractEndDate < todayStr);
                  return isExp ? (
                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '12px', color: '#dc2626' }}>
                      ⚠️ <strong>Diqqat:</strong> Ushbu sana bugungi kundan ({todayStr}) oldingi sana. Agar shu muddat saqlansa, mijoz muddati o&apos;tgan deb hisoblanadi va chiqim bloklanadi!
                    </div>
                  ) : (
                    <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '12px', color: '#166534' }}>
                      ✅ <strong>Shartnoma amalda bo&apos;ladi:</strong> Belgilangan muddatgacha ({payerForm.contractEndDate}) barcha yuk operatsiyalari va chiqimlar to&apos;siqsiz amalga oshiriladi.
                    </div>
                  );
                })()}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">MAS&apos;UL VAKIL F.I.SH</label>
                    <input
                      type="text"
                      className="form-input-clean"
                      placeholder="Masalan: Sirojiddin Aliyev"
                      value={payerForm.contactPerson}
                      onChange={e => setPayerForm({ ...payerForm, contactPerson: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">TELEFON RAQAMI</label>
                    <input
                      type="text"
                      className="form-input-clean"
                      placeholder="+998 90 123 45 67"
                      value={payerForm.phone}
                      onChange={e => setPayerForm({ ...payerForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">QO&apos;SHIMCHA IZOH / ASOS</label>
                  <textarea
                    rows={2}
                    className="form-input-clean"
                    placeholder="Shartnoma bo'yicha maxsus shartlar yoki qaydlar..."
                    value={payerForm.notes}
                    onChange={e => setPayerForm({ ...payerForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-clean">
                <button type="button" className="btn-secondary" onClick={() => setIsPayerModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)' }}>
                  💾 Shartnomani Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
