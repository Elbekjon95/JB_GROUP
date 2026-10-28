import React from 'react';
import { ContractPayer } from '@/lib/types';

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
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const PayerModal: React.FC<PayerModalProps> = ({
  isOpen,
  editingPayer,
  payerForm,
  setPayerForm,
  onSave,
  onClose
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const isExp = Boolean(payerForm.contractEndDate && payerForm.contractEndDate < todayStr);

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '580px' }}>
        <div className="modal-header-clean">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#002d62', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🤝</span>
              <span>{editingPayer ? `Shartnomani Yangilash: ${editingPayer.name}` : 'Yangi Saqlash Shartnomasini Tuzish'}</span>
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              «JB GROUP» Bojxona ombori xizmatlari ko&apos;rsatish shartnomasi
            </span>
          </div>
          <button onClick={onClose} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
        </div>

        <form onSubmit={onSave}>
          <div className="modal-body-clean">
            <div className="form-field">
              <label className="form-label">TO&apos;LOVCHI / KORXONA NOMI *</label>
              <input
                type="text"
                required
                className="form-input-clean"
                placeholder="Masalan: Sag Agro Logistika MChJ"
                value={payerForm.name}
                onChange={e => setPayerForm({ ...payerForm, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">STIR / INN RAQAMI *</label>
                <input
                  type="text"
                  required
                  className="form-input-clean"
                  placeholder="Masalan: 308942115"
                  value={payerForm.inn}
                  onChange={e => setPayerForm({ ...payerForm, inn: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">SHARTNOMA RAQAMI *</label>
                <input
                  type="text"
                  required
                  className="form-input-clean"
                  placeholder="Masalan: SH-2026/01"
                  value={payerForm.contractNumber}
                  onChange={e => setPayerForm({ ...payerForm, contractNumber: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">SHARTNOMA TUZILGAN SANA *</label>
                <input
                  type="date"
                  required
                  className="form-input-clean"
                  value={payerForm.contractStartDate}
                  onChange={e => setPayerForm({ ...payerForm, contractStartDate: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label" style={{ color: '#0070ba', fontWeight: 800 }}>
                  AMAL QILISH MUDDATI (QACHONGACHA) *
                </label>
                <input
                  type="date"
                  required
                  className="form-input-clean"
                  style={{ border: '1.5px solid #0070ba', background: '#f0f9ff' }}
                  value={payerForm.contractEndDate}
                  onChange={e => setPayerForm({ ...payerForm, contractEndDate: e.target.value })}
                />
              </div>
            </div>

            {/* Muddat ogohlantirishi */}
            {isExp ? (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '12px', color: '#dc2626' }}>
                ⚠️ <strong>Diqqat:</strong> Ushbu sana bugungi kundan ({todayStr}) oldingi sana. Agar shu muddat saqlansa, mijoz muddati o&apos;tgan deb hisoblanadi va chiqim bloklanadi!
              </div>
            ) : (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '12px', color: '#166534' }}>
                ✅ <strong>Shartnoma amalda bo&apos;ladi:</strong> Belgilangan muddatgacha ({payerForm.contractEndDate}) barcha yuk operatsiyalari va chiqimlar to&apos;siqsiz amalga oshiriladi.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">MAS&apos;UL VAKIL F.I.SH</label>
                <input
                  type="text"
                  className="form-input-clean"
                  placeholder="Masalan: Sirojiddin Aliyev"
                  value={payerForm.contactPerson}
                  onChange={e => setPayerForm({ ...payerForm, contactPerson: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">TELEFON RAQAMI</label>
                <input
                  type="text"
                  className="form-input-clean"
                  placeholder="+998 90 123 45 67"
                  value={payerForm.phone}
                  onChange={e => setPayerForm({ ...payerForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">QO&apos;SHIMCHA IZOH / ASOS</label>
              <textarea
                rows={2}
                className="form-input-clean"
                placeholder="Shartnoma bo'yicha maxsus shartlar yoki qaydlar..."
                value={payerForm.notes}
                onChange={e => setPayerForm({ ...payerForm, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer-clean">
            <button type="button" className="btn-secondary" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)' }}>
              💾 Shartnomani Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

