/**
 * Bojxona ombori xizmat nomlarini Kirim (Tushirish) va Chiqim (Ortish) kontekstiga moslash.
 * 
 * Foydalanuvchi talabi:
 * - Yuk omborga kirim qilinayotganda (tushirilayotganda): "Погрузка/разгрузка" so'zi bo'lmasligi kerak,
 *   barcha joyda faqat "Разгрузка" (o'zbekchada "Yuk tushirish" / "Tushirish") bo'lishi kerak.
 * - Yuk ombordan chiqarilayotganda (ortilayotganda): faqat "Погрузка" (o'zbekchada "Yuk ortish" / "Ortish")
 *   so'zi ishlatilishi kerak.
 */

/**
 * Tushirish (Kirim) konteksti uchun xizmat nomini tozalash
 */
export function formatUnloadingServiceName(name?: string | null, lang: 'uz' | 'ru' | 'en' = 'uz'): string {
  if (!name) return '';
  let str = name.trim();

  // 1. Ruscha birikmalarni almashtirish:
  str = str.replace(/погрузка\s*(?:\/|или|va|and|\+)\s*разгрузка/gi, 'разгрузка');
  str = str.replace(/разгрузка\s*(?:\/|или|va|and|\+)\s*погрузка/gi, 'разгрузка');
  str = str.replace(/погрузка\/разгрузка/gi, 'разгрузка');
  str = str.replace(/разгрузка\/погрузка/gi, 'разгрузка');
  str = str.replace(/погрузка\s*-\s*разгрузка/gi, 'разгрузка');
  str = str.replace(/разгрузка\s*-\s*погрузка/gi, 'разгрузка');
  str = str.replace(/погрузка\s+и\s+разгрузка/gi, 'разгрузка');
  str = str.replace(/разгрузка\s+и\s+погрузка/gi, 'разгрузка');

  // 2. O'zbekcha birikmalarni almashtirish:
  str = str.replace(/ortish\s*(?:\/|va|yoki|-|\+)\s*tushirish/gi, 'tushirish');
  str = str.replace(/tushirish\s*(?:\/|va|yoki|-|\+)\s*ortish/gi, 'tushirish');
  str = str.replace(/yuklash\s*(?:\/|va|yoki|-|\+)\s*tushirish/gi, 'tushirish');
  str = str.replace(/tushirish\s*(?:\/|va|yoki|-|\+)\s*yuklash/gi, 'tushirish');
  str = str.replace(/ortish\/tushirish/gi, 'tushirish');
  str = str.replace(/tushirish\/ortish/gi, 'tushirish');
  str = str.replace(/yuklash\/tushirish/gi, 'tushirish');
  str = str.replace(/ortish-tushirish/gi, 'tushirish');

  // 3. Agar faqat "погрузка" so'zi bo'lsa (lekin kirimda tushirilayotgan bo'lsa):
  if (/^погрузка\b/i.test(str) && !/разгрузка/i.test(str)) {
    str = str.replace(/^погрузка\b/i, 'Разгрузка');
  }
  if (/\bпогрузки\b/i.test(str) && !/разгруз/i.test(str)) {
    str = str.replace(/\bпогрузки\b/gi, 'разгрузки');
  }
  if (/\bпогрузк[аеу]\b/i.test(str) && !/разгруз/i.test(str)) {
    str = str.replace(/\bпогрузк([аеу])\b/gi, 'разгрузк$1');
  }

  // O'zbekcha: agar faqat "ortish" yoki "yuklash" bo'lsa
  if (/^ortish\b/i.test(str) && !/tushirish/i.test(str)) {
    str = str.replace(/^ortish\b/i, 'Tushirish');
  }
  if (/\bortish\b/i.test(str) && !/tushirish/i.test(str)) {
    str = str.replace(/\bortish\b/gi, 'tushirish');
  }

  // 4. Agar umumiy vagon yoki konteyner bo'lib (na погрузка na разгрузка so'zi bo'lmasa):
  const isVagonOrKont = /(?:ж\/д|вагон|контейнер)/i.test(str);
  if (isVagonOrKont && !/разгруз/i.test(str) && !/tushir/i.test(str)) {
    if (lang === 'ru' || /[а-яё]/i.test(str)) {
      str = `Разгрузка: ${str}`;
    } else {
      str = `${str} tushirish`;
    }
  }

  // 5. Bosh harf va qavslarni chiroyli qilish
  str = str.replace(/^разгрузка/i, 'Разгрузка');
  str = str.replace(/^tushirish/i, 'Tushirish');
  str = str.replace(/\(разгрузка\)/gi, '(разгрузка)');

  return str;
}

