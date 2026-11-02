import React from 'react';
import { StoredProduct, Language } from '@/lib/types';
import { t } from '@/lib/i18n';

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

const PRESET_REASONS = [
  'Kirimda xato kiritilgan yuk',
  'Takroriy (dublikat) kirim',
  'Boshqa omborga adashib kiritilgan',
  'Mijoz tomonidan bekor qilindi'
];

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
                Yukni Tizimdan O&apos;chirish (Tasdiqlash)
              </h3>
              <span style={{ fontSize: '11.5px', color: '#b91c1c', display: 'block', marginTop: '2px' }}>
                Kiritilgan yukni ombor hisobidan butunlay o&apos;chirish
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
              <strong>DIQQAT:</strong> Ushbu amal yukni ombordan o&apos;chiradi. O&apos;chirilganlik to&apos;g&apos;risidagi
              to&apos;liq ma&apos;lumot (kim, qachon, qaysi yuk va nima sababdan o&apos;chirgani) rasmiy ravishda
              <strong> &ldquo;Tahrirlar&rdquo; (Исправления)</strong> bo&apos;limiga kiritiladi va oylik hisobotda ko&apos;rinadi.
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>YUK NOMI:</span>
                <strong style={{ color: '#0f172a', fontSize: '13px' }}>{product.name}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>SEKTOR:</span>
                <strong style={{ color: '#0284c7' }}>{product.sectorName}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>MIQDOR VA OG&apos;IRLIK:</span>
                <strong style={{ color: '#0f172a' }}>
                  {product.quantity} {product.unit} ({product.weightKg || 0} kg)
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>MIJOZ / TO&apos;LOVCHI:</span>
                <strong style={{ color: '#0f172a' }}>{product.clientName || '—'}</strong>
              </div>
            </div>
          </div>

          {/* O'chirish sababi */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11.5px',
                fontWeight: 800,
                color: '#334155',
                marginBottom: '6px',
                textTransform: 'uppercase'
              }}
            >
              O&apos;chirish Sababi (Majburiy) *
            </label>

            {/* Tezkor variantlar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {PRESET_REASONS.map(pr => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => setReason(pr)}
                  style={{
                    background: reason === pr ? '#fee2e2' : '#f1f5f9',
                    border: reason === pr ? '1px solid #ef4444' : '1px solid #cbd5e1',
                    color: reason === pr ? '#991b1b' : '#475569',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {pr}
                </button>
              ))}
            </div>

            <textarea
              required
              rows={3}
              className="form-input-clean"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '13px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              placeholder="Masalan: Kirimda noto'g'ri raqam bilan xato kiritilgan yuk..."
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="modal-footer-clean"
          style={{
            padding: '14px 20px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
          }}
        >
          <button
            type="button"
            className="btn-outline"
            onClick={onClose}
            disabled={isDeleting}
            style={{ fontWeight: 700, padding: '7px 16px' }}
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting || !reason.trim()}
            style={{
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 18px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: isDeleting || !reason.trim() ? 'not-allowed' : 'pointer',
              opacity: isDeleting || !reason.trim() ? 0.6 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🗑️</span>
            <span>{isDeleting ? 'O\'chirilmoqda...' : 'Ha, Butunlay O\'chirish'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

