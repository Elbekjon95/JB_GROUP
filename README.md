# JB GROUP - Bojxona va Omborxona Logistika Majmuasi
### (React Next.js 15 + Prisma + PostgreSQL + RBAC Rollar Boshqaruvi)

**JB GROUP** — bu bojxona ombori, yuklarni yuklash-tushirish, saqlash tariflari, qo'shimcha bojxona xizmatlari va ko'p darajali xodimlar (Super Admin, Admin, User/Omborchi) tizimini o'z ichiga olgan zamonaviy korporativ logistika platformasi.

---

## 👥 Foydalanuvchilar Rollari va Huquqlari

### 1. 👑 Super Admin (`SUPER_ADMIN`):
- **Yagona boshqaruvchi:** Tizimda faqat **1 ta** Super Admin bo'ladi (uni o'chirish yoki rolini o'zgartirish taqiqlangan).
- **Foydalanuvchilar boshqaruvi:** Yangi foydalanuvchilar qo'shish, istalgan userni `Admin` yoki `User` roliga o'zgartirish, tizimdan o'chirish, ruxsatlar berish.
- **Omborlar:** Yangi omborlar va sektorlar yaratish, tahrirlash va o'chirish.
- **Tariflar:** Yangi saqlash va bojxona tariflarini kiritish, tahrirlash va o'chirish.
- **Mahsulotlar:** Yangi mahsulot turlarini qo'shish, tahrirlash, o'chirish, tovarlarni kirim va chiqim qilish.

### 2. 🛡️ Admin (`ADMIN`):
- **Mahsulotlar:** Ombordagi yangi mahsulot turlarini katalogga qo'shish va tahrirlash.
- **Tariflar:** Mavjud saqlash tariflari narxi va shartlarini tahrirlash.
- **Tovar amallari:** Mahsulotlarni kirim qilish (+ Kirim) va ombordan chiqarish (- Chiqim).
- *(Foydalanuvchilarni boshqara olmaydi, yangi ombor yoki yangi tarif yarata olmaydi).*

### 3. 💼 Buxgalter (`ACCOUNTANT`):
- **Buxgalteriya & Chiqimlar hisoboti:** Ombordan chiqarilgan barcha tovarlar tarixi, kunlik va oylik chiqimlar statistikasi.
- **Kim qancha chiqim qildi:** Mas'ul omborchilar va xodimlar kesimida chiqim hajmi va summalari tahlili.
- **Qancha to'lashi kerak:** Har bir mijoz va to'lovchi korxona bo'yicha hisoblangan to'lovlar (saqlash, yuklash/tushirish, QQS 12%), to'langan summalar va qarzdorliklar.
- **Rasmiy invoyslar va chop etish:** Har bir chiqim bo'yicha bojxona dalolatnomasi va hisob-fakturasini ko'rish hamda chop etish, to'lov holatini («To'langan» / «Kutilmoqda») o'zgartirish, hisobotni Excel (CSV) ga yuklab olish.
- *(Ombordagi tovarlarni o'zi kirim/chiqim qilmaydi, faqat moliyaviy va hisobdorlik tahlili bilan ishlaydi).*

### 4. 📦 Oddiy Foydalanuvchi / Omborchi (`USER`):
- **Faqat tovar kirim va chiqimi:** Ombordagi mavjud mahsulotlarni qabul qilish (**+ Kirim**) va chiqarish (**- Chiqim**).
- Yangi mahsulot turi qo'shish huquqi **yo'q**.
- Saqlash tariflarini qo'shish yoki tahrirlash huquqi **yo'q**.
- Ombor va foydalanuvchilarni boshqara olmaydi.

---

## 🔑 Sinov Uchun Rollar va Kirish Ma'lumotlari

Barcha hisoblar uchun parol bir xil: `password123`

| Rol | Elektron Pochta | Parol | Asosiy Vazifasi |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@jbgroup.uz` | `password123` | To'liq nazorat, userlar va omborlar boshqaruvi |
| **Admin** | `admin@jbgroup.uz` | `password123` | Mahsulot qo'shish va tariflarni tahrirlash |
| **Buxgalter** | `buxgalter@jbgroup.uz` | `password123` | Chiqimlar hisoboti, to'lovlar, qarzdorlik, hisob-fakturalar |
| **User (Omborchi)** | `user@jbgroup.uz` | `password123` | Faqat tovarlarni omborga kirim/chiqim qilish |

*(Tizimda `superadmin@uzw.uz` kabi eski pochta nomlari bilan ham kirish mumkin, kirish oynasida bir bosishda to'ldirish tugmalari mavjud).*

---

## 🚀 Ishga Tushirish

Server `http://localhost:3000` manzilida ishlamoqda:
```bash
npm run dev
```

Agar bazani qayta to'ldirish kerak bo'lsa:
```bash
npm run prisma:seed
```
