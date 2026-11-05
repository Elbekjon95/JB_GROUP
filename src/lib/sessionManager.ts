// Global singleton active session manager for preventing concurrent logins
// and ensuring real-time presence detection

export interface ActiveUserSession {
  userId: string;
  email: string;
  sessionId: string;
  lastActiveAt: number;
}

// Brauzer har 15 soniyada faollik (heartbeat) yuboradi.
// Agar 45 soniya davomida xabar kelmasa — demak foydalanuvchi brauzerni yopgan va saytda yo'q!
const PRESENCE_HEARTBEAT_TIMEOUT_MS = 45 * 1000; // 45 soniya

// Next.js hot-reload va turli route'lar orasida yagona xotirada saqlanishi uchun globalThis ishlatamiz
const globalSessionStore = (globalThis as any).__uzw_active_sessions as Map<string, ActiveUserSession> || new Map<string, ActiveUserSession>();
(globalThis as any).__uzw_active_sessions = globalSessionStore;

/**
 * Foydalanuvchi tizimga kira oladimi yoki ayni paytda rostdan ham boshqa odam kirib turibdimi tekshirish
 */
export function canUserLogin(userId: string, incomingSessionId?: string): {
  allowed: boolean;
  remainingSeconds?: number;
  reason?: string;
} {
  const existing = globalSessionStore.get(userId);
  if (!existing) {
    return { allowed: true };
  }

  const now = Date.now();
  const diff = now - existing.lastActiveAt;

  // Agar 45 soniyadan oshgan bo'lsa — oldingi foydalanuvchi brauzerni yopgan, demak saytda yo'q!
  if (diff >= PRESENCE_HEARTBEAT_TIMEOUT_MS) {
    globalSessionStore.delete(userId);
    return { allowed: true };
  }

  // Agar aynan shu brauzerning o'zining sessiyasi bo'lsa — ruxsat beriladi
  if (incomingSessionId && incomingSessionId === existing.sessionId) {
    existing.lastActiveAt = now;
    return { allowed: true };
  }

  // Ayni paytda boshqa qurilma REAL VAQTDA onlayn turibdi
  const remainingSeconds = Math.max(5, Math.ceil((PRESENCE_HEARTBEAT_TIMEOUT_MS - diff) / 1000));
  return {
    allowed: false,
    remainingSeconds,
    reason: `Ushbu hisobdan ayni paytda boshqa qurilmada foydalanilmoqda! Xavfsizlik qoidasiga ko'ra bir vaqtda ikkita odam bitta login bilan ishlay olmaydi. Oldingi qurilmadan "Chiqish" (Logout) tugmasini bosing yoki oldingi oyna yopilgan bo'lsa ${remainingSeconds} soniyadan keyin qayta urinib ko'ring.`
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

  if (diff >= PRESENCE_HEARTBEAT_TIMEOUT_MS) {
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
 * Tizimdan chiqish (Logout) — sessiya darhol o'chiriladi
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
  if (diff >= PRESENCE_HEARTBEAT_TIMEOUT_MS) {
    globalSessionStore.delete(userId);
    return false;
  }

  return existing.sessionId === sessionId;
}
