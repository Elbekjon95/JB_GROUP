import React from 'react';
import { User } from '@/lib/types';

interface HeaderProps {
  currentUser: User;
  activeMenu: 'warehouse' | 'history' | 'payers' | 'dashboard' | 'tariffs' | 'users' | 'accounting';
  setActiveMenu: (menu: 'warehouse' | 'history' | 'payers' | 'dashboard' | 'tariffs' | 'users' | 'accounting') => void;
  onLogout: () => void;
  isUser: boolean;
  isSuperAdmin: boolean;
  isAccountant: boolean;
  canManageTariffs: boolean;
  canViewFinances: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeMenu,
  setActiveMenu,
  onLogout,
  isUser,
  isSuperAdmin,
  isAccountant,
  canManageTariffs,
  canViewFinances
}) => {
  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 16px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40, width: '100%', boxSizing: 'border-box' }}>
      {/* Chap: Logo va Menyu tablari */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
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
              Bojxona & Omborxona
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'nowrap', overflowX: 'auto' }}>
          <button onClick={() => setActiveMenu('warehouse')} className={`nav-tab-item ${activeMenu === 'warehouse' ? 'active' : ''}`} title="1. Ombor & Sektorlar">
            <span>🏢</span>
            <span>Ombor</span>
          </button>
          <button onClick={() => setActiveMenu('history')} className={`nav-tab-item ${activeMenu === 'history' ? 'active' : ''}`} title="2. Yuklar Harakati">
            <span>📜</span>
            <span>Harakatlar</span>
          </button>
          {!isUser && (
            <button onClick={() => setActiveMenu('payers')} className={`nav-tab-item ${activeMenu === 'payers' ? 'active' : ''}`} title="3. To'lovchilar">
              <span>🤝</span>
              <span>To&apos;lovchilar</span>
            </button>
          )}
          {(isSuperAdmin || isAccountant || canViewFinances) && (
            <button 
              onClick={() => setActiveMenu('accounting')} 
              className={`nav-tab-item ${activeMenu === 'accounting' ? 'active' : ''}`}
              title="4. Buxgalteriya & Chiqimlar"
              style={{
                background: activeMenu === 'accounting' ? '#7e22ce' : undefined,
                color: activeMenu === 'accounting' ? '#ffffff' : undefined,
                fontWeight: activeMenu === 'accounting' ? 800 : undefined
              }}
            >
              <span>💼</span>
              <span>Buxgalteriya</span>
            </button>
          )}
          {(isSuperAdmin || canManageTariffs) && (
            <button onClick={() => setActiveMenu('tariffs')} className={`nav-tab-item ${activeMenu === 'tariffs' ? 'active' : ''}`} title="5. Preyskurant">
              <span>📋</span>
              <span>Preyskurant</span>
            </button>
          )}
          {isSuperAdmin && (
            <button 
              onClick={() => setActiveMenu('users')} 
              className={`nav-tab-item ${activeMenu === 'users' ? 'active' : ''}`}
              title="6. Xodimlar & Huquqlar"
              style={{
                background: activeMenu === 'users' ? '#1e3a8a' : undefined,
                color: activeMenu === 'users' ? '#ffffff' : undefined,
                fontWeight: activeMenu === 'users' ? 800 : undefined
              }}
            >
              <span>👥</span>
              <span>Xodimlar</span>
            </button>
          )}
        </nav>
      </div>

      {/* O'ng: Joriy Xodim Ma'lumoti va Chiqish */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
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

        <button onClick={onLogout} title="Tizimdan chiqish" style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#dc2626', background: '#fef2f2', fontWeight: 700, cursor: 'pointer' }}>
          🚪 Chiqish
        </button>
      </div>
    </header>
  );
};

