# UZW - Zamonaviy Omborxona va Zaxira Boshqaruvi Tizimi

**UZW** — bu omborlar, saqlanayotgan mahsulotlar va saqlash tariflarini boshqarish uchun mo'ljallangan, minimalist oq va ko'k ranglar uslubidagi boshqaruv platformasi.

---

## 🌟 Asosiy Xususiyatlar va Imkoniyatlar

1. **Mahsulotlarni kiritish va boshqarish**:
   - Mahsulot nomi, artikul (SKU), toifasi, o'lchov birligi (dona, kg, tonna, pallet, qop, quti, m³);
   - Mahsulotni ma'lum bir omborga biriktirish;
   - Saqlash qoldig'i monitoringi (kam qolgan tovarlar haqida vizual ogohlantirish);
   - Tahrirlash, qidirish va o'chirish imkoniyati.

2. **Saqlash tariflarini kiritish va hisoblash**:
   - Mahsulotlarni omborda saqlash narxlarini belgilash (kunlik yoki oylik);
   - Saqlash o'lchov mezonlari (pallet, dona, m³, kg boshiga);
   - Har bir tovar kiritilayotganda unga mos tarifni biriktirish;
   - **Interaktiv saqlash kalkulyatori**: tovar miqdori va muddati kiritilganda umumiy saqlash qiymatini avtomatik hisoblash.

3. **Yangi omborlar yaratish**:
   - Ombor nomi, geografik joylashuvi/manzili;
   - Ombor turi (Standart quruq, Muzlatkichli, Sovutiladigan, Ochiq maydon, Farmatsevtika);
   - Umumiy sig'im (m³) va bandlik foizini ko'rsatuvchi progress-bar;
   - Mas'ul xodim (menejer) va telefon raqami.

4. **Avtorizatsiya va xavfsizlik**:
   - Kirish (Login) va yangi hisob yaratish (Ro'yxatdan o'tish);
   - Brauzerda xavfsiz sessiya saqlash (`localStorage`);
   - Test qilish uchun qulay bir bosishli demo hisob.

5. **Dizayn va Minimalizm**:
   - Toza oq (`#ffffff`, `#f8fafc`) va ko'k (`#1d4ed8`, `#2563eb`, `#eff6ff`) ranglar palitrasi;
   - Yuqori sifatli 'Plus Jakarta Sans' shrifti va SVG piktogrammalar;
   - Barcha ekran o'lchamlari (kompyuter, planshet va smartfonlar) uchun moslashuvchan (Responsive) interfeys.

---

## 🚀 Ishga Tushirish Qo'llanmasi

Loyiha hech qanday murakkab kutubxonalarga bog'liq bo'lmagan holda toza HTML5, CSS3 va JavaScript (ES6) asosida qurilgan.

### 1-usul: Brauzerda to'g'ridan-to'g'ri ochish
Loyihadagi `index.html` faylini istalgan zamonaviy veb-brauzerda (Chrome, Edge, Firefox, Safari) ikki marta bosib ochishingiz mumkin.

### 2-usul: Mahalliy server orqali ishga tushirish (tavsiya etiladi)
Terminal yoki buyruqlar satrida quyidagi buyruqni bering:
```bash
python -m http.server 8080
```
So'ngra brauzeringizda quyidagi manzilga kiring:
```
http://localhost:8080
```

---

## 🔑 Demo Kirish Ma'lumotlari

Tizimga kirish uchun quyidagi tayyor hisobdan foydalanishingiz mumkin:
- **Elektron pochta:** `admin@uzw.uz`
- **Maxfiy parol:** `password123`

*(Shuningdek, kirish sahifasidagi "Ro'yxatdan o'tish" bo'limi orqali o'zingizning yangi hisobingizni ochishingiz ham mumkin).*

---

## 📁 Loyiha Tuzilishi

```
UZW/
├── index.html         # Asosiy sahifa (Semantik HTML5, modallar va bo'limlar)
├── css/
│   └── style.css      # Oq va ko'k ranglar asosidagi minimalist CSS dizayn
├── js/
│   ├── data.js        # Ma'lumotlar bazasi va localStorage sinxronizatsiyasi
│   ├── auth.js        # Avtorizatsiya va sessiya boshqaruvi
│   └── app.js         # Dinamik amallar, omborlar, mahsulotlar va kalkulyator
└── README.md          # Loyiha hujjatlari va qo'llanma
```
