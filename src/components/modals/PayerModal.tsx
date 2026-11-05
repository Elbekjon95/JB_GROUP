import React from 'react';
import { ContractPayer, Language } from '@/lib/types';

interface PayerModalProps {
  isOpen: boolean;
  editingPayer: ContractPayer | null;
  payerForm: {
    name: string;
    inn: string;
    contractNumber: string;
    contractStartDate: string;
    contractEndDate: string;
    contactPerson: string;
    phone: string;
    notes: string;
  };
  setPayerForm: React.Dispatch<React.SetStateAction<{
    name: string;
    inn: string;
    contractNumber: string;
    contractStartDate: string;
    contractEndDate: string;
    contactPerson: string;
    phone: string;
    notes: string;
  }>>;
  lang?: Language;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const PayerModal: React.FC<PayerModalProps> = ({
  isOpen,
  editingPayer,
  payerForm,
  setPayerForm,
  lang = 'uz',
  onSave,
  onClose
}) => {
  if (!isOpen) return null;

  const isRu = lang === 'ru';
  const isEn = lang === 'en';

  const todayStr = new Date().toISOString().slice(0, 10);
  const isExp = Boolean(payerForm.contractEndDate && payerForm.contractEndDate < todayStr);

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '580px' }}>
        <div className="modal-header-clean">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#002d62', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🤝</span>
              <span>
                {editingPayer 
                  ? (isRu ? `Обновление договора: ${editingPayer.name}` : `Shartnomani Yangilash: ${editingPayer.name}`)
                  : (isRu ? 'Заключение нового договора хранения' : 'Yangi Saqlash Shartnomasini Tuzish')}
              </span>
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {isRu ? 'Договор оказания услуг таможенного склада «JB GROUP»' : '«JB GROUP» Bojxona ombori xizmatlari ko\'rsatish shartnomasi'}
            </span>
          </div>
          <button onClick={onClose} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
        </div>

        <form onSubmit={onSave}>
          <div className="modal-body-clean">
            <div className="form-field">
              <label className="form-label">
                {isRu ? 'ПЛАТЕЛЬЩИК / НАИМЕНОВАНИЕ ОРГАНИЗАЦИИ *' : 'TO\'LOVCHI / KORXONA NOMI *'}
              </label>
              <input
                type="text"
                required
                className="form-input-clean"
                placeholder={isRu ? 'Например: ООО Sag Agro Logistika' : 'Masalan: Sag Agro Logistika MChJ'}
                value={payerForm.name}
                onChange={e => setPayerForm({ ...payerForm, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">
                  {isRu ? 'ИНН ОРГАНИЗАЦИИ (9 ЦИФР) *' : 'STIR (INN) RAQAMI (9 TA RAQAM) *'}
                </label>
                <input
                  type="text"
                  maxLength={9}
                  required
                  className="form-input-clean"
                  placeholder="308123456"
                  value={payerForm.inn}
                  onChange={e => setPayerForm({ ...payerForm, inn: e.target.value.replace(/\D/g, '') })}
                />
              </div>

              <div>
                <label className="form-label">
                  {isRu ? 'НОМЕР ДОГОВОРА *' : 'SHARTNOMA RAQAMI *'}
                </label>
                <input
                  type="text"
                  required
                  className="form-input-clean"
                  placeholder="JB-2026/04"
                  value={payerForm.contractNumber}
                  onChange={e => setPayerForm({ ...payerForm, contractNumber: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">
                  {isRu ? 'ДАТА ЗАКЛЮЧЕНИЯ ДОГОВОРА *' : 'SHARTNOMA TUZILGAN SANA *'}
                </label>
                <input
                  type="date"
                  required
                  className="form-input-clean"
                  value={payerForm.contractStartDate}
                  onChange={e => setPayerForm({ ...payerForm, contractStartDate: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label" style={{ color: isExp ? '#dc2626' : 'inherit' }}>
                  {isRu ? 'ДАТА ОКОНЧАНИЯ СРОКА ДЕЙСТВИЯ *' : 'AMAL QILISH MUDDATI TUGASHI *'}
                </label>
                <input
                  type="date"
                  required
                  className="form-input-clean"
                  style={{ borderColor: isExp ? '#fca5a5' : undefined }}
                  value={payerForm.contractEndDate}
                  onChange={e => setPayerForm({ ...payerForm, contractEndDate: e.target.value })}
                />
                {isExp && (
                  <span style={{ fontSize: '11px', color: '#dc2626', display: 'block', marginTop: '2px', fontWeight: 700 }}>
                    ⚠️ {isRu ? 'Срок действия данного договора истек!' : 'Ushbu shartnoma muddati o\'tib ketgan!'}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">
                  {isRu ? 'ОТВЕТСТВЕННОЕ ЛИЦО (Ф.И.О)' : 'MAS\'UL SHAXS (F.I.SH)'}
                </label>
                <input
                  type="text"
                  className="form-input-clean"
                  placeholder={isRu ? 'Директор или логист' : 'Direktor yoki mas\'ul logist'}
                  value={payerForm.contactPerson}
                  onChange={e => setPayerForm({ ...payerForm, contactPerson: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">
                  {isRu ? 'НОМЕР ТЕЛЕФОНА' : 'TELEFON RAQAMI'}
                </label>
                <input
                  type="text"
                  className="form-input-clean"
                  placeholder="+998 90 123-45-67"
                  value={payerForm.phone}
                  onChange={e => setPayerForm({ ...payerForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">
                {isRu ? 'ДОПОЛНИТЕЛЬНОЕ ПРИМЕЧАНИЕ' : 'QO\'SHIMCHA IZOH'}
              </label>
              <textarea
                rows={2}
                className="form-input-clean"
                placeholder={isRu ? 'Условия договора, реквизиты или примечания...' : 'Shartnoma shartlari, rekvizitlar yoki qo\'shimcha ma\'lumotlar...'}
                value={payerForm.notes}
                onChange={e => setPayerForm({ ...payerForm, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer-clean">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {isRu ? 'Отмена' : 'Bekor qilish'}
            </button>
            <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)' }}>
              {isRu ? 'Сохранить договор' : 'Shartnomani Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
