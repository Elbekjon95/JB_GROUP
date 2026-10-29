import React from 'react';
import { Language } from '@/lib/types';
import { t } from '@/lib/i18n';

interface LoginOverlayProps {
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  lang?: Language;
  setLang?: (lang: Language) => void;
  needsInitialSetup?: boolean;
  setupFullName?: string;
  setSetupFullName?: (name: string) => void;
  setupConfirmPassword?: string;
  setSetupConfirmPassword?: (password: string) => void;
  onSetupSubmit?: (e: React.FormEvent) => void;
}

export const LoginOverlay: React.FC<LoginOverlayProps> = ({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  onSubmit,
  loading = false,
  lang = 'uz',
  setLang,
  needsInitialSetup = false,
  setupFullName = '',
  setSetupFullName,
  setupConfirmPassword = '',
  setSetupConfirmPassword,
  onSetupSubmit
}) => {
  const labels = {
    uz: {
      setupBadge: '👑 BIR MARTALIK DASTLABKI RO\'YXATDAN O\'TISH',
      setupTitle: 'Bosh Rahbar (Super Admin) Yaratish',
      setupDesc: 'Tizimda hali birorta ham foydalanuvchi yo\'q. Birinchi foydalanuvchi sifatida Super Admin hisobini yarating. Shundan so\'ng ro\'yxatdan o\'tish butunlay yopiladi.',
      fullNameLabel: 'ISM-SHARIFINGIZ (BOSH RAHBAR) *',
      fullNamePlaceholder: 'Masalan: Alisher Qodirov',
      confirmPassLabel: 'PAROLNI TASDIQLANG *',
      confirmPassPlaceholder: 'Parolni qayta kiriting',
      setupBtn: '👑 Super Admin Sifatida Ro\'yxatdan O\'tish',
      settingUp: 'Yaratilmoqda...'
    },
    ru: {
      setupBadge: '👑 ЕДИНОРАЗОВАЯ ПЕРВИЧНАЯ РЕГИСТРАЦИЯ',
      setupTitle: 'Регистрация Генерального Директора (Супер-Админ)',
      setupDesc: 'В системе еще нет ни одного пользователя. Зарегистрируйте первого пользователя как Супер-Админа. После этого регистрация навсегда закрывается.',
      fullNameLabel: 'ВАШЕ Ф.И.О. (РУКОВОДИТЕЛЬ) *',
      fullNamePlaceholder: 'Например: Алишер Кадыров',
      confirmPassLabel: 'ПОДТВЕРДИТЕ ПАРОЛЬ *',
      confirmPassPlaceholder: 'Введите пароль повторно',
      setupBtn: '👑 Зарегистрироваться как Супер-Админ',
      settingUp: 'Создание...'
    },
    en: {
      setupBadge: '👑 ONE-TIME INITIAL REGISTRATION',
      setupTitle: 'Register General Director (Super Admin)',
      setupDesc: 'No users exist in the system yet. Register the very first account as Super Admin. Public registration will be permanently disabled afterwards.',
      fullNameLabel: 'YOUR FULL NAME (DIRECTOR) *',
      fullNamePlaceholder: 'E.g.: Alisher Qodirov',
      confirmPassLabel: 'CONFIRM PASSWORD *',
      confirmPassPlaceholder: 'Re-enter your password',
      setupBtn: '👑 Register as Super Admin',
      settingUp: 'Creating account...'
    }
  }[lang];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)', padding: '24px' }}>
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px', maxWidth: '460px', width: '100%', boxShadow: '0 20px 35px -10px rgba(15, 43, 72, 0.15)' }}>
        {/* Til tanlash (O'zbek / Русский / English) */}
        {setLang && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #cbd5e1', gap: '2px' }}>
              {([
                { code: 'uz', label: "🇺🇿 O'zbek" },
                { code: 'ru', label: '🇷🇺 Русский' },
                { code: 'en', label: '🇬🇧 English' }
              ] as { code: Language; label: string }[]).map((item) => {
                const active = lang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLang(item.code)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      background: active ? '#002d62' : 'transparent',
                      color: active ? '#ffffff' : '#475569',
                      transition: 'all 0.15s'
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <img
              src="/jb-logo.jpg"
              alt="JB GROUP"
              style={{ width: '130px', height: 'auto', maxHeight: '90px', objectFit: 'contain' }}
            />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0f2b48', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            {t(lang, 'appTitle')}
          </h1>
          <p style={{ fontSize: '12px', color: '#0070ba', fontWeight: 800, margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t(lang, 'appSubtitle')}
          </p>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            {t(lang, 'appDesc')}
          </p>
        </div>

        {needsInitialSetup && onSetupSubmit ? (
          <>
            <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '12px', padding: '12px 14px', marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#1d4ed8', marginBottom: '4px', letterSpacing: '0.02em' }}>
                {labels.setupBadge}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f2b48', marginBottom: '4px' }}>
                {labels.setupTitle}
              </div>
              <div style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.45 }}>
                {labels.setupDesc}
              </div>
            </div>

            <form onSubmit={onSetupSubmit} autoComplete="off">
              <div className="form-field">
                <label className="form-label">{labels.fullNameLabel}</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  name="uzw_setup_fullname"
                  className="form-input-clean"
                  placeholder={labels.fullNamePlaceholder}
                  value={setupFullName}
                  onChange={e => setSetupFullName?.(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">{t(lang, 'emailLabel')} *</label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  name="uzw_setup_email"
                  className="form-input-clean"
                  placeholder={t(lang, 'emailPlaceholder')}
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">{t(lang, 'passwordLabel')} *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  name="uzw_setup_password"
                  className="form-input-clean"
                  placeholder={t(lang, 'passwordPlaceholder')}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                />
              </div>

              <div className="form-field" style={{ marginBottom: '22px' }}>
                <label className="form-label">{labels.confirmPassLabel}</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  name="uzw_setup_confirm_password"
                  className="form-input-clean"
                  placeholder={labels.confirmPassPlaceholder}
                  value={setupConfirmPassword}
                  onChange={e => setSetupConfirmPassword?.(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? labels.settingUp : labels.setupBtn}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="form-field">
              <label className="form-label">{t(lang, 'emailLabel')}</label>
              <input
                type="email"
                required
                autoComplete="off"
                name="uzw_login_email"
                className="form-input-clean"
                placeholder={t(lang, 'emailPlaceholder')}
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="form-field" style={{ marginBottom: '22px' }}>
              <label className="form-label">{t(lang, 'passwordLabel')}</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                name="uzw_login_password"
                className="form-input-clean"
                placeholder={t(lang, 'passwordPlaceholder')}
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 800,
                background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? t(lang, 'loggingIn') : t(lang, 'loginBtn')}
            </button>
          </form>
        )}

        <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block', lineHeight: 1.5 }}>
            {t(lang, 'loginSecNote')}
          </span>
        </div>
      </div>
    </div>
  );
};
