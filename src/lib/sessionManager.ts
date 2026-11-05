// Global singleton active session manager for preventing concurrent logins
// and enforcing 20-minute inactivity timeout

export interface ActiveUserSession {
  userId: string;
  email: string;
  sessionId: string;
  lastActiveAt: number;
}

const INACTIVITY_TIMEOUT_MS = 20 * 60 * 1000; // 20 daqiqa

// Next.js hot-reload va turli route'lar orasida yagona xotirada saqlanishi uchun globalThis ishlatamiz
const globalSessionStore = (globalThis as any).__uzw_active_sessions as Map<string, ActiveUserSession> || new Map<string, ActiveUserSession>();
(globalThis as any).__uzw_active_sessions = globalSessionStore;

/**
 * Foydalanuvchi tizimga kira oladimi yoki ayni paytda boshqa odam kirib turibdimi tekshirish
 */
export function canUserLogin(userId: string, incomingSessionId?: string): {
  allowed: boolean;
  remainingMinutes?: number;
  reason?: string;
} {
  const existing = globalSessionStore.get(userId);
  if (!existing) {
    return { allowed: true };
  }

  const now = Date.now();
  const diff = now - existing.lastActiveAt;

  // Agar 20 daqiqadan ko'p vaqt o'tgan bo'lsa — sessiya muddati tugagan
  if (diff >= INACTIVITY_TIMEOUT_MS) {
    globalSessionStore.delete(userId);
    return { allowed: true };
  }

  // Agar aynan shu brauzerning o'zining sessiyasi bo'lsa — ruxsat beriladi
  if (incomingSessionId && incomingSessionId === existing.sessionId) {
    existing.lastActiveAt = now;
    return { allowed: true };
  }

  // Boshqa odam / boshqa qurilma kirmoqchi — QAT'IY TAQIQLANADI
  const remainingMinutes = Math.max(1, Math.ceil((INACTIVITY_TIMEOUT_MS - diff) / 60000));
  return {
    allowed: false,
    remainingMinutes,
    reason: `Ushbu foydalanuvchi hisobidan hozirda boshqa qurilma/shaxs tizimda ishlamoqda! Bitta hisob bilan bir vaqtda faqat bitta odam kirishi mumkin. Oldingi sessiya ${remainingMinutes} daqiqalik nofaollikdan so'ng tugaydi yoki oldingi qurilmadan "Chiqish" (Logout) tugmasi bosilishi shart.`
  };
}

/**
 * Yangi sessiyani ro'yxatga olish
 */
export function registerSession(userId: string, email: string, sessionId: string) {
  globalSessionStore.set(userId, {
    userId,
    email,
    sessionId,
    lastActiveAt: Date.now()
  });
}

/**
 * Foydalanuvchining so'nggi faollik vaqtini yangilash (Heartbeat / Activity Ping)
 */
export function touchSession(userId: string, sessionId?: string): boolean {
  const existing = globalSessionStore.get(userId);
  const now = Date.now();

  // Agar server restart bo'lib xotira tozalangan bo'lsa, lekin foydalanuvchida valid sessionId bo'lsa, qayta tiklaymiz
  if (!existing) {
    if (sessionId) {
      globalSessionStore.set(userId, {
        userId,
        email: '',
        sessionId,
        lastActiveAt: now
      });
      return true;
    }
    return false;
  }

  const diff = now - existing.lastActiveAt;

  if (diff >= INACTIVITY_TIMEOUT_MS) {
    globalSessionStore.delete(userId);
    return false;
  }

  if (sessionId && existing.sessionId !== sessionId) {
    // Boshqa qurilma yangi kirgan, demak bu eski qurilma nofaol
    return false;
  }

  existing.lastActiveAt = now;
  return true;
}

/**
 * Tizimdan chiqish (Logout) — boshqa qurilma darhol kira oladi
 */
export function destroySession(userId: string) {
  globalSessionStore.delete(userId);
}

/**
 * Sessiya holatini tekshirish
 */
export function isSessionActive(userId: string, sessionId: string): boolean {
  const existing = globalSessionStore.get(userId);
  if (!existing) return false;

  const diff = Date.now() - existing.lastActiveAt;
  if (diff >= INACTIVITY_TIMEOUT_MS) {
    globalSessionStore.delete(userId);
    return false;
  }

  return existing.sessionId === sessionId;
}
