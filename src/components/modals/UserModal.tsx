import React from 'react';
import { User, UserRole, Warehouse, Language } from '@/lib/types';

export interface UserFormState {
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
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canViewEditLogs: boolean;
}

interface UserModalProps {
  isOpen: boolean;
  editingUser: User | null;
  userForm: UserFormState;
  setUserForm: React.Dispatch<React.SetStateAction<UserFormState>>;
  warehouse: Warehouse;
  lang?: Language;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  editingUser,
  userForm,
  setUserForm,
  warehouse,
  lang = 'uz',
  onSave,
  onClose
}) => {
  if (!isOpen) return null;

  const isRu = lang === 'ru';
  const isEn = lang === 'en';

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '620px' }}>
        <div className="modal-header-clean">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {editingUser 
                ? (isRu ? `⚙️ Права сотрудника: ${editingUser.fullName}` : `⚙️ Xodim Huquqlari: ${editingUser.fullName}`)
                : (isRu ? '➕ Добавить сотрудника / Администратора' : '➕ Yangi Xodim / Admin Qo\'shish')}
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {isRu 
                ? 'Только Super Admin может добавлять сотрудников и назначать права доступа'
                : 'Faqat Super Admin xodimlarni qo\'shishi va vakolatlarini belgilashi mumkin'}
            </span>
          </div>
          <button onClick={onClose} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
        </div>

        <form onSubmit={onSave}>
          <div className="modal-body-clean" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
            {/* Asosiy ma'lumotlar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">
                  {isRu ? 'Ф.И.О (ПОЛНОЕ ИМЯ) *' : 'F.I.SH (TO\'LIQ ISM) *'}
                </label>
                <input
                  type="text"
                  required
                  className="form-input-clean"
                  placeholder={isRu ? 'Алишер Кадыров' : 'Alisher Qodirov'}
                  value={userForm.fullName}
                  onChange={e => setUserForm({ ...userForm, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">
                  {isRu ? 'ЭЛЕКТРОННАЯ ПОЧТА (ЛОГИН) *' : 'ELEKTRON POCHTA (LOGIN) *'}
                </label>
                <input
                  type="email"
                  required
                  className="form-input-clean"
                  placeholder="alisher@jbgroup.uz"
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">
                  {editingUser 
                    ? (isRu ? 'НОВЫЙ ПАРОЛЬ (ЕСЛИ МЕНЯЕТСЯ)' : 'YANGI PAROL (AGAR O\'ZGARSA)')
                    : (isRu ? 'ПАРОЛЬ ДЛЯ ВХОДА *' : 'KIRISH PAROLI *')}
                </label>
                <input
                  type="text"
                  required={!editingUser}
                  className="form-input-clean"
                  placeholder={editingUser ? (isRu ? 'Оставьте пустым...' : 'O\'zgartirmaslik uchun bo\'sh qoldiring') : '••••••••'}
                  value={userForm.password}
                  onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">
                  {isRu ? 'РОЛЬ В СИСТЕМЕ *' : 'TIZIMDAGI ROLI *'}
                </label>
                <select
                  className="form-select-clean"
                  value={userForm.role}
                  onChange={e => {
                    const r = e.target.value as UserRole;
                    setUserForm({
                      ...userForm,
                      role: r,
                      canManageTariffs: r === 'SUPER_ADMIN' || r === 'ADMIN',
                      canManageWarehouse: r === 'SUPER_ADMIN' || r === 'ADMIN',
                      canLinkTariffs: r === 'SUPER_ADMIN' || r === 'ADMIN',
                      canStockMovement: true,
                      canViewFinances: r === 'SUPER_ADMIN' || r === 'ADMIN' || r === 'ACCOUNTANT',
                      canEditProducts: r === 'SUPER_ADMIN' || r === 'ADMIN',
                      canDeleteProducts: r === 'SUPER_ADMIN' || r === 'ADMIN',
                      canViewEditLogs: r === 'SUPER_ADMIN' || r === 'ADMIN'
                    });
                  }}
                >
                  <option value="USER">{isRu ? '👤 Кладовщик (Складской оператор)' : '👤 Omborchi (Oddiy xodim)'}</option>
                  <option value="ADMIN">{isRu ? '🛡️ Старший Кладовщик (Администратор)' : '🛡️ Katta Omborchi (Admin)'}</option>
                  <option value="ACCOUNTANT">{isRu ? '💼 Главный Бухгалтер' : '💼 Bosh Buxgalter'}</option>
                  <option value="SUPER_ADMIN">{isRu ? '👑 Генеральный Директор (Super Admin)' : '👑 Bosh Rahbar (Super Admin)'}</option>
                </select>
              </div>
            </div>

            {/* Ruxsatlar va Huquqlar (Permissions) */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#002d62', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                {isRu ? '🔐 ИНДИВИДУАЛЬНЫЕ ПРАВА ДОСТУПА СОТРУДНИКА:' : '🔐 XODIMNING SHAXSIY VAKOLAT VA DOSTUPLARI:'}
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={userForm.canStockMovement}
                    onChange={e => setUserForm({ ...userForm, canStockMovement: e.target.checked })}
                  />
                  <span>{isRu ? '📥 Прием и выдача груза' : '📥 Yuk kirim va chiqim qilish'}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={userForm.canViewFinances}
                    onChange={e => setUserForm({ ...userForm, canViewFinances: e.target.checked })}
                  />
                  <span>{isRu ? '💰 Просмотр цен и накладных' : '💰 Narx va hisoblarni ko\'rish'}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={userForm.canEditProducts}
                    onChange={e => setUserForm({ ...userForm, canEditProducts: e.target.checked })}
                  />
                  <span>{isRu ? '✏️ Исправление данных груза' : '✏️ Yuk ma\'lumotlarini tahrirlash'}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={userForm.canDeleteProducts}
                    onChange={e => setUserForm({ ...userForm, canDeleteProducts: e.target.checked })}
                  />
                  <span>{isRu ? '🗑️ Удаление груза со склада' : '🗑️ Yukni ombordan o\'chirish'}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={userForm.canManageTariffs}
                    onChange={e => setUserForm({ ...userForm, canManageTariffs: e.target.checked })}
                  />
                  <span>{isRu ? '🏷️ Управление тарифами' : '🏷️ Tariflarni boshqarish'}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={userForm.canManageWarehouse}
                    onChange={e => setUserForm({ ...userForm, canManageWarehouse: e.target.checked })}
                  />
                  <span>{isRu ? '🏢 Настройка секторов склада' : '🏢 Sektorlarni sozlash'}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={userForm.canViewEditLogs}
                    onChange={e => setUserForm({ ...userForm, canViewEditLogs: e.target.checked })}
                  />
                  <span>{isRu ? '📊 Журнал аудита и исправлений' : '📊 Tahrirlar audit hisoboti'}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#b91c1c', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={userForm.canHandleHazardous}
                    onChange={e => setUserForm({ ...userForm, canHandleHazardous: e.target.checked })}
                  />
                  <span>{isRu ? '☣️ Работа с опасными грузами' : '☣️ Xavfli yuklar bilan ishlash'}</span>
                </label>
              </div>
            </div>

            {/* Ruxsat etilgan sektorlar */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#002d62', textTransform: 'uppercase' }}>
                  {isRu ? '🏢 РАЗРЕШЕННЫЕ СЕКТОРЫ СКЛАДА:' : '🏢 RUXSAT BERILGAN OMBOR SEKTORLARI:'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const allSec = warehouse.sectors.map(s => s.id);
                    const isAll = userForm.allowedSectorIds.includes('ALL') || userForm.allowedSectorIds.length === warehouse.sectors.length;
                    setUserForm({
                      ...userForm,
                      allowedSectorIds: isAll ? [] : ['ALL', ...allSec]
                    });
                  }}
                  style={{ fontSize: '11px', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                >
                  {isRu ? 'Выбрать все / Снять' : 'Barchasini tanlash / Bekor qilish'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                {warehouse.sectors.map(sec => {
                  const isChecked = userForm.allowedSectorIds.includes('ALL') || userForm.allowedSectorIds.includes(sec.id);
                  return (
                    <label key={sec.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          let nextIds = userForm.allowedSectorIds.filter(id => id !== 'ALL');
                          if (e.target.checked) {
                            nextIds.push(sec.id);
                          } else {
                            nextIds = nextIds.filter(id => id !== sec.id);
                          }
                          setUserForm({ ...userForm, allowedSectorIds: nextIds });
                        }}
                      />
                      <span>{sec.name} ({sec.code})</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="modal-footer-clean">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {isRu ? 'Отмена' : 'Bekor qilish'}
            </button>
            <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)' }}>
              {isRu ? 'Сохранить сотрудника' : 'Xodimni Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
