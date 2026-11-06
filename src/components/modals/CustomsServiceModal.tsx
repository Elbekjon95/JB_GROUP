import React, { useState, useEffect } from 'react';
import { CustomsService, CustomsServiceCategory, Language } from '@/lib/types';
import { getUnitsForCategory } from '@/lib/units';

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
  lang?: Language;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const CustomsServiceModal: React.FC<CustomsServiceModalProps> = ({
  isOpen,
  editingCustomsService,
  customsServiceForm,
  setCustomsServiceForm,
  lang = 'uz',
  onSave,
  onClose
}) => {
  const isRu = lang === 'ru';
  const isEn = lang === 'en';

  const availableUnits = getUnitsForCategory(customsServiceForm.category);
  const isKnownUnit = availableUnits.some(u => u.value === customsServiceForm.unit);

  const [showCustomInput, setShowCustomInput] = useState(false);

  // Modal ochilganda yoki tahrirlash obyekti o'zgarganda select ko'rinishida bo'lishi kerak
  useEffect(() => {
    setShowCustomInput(false);
  }, [isOpen, customsServiceForm.category, editingCustomsService]);

  if (!isOpen) return null;

  // Sarlavhadagi takrorlangan qavslarni tozalash (masalan: "(razgruzka) (razgruzka)")
  const rawDisplayName = editingCustomsService ? (isRu ? editingCustomsService.name : (editingCustomsService.nameUz || editingCustomsService.name)) : '';
  const cleanDisplayName = rawDisplayName.replace(/(\s*\([^)]*\))\1+/gi, '$1').trim();

  const modalTitle = editingCustomsService
    ? (isRu ? `✏️ Редактирование тарифа: ${cleanDisplayName}` : isEn ? `✏️ Edit Tariff: ${cleanDisplayName}` : `✏️ Tarifni Tahrirlash: ${cleanDisplayName}`)
    : (isRu ? '➕ Добавить новый тариф' : isEn ? '➕ Add New Tariff' : '➕ Yangi Tarif Qo\'shish');

  const modalSub = isRu
    ? 'Внесение изменений в официальные тарифы таможенного склада «JB GROUP»'
    : isEn
    ? 'Updating official service rates of «JB GROUP» customs warehouse'
    : '«JB GROUP» Bojxona ombori rasmiy xizmat tariflariga o\'zgartirish kiritish';

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '580px' }}>
        <div className="modal-header-clean">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {modalTitle}
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {modalSub}
            </span>
          </div>
          <button onClick={onClose} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
        </div>

        <form onSubmit={onSave}>
          <div className="modal-body-clean">
            {/* Kategoriya */}
            <div className="form-field">
              <label className="form-label">
                {isRu ? 'КАТЕГОРИЯ (РАЗДЕЛ) УСЛУГИ *' : isEn ? 'SERVICE CATEGORY (SECTION) *' : 'XIZMAT KATEGORIYASI (BO\'LIMI) *'}
              </label>
              <select
                className="form-select-clean"
                value={customsServiceForm.category}
                onChange={e => {
                  const cat = e.target.value as CustomsServiceCategory;
                  const newUnits = getUnitsForCategory(cat);
                  const defaultUnit = newUnits[0]?.value || '1 tn';
                  setCustomsServiceForm({
                    ...customsServiceForm,
                    category: cat,
                    unit: defaultUnit
                  });
                  setShowCustomInput(false);
                }}
                required
              >
                <option value="UNLOADING">
                  {isRu ? '📥 1. РАЗГРУЗКА (Прием на склад — разовый)' : isEn ? '📥 1. UNLOADING (Warehouse Entry — One-time)' : '📥 1. YUK TUSHIRISH (Omborga qabul — 1 martalik)'}
                </option>
                <option value="LOADING">
                  {isRu ? '📤 2. ПОГРУЗКА (Выдача клиенту — разовый)' : isEn ? '📤 2. LOADING (Exit to Client — One-time)' : '📤 2. YUK ORTISH (Mijozga yuklab berish — 1 martalik)'}
                </option>
                <option value="STORAGE">
                  {isRu ? '❄️ 3. ХРАНЕНИЕ (Хранение на складе — посуточный)' : isEn ? '❄️ 3. STORAGE (Warehouse Storage — Daily)' : '❄️ 3. SAQLASH (Omborda saqlash — kunlik)'}
                </option>
                <option value="ADDITIONAL">
                  {isRu ? '🛠️ 4. ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ (Разовый)' : isEn ? '🛠️ 4. ADDITIONAL SERVICES (One-time)' : '🛠️ 4. QO\'SHIMCHA XIZMATLAR (1 martalik)'}
                </option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">
                {isRu ? 'НАИМЕНОВАНИЕ УСЛУГИ / ТАРИФА (НА РУССКОМ) *' : isEn ? 'SERVICE / TARIFF NAME (RUSSIAN) *' : 'XIZMAT / TARIF NOMI (RUS TILIDA) *'}
              </label>
              <input
                type="text"
                required
                className="form-input-clean"
                placeholder={isRu ? 'Например: Фура до 90 м3 (разгрузка)' : 'Masalan: Фypa до 90 m3 (kara bilan)'}
                value={customsServiceForm.name}
                onChange={e => setCustomsServiceForm({ ...customsServiceForm, name: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                {isRu ? 'НАИМЕНОВАНИЕ УСЛУГИ / ТАРИФА (НА УЗБЕКСКОМ)' : isEn ? 'SERVICE / TARIFF NAME (UZBEK)' : 'XIZMAT / TARIF NOMI (O\'ZBEK TILIDA)'}
              </label>
              <input
                type="text"
                className="form-input-clean"
                placeholder={isRu ? 'На узбекском: Fura 90 m3 gacha' : 'Masalan: Fura 90 m3 gacha (kara orqali tushirish)'}
                value={customsServiceForm.nameUz}
                onChange={e => setCustomsServiceForm({ ...customsServiceForm, nameUz: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">
                  {isRu ? 'БАЗОВАЯ СТАВКА (БЕЗ НДС, UZS) *' : isEn ? 'BASE RATE (EXCL. VAT, UZS) *' : 'BAZAVIY NARX (QQS SIZ, UZS) *'}
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  className="form-input-clean"
                  value={customsServiceForm.basePrice}
                  onChange={e => setCustomsServiceForm({ ...customsServiceForm, basePrice: Number(e.target.value) })}
                />
              </div>

              {/* O'lchov birligi (Foydalanuvchi talabi: tanlanadigan select) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    {isRu ? 'ЕДИНИЦА ИЗМЕРЕНИЯ *' : isEn ? 'UNIT OF MEASUREMENT *' : 'O\'LCHOV BIRLIGI *'}
                  </label>
                  {customsServiceForm.category === 'STORAGE' ? (
                    <span style={{ fontSize: '11px', color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                      📅 {isRu ? 'ПОСУТОЧНЫЙ ТАРИФ' : isEn ? 'DAILY RATE' : 'KUNLIK SAQLASH TARIFI'}
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                      ⚡ {isRu ? 'РАЗОВЫЙ ПЛАТЁЖ' : isEn ? 'ONE-TIME CHARGE' : '1 MARTALIK TO\'LOV'}
                    </span>
                  )}
                </div>
                <select
                  className="form-select-clean"
                  value={showCustomInput ? '__custom__' : customsServiceForm.unit}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '__custom__') {
                      setShowCustomInput(true);
                    } else {
                      setShowCustomInput(false);
                      setCustomsServiceForm({ ...customsServiceForm, unit: val });
                    }
                  }}
                  required
                  style={{ fontWeight: 600, color: '#002d62' }}
                >
                  <option value="" disabled>
                    {isRu ? '-- Выберите единицу измерения --' : '-- O\'lchov birligini tanlang --'}
                  </option>
                  {availableUnits.map(u => (
                    <option key={u.value} value={u.value}>
                      {isRu ? u.labelRu : isEn ? u.labelEn : u.labelUz}
                    </option>
                  ))}
                  {!isKnownUnit && customsServiceForm.unit && (
                    <option value={customsServiceForm.unit}>{customsServiceForm.unit}</option>
                  )}
                  <option value="__custom__">
                    {isRu ? '✍️ Другая единица (ввести вручную)...' : '✍️ Boshqa birlik (qo\'lda kiritish)...'}
                  </option>
                </select>

                {showCustomInput && (
                  <div style={{ marginTop: '8px' }}>
                    <input
                      type="text"
                      required
                      className="form-input-clean"
                      placeholder={isRu ? 'Введите единицу измерения...' : 'O\'lchov birligini kiriting...'}
                      value={customsServiceForm.unit}
                      onChange={e => setCustomsServiceForm({ ...customsServiceForm, unit: e.target.value })}
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 12% QQS Dinamik ko'rsatkichi */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                  {isRu ? 'СУММА НДС 12%:' : isEn ? '12% VAT AMOUNT:' : '12% QQS (NDS) MIQDORI:'}
                </span>
                <strong style={{ fontSize: '13px', color: '#0070ba' }}>
                  {Math.round(customsServiceForm.basePrice * 0.12).toLocaleString('uz-UZ')} UZS
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 800 }}>
                  {isRu ? 'ИТОГО К ОПЛАТЕ (С НДС 12%):' : isEn ? 'TOTAL PAYABLE (INCL. 12% VAT):' : 'JAMI TO\'LOV (QQS BILAN):'}
                </span>
                <strong style={{ fontSize: '16px', color: '#047857', fontWeight: 900 }}>
                  {Math.round(customsServiceForm.basePrice * 1.12).toLocaleString('uz-UZ')} UZS
                </strong>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">
                {isRu ? 'ДОПОЛНИТЕЛЬНОЕ ОПИСАНИЕ / УСЛОВИЯ' : isEn ? 'ADDITIONAL DESCRIPTION / TERMS' : 'QO\'SHIMCHA TAVSIF / SHARTLAR'}
              </label>
              <textarea
                rows={2}
                className="form-input-clean"
                placeholder={isRu ? 'Условия предоставления услуги или технические примечания...' : 'Xizmat ko\'rsatish shartlari yoki texnik izohlar...'}
                value={customsServiceForm.description}
                onChange={e => setCustomsServiceForm({ ...customsServiceForm, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer-clean">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {isRu ? 'Отмена' : isEn ? 'Cancel' : 'Bekor qilish'}
            </button>
            <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)' }}>
              {editingCustomsService
                ? (isRu ? 'Сохранить тариф' : isEn ? 'Save Tariff' : 'Tarifni Saqlash')
                : (isRu ? 'Добавить тариф' : isEn ? 'Add Tariff' : 'Yangi Tarif Qo\'shish')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
