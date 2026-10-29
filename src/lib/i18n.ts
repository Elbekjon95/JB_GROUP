import { Language } from './types';
export type { Language };

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  uz: {
    // Login & Header
    appTitle: 'JB GROUP',
    appSubtitle: 'Bojxona Ombori & Logistika Majmuasi',
    appDesc: 'Omborxona, zaxira va bojxona xizmatlari boshqaruvi',
    emailLabel: 'Elektron Pochta (Login)',
    emailPlaceholder: 'Elektron pochtangizni kiriting',
    passwordLabel: 'Maxfiy Parol',
    passwordPlaceholder: 'Parolingizni kiriting',
    loginBtn: 'Tizimga Kirish',
    loggingIn: 'Tekshirilmoqda...',
    loginSecNote: '🔒 Maxfiy korporativ tizim. Har bir xodim faqat o\'ziga biriktirilgan shaxsiy login va parol orqali kirishi shart.',
    logoutBtn: 'Chiqish',

    // Navigation Tabs
    navWarehouse: '🏢 Ombor va Sektorlar',
    navHistory: '📋 Harakatlar Tarixi',
    navPayers: '🤝 Yuk To\'lovchilari',
    navAccounting: '💼 Buxgalteriya & Chiqimlar',
    navReports: '📊 Oylik Faoliyat',
    navEditLogs: '✏️ Tahrirlar Hisoboti',
    navTariffs: '📑 Bojxona Preyskuranti',
    navUsers: '👥 Xodimlar va Huquqlar',

    // Roles
    roleSuperAdmin: '👑 Bosh Rahbar (Super Admin)',
    roleAdmin: '🛡️ Katta Omborchi (Admin)',
    roleAccountant: '💼 Bosh Buxgalter',
    roleUser: '👤 Omborchi (User)',

    // Warehouse Main & Table Keys
    whBadge: 'JB GROUP • BOJXONA OMBORI VA LOGISTIKA MARKAZI',
    totalArea: 'JAMI MAYDON (6 SEKTOR):',
    sectorsCount: 'SEKTORLAR SONI:',
    sectorsActive: '6 ta faol bojxona sektori',
    totalBatches: 'JAMI YUK PARTIYALARI:',
    batchesSuffix: 'ta partiya',
    stockByUnits: 'ZAXIRA (BIRLIKLAR KESIMIDA):',
    btnAddCargo: '📥 Yangi Yuk Kiritish (Kirim)',
    btnNewCargoEntry: '+ Yangi Yuk Kirim Qilish',
    btnEditCargo: 'Tahrirlash',
    btnExitCargo: 'Chiqim',
    btnHistory: 'Tarix',
    warehouseAllCargoTitle: 'Barcha Sektorlardagi Yuklar Ro\'yxati (Umumiy Baza)',
    warehouseAllCargoSub: 'Ombor majmuasidagi barcha 6 ta sektor bo\'yicha jamlangan tovarlar hisobi',
    searchCargoPlaceholder: 'Yuk nomi, nakladnoy, korxona (to\'lovchi), STIR (INN) yoki sektor bo\'yicha qidiruv...',
    allSectorsOption: '🏢 Barcha Sektorlar',
    viewTable: 'Jadval Ko\'rinishi',
    viewCards: 'Karta Ko\'rinishi',
    showingCount: 'Ko\'rsatilmoqda',
    totalWeightLabel: 'Jami og\'irlik',
    colCargoName: 'Yuk (Partiya) Nomi',
    colSector: 'Sektor',
    colPayerStir: 'To\'lovchi (Mijoz) & STIR',
    colQtyWeight: 'Qoldiq & Og\'irligi',
    colEntryStaff: 'Kirim Sanasi & Mas\'ul',
    colDays: 'Muddati',
    colStorageTariff: 'Saqlash Tarifi',
    colUnloadingSvc: 'Tushirish Xizmati',
    colActions: 'Amallar',

    // Edit Product & Logs
    editModalTitle: '✏️ Kiritilgan Yuk Ma\'lumotlarini To\'g\'rilash (Tahrirlash)',
    editModalSub: 'Xato kiritilgan yuk miqdori, vazni, sektori yoki mijoz ma\'lumotlarini tuzatish (Barcha o\'zgarishlar hisobotga yoziladi)',
    editReasonLabel: 'TAHRIRLASH SABABI (NIMA UCHUN O\'ZGARTIRILMOQDA?) *',
    editReasonPlaceholder: 'Masalan: Kirim vaqtida tarozi vazni 1500 kg o\'rniga 15000 kg yozilib qolgan...',
    saveEditBtn: '💾 O\'zgarishlarni Saqlash va Qayd Etish',
    editLogsTitle: '✏️ Kiritilgan Yuklarni Tahrirlash (Xatolarni To\'g\'rilash) Oylik Hisoboti',
    editLogsSub: 'Qaysi xodim bir oy davomida qancha yuk ma\'lumotlarini to\'g\'rilagani va nimalar o\'zgartirilganligi nazorati',
    monthSelectLabel: 'Hisobot Oyi:',
    employeeFilterLabel: 'Xodim bo\'yicha:',
    allEmployees: 'Barcha xodimlar',
    totalEditsInMonth: 'Oylik jami tahrirlar:',
    employeesWhoEdited: 'Tahrir qilgan xodimlar:',
    lastEditedAt: 'Oxirgi tahrir vaqti:',
    exportExcelBtn: '📥 Excel (CSV) Yuklab Olish',
    printReportBtn: '🖨️ Chop Etish (A4)',
    colEmployee: 'Xodim F.I.SH',
    colRole: 'Lavozimi',
    colEditsCount: 'Tahrirlar Soni (1 oyda)',
    colProduct: 'Yuk Nomi va Sektori',
    colChanges: 'O\'zgartirilgan Ma\'lumotlar (Eski ➔ Yangi)',
    colReason: 'Tahrirlash Sababi (Izoh)',
    colDateTime: 'Sana va Vaqt',
    noEditsFound: 'Tanlangan oy uchun hech qanday tahrir (to\'g\'rilash) amali topilmadi.'
  },
  ru: {
    // Login & Header
    appTitle: 'JB GROUP',
    appSubtitle: 'Таможенный Склад и Логистический Комплекс',
    appDesc: 'Управление складом, запасами и таможенными услугами',
    emailLabel: 'Электронная почта (Логин)',
    emailPlaceholder: 'Введите ваш email',
    passwordLabel: 'Секретный пароль',
    passwordPlaceholder: 'Введите ваш пароль',
    loginBtn: 'Войти в систему',
    loggingIn: 'Проверка...',
    loginSecNote: '🔒 Закрытая корпоративная система. Каждый сотрудник обязан входить только под личным логином и паролем.',
    logoutBtn: 'Выйти',

    // Navigation Tabs
    navWarehouse: '🏢 Склад и Секторы',
    navHistory: '📋 История Движений',
    navPayers: '🤝 Плательщики (Договоры)',
    navAccounting: '💼 Бухгалтерия и Расход',
    navReports: '📊 Активность за месяц',
    navEditLogs: '✏️ Отчет по исправлениям',
    navTariffs: '📑 Прейскурант Услуг',
    navUsers: '👥 Сотрудники и Права',

    // Roles
    roleSuperAdmin: '👑 Генеральный Директор (Super Admin)',
    roleAdmin: '🛡️ Старший Кладовщик (Admin)',
    roleAccountant: '💼 Главный Бухгалтер',
    roleUser: '👤 Кладовщик (User)',

    // Warehouse Main & Table Keys
    whBadge: 'JB GROUP • ТАМОЖЕННЫЙ СКЛАД И ЛОГИСТИЧЕСКИЙ ЦЕНТР',
    totalArea: 'ОБЩАЯ ПЛОЩАДЬ (6 СЕКТОРОВ):',
    sectorsCount: 'КОЛ-ВО СЕКТОРОВ:',
    sectorsActive: '6 активных таможенных секторов',
    totalBatches: 'ВСЕГО ПАРТИЙ ГРУЗА:',
    batchesSuffix: 'партий',
    stockByUnits: 'ОСТАТОК (ПО ЕДИНИЦАМ):',
    btnAddCargo: '📥 Принять Новый Груз (Приход)',
    btnNewCargoEntry: '+ Принять Груз (Приход)',
    btnEditCargo: 'Исправить',
    btnExitCargo: 'Расход',
    btnHistory: 'История',
    warehouseAllCargoTitle: 'Реестр Грузов по Всем Секторам (Общая База)',
    warehouseAllCargoSub: 'Сводный учет всех партий товаров по 6 таможенным секторам комплекса',
    searchCargoPlaceholder: 'Поиск по наименованию груза, накладной, организации (плательщику), ИНН или сектору...',
    allSectorsOption: '🏢 Все Секторы',
    viewTable: 'Табличный вид',
    viewCards: 'Карточный вид',
    showingCount: 'Показано партий',
    totalWeightLabel: 'Общий вес',
    colCargoName: 'Наименование (Партия) Груза',
    colSector: 'Сектор',
    colPayerStir: 'Плательщик (Клиент) и ИНН',
    colQtyWeight: 'Остаток и Вес',
    colEntryStaff: 'Дата Прихода и Ответственный',
    colDays: 'Срок',
    colStorageTariff: 'Тариф Хранения',
    colUnloadingSvc: 'Услуга Разгрузки',
    colActions: 'Действия',

    // Edit Product & Logs
    editModalTitle: '✏️ Исправление (Редактирование) Данных Принятого Груза',
    editModalSub: 'Исправление ошибочно введенного количества, веса, сектора или клиента (Все изменения фиксируются в отчете)',
    editReasonLabel: 'ПРИЧИНА ИСПРАВЛЕНИЯ (ПОЧЕМУ ВНОСЯТСЯ ИЗМЕНЕНИЯ?) *',
    editReasonPlaceholder: 'Например: При приходе ошибочно указан вес 15000 кг вместо 1500 кг...',
    saveEditBtn: '💾 Сохранить исправления и записать в журнал',
    editLogsTitle: '✏️ Ежемесячный Отчет по Исправлениям Грузов (Аудит Изменений)',
    editLogsSub: 'Контроль того, кто из сотрудников, сколько раз за месяц исправлял данные грузов и какие поля были изменены',
    monthSelectLabel: 'Месяц отчета:',
    employeeFilterLabel: 'По сотруднику:',
    allEmployees: 'Все сотрудники',
    totalEditsInMonth: 'Всего исправлений за месяц:',
    employeesWhoEdited: 'Сотрудников, внесших правки:',
    lastEditedAt: 'Последнее исправление:',
    exportExcelBtn: '📥 Скачать Excel (CSV)',
    printReportBtn: '🖨️ Печать (A4)',
    colEmployee: 'Ф.И.О. Сотрудника',
    colRole: 'Должность',
    colEditsCount: 'Кол-во исправлений (за месяц)',
    colProduct: 'Наименование груза и Сектор',
    colChanges: 'Измененные данные (Было ➔ Стало)',
    colReason: 'Причина исправления',
    colDateTime: 'Дата и Время',
    noEditsFound: 'За выбранный месяц исправлений (редактирований) грузов не найдено.'
  },
  en: {
    // Login & Header
    appTitle: 'JB GROUP',
    appSubtitle: 'Customs Warehouse & Logistics Complex',
    appDesc: 'Warehouse, inventory and customs services management',
    emailLabel: 'Email Address (Login)',
    emailPlaceholder: 'Enter your email address',
    passwordLabel: 'Secret Password',
    passwordPlaceholder: 'Enter your password',
    loginBtn: 'Sign In',
    loggingIn: 'Verifying...',
    loginSecNote: '🔒 Confidential corporate system. Every employee must sign in strictly with their assigned personal credentials.',
    logoutBtn: 'Sign Out',

    // Navigation Tabs
    navWarehouse: '🏢 Warehouse & Sectors',
    navHistory: '📋 Movement History',
    navPayers: '🤝 Contract Payers',
    navAccounting: '💼 Accounting & Exits',
    navReports: '📊 Monthly Activity',
    navEditLogs: '✏️ Corrections Report',
    navTariffs: '📑 Customs Price List',
    navUsers: '👥 Staff & Permissions',

    // Roles
    roleSuperAdmin: '👑 General Director (Super Admin)',
    roleAdmin: '🛡️ Senior Warehouse Manager (Admin)',
    roleAccountant: '💼 Chief Accountant',
    roleUser: '👤 Warehouse Operator (User)',

    // Warehouse Main & Table Keys
    whBadge: 'JB GROUP • CUSTOMS WAREHOUSE & LOGISTICS CENTER',
    totalArea: 'TOTAL AREA (6 SECTORS):',
    sectorsCount: 'TOTAL SECTORS:',
    sectorsActive: '6 active customs sectors',
    totalBatches: 'TOTAL CARGO BATCHES:',
    batchesSuffix: 'batches',
    stockByUnits: 'STOCK (BY UNITS):',
    btnAddCargo: '📥 New Cargo Entry (Inbound)',
    btnNewCargoEntry: '+ New Cargo Entry',
    btnEditCargo: 'Edit / Fix',
    btnExitCargo: 'Outbound',
    btnHistory: 'History',
    warehouseAllCargoTitle: 'All Sectors Cargo Inventory (Master Database)',
    warehouseAllCargoSub: 'Consolidated inventory of all cargo batches across all 6 customs warehouse sectors',
    searchCargoPlaceholder: 'Search by cargo name, invoice, payer company, TIN (INN) or sector...',
    allSectorsOption: '🏢 All Sectors',
    viewTable: 'Table View',
    viewCards: 'Card View',
    showingCount: 'Showing batches',
    totalWeightLabel: 'Total weight',
    colCargoName: 'Cargo (Batch) Name',
    colSector: 'Sector',
    colPayerStir: 'Payer (Client) & TIN',
    colQtyWeight: 'Balance & Weight',
    colEntryStaff: 'Entry Date & Staff',
    colDays: 'Days',
    colStorageTariff: 'Storage Tariff',
    colUnloadingSvc: 'Unloading Service',
    colActions: 'Actions',

    // Edit Product & Logs
    editModalTitle: '✏️ Correct / Edit Entered Cargo Details',
    editModalSub: 'Fix mistakenly entered quantity, weight, sector or client details (All edits are logged for audit)',
    editReasonLabel: 'REASON FOR CORRECTION (WHY IS THIS BEING EDITED?) *',
    editReasonPlaceholder: 'E.g.: Weight was mistakenly entered as 15,000 kg instead of 1,500 kg during inbound entry...',
    saveEditBtn: '💾 Save Corrections & Record Log',
    editLogsTitle: '✏️ Monthly Cargo Corrections & Edit Audit Report',
    editLogsSub: 'Track which employees edited cargo records during the month, how many times, and exact before/after values',
    monthSelectLabel: 'Report Month:',
    employeeFilterLabel: 'Filter by Staff:',
    allEmployees: 'All Staff Members',
    totalEditsInMonth: 'Total Monthly Edits:',
    employeesWhoEdited: 'Staff Who Edited:',
    lastEditedAt: 'Last Edit Time:',
    exportExcelBtn: '📥 Export Excel (CSV)',
    printReportBtn: '🖨️ Print Report (A4)',
    colEmployee: 'Employee Full Name',
    colRole: 'Role',
    colEditsCount: 'Edits Count (Monthly)',
    colProduct: 'Cargo Name & Sector',
    colChanges: 'Modified Fields (Old ➔ New)',
    colReason: 'Reason for Correction',
    colDateTime: 'Date & Time',
    noEditsFound: 'No cargo edits or corrections found for the selected month.'
  }
};

export function t(lang: Language, key: string, fallback?: string): string {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.uz[key] || fallback || key;
}

/**
 * To'liq iboralar va so'z birikmalari lug'ati (O'zbek va Rus -> RU / EN / UZ)
 * Maxsulot nomidan (data-no-translate="true") boshqa BARCHA detallarni tarjima qiladi.
 */
