import React from 'react';
import { StoredProduct, Sector, ContractPayer, CustomsService, Language } from '@/lib/types';
import { t } from '@/lib/i18n';

export interface EditProductFormState {
  id: string;
  name: string;
  category: string;
  sectorId: string;
  quantity: number | string;
  unit: string;
  weightKg: number | string;
  payerId: string;
  clientName: string;
  storageTariffId: string;
  notes: string;
  reason: string;
  entryDate?: string;
  entryTime?: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  editingProduct: StoredProduct | null;
  editForm: EditProductFormState;
  setEditForm: React.Dispatch<React.SetStateAction<EditProductFormState>>;
  sectors: Sector[];
  payers: ContractPayer[];
  customsServices: CustomsService[];
  canViewFinances: boolean;
  lang?: Language;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  editingProduct,
  editForm,
  setEditForm,
  sectors,
  payers,
  customsServices,
  canViewFinances,
  lang = 'uz',
  onSave,
  onClose
}) => {
  if (!isOpen || !editingProduct) return null;

  const isRu = lang === 'ru';
  const isEn = lang === 'en';

  return (
    <div className="modal-overlay" style={{ zIndex: 9998 }}>
      <div className="modal-dialog" style={{ maxWidth: '640px' }}>
        <div className="modal-header-clean" style={{ background: '#fffbeb', borderBottom: '1.5px solid #fde68a' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#92400e', margin: 0 }}>
              {t(lang, 'editModalTitle')}
            </h3>
            <span style={{ fontSize: '11.5px', color: '#b45309', display: 'block', marginTop: '2px' }}>
              {t(lang, 'editModalSub')}
            </span>
          </div>
          <button onClick={onClose} style={{ fontSize: '18px', color: '#92400e', padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={onSave}>
          <div className="modal-body-clean" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
            {/* Dastlabki ma'lumot qaydnomasi */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ color: '#64748b' }}>{isRu ? 'Текущий груз: ' : 'Joriy yuk: '}</span>
                <strong data-no-translate="true" style={{ color: '#0f172a' }}>{editingProduct.name}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>{isRu ? 'Текущий остаток: ' : 'Hozirgi qoldiq: '}</span>
                <strong style={{ color: '#059669' }}>
                  {editingProduct.quantity.toLocaleString('uz-UZ')} {editingProduct.unit} ({editingProduct.weightKg.toLocaleString('uz-UZ')} kg)
                </strong>
              </div>
            </div>

            {/* 1. Yuk nomi va Toifasi */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">
                  {isRu ? 'НАИМЕНОВАНИЕ ГРУЗА (ПАРТИИ) *' : isEn ? 'CARGO (BATCH) NAME *' : 'YUK / MAHSULOT NOMI *'}
                </label>
                <input
                  type="text"
                  required
                  className="form-input-clean"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">
                  {isRu ? 'КАТЕГОРИЯ ГРУЗА' : isEn ? 'CARGO CATEGORY' : 'YUK TOIFASI'}
                </label>
                <input
                  type="text"
                  className="form-input-clean"
                  value={editForm.category}
                  onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                />
              </div>
            </div>

            {/* 2. Sektor va Mijoz/To'lovchi */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">
                  {isRu ? 'СЕКТОР СКЛАДА *' : isEn ? 'WAREHOUSE SECTOR *' : 'OMBOR SEKTORI *'}
                </label>
                <select
                  className="form-select-clean"
                  value={editForm.sectorId}
                  onChange={e => setEditForm({ ...editForm, sectorId: e.target.value })}
                  required
                >
                  {sectors.map(sec => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name} ({sec.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">
                  {isRu ? 'ПЛАТЕЛЬЩИК / КЛИЕНТ ПО ДОГОВОРУ *' : isEn ? 'CONTRACT PAYER / CLIENT *' : 'MIJOZ / SHARTNOMAVIY TO\'LOVCHI *'}
                </label>
                <select
                  className="form-select-clean"
                  value={editForm.payerId}
                  onChange={e => {
                    const found = payers.find(p => p.id === e.target.value);
                    setEditForm({
                      ...editForm,
                      payerId: e.target.value,
                      clientName: found ? found.name : editForm.clientName
                    });
                  }}
                >
                  <option value="">{isRu ? '-- Выберите из договора --' : '-- Shartnomadan tanlash --'}</option>
                  {payers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (STIR: {p.inn})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Kirim sanasi va vaqti */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 800, color: '#002d62' }}>
                  {isRu ? '📅 ДАТА ПРИХОДА *' : isEn ? '📅 ENTRY DATE *' : '📅 KIRIM SANASI *'}
                </label>
                <input
                  type="date"
                  required
                  className="form-input-clean"
                  value={editForm.entryDate || ''}
                  onChange={e => setEditForm({ ...editForm, entryDate: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 800, color: '#002d62' }}>
                  {isRu ? '🕒 ВРЕМЯ ПРИХОДА' : isEn ? '🕒 ENTRY TIME' : '🕒 KIRIM VAQTI'}
                </label>
                <input
                  type="time"
                  className="form-input-clean"
                  value={editForm.entryTime || '09:00'}
                  onChange={e => setEditForm({ ...editForm, entryTime: e.target.value })}
                />
              </div>
            </div>

            {/* 3. Miqdori (Soni), Birligi va Og'irligi (kg) */}
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#166534', marginBottom: '10px', textTransform: 'uppercase' }}>
                {isRu ? '⚖️ ИСПРАВЛЯЕМОЕ КОЛИЧЕСТВО И ВЕС (КГ):' : '⚖️ TO\'G\'RILANAYOTGAN SONI VA OG\'IRLIGI (KG):'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>
                <div>
                  <label className="form-label">
                    {isRu ? 'КОЛИЧЕСТВО МЕСТ *' : isEn ? 'QUANTITY *' : 'SONI / MIQDORI *'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    step="any"
                    required
                    className="form-input-clean"
                    value={editForm.quantity}
                    onChange={e => setEditForm({ ...editForm, quantity: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">
                    {isRu ? 'ЕДИНИЦА ИЗМЕРЕНИЯ *' : isEn ? 'UNIT *' : 'O\'LCHOV BIRLIGI *'}
                  </label>
                  <select
                    className="form-select-clean"
                    value={editForm.unit}
                    onChange={e => setEditForm({ ...editForm, unit: e.target.value })}
                  >
                    <option value="dona">{isRu ? 'штук (dona)' : 'dona'}</option>
                    <option value="quti">{isRu ? 'коробка (quti)' : 'quti (karobka)'}</option>
                    <option value="qop">{isRu ? 'мешок (qop)' : 'qop (meshok)'}</option>
                    <option value="pallet">{isRu ? 'паллет (поддон)' : 'pallet (poddon)'}</option>
                    <option value="bochka">{isRu ? 'бочка / емкость' : 'bochka / idish'}</option>
                    <option value="rulon">{isRu ? 'рулон' : 'rulon'}</option>
                    <option value="tonna">{isRu ? 'тонна' : 'tonna'}</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ color: '#047857', fontWeight: 800 }}>
                    {isRu ? '⚖️ ОБЩИЙ ВЕС (КГ) *' : '⚖️ JAMI OG\'IRLIGI (KG) *'}
                  </label>
                  <input
                    type="number"
                    min={0.1}
                    step="any"
                    required
                    className="form-input-clean"
                    style={{ border: '1.5px solid #10b981', fontWeight: 800, color: '#15803d' }}
                    value={editForm.weightKg}
                    onChange={e => setEditForm({ ...editForm, weightKg: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 4. Saqlash tarifi */}
            <div className="form-field">
              <label className="form-label">
                {isRu ? 'ТАРИФ ХРАНЕНИЯ (ПО ТАРИФУ)' : isEn ? 'STORAGE TARIFF' : 'SAQLASH TARIFI (TARIF BO\'YICHA)'}
              </label>
              <select
                className="form-select-clean"
                value={editForm.storageTariffId}
                onChange={e => setEditForm({ ...editForm, storageTariffId: e.target.value })}
              >
                {customsServices.filter(s => s.category === 'STORAGE').map(s => (
                  <option key={s.id} value={s.id}>
                    №{s.itemNo}: {isRu ? s.name : (s.nameUz || s.name)} ({s.unit}) {canViewFinances ? `— ${s.totalPrice.toLocaleString('uz-UZ')} UZS` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Hujjat / Izoh */}
            <div className="form-field">
              <label className="form-label">
                {isRu ? 'ДОКУМЕНТ НА ГРУЗ / ПРИМЕЧАНИЕ' : isEn ? 'CARGO DOCUMENT / NOTE' : 'YUK HUJJATI / QO\'SHIMCHA IZOH'}
              </label>
              <input
                type="text"
                className="form-input-clean"
                placeholder={isRu ? 'Номер декларации, инвойса или накладной...' : 'Deklaratsiya raqami, invoys yoki transport raqami...'}
                value={editForm.notes}
                onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
              />
            </div>

            {/* 6. TAHRIRLASH SABABI */}
            <div style={{ background: '#fffbeb', border: '1.5px solid #f59e0b', borderRadius: '10px', padding: '14px', marginTop: '10px' }}>
              <label className="form-label" style={{ color: '#92400e', fontWeight: 900 }}>
                ⚠️ {t(lang, 'editReasonLabel')}
              </label>
              <textarea
                rows={2}
                required
                className="form-input-clean"
                style={{ background: '#ffffff', border: '1px solid #f59e0b' }}
                placeholder={t(lang, 'editReasonPlaceholder')}
                value={editForm.reason}
                onChange={e => setEditForm({ ...editForm, reason: e.target.value })}
              />
              <span style={{ fontSize: '11px', color: '#b45309', display: 'block', marginTop: '4px', fontWeight: 600 }}>
                {isRu
                  ? '📌 Внимание: Кем и по какой причине внесено исправление фиксируется в ежемесячном отчете Генерального Директора.'
                  : '📌 Diqqat: Ushbu tuzatish kim tomonidan va nima sababdan kiritilganligi Bosh Rahbarning oylik nazorat hisobotiga yoziladi.'}
              </span>
            </div>
          </div>

          <div className="modal-footer-clean">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {isRu ? 'Отмена' : 'Bekor qilish'}
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)', border: 'none', fontWeight: 800 }}
            >
              {t(lang, 'saveEditBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
