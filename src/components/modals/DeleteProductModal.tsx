import React from 'react';
import { StoredProduct, Language } from '@/lib/types';

interface DeleteProductModalProps {
  isOpen: boolean;
  product: StoredProduct | null;
  reason: string;
  setReason: (val: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  isDeleting: boolean;
  lang?: Language;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  product,
  reason,
  setReason,
  onConfirm,
  onClose,
  isDeleting,
  lang = 'uz'
}) => {
  if (!isOpen || !product) return null;

  const isRu = lang === 'ru';
  const isEn = lang === 'en';

  const PRESET_REASONS = isRu
    ? [
        'Ошибочно внесенный при приходе груз',
        'Повторный (дублирующий) приход',
        'Ошибочно приходован в другой сектор',
        'Отменено клиентом / заказчиком'
      ]
    : isEn
    ? [
        'Mistakenly entered inbound cargo',
        'Duplicate entry',
        'Placed in wrong warehouse sector',
        'Cancelled by client'
      ]
    : [
        'Kirimda xato kiritilgan yuk',
        'Takroriy (dublikat) kirim',
        'Boshqa omborga adashib kiritilgan',
        'Mijoz tomonidan bekor qilindi'
      ];

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-dialog" style={{ maxWidth: '560px' }}>
        {/* Header */}
        <div
          className="modal-header-clean"
          style={{
            background: '#fef2f2',
            borderBottom: '1.5px solid #fecaca',
            padding: '16px 20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🗑️</span>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#991b1b', margin: 0 }}>
                {isRu ? 'Удаление Груза из Системы (Подтверждение)' : isEn ? 'Delete Cargo from System (Confirmation)' : 'Yukni Tizimdan O\'chirish (Tasdiqlash)'}
              </h3>
              <span style={{ fontSize: '11.5px', color: '#b91c1c', display: 'block', marginTop: '2px' }}>
                {isRu ? 'Полное удаление принятого груза из складского учета' : 'Kiritilgan yukni ombor hisobidan butunlay o\'chirish'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body-clean" style={{ padding: '20px' }}>
          {/* Ogohlantirish bloki */}
          <div
            style={{
              background: '#fff1f2',
              border: '1.5px solid #fda4af',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '16px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1 }}>⚠️</span>
            <div style={{ fontSize: '12px', color: '#881337', lineHeight: '1.5' }}>
              <strong>{isRu ? 'ВНИМАНИЕ:' : 'DIQQAT:'}</strong>{' '}
              {isRu
                ? 'Это действие удалит груз со склада. Полная информация об удалении (кто, когда, какой груз и по какой причине) официально фиксируется в разделе «Исправления» и отображается в отчете Генерального Директора.'
                : 'Ushbu amal yukni ombordan o\'chiradi. O\'chirilganlik to\'g\'risidagi to\'liq ma\'lumot (kim, qachon, qaysi yuk va nima sababdan o\'chirgani) rasmiy ravishda «Tahrirlar» bo\'limiga kiritiladi va oylik hisobotda ko\'rinadi.'}
            </div>
          </div>

          {/* O'chirilayotgan yuk ma'lumotlari */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '16px',
              fontSize: '12.5px'
            }}
          >
            <div style={{ marginBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>{isRu ? 'Удаляемый груз:' : 'O\'chirilayotgan yuk:'} </span>
              <strong data-no-translate="true" style={{ color: '#0f172a' }}>{product.name}</strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: '#475569' }}>
              <div>
                <span>{isRu ? 'Остаток:' : 'Qoldiq:'} </span>
                <strong style={{ color: '#059669' }}>
                  {product.quantity.toLocaleString('uz-UZ')} {product.unit} ({product.weightKg.toLocaleString('uz-UZ')} kg)
                </strong>
              </div>
              <div>
                <span>{isRu ? 'Сектор:' : 'Sektor:'} </span>
                <strong style={{ color: '#002d62' }}>{product.sectorName}</strong>
              </div>
              <div>
                <span>{isRu ? 'Клиент:' : 'Mijoz:'} </span>
                <strong>{product.clientName || '—'}</strong>
              </div>
              <div>
                <span>{isRu ? 'Дата прихода:' : 'Kirim sanasi:'} </span>
                <strong>{product.entryDate || '—'}</strong>
              </div>
            </div>
          </div>

          {/* Tezkor sabab shablonlari */}
          <div style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '11px', color: '#475569', marginBottom: '6px' }}>
              {isRu ? 'Быстрый выбор причины:' : 'Tezkor sababni tanlash:'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {PRESET_REASONS.map((pReason, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReason(pReason)}
                  style={{
                    fontSize: '11px',
                    padding: '4px 9px',
                    borderRadius: '6px',
                    border: reason === pReason ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    background: reason === pReason ? '#fee2e2' : '#ffffff',
                    color: reason === pReason ? '#991b1b' : '#334155',
                    cursor: 'pointer',
                    fontWeight: reason === pReason ? 700 : 500,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {pReason}
                </button>
              ))}
            </div>
          </div>

          {/* O'chirish sababi maydoni (Majburiy) */}
          <div className="form-field" style={{ marginBottom: '4px' }}>
            <label className="form-label" style={{ color: '#991b1b', fontWeight: 800 }}>
              {isRu ? 'ПРИЧИНА УДАЛЕНИЯ (ОБЯЗАТЕЛЬНО) *' : 'O\'CHIRISH SABABI (MAJBURIY) *'}
            </label>
            <textarea
              rows={3}
              required
              className="form-input-clean"
              style={{
                border: '1.5px solid #fca5a5',
                background: '#ffffff',
                fontSize: '13px'
              }}
              placeholder={isRu ? 'Укажите подробную причину удаления груза...' : 'Nima sababdan yuk hisobdan o\'chirilmoqda? Batafsil yozing...'}
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer-clean" style={{ background: '#f8fafc', padding: '14px 20px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            {isRu ? 'Отмена' : 'Bekor qilish'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting || !reason.trim()}
            className="btn-primary"
            style={{
              background: '#dc2626',
              border: 'none',
              fontWeight: 800,
              opacity: isDeleting || !reason.trim() ? 0.6 : 1,
              cursor: isDeleting || !reason.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {isDeleting
              ? (isRu ? 'Удаление...' : 'O\'chirilmoqda...')
              : (isRu ? '🗑️ Удалить груз безвозвратно' : '🗑️ Yukni Butunlay O\'chirish')}
          </button>
        </div>
      </div>
    </div>
  );
};