const RAW_PHRASE_MAP: Array<[string, { uz?: string; ru: string; en: string }]> = [
  // =========================================================================
  // 1. SUPER ADMIN BANNER & WAREHOUSE HEADER
  // =========================================================================
  ['Super Admin Boshqaruv Punkti:', { ru: 'Пункт Управления Супер-Админа:', en: 'Super Admin Control Center:' }],
  ['Faqat siz yangi admin yoki user qo\'shishingiz, ularga omborni sozlash, tariflar va xavfli yuklar bilan ishlash huquqlarini (dostup) belgilashingiz mumkin.', {
    ru: 'Только вы можете добавлять сотрудников и назначать им права доступа к настройке склада, тарифам и работе с опасными грузами.',
    en: 'Only you can add staff accounts and assign permissions for warehouse configuration, tariffs, and hazardous cargo handling.'
  }],
  ['⚙️ Xodimlar & Huquqlar Punktiga O\'tish', { ru: '⚙️ Перейти к Сотрудникам и Правам', en: '⚙️ Go to Staff & Permissions' }],
  ['JB GROUP Bojxona va Markaziy Logistika Majmuasi', { ru: 'Таможенный и Центральный Логистический Комплекс JB GROUP', en: 'JB GROUP Customs & Central Logistics Complex' }],
  ['Toshkent viloyati, Yangiyo\'l tumani, Bojxona logistika markazi', { ru: 'Ташкентская область, Янгиюльский район, Таможенный логистический центр', en: 'Tashkent region, Yangiyul district, Customs Logistics Center' }],
  ['Toshkent viloyati', { ru: 'Ташкентская область', en: 'Tashkent region' }],
  ['Yangiyo\'l tumani, Bojxona logistika markazi', { ru: 'Янгиюльский район, Таможенный логистический центр', en: 'Yangiyul district, Customs Logistics Center' }],
  ['Yangi Yuk Kiritish (Kirim)', { ru: 'Принять Новый Груз (Приход)', en: 'New Cargo Entry (Inbound)' }],
  ['➕ Sektor Qo\'shish', { ru: '➕ Добавить Сектор', en: '➕ Add Sector' }],
  ['Ombordagi Jami Tovarlar:', { ru: 'Всего Товаров на Складе:', en: 'Total Cargo Batches in Warehouse:' }],
  ['Faol Sektorlar Soni:', { ru: 'Активных Секторов:', en: 'Active Warehouse Sectors:' }],
  ['Hisoblash Tizimi:', { ru: 'Система Тарификации:', en: 'Billing System:' }],
  ['Kunlik tarif (1 kg = 600 so\'m va h.k.)', { ru: 'Суточный тариф (по прейскуранту)', en: 'Daily tariff (per official price list)' }],
  ['Jami Ombordagi Yuklar Miqdori:', { ru: 'Общее Количество Грузов на Складе:', en: 'Total Warehouse Inventory by Units:' }],
  ['Ko\'rish uchun bosing:', { ru: 'Нажмите для просмотра:', en: 'Click to view:' }],
  ['Barcha Sektorlar (Hammasi)', { ru: 'Все Секторы (Общий список)', en: 'All Sectors (Combined)' }],
  ['Bojxona Sektori', { ru: 'Таможенный Сектор', en: 'Customs Sector' }],
  ['BOJXONA SEKTORI', { ru: 'ТАМОЖЕННЫЙ СЕКТОР', en: 'CUSTOMS SECTOR' }],
  ['Xavfli Yuklar Sektori', { ru: 'Сектор Опасных Грузов', en: 'Hazardous Cargo Sector' }],
  ['XAVFLI YUKLAR', { ru: 'ОПАСНЫЕ ГРУЗЫ', en: 'HAZARDOUS CARGO' }],
  ['Xavfsizlik Sektori', { ru: 'Сектор Повышенной Безопасности', en: 'High Security Sector' }],
  ['⚙️ Sozlash', { ru: '⚙️ Настроить', en: '⚙️ Configure' }],
  ['☣️ Ruxsatsiz', { ru: '☣️ Нет допуска', en: '☣️ Restricted' }],
  ['🔒 Ruxsat yo\'q', { ru: '🔒 Нет доступа', en: '🔒 No Access' }],
  ['🔒 Yopiq sektor (Yuklarni ko\'rish taqiqlangan)', { ru: '🔒 Закрытый сектор (Просмотр грузов запрещен)', en: '🔒 Restricted sector (Cargo viewing prohibited)' }],
  ['Ushbu ombor sektoriga kirish va undagi yuklarni ko\'rish ruxsatingiz yopilgan.', { ru: 'Доступ к данному сектору склада и просмотр находящихся в нем грузов для вас закрыт.', en: 'Your access to this warehouse sector and viewing its cargo is closed.' }],
  ['Ushbu Sektor Bilan Ishlash Huquqingiz Cheklangan:', { ru: 'Доступ к работе с данным сектором ограничен:', en: 'Your Access to This Sector is Restricted:' }],
  ['Sektor:', { ru: 'Сектор:', en: 'Sector:' }],
  ['📜 Tarix & Nakladnoylar (Invoyslar)', { ru: '📜 История и Накладные (Инвойсы)', en: '📜 History & Waybills (Invoices)' }],
  ['📜 Yukning Harakat Tarixi', { ru: '📜 История Движения Груза', en: '📜 Cargo Movement History' }],
  ['📤 Ombordan Chiqarish & Tarifni Hisoblash', { ru: '📤 Выдача со Склада и Расчет Тарифа', en: '📤 Release Cargo & Calculate Billing' }],
  ['Hech qanday yuk topilmadi', { ru: 'Грузы не найдены', en: 'No cargo found' }],
  ['Kiritilgan qidiruv yoki tanlangan sektor bo\'yicha omborda tovar mavjud emas.', { ru: 'По вашему запросу или в выбранном секторе товары на складе отсутствуют.', en: 'No cargo batches match your search query or selected sector.' }],
  ['Ushbu mezon bo\'yicha yuk topilmadi', { ru: 'По данному критерию грузы не найдены', en: 'No cargo found matching criteria' }],
  ['Yuk yo\'q (Bo\'sh)', { ru: 'Пусто (Нет грузов)', en: 'Empty (No cargo)' }],
  ['Ichki zaxira', { ru: 'Внутренний резерв', en: 'Internal stock' }],
  ['Noma\'lum mijoz', { ru: 'Неизвестный клиент', en: 'Unknown client' }],
  ['Noma\'lum Korxona', { ru: 'Неизвестная организация', en: 'Unknown company' }],
  ['Noma\'lum xodim', { ru: 'Неизвестный сотрудник', en: 'Unknown employee' }],
  ['Noma\'lum', { ru: 'Неизвестно', en: 'Unknown' }],

  // =========================================================================
  // 2. CATEGORIES & CLIENT ORGANIZATIONS
  // =========================================================================
  ['Oziq-ovqat', { ru: 'Продукты питания', en: 'Food products' }],
  ['Sut mahsulotlari', { ru: 'Молочная продукция', en: 'Dairy products' }],
  ['Baliq mahsulotlari', { ru: 'Рыбная продукция', en: 'Fish & Seafood' }],
  ['Go\'sht mahsulotlari', { ru: 'Мясная продукция', en: 'Meat products' }],
  ['Qishloq xo\'jaligi', { ru: 'Сельхозпродукция', en: 'Agricultural goods' }],
  ['To\'qimachilik', { ru: 'Текстильная продукция', en: 'Textiles' }],
  ['Kimyoviy moddalar', { ru: 'Химические вещества', en: 'Chemicals' }],
  ['Bo\'yoq va laklar', { ru: 'Лакокрасочные материалы', en: 'Paints & Coatings' }],
  ['Sanoat uskunalari', { ru: 'Промышленное оборудование', en: 'Industrial equipment' }],
  ['Elektronika va IT', { ru: 'Электроника и IT', en: 'Electronics & IT' }],
  ['Qurilish materiallari', { ru: 'Строительные материалы', en: 'Construction materials' }],
  ['Avto ehtiyot qismlar', { ru: 'Автозапчасти', en: 'Auto spare parts' }],
  ['Maishiy texnika', { ru: 'Бытовая техника', en: 'Home appliances' }],
  ['Umumiy tovarlar', { ru: 'Общие товары', en: 'General goods' }],
  ['Umumiy', { ru: 'Общий груз', en: 'General cargo' }],
  ['Stroy Snab Import Qo\'shma Korxonasi', { ru: 'СП «Stroy Snab Import»', en: 'Stroy Snab Import JV' }],
  ['Lactalis Central Asia MChJ', { ru: 'ООО «Lactalis Central Asia»', en: 'Lactalis Central Asia LLC' }],
  ['Sag Agro Logistika MChJ', { ru: 'ООО «Sag Agro Logistika»', en: 'Sag Agro Logistics LLC' }],
  ['Shakar Savdo Distribyutsiya', { ru: '«Shakar Savdo Distribyutsiya»', en: 'Shakar Savdo Distribution' }],
  ['Kipor Bo\'yoq Kimyo XK', { ru: 'ЧП «Kipor Bo\'yoq Kimyo»', en: 'Kipor Paint & Chemical PE' }],
  ['Texno Distribyutsiya MChJ', { ru: 'ООО «Texno Distribyutsiya»', en: 'Techno Distribution LLC' }],

  // =========================================================================
  // 3. CUSTOMS SERVICES & TARIFFS (ALL 30 OFFICIAL PRICE LIST ITEMS)
  // =========================================================================
  ['ж/д вагон (60 тн)', {
    uz: 'Temiryo\'l vagoni (60 tn) ortish / tushirish',
    ru: 'Ж/Д вагон (60 тн) погрузка / разгрузка',
    en: 'Railway wagon (60t) loading / unloading'
  }],
  ['Temiryo\'l vagoni (60 tn) ortish / tushirish', {
    uz: 'Temiryo\'l vagoni (60 tn) ortish / tushirish',
    ru: 'Ж/Д вагон (до 60 тн) погрузка / разгрузка',
    en: 'Railway wagon (60t) loading / unloading'
  }],
  ['Temiryo\'l vagoni (60 tn) tushirish (Разгрузка)', {
    uz: 'Temiryo\'l vagoni (60 tn) tushirish',
    ru: 'Ж/Д вагон (до 60 тн) разгрузка',
    en: 'Railway wagon (60t) unloading'
  }],
  ['Temiryo\'l vagoni (60 tn) ortish (Погрузка)', {
    uz: 'Temiryo\'l vagoni (60 tn) ortish',
    ru: 'Ж/Д вагон (до 60 тн) погрузка',
    en: 'Railway wagon (60t) loading'
  }],
  ['контейнер 40 футов', {
    uz: '40 futlik konteyner yuklash / tushirish',
    ru: 'Контейнер 40 футов (разгрузка / погрузка)',
    en: '40ft Container (unloading / loading)'
  }],
  ['Контейнер 40 футов', {
    uz: '40 futlik konteyner (tushirish / ortish)',
    ru: 'Контейнер 40 футов (разгрузка / погрузка)',
    en: '40ft Container (unloading / loading)'
  }],
  ['40 futlik konteyner yuklash / tushirish', {
    uz: '40 futlik konteyner yuklash / tushirish',
    ru: 'Контейнер 40 футов (погрузка / разгрузка)',
    en: '40ft Container loading / unloading'
  }],
  ['контейнер 20 футов', {
    uz: '20 futlik konteyner yuklash / tushirish',
    ru: 'Контейнер 20 футов (разгрузка / погрузка)',
    en: '20ft Container (unloading / loading)'
  }],
  ['Контейнер 20 футов', {
    uz: '20 futlik konteyner (tushirish / ortish)',
    ru: 'Контейнер 20 футов (разгрузка / погрузка)',
    en: '20ft Container (unloading / loading)'
  }],
  ['20 futlik konteyner yuklash / tushirish', {
    uz: '20 futlik konteyner yuklash / tushirish',
    ru: 'Контейнер 20 футов (погрузка / разгрузка)',
    en: '20ft Container loading / unloading'
  }],
  ['Погрузка или разгрузка части груза с помощью кара-погрузчика до 1 тн/за 1тн', {
    uz: 'Kara-pogruzchik yordamida qisman yuk tushirish/ortish (1 tn gacha / 1 tn uchun)',
    ru: 'Погрузка или разгрузка части груза с помощью кара-погрузчика до 1 тн / за 1 тн',
    en: 'Partial cargo loading/unloading by forklift (up to 1t / per 1t)'
  }],
  ['Kara-pogruzchik yordamida qisman yuk tushirish/ortish (1 tn gacha / 1 tn uchun)', {
    uz: 'Kara-pogruzchik yordamida qisman yuk tushirish/ortish (1 tn gacha / 1 tn uchun)',
    ru: 'Погрузка или разгрузка части груза с помощью кара-погрузчика (до 1 тн / за 1 тн)',
    en: 'Partial cargo loading/unloading by forklift (up to 1t / per 1t)'
  }],
  ['Погрузка или разгрузка части груза россыпью до 1 тн/за 1тн', {
    uz: 'Sochilma (qo\'lda) qisman yuk tushirish/ortish (1 tn gacha / 1 tn uchun)',
    ru: 'Погрузка или разгрузка части груза россыпью до 1 тн / за 1 тн',
    en: 'Manual bulk partial cargo loading/unloading (up to 1t / per 1t)'
  }],
  ['Sochilma (qo\'lda) qisman yuk tushirish/ortish (1 tn gacha / 1 tn uchun)', {
    uz: 'Sochilma (qo\'lda) qisman yuk tushirish/ortish (1 tn gacha / 1 tn uchun)',
    ru: 'Погрузка или разгрузка части груза россыпью (вручную, до 1 тн / за 1 тн)',
    en: 'Manual bulk partial cargo loading/unloading (up to 1t / per 1t)'
  }],
  ['Погрузка или разгрузка тарно-упакованного груза с помощью кара-погрузчика для полного объёма меньше 90 кб.м', {
    uz: 'Kichik hajm (<90 m³) o\'ralgan yukni kara bilan tushirish/ortish',
    ru: 'Погрузка/разгрузка тарно-упакованного груза погрузчиком (объём <90 м³)',
    en: 'Forklift loading/unloading of packaged cargo (volume <90 m³)'
  }],
  ['Kichik hajm (<90 m³) o\'ralgan yukni kara bilan tushirish/ortish', {
    uz: 'Kichik hajm (<90 m³) o\'ralgan yukni kara bilan tushirish/ortish',
    ru: 'Погрузка/разгрузка тарно-упакованного груза погрузчиком (объём <90 м³)',
    en: 'Forklift loading/unloading of packaged cargo (volume <90 m³)'
  }],
  ['Погрузка или разгрузка груза россыпью для полного объёма меньше 90 кб.м', {
    uz: 'Kichik hajm (<90 m³) sochilma yukni to\'liq tushirish/ortish',
    ru: 'Погрузка или разгрузка груза россыпью (полный объём <90 м³)',
    en: 'Bulk loading/unloading for full vehicle volume <90 m³'
  }],
  ['Kichik hajm (<90 m³) sochilma yukni to\'liq tushirish/ortish', {
    uz: 'Kichik hajm (<90 m³) sochilma yukni to\'liq tushirish/ortish',
    ru: 'Погрузка или разгрузка груза россыпью (полный объём <90 м³)',
    en: 'Bulk loading/unloading for full vehicle volume <90 m³'
  }],
  ['Погрузка или разгрузка тарно-упакованного груза с помощью кара-погрузчика для полной фуры до 90 кб.м', {
    uz: 'To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan tushirish/ortish',
    ru: 'Погрузка/разгрузка тарно-упакованного груза погрузчиком (полная фура до 90 м³)',
    en: 'Forklift loading/unloading of packaged cargo (full truck up to 90 m³)'
  }],
  ['To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan tushirish/ortish', {
    uz: 'To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan tushirish/ortish',
    ru: 'Погрузка/разгрузка тарно-упакованного груза погрузчиком (полная фура до 90 м³)',
    en: 'Forklift loading/unloading of packaged cargo (full truck up to 90 m³)'
  }],
  ['Погрузка или разгрузка груза россыпью для полной фуры до 90 кб.м', {
    uz: 'To\'liq fura (90 m³ gacha) sochilma yukni tushirish/ortish',
    ru: 'Погрузка или разгрузка груза россыпью (полная фура до 90 м³)',
    en: 'Bulk loading/unloading for full truck up to 90 m³'
  }],
  ['To\'liq fura (90 m³ gacha) sochilma yukni tushirish/ortish', {
    uz: 'To\'liq fura (90 m³ gacha) sochilma yukni tushirish/ortish',
    ru: 'Погрузка или разгрузка груза россыпью (полная фура до 90 м³)',
    en: 'Bulk loading/unloading for full truck up to 90 m³'
  }],
  ['Погрузка или разгрузка тарно-упакованного груза с помощью кара-погрузчика для полной фуры свыше 90 кб.м', {
    uz: 'Katta fura (>90 m³) o\'ralgan yukni kara bilan tushirish/ortish',
    ru: 'Погрузка/разгрузка тарно-упакованного груза погрузчиком (фура свыше 90 м³)',
    en: 'Forklift loading/unloading of packaged cargo (mega truck >90 m³)'
  }],
  ['Katta fura (>90 m³) o\'ralgan yukni kara bilan tushirish/ortish', {
    uz: 'Katta fura (>90 m³) o\'ralgan yukni kara bilan tushirish/ortish',
    ru: 'Погрузка/разгрузка тарно-упакованного груза погрузчиком (фура свыше 90 м³)',
    en: 'Forklift loading/unloading of packaged cargo (mega truck >90 m³)'
  }],
  ['Погрузка или разгрузка груза россыпью для полной фуры свыше 90 кб.м', {
    uz: 'Katta fura (>90 m³) sochilma yukni tushirish/ortish',
    ru: 'Погрузка или разгрузка груза россыпью (полная фура свыше 90 м³)',
    en: 'Bulk loading/unloading for mega truck >90 m³'
  }],
  ['Katta fura (>90 m³) sochilma yukni tushirish/ortish', {
    uz: 'Katta fura (>90 m³) sochilma yukni tushirish/ortish',
    ru: 'Погрузка или разгрузка груза россыпью (полная фура свыше 90 м³)',
    en: 'Bulk loading/unloading for mega truck >90 m³'
  }],
  ['Фypa до 90 m3 (kara bilan)', {
    uz: 'Avtofura 90 m³ gacha (kara orqali)',
    ru: 'Фура до 90 м³ (электропогрузчиком)',
    en: 'Truck up to 90 m³ (by forklift)'
  }],
  ['Фура до 90 m3 (kara bilan)', {
    uz: 'Avtofura 90 m³ gacha (kara orqali)',
    ru: 'Фура до 90 м³ (электропогрузчиком)',
    en: 'Truck up to 90 m³ (by forklift)'
  }],
  ['40 futlik konteyner tushirish (Разгрузка)', {
    uz: '40 futlik konteyner tushirish',
    ru: 'Контейнер 40 футов (разгрузка)',
    en: '40ft Container (unloading)'
  }],
  ['40 futlik konteyner yuklash (Погрузка)', {
    uz: '40 futlik konteyner yuklash',
    ru: 'Контейнер 40 футов (погрузка)',
    en: '40ft Container (loading)'
  }],
  ['20 futlik konteyner tushirish (Разгрузка)', {
    uz: '20 futlik konteyner tushirish',
    ru: 'Контейнер 20 футов (разгрузка)',
    en: '20ft Container (unloading)'
  }],
  ['20 futlik konteyner yuklash (Погрузка)', {
    uz: '20 futlik konteyner yuklash',
    ru: 'Контейнер 20 футов (погрузка)',
    en: '20ft Container (loading)'
  }],
  ['Kara-pogruzchik yordamida qisman yuk tushirish (Разгрузка) (1 tn gacha / 1 tn uchun)', {
    uz: 'Kara-pogruzchik yordamida qisman yuk tushirish (1 tn gacha / 1 tn uchun)',
    ru: 'Разгрузка части груза погрузчиком (до 1 тн / за 1 тн)',
    en: 'Partial cargo unloading by forklift (up to 1t / per 1t)'
  }],
  ['Kara-pogruzchik yordamida qisman yuk ortish (Погрузка) (1 tn gacha / 1 tn uchun)', {
    uz: 'Kara-pogruzchik yordamida qisman yuk ortish (1 tn gacha / 1 tn uchun)',
    ru: 'Погрузка части груза погрузчиком (до 1 тн / за 1 тн)',
    en: 'Partial cargo loading by forklift (up to 1t / per 1t)'
  }],
  ['Sochilma (qo\'lda) qisman yuk tushirish (Разгрузка) (1 tn gacha / 1 tn uchun)', {
    uz: 'Sochilma (qo\'lda) qisman yuk tushirish (1 tn gacha / 1 tn uchun)',
    ru: 'Разгрузка части груза россыпью вручную (до 1 тн / за 1 тн)',
    en: 'Manual bulk partial cargo unloading (up to 1t / per 1t)'
  }],
  ['Sochilma (qo\'lda) qisman yuk ortish (Погрузка) (1 tn gacha / 1 tn uchun)', {
    uz: 'Sochilma (qo\'lda) qisman yuk ortish (1 tn gacha / 1 tn uchun)',
    ru: 'Погрузка части груза россыпью вручную (до 1 тн / за 1 тн)',
    en: 'Manual bulk partial cargo loading (up to 1t / per 1t)'
  }],
  ['Kichik hajm (<90 m³) o\'ralgan yukni kara bilan tushirish (Разгрузка)', {
    uz: 'Kichik hajm (<90 m³) o\'ralgan yukni kara bilan tushirish',
    ru: 'Разгрузка тарно-упакованного груза погрузчиком (объём <90 м³)',
    en: 'Forklift unloading of packaged cargo (volume <90 m³)'
  }],
  ['Kichik hajm (<90 m³) o\'ralgan yukni kara bilan ortish (Погрузка)', {
    uz: 'Kichik hajm (<90 m³) o\'ralgan yukni kara bilan ortish',
    ru: 'Погрузка тарно-упакованного груза погрузчиком (объём <90 м³)',
    en: 'Forklift loading of packaged cargo (volume <90 m³)'
  }],
  ['Kichik hajm (<90 m³) sochilma yukni to\'liq tushirish (Разгрузка)', {
    uz: 'Kichik hajm (<90 m³) sochilma yukni to\'liq tushirish',
    ru: 'Разгрузка груза россыпью (полный объём <90 м³)',
    en: 'Bulk unloading for full vehicle volume <90 m³'
  }],
  ['Kichik hajm (<90 m³) sochilma yukni to\'liq ortish (Погрузка)', {
    uz: 'Kichik hajm (<90 m³) sochilma yukni to\'liq ortish',
    ru: 'Погрузка груза россыпью (полный объём <90 м³)',
    en: 'Bulk loading for full vehicle volume <90 m³'
  }],
  ['To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan tushirish (Разгрузка)', {
    uz: 'To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan tushirish',
    ru: 'Разгрузка тарно-упакованного груза погрузчиком (полная фура до 90 м³)',
    en: 'Forklift unloading of packaged cargo (full truck up to 90 m³)'
  }],
  ['To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan ortish (Погрузка)', {
    uz: 'To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan ortish',
    ru: 'Погрузка тарно-упакованного груза погрузчиком (полная фура до 90 м³)',
    en: 'Forklift loading of packaged cargo (full truck up to 90 m³)'
  }],
  ['To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan tushirish', {
    uz: 'To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan tushirish',
    ru: 'Разгрузка тарно-упакованного груза погрузчиком (полная фура до 90 м³)',
    en: 'Forklift unloading of packaged cargo (full truck up to 90 m³)'
  }],
  ['To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan ortish', {
    uz: 'To\'liq fura (90 m³ gacha) o\'ralgan yukni kara bilan ortish',
    ru: 'Погрузка тарно-упакованного груза погрузчиком (полная фура до 90 м³)',
    en: 'Forklift loading of packaged cargo (full truck up to 90 m³)'
  }],
  ['To\'liq fura (90 m³ gacha) sochilma yukni tushirish (Разгрузка)', {
    uz: 'To\'liq fura (90 m³ gacha) sochilma yukni tushirish',
    ru: 'Разгрузка груза россыпью (полная фура до 90 м³)',
    en: 'Bulk unloading for full truck up to 90 m³'
  }],
  ['To\'liq fura (90 m³ gacha) sochilma yukni ortish (Погрузка)', {
    uz: 'To\'liq fura (90 m³ gacha) sochilma yukni ortish',
    ru: 'Погрузка груза россыпью (полная фура до 90 м³)',
    en: 'Bulk loading for full truck up to 90 m³'
  }],
  ['Katta fura (>90 m³) o\'ralgan yukni kara bilan tushirish (Разгрузка)', {
    uz: 'Katta fura (>90 m³) o\'ralgan yukni kara bilan tushirish',
    ru: 'Разгрузка тарно-упакованного груза погрузчиком (фура свыше 90 м³)',
    en: 'Forklift unloading of packaged cargo (mega truck >90 m³)'
  }],
  ['Katta fura (>90 m³) o\'ralgan yukni kara bilan ortish (Погрузка)', {
    uz: 'Katta fura (>90 m³) o\'ralgan yukni kara bilan ortish',
    ru: 'Погрузка тарно-упакованного груза погрузчиком (фура свыше 90 м³)',
    en: 'Forklift loading of packaged cargo (mega truck >90 m³)'
  }],
  ['Katta fura (>90 m³) sochilma yukni tushirish (Разгрузка)', {
    uz: 'Katta fura (>90 m³) sochilma yukni tushirish',
    ru: 'Разгрузка груза россыпью (полная фура свыше 90 м³)',
    en: 'Bulk unloading for mega truck >90 m³'
  }],
  ['Katta fura (>90 m³) sochilma yukni ortish (Погрузка)', {
    uz: 'Katta fura (>90 m³) sochilma yukni ortish',
    ru: 'Погрузка груза россыпью (полная фура свыше 90 м³)',
    en: 'Bulk loading for mega truck >90 m³'
  }],
  ['Avtomashina yoki gazel (sochma yuk tushirish)', {
    uz: 'Avtomashina yoki gazel (sochma yuk tushirish)',
    ru: 'Автомашина или Газель (разгрузка россыпью)',
    en: 'Light truck or Gazelle (bulk unloading)'
  }],
  ['Kara-pogruzchik yordamida yuk tushirish (1 tn)', {
    uz: 'Kara-pogruzchik yordamida yuk tushirish (1 tn)',
    ru: 'Разгрузка груза с помощью кара-погрузчика (1 тн)',
    en: 'Cargo unloading by forklift (1 ton)'
  }],
  ['Kara-pogruzchik yordamida yuk ortish (1 tn)', {
    uz: 'Kara-pogruzchik yordamida yuk ortish (1 tn)',
    ru: 'Погрузка груза с помощью кара-погрузчика (1 тн)',
    en: 'Cargo loading by forklift (1 ton)'
  }],
  ['Fura < 90 m3 kara-pogruzchik yordamida yuk ortish', {
    uz: 'Fura < 90 m³ kara-pogruzchik yordamida yuk ortish',
    ru: 'Фура < 90 м³ погрузка с помощью кара-погрузчика',
    en: 'Truck < 90 m³ cargo loading by forklift'
  }],
  ['ж/д вагон 60 tn (kara va mexanizm yordamida tushirish)', {
    uz: 'Temiryo\'l vagoni 60 tn (kara va mexanizm yordamida tushirish)',
    ru: 'Ж/Д вагон 60 тн (механизированная разгрузка погрузчиком)',
    en: 'Railway wagon 60t (mechanized forklift unloading)'
  }],
  ['ж/д вагон 60 tn', {
    uz: 'Temiryo\'l vagoni (60 tn)',
    ru: 'Ж/Д вагон (60 тн)',
    en: 'Railway wagon (60t)'
  }],
  ['Konteynerga yuklash (20 futlik)', {
    uz: 'Konteynerga yuklash (20 futlik)',
    ru: 'Погрузка в контейнер (20 футов)',
    en: 'Container loading (20ft)'
  }],
  ['Refrijerator furasiga yuk ortish', {
    uz: 'Refrijerator furasiga yuk ortish',
    ru: 'Погрузка в рефрижераторную фуру',
    en: 'Loading into refrigerated truck'
  }],
  ['Yuk mashinasi / Fura (sochma yuk ortish)', {
    uz: 'Yuk mashinasi / Fura (sochma yuk ortish)',
    ru: 'Грузовой автомобиль / Фура (погрузка россыпью)',
    en: 'Cargo truck (bulk loading)'
  }],
  ['Muzlatkichli Harorat Tarifi (Xolodilnik)', {
    uz: 'Muzlatkichli Harorat Tarifi (Xolodilnik)',
    ru: 'Тариф Морозильного Хранения (Холодильник)',
    en: 'Cold Freezer Storage Tariff'
  }],
  ['Qimmatbaho Texnika Saqlash Tarifi', {
    uz: 'Qimmatbaho Texnika Saqlash Tarifi',
    ru: 'Тариф Хранения Ценной Техники',
    en: 'High-Value Equipment Storage Tariff'
  }],
  ['Sovutilgan Mahsulotlar Tarifi (+4°C)', {
    uz: 'Sovutilgan Mahsulotlar Tarifi (+4°C)',
    ru: 'Тариф Охлажденных Продуктов (+4°C)',
    en: 'Chilled Products Tariff (+4°C)'
  }],
  ['Standart Quruq Saqlash Tarifi', {
    uz: 'Standart Quruq Saqlash Tarifi',
    ru: 'Стандартный Тариф Сухого Хранения',
    en: 'Standard Dry Storage Tariff'
  }],
  ['Tekstil & Sanoat Xom-ashyosi Tarifi', {
    uz: 'Tekstil & Sanoat Xom-ashyosi Tarifi',
    ru: 'Тариф Хранения Текстиля и Промышленного Сырья',
    en: 'Textile & Industrial Raw Materials Tariff'
  }],
  ['Хранение 1тн груза в сутки (без паллетоместа)', {
    uz: '1 tn yuk saqlash (palletasiz) / kuniga',
    ru: 'Хранение 1 тн груза в сутки (без паллетоместа)',
    en: 'Storage of 1 ton cargo per day (without pallet)'
  }],
  ['1 tn yuk saqlash (palletasiz) / kuniga', {
    uz: '1 tn yuk saqlash (palletasiz) / kuniga',
    ru: 'Хранение 1 тн груза в сутки (без паллетоместа)',
    en: 'Storage of 1 ton cargo per day (without pallet)'
  }],
  ['1 tn yuk saqlash (palletsiz) / kuniga', {
    uz: '1 tn yuk saqlash (palletsiz) / kuniga',
    ru: 'Хранение 1 тн груза в сутки (без паллетоместа)',
    en: 'Storage of 1 ton cargo per day (without pallet)'
  }],
  ['Хранение за объем груза свыше 100 тн, за 1тн в сутки (без паллетоместа)', {
    uz: 'Katta hajm (>100 tn) saqlash / 1 tn kuniga (palletasiz)',
    ru: 'Хранение объёма свыше 100 тн, за 1 тн в сутки (без паллетоместа)',
    en: 'Bulk storage over 100 tons, per 1 ton/day (without pallet)'
  }],
  ['Katta hajm (>100 tn) saqlash / 1 tn kuniga (palletasiz)', {
    uz: 'Katta hajm (>100 tn) saqlash / 1 tn kuniga (palletasiz)',
    ru: 'Хранение объёма свыше 100 тн, за 1 тн в сутки (без паллетоместа)',
    en: 'Bulk storage over 100 tons, per 1 ton/day (without pallet)'
  }],
  ['Хранение 1тн груза сроком свыше 60 дней с момента выгрузки в сутки', {
    uz: 'Uzoq muddat (>60 kun) saqlash / 1 tn kuniga',
    ru: 'Хранение 1 тн груза сроком свыше 60 дней в сутки',
    en: 'Long-term storage (>60 days) per 1 ton/day'
  }],
  ['Uzoq muddat (>60 kun) saqlash / 1 tn kuniga', {
    uz: 'Uzoq muddat (>60 kun) saqlash / 1 tn kuniga',
    ru: 'Хранение 1 тн груза сроком свыше 60 дней в сутки',
    en: 'Long-term storage (>60 days) per 1 ton/day'
  }],
  ['Хранение габаритного груза за одну единицу, в сутки', {
    uz: 'Katta gabaritli yuk saqlash / 1 dona kuniga',
    ru: 'Хранение габаритного груза за 1 единицу в сутки',
    en: 'Oversized cargo storage per 1 unit/day'
  }],
  ['Katta gabaritli yuk saqlash / 1 dona kuniga', {
    uz: 'Katta gabaritli yuk saqlash / 1 dona kuniga',
    ru: 'Хранение габаритного груза за 1 единицу в сутки',
    en: 'Oversized cargo storage per 1 unit/day'
  }],
  ['Хранение грузов 1 места по паллетам, в сутки', {
    uz: 'Palletali joyda yuk saqlash / 1 pallet kuniga',
    ru: 'Хранение грузов 1 паллетоместа в сутки',
    en: 'Palletized cargo storage per 1 pallet/day'
  }],
  ['Palletali joyda yuk saqlash / 1 pallet kuniga', {
    uz: 'Palletali joyda yuk saqlash / 1 pallet kuniga',
    ru: 'Хранение грузов 1 паллетоместа в сутки',
    en: 'Palletized cargo storage per 1 pallet/day'
  }],
  ['Хранение 1 ед. легкового автотранспортного средства в сутки', {
    uz: 'Yengil avtotransport saqlash / 1 mashina kuniga',
    ru: 'Хранение 1 ед. легкового автотранспорта в сутки',
    en: 'Passenger vehicle storage per 1 unit/day'
  }],
  ['Yengil avtotransport saqlash / 1 mashina kuniga', {
    uz: 'Yengil avtotransport saqlash / 1 mashina kuniga',
    ru: 'Хранение 1 ед. легкового автотранспорта в сутки',
    en: 'Passenger vehicle storage per 1 unit/day'
  }],
  ['Хранение 1 ед. грузового автотранспортного средства в сутки', {
    uz: 'Yuk avtotransporti (fura) saqlash / 1 fura kuniga',
    ru: 'Хранение 1 ед. грузового автотранспорта (фуры) в сутки',
    en: 'Heavy truck storage per 1 truck/day'
  }],
  ['Yuk avtotransporti (fura) saqlash / 1 fura kuniga', {
    uz: 'Yuk avtotransporti (fura) saqlash / 1 fura kuniga',
    ru: 'Хранение 1 ед. грузового автотранспорта (фуры) в сутки',
    en: 'Heavy truck storage per 1 truck/day'
  }],
  ['Хранение 1 ед. прочих транспортных средств', {
    uz: 'Boshqa / maxsus transport vositalari saqlash / kuniga',
    ru: 'Хранение 1 ед. прочих / специальных транспортных средств в сутки',
    en: 'Special / other vehicle storage per 1 unit/day'
  }],
  ['Boshqa / maxsus transport vositalari saqlash / kuniga', {
    uz: 'Boshqa / maxsus transport vositalari saqlash / kuniga',
    ru: 'Хранение 1 ед. прочих / специальных транспортных средств в сутки',
    en: 'Special / other vehicle storage per 1 unit/day'
  }],
  ['Хранение 20/40 футового контейнера в сутки', {
    uz: '20/40 futlik konteyner saqlash / 1 konteyner kuniga',
    ru: 'Хранение 20/40-футового контейнера в сутки',
    en: '20/40ft container storage per 1 container/day'
  }],
  ['20/40 futlik konteyner saqlash / 1 konteyner kuniga', {
    uz: '20/40 futlik konteyner saqlash / 1 konteyner kuniga',
    ru: 'Хранение 20/40-футового контейнера в сутки',
    en: '20/40ft container storage per 1 container/day'
  }],
  ['Хранение груза в холодильниках в сутки', {
    uz: 'Sovutgich / Muzlatkich (xolodilnik)da saqlash / 1 kg kuniga',
    ru: 'Хранение груза в холодильниках в сутки',
    en: 'Cold & freezer storage per 1 kg/day'
  }],
  ['Sovutgich / Muzlatkich (xolodilnik)da saqlash / 1 kg kuniga', {
    uz: 'Sovutgich / Muzlatkich (xolodilnik)da saqlash / 1 kg kuniga',
    ru: 'Хранение груза в холодильниках в сутки (за 1 кг)',
    en: 'Cold & freezer storage per 1 kg/day'
  }],
  ['Упаковка стрейч-пленкой за 1плм', {
    uz: 'Streych-plyonka bilan o\'rash (1 p/m uchun)',
    ru: 'Упаковка стрейч-пленкой за 1 паллетоместо',
    en: 'Stretch-film wrapping per 1 pallet'
  }],
  ['Streych-plyonka bilan o\'rash (1 p/m uchun)', {
    uz: 'Streych-plyonka bilan o\'rash (1 p/m uchun)',
    ru: 'Упаковка стрейч-пленкой (за 1 п/м)',
    en: 'Stretch-film wrapping (per 1 pallet)'
  }],
  ['Формирование тарно-упакованного груза (мешки, коробки и т.п) на поддон (без сортировки по видам), за один поддон', {
    uz: 'Poddonga terish va shakllantirish (saralashsiz) / 1 poddon',
    ru: 'Формирование груза на поддон (без сортировки по видам), за 1 поддон',
    en: 'Palletizing packaged cargo (without sorting) per 1 pallet'
  }],
  ['Poddonga terish va shakllantirish (saralashsiz) / 1 poddon', {
    uz: 'Poddonga terish va shakllantirish (saralashsiz) / 1 poddon',
    ru: 'Формирование груза на поддон (без сортировки), за 1 поддон',
    en: 'Palletizing packaged cargo (without sorting) per 1 pallet'
  }],
  ['Формирование тарно-упакованного груза (мешки, коробки и т.п) на поддон с сортировкой по видам, за один поддон', {
    uz: 'Poddonga terish (turlar bo\'yicha saralash bilan) / 1 poddon',
    ru: 'Формирование груза на поддон с сортировкой по видам, за 1 поддон',
    en: 'Palletizing packaged cargo (with sorting by type) per 1 pallet'
  }],
  ['Poddonga terish (turlar bo\'yicha saralash bilan) / 1 poddon', {
    uz: 'Poddonga terish (turlar bo\'yicha saralash bilan) / 1 poddon',
    ru: 'Формирование груза на поддон с сортировкой по видам, за 1 поддон',
    en: 'Palletizing packaged cargo (with sorting by type) per 1 pallet'
  }],
  ['Сортировка и формирование груза до 1 тн/за 1тн (при каждой частичной отгрузке)', {
    uz: 'Yukni saralash va shakllantirish (har bir qisman jo\'natishda) / 1 tn',
    ru: 'Сортировка и формирование груза до 1 тн / за 1 тн (при частичной отгрузке)',
    en: 'Cargo sorting & forming per 1 ton (per partial shipment)'
  }],
  ['Yukni saralash va shakllantirish (har bir qisman jo\'natishda) / 1 tn', {
    uz: 'Yukni saralash va shakllantirish (har bir qisman jo\'natishda) / 1 tn',
    ru: 'Сортировка и формирование груза (при каждой частичной отгрузке) / 1 тн',
    en: 'Cargo sorting & forming (per partial shipment) / 1 ton'
  }],
  ['Стоянка за 1 день на территории склада для прибывших грузовых транспортов, готовых к выгрузке для одного грузополучателя', {
    uz: 'Yuk furasining stoyankasi (1 ta yuk oluvchi uchun)',
    ru: 'Стоянка грузового транспорта на территории склада (для одного грузополучателя)',
    en: 'Truck parking on warehouse premises (single consignee)'
  }],
  ['Yuk furasining stoyankasi (1 ta yuk oluvchi uchun)', {
    uz: 'Yuk furasining stoyankasi (1 ta yuk oluvchi uchun)',
    ru: 'Стоянка грузовой фуры (для 1 грузополучателя)',
    en: 'Truck parking (for 1 consignee)'
  }],
  ['Стоянка за 1 день на территории склада для прибывших грузовых транспортных средств, готовых к выгрузке для нескольких грузополучателей (оплата с каждого грузополучателя)', {
    uz: 'Yuk furasining stoyankasi (bir nechta yuk oluvchi — har biridan)',
    ru: 'Стоянка грузового транспорта для нескольких грузополучателей (с каждого)',
    en: 'Truck parking for multiple consignees (charged per consignee)'
  }],
  ['Yuk furasining stoyankasi (bir nechta yuk oluvchi — har biridan)', {
    uz: 'Yuk furasining stoyankasi (bir nechta yuk oluvchi — har biridan)',
    ru: 'Стоянка грузовой фуры (несколько получателей — с каждого)',
    en: 'Truck parking (multiple consignees — per consignee)'
  }],
  ['Провозная плата со станции до таможенного склада «JB GROUP»', {
    uz: 'Temiryo\'l stansiyasidan «JB GROUP» bojxona omboriga tashish to\'lovi',
    ru: 'Провозная плата со станции до таможенного склада «JB GROUP»',
    en: 'Railway station to JB GROUP customs warehouse haulage fee'
  }],
  ['Temiryo\'l stansiyasidan «JB GROUP» bojxona omboriga tashish to\'lovi', {
    uz: 'Temiryo\'l stansiyasidan «JB GROUP» bojxona omboriga tashish to\'lovi',
    ru: 'Провозная плата со станции до таможенного склада «JB GROUP»',
    en: 'Railway station to JB GROUP customs warehouse haulage fee'
  }],
  ['Очистка грузового отсека грузовых транспортных средств (за 1 ед.)', {
    uz: 'Yuk mashinasi yuk xonasini tozalash / yuvish (1 ta transport)',
    ru: 'Очистка грузового отсека транспортного средства (за 1 ед.)',
    en: 'Cleaning of truck cargo compartment (per 1 vehicle)'
  }],
  ['Yuk mashinasi yuk xonasini tozalash / yuvish (1 ta transport)', {
    uz: 'Yuk mashinasi yuk xonasini tozalash / yuvish (1 ta transport)',
    ru: 'Очистка / мойка грузового отсека фуры (за 1 транспорт)',
    en: 'Cleaning / washing of truck cargo compartment (1 vehicle)'
  }],
  ['Простой вагона на подъездном пути (за один вагон) в сутки', {
    uz: 'Vagon shoxobcha yo\'lida bekor turishi (prostoy) / 1 vagon',
    ru: 'Простой вагона на подъездном пути (за 1 вагон)',
    en: 'Railway wagon demurrage on siding track (per 1 wagon)'
  }],
  ['Vagon shoxobcha yo\'lida bekor turishi (prostoy) / 1 vagon', {
    uz: 'Vagon shoxobcha yo\'lida bekor turishi (prostoy) / 1 vagon',
    ru: 'Простой вагона на подъездном пути (за 1 вагон)',
    en: 'Railway wagon demurrage on siding track (per 1 wagon)'
  }],
  ['Очистка вагона (за один вагон)', {
    uz: 'Temiryo\'l vagonini tozalash / 1 vagon',
    ru: 'Очистка ж/д вагона (за 1 вагон)',
    en: 'Railway wagon cleaning (per 1 wagon)'
  }],
  ['Temiryo\'l vagonini tozalash / 1 vagon', {
    uz: 'Temiryo\'l vagonini tozalash / 1 vagon',
    ru: 'Очистка ж/д вагона (за 1 вагон)',
    en: 'Railway wagon cleaning (per 1 wagon)'
  }],
  ['Кросс-докинг оформление грузов через территорию таможенного склада на условиях выпуска для свободного обращения', {
    uz: 'Kross-doking bojxona rasmiylashtiruvi (erkin muomala shartida)',
    ru: 'Кросс-докинг оформление грузов через таможенный склад',
    en: 'Cross-docking customs clearance through warehouse territory'
  }],
  ['Kross-doking bojxona rasmiylashtiruvi (erkin muomala shartida)', {
    uz: 'Kross-doking bojxona rasmiylashtiruvi (erkin muomala shartida)',
    ru: 'Кросс-докинг таможенное оформление (выпуск для свободного обращения)',
    en: 'Cross-docking customs clearance (release for free circulation)'
  }],
  ['Tushirish xizmatisiz (Mijoz o\'z kuchi bilan)', {
    uz: 'Tushirish xizmatisiz (Mijoz o\'z kuchi bilan)',
    ru: 'Без услуги разгрузки (Силами клиента)',
    en: 'Without unloading service (By client)'
  }],
  ['Ortish xizmatisiz (Mijoz o\'z kuchi bilan)', {
    uz: 'Ortish xizmatisiz (Mijoz o\'z kuchi bilan)',
    ru: 'Без услуги погрузки (Силами клиента)',
    en: 'Without loading service (By client)'
  }],

  // =========================================================================
  // 4. MOVEMENTS HISTORY & ACTIVITY TAB
  // =========================================================================
  ['Jami Mahsulotlar', { ru: 'Всего Партий Грузов', en: 'Total Cargo Batches' }],
  ['Faol Sektorlar', { ru: 'Активные Секторы', en: 'Active Sectors' }],
  ['A, B, C, D, E, F Sektorlar (17 593 m²)', { ru: 'Секторы A, B, C, D, E, F (17 593 м²)', en: 'Sectors A, B, C, D, E, F (17,593 m²)' }],
  ['Boshqaruv Tizimi', { ru: 'Система Учета', en: 'Management System' }],
  ['Kunlik Hisob-kitob', { ru: 'Посуточный Расчет', en: 'Daily Billing' }],
  ['Miqdor × Kunlik narx × Kunlar', { ru: 'Объём × Суточная ставка × Дни', en: 'Quantity × Daily rate × Days' }],
  ['📈 Ombordagi Kirib Chiqqan Yuklar Miqdori Statistikasi (Haftalik)', {
    ru: '📈 Статистика Прихода и Расхода Грузов на Складе (За неделю)',
    en: '📈 Weekly Warehouse Inbound & Outbound Cargo Statistics'
  }],
  ['Kirim va chiqim amallari dinamikasi', { ru: 'Динамика приходных и расходных операций', en: 'Dynamics of inbound and outbound operations' }],
  ['Barcha Yuklar Harakati, Kirim va Chiqim Tarixi', {
    ru: 'Полная История Движения Грузов (Приход и Расход)',
    en: 'Complete Cargo Movement, Inbound & Outbound History'
  }],
  ['Kim qabul qilgan, kim qancha chiqargan, qabul qiluvchi INN va barcha rasmiy ma\'lumotlar to\'liq arxivi', {
    ru: 'Полный архив: кто принял, кто выдал, ИНН получателя и все официальные накладные',
    en: 'Full archive of receiving staff, releasing staff, receiver TIN, and official waybills'
  }],
  ['🔍 Tovar, korxona, INN yoki xodim...', { ru: '🔍 Груз, организация, ИНН или сотрудник...', en: '🔍 Cargo, company, TIN or staff...' }],
  ['🏢 Ruxsat berilgan ombor/sektor:', { ru: '🏢 Разрешенный склад/сектор:', en: '🏢 Permitted warehouse/sector:' }],
  ['Kirim amali muvaffaqiyatli bajarildi', { ru: 'Операция прихода успешно выполнена', en: 'Inbound operation completed successfully' }],
  ['Chiqim amali muvaffaqiyatli bajarildi', { ru: 'Операция расхода успешно выполнена', en: 'Outbound operation completed successfully' }],
  ['Barchasi', { ru: 'Все', en: 'All' }],
  ['📥 Kirimlar', { ru: '📥 Приходы', en: '📥 Inbound' }],
  ['📤 Chiqimlar', { ru: '📤 Расходы', en: '📤 Outbound' }],
  ['Kirim', { ru: 'Приход', en: 'Inbound' }],
  ['Chiqim', { ru: 'Расход', en: 'Outbound' }],
  ['Amal', { ru: 'Операция', en: 'Action' }],
  ['To\'lov', { ru: 'Оплата', en: 'Payment' }],
  ['Holati', { ru: 'Статус', en: 'Status' }],
  ['(Omborchi)', { ru: '(Кладовщик)', en: '(Warehouseman)' }],
  ['Omborchi', { ru: 'Кладовщик', en: 'Warehouseman' }],
  ['Yuk Nomi & Sektor', { ru: 'Наименование Груза и Сектор', en: 'Cargo Name & Sector' }],
  ['Kim Qabul Qilgan (Kirim)', { ru: 'Кто Принял (Приход)', en: 'Received By (Inbound)' }],
  ['Kim Chiqargan (Chiqim)', { ru: 'Кто Выдал (Расход)', en: 'Released By (Outbound)' }],
  ['Yuk Berilgan Tarafi & INN', { ru: 'Грузополучатель и ИНН', en: 'Consignee & TIN (INN)' }],
  ['Qabul qiluvchi', { ru: 'Получатель', en: 'Consignee' }],
  ['Miqdor & Og\'irlik', { ru: 'Количество и Вес', en: 'Quantity & Weight' }],
  ['Sana & Vaqt', { ru: 'Дата и Время', en: 'Date & Time' }],
  ['Hujjat / Nakladnoy', { ru: 'Документ / Накладная', en: 'Document / Waybill' }],
  ['📥 KIRIM', { ru: '📥 ПРИХОД', en: '📥 INBOUND' }],
  ['📤 CHIQIM', { ru: '📤 РАСХОД', en: '📤 OUTBOUND' }],
  ['🔒 Maxfiy', { ru: '🔒 Скрыто', en: '🔒 Confidential' }],
  ['Yashirin', { ru: 'Скрыто', en: 'Hidden' }],
  ['🧾 Chiqim Nakladnoyi', { ru: '🧾 Расходная Накладная', en: '🧾 Outbound Waybill' }],
  ['📤 Chiqarilgan', { ru: '📤 Выдано', en: '📤 Released' }],
  ['✅ Qabul Tarixi', { ru: '✅ Принято', en: '✅ Received' }],
  ['Mijoz (Egasi):', { ru: 'Клиент (Владелец):', en: 'Client (Owner):' }],

  // =========================================================================
  // 5. PAYERS & CONTRACTS TAB
  // =========================================================================
  ['Yuk To\'lovchilari va Shartnomalar Reestri', {
    ru: 'Реестр Плательщиков и Договоров Хранения',
    en: 'Contract Payers & Storage Agreements Registry'
  }],
  ['Bojxona ombori bilan rasmiy saqlash shartnomasi tuzgan mijozlar. Shartnoma muddati tugagan to\'lovchilarning tovarlarini chiqarish tizim tomonidan avtomatik bloklanadi.', {
    ru: 'Клиенты, заключившие официальный договор хранения с таможенным складом. Выдача грузов по просроченным договорам автоматически блокируется системой.',
    en: 'Clients with official customs warehouse storage contracts. Cargo release is automatically blocked for expired contracts.'
  }],
  ['Yangi Shartnoma Tuzish', { ru: 'Заключить Новый Договор', en: 'New Storage Contract' }],
  ['Jami Shartnomalar', { ru: 'Всего Договоров', en: 'Total Contracts' }],
  ['Ro\'yxatga olingan to\'lovchi korxonalar', { ru: 'Зарегистрированные организации-плательщики', en: 'Registered payer companies' }],
  ['🟢 Amaldagi Shartnomalar', { ru: '🟢 Действующие Договоры', en: '🟢 Active Contracts' }],
  ['To\'lov va ombor amallariga ruxsat bor', { ru: 'Операции и выдача грузов разрешены', en: 'Warehouse operations & release permitted' }],
  ['⛔ Muddati Tugagan Shartnomalar', { ru: '⛔ Просроченные Договоры', en: '⛔ Expired Contracts' }],
  ['To\'lov va chiqim avtomatik bloklangan', { ru: 'Оплата и расход автоматически заблокированы', en: 'Billing & outbound release automatically blocked' }],
  ['📋 Shartnoma Tuzgan Mijozlar Ro\'yxati', { ru: '📋 Список Клиентов по Договорам', en: '📋 Contracted Clients List' }],
  ['Sana formati: YYYY-MM-DD', { ru: 'Формат даты: ГГГГ-ММ-ДД', en: 'Date format: YYYY-MM-DD' }],
  ['To\'lovchi Korxona & STIR', { ru: 'Организация-Плательщик и ИНН', en: 'Payer Company & TIN' }],
  ['Shartnoma Raqami', { ru: 'Номер Договора', en: 'Contract Number' }],
  ['Tuzilgan Sana', { ru: 'Дата Заключения', en: 'Start Date' }],
  ['Amal Qilish Muddati (Qachongacha)', { ru: 'Срок Действия (До какой даты)', en: 'Expiration Date (Valid Until)' }],
  ['Shartnoma Holati', { ru: 'Статус Договора', en: 'Contract Status' }],
  ['Mas\'ul Vakil & Telefon', { ru: 'Ответственное Лицо и Телефон', en: 'Contact Person & Phone' }],
  ['Muddati o\'tgan!', { ru: 'Срок истек!', en: 'Expired!' }],
  ['Amal qilish muddati ichida', { ru: 'В пределах срока действия', en: 'Within validity period' }],
  ['Muddati Tugagan (Bloklangan)', { ru: 'Просрочен (Заблокирован)', en: 'Expired (Blocked)' }],
  ['Shartnoma Faol', { ru: 'Договор Активен', en: 'Contract Active' }],
  ['⚡ Muddatni Uzaytirish', { ru: '⚡ Продлить Срок', en: '⚡ Extend Contract' }],
  ['✏️ Tahrirlash', { ru: '✏️ Изменить', en: '✏️ Edit' }],
  ['Shartnoma muddati va chiqim qoidasi:', { ru: 'Правило срока договора и выдачи грузов:', en: 'Contract Expiration & Outbound Release Rule:' }],
  ['Agar to\'lovchining shartnoma muddati tugagan bo\'lsa, omborchi ushbu mijozning tovarlarini chiqim qila olmaydi (Chiqim modali qizil ogohlantirish beradi va tasdiqlash bloklanadi).', {
    ru: 'Если срок договора плательщика истек, кладовщик не сможет выдать товары этого клиента (окно расхода покажет предупреждение и заблокирует выдачу).',
    en: 'If a payer\'s contract has expired, warehouse staff cannot release their cargo (the outbound modal displays a red warning and blocks confirmation).'
  }],
  ['Ruxsat Cheklangan', { ru: 'Доступ Ограничен', en: 'Access Restricted' }],
  ['Bojxona ombori saqlovi bo\'yicha yillik bosh shartnoma', { ru: 'Генеральный годовой договор хранения на таможенном складе', en: 'Annual master customs warehouse storage agreement' }],
  ['Saqlash va logistika xizmatlari shartnomasi', { ru: 'Договор хранения и логистических услуг', en: 'Storage and logistics services contract' }],
  ['Diqqat: Shartnoma muddati tugagan! Shartnomani yangilash talab etiladi', { ru: 'Внимание: Срок договора истек! Требуется продление договора', en: 'Warning: Contract expired! Contract renewal required' }],
  ['Sanoat yuklari ombori shartnomasi', { ru: 'Договор складского хранения промышленных грузов', en: 'Industrial cargo warehouse storage contract' }],
  ['Shartnoma muddati tugagan. Yangi shartnoma imzolanmaguncha chiqim bloklanadi', { ru: 'Срок договора истек. Расход заблокирован до продления договора', en: 'Contract expired. Outbound release blocked until renewal' }],
  ['Qurilish va metall tovarlari saqlovi', { ru: 'Хранение строительных и металлоизделий', en: 'Construction and metal goods storage' }],

  // =========================================================================
  // 6. ACCOUNTING & FINANCE TAB
  // =========================================================================
  ['«JB GROUP» MCHJ BOJXONA VA OMBORXONA LOGISTIKA MAJMUASI', {
    ru: 'ТАМОЖЕННО-СКЛАДСКОЙ ЛОГИСТИЧЕСКИЙ КОМПЛЕКС ООО «JB GROUP»',
    en: 'JB GROUP LLC CUSTOMS & WAREHOUSE LOGISTICS COMPLEX'
  }],
  ['Moliya & Buxgalteriya Departamenti', { ru: 'Департамент Финансов и Бухгалтерии', en: 'Finance & Accounting Department' }],
  ['MOLIYA VA CHIQIMLAR RASMIY HISOBOTI', { ru: 'ОФИЦИАЛЬНЫЙ ФИНАНСОВЫЙ ОТЧЕТ ПО РАСХОДАМ', en: 'OFFICIAL FINANCIAL & OUTBOUND REPORT' }],
  ['Buxgalteriya & Chiqimlar Hisoboti Markazi', { ru: 'Центр Бухгалтерии и Отчетности по Расходам', en: 'Accounting & Outbound Billing Center' }],
  ['JB GROUP Moliya', { ru: 'JB GROUP Финансы', en: 'JB GROUP Finance' }],
  ['Kunlik va oylik chiqimlar, to\'lovlar, xodimlar bajargan amallar va qarzdorliklar to\'liq tahlili.', {
    ru: 'Полный анализ суточных и месячных расходов, начислений, операций сотрудников и задолженностей.',
    en: 'Comprehensive analysis of daily/monthly outbound releases, payments, staff performance, and receivables.'
  }],
  ['🖨️ Hisobotni Chop Etish', { ru: '🖨️ Печать Отчета', en: '🖨️ Print Report' }],
  ['📥 Excel (CSV) Yuklash', { ru: '📥 Скачать Excel (CSV)', en: '📥 Export Excel (CSV)' }],
  ['📅 Bugungi Chiqimlar (Kunlik)', { ru: '📅 Расходы за Сегодня (Суточные)', en: '📅 Today\'s Outbound Releases' }],
  ['Bugun', { ru: 'Сегодня', en: 'Today' }],
  ['Bugungi jami to\'lov:', { ru: 'Начислено за сегодня:', en: 'Today\'s total billing:' }],
  ['📊 Davr Chiqimlari (Jami)', { ru: '📊 Расходы за Период (Всего)', en: '📊 Period Outbound Total' }],
  ['💰 Jami To\'lanishi Kerak (QQS bilan)', { ru: '💰 Итого к Оплате (с НДС 12%)', en: '💰 Total Payable (incl. 12% VAT)' }],
  ['💳 To\'lovlar & Qarzdorlik', { ru: '💳 Оплаты и Задолженность', en: '💳 Payments & Receivables' }],
  ['⏳ Qarzdorlik (Kutilmoqda):', { ru: '⏳ Задолженность (Ожидается):', en: '⏳ Pending Receivables:' }],
  ['⏱️ Tezkor Davr:', { ru: '⏱️ Быстрый период:', en: '⏱️ Quick Period:' }],
  ['📌 Bugun (Kunlik)', { ru: '📌 Сегодня (За день)', en: '📌 Today (Daily)' }],
  ['Kecha', { ru: 'Вчера', en: 'Yesterday' }],
  ['📅 Joriy Oy (Oktyabr 2026)', { ru: '📅 Текущий Месяц (Октябрь 2026)', en: '📅 Current Month (October 2026)' }],
  ['🗓️ O\'tgan Oy (Sentyabr 2026)', { ru: '🗓️ Прошлый Месяц (Сентябрь 2026)', en: '🗓️ Last Month (September 2026)' }],
  ['Barcha Vaqt', { ru: 'За Все Время', en: 'All Time' }],
  ['🔍 Maxsus Oraliq', { ru: '🔍 Выбрать Даты', en: '🔍 Custom Range' }],
  ['1 Yillik Tarix (Oyni Tanlang):', { ru: 'Годовой Архив (Выберите месяц):', en: '1-Year Archive (Select Month):' }],
  ['👤 Chiqargan Xodim:', { ru: '👤 Выдавший Сотрудник:', en: '👤 Released By Staff:' }],
  ['Barcha xodimlar', { ru: 'Все сотрудники', en: 'All staff members' }],
  ['🏢 Mijoz / To\'lovchi:', { ru: '🏢 Клиент / Плательщик:', en: '🏢 Client / Payer:' }],
  ['Barcha mijozlar', { ru: 'Все клиенты', en: 'All clients' }],
  ['💳 To\'lov Holati:', { ru: '💳 Статус Оплаты:', en: '💳 Payment Status:' }],
  ['Barchasi (To\'langan & Qarzdorlik)', { ru: 'Все (Оплаченные и Долги)', en: 'All (Paid & Pending)' }],
  ['✅ Faqat to\'langanlar', { ru: '✅ Только оплаченные', en: '✅ Paid only' }],
  ['⏳ Faqat to\'lov kutilayotganlar', { ru: '⏳ Только ожидающие оплаты', en: '⏳ Pending payment only' }],
  ['🔍 Qidiruv:', { ru: '🔍 Поиск:', en: '🔍 Search:' }],
  ['Hujjat №, mahsulot, STIR...', { ru: '№ накладной, груз, ИНН...', en: 'Waybill No., cargo, TIN...' }],
  ['№ / Hujjat', { ru: '№ / Накладная', en: 'No. / Waybill' }],
  ['Chiqargan Mas\'ul', { ru: 'Ответственный', en: 'Released By' }],
  ['Mahsulot & Sektor', { ru: 'Груз и Сектор', en: 'Cargo & Sector' }],
  ['Chiqarilgan Miqdor', { ru: 'Выданный Объём', en: 'Released Qty' }],
  ['Qabul Qiluvchi & STIR', { ru: 'Получатель и ИНН', en: 'Receiver & TIN' }],
  ['Saqlash (Xraneniya)', { ru: 'Хранение', en: 'Storage Cost' }],
  ['Tushirish / Ortish', { ru: 'Разгрузка / Погрузка', en: 'Unloading / Loading' }],
  ['Jami To\'lov (UZS)', { ru: 'Итого к Оплате (UZS)', en: 'Grand Total (UZS)' }],
  ['To\'lov Holati', { ru: 'Статус Оплаты', en: 'Payment Status' }],
  ['Belgilangan davr yoki filtrlar bo\'yicha birorta ham chiqim amali topilmadi.', {
    ru: 'За выбранный период или по заданным фильтрам расходных операций не найдено.',
    en: 'No outbound operations found for the selected period or filters.'
  }],
  ['✅ To\'langan', { ru: '✅ Оплачено', en: '✅ Paid' }],
  ['⏳ Kutilmoqda', { ru: '⏳ Ожидается', en: '⏳ Pending' }],
  ['🧾 Invoys', { ru: '🧾 Инвойс', en: '🧾 Invoice' }],
  ['Chiqargan yuk vazni:', { ru: 'Выданный вес груза:', en: 'Released cargo weight:' }],
  ['Rasmiylashtirilgan to\'lov:', { ru: 'Оформлено на сумму:', en: 'Total billed amount:' }],
  ['Chiqargan tovarlari:', { ru: 'Выданные грузы:', en: 'Released cargo items:' }],
  ['Mijoz / To\'lovchi Korxona', { ru: 'Клиент / Организация-Плательщик', en: 'Client / Payer Organization' }],
  ['Chiqimlar Soni', { ru: 'Кол-во Расходов', en: 'Outbound Count' }],
  ['Chiqarilgan Og\'irlik', { ru: 'Выданный Вес', en: 'Released Weight' }],
  ['Saqlash (UZS)', { ru: 'Хранение (UZS)', en: 'Storage (UZS)' }],
  ['Ortish / Tushirish (UZS)', { ru: 'Погрузка / Разгрузка (UZS)', en: 'Loading / Unloading (UZS)' }],
  ['Jami To\'lashi Kerak (UZS)', { ru: 'Итого к Оплате (UZS)', en: 'Total Payable (UZS)' }],
  ['To\'langan Summa', { ru: 'Оплаченная Сумма', en: 'Paid Amount' }],
  ['Qarzdorlik', { ru: 'Задолженность', en: 'Balance Due' }],
  ['⏳ Qarzdorlik bor', { ru: '⏳ Есть задолженность', en: '⏳ Payment Pending' }],
  ['✅ To\'liq to\'langan', { ru: '✅ Полностью оплачено', en: '✅ Paid in Full' }],

  // =========================================================================
  // 7. CUSTOMS PRICE LIST TAB
  // =========================================================================
  ['«JB GROUP» Bojxona Ombori Rasmiy Preyskuranti', {
    ru: 'Официальный Прейскурант Услуг Таможенного Склада «JB GROUP»',
    en: 'JB GROUP Customs Warehouse Official Price List'
  }],
  ['Yuk ortish/tushirish, bojxona omborida saqlash va qo\'shimcha xizmatlarning 12% QQS (NDS) bilan tasdiqlangan stavkalari', {
    ru: 'Утвержденные тарифы на погрузочно-разгрузочные работы, хранение на таможенном складе и доп. услуги с учетом 12% НДС',
    en: 'Approved rates for loading/unloading, customs warehouse storage, and additional services including 12% VAT'
  }],
  ['➕ Yangi Bojxona Xizmati Qo\'shish', { ru: '➕ Добавить Таможенную Услугу', en: '➕ Add Customs Service' }],
  ['1. Ortish va Tushirish', { ru: '1. Погрузка и Разгрузка', en: '1. Loading & Unloading' }],
  ['⚡ 1 martalik to\'lov', { ru: '⚡ Разовый платеж', en: '⚡ One-time fee' }],
  ['1–9-bandlar: Kirimda yuk tushirish (разгрузка) va chiqimda ortish (погрузка) 1 martalik qat\'iy to\'lov bo\'lib, saqlangan kunlar soniga mutlaqo ko\'paytirilmaydi.', {
    ru: 'Пункты 1–9: Разгрузка при приходе и погрузка при расходе являются разовыми фиксированными платежами и не умножаются на дни хранения.',
    en: 'Items 1–9: Inbound unloading and outbound loading are fixed one-time fees and are never multiplied by storage days.'
  }],
  ['2. Saqlash Xizmatlari', { ru: '2. Услуги Хранения', en: '2. Storage Services' }],
  ['📅 FAQAT SHU KUNLIK', { ru: '📅 ПОСУТОЧНЫЙ ТАРИФ', en: '📅 DAILY BILLING ONLY' }],
  ['Saqlash xizmatlari: FAQAT ushbu xizmatlar yuk omborda turgan kunlar soniga qarab (kunlar soni × stavka × hajm) ko\'paytirilib hisoblab beriladi.', {
    ru: 'Услуги хранения: ТОЛЬКО эти тарифы рассчитываются пропорционально количеству суток хранения груза на складе (сутки × ставка × объём).',
    en: 'Storage services: ONLY these rates are multiplied by the number of days the cargo is stored in the warehouse (days × rate × volume).'
  }],
  ['3. Qo\'shimcha Xizmatlar', { ru: '3. Дополнительные Услуги', en: '3. Additional Services' }],
  ['20–30-bandlar: Qo\'shimcha xizmatlar kunlik yoki boshqacha emas, qat\'iy 1 martalik to\'lov bo\'ladi (streych, saralash, stoyanka, yuvish, kross-doking).', {
    ru: 'Пункты 20–30: Дополнительные услуги начисляются строго как разовый платеж (упаковка стрейч, сортировка, стоянка, очистка, кросс-докинг).',
    en: 'Items 20–30: Additional services are strictly one-time charges (stretch wrapping, sorting, parking, cleaning, cross-docking).'
  }],
  ['🔍 Xizmat nomi yoki birligi bo\'yicha qidirish...', {
    ru: '🔍 Поиск по наименованию услуги или единице измерения...',
    en: '🔍 Search by service name or unit...'
  }],
  ['Наименование услуг / Xizmat Nomi', {
    uz: 'Xizmat Nomi (Preyskurant bo\'yicha)',
    ru: 'Наименование Услуги (По прейскуранту)',
    en: 'Service Name (Per Price List)'
  }],
  ['Стоимость в сумах (QQSsiz)', {
    uz: 'Bazaviy Narx (QQSsiz, UZS)',
    ru: 'Стоимость в сумах (без НДС)',
    en: 'Base Price (excl. VAT, UZS)'
  }],
  ['НДС 12% (QQS)', {
    uz: '12% QQS Summasi',
    ru: 'Сумма НДС 12%',
    en: '12% VAT Amount'
  }],
  ['Стоимость с учетом НДС (Jami)', {
    uz: 'Jami Narx (QQS bilan, UZS)',
    ru: 'Стоимость с учетом НДС (Итого)',
    en: 'Total Price (incl. VAT, UZS)'
  }],
  ['🏗️ 1 martalik to\'lov', { ru: '🏗️ Разовый платеж', en: '🏗️ One-time fee' }],
  ['📅 Kuniga qarab', { ru: '📅 Посуточно', en: '📅 Per day' }],
  ['kunlik stavka', { ru: 'суточная ставка', en: 'daily rate' }],
  ['1 martalik', { ru: 'разовый', en: 'one-time' }],

  // =========================================================================
  // 8. USERS & RBAC PERMISSIONS TAB
  // =========================================================================
  ['👥 Xodimlar va Vakolatlar Boshqaruvi', {
    ru: '👥 Управление Сотрудниками и Правами Доступа',
    en: '👥 Staff Accounts & Access Permissions Management'
  }],
  ['Tizimda ochiq ro\'yxatdan o\'tish yo\'q. Faqat siz (Bosh Rahbar) xodimlarni qo\'sha olasiz va ularning aniq huquqlarini belgilaysiz.', {
    ru: 'Открытая регистрация закрыта. Только Генеральный Директор (Супер-Админ) может добавлять сотрудников и назначать им полномочия.',
    en: 'Public registration is disabled. Only the General Director (Super Admin) can create staff accounts and configure permissions.'
  }],
  ['➕ Yangi Xodim / Admin Qo\'shish', { ru: '➕ Добавить Сотрудника / Админа', en: '➕ Add Staff / Admin' }],
  ['⚙️ Huquqlarni Sozlash', { ru: '⚙️ Настроить Права', en: '⚙️ Configure Permissions' }],
  ['🗑️ O\'chirish', { ru: '🗑️ Удалить', en: '🗑️ Delete' }],
  ['(Siz)', { ru: '(Вы)', en: '(You)' }],
  ['Xodimning Tasdiqlangan Vakolatlari:', { ru: 'Подтвержденные Полномочия Сотрудника:', en: 'Approved Employee Permissions:' }],
  ['Omborni sozlash & Sektorlar ochish', { ru: 'Настройка склада и открытие секторов', en: 'Configure warehouse & create sectors' }],
  ['Tarif qo\'shish & Narx belgilash', { ru: 'Добавление тарифов и управление ценами', en: 'Add tariffs & manage pricing' }],
  ['Tariflarni omborga bog\'lash', { ru: 'Привязка тарифов к секторам склада', en: 'Link tariffs to warehouse sectors' }],
  ['Xavfli yuklar bilan ishlay oladi', { ru: 'Допущен к работе с опасными грузами', en: 'Authorized for hazardous cargo' }],
  ['Xavfli yuklar taqiqlangan!', { ru: 'Опасные грузы запрещены!', en: 'Hazardous cargo prohibited!' }],
  ['Yuk kirim/chiqim amallari', { ru: 'Операции прихода и расхода грузов', en: 'Inbound & outbound cargo operations' }],
  ['Moliyaviy to\'lovlarni ko\'ra oladi', { ru: 'Доступ к финансовым расчетам и суммам', en: 'Can view financial billing & prices' }],
  ['Pul ma\'lumotlari yashirilgan (faqat fakt)', { ru: 'Финансовые данные скрыты (только факт)', en: 'Financial figures hidden (quantity only)' }],
  ['Kiritilgan yukni tahrirlash (xatoni to\'g\'rilash) ruxsati bor', { ru: 'Разрешено исправление (редактирование) грузов', en: 'Authorized to edit/correct entered cargo' }],
  ['Yukni tahrirlash yopiq', { ru: 'Редактирование грузов закрыто', en: 'Cargo editing disabled' }],
  ['Tahrirlar hisobotini ko\'ra oladi', { ru: 'Доступ к отчету по исправлениям', en: 'Can view monthly corrections report' }],
  ['Tahrirlar hisoboti yopiq', { ru: 'Отчет по исправлениям закрыт', en: 'Corrections report disabled' }],
  ['Ruxsat etilgan sektorlar:', { ru: 'Разрешенные секторы:', en: 'Allowed sectors:' }],
  ['⚡ Barcha sektorlar (Cheklovsiz)', { ru: '⚡ Все секторы (Без ограничений)', en: '⚡ All sectors (Unrestricted)' }],
  ['🔒 Parol: Shifrlangan (Maxfiy)', { ru: '🔒 Пароль: Зашифрован (Скрыт)', en: '🔒 Password: Encrypted (Hidden)' }],

  // =========================================================================
  // 9. MODALS: KIRIM, CHIQIM, TARIX, NAKLADNOY, TAHRIRLASH, SHARTNOMA
  // =========================================================================
  ['Bojxona Omboriga Yangi Yuk Qabul Qilish (Kirim)', {
    ru: 'Прием Нового Груза на Таможенный Склад (Приход)',
    en: 'Receive New Cargo into Customs Warehouse (Inbound)'
  }],
  ['«JB GROUP» Bojxona ombori rasmiy qoidasi va 12% QQS hisobi bilan', {
    ru: 'По официальным правилам таможенного склада «JB GROUP» с учетом 12% НДС',
    en: 'Per official JB GROUP customs warehouse rules including 12% VAT'
  }],
  ['Joylashtiriladigan Sklad (Sektor) *', { ru: 'Сектор Размещения на Складе *', en: 'Target Warehouse Sector *' }],
  ['2. YUK (MAHSULOT) NOMI VA NAKLADNOY RAQAMI *', {
    ru: '2. НАИМЕНОВАНИЕ ГРУЗА (ПАРТИИ) И НОМЕР НАКЛАДНОЙ *',
    en: '2. CARGO (BATCH) NAME & WAYBILL NUMBER *'
  }],
  ['Yukning to\'liq nomi va kirim nakladnoy / partiya raqamini bitta qilib kiriting.', {
    ru: 'Введите полное наименование груза и номер приходной накладной / партии.',
    en: 'Enter the full cargo description and inbound waybill / batch number.'
  }],
  ['3. YUK TO\'LOVCHISI (SHARTNOMA TUZGAN MIJOZ) *', {
    ru: '3. ПЛАТЕЛЬЩИК ГРУЗА (КЛИЕНТ ПО ДОГОВОРУ) *',
    en: '3. CARGO PAYER (CONTRACTED CLIENT) *'
  }],
  ['🔍 Nomi yoki STIR (INN) bo\'yicha qidiruv', { ru: '🔍 Поиск по названию или ИНН', en: '🔍 Search by name or TIN (INN)' }],
  ['🔴 MUDDATI TUGAGAN', { ru: '🔴 СРОК ИСТЕК', en: '🔴 EXPIRED' }],
  ['🟢 AMALDA', { ru: '🟢 ДЕЙСТВУЕТ', en: '🟢 ACTIVE' }],
  ['✕ O\'zgartirish', { ru: '✕ Изменить', en: '✕ Change' }],
  ['📦 YUKNING SONI VA OG\'IRLIGI (ANIQ HISOB):', {
    ru: '📦 КОЛИЧЕСТВО МЕСТ И ТОЧНЫЙ ВЕС ГРУЗА (КГ):',
    en: '📦 CARGO QUANTITY & EXACT WEIGHT (KG):'
  }],
  ['Yuk Soni *', { ru: 'Кол-во мест *', en: 'Quantity *' }],
  ['Jami Og\'irligi (kg da) *', { ru: 'Общий Вес (в кг) *', en: 'Total Weight (in kg) *' }],
  ['💡 Tarozi yoki deklaratsiya bo\'yicha aniq og\'irlikni kiriting', {
    ru: '💡 Укажите точный вес по весам или таможенной декларации',
    en: '💡 Enter exact weight per scale or customs declaration'
  }],
  ['📄 Birlamchi qabul hujjati yoki qo\'shimcha izoh (Ixtiyoriy)', {
    ru: '📄 Первичный документ приема или примечание (Необязательно)',
    en: '📄 Primary entry document or additional note (Optional)'
  }],
  ['SAQLASH USULI VA TARIFI *', { ru: 'СПОСОБ И ТАРИФ ХРАНЕНИЯ *', en: 'STORAGE METHOD & TARIFF *' }],
  ['📅 FAQAT SHU KUNLIK HISOBLANADI', { ru: '📅 НАЧИСЛЯЕТСЯ ПОСУТОЧНО', en: '📅 CALCULATED DAILY ONLY' }],
  ['📌 Belgilangan Saqlash Usuli (Omborga kirim):', {
    ru: '📌 Выбранный Тариф Хранения (Приход на склад):',
    en: '📌 Selected Storage Tariff (Warehouse Inbound):'
  }],
  ['YUK KELGAN TRANSPORT TURI VA TUSHIRISH (РАЗГРУЗКА) USULI *', {
    ru: 'ТИП ПРИБЫВШЕГО ТРАНСПОРТА И УСЛУГА РАЗГРУЗКИ *',
    en: 'ARRIVING TRANSPORT TYPE & UNLOADING SERVICE *'
  }],
  ['⚡ 1 MARTALIK TUSHIRISH', { ru: '⚡ РАЗОВАЯ РАЗГРУЗКА', en: '⚡ ONE-TIME UNLOADING' }],
  ['⛔ XIZMATSIZ (0 UZS)', { ru: '⛔ БЕЗ УСЛУГИ (0 UZS)', en: '⛔ NO SERVICE (0 UZS)' }],
  ['QO\'SHIMCHA BOJXONA VA OMBORXONA XIZMATLARI (IXTIYORIY)', {
    ru: 'ДОПОЛНИТЕЛЬНЫЕ ТАМОЖЕННЫЕ И СКЛАДСКИЕ УСЛУГИ (ОПЦИОНАЛЬНО)',
    en: 'ADDITIONAL CUSTOMS & WAREHOUSE SERVICES (OPTIONAL)'
  }],
  ['Omborga Qabul Qilish va Bajarilgan Xizmatlar Qaydnomasi', {
    ru: 'Ведомость Приема на Склад и Выполненных Услуг',
    en: 'Warehouse Inbound & Performed Services Record'
  }],
  ['📥 Yukni Omborga Qabul Qilishni Tasdiqlash', {
    ru: '📥 Подтвердить Прием Груза на Склад',
    en: '📥 Confirm Cargo Inbound Entry'
  }],
  ['Ombordan Chiqarish & To\'lovni Hisoblash', {
    ru: 'Выдача со Склада и Расчет Оплаты (Расход)',
    en: 'Outbound Release & Billing Calculation'
  }],
  ['HOZIRGI OMBORDAGI QOLDIQ:', { ru: 'ТЕКУЩИЙ ОСТАТОК НА СКЛАДЕ:', en: 'CURRENT WAREHOUSE BALANCE:' }],
  ['SAQLANGAN VAQT:', { ru: 'СРОК ХРАНЕНИЯ:', en: 'STORAGE DURATION:' }],
  ['📦 CHIQARILADIGAN YUK JOYI VA ANIQ OG\'IRLIGI (KG):', {
    ru: '📦 ВЫДАВАЕМОЕ КОЛИЧЕСТВО МЕСТ И ТОЧНЫЙ ВЕС (КГ):',
    en: '📦 OUTBOUND QUANTITY & EXACT WEIGHT (KG):'
  }],
  ['⚖️ ANIQ OG\'IRLIGI (KG DA) *', { ru: '⚖️ ТОЧНЫЙ ВЕС (В КГ) *', en: '⚖️ EXACT WEIGHT (IN KG) *' }],
  ['25% qismi', { ru: '25% партии', en: '25% batch' }],
  ['50% qismi', { ru: '50% партии', en: '50% batch' }],
  ['75% qismi', { ru: '75% партии', en: '75% batch' }],
  ['⚡ Hammasini (Butunlay)', { ru: '⚡ Весь остаток (100%)', en: '⚡ Full Balance (100%)' }],
  ['⚖️ CHIQARILAYOTGAN YUK VA VAZN:', { ru: '⚖️ ВЫДАВАЕМЫЙ ОБЪЁМ И ВЕС:', en: '⚖️ OUTBOUND QUANTITY & WEIGHT:' }],
  ['OMBORDAGI QOLDIQ:', { ru: 'ОСТАТОК НА СКЛАДЕ:', en: 'REMAINING BALANCE:' }],
  ['1. OMBORGA TUSHIRISH (РАЗГРУЗКА) XIZMATI *', {
    ru: '1. УСЛУГА РАЗГРУЗКИ НА СКЛАД (ПРИ ПРИХОДЕ) *',
    en: '1. WAREHOUSE UNLOADING SERVICE (INBOUND) *'
  }],
  ['2. SAQLASH TARIFI *', { ru: '2. ТАРИФ ХРАНЕНИЯ *', en: '2. STORAGE TARIFF *' }],
  ['3. YUKNI ORTISH VA YUKLASH (ПОГРУЗКА) TRANSPORT TURI *', {
    ru: '3. УСЛУГА ПОГРУЗКИ ПРИ ВЫДАЧЕ (ТИП ТРАНСПОРТА) *',
    en: '3. OUTBOUND LOADING SERVICE & TRANSPORT TYPE *'
  }],
  ['Soni:', { ru: 'Кол-во авто:', en: 'Vehicles:' }],
  ['QO\'SHIMCHA CHIQIM VA BOJXONA XIZMATLARI (IXTIYORIY)', {
    ru: 'ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ ПРИ ВЫДАЧЕ (ОПЦИОНАЛЬНО)',
    en: 'ADDITIONAL OUTBOUND & CUSTOMS SERVICES (OPTIONAL)'
  }],
  ['SAQLASH TARIFI VA TO\'LOVLAR HISOBI', {
    ru: 'РАСЧЕТ СТОИМОСТИ ХРАНЕНИЯ И УСЛУГ',
    en: 'STORAGE & SERVICES BILLING SUMMARY'
  }],
  ['Mijoz To\'lashi Kerak Bo\'lgan Jami Summa:', {
    ru: 'Итоговая Сумма к Оплате Клиентом:',
    en: 'Total Amount Payable by Client:'
  }],
  ['YUKNI QABUL QILIB OLUVCHI KORXONA VA STIR (INN) RAQAMI:', {
    ru: 'ОРГАНИЗАЦИЯ-ПОЛУЧАТЕЛЬ ГРУЗА И ИНН:',
    en: 'RECEIVING COMPANY & TIN (INN) NUMBER:'
  }],
  ['STIR (INN) RAQAMI *', { ru: 'НОМЕР ИНН *', en: 'TIN (INN) NUMBER *' }],
  ['QABUL QILUVCHI KORXONA NOMI *', { ru: 'НАИМЕНОВАНИЕ ОРГАНИЗАЦИИ-ПОЛУЧАТЕЛЯ *', en: 'RECEIVING COMPANY NAME *' }],
  ['YUKNI TOPSHIRIB OLUVCHI VAKIL (F.I.SH VA ISHONCHNOMA)', {
    ru: 'ПРЕДСТАВИТЕЛЬ ПОЛУЧАТЕЛЯ (Ф.И.О. И ДОВЕРЕННОСТЬ)',
    en: 'AUTHORIZED RECEIVER REPRESENTATIVE (NAME & POA)'
  }],
  ['CHIQIM HUJJATI / ASOS / IZOH', { ru: 'ДОКУМЕНТ РАСХОДА / ОСНОВАНИЕ / ПРИМЕЧАНИЕ', en: 'OUTBOUND DOCUMENT / BASIS / NOTE' }],
  ['📤 Chiqimni Tasdiqlash & Nakladnoy Chiqarish', {
    ru: '📤 Подтвердить Расход и Сформировать Накладную',
    en: '📤 Confirm Outbound & Generate Waybill'
  }],
  ['📤 Yukni Ombordan Chiqarish', { ru: '📤 Подтвердить Выдачу Груза', en: '📤 Confirm Cargo Release' }],
  ['🔒 Chiqim Bloklangan (Shartnoma Tugagan)', {
    ru: '🔒 Расход Заблокирован (Договор Истек)',
    en: '🔒 Outbound Blocked (Contract Expired)'
  }],

  // ProductHistoryModal & InvoiceReceiptModal
  ['YUKNING TO\'LIQ HARAKAT TARIXI VA CHIQIMLAR ZANJIRI (TIMELINE)', {
    ru: 'ПОЛНАЯ ИСТОРИЯ ДВИЖЕНИЯ ГРУЗА И ЦЕПОЧКА РАСХОДОВ (TIMELINE)',
    en: 'COMPLETE CARGO MOVEMENT HISTORY & OUTBOUND TIMELINE'
  }],
  ['🟢 OMBORDA SAQLANMOQDA', { ru: '🟢 ХРАНИТСЯ НА СКЛАДЕ', en: '🟢 IN WAREHOUSE STORAGE' }],
  ['🔴 TO\'LIQ OMBORDAN CHIQARILGAN', { ru: '🔴 ПОЛНОСТЬЮ ВЫДАН СО СКЛАДА', en: '🔴 FULLY RELEASED FROM WAREHOUSE' }],
  ['OMBORDAGI JORIY QOLDIQ:', { ru: 'ТЕКУЩИЙ ОСТАТОК НА СКЛАДЕ:', en: 'CURRENT WAREHOUSE BALANCE:' }],
  ['YUK HARAKATINING TO\'LIQ XRONOLOGIK TARIXI (ZANJIR)', {
    ru: 'ПОЛНАЯ ХРОНОЛОГИЧЕСКАЯ ИСТОРИЯ ДВИЖЕНИЯ ГРУЗА',
    en: 'CHRONOLOGICAL CARGO LIFECYCLE TIMELINE'
  }],
  ['Kirim ➔ Saqlash ➔ Chiqim operatsiyalari', {
    ru: 'Приход ➔ Хранение ➔ Расходные операции',
    en: 'Inbound ➔ Storage ➔ Outbound operations'
  }],
  ['📥 1-BOSQICH: OMBORGA QABUL QILISH VA BIRINCHI KIRITILISH (KIRIM)', {
    ru: '📥 ЭТАП 1: ПРИЕМ НА СКЛАД И ПЕРВИЧНОЕ РАЗМЕЩЕНИЕ (ПРИХОД)',
    en: '📥 STAGE 1: WAREHOUSE RECEIPT & INITIAL PLACEMENT (INBOUND)'
  }],
  ['⏱️ 2-BOSQICH: SAQLANISH REJIMI VA TARIF HISOBI', {
    ru: '⏱️ ЭТАП 2: РЕЖИМ ХРАНЕНИЯ И ТАРИФИКАЦИЯ',
    en: '⏱️ STAGE 2: STORAGE REGIME & TARIFF CALCULATION'
  }],
  ['📤 3-BOSQICH: OMBORDAN CHIQIM HARAKATLARI', {
    ru: '📤 ЭТАП 3: ОПЕРАЦИИ ВЫДАЧИ СО СКЛАДА (РАСХОД)',
    en: '📤 STAGE 3: WAREHOUSE OUTBOUND RELEASES'
  }],
  ['🖨️ Nakladnoyni Chop Etish', { ru: '🖨️ Печать Накладной', en: '🖨️ Print Waybill' }],
  ['Ushbu yukdan hali chiqim qilinmagan', { ru: 'По данному грузу расход еще не производился', en: 'No outbound releases recorded for this cargo yet' }],
  ['📤 Ushbu Tovardan Chiqim Qilish', { ru: '📤 Оформить Расход по Данному Грузу', en: '📤 Release Cargo from This Batch' }],
  ['RASMIY CHIQIM NAKLADNOYI', { ru: 'ОФИЦИАЛЬНАЯ РАСХОДНАЯ НАКЛАДНАЯ', en: 'OFFICIAL OUTBOUND WAYBILL' }],
  ['📤 RASMIY CHIQIM NAKLADNOYI', { ru: '📤 ОФИЦИАЛЬНАЯ РАСХОДНАЯ НАКЛАДНАЯ', en: '📤 OFFICIAL OUTBOUND WAYBILL' }],
  ['Chop etish (Print / PDF)', { ru: 'Печать (Print / PDF)', en: 'Print / Export PDF' }],
  ['«JB GROUP» BOJXONA OMBORI', { ru: 'ТАМОЖЕННЫЙ СКЛАД «JB GROUP»', en: 'JB GROUP CUSTOMS WAREHOUSE' }],
  ['Bojxona ombori xizmatlari hisob-kitob nakladnoyi', {
    ru: 'Расчетная накладная за услуги таможенного склада',
    en: 'Customs warehouse services billing waybill'
  }],
  ['TOVAR VA SAQLASH HAJMI:', { ru: 'ГРУЗ И ОБЪЁМ ХРАНЕНИЯ:', en: 'CARGO & STORAGE VOLUME:' }],
  ['YUK BERILGAN TARAFI (QABUL QILUVCHI):', { ru: 'ГРУЗОПОЛУЧАТЕЛЬ (КОМУ ВЫДАН ГРУЗ):', en: 'CONSIGNEE (RELEASED TO):' }],
  ['📋 KO\'RSATILGAN XIZMATLAR VA TO\'LOV:', { ru: '📋 ОКАЗАННЫЕ УСЛУГИ И РАСЧЕТ ОПЛАТЫ:', en: '📋 PERFORMED SERVICES & BILLING:' }],
  ['Ko\'rsatilgan Xizmat', { ru: 'Наименование Услуги', en: 'Service Description' }],
  ['Bazaviy Narx', { ru: 'Базовая Цена', en: 'Base Price' }],
  ['Jami Summa', { ru: 'Итоговая Сумма', en: 'Total Amount' }],
  ['JAMI TO\'LOV QILINISHI KERAK:', { ru: 'ИТОГО К ОПЛАТЕ:', en: 'GRAND TOTAL PAYABLE:' }],
  ['Topshirdi («JB GROUP» mas\'ul xodimi):', { ru: 'Сдал (Ответственный сотрудник «JB GROUP»):', en: 'Released by (JB GROUP Authorized Staff):' }],
  ['Qabul qilib oldi (Mijoz / Qabul qiluvchi):', { ru: 'Принял (Клиент / Представитель получателя):', en: 'Received by (Client / Consignee Representative):' }],

  // Common Buttons & Statuses
  ['Bekor qilish', { ru: 'Отмена', en: 'Cancel' }],
  ['Saqlash', { ru: 'Сохранить', en: 'Save' }],
  ['Yopish', { ru: 'Закрыть', en: 'Close' }],
  ['To\'langan', { ru: 'Оплачено', en: 'Paid' }],
  ['Kutilmoqda', { ru: 'Ожидается', en: 'Pending' }],
  ['✅ Yoqilgan', { ru: '✅ Включено', en: '✅ Enabled' }],
  ['❌ O\'chirilgan', { ru: '❌ Отключено', en: '❌ Disabled' }],
  ['⚡ 1 MARTALIK TO\'LOV', { ru: '⚡ РАЗОВЫЙ ПЛАТЕЖ', en: '⚡ ONE-TIME FEE' }],
  ['⛔ TO\'LOV YO\'Q (0 UZS)', { ru: '⛔ БЕЗ ОПЛАТЫ (0 UZS)', en: '⛔ NO CHARGE (0 UZS)' }],

  // =========================================================================
  // 10. COMPLETE MODAL & INVOICE PHRASES (SECTOR, KIRIM, CHIQIM, NAKLADNOY, ETC.)
  // =========================================================================
  // Preyskurant & Storage Tariff Units (Full strings matched before partial 'kunlik stavka' / '1 martalik')
  ['1 tn / kun (kunlik stavka)', { ru: '1 тн / сутки (суточная ставка)', en: '1 ton / day (daily rate)' }],
  ['1 kg / kun (kunlik stavka)', { ru: '1 кг / сутки (суточная ставка)', en: '1 kg / day (daily rate)' }],
  ['1 pallet / kun (kunlik stavka)', { ru: '1 паллет / сутки (суточная ставка)', en: '1 pallet / day (daily rate)' }],
  ['1 dona / kun (kunlik stavka)', { ru: '1 ед. / сутки (суточная ставка)', en: '1 unit / day (daily rate)' }],
  ['1 avto / kun (kunlik stavka)', { ru: '1 авто / сутки (суточная ставка)', en: '1 vehicle / day (daily rate)' }],
  ['1 fura / kun (kunlik stavka)', { ru: '1 фура / сутки (суточная ставка)', en: '1 truck / day (daily rate)' }],
  ['1 birlik / kun (kunlik stavka)', { ru: '1 ед. / сутки (суточная ставка)', en: '1 unit / day (daily rate)' }],
  ['1 konteyner / kun (kunlik stavka)', { ru: '1 контейнер / сутки (суточная ставка)', en: '1 container / day (daily rate)' }],
  ['1 martalik (1 vagon)', { ru: 'разовый (1 вагон)', en: 'one-time (1 wagon)' }],
  ['1 martalik (40ft konteyner)', { ru: 'разовый (40фут контейнер)', en: 'one-time (40ft container)' }],
  ['1 martalik (20ft konteyner)', { ru: 'разовый (20фут контейнер)', en: 'one-time (20ft container)' }],
  ['1 martalik (1 tn)', { ru: 'разовый (за 1 тн)', en: 'one-time (per 1 ton)' }],
  ['1 martalik (<90 m³ fura)', { ru: 'разовый (фура <90 м³)', en: 'one-time (<90 m³ truck)' }],
  ['1 martalik (to\'liq fura)', { ru: 'разовый (полная фура)', en: 'one-time (full truck)' }],
  ['1 martalik (mega fura)', { ru: 'разовый (мега-фура)', en: 'one-time (mega truck)' }],
  ['1 martalik (1 p/m)', { ru: 'разовый (за 1 п/м)', en: 'one-time (per 1 pallet)' }],
  ['1 martalik (1 poddon)', { ru: 'разовый (за 1 поддон)', en: 'one-time (per 1 pallet)' }],
  ['1 martalik (1 transport)', { ru: 'разовый (за 1 транспорт)', en: 'one-time (per 1 vehicle)' }],
  ['1 martalik (har bir mijozdan)', { ru: 'разовый (с каждого клиента)', en: 'one-time (per client)' }],
  ['1 martalik (shartnoma bo\'yicha)', { ru: 'разовый (по договору)', en: 'one-time (per contract)' }],
  ['Kunlik stavka:', { ru: 'Суточная ставка:', en: 'Daily rate:' }],
  ['Kunlik stavka', { ru: 'Суточная ставка', en: 'Daily rate' }],
  ['Jami kunlik:', { ru: 'Итого в сутки:', en: 'Total per day:' }],
  ['12% QQS:', { ru: '12% НДС:', en: '12% VAT:' }],
  ['12% QQS', { ru: '12% НДС', en: '12% VAT' }],
  ['(+12% QQS)', { ru: '(+12% НДС)', en: '(+12% VAT)' }],
  ['(+12% QQS bilan)', { ru: '(с НДС 12%)', en: '(incl. 12% VAT)' }],
  ['QQSsiz:', { ru: 'Без НДС:', en: 'Excl. VAT:' }],
  ['Jami (QQS bilan):', { ru: 'Итого (с НДС):', en: 'Total (incl. VAT):' }],
  ['1 martalik to\'lov', { ru: 'Разовый платеж', en: 'One-time fee' }],
  ['(1 martalik to\'lov)', { ru: '(Разовый платеж)', en: '(One-time fee)' }],
  ['(⚡ 1 martalik to\'lov)', { ru: '(⚡ Разовый платеж)', en: '(⚡ One-time fee)' }],

  // MODAL 1: Sektorni Sozlash (Sector Settings Modal)
  ['⚙️ Sektorni Sozlash:', { ru: '⚙️ Настройка Сектора:', en: '⚙️ Configure Sector:' }],
  ['✨ Yangi Sektor Qo\'shish', { ru: '✨ Добавить Новый Сектор', en: '✨ Add New Sector' }],
  ['Sektor Nomi *', { ru: 'Наименование Сектора *', en: 'Sector Name *' }],
  ['Sektor Kodi', { ru: 'Код Сектора', en: 'Sector Code' }],
  ['Sektor Turi (Ixtisoslashuv) *', { ru: 'Тип Сектора (Специализация) *', en: 'Sector Type (Specialization) *' }],
  ['❄️ Xolodilnik / Muzlatkich', { ru: '❄️ Морозильная Камера (Холодильник)', en: '❄️ Cold Freezer' }],
  ['🧊 Sovutgichli Sektor', { ru: '🧊 Охлаждаемый Сектор', en: '🧊 Chilled Sector' }],
  ['📦 Standart Quruq Zaxira', { ru: '📦 Стандартный Сухой Склад', en: '📦 Standard Dry Storage' }],
  ['☣️ Xavfli Yuklar & Kimyoviy', { ru: '☣️ Опасные и Химические Грузы', en: '☣️ Hazardous & Chemical Cargo' }],
  ['🔒 Qimmatbaho & Yuqori Xavfsizlik', { ru: '🔒 Ценные Грузы (Высокая Безопасность)', en: '🔒 High-Value & High Security' }],
  ['🛢️ Suyuqliklar & Moylar', { ru: '🛢️ Жидкости и Промышленные Масла', en: '🛢️ Liquids & Oils' }],
  ['Harorat Rejimi', { ru: 'Температурный Режим', en: 'Temperature Regime' }],
  ['Profilaktika', { ru: 'Профилактика', en: 'Maintenance' }],
  ['To\'lgan', { ru: 'Заполнен', en: 'Full' }],
  ['Ruxsat Berilgan Yuk Turlari (vergul bilan ajrating) *', {
    ru: 'Разрешенные Типы Грузов (через запятую) *',
    en: 'Allowed Cargo Types (comma-separated) *'
  }],
  ['Qo\'shimcha Tavsif / Xavfsizlik Shartlari', {
    ru: 'Дополнительное Описание / Условия Безопасности',
    en: 'Additional Description / Safety Requirements'
  }],
  ['Masalan: Go\'sht mahsulotlari, Baliq, Muzqaymoq', {
    ru: 'Например: Мясная продукция, Рыба, Мороженое',
    en: 'E.g.: Meat products, Fish, Ice cream'
  }],
  ['Quruq tovarlar, qadoqlangan yuklar', {
    ru: 'Сухие товары, упакованные грузы',
    en: 'Dry goods, packaged cargo'
  }],
  ['Yangi saqlash bo\'linmasi', {
    ru: 'Новое складское отделение',
    en: 'New storage compartment'
  }],

  // MODAL 2: Yangi Yuk Qabul Qilish (Kirim Modal)
  ['Masalan: №TK-882 - Keramika plitkalari (Gres) yoki Partiya №102', {
    ru: 'Например: №ТК-882 - Керамическая плитка (Грес) или Партия №102',
    en: 'E.g.: #TK-882 - Ceramic Tiles (Gres) or Batch #102'
  }],
  ['Mijoz korxona nomi yoki STIR (INN) raqamini yozing (masalan: Lactalis, 308...)', {
    ru: 'Введите название компании-клиента или ИНН (например: Lactalis, 308...)',
    en: 'Type client company name or TIN/INN (e.g., Lactalis, 308...)'
  }],
  ['Hech qanday to\'lovchi topilmadi', { ru: 'Плательщик не найден', en: 'No matching payer found' }],
  ['➕ Yangi To\'lovchi (Shartnoma) Qo\'shish', {
    ru: '➕ Добавить Нового Плательщика (Договор)',
    en: '➕ Add New Payer (Contract)'
  }],
  ['Birligi', { ru: 'Ед. изм.', en: 'Unit' }],
  ['O\'ram', { ru: 'упак.', en: 'packs' }],
  ['Pachka', { ru: 'пачек', en: 'packs' }],
  ['o\'rtacha og\'irligi:', { ru: 'средний вес:', en: 'average weight:' }],
  ['Masalan: Tovar-transport yuk xati №124 / bojxona deklaratsiyasi', {
    ru: 'Например: Товарно-транспортная накладная №124 / таможенная декларация',
    en: 'E.g.: Waybill #124 / customs declaration'
  }],
  ['💡 FAQAT ushbu saqlash xizmati tovar omborda saqlangan kunlariga (kunlar soni × stavka × hajm) qarab chiqimda hisoblanadi. Tushirish, ortish va qo\'shimcha xizmatlar esa 1 martalik bo\'ladi.', {
    ru: '💡 ТОЛЬКО данная услуга хранения рассчитывается при расходе пропорционально дням хранения (дни × ставка × объём). Разгрузка, погрузка и доп. услуги являются разовыми.',
    en: '💡 ONLY this storage service is calculated upon outbound release based on storage days (days × rate × volume). Unloading, loading, and extra services are one-time charges.'
  }],
  ['Fura / Mashina Soni:', { ru: 'Кол-во фур / машин:', en: 'Number of trucks / vehicles:' }],
  ['📌 Bajarilgan Tushirish (Разгрузка) Xizmati (1 martalik):', {
    ru: '📌 Выполненная Услуга Разгрузки (Разовый платеж):',
    en: '📌 Performed Unloading Service (One-time fee):'
  }],
  ['⛔ Tushirish xizmatisiz (Mijoz o\'zi tushirgan — 0 so\'m)', {
    ru: '⛔ Без услуги разгрузки (Силами клиента — 0 сум)',
    en: '⛔ Without unloading service (Unloaded by client — 0 UZS)'
  }],
  ['1. Tushirish Xizmati (1 martalik)', { ru: '1. Услуга Разгрузки (Разовый платеж)', en: '1. Unloading Service (One-time fee)' }],
  ['2. Qo\'shimcha Xizmatlar (1 martalik)', { ru: '2. Дополнительные Услуги (Разовый платеж)', en: '2. Additional Services (One-time fee)' }],
  ['Tanlanmagan', { ru: 'Не выбрано', en: 'None selected' }],
  ['3. Saqlash Tarifi (Kunlik hisoblanadi)', { ru: '3. Тариф Хранения (Посуточный расчет)', en: '3. Storage Tariff (Calculated daily)' }],
  ['Bajarilgan 1 martalik xizmatlar (QQS bilan):', {
    ru: 'Выполненные разовые услуги (с НДС 12%):',
    en: 'Performed one-time services (incl. 12% VAT):'
  }],
  ['Saqlash xizmati tovar ombordan chiqarilayotgan vaqtda saqlangan kunlar soniga ko\'paytirib hisoblanadi', {
    ru: 'Стоимость хранения рассчитывается при выдаче груза пропорционально количеству суток хранения',
    en: 'Storage cost is calculated upon cargo release multiplied by the number of days stored'
  }],
  ['📦 Kiritilayotgan Yuk Hajmi:', { ru: '📦 Принимаемый Объём Груза:', en: '📦 Inbound Cargo Volume:' }],
  ['📥 Yukni Omborga Qabul Qilish', { ru: '📥 Принять Груз на Склад', en: '📥 Receive Cargo into Warehouse' }],

  // MODAL 3: Chiqim (Outbound Release Modal) & InvoiceReceiptModal
  ['📥 Tushirilgan transport (Разгрузка):', { ru: '📥 Транспорт прихода (Разгрузка):', en: '📥 Inbound transport (Unloading):' }],
  ['🚛 Yuk ortilgan transport (Погрузка):', { ru: '🚛 Транспорт отгрузки (Погрузка):', en: '🚛 Outbound transport (Loading):' }],
  ['Keltirgan mas\'ul:', { ru: 'Принял на склад:', en: 'Received by:' }],
  ['Qabul qilib oluvchi vakil:', { ru: 'Представитель получателя:', en: 'Receiver representative:' }],
  ['Chiqargan mas\'ul:', { ru: 'Выдал со склада:', en: 'Released by:' }],
  ['Izoh:', { ru: 'Примечание:', en: 'Note:' }],
  ['Omborga tushirish (Разгрузка):', { ru: 'Разгрузка на склад (Приход):', en: 'Warehouse unloading (Inbound):' }],
  ['Bojxona omborida saqlash xizmati', { ru: 'Услуга хранения на таможенном складе', en: 'Customs warehouse storage service' }],
  ['(FAQAT saqlash kuniga ko\'paytiriladi)', { ru: '(умножается ТОЛЬКО на дни хранения)', en: '(multiplied ONLY by storage days)' }],
  ['Yukni ortish (Погрузка):', { ru: 'Погрузка груза (Расход):', en: 'Cargo loading (Outbound):' }],
  ['To\'lovchi (Shartnoma):', { ru: 'Плательщик (Договор):', en: 'Payer (Contract):' }],
  ['⛔ SHARTNOMA MUDDATI TUGAGAN! CHIQIM BLOKLANGAN!', {
    ru: '⛔ СРОК ДОГОВОРА ИСТЕК! ВЫДАЧА ЗАБЛОКИРОВАНА!',
    en: '⛔ CONTRACT EXPIRED! OUTBOUND RELEASE BLOCKED!'
  }],
  ['Shartnoma Muddati Bor (Chiqim Ruxsat Etilgan)', {
    ru: 'Договор Действителен (Выдача Разрешена)',
    en: 'Contract Active (Outbound Release Permitted)'
  }],
  ['Shartnoma tugash sanasi:', { ru: 'Дата окончания договора:', en: 'Contract expiration date:' }],
  ['📅 Shartnomani Yangilash / Muddatni Uzaytirish', {
    ru: '📅 Обновить / Продлить Договор',
    en: '📅 Renew / Extend Contract'
  }],
  ['💡 Yuk joyiga qarab taxminiy og\'irlik avtomatik hisoblandi (tarozi bo\'yicha o\'zgartirishingiz mumkin)', {
    ru: '💡 Расчетный вес определен автоматически по количеству мест (можно скорректировать по весам)',
    en: '💡 Estimated weight auto-calculated from quantity (can be adjusted per scale)'
  }],
  ['⚠️ Kirimdagi 1 martalik tushirish xizmati oldingi chiqim nakladnoyida hisobga olingan:', {
    ru: '⚠️ Разовая услуга разгрузки при приходе уже была учтена в предыдущей расходной накладной:',
    en: '⚠️ Inbound one-time unloading fee was already billed in a previous outbound waybill:'
  }],
  ['Qayta (2-marta) pul olinmaydi — avtomatik «Tushirish xizmatisiz (0 UZS)» belgilandi.', {
    ru: 'Повторно не начисляется — автоматически установлено «Без услуги разгрузки (0 UZS)».',
    en: 'Not charged twice — automatically set to "Without unloading service (0 UZS)".'
  }],
  ['(Saqlash kuniga ko\'paytirilmaydi)', { ru: '(Не умножается на дни хранения)', en: '(Not multiplied by storage days)' }],
  ['🔒 Moliyaviy ma\'lumotlar va narxlar sizning rolingiz (Oddiy Xodim) uchun yashirilgan.', {
    ru: '🔒 Финансовые данные и суммы скрыты для вашей роли (Кладовщик / User).',
    en: '🔒 Financial figures and prices are hidden for your role (Warehouse Operator).'
  }],
  ['Siz faqat bajarilgan tushirish, saqlash, ortish va qo\'shimcha xizmat turlarini belgilaysiz. To\'lov hisob-kitobi Bosh Rahbar, Katta Omborchi va Bosh Buxgalter oynasida avtomatik shakllanadi.', {
    ru: 'Вы отмечаете только выполненные виды разгрузки, хранения, погрузки и доп. услуг. Финансовый расчет автоматически формируется у Руководителя, Старшего Кладовщика и Главного Бухгалтера.',
    en: 'You only select the performed unloading, storage, loading, and extra services. Financial billing is automatically generated for Directors, Senior Managers, and Chief Accountants.'
  }],
  ['Kirim vaqtida mijoz ma\'lumotlaridan avtomatik olindi (o\'zgartirish mumkin)', {
    ru: 'Автоматически заполнено из данных клиента при приходе (можно изменить)',
    en: 'Auto-filled from inbound client details (editable)'
  }],
  ['Yukni oluvchi tashkilot STIR (INN) raqamini kiriting', {
    ru: 'Введите ИНН организации-получателя груза',
    en: 'Enter TIN (INN) of the receiving company'
  }],
  ['Masalan: 308942115', { ru: 'Например: 308942115', en: 'E.g.: 308942115' }],
  ['Masalan: "GRAND LOGISTICS" MChJ', { ru: 'Например: ООО «GRAND LOGISTICS»', en: 'E.g.: "GRAND LOGISTICS" LLC' }],
  ['Masalan: Karimov A. (Ishonchnoma №45)', { ru: 'Например: Каримов А. (Доверенность №45)', en: 'E.g.: Karimov A. (POA #45)' }],
  ['Masalan: Chiqim yuk xati №882, GTD rasmiylashtirildi', {
    ru: 'Например: Расходная накладная №882, ГТД оформлена',
    en: 'E.g.: Outbound waybill #882, customs declaration cleared'
  }],

  // EditProductModal (Kiritilgan Yukni Tahrirlash)
  ['Kiritilgan Yuk Ma\'lumotlarini To\'g\'rilash (Tahrirlash)', {
    ru: 'Исправление (Редактирование) Данных Принятого Груза',
    en: 'Correct (Edit) Entered Cargo Details'
  }],
  ['Kirim vaqtida ketgan xatoliklarni tuzatish. Barcha o\'zgarishlar Super Admin hisobotida qayd etiladi.', {
    ru: 'Исправление ошибок, допущенных при приходе. Все изменения фиксируются в отчете Супер-Админа.',
    en: 'Fix mistakes made during cargo entry. All changes are logged in the Super Admin audit report.'
  }],
  ['Tahrirlanayotgan Yuk (ID:', { ru: 'Редактируемый Груз (ID:', en: 'Cargo Being Edited (ID:' }],
  ['Ombor Sektori *', { ru: 'Сектор Склада *', en: 'Warehouse Sector *' }],
  ['Yuk To\'lovchisi (Shartnoma) *', { ru: 'Плательщик Груза (Договор) *', en: 'Cargo Payer (Contract) *' }],
  ['-- To\'lovchini tanlang --', { ru: '-- Выберите плательщика --', en: '-- Select payer --' }],
  ['Yuk (Partiya) Nomi *', { ru: 'Наименование Груза (Партии) *', en: 'Cargo (Batch) Name *' }],
  ['Yuk Toifasi (Kategoriya)', { ru: 'Категория Груза', en: 'Cargo Category' }],
  ['Joriy Qoldiq Soni *', { ru: 'Текущий Остаток (Мест) *', en: 'Current Balance Quantity *' }],
  ['O\'lchov Birligi *', { ru: 'Единица Измерения *', en: 'Unit of Measure *' }],
  ['quti (karobka)', { ru: 'коробок (ящиков)', en: 'boxes (cartons)' }],
  ['qop (meshok)', { ru: 'мешков', en: 'bags (sacks)' }],
  ['pallet (poddon)', { ru: 'паллет (поддонов)', en: 'pallets' }],
  ['bochka / idish', { ru: 'бочек / емкостей', en: 'barrels / drums' }],
  ['Joriy Og\'irligi (kg) *', { ru: 'Текущий Вес (кг) *', en: 'Current Weight (kg) *' }],
  ['Qo\'shimcha Izoh / Otsek', { ru: 'Дополнительное Примечание / Отсек', en: 'Additional Note / Compartment' }],
  ['Tahrirlash (To\'g\'rilash) Sababi *', { ru: 'Причина Исправления (Редактирования) *', en: 'Reason for Correction (Edit) *' }],
  ['Masalan: Kirim vaqtida og\'irlik xato yozilgan edi (tarozi qayta o\'lchandi) yoki mijoz nomi to\'g\'rilandi...', {
    ru: 'Например: При приходе был неверно указан вес (повторное взвешивание) или исправлено название клиента...',
    en: 'E.g.: Weight was mistyped during entry (re-weighed on scale) or client name corrected...'
  }],
  ['⚠️ Ushbu tahrir amali sizning nomingizdan (', {
    ru: '⚠️ Данное исправление от вашего имени (',
    en: '⚠️ This correction under your name ('
  }],
  [') oylik tahrirlar hisobotiga yozib qo\'yiladi.', {
    ru: ') будет записано в ежемесячный отчет по исправлениям.',
    en: ') will be recorded in the monthly corrections audit report.'
  }],
  ['O\'zgarishlarni Saqlash', { ru: 'Сохранить Изменения', en: 'Save Changes' }],

  // ProductHistoryModal
  ['Dastlabki kirim:', { ru: 'Первичный приход:', en: 'Initial inbound:' }],
  ['Jami chiqarilgan:', { ru: 'Всего выдано:', en: 'Total released:' }],
  ['Kunlik Saqlash Stavkasi:', { ru: 'Суточная Ставка Хранения:', en: 'Daily Storage Rate:' }],
  ['Omborga Tushirish Xizmati (1 martalik):', { ru: 'Услуга Разгрузки на Склад (Разовая):', en: 'Warehouse Unloading Service (One-time):' }],
  ['Hozirgacha Hisoblangan Saqlash To\'lovi:', { ru: 'Начислено за Хранение на Текущий Момент:', en: 'Accrued Storage Fee to Date:' }],
  ['Omborda to\'liq saqlanmoqda (100% qoldiq joyida).', {
    ru: 'Груз полностью хранится на складе (100% остаток на месте).',
    en: 'Cargo is stored in full at the warehouse (100% balance in stock).'
  }],
  ['1. Tushirish (Разгрузка):', { ru: '1. Разгрузка (Приход):', en: '1. Unloading (Inbound):' }],
  ['2. Saqlash (Xraneniya):', { ru: '2. Хранение (Посуточно):', en: '2. Storage (Daily):' }],
  ['3. Yuk Ortish (Погрузка):', { ru: '3. Погрузка (Расход):', en: '3. Loading (Outbound):' }],
  ['JAMI TO\'LOV (12% QQS bilan):', { ru: 'ИТОГО К ОПЛАТЕ (с НДС 12%):', en: 'TOTAL PAYABLE (incl. 12% VAT):' }],
  ['🔒 Moliyaviy summalar yashirilgan (Faqat miqdor va xizmat turlari ko\'rsatilgan)', {
    ru: '🔒 Финансовые суммы скрыты (Отображаются только объёмы и виды услуг)',
    en: '🔒 Financial amounts hidden (Only quantities and service types are shown)'
  }],

  // UserModal, PayerModal, CustomsServiceModal, MODAL 4 & 5
  ['⚙️ Xodim Huquqlarini Sozlash:', { ru: '⚙️ Настройка Прав Сотрудника:', en: '⚙️ Configure Staff Permissions:' }],
  ['👤 Yangi Admin yoki Xodim Qo\'shish', { ru: '👤 Добавить Нового Админа или Сотрудника', en: '👤 Add New Admin or Staff Member' }],
  ['Faqat Bosh Rahbar (Super Admin) xodimlarga huquq bera oladi', {
    ru: 'Только Генеральный Директор (Супер-Админ) может назначать права сотрудникам',
    en: 'Only the General Director (Super Admin) can grant staff permissions'
  }],
  ['Ism-sharifi va Lavozimi *', { ru: 'Ф.И.О. и Должность *', en: 'Full Name & Position *' }],
  ['Masalan: Sardor Rahimov (Omborchi)', { ru: 'Например: Сардор Рахимов (Кладовщик)', en: 'E.g.: Sardor Rahimov (Warehouseman)' }],
  ['Elektron Pochta (Login) *', { ru: 'Электронная Почта (Логин) *', en: 'Email Address (Login) *' }],
  ['Yangi Parol (Ixtiyoriy)', { ru: 'Новый Пароль (Необязательно)', en: 'New Password (Optional)' }],
  ['Kirish Paroli *', { ru: 'Пароль для Входа *', en: 'Login Password *' }],
  ['O\'zgartirmaslik uchun bo\'sh qoldiring', { ru: 'Оставьте пустым, чтобы не менять', en: 'Leave blank to keep current password' }],
  ['Kamida 6 ta belgi...', { ru: 'Минимум 6 символов...', en: 'At least 6 characters...' }],
  ['Tizimdagi Roli *', { ru: 'Роль в Системе *', en: 'System Role *' }],
  ['👤 USER (Oddiy Xodim / Omborchi — Moliya yopiq)', {
    ru: '👤 USER (Кладовщик / Оператор — Финансы скрыты)',
    en: '👤 USER (Warehouse Operator — Finances hidden)'
  }],
  ['💼 ACCOUNTANT (Bosh Buxgalter — To\'liq Moliya va Hisobotlar)', {
    ru: '💼 ACCOUNTANT (Главный Бухгалтер — Полные Финансы и Отчеты)',
    en: '💼 ACCOUNTANT (Chief Accountant — Full Finance & Reports)'
  }],
  ['🛡️ ADMIN (Katta Omborchi / Boshqaruvchi)', {
    ru: '🛡️ ADMIN (Старший Кладовщик / Управляющий)',
    en: '🛡️ ADMIN (Senior Warehouse Manager)'
  }],
  ['👑 SUPER ADMIN (Bosh Rahbar — To\'liq huquq)', {
    ru: '👑 SUPER ADMIN (Генеральный Директор — Полный доступ)',
    en: '👑 SUPER ADMIN (General Director — Full access)'
  }],
  ['Xodimga Beriladigan Aniq Huquqlar (Dostup):', {
    ru: 'Назначаемые Права Доступа Сотрудника:',
    en: 'Specific Access Permissions Granted to Staff:'
  }],
  ['🏗️ Omborni sozlash va yangi sektor qo\'shish', {
    ru: '🏗️ Настройка склада и добавление секторов',
    en: '🏗️ Configure warehouse and add new sectors'
  }],
  ['Sektorlar hajmi, turi va parametrlarini o\'zgartira oladi', {
    ru: 'Может изменять объём, тип и параметры секторов',
    en: 'Can modify sector capacity, type, and parameters'
  }],
  ['💰 Tarif qo\'shish va saqlash narxlarini belgilash', {
    ru: '💰 Добавление тарифов и управление ценами хранения',
    en: '💰 Add tariffs and configure storage pricing'
  }],
  ['Kunlik saqlash tariflarini yaratish va o\'zgartirish', {
    ru: 'Создание и изменение суточных тарифов хранения',
    en: 'Create and update daily storage tariffs'
  }],
  ['🔗 Tariflarni ombor sektorlariga bog\'lash', {
    ru: '🔗 Привязка тарифов к секторам склада',
    en: '🔗 Link tariffs to warehouse sectors'
  }],
  ['Qaysi sektorda qaysi tarif ishlashini belgilash', {
    ru: 'Назначение действующих тарифов для каждого сектора',
    en: 'Assign active tariffs to specific sectors'
  }],
  ['📦 Yuk kirim va chiqim amallarini bajarish', {
    ru: '📦 Выполнение операций прихода и расхода грузов',
    en: '📦 Perform inbound and outbound cargo operations'
  }],
  ['Omborga yuk qabul qilish va chiqarish', {
    ru: 'Прием грузов на склад и оформление выдачи',
    en: 'Receive cargo into warehouse and process releases'
  }],
  ['☣️ Xavfli (Kimyoviy) yuklar bilan ishlash ruxsati', {
    ru: '☣️ Допуск к работе с опасными (химическими) грузами',
    en: '☣️ Authorization to handle hazardous (chemical) cargo'
  }],
  ['D Sektordagi xavfli va yonuvchan moddalarni qabul qilish/chiqarish', {
    ru: 'Прием и выдача опасных и горючих веществ в Секторе D',
    en: 'Receive and release hazardous/flammable goods in Sector D'
  }],
  ['💵 Moliyaviy ma\'lumotlar, narxlar va to\'lov summalarini ko\'rish', {
    ru: '💵 Просмотр финансовых данных, цен и сумм оплаты',
    en: '💵 View financial figures, prices, and billing amounts'
  }],
  ['O\'chirilsa: Xodim faqat yuk soni, og\'irligi va xizmat turini belgilaydi, pul summalari yashiriladi', {
    ru: 'Если отключено: Сотрудник указывает только количество, вес и вид услуги, суммы скрыты',
    en: 'If disabled: Staff selects only quantity, weight, and service type; monetary amounts are hidden'
  }],
  ['✏️ Kiritilgan yukni tahrirlash (xatoni to\'g\'rilash) ruxsati', {
    ru: '✏️ Право на исправление (редактирование) принятого груза',
    en: '✏️ Permission to edit/correct entered cargo records'
  }],
  ['Yoqilsa: Xodim kirim qilingan yukda xato ketsa (nomi, vazni, soni, sektori) uni to\'g\'rilay oladi', {
    ru: 'Если включено: Сотрудник может исправить ошибку в принятом грузе (название, вес, кол-во, сектор)',
    en: 'If enabled: Staff can fix mistakes in entered cargo (name, weight, quantity, sector)'
  }],
  ['📊 Oylik tahrirlar hisobotini ko\'rish ruxsati', {
    ru: '📊 Доступ к ежемесячному отчету по исправлениям',
    en: '📊 Permission to view monthly corrections audit report'
  }],
  ['Yoqilsa: Kim qachon va qancha yukni to\'g\'rilaganligi haqidagi hisobotni ko\'ra oladi', {
    ru: 'Если включено: Может просматривать отчет о том, кто, когда и какие грузы исправлял',
    en: 'If enabled: Can view the audit report of who corrected which cargo and when'
  }],
  ['Qaysi Sektorlarda Ishlash Huquqi Bor:', {
    ru: 'Разрешенные Секторы для Работы:',
    en: 'Permitted Warehouse Sectors:'
  }],
  ['⚡ Barcha Sektorlar (A, B, C, D, E, F — Cheklovsiz)', {
    ru: '⚡ Все Секторы (A, B, C, D, E, F — Без ограничений)',
    en: '⚡ All Sectors (A, B, C, D, E, F — Unrestricted)'
  }],
  ['Yoki faqat tanlangan sektorlarni belgilang:', {
    ru: 'Или выберите только конкретные разрешенные секторы:',
    en: 'Or select specific permitted sectors only:'
  }],
  ['Huquqlarni Saqlash', { ru: 'Сохранить Права', en: 'Save Permissions' }],
  ['✏️ Yuk To\'lovchisi va Shartnomani Tahrirlash', {
    ru: '✏️ Редактировать Плательщика и Договор',
    en: '✏️ Edit Payer & Storage Contract'
  }],
  ['🏢 Yangi Yuk To\'lovchisi (Shartnoma) Qo\'shish', {
    ru: '🏢 Добавить Нового Плательщика (Договор)',
    en: '🏢 Add New Cargo Payer (Contract)'
  }],
  ['Rasmiy saqlash shartnomasi ma\'lumotlari va amal qilish muddati', {
    ru: 'Реквизиты официального договора хранения и срок его действия',
    en: 'Official storage contract details and validity period'
  }],
  ['To\'lovchi Korxona Nomi *', { ru: 'Наименование Организации-Плательщика *', en: 'Payer Company Name *' }],
  ['Masalan: Agro Impex Logistika MChJ', { ru: 'Например: ООО «Agro Impex Logistika»', en: 'E.g.: Agro Impex Logistics LLC' }],
  ['STIR (INN) Raqami *', { ru: 'Номер ИНН *', en: 'TIN (INN) Number *' }],
  ['Shartnoma Raqami *', { ru: 'Номер Договора *', en: 'Contract Number *' }],
  ['Masalan: SH-2026/08', { ru: 'Например: ДГ-2026/08', en: 'E.g.: CN-2026/08' }],
  ['Shartnoma Boshlanish Sanasi *', { ru: 'Дата Начала Договора *', en: 'Contract Start Date *' }],
  ['Shartnoma Tugash Muddati *', { ru: 'Дата Окончания Договора *', en: 'Contract Expiration Date *' }],
  ['Mas\'ul Vakil (F.I.Sh)', { ru: 'Ответственное Лицо (Ф.И.О.)', en: 'Contact Person (Full Name)' }],
  ['Masalan: Rustamov A.', { ru: 'Например: Рустамов А.', en: 'E.g.: Rustamov A.' }],
  ['Telefon Raqami', { ru: 'Номер Телефона', en: 'Phone Number' }],
  ['Qo\'shimcha Izoh', { ru: 'Дополнительное Примечание', en: 'Additional Notes' }],
  ['Shartnoma shartlari yoki maxsus eslatma...', {
    ru: 'Условия договора или особые отметки...',
    en: 'Contract terms or special notes...'
  }],
  ['Shartnomani Saqlash', { ru: 'Сохранить Договор', en: 'Save Contract' }],
  ['✏️ Bojxona Xizmati Tarifini O\'zgartirish', {
    ru: '✏️ Изменить Тариф Таможенной Услуги',
    en: '✏️ Edit Customs Service Tariff'
  }],
  ['➕ Yangi Bojxona Ombori Xizmati Qo\'shish', {
    ru: '➕ Добавить Новую Услугу Таможенного Склада',
    en: '➕ Add New Customs Warehouse Service'
  }],
  ['Tartib Raqami (№) *', { ru: 'Порядковый Номер (№) *', en: 'Item Number (No.) *' }],
  ['Bo\'lim (Kategoriya) *', { ru: 'Раздел (Категория) *', en: 'Section (Category) *' }],
  ['1. Разгрузка/Погрузка (Ortish va tushirish)', {
    ru: '1. Разгрузка / Погрузка (Разовые работы)',
    en: '1. Unloading / Loading (One-time operations)'
  }],
  ['2. Хранение (Bojxona omborida saqlash)', {
    ru: '2. Хранение (Посуточное хранение на складе)',
    en: '2. Storage (Daily warehouse storage)'
  }],
  ['3. Дополнительные услуги (Qo\'shimcha xizmatlar)', {
    ru: '3. Дополнительные услуги (Разовые услуги)',
    en: '3. Additional Services (One-time services)'
  }],
  ['Xizmat Nomi (O\'zbek tilida tushunarli) *', {
    ru: 'Наименование Услуги (Понятное описание) *',
    en: 'Service Name (Clear description) *'
  }],
  ['Masalan: 40 futlik konteyner yuklash / tushirish', {
    ru: 'Например: Контейнер 40 футов погрузка / разгрузка',
    en: 'E.g.: 40ft container loading / unloading'
  }],
  ['Rasmiy Nomi (Preyskurant hujjat bo\'yicha / Ruscha) *', {
    ru: 'Официальное Наименование (По прейскуранту) *',
    en: 'Official Name (Per Price List document) *'
  }],
  ['Masalan: Контейнер 40 футов (погрузка/разгрузка)', {
    ru: 'Например: Контейнер 40 футов (погрузка/разгрузка)',
    en: 'E.g.: 40ft Container (loading/unloading)'
  }],
  ['O\'lchov Birligi *', { ru: 'Единица Измерения *', en: 'Unit of Measure *' }],
  ['Bazaviy Narxi (QQSsiz, so\'mda) *', {
    ru: 'Базовая Стоимость (без НДС, в сумах) *',
    en: 'Base Price (excl. VAT, in UZS) *'
  }],
  ['Avtomatik QQS (12%) Hisobi:', { ru: 'Автоматический Расчет НДС (12%):', en: 'Automatic 12% VAT Calculation:' }],
  ['Tavsif va Qo\'llanilish Sharti', { ru: 'Описание и Условия Применения', en: 'Description & Application Terms' }],
  ['Ushbu xizmat qachon va qanday hisoblanishi haqida izoh...', {
    ru: 'Примечание о порядке и условиях начисления данной услуги...',
    en: 'Notes on when and how this service is billed...'
  }]
];

