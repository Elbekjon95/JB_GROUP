import React from 'react';
import { User, Language } from '@/lib/types';

export type MenuTab = 'warehouse' | 'history' | 'payers' | 'dashboard' | 'tariffs' | 'users' | 'accounting' | 'reports' | 'edit_logs';

interface HeaderProps {
  currentUser: User;
  activeMenu: MenuTab;
  setActiveMenu: (menu: MenuTab) => void;
  onLogout: () => void;
  isUser: boolean;
  isSuperAdmin: boolean;
  isAccountant: boolean;
  canManageTariffs: boolean;
  canViewFinances: boolean;
  canViewEditLogs?: boolean;
  lang?: Language;
  setLang?: (lang: Language) => void;
}

const NAV_LABELS: Record<Language, Record<string, string>> = {
  uz: {
    subTitle: 'Bojxona & Omborxona',
    warehouse: 'Ombor',
    history: 'Harakatlar',
    payers: 'To\'lovchilar',
    accounting: 'Buxgalteriya',
    tariffs: 'Preyskurant',
    users: 'Xodimlar',
    reports: 'Faoliyat',
    edit_logs: 'Tahrirlar',
    logout: 'Chiqish'
  },
  ru: {
    subTitle: 'Таможня и Склад',
    warehouse: 'Склад',
    history: 'Движения',
    payers: 'Плательщики',
    accounting: 'Бухгалтерия',
    tariffs: 'Прейскурант',
    users: 'Сотрудники',
    reports: 'Активность',
    edit_logs: 'Исправления',
    logout: 'Выйти'
  },
  en: {
    subTitle: 'Customs & Warehouse',
    warehouse: 'Warehouse',
    history: 'Movements',
    payers: 'Payers',
    accounting: 'Accounting',
    tariffs: 'Price List',
    users: 'Staff',
    reports: 'Activity',
    edit_logs: 'Corrections',
    logout: 'Sign Out'
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeMenu,
  setActiveMenu,
  onLogout,
  isUser,
  isSuperAdmin,
  isAccountant,
  canManageTariffs,
  canViewFinances,
  canViewEditLogs = false,
  lang = 'uz',
  setLang
}) => {
  const L = NAV_LABELS[lang] || NAV_LABELS.uz;

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 16px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40, width: '100%', boxSizing: 'border-box' }}>
      {/* Chap: Logo va Menyu tablari */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <img
            src="/jb-logo.jpg"
            alt="JB GROUP Logo"
            style={{ height: '36px', width: 'auto', maxHeight: '36px', objectFit: 'contain', borderRadius: '6px' }}
          />
          <div>
            <span style={{ fontSize: '14px', fontWeight: 900, color: '#0f2b48', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
              JB GROUP
            </span>
            <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#0070ba', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {L.subTitle}
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'nowrap', overflowX: 'auto' }}>
          <button onClick={() => setActiveMenu('warehouse')} className={`nav-tab-item ${activeMenu === 'warehouse' ? 'active' : ''}`} title={L.warehouse}>
            <span>🏢</span>
            <span>{L.warehouse}</span>
          </button>
          <button onClick={() => setActiveMenu('history')} className={`nav-tab-item ${activeMenu === 'history' ? 'active' : ''}`} title={L.history}>
            <span>📜</span>
            <span>{L.history}</span>
          </button>
          {!isUser && (
            <button onClick={() => setActiveMenu('payers')} className={`nav-tab-item ${activeMenu === 'payers' ? 'active' : ''}`} title={L.payers}>
              <span>🤝</span>
              <span>{L.payers}</span>
            </button>
          )}
          {(isSuperAdmin || isAccountant || canViewFinances) && (
            <button
              onClick={() => setActiveMenu('accounting')}
              className={`nav-tab-item ${activeMenu === 'accounting' ? 'active' : ''}`}
              title={L.accounting}
              style={{
                background: activeMenu === 'accounting' ? '#7e22ce' : undefined,
                color: activeMenu === 'accounting' ? '#ffffff' : undefined,
                fontWeight: activeMenu === 'accounting' ? 800 : undefined
              }}
            >
              <span>💼</span>
              <span>{L.accounting}</span>
            </button>
          )}
          {(isSuperAdmin || canManageTariffs) && (
            <button onClick={() => setActiveMenu('tariffs')} className={`nav-tab-item ${activeMenu === 'tariffs' ? 'active' : ''}`} title={L.tariffs}>
              <span>📋</span>
              <span>{L.tariffs}</span>
            </button>
          )}
          {(isSuperAdmin || canViewEditLogs) && (
            <button
              onClick={() => setActiveMenu('edit_logs')}
              className={`nav-tab-item ${activeMenu === 'edit_logs' ? 'active' : ''}`}
              title={L.edit_logs}
              style={{
                background: activeMenu === 'edit_logs' ? '#d97706' : undefined,
                color: activeMenu === 'edit_logs' ? '#ffffff' : undefined,
                fontWeight: activeMenu === 'edit_logs' ? 800 : undefined
              }}
            >
              <span>✏️</span>
              <span>{L.edit_logs}</span>
            </button>
          )}
          {isSuperAdmin && (
            <button
              onClick={() => setActiveMenu('users')}
              className={`nav-tab-item ${activeMenu === 'users' ? 'active' : ''}`}
              title={L.users}
              style={{
                background: activeMenu === 'users' ? '#1e3a8a' : undefined,
                color: activeMenu === 'users' ? '#ffffff' : undefined,
                fontWeight: activeMenu === 'users' ? 800 : undefined
              }}
            >
              <span>👥</span>
              <span>{L.users}</span>
            </button>
          )}
          {isSuperAdmin && (
            <button
              onClick={() => setActiveMenu('reports')}
              className={`nav-tab-item ${activeMenu === 'reports' ? 'active' : ''}`}
              title={L.reports}
              style={{
                background: activeMenu === 'reports' ? '#dc2626' : undefined,
                color: activeMenu === 'reports' ? '#ffffff' : undefined,
                fontWeight: activeMenu === 'reports' ? 800 : undefined
              }}
            >
              <span>📊</span>
              <span>{L.reports}</span>
            </button>
          )}
        </nav>
      </div>

      {/* O'ng: Til tanlash, Joriy Xodim Ma'lumoti va Chiqish */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* 3 Tilli Переключатель (UZ / RU / EN) */}
        {setLang && (
          <div data-no-translate="true" style={{ display: 'inline-flex', background: '#f1f5f9', padding: '2px', borderRadius: '7px', border: '1px solid #cbd5e1' }}>
            {(['uz', 'ru', 'en'] as Language[]).map((code) => {
              const active = lang === code;
              const label = code === 'uz' ? "🇺🇿 O'Z" : code === 'ru' ? '🇷🇺 РУ' : '🇬🇧 EN';
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  style={{
                    padding: '3px 7px',
                    fontSize: '11px',
                    fontWeight: 800,
                    borderRadius: '5px',
                    border: 'none',
                    cursor: 'pointer',
                    background: active ? '#002d62' : 'transparent',
                    color: active ? '#ffffff' : '#475569',
                    transition: 'all 0.15s'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: currentUser.role === 'SUPER_ADMIN' ? '#eff6ff' : currentUser.role === 'ADMIN' ? '#ecfdf5' : currentUser.role === 'ACCOUNTANT' ? '#faf5ff' : '#f8fafc',
            color: currentUser.role === 'SUPER_ADMIN' ? '#1d4ed8' : currentUser.role === 'ADMIN' ? '#047857' : currentUser.role === 'ACCOUNTANT' ? '#7e22ce' : '#334155'
          }}
        >
          <span style={{ fontSize: '13px' }}>
            {currentUser.role === 'SUPER_ADMIN' ? '👑' : currentUser.role === 'ADMIN' ? '🛡️' : currentUser.role === 'ACCOUNTANT' ? '💼' : '👤'}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 700 }}>
            {currentUser.fullName}
          </span>
          <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', background: 'rgba(0,0,0,0.06)' }}>
            {currentUser.role}
          </span>
        </div>

        <div style={{ borderLeft: '1px solid #e2e8f0', height: '20px' }}></div>

        <button onClick={onLogout} title={L.logout} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#dc2626', background: '#fef2f2', fontWeight: 700, cursor: 'pointer' }}>
          🚪 {L.logout}
        </button>
      </div>
    </header>
  );
};
