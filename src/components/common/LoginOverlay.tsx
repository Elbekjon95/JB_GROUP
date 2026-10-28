import React from 'react';

interface LoginOverlayProps {
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

export const LoginOverlay: React.FC<LoginOverlayProps> = ({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  onSubmit,
  loading = false
}) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)', padding: '24px' }}>
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '36px 32px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 35px -10px rgba(15, 43, 72, 0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <img
              src="/jb-logo.jpg"
              alt="JB GROUP"
              style={{ width: '130px', height: 'auto', maxHeight: '90px', objectFit: 'contain' }}
            />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0f2b48', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            JB GROUP
          </h1>
          <p style={{ fontSize: '12px', color: '#0070ba', fontWeight: 800, margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Bojxona Ombori & Logistika Majmuasi
          </p>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            Omborxona, zaxira va bojxona xizmatlari boshqaruvi
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-field">
            <label className="form-label">Elektron Pochta</label>
            <input
              type="email"
              required
              className="form-input-clean"
              placeholder="Elektron pochtangizni kiriting"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
            />
          </div>

          <div className="form-field" style={{ marginBottom: '20px' }}>
            <label className="form-label">Parol</label>
            <input
              type="password"
              required
              className="form-input-clean"
              placeholder="Parolingizni kiriting"
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
            {loading ? 'Kirilmoqda...' : 'Tizimga Kirish'}
          </button>
        </form>

        {/* Tezkor sinov tugmalari (Demo hisoblar) */}
        <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '8px', textAlign: 'center', fontWeight: 700 }}>
            ⚡ Tezkor sinov uchun akkauntni tanlang (Parol: password123):
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              type="button"
              onClick={() => { setLoginEmail('superadmin@jbgroup.uz'); setLoginPassword('password123'); }}
              style={{ padding: '6px 8px', fontSize: '11px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer' }}
            >
              👑 Bosh Rahbar
            </button>
            <button
              type="button"
              onClick={() => { setLoginEmail('admin@jbgroup.uz'); setLoginPassword('password123'); }}
              style={{ padding: '6px 8px', fontSize: '11px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', color: '#047857', fontWeight: 700, cursor: 'pointer' }}
            >
              🛡️ Katta Omborchi
            </button>
            <button
              type="button"
              onClick={() => { setLoginEmail('user@jbgroup.uz'); setLoginPassword('password123'); }}
              style={{ padding: '6px 8px', fontSize: '11px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#334155', fontWeight: 700, cursor: 'pointer' }}
            >
              👤 Omborchi (User)
            </button>
            <button
              type="button"
              onClick={() => { setLoginEmail('buxgalter@jbgroup.uz'); setLoginPassword('password123'); }}
              style={{ padding: '6px 8px', fontSize: '11px', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '6px', color: '#7e22ce', fontWeight: 700, cursor: 'pointer' }}
            >
              💼 Bosh Buxgalter
            </button>
          </div>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
            🔒 Barcha parollar PostgreSQL da bcrypt bilan shifrlangan holda himoyalanadi.
          </span>
        </div>
      </div>
    </div>
  );
};

