#!/bin/bash
set -e

echo "🚀 [1/5] GitHub-dan oxirgi o'zgarishlarni yuklab olish..."
git pull origin master

echo "📦 [2/5] Yangi kutubxonalarni o'rnatish (npm install)..."
npm install

echo "🗄️ [3/5] Prisma klientini yangilash..."
npx prisma generate

echo "⚙️ [4/5] Next.js loyihasini yig'ish (build)..."
npm run build

echo "🔄 [5/5] PM2 xizmatini qayta ishga tushirish..."
pm2 restart all

echo "✅ Muvaffaqiyatli yangilandi va server to'liq ishga tushirildi!"
