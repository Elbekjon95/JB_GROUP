/**
 * UZW - Ma'lumotlar bazasi va LocalStorage Boshqaruvi
 */

const STORAGE_KEYS = {
  WAREHOUSES: 'uzw_warehouses',
  PRODUCTS: 'uzw_products',
  TARIFFS: 'uzw_tariffs',
  LOGS: 'uzw_logs',
  USERS: 'uzw_users',
  CURRENT_USER: 'uzw_current_user'
};

// Boshlang'ich namunaviy omborlar
const DEFAULT_WAREHOUSES = [
  {
    id: 'wh-1',
    name: 'Toshkent Bosh Logistika Markazi',
    city: 'Toshkent shahri, Sergeli tumani',
    type: 'Standart Quruq Ombor',
    totalCapacity: 5000, // m³
    occupiedCapacity: 3400,
    manager: 'Javohir Aliyev',
    phone: '+998 90 123 45 67',
    status: 'Faol',
    createdDate: '2026-01-10'
  },
  {
    id: 'wh-2',
    name: 'Samarqand Ziyokor Ombori',
    city: 'Samarqand shahri, Sanoat zonasi',
    type: 'Muzlatkichli Ombor (-18°C)',
    totalCapacity: 2500, // m³
    occupiedCapacity: 1200,
    manager: 'Dilshod Karimov',
    phone: '+998 93 987 65 43',
    status: 'Faol',
    createdDate: '2026-02-15'
  },
  {
    id: 'wh-3',
    name: 'Farg\'ona Tekstil & Zaxira Bazas',
    city: 'Farg\'ona shahri, Marg\'ilon yo\'li',
    type: 'Ochiq & Yopiq Aralash',
    totalCapacity: 4000, // m³
    occupiedCapacity: 3750,
    manager: 'Nodira Umarova',
    phone: '+998 97 555 12 34',
    status: 'Deyarli to\'lgan',
    createdDate: '2026-03-01'
  }
];

// Boshlang'ich saqlash tariflari
const DEFAULT_TARIFFS = [
  {
    id: 'tr-1',
    name: 'Standart Pallet Tarifi',
    billingPeriod: 'kunlik', // kunlik / oylik
    pricePerUnit: 15000,
    currency: 'UZS',
    unitType: 'pallet', // pallet, dona, m3, kg
    description: 'Quruq omborda yevro-pallet joyida saqlash (havo namligi 50-60%)',
    features: ['24/7 video monitoring', 'Yuk ortish-tushirish kafolati', 'Yong\'in xavfsizligi tizimi'],
    isPopular: true
  },
  {
    id: 'tr-2',
    name: 'Muzlatkichli Harorat Tarifi',
    billingPeriod: 'kunlik',
    pricePerUnit: 35000,
    currency: 'UZS',
    unitType: 'm3',
    description: '-18°C dan -24°C gacha bo\'lgan chuqur muzlatkichli saqlash',
    features: ['Avtomatik termografiya', 'Zaxira generatorlari', 'Tez buziluvchi mahsulotlar uchun'],
    isPopular: false
  },
  {
    id: 'tr-3',
    name: 'Oylik Katta Hajmli Tarif',
    billingPeriod: 'oylik',
    pricePerUnit: 280000,
    currency: 'UZS',
    unitType: 'm3',
    description: 'Uzoq muddatli yirik tovarlar va texnikalar uchun qulay shartlar',
    features: ['10% gacha keshbek', 'Shaxsiy ombor menejeri', 'Barcha sug\'urta qoplamalari'],
    isPopular: false
  },
  {
    id: 'tr-4',
    name: 'Kichik Dona & Quti Tarifi',
    billingPeriod: 'kunlik',
    pricePerUnit: 3000,
    currency: 'UZS',
    unitType: 'dona',
    description: 'Mayda tovarlar, e-tijorat va buyurtmalar uchun javonli saqlash',
    features: ['Shtrix-kod skaneri', 'Kunlik inventarizatsiya', 'Tez chiqarib berish'],
    isPopular: false
  }
];

