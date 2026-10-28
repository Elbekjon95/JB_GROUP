import React from 'react';
import { CargoMovement, ContractPayer } from '@/lib/types';

interface InvoiceReceiptModalProps {
  movement: CargoMovement | null;
  canViewFinances: boolean;
  payers: ContractPayer[];
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  movement,
  canViewFinances,
  payers,
  onClose
}) => {
  if (!movement) return null;

  const payerInn = movement.receiverInn || 
    payers.find(p => p.name === (movement.receiverName || movement.clientName))?.inn || 
    '308942115';

  return (
    <div className="modal-overlay invoice-print-overlay" style={{ zIndex: 99999 }}>
      <div
        className="modal-dialog invoice-modal-container"
        style={{
          maxWidth: '680px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '0',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(15, 43, 72, 0.25)'
        }}
      >
        {/* Modal Boshqaruvi (Chop etishda yashirinadi) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            background: '#0f2b48',
            color: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🧾</span>
            <strong style={{ fontSize: '13px' }}>
              RASMIY CHIQIM NAKLADNOYI
            </strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🖨️</span>
              <span>Chop etish (Print / PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ color: '#cbd5e1', fontSize: '18px', padding: '2px 8px', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Oddiy va Sodda Nakladnoy Tanasi */}
        <div id="jb-group-invoice" className="jb-invoice-print-area" style={{ padding: '28px 32px', background: '#ffffff', color: '#0f172a' }}>
          {/* Sarlavha */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #002d62', paddingBottom: '14px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/jb-logo.jpg" alt="JB GROUP" style={{ height: '44px', width: 'auto', borderRadius: '4px' }} />
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#002d62', margin: 0 }}>
                  «JB GROUP» BOJXONA OMBORI
                </h2>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Bojxona ombori xizmatlari hisob-kitob nakladnoyi
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'inline-block', padding: '2px 8px', background: movement.type === 'IN' ? '#ecfdf5' : '#eff6ff', color: movement.type === 'IN' ? '#047857' : '#1d4ed8', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                📤 RASMIY CHIQIM NAKLADNOYI
              </span>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                № {movement.invoiceNo || movement.id}
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Sana: {movement.date} {movement.time}
              </span>
            </div>
          </div>

          {/* Tovar, Hajm, va Yuk Berilgan Tarafi */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '18px', display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '14px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>TOVAR VA SAQLASH HAJMI:</span>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#002d62', marginTop: '2px' }}>
                {movement.productName}
              </div>
              <div style={{ color: '#0f172a', marginTop: '4px', fontSize: '13px', fontWeight: 700 }}>
                Hajmi: {movement.quantity} {movement.unit}
                {movement.weightKg && (
                  <span style={{ color: '#059669', marginLeft: '6px' }}>
                    (⚖️ {movement.weightKg.toLocaleString('uz-UZ')} kg)
                  </span>
                )}
              </div>
              <div style={{ color: '#475569', marginTop: '3px' }}>
                Sklad: <strong>{movement.sectorName}</strong>
                {movement.daysStored && (
                  <span style={{ marginLeft: '6px', color: '#059669', fontWeight: 700 }}>
                    • {movement.daysStored} kun saqlangan
                  </span>
                )}
              </div>
              {movement.type === 'OUT' && (
                <div style={{ marginTop: '6px', fontSize: '11px', lineHeight: '1.6' }}>
                  <div style={{ color: '#0369a1', fontWeight: 700 }}>
                    📥 Tushirilgan transport (Разгрузка): <strong>{movement.unloadingType || movement.transportType || 'Kirimda yuk tushirish'}</strong>
                  </div>
                  <div style={{ color: '#b91c1c', fontWeight: 700 }}>
                    🚛 Yuk ortilgan transport (Погрузка): <strong>{movement.loadingType || 'Yuk ortish'}</strong>
                  </div>
                </div>
              )}
              {movement.type === 'IN' && movement.transportType && (
                <div style={{ color: '#0284c7', fontSize: '11px', marginTop: '3px', fontWeight: 700 }}>
                  🚛 Kelgan transport: <strong>{movement.transportType}</strong>
                </div>
              )}
              {movement.placedBy && (
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>
                  Keltirgan mas&apos;ul: <strong>{movement.placedBy}</strong>
                </div>
              )}
            </div>

            <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '14px' }}>
              <span style={{ color: '#dc2626', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>YUK BERILGAN TARAFI (QABUL QILUVCHI):</span>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                🏢 {movement.receiverName || movement.clientName || "Noma'lum Korxona"}
              </div>
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#0284c7', fontWeight: 800 }}>
                STIR (INN): <code style={{ fontSize: '13px', background: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>{payerInn}</code>
              </div>
              {movement.receiverPerson ? (
                <div style={{ color: '#334155', fontSize: '12px', marginTop: '3px' }}>
                  Qabul qilib oluvchi vakil: <strong>{movement.receiverPerson}</strong>
                </div>
              ) : (
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>
                  To&apos;lovchi (Mijoz): <strong>{movement.clientName || "Noma'lum"}</strong>
                </div>
              )}
              {movement.userName && (
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>
                  Chiqargan mas&apos;ul: <strong>{movement.userName}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Ko'rsatilgan xizmatlar va To'lov Jadvali */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
              {canViewFinances ? "📋 KO'RSATILGAN XIZMATLAR VA TO'LOV:" : "📋 KO'RSATILGAN XIZMATLAR VA HARAKATLAR RO'YXATI:"}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#002d62', color: '#ffffff', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 10px', width: '30px', textAlign: 'center' }}>№</th>
                  <th style={{ padding: '8px 10px' }}>Ko&apos;rsatilgan Xizmat</th>
                  {canViewFinances ? (
                    <>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Bazaviy Narx</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>12% QQS</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Jami Summa</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>O&apos;lchov Birligi</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>Hajmi / Miqdori</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>Holati</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {movement.type === 'OUT' && movement.servicesApplied && movement.servicesApplied.length > 0 ? (
                  movement.servicesApplied.map((svc, idx) => {
                    const isStorage = svc.name.toLowerCase().includes('saqlash');
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                        <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                          {svc.name}
                          {isStorage && (
                            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
                              {canViewFinances 
                                ? (movement.storageFormula || `Hajmi: ${(movement.weightKg || 0).toLocaleString('uz-UZ')} kg × ${movement.daysStored || 1} kun`)
                                : `Saqlangan muddati: ${movement.daysStored || 1} kun (Omborda faktik qoldiq hisobi)`
                              }
                            </span>
                          )}
                        </td>
                        {canViewFinances ? (
                          <>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                              {svc.basePrice.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                              {svc.vatAmount.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                              {svc.totalPrice.toLocaleString('uz-UZ')} UZS
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '8px 10px', textAlign: 'center', color: '#475569' }}>
                              {svc.unit}
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#0284c7' }}>
                              {svc.quantity}
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'center', color: '#166534', fontWeight: 700 }}>
                              Bajarildi ✅
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <>
                    {movement.type === 'OUT' && (
                      <>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                          <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>1</td>
                          <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                            Omborga tushirish (Разгрузка): {movement.unloadingType || movement.transportType || 'Kirimda yuk tushirish xizmati'} (⚡ 1 martalik to&apos;lov)
                          </td>
                          {canViewFinances ? (
                            <>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                {Math.round((movement.obrabotkaCostUZS || 896000) / 1.12).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                {((movement.obrabotkaCostUZS || 896000) - Math.round((movement.obrabotkaCostUZS || 896000) / 1.12)).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                {(movement.obrabotkaCostUZS || 896000).toLocaleString('uz-UZ')} UZS
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '8px 10px', textAlign: 'center' }}>1 martalik</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>1</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#166534', fontWeight: 700 }}>Bajarildi ✅</td>
                            </>
                          )}
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>2</td>
                          <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                            Bojxona omborida saqlash xizmati (📅 {movement.daysStored || 1} kun saqlangan — FAQAT saqlash kuniga ko&apos;paytiriladi)
                          </td>
                          {canViewFinances ? (
                            <>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                {Math.round((movement.storageCostUZS || 0) / 1.12).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                {((movement.storageCostUZS || 0) - Math.round((movement.storageCostUZS || 0) / 1.12)).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                {(movement.storageCostUZS || 0).toLocaleString('uz-UZ')} UZS
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '8px 10px', textAlign: 'center' }}>kunlik</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>{movement.daysStored || 1} kun</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#166534', fontWeight: 700 }}>Bajarildi ✅</td>
                            </>
                          )}
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                          <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>3</td>
                          <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                            Yukni ortish (Погрузка): {movement.loadingType || 'Yuk ortish xizmati'} (⚡ 1 martalik to&apos;lov)
                          </td>
                          {canViewFinances ? (
                            <>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                {Math.round((movement.loadingCostUZS || 0) / 1.12).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                {((movement.loadingCostUZS || 0) - Math.round((movement.loadingCostUZS || 0) / 1.12)).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                {(movement.loadingCostUZS || 0).toLocaleString('uz-UZ')} UZS
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '8px 10px', textAlign: 'center' }}>1 transport</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>1</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#166534', fontWeight: 700 }}>Bajarildi ✅</td>
                            </>
                          )}
                        </tr>
                      </>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Jami To'lov Yakuni */}
          {canViewFinances ? (
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#166534', textTransform: 'uppercase' }}>
                JAMI TO&apos;LOV QILINISHI KERAK:
              </span>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#15803d' }}>
                {(movement.grandTotalUZS || movement.totalCostUZS || 0).toLocaleString('uz-UZ')} UZS
              </span>
            </div>
          ) : (
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '22px' }}>🔒</span>
              <div>
                <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                  Moliyaviy ma&apos;lumotlar yashirilgan
                </strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Sizning foydalanuvchi hisobingizda moliyaviy hisob-kitoblar va summalarni ko&apos;rish huquqi cheklangan.
                </span>
              </div>
            </div>
          )}

          {/* Imzolar qismi */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '28px', paddingTop: '18px', borderTop: '1px dashed #cbd5e1', fontSize: '11px' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '30px' }}>
                Topshirdi («JB GROUP» mas&apos;ul xodimi):
              </span>
              <div style={{ borderBottom: '1px solid #94a3b8', paddingBottom: '4px', fontWeight: 700 }}>
                {movement.userName || 'Alisher Qodirov'} _______________
              </div>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '30px' }}>
                Qabul qilib oldi (Mijoz / Qabul qiluvchi):
              </span>
              <div style={{ borderBottom: '1px solid #94a3b8', paddingBottom: '4px', fontWeight: 700 }}>
                {movement.receiverPerson || 'Vakil'} _______________
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

