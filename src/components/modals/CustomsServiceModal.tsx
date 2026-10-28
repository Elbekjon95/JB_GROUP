import React from 'react';
import { CustomsService, CustomsServiceCategory } from '@/lib/types';

interface CustomsServiceModalProps {
  isOpen: boolean;
  editingCustomsService: CustomsService | null;
  customsServiceForm: {
    name: string;
    nameUz: string;
    unit: string;
    basePrice: number;
    vatRate: number;
    description: string;
    category: CustomsServiceCategory;
  };
  setCustomsServiceForm: React.Dispatch<React.SetStateAction<{
    name: string;
    nameUz: string;
    unit: string;
    basePrice: number;
    vatRate: number;
    description: string;
    category: CustomsServiceCategory;
  }>>;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const CustomsServiceModal: React.FC<CustomsServiceModalProps> = ({
  isOpen,
  editingCustomsService,
  customsServiceForm,
  setCustomsServiceForm,
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
              {editingCustomsService ? `✏️ Xizmat Narxini Tahrirlash: ${editingCustomsService.name}` : '➕ Yangi Bojxona Xizmati Qo\'shish'}
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              «JB GROUP» Bojxona ombori rasmiy preyskurantiga o&apos;zgartirish kiritish
            </span>
          </div>
          <button onClick={onClose} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
        </div>

        <form onSubmit={onSave}>
          <div className="modal-body-clean">
            {/* Kategoriya */}
            <div className="form-field">
              <label className="form-label">XIZMAT KATEGORIYASI (BO&apos;LIMI) *</label>
              <select
                className="form-select-clean"
                value={customsServiceForm.category}
                onChange={e => setCustomsServiceForm({ ...customsServiceForm, category: e.target.value as CustomsServiceCategory })}
                required
              >
                <option value="UNLOADING_LOADING">🏗️ Ortish-tushirish (РАЗГРУЗКА/ПОГРУЗКА)</option>
                <option value="STORAGE">❄️ Bojxona omborida saqlash (ХРАНЕНИЕ)</option>
                <option value="ADDITIONAL">🛠️ Qo&apos;shimcha xizmatlar (ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ)</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">XIZMAT NOMI (RUS TILIDA - PREYSKURANT BO&apos;YICHA) *</label>
              <input
                type="text"
                required
                className="form-input-clean"
                placeholder="Masalan: Фypa до 90 m3 (kara bilan)"
                value={customsServiceForm.name}
                onChange={e => setCustomsServiceForm({ ...customsServiceForm, name: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label className="form-label">XIZMAT NOMI (O&apos;ZBEK TILIDA)</label>
              <input
                type="text"
                className="form-input-clean"
                placeholder="Masalan: Fura 90 m3 gacha (kara orqali tushirish)"
                value={customsServiceForm.nameUz}
                onChange={e => setCustomsServiceForm({ ...customsServiceForm, nameUz: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">BAZAVIY NARX (QQS SIZ, UZS) *</label>
                <input
                  type="number"
                  min={0}
                  required
                  className="form-input-clean"
                  value={customsServiceForm.basePrice}
                  onChange={e => setCustomsServiceForm({ ...customsServiceForm, basePrice: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">O&apos;LCHOV BIRLIGI *</label>
                <input
                  type="text"
                  required
                  className="form-input-clean"
                  placeholder="1 fura, 1 tn, 1 sutka, 1 pm"
                  value={customsServiceForm.unit}
                  onChange={e => setCustomsServiceForm({ ...customsServiceForm, unit: e.target.value })}
                />
              </div>
            </div>

            {/* 12% QQS Dinamik ko'rsatkichi */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>12% QQS (NDS) MIQDORI:</span>
                <strong style={{ fontSize: '13px', color: '#0070ba' }}>
                  {Math.round(customsServiceForm.basePrice * 0.12).toLocaleString('uz-UZ')} UZS
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 800 }}>JAMI TO&apos;LOV (QQS BILAN):</span>
                <strong style={{ fontSize: '16px', color: '#047857', fontWeight: 900 }}>
                  {Math.round(customsServiceForm.basePrice * 1.12).toLocaleString('uz-UZ')} UZS
                </strong>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">QO&apos;SHIMCHA TAVSIF / SHARTLAR</label>
              <textarea
                rows={2}
                className="form-input-clean"
                placeholder="Xizmat ko'rsatish shartlari yoki texnik izohlar..."
                value={customsServiceForm.description}
                onChange={e => setCustomsServiceForm({ ...customsServiceForm, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer-clean">
            <button type="button" className="btn-secondary" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)' }}>
              {editingCustomsService ? 'Narxni Saqlash' : 'Xizmatni Qo\'shish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