// Boshlang'ich mahsulotlar
const DEFAULT_PRODUCTS = [
  {
    id: 'pr-1',
    name: 'Oq qand (Shakar) 50kg',
    sku: 'UZ-SHAK-001',
    category: 'Oziq-ovqat',
    warehouseId: 'wh-1',
    quantity: 450,
    unit: 'qop',
    tariffId: 'tr-1',
    minStock: 50,
    entryDate: '2026-10-01',
    notes: 'Quruq joyda saqlansin'
  },
  {
    id: 'pr-2',
    name: 'Muzlatilgan tovuq go\'shti',
    sku: 'UZ-TOV-882',
    category: 'Go\'sht mahsulotlari',
    warehouseId: 'wh-2',
    quantity: 1200,
    unit: 'kg',
    tariffId: 'tr-2',
    minStock: 200,
    entryDate: '2026-10-12',
    notes: 'Harorat -18°C da saqlansin'
  },
  {
    id: 'pr-3',
    name: 'Paxta ip-kalava (№30)',
    sku: 'UZ-TEK-451',
    category: 'Tekstil',
    warehouseId: 'wh-3',
    quantity: 80,
    unit: 'pallet',
    tariffId: 'tr-1',
    minStock: 20,
    entryDate: '2026-09-18',
    notes: 'Eksport partiyasi'
  },
  {
    id: 'pr-4',
    name: 'Kungaboqar yog\'i 5L',
    sku: 'UZ-YOG-119',
    category: 'Oziq-ovqat',
    warehouseId: 'wh-1',
    quantity: 800,
    unit: 'dona',
    tariffId: 'tr-4',
    minStock: 100,
    entryDate: '2026-10-15',
    notes: '160 quti x 5 dona'
  },
  {
    id: 'pr-5',
    name: 'Muzlatilgan rezavorlar (Qulupnay)',
    sku: 'UZ-REZ-055',
    category: 'Meva-sabzavot',
    warehouseId: 'wh-2',
    quantity: 350,
    unit: 'kg',
    tariffId: 'tr-2',
    minStock: 50,
    entryDate: '2026-10-18',
    notes: 'Shokli muzlatish qutisida'
  }
];

// Boshlang'ich tizim foydalanuvchilari
const DEFAULT_USERS = [
  {
    id: 'usr-1',
    email: 'admin@uzw.uz',
    password: 'password123',
    fullName: 'Akmal Rahimov',
    role: 'Bosh Administrator',
    company: 'UZW Logistics Group'
  },
  {
    id: 'usr-2',
    email: 'operator@uzw.uz',
    password: 'operator123',
    fullName: 'Nargiza Saidova',
    role: 'Ombor Nazoratchisi',
    company: 'UZW Logistics Group'
  }
];

// So'nggi amallar jurnali
const DEFAULT_LOGS = [
  { id: 'log-1', action: 'Kirim', item: 'Kungaboqar yog\'i 5L (800 dona)', warehouse: 'Toshkent Bosh Logistika Markazi', time: 'Bugun, 14:35', user: 'Akmal Rahimov' },
  { id: 'log-2', action: 'Yangi mahsulot', item: 'Muzlatilgan rezavorlar', warehouse: 'Samarqand Ziyokor Ombori', time: 'Bugun, 11:10', user: 'Dilshod Karimov' },
  { id: 'log-3', action: 'Tarif biriktirildi', item: 'Paxta ip-kalava (№30)', warehouse: 'Farg\'ona Tekstil & Zaxira Bazas', time: 'Kecha, 17:20', user: 'Nodira Umarova' }
];

