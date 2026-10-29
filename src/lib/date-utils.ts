/**
 * O'zbekiston (Toshkent, UTC+5) vaqti bo'yicha YYYY-MM-DD va HH:MM qaytaruvchi yordamchi funksiyalar.
 * Tungi soat 00:00 dan 05:00 gacha toISOString() (UTC) kechagi sanani qaytarib yuborishining oldini oladi.
 */
export function getTashkentDateStr(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tashkent',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch {
    const offsetMs = 5 * 60 * 60 * 1000;
    return new Date(date.getTime() + offsetMs).toISOString().slice(0, 10);
  }
}

export function getTashkentTimeStr(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('uz-UZ', {
      timeZone: 'Asia/Tashkent',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch {
    return date.toTimeString().slice(0, 5);
  }
}

export function formatOfficialInvoiceNo(prefix: 'NAK-IN' | 'NAK-OUT', seqOrTimestamp?: number): string {
  const year = getTashkentDateStr().slice(0, 4);
  const stamp = (seqOrTimestamp || Date.now()).toString().slice(-6);
  return `${prefix}-${year}-${stamp}`;
}