/**
 * Ortish (Chiqim) konteksti uchun xizmat nomini tozalash
 */
export function formatLoadingServiceName(name?: string | null, lang: 'uz' | 'ru' | 'en' = 'uz'): string {
  if (!name) return '';
  let str = name.trim();

  // 1. Ruscha birikmalarni almashtirish:
  str = str.replace(/погрузка\s*(?:\/|или|va|and|\+)\s*разгрузка/gi, 'погрузка');
  str = str.replace(/разгрузка\s*(?:\/|или|va|and|\+)\s*погрузка/gi, 'погрузка');
  str = str.replace(/погрузка\/разгрузка/gi, 'погрузка');
  str = str.replace(/разгрузка\/погрузка/gi, 'погрузка');
  str = str.replace(/погрузка\s*-\s*разгрузка/gi, 'погрузка');
  str = str.replace(/разгрузка\s*-\s*погрузка/gi, 'погрузка');
  str = str.replace(/погрузка\s+и\s+разгрузка/gi, 'погрузка');
  str = str.replace(/разгрузка\s+и\s+погрузка/gi, 'погрузка');

  // 2. O'zbekcha birikmalarni almashtirish:
  str = str.replace(/ortish\s*(?:\/|va|yoki|-|\+)\s*tushirish/gi, 'ortish');
  str = str.replace(/tushirish\s*(?:\/|va|yoki|-|\+)\s*ortish/gi, 'ortish');
  str = str.replace(/yuklash\s*(?:\/|va|yoki|-|\+)\s*tushirish/gi, 'ortish');
  str = str.replace(/tushirish\s*(?:\/|va|yoki|-|\+)\s*yuklash/gi, 'ortish');
  str = str.replace(/ortish\/tushirish/gi, 'ortish');
  str = str.replace(/tushirish\/ortish/gi, 'ortish');
  str = str.replace(/yuklash\/tushirish/gi, 'ortish');
  str = str.replace(/ortish-tushirish/gi, 'ortish');

  // 3. Agar faqat "разгрузка" so'zi bo'lsa (lekin chiqimda ortilayotgan bo'lsa):
  if (/^разгрузка\b/i.test(str) && !/погрузка/i.test(str)) {
    str = str.replace(/^разгрузка\b/i, 'Погрузка');
  }
  if (/\bразгрузки\b/i.test(str) && !/погруз/i.test(str)) {
    str = str.replace(/\bразгрузки\b/gi, 'погрузки');
  }
  if (/\bразгрузк[аеу]\b/i.test(str) && !/погруз/i.test(str)) {
    str = str.replace(/\bразгрузк([аеу])\b/gi, 'погрузк$1');
  }

  // O'zbekcha: agar faqat "tushirish" bo'lsa
  if (/^tushirish\b/i.test(str) && !/ortish/i.test(str)) {
    str = str.replace(/^tushirish\b/i, 'Ortish');
  }
  if (/\btushirish\b/i.test(str) && !/ortish/i.test(str)) {
    str = str.replace(/\btushirish\b/gi, 'ortish');
  }

  // 4. Agar umumiy vagon yoki konteyner bo'lib (na погрузка na разгрузка so'zi bo'lmasa):
  const isVagonOrKont = /(?:ж\/д|вагон|контейнер)/i.test(str);
  if (isVagonOrKont && !/погруз/i.test(str) && !/ort/i.test(str)) {
    if (lang === 'ru' || /[а-яё]/i.test(str)) {
      str = `Погрузка: ${str}`;
    } else {
      str = `${str} ortish`;
    }
  }

  // 5. Bosh harf va qavslarni chiroyli qilish
  str = str.replace(/^погрузка/i, 'Погрузка');
  str = str.replace(/^ortish/i, 'Ortish');
  str = str.replace(/\(погрузка\)/gi, '(погрузка)');

  return str;
}