// Ma'lumotlarni yuklash va saqlash yordamchi obyekti
const DataStore = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.WAREHOUSES)) {
      this.saveWarehouses(DEFAULT_WAREHOUSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TARIFFS)) {
      this.saveTariffs(DEFAULT_TARIFFS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.saveProducts(DEFAULT_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.saveUsers(DEFAULT_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
      this.saveLogs(DEFAULT_LOGS);
    }
  },

  // Omborlar
  getWarehouses() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WAREHOUSES) || '[]');
  },
  saveWarehouses(data) {
    localStorage.setItem(STORAGE_KEYS.WAREHOUSES, JSON.stringify(data));
  },
  addWarehouse(warehouse) {
    const warehouses = this.getWarehouses();
    warehouse.id = 'wh-' + Date.now();
    warehouse.occupiedCapacity = warehouse.occupiedCapacity || 0;
    warehouse.createdDate = new Date().toISOString().split('T')[0];
    warehouses.unshift(warehouse);
    this.saveWarehouses(warehouses);
    this.addLog('Yangi ombor yaratildi', warehouse.name, warehouse.name);
    return warehouse;
  },
  updateWarehouse(id, updatedFields) {
    const warehouses = this.getWarehouses();
    const index = warehouses.findIndex(w => w.id === id);
    if (index !== -1) {
      warehouses[index] = { ...warehouses[index], ...updatedFields };
      this.saveWarehouses(warehouses);
      return warehouses[index];
    }
    return null;
  },
  deleteWarehouse(id) {
    let warehouses = this.getWarehouses();
    const target = warehouses.find(w => w.id === id);
    warehouses = warehouses.filter(w => w.id !== id);
    this.saveWarehouses(warehouses);
    if (target) {
      this.addLog('Ombor o\'chirildi', target.name, target.name);
    }
  },

  // Mahsulotlar
  getProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  },
  saveProducts(data) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
  },
  addProduct(product) {
    const products = this.getProducts();
    product.id = 'pr-' + Date.now();
    product.entryDate = new Date().toISOString().split('T')[0];
    products.unshift(product);
    this.saveProducts(products);

    const warehouse = this.getWarehouses().find(w => w.id === product.warehouseId);
    this.addLog('Yangi mahsulot kiritildi', `${product.name} (${product.quantity} ${product.unit})`, warehouse ? warehouse.name : 'Noma\'lum ombor');
    return product;
  },
  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedFields };
      this.saveProducts(products);
      return products[index];
    }
    return null;
  },
  deleteProduct(id) {
    let products = this.getProducts();
    const target = products.find(p => p.id === id);
    products = products.filter(p => p.id !== id);
    this.saveProducts(products);
    if (target) {
      this.addLog('Mahsulot o\'chirildi', target.name, '-');
    }
  },

  // Saqlash tariflari
  getTariffs() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TARIFFS) || '[]');
  },
  saveTariffs(data) {
    localStorage.setItem(STORAGE_KEYS.TARIFFS, JSON.stringify(data));
  },
  addTariff(tariff) {
    const tariffs = this.getTariffs();
    tariff.id = 'tr-' + Date.now();
    tariffs.push(tariff);
    this.saveTariffs(tariffs);
    this.addLog('Yangi tarif yaratildi', tariff.name, '-');
    return tariff;
  },
  updateTariff(id, updatedFields) {
    const tariffs = this.getTariffs();
    const index = tariffs.findIndex(t => t.id === id);
    if (index !== -1) {
      tariffs[index] = { ...tariffs[index], ...updatedFields };
      this.saveTariffs(tariffs);
      return tariffs[index];
    }
    return null;
  },
  deleteTariff(id) {
    let tariffs = this.getTariffs();
    tariffs = tariffs.filter(t => t.id !== id);
    this.saveTariffs(tariffs);
  },

  // Foydalanuvchilar
  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },
  saveUsers(data) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data));
  },
  addUser(user) {
    const users = this.getUsers();
    user.id = 'usr-' + Date.now();
    users.push(user);
    this.saveUsers(users);
    return user;
  },

  // Jurnal amallari
  getLogs() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
  },
  saveLogs(data) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(data));
  },
  addLog(action, item, warehouse) {
    const logs = this.getLogs();
    const currentUser = Auth.getCurrentUser();
    const newLog = {
      id: 'log-' + Date.now(),
      action,
      item,
      warehouse,
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      user: currentUser ? currentUser.fullName : 'Administrator'
    };
    logs.unshift(newLog);
    if (logs.length > 25) logs.pop(); // Ko'p joy egallamasligi uchun
    this.saveLogs(logs);
  },

  // Boshlang'ich holatga qaytarish
  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.WAREHOUSES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.TARIFFS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    this.init();
  }
};

// Dastur yuklanganda xotirani initsializatsiya qilish
DataStore.init();
