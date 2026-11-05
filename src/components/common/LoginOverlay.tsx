'use client';

import React, { useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)', padding: '24px', boxSizing: 'border-box' }}>
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '36px 32px', maxWidth: '450px', width: '100%', boxShadow: '0 20px 40px -10px rgba(15, 43, 72, 0.15)', boxSizing: 'border-box' }}>
        
        {/* Til tanlash (O'zbek / Русский / English) */}
        {setLang && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px', border: '1px solid #cbd5e1', gap: '3px' }}>
              {([
                { code: 'uz', label: "uz O'zbek" },
                { code: 'ru', label: 'ru Русский' },
                { code: 'en', label: 'gb English' }
              ] as { code: Language; label: string }[]).map((item) => {
                const active = lang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLang(item.code)}
                    style={{
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 800,
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      background: active ? '#002d62' : 'transparent',
                      color: active ? '#ffffff' : '#475569',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Logo & Sarlavha */}
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <img
              src="/jb-logo.jpg"
              alt="JB GROUP"
              style={{ width: '135px', height: 'auto', maxHeight: '90px', objectFit: 'contain' }}
            />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0f2b48', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            {t(lang, 'appTitle')}
          </h1>
          <p style={{ fontSize: '11.5px', color: '#0070ba', fontWeight: 800, margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t(lang, 'appSubtitle')}
          </p>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            {t(lang, 'appDesc')}
          </p>
        </div>

        {/* 1. Dastlabki Setup (Agar Super Admin bo'lmasa) */}
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

            <form onSubmit={onSetupSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '16px' }}>
                <label style={{ display: 'block', width: '100%', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {labels.fullNameLabel}
                </label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8', pointerEvents: 'none' }}>
                    👤
                  </span>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    name="uzw_setup_fullname"
                    placeholder={labels.fullNamePlaceholder}
                    value={setupFullName}
                    onChange={e => setSetupFullName?.(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      display: 'block',
                      height: '44px',
                      padding: '10px 14px 10px 42px',
                      fontSize: '14px',
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '10px',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '16px' }}>
                <label style={{ display: 'block', width: '100%', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {t(lang, 'emailLabel')} *
                </label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8', pointerEvents: 'none' }}>
                    📧
                  </span>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    name="uzw_setup_email"
                    placeholder={t(lang, 'emailPlaceholder')}
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      display: 'block',
                      height: '44px',
                      padding: '10px 14px 10px 42px',
                      fontSize: '14px',
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '10px',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '16px' }}>
                <label style={{ display: 'block', width: '100%', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {t(lang, 'passwordLabel')} *
                </label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8', pointerEvents: 'none' }}>
                    🔒
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    name="uzw_setup_password"
                    placeholder={t(lang, 'passwordPlaceholder')}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      display: 'block',
                      height: '44px',
                      padding: '10px 42px 10px 42px',
                      fontSize: '14px',
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '10px',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px'
                    }}
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '22px' }}>
                <label style={{ display: 'block', width: '100%', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {labels.confirmPassLabel}
                </label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8', pointerEvents: 'none' }}>
                    🔒
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    name="uzw_setup_confirm_password"
                    placeholder={labels.confirmPassPlaceholder}
                    value={setupConfirmPassword}
                    onChange={e => setSetupConfirmPassword?.(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      display: 'block',
                      height: '44px',
                      padding: '10px 42px 10px 42px',
                      fontSize: '14px',
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '10px',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px'
                    }}
                  >
                    {showConfirmPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px 20px',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#ffffff',
                  background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 45, 98, 0.25)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? labels.settingUp : labels.setupBtn}
              </button>
            </form>
          </>
        ) : (
          /* 2. Standart Login Shakli */
          <form onSubmit={onSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            
            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '16px' }}>
              <label style={{ display: 'block', width: '100%', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                {t(lang, 'emailLabel')}
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8', pointerEvents: 'none' }}>
                  📧
                </span>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  name="uzw_login_email"
                  placeholder={t(lang, 'emailPlaceholder')}
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'block',
                    height: '44px',
                    padding: '10px 14px 10px 42px',
                    fontSize: '14px',
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#0070ba';
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 112, 186, 0.12)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '22px' }}>
              <label style={{ display: 'block', width: '100%', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                {t(lang, 'passwordLabel')}
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8', pointerEvents: 'none' }}>
                  🔒
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  name="uzw_login_password"
                  placeholder={t(lang, 'passwordPlaceholder')}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'block',
                    height: '44px',
                    padding: '10px 42px 10px 42px',
                    fontSize: '14px',
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#0070ba';
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 112, 186, 0.12)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '4px'
                  }}
                  title={showPassword ? 'Yashirish' : 'Ko\'rsatish'}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            {/* Kirish Tugmasi */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '13px 20px',
                fontSize: '15px',
                fontWeight: 800,
                color: '#ffffff',
                background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)',
                border: 'none',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(0, 45, 98, 0.25)',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? t(lang, 'loggingIn') : t(lang, 'loginBtn')}
            </button>
          </form>
        )}

        {/* Xavfsizlik Eslatmasi */}
        <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block', lineHeight: 1.5 }}>
            🔒 {t(lang, 'loginSecNote')}
          </span>
        </div>

      </div>
    </div>
  );
};