// Uzunroq iboralar birinchi almashtirilishi uchun uzunligi bo'yicha saralaymiz
const PHRASE_MAP = [...RAW_PHRASE_MAP].sort((a, b) => b[0].length - a[0].length);

// Birliklar lug'ati (quti, dona, pallet...)
const UNIT_MAP: Record<string, { ru: string; en: string }> = {
  quti: { ru: 'коробок', en: 'boxes' },
  pallet: { ru: 'паллет', en: 'pallets' },
  dona: { ru: 'шт.', en: 'pcs' },
  komplekt: { ru: 'компл.', en: 'sets' },
  blok: { ru: 'блоков', en: 'blocks' },
  qop: { ru: 'мешков', en: 'bags' },
  bochka: { ru: 'бочек', en: 'barrels' },
  kanistr: { ru: 'канистр', en: 'canisters' },
  rulon: { ru: 'рулонов', en: 'rolls' },
  yashik: { ru: 'ящиков', en: 'crates' },
  "o'ram": { ru: 'упак.', en: 'packs' },
  pachka: { ru: 'пачек', en: 'packs' },
  tonna: { ru: 'тонн', en: 'tons' },
  avto: { ru: 'авто', en: 'vehicles' },
  konteyner: { ru: 'контейнеров', en: 'containers' }
};

