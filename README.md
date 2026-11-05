# JB GROUP - Bojxona va Omborxona Logistika Majmuasi
### (React Next.js 15 + Prisma + PostgreSQL + RBAC Rollar Boshqaruvi)

**JB GROUP** — bu bojxona ombori, yuklarni yuklash-tushirish, saqlash tariflari, qo'shimcha bojxona xizmatlari va ko'p darajali xodimlar (Super Admin, Admin, Buxgalter, Omborchi) tizimini o'z ichiga olgan zamonaviy korporativ logistika platformasi.

---

## 🔑 TIZIMGA KIRISH MA'LUMOTLARI (LOGIN & PAROLLAR)

Dasturga kirish uchun barcha asosiy rollarning login va parollari quyidagicha belgilangan:

### 🌐 Veb-Dasturga Kirish (Web App Accounts)

> [!IMPORTANT]
> **Asosiy tizim paroli barcha jbgroup.uz foydalanuvchilari uchun:** `password123`

| № | Lavozim / Rol | Elektron Pochta (Login) | Parol | Asosiy Vakolati |
| :-: | :--- | :--- | :--- | :--- |
| **1** | 👑 **Super Admin** | `superadmin@jbgroup.uz` | `password123` | **To'liq nazorat:** xodimlar, omborlar, tariflar va barcha amallar |
| **2** | 🛡️ **Katta Admin** | `admin@jbgroup.uz` | `password123` | Mahsulotlar qo'shish, saqlash tariflarini tahrirlash, kirim/chiqim |
| **3** | 💼 **Bosh Buxgalter** | `buxgalter@jbgroup.uz` | `password123` | Chiqimlar hisoboti, to'lovlar, qarzdorliklar, invoyslar va dalolatnomalar |
| **4** | 📦 **Katta Omborchi** | `user@jbgroup.uz` | `password123` | Tovarlarni omborga qabul qilish (**+ Kirim**) va chiqarish (**- Chiqim**) |
| **5** | 🚚 **Omborchi / Operator** | `omborchi@jbgroup.uz` | `password123` | Omborda tovarlarni joylashtirish va harakatlantirish |

*(Tizimda avvalgi `superadmin@uzw.uz`, `admin@uzw.uz`, `buxgalter@uzw.uz`, `user@uzw.uz` hisoblari ham mavjud bo'lib, ularning paroli: `admin123`).*

---

## 🗄️ MA'LUMOTLAR BAZASI ULANISHI (POSTGRESQL DATABASE)

Ma'lumotlar bazasi PostgreSQL da ishlaydi va uning ulanish parametrlari `.env` faylida saqlanadi:

```env
# PostgreSQL ulanish manzili (DATABASE_URL):
DATABASE_URL="postgresql://postgres:root@localhost:5432/uzw_db?schema=public"

# Alohida parametrlar:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=uzw_db
```

> [!NOTE]
> - Foydalanuvchilar PostgreSQL dagi `User` jadvalida saqlanadi.
> - Xavfsizlik talablariga muvofiq, foydalanuvchi parollari ma'lumotlar bazasida ochiq matn holda emas, balki **`bcrypt` (10-round salt)** xeshi ko'rinishida saqlanadi (`password123` -> `$2a$10$...`).
> - Agar `prisma/seed.ts` ishga tushirilsa, u mavjud foydalanuvchilarni o'chirmaydi, yo'q bo'lgan holatda esa yuqoridagi 4 ta asosiy rolni `password123` paroli bilan bazaga xavfsiz kiritadi.

---

## 👥 Foydalanuvchilar Rollari va Huquqlari (RBAC)

### 1. 👑 Super Admin (`SUPER_ADMIN`):
- **Yagona boshqaruvchi:** Tizimda bosh rahbarlik huquqiga ega yagona boshqaruvchi.
- **Foydalanuvchilar boshqaruvi:** Yangi xodimlar qo'shish, ularga individual rollar va sektorlar ruxsatini berish, xodimlarni tahrirlash yoki o'chirish.
- **Omborlar va Sektorlar:** Yangi omborlar yaratish, sektorlar sig'imi va harorat rejimini sozlash.
- **Tariflar va Preyskurant:** Bojxona xizmatlari va kunlik saqlash tariflarini kiritish, narxlarini o'zgartirish.
- **Tovar amallari:** Barcha sektorlardagi tovarlarni boshqarish, tahrirlash, o'chirish, kirim va chiqim qilish.

### 2. 🛡️ Admin (`ADMIN`):
- **Mahsulotlar:** Ombordagi yangi mahsulot turlarini katalogga qo'shish va tahrirlash.
- **Tariflar:** Mavjud saqlash tariflari narxi va shartlarini ko'rish hamda tahrirlash.
- **Tovar amallari:** Mahsulotlarni kirim qilish (**+ Kirim**) va ombordan chiqarish (**- Chiqim**).
- *(Foydalanuvchilarni boshqara olmaydi, yangi ombor yoki yangi tarif yarata olmaydi).*

### 3. 💼 Buxgalter (`ACCOUNTANT`):
- **Buxgalteriya & Chiqimlar hisoboti:** Ombordan chiqarilgan barcha tovarlar tarixi, kunlik va oylik chiqimlar statistikasi.
- **Kim qancha chiqim qildi:** Mas'ul omborchilar va xodimlar kesimida chiqim hajmi va summalari tahlili.
- **Qancha to'lashi kerak:** Har bir mijoz va to'lovchi korxona bo'yicha hisoblangan to'lovlar (saqlash, yuklash/tushirish, QQS 12%), to'langan summalar va qarzdorliklar.
- **Rasmiy invoyslar va chop etish:** Har bir chiqim bo'yicha bojxona dalolatnomasi va hisob-fakturasini ko'rish hamda chop etish, to'lov holatini («To'langan» / «Kutilmoqda») o'zgartirish, hisobotni Excel (.xlsx) ga yuklab olish.
- *(Ombordagi tovarlarni o'zi kirim/chiqim qilmaydi, faqat moliyaviy va hisobdorlik tahlili bilan ishlaydi).*

### 4. 📦 Oddiy Foydalanuvchi / Omborchi (`USER`):
- **Faqat tovar kirim va chiqimi:** Biriktirilgan ombor sektorlaridagi mahsulotlarni qabul qilish (**+ Kirim**) va chiqarish (**- Chiqim**).
- Yangi mahsulot turi qo'shish yoki o'chirish huquqi **yo'q**.
- Saqlash tariflarini qo'shish yoki tahrirlash huquqi **yo'q**.
- Buxgalteriya va moliyaviy summalarni ko'rish ruxsati berilmagan.

---

## 🚀 Ishga Tushirish va Baza Buyruqlari

### Mahalliy kompyuterda (Local):
```bash
# Kutubxonalarni o'rnatish
npm install

# Dasturni ishlab chiqish rejimida ishga tushirish (http://localhost:3000)
npm run dev

# Agar ma'lumotlar bazasini yangilash kerak bo'lsa:
npm run prisma:seed
```

### Serverda (AWS EC2 / Production):
```bash
cd ~/JB_GROUP
git pull origin master
npm run build
pm2 restart all
```
