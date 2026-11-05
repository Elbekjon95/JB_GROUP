#!/bin/bash
set -e

echo "🚀 [1/4] GitHub-dan oxirgi o'zgarishlarni yuklab olish..."
git pull origin master

echo "📦 [2/4] Prisma klientini tekshirish..."
npx prisma generate

echo "⚙️ [3/4] Next.js loyihasini yig'ish (build)..."
npm run build

echo "🔄 [4/4] PM2 xizmatini qayta ishga tushirish..."
pm2 restart all

echo "✅ Muvaffaqiyatli yangilandi va server ishga tushirildi!"