/**
 * Har qanday matn tugunini (Text node / string) tanlangan tilga (uz, ru, en) o'giruvchi funksiya.
 */
export function translateTextNode(rawText: string, lang: Language): string {
  if (!rawText || !rawText.trim()) return rawText;

  let text = rawText;

  // Agar O'zbek tili tanlangan bo'lsa, ruscha qolib ketgan tarif nomlarini o'zbekchaga o'giramiz
  if (lang === 'uz') {
    for (const [key, val] of PHRASE_MAP) {
      if (val.uz && text.includes(key)) {
        text = text.split(key).join(val.uz);
      }
    }
    text = text.replace(/\s*\(Разгрузка\)/gi, '');
    text = text.replace(/\s*\(Погрузка\)/gi, '');
    return text;
  }

  // 1. To'liq va qisman iboralarni almashtirish
  for (const [uzPhrase, trans] of PHRASE_MAP) {
    const target = lang === 'ru' ? trans.ru : trans.en;
    if (text === uzPhrase) return target;
    if (text.includes(uzPhrase)) {
      text = text.split(uzPhrase).join(target);
    }
  }

  // 2. Dinamik raqamli iboralar va alohida suffikslar (Regex patterns)
  // "Preyskurant №19" / "Preyskurant #19"
  text = text.replace(/Preyskurant\s*[№#](\d+(?:\.\d+)?)/gi, (_, n) =>
    lang === 'ru' ? `Прейскурант №${n}` : `Price List #${n}`
  );
  // "Yangi Sektor (7)"
  text = text.replace(/Yangi Sektor\s*\((\d+)\)/gi, (_, n) =>
    lang === 'ru' ? `Новый Сектор (${n})` : `New Sector (${n})`
  );
  // "1 560 m² hajmli ombor"
  text = text.replace(/(\d[\d\s,\.]*)\s*m²\s*hajmli ombor/gi, (_, cap) =>
    lang === 'ru' ? `Склад площадью ${cap.trim()} м²` : `${cap.trim()} m² capacity warehouse`
  );
  // Arxiv harakatlari izohlari (yearly-movements.ts):
  text = text.replace(/(.+?)\s+dan\s+(\d[\d\s,\.]*)\s+([^\s]+)\s+partiya qabul qilindi\.\s*Hujjat:\s*(.+)/gi, (_, client, qty, unit, doc) => {
    const uKey = unit.toLowerCase();
    const trUnit = UNIT_MAP[uKey] ? (lang === 'ru' ? UNIT_MAP[uKey].ru : UNIT_MAP[uKey].en) : unit;
    return lang === 'ru'
      ? `Принята партия ${qty} ${trUnit} от ${client}. Документ: ${doc}`
      : `Received batch of ${qty} ${trUnit} from ${client}. Doc: ${doc}`;
  });
  text = text.replace(/(.+?)\s+buyurtmasiga ko'ra\s+(.+?)\s+chiqarildi\./gi, (_, client, details) =>
    lang === 'ru'
      ? `По заявке ${client} выдано: ${details}.`
      : `Released per order of ${client}: ${details}.`
  );
  // "21 xil mahsulot partiyasi" / "21 xil partiya"
  text = text.replace(/(\d+)\s*xil mahsulot partiyasi/gi, (_, n) =>
    lang === 'ru' ? `${n} видов партий грузов` : `${n} cargo batch types`
  );
  text = text.replace(/^\s*xil mahsulot partiyasi\s*$/gi,
    lang === 'ru' ? ' видов партий грузов' : ' cargo batch types'
  );
  text = text.replace(/(\d+)\s*xil yuk partiyasi/gi, (_, n) =>
    lang === 'ru' ? `${n} партий груза` : `${n} cargo batches`
  );
  text = text.replace(/^\s*xil yuk partiyasi\s*$/gi,
    lang === 'ru' ? ' партий груза' : ' cargo batches'
  );
  text = text.replace(/(\d+)\s*xil partiya/gi, (_, n) =>
    lang === 'ru' ? `${n} партий грузов` : `${n} cargo batches`
  );
  text = text.replace(/^\s*xil partiya\s*$/gi,
    lang === 'ru' ? ' партий грузов' : ' cargo batches'
  );
  // "6 ta ixtisoslashgan sektor" / "6 ta sektor"
  text = text.replace(/(\d+)\s*ta ixtisoslashgan sektor/gi, (_, n) =>
    lang === 'ru' ? `${n} специализированных секторов` : `${n} specialized sectors`
  );
  text = text.replace(/^\s*ta ixtisoslashgan sektor\s*$/gi,
    lang === 'ru' ? ' специализированных секторов' : ' specialized sectors'
  );
  text = text.replace(/(\d+)\s*ta sektor/gi, (_, n) =>
    lang === 'ru' ? `${n} сектор(ов)` : `${n} sector(s)`
  );
  text = text.replace(/^\s*ta sektor\s*$/gi,
    lang === 'ru' ? ' сектор(ов)' : ' sector(s)'
  );
  // "Umumiy: 21 xil yuk partiyasi"
  text = text.replace(/Umumiy:\s*(\d+)\s*xil yuk partiyasi/gi, (_, n) =>
    lang === 'ru' ? `Всего: ${n} партий груза` : `Total: ${n} cargo batches`
  );
  text = text.replace(/Umumiy:\s*/gi, lang === 'ru' ? 'Всего: ' : 'Total: ');
  // "21 ta yuk" / "4 ta yuk partiyasi" / "12 ta partiya" / "5 ta chiqim" / "6 ta"
  text = text.replace(/(\d+)\s*ta yuk partiyasi/gi, (_, n) =>
    lang === 'ru' ? `${n} партий груза` : `${n} cargo batches`
  );
  text = text.replace(/(\d+)\s*ta partiya/gi, (_, n) =>
    lang === 'ru' ? `${n} партий` : `${n} batches`
  );
  text = text.replace(/(\d+)\s*ta chiqim/gi, (_, n) =>
    lang === 'ru' ? `${n} расходов` : `${n} outbound releases`
  );
  text = text.replace(/^\s*ta chiqim\s*$/gi,
    lang === 'ru' ? ' расходов' : ' outbound releases'
  );
  text = text.replace(/(\d+)\s*ta xodim/gi, (_, n) =>
    lang === 'ru' ? `${n} сотрудников` : `${n} staff members`
  );
  text = text.replace(/(\d+)\s*nafar xodim/gi, (_, n) =>
    lang === 'ru' ? `${n} сотрудников` : `${n} staff members`
  );
  text = text.replace(/(\d+)\s*ta tashkilot/gi, (_, n) =>
    lang === 'ru' ? `${n} организаций` : `${n} companies`
  );
  text = text.replace(/(\d+)\s*ta korxona/gi, (_, n) =>
    lang === 'ru' ? `${n} организаций` : `${n} companies`
  );
  text = text.replace(/(\d+)\s*ta transport/gi, (_, n) =>
    lang === 'ru' ? `${n} трансп.` : `${n} vehicles`
  );
  text = text.replace(/(\d+)\s*ta mashina/gi, (_, n) =>
    lang === 'ru' ? `${n} маш.` : `${n} vehicles`
  );
  text = text.replace(/(\d+)\s*ta yuk/gi, (_, n) =>
    lang === 'ru' ? `${n} партий` : `${n} items`
  );
  text = text.replace(/^\s*ta yuk\s*$/gi,
    lang === 'ru' ? ' партий' : ' items'
  );
  text = text.replace(/(\d+)\s*marta/gi, (_, n) =>
    lang === 'ru' ? `${n} раз(а)` : `${n} times`
  );
  text = text.replace(/\b(\d+)\s*ta\b/gi, (_, n) =>
    lang === 'ru' ? `${n} шт.` : `${n}`
  );
  text = text.replace(/^\s*ta\s*$/gi,
    lang === 'ru' ? ' шт.' : ''
  );
  // Grafik sanalari: "23-Okt", "24-Okt"
  text = text.replace(/\b(\d+)-(Yan|Fev|Mar|Apr|May|Iyun|Iyul|Avg|Sen|Okt|Noy|Dek)\b/g, (_, d, m) => {
    const ruMonths: Record<string, string> = { Yan: 'Янв', Fev: 'Фев', Mar: 'Мар', Apr: 'Апр', May: 'Май', Iyun: 'Июн', Iyul: 'Июл', Avg: 'Авг', Sen: 'Сен', Okt: 'Окт', Noy: 'Ноя', Dek: 'Дек' };
    const enMonths: Record<string, string> = { Yan: 'Jan', Fev: 'Feb', Mar: 'Mar', Apr: 'Apr', May: 'May', Iyun: 'Jun', Iyul: 'Jul', Avg: 'Aug', Sen: 'Sep', Okt: 'Oct', Noy: 'Nov', Dek: 'Dec' };
    return `${d}-${lang === 'ru' ? (ruMonths[m] || m) : (enMonths[m] || m)}`;
  });
  // "Ombor Sektorlari (6)"
  text = text.replace(/Ombor Sektorlari\s*\((\d+)\)/gi, (_, n) =>
    lang === 'ru' ? `Секторы Склада (${n})` : `Warehouse Sectors (${n})`
  );
  // "1. Har Bir Chiqim Tafsiloti (15)" / "2. Kim Qancha Chiqim Qildi?" / "3. Qancha To'lashi Kerak?"
  text = text.replace(/1\.\s*Har Bir Chiqim Tafsiloti/gi,
    lang === 'ru' ? '1. Детализация Каждого Расхода' : '1. Every Outbound Release Detail'
  );
  text = text.replace(/2\.\s*Kim Qancha Chiqim Qildi\?/gi,
    lang === 'ru' ? '2. Кто Сколько Выдал (По сотрудникам)' : '2. Outbound by Staff Member'
  );
  text = text.replace(/3\.\s*Qancha To'lashi Kerak\?/gi,
    lang === 'ru' ? '3. Сколько Должны Оплатить (По клиентам)' : '3. Receivables by Client Organization'
  );
  text = text.replace(/JAMI\s*\(/g, lang === 'ru' ? 'ИТОГО (' : 'TOTAL (');

  // "A Sektor", "B Sektor"...
  text = text.replace(/\b([A-F])\s+Sektor\b/g, (_, letter) =>
    lang === 'ru' ? `Сектор ${letter}` : `Sector ${letter}`
  );
  // "Mavjud tovarlar:" va "4 xil"
  text = text.replace(/Mavjud tovarlar:/gi, lang === 'ru' ? 'Товаров в наличии:' : 'Items in stock:');
  text = text.replace(/\b(\d+)\s*xil\b/gi, (_, n) =>
    lang === 'ru' ? `${n} вид(а)` : `${n} types`
  );
  text = text.replace(/^\s*xil\s*$/gi,
    lang === 'ru' ? ' вид(а)' : ' types'
  );
  // "● Faol" / "Faol"
  text = text.replace(/●\s*Faol/g, lang === 'ru' ? '● Активен' : '● Active');
  text = text.replace(/\bFaol\b/g, lang === 'ru' ? 'Активен' : 'Active');
  // Kalit so'zlar:
  text = text.replace(/Hajmi:/g, lang === 'ru' ? 'Площадь / Объём:' : 'Capacity / Volume:');
  text = text.replace(/Maydon:/g, lang === 'ru' ? 'Площадь:' : 'Area:');
  text = text.replace(/Otseklar:/g, lang === 'ru' ? 'Отсеки:' : 'Compartments:');
  text = text.replace(/Harorat:/g, lang === 'ru' ? 'Температура:' : 'Temperature:');
  text = text.replace(/Mas'ul:/g, lang === 'ru' ? 'Ответственный:' : 'Manager:');
  text = text.replace(/Dastlabki:/g, lang === 'ru' ? 'Начальный:' : 'Initial:');
  text = text.replace(/Qoldiq:/g, lang === 'ru' ? 'Остаток:' : 'Remaining:');
  text = text.replace(/Omborda qoldiq:/g, lang === 'ru' ? 'Остаток на складе:' : 'In stock:');
  text = text.replace(/Chiqarilgan:/g, lang === 'ru' ? 'Выдано:' : 'Released:');
  text = text.replace(/STIR\s*\(INN\):/g, lang === 'ru' ? 'ИНН:' : 'TIN (INN):');
  text = text.replace(/STIR:/g, lang === 'ru' ? 'ИНН:' : 'TIN:');
  text = text.replace(/Mijoz:/g, lang === 'ru' ? 'Клиент:' : 'Client:');
  text = text.replace(/Vakil:/g, lang === 'ru' ? 'Представитель:' : 'Rep.:');
  text = text.replace(/Sklad:/g, lang === 'ru' ? 'Сектор:' : 'Sector:');
  text = text.replace(/Toifa:/g, lang === 'ru' ? 'Категория:' : 'Category:');
  text = text.replace(/Kategoriya:/g, lang === 'ru' ? 'Категория:' : 'Category:');
  text = text.replace(/📅 Kirim Qilingan Sana:/g, lang === 'ru' ? '📅 Дата Прихода:' : '📅 Entry Date:');
  text = text.replace(/👤 Mas'ul Xodim:/g, lang === 'ru' ? '👤 Ответственный:' : '👤 Handled By:');
  text = text.replace(/🚛 Tushirish Usuli:/g, lang === 'ru' ? '🚛 Способ Разгрузки:' : '🚛 Unloading Method:');
  text = text.replace(/⏱️ Saqlanish Muddati:/g, lang === 'ru' ? '⏱️ Срок Хранения:' : '⏱️ Storage Duration:');
  text = text.replace(/❄️ Saqlash Tarifi \(2-rasm\):/g, lang === 'ru' ? '❄️ Тариф Хранения:' : '❄️ Storage Tariff:');
  text = text.replace(/🚛 Kelgan:/g, lang === 'ru' ? '🚛 Прибыл:' : '🚛 Arrived by:');
  text = text.replace(/🚛 Ortish:/g, lang === 'ru' ? '🚛 Погрузка:' : '🚛 Loading:');
  text = text.replace(/Tushirish:/g, lang === 'ru' ? 'Разгрузка:' : 'Unloading:');
  text = text.replace(/Ortish:/g, lang === 'ru' ? 'Погрузка:' : 'Loading:');
  text = text.replace(/Saqlash:/g, lang === 'ru' ? 'Хранение:' : 'Storage:');
  text = text.replace(/Sana:/g, lang === 'ru' ? 'Дата:' : 'Date:');

  // "2 kundan beri" / "12 kun saqlangan" / "2 kun"
  text = text.replace(/(\d+)\s*kundan beri/gi, (_, n) =>
    lang === 'ru' ? `${n} дн. на хранении` : `${n} days stored`
  );
  text = text.replace(/^\s*kundan beri\s*$/gi,
    lang === 'ru' ? ' дн. на хранении' : ' days stored'
  );
  text = text.replace(/(\d+)\s*kun saqlangan/gi, (_, n) =>
    lang === 'ru' ? `${n} дн. хранения` : `${n} days stored`
  );
  text = text.replace(/^\s*kun saqlangan\s*$/gi,
    lang === 'ru' ? ' дн. хранения' : ' days stored'
  );
  text = text.replace(/(\d+)\s*kun saqlandi/gi, (_, n) =>
    lang === 'ru' ? `хранится ${n} дн.` : `stored ${n} days`
  );
  text = text.replace(/\b(\d+)\s*kun\b/gi, (_, n) =>
    lang === 'ru' ? `${n} дн.` : `${n} days`
  );
  text = text.replace(/^\s*kun\s*$/gi,
    lang === 'ru' ? ' дн.' : ' days'
  );
  // Tarif stavkasi va birliklari: "(1 tn / kun (kunlik stavka))", "(1 kg / sutka)", "so'm", "0.1 tn"
  text = text.replace(/1 tn \/ kun \(kunlik stavka\)/gi, lang === 'ru' ? '1 тн / сутки (суточная ставка)' : '1 ton / day (daily rate)');
  text = text.replace(/1 kg \/ kun \(kunlik stavka\)/gi, lang === 'ru' ? '1 кг / сутки (суточная ставка)' : '1 kg / day (daily rate)');
  text = text.replace(/1 pallet \/ kun \(kunlik stavka\)/gi, lang === 'ru' ? '1 паллет / сутки (суточная ставка)' : '1 pallet / day (daily rate)');
  text = text.replace(/1 dona \/ kun \(kunlik stavka\)/gi, lang === 'ru' ? '1 ед. / сутки (суточная ставка)' : '1 unit / day (daily rate)');
  text = text.replace(/1 avto \/ kun \(kunlik stavka\)/gi, lang === 'ru' ? '1 авто / сутки (суточная ставка)' : '1 vehicle / day (daily rate)');
  text = text.replace(/1 fura \/ kun \(kunlik stavka\)/gi, lang === 'ru' ? '1 фура / сутки (суточная ставка)' : '1 truck / day (daily rate)');
  text = text.replace(/1 konteyner \/ kun \(kunlik stavka\)/gi, lang === 'ru' ? '1 контейнер / сутки (суточная ставка)' : '1 container / day (daily rate)');
  text = text.replace(/1 kg \/ sutka/gi, lang === 'ru' ? '1 кг / сутки' : '1 kg / day');
  text = text.replace(/1 tn \/ sutka/gi, lang === 'ru' ? '1 тн / сутки' : '1 ton / day');
  text = text.replace(/1 pallet \/ sutka/gi, lang === 'ru' ? '1 паллет / сутки' : '1 pallet / day');
  text = text.replace(/1 dona \/ sutka/gi, lang === 'ru' ? '1 ед. / сутки' : '1 unit / day');
  text = text.replace(/UZS\/sutka/gi, lang === 'ru' ? 'UZS/сутки' : 'UZS/day');
  text = text.replace(/UZS\/kun/gi, lang === 'ru' ? 'UZS/сутки' : 'UZS/day');
  text = text.replace(/so'm\/kg\/kun/gi, lang === 'ru' ? 'сум/кг/сутки' : 'UZS/kg/day');
  text = text.replace(/so'm\/tn\/kun/gi, lang === 'ru' ? 'сум/тн/сутки' : 'UZS/ton/day');
  text = text.replace(/UZS\/tn/gi, lang === 'ru' ? 'UZS/тн' : 'UZS/ton');
  text = text.replace(/(\d+(?:\.\d+)?)\s*tn\b/gi, (_, n) => lang === 'ru' ? `${n} тн` : `${n} t`);
  text = text.replace(/12%\s*QQS/gi, lang === 'ru' ? '12% НДС' : '12% VAT');
  text = text.replace(/\bQQS\b/g, lang === 'ru' ? 'НДС' : 'VAT');
  text = text.replace(/so'm/gi, lang === 'ru' ? 'сум' : 'UZS');
  text = text.replace(/1 sutka/gi, lang === 'ru' ? '1 сутки' : '1 day');
  text = text.replace(/1 fura/gi, lang === 'ru' ? '1 фура' : '1 truck');
  text = text.replace(/1 vagon/gi, lang === 'ru' ? '1 вагон' : '1 wagon');
  text = text.replace(/kunlik stavka/gi, lang === 'ru' ? 'суточная ставка' : 'daily rate');
  text = text.replace(/kunlik/gi, lang === 'ru' ? 'в сутки' : 'per day');

  // Xodim lavozimlari qavsda: "(Bosh Rahbar)", "(Katta Omborchi)", "(Oddiy Xodim / User)", "(Bosh Buxgalter)", "(Omborchi)"
  text = text.replace(/\(Bosh Rahbar\)/g, lang === 'ru' ? '(Ген. Директор)' : '(General Director)');
  text = text.replace(/\(Katta Omborchi\)/g, lang === 'ru' ? '(Старший Кладовщик)' : '(Senior Manager)');
  text = text.replace(/\(Oddiy Xodim \/ User\)/g, lang === 'ru' ? '(Кладовщик / User)' : '(Warehouse Operator)');
  text = text.replace(/\(Bosh Buxgalter\)/g, lang === 'ru' ? '(Главный Бухгалтер)' : '(Chief Accountant)');
  text = text.replace(/\(Omborchi\)/g, lang === 'ru' ? '(Кладовщик)' : '(Warehouseman)');
  text = text.replace(/\bOmborchi\b/g, lang === 'ru' ? 'Кладовщик' : 'Warehouseman');
  text = text.replace(/Chiqim hujjati №(\d+)\.\s*(\d+)\s*quti do'konlarga chiqarildi/gi, (_, docNo, qty) =>
    lang === 'ru' ? `Расходный документ №${docNo}. Выдано ${qty} кор. в магазины` : `Outbound doc #${docNo}. ${qty} boxes released to stores`
  );

  // Otsek izohlari: "A2 otsek muzlatkich", "A1 otsek -20°C saqlovda", "A3 otsekda -18°C da saqlanmoqda"
  text = text.replace(/([A-F]\d)\s*otsekda\s*([^\s]+)\s*da saqlanmoqda/gi, (_, sec, temp) =>
    lang === 'ru' ? `Хранится в отсеке ${sec} при ${temp}` : `Stored in compartment ${sec} at ${temp}`
  );
  text = text.replace(/([A-F]\d)\s*otsek muzlatkich/gi, (_, sec) =>
    lang === 'ru' ? `Отсек ${sec} (морозильная камера)` : `Compartment ${sec} (freezer)`
  );
  text = text.replace(/([A-F]\d)\s*otsek\s*([^\s]+)\s*saqlov(?:da)?/gi, (_, sec, temp) =>
    lang === 'ru' ? `Отсек ${sec} (хранение ${temp})` : `Compartment ${sec} (${temp} storage)`
  );

  // Birliklar (masalan: "4,400 quti", "990 dona, 2,650 quti")
  for (const [uzUnit, uTrans] of Object.entries(UNIT_MAP)) {
    const targetUnit = lang === 'ru' ? uTrans.ru : uTrans.en;
    const regex = new RegExp(`(\\d[\\d,\\s\\.]*)\\s+${uzUnit}\\b`, 'gi');
    text = text.replace(regex, `$1 ${targetUnit}`);
    if (text.trim().toLowerCase() === uzUnit) {
      return targetUnit;
    }
  }

  return text;
}
