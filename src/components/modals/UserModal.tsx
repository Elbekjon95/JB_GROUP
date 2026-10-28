import React from 'react';
import { User, UserRole, Warehouse } from '@/lib/types';

interface UserModalProps {
  isOpen: boolean;
  editingUser: User | null;
  userForm: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    canManageTariffs: boolean;
    canManageWarehouse: boolean;
    canLinkTariffs: boolean;
    canHandleHazardous: boolean;
    allowedSectorIds: string[];
    canStockMovement: boolean;
    canViewFinances: boolean;
  };
  setUserForm: React.Dispatch<React.SetStateAction<{
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    canManageTariffs: boolean;
    canManageWarehouse: boolean;
    canLinkTariffs: boolean;
    canHandleHazardous: boolean;
    allowedSectorIds: string[];
    canStockMovement: boolean;
    canViewFinances: boolean;
  }>>;
  warehouse: Warehouse;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  editingUser,
  userForm,
  setUserForm,
  warehouse,
  onSave,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '580px' }}>
        <div className="modal-header-clean">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {editingUser ? `⚙️ Xodim Huquqlari: ${editingUser.fullName}` : '➕ Yangi Xodim / Admin Qo\'shish'}
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Faqat Super Admin xodimlarni qo&apos;shishi va vakolatlarini belgilashi mumkin
            </span>
          </div>
          <button onClick={onClose} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
        </div>

        <form onSubmit={onSave}>
          <div className="modal-body-clean">
            {/* Asosiy ma'lumotlar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">XODIM F.I.SH *</label>
                <input
                  type="text"
                  required
                  className="form-input-clean"
                  placeholder="Masalan: Aziz Rahimov"
                  value={userForm.fullName}
                  onChange={e => setUserForm({ ...userForm, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">TIZIMDAGI ROLI *</label>
                <select
                  className="form-select-clean"
                  value={userForm.role}
                  onChange={e => {
                    const newRole = e.target.value as UserRole;
                    if (newRole === 'ADMIN') {
                      setUserForm({
                        ...userForm,
                        role: newRole,
                        canManageTariffs: true,
                        canManageWarehouse: true,
                        canLinkTariffs: true,
                        canStockMovement: true
                      });
                    } else if (newRole === 'ACCOUNTANT') {
                      setUserForm({
                        ...userForm,
                        role: newRole,
                        canManageTariffs: false,
                        canManageWarehouse: false,
                        canLinkTariffs: false,
                        canStockMovement: false,
                        canHandleHazardous: false,
                        canViewFinances: true,
                        allowedSectorIds: ['ALL']
                      });
                    } else if (newRole === 'USER') {
                      setUserForm({
                        ...userForm,
                        role: newRole,
                        canManageTariffs: false,
                        canManageWarehouse: false,
                        canLinkTariffs: false,
                        canStockMovement: true,
                        canHandleHazardous: false,
                        canViewFinances: false
                      });
                    } else {
                      setUserForm({ ...userForm, role: newRole });
                    }
                  }}
                >
                  <option value="USER">👤 USER (Omborchi / Xodim)</option>
                  <option value="ADMIN">🛡️ ADMIN (Katta Omborchi / Boshqaruvchi)</option>
                  <option value="ACCOUNTANT">💼 ACCOUNTANT (Bosh Buxgalter / Moliya)</option>
                  <option value="SUPER_ADMIN">👑 SUPER ADMIN (Bosh Rahbar)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              <div>
                <label className="form-label">ELEKTRON POCHTA (LOGIN) *</label>
                <input
                  type="email"
                  required
                  className="form-input-clean"
                  placeholder="xodim@uzw.uz"
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">PAROL *</label>
                <input
                  type="text"
                  required
                  className="form-input-clean"
                  value={userForm.password}
                  onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                />
              </div>
            </div>

            {/* VAKOLATLAR VA HUQUQLAR (SUPER ADMIN BELGILAB BERADI) */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🛡️</span>
                  <span>Super Admin Belgilaydigan Huquqlar (Vakolatlar)</span>
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Har bir xodim uchun alohida sozlanadi
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* 1. Omborni sozlash */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1e293b' }}>
                  <input
                    type="checkbox"
                    checked={userForm.canManageWarehouse}
                    onChange={e => setUserForm({ ...userForm, canManageWarehouse: e.target.checked })}
                    style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#2563eb' }}
                  />
                  <div>
                    <strong>🏢 Omborni sozlash va yangi sektorlar ochish</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                      Yangi sektorlar qo&apos;shish, sektor nomlari, harorat va o&apos;lchamlarini tahrirlash huquqi.
                    </span>
                  </div>
                </label>

                {/* 2. Tarif qo'shish */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1e293b' }}>
                  <input
                    type="checkbox"
                    checked={userForm.canManageTariffs}
                    onChange={e => setUserForm({ ...userForm, canManageTariffs: e.target.checked })}
                    style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#2563eb' }}
                  />
                  <div>
                    <strong>🏷️ Saqlash tariflarini qo&apos;shish va narx belgilash</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                      Yangi kunlik tariflar yaratish va saqlash narxlarini tahrirlash huquqi.
                    </span>
                  </div>
                </label>

                {/* 3. Tariflarni omborga bog'lash */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1e293b' }}>
                  <input
                    type="checkbox"
                    checked={userForm.canLinkTariffs}
                    onChange={e => setUserForm({ ...userForm, canLinkTariffs: e.target.checked })}
                    style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#2563eb' }}
                  />
                  <div>
                    <strong>🔗 Tariflarni ombor sektorlariga biriktirish / ulash</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                      Istalgan tarifni xohlagan sektorlarga biriktirish vakolati.
                    </span>
                  </div>
                </label>

                {/* 4. Kirim/Chiqim */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1e293b' }}>
                  <input
                    type="checkbox"
                    checked={userForm.canStockMovement}
                    onChange={e => setUserForm({ ...userForm, canStockMovement: e.target.checked })}
                    style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#2563eb' }}
                  />
                  <div>
                    <strong>📦 Yuk kirim va chiqim amallarini bajarish</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                      Omborga yangi yuk kiritish va mavjud yukni chiqarish (hisob-kitob qilish) huquqi.
                    </span>
                  </div>
                </label>

                {/* 5. XAVFLI YUKLAR BILAN ISHLASH */}
                <div style={{ background: userForm.canHandleHazardous ? '#ecfdf5' : '#fff1f2', border: userForm.canHandleHazardous ? '1px solid #a7f3d0' : '1.5px solid #fecdd3', borderRadius: '8px', padding: '10px 12px', marginTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: userForm.canHandleHazardous ? '#065f46' : '#9f1239' }}>
                    <input
                      type="checkbox"
                      checked={userForm.canHandleHazardous}
                      onChange={e => setUserForm({ ...userForm, canHandleHazardous: e.target.checked })}
                      style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#e11d48' }}
                    />
                    <div>
                      <strong>☣️ XAVFLI YUKLAR BILAN ISHLASH RUXSATI (SERTIFIKAT)</strong>
                      <span style={{ display: 'block', fontSize: '11px', marginTop: '2px', color: userForm.canHandleHazardous ? '#047857' : '#be123c', fontWeight: 600 }}>
                        {userForm.canHandleHazardous
                          ? '✅ Ushbu xodim xavfli yuklar va kimyoviy moddalar sektori bilan ishlay oladi.'
                          : '⛔ DIQQAT: Ushbu ruxsat belgilanmasa, xodim xavfli yuklar sektoriga yuk kirita olmaydi va chiqara olmaydi!'}
                      </span>
                    </div>
                  </label>
                </div>

                {/* 6. MOLIYAVIY TO'LOVLAR VA PUL MA'LUMOTLARINI KO'RISH RUXSATI */}
                <div style={{ background: userForm.canViewFinances ? '#eff6ff' : '#f8fafc', border: userForm.canViewFinances ? '1.5px solid #93c5fd' : '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', marginTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: userForm.canViewFinances ? '#1e40af' : '#334155' }}>
                    <input
                      type="checkbox"
                      checked={userForm.canViewFinances}
                      onChange={e => setUserForm({ ...userForm, canViewFinances: e.target.checked })}
                      style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#2563eb' }}
                    />
                    <div>
                      <strong>💰 PUL VA MOLIYAVIY TO&apos;LOVLARNI KO&apos;RISH RUXSATI</strong>
                      <span style={{ display: 'block', fontSize: '11px', marginTop: '2px', color: userForm.canViewFinances ? '#1d4ed8' : '#64748b', fontWeight: 600 }}>
                        {userForm.canViewFinances
                          ? '✅ Ushbu xodimga to\'lov summalari, tarif narxlari va to\'lov hisoblari ko\'rinadi.'
                          : '🔒 Pul ma\'lumotlari yashirilgan: Xodimga to\'lov summalari va narxlar ko\'rsatilmaydi, u faqat yuk soni, og\'irligi va faktik ma\'lumotlarni belgilaydi.'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* SEKTORLARNI BIRIKTIRISH */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                  📍 Xodimga Ruxsat Berilgan Sektorlar:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (userForm.allowedSectorIds.includes('ALL')) {
                      setUserForm({ ...userForm, allowedSectorIds: ['sec-2'] });
                    } else {
                      setUserForm({ ...userForm, allowedSectorIds: ['ALL'] });
                    }
                  }}
                  style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {userForm.allowedSectorIds.includes('ALL') ? 'Alohida tanlash' : '⚡ Barchasiga ruxsat berish (ALL)'}
                </button>
              </div>

              <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 10px 0' }}>
                User faqat o&apos;zida huquqi bo&apos;lgan ombor/sektorlarga yuk qo&apos;ya oladi.
              </p>

              {userForm.allowedSectorIds.includes('ALL') ? (
                <div style={{ padding: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '12px', color: '#1d4ed8', fontWeight: 700 }}>
                  ✅ Barcha ombor sektorlari bilan ishlash huquqi berildi (Cheklovsiz).
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {warehouse.sectors.map(sec => {
                    const isChecked = userForm.allowedSectorIds.includes(sec.id);
                    return (
                      <label
                        key={sec.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: isChecked ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                          background: isChecked ? '#f0fdf4' : '#f8fafc',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setUserForm({
                                ...userForm,
                                allowedSectorIds: [...userForm.allowedSectorIds.filter(id => id !== 'ALL'), sec.id]
                              });
                            } else {
                              setUserForm({
                                ...userForm,
                                allowedSectorIds: userForm.allowedSectorIds.filter(id => id !== sec.id)
                              });
                            }
                          }}
                          style={{ width: '15px', height: '15px', accentColor: '#2563eb' }}
                        />
                        <div>
                          <strong style={{ color: '#0f172a', display: 'block' }}>{sec.name}</strong>
                          <span style={{ fontSize: '10px', color: '#64748b' }}>{sec.code} • {sec.type}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer-clean">
            <button type="button" className="btn-secondary" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn-primary">
              {editingUser ? 'Saqlash va Tasdiqlash' : 'Xodimni Qo\'shish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

