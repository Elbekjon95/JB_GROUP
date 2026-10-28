import React from 'react';
import { StoredProduct, Warehouse, CargoMovement } from '@/lib/types';

interface ProductHistoryModalProps {
  product: StoredProduct | null;
  warehouse: Warehouse;
  canViewFinances: boolean;
  canStockMovement: boolean;
  onClose: () => void;
  onOpenExit: (prod: StoredProduct) => void;
  onViewInvoice: (movement: CargoMovement) => void;
  calculateDaysStored: (dateStr: string) => number;
}

export const ProductHistoryModal: React.FC<ProductHistoryModalProps> = ({
  product,
  warehouse,
  canViewFinances,
  canStockMovement,
  onClose,
  onOpenExit,
  onViewInvoice,
  calculateDaysStored
}) => {
  if (!product) return null;

  const initialQty = product.initialQuantity || product.quantity || 1;
  const currentQty = product.quantity;
  const exitedQty = Math.max(0, initialQty - currentQty);
  const initialWeight = product.initialWeightKg || product.weightKg || 1;
  const currentWeight = product.weightKg;
  const remainPct = Math.min(100, Math.max(0, Math.round((currentQty / initialQty) * 100)));
  const exitPct = 100 - remainPct;
  const totalDaysStored = calculateDaysStored(product.entryDate);
  const currentSec = warehouse.sectors.find(s => s.id === product.sectorId);

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div
        className="modal-dialog"
        style={{
          maxWidth: '860px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '0',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(15, 43, 72, 0.25)'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)',
            color: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>📜</span>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 900, margin: 0, letterSpacing: '-0.01em' }}>
                YUKNING TO&apos;LIQ HARAKAT TARIXI VA CHIQIMLAR ZANJIRI (TIMELINE)
              </h3>
              <span style={{ fontSize: '11px', color: '#bfdbfe' }}>
                Partiya ID: <strong>{product.id}</strong> • Sektor: <strong>{product.sectorName}</strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ color: '#ffffff', fontSize: '20px', padding: '2px 8px', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Modal Tanasi */}
        <div style={{ padding: '24px', maxHeight: '82vh', overflowY: 'auto' }}>
          {/* 1. YUK PASPORTI VA ZAXIRA BALANSI */}
          <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '18px', marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', background: currentQty > 0 ? '#dcfce7' : '#fee2e2', color: currentQty > 0 ? '#15803d' : '#991b1b', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                    {currentQty > 0 ? '🟢 OMBORDA SAQLANMOQDA' : "🔴 TO'LIQ OMBORDAN CHIQARILGAN"}
                  </span>
                  {product.category && (
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Toifa: <strong>{product.category}</strong>
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#002d62', margin: '2px 0 6px 0' }}>
                  {product.name}
                </h2>
                <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div>
                    Mijoz / Tovar Egasi: <strong style={{ color: '#0f172a' }}>{product.clientName || "Noma'lum"}</strong>
                  </div>
                  <div>
                    Sektor / Harorat: <strong style={{ color: '#0284c7' }}>{product.sectorName}</strong>
                    {currentSec?.temperature && <span style={{ marginLeft: '6px', color: '#059669', fontWeight: 700 }}>({currentSec.temperature})</span>}
                  </div>
                  {product.contractNumber && (
                    <div>
                      Shartnoma raqami: <strong style={{ color: '#002d62' }}>{product.contractNumber}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'right', background: '#ffffff', padding: '12px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', minWidth: '220px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  OMBORDAGI JORIY QOLDIQ:
                </div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: currentQty > 0 ? '#059669' : '#dc2626', lineHeight: 1.2 }}>
                  {currentQty.toLocaleString('uz-UZ')} {product.unit}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0070ba', marginTop: '2px' }}>
                  ⚖️ {currentWeight.toLocaleString('uz-UZ')} kg
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', borderTop: '1px dashed #e2e8f0', paddingTop: '4px' }}>
                  Dastlabki: <strong>{initialQty.toLocaleString('uz-UZ')} {product.unit}</strong> ({initialWeight.toLocaleString('uz-UZ')} kg)
                </div>
              </div>
            </div>

            {/* Vizual Zaxira / Chiqim Balansi Bar */}
            <div style={{ marginTop: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', fontWeight: 700 }}>
                <span style={{ color: '#059669' }}>
                  Omborda qoldiq: {currentQty.toLocaleString('uz-UZ')} {product.unit} ({remainPct}%)
                </span>
                <span style={{ color: exitedQty > 0 ? '#dc2626' : '#94a3b8' }}>
                  Chiqarilgan: {exitedQty.toLocaleString('uz-UZ')} {product.unit} ({exitPct}%)
                </span>
              </div>
              <div style={{ height: '8px', background: '#fee2e2', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${remainPct}%`, background: '#10b981', transition: 'width 0.3s' }} />
                <div style={{ width: `${exitPct}%`, background: '#ef4444', transition: 'width 0.3s' }} />
              </div>
            </div>
          </div>

          {/* 2. YUKNING HAYOTIY TSIKLI TIMELINE */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '2px solid #002d62', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🕒</span>
                <strong style={{ fontSize: '15px', color: '#002d62', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  YUK HARAKATINING TO&apos;LIQ XRONOLOGIK TARIXI (ZANJIR)
                </strong>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                Kirim ➔ Saqlash ➔ Chiqim operatsiyalari
              </span>
            </div>

            <div style={{ position: 'relative', paddingLeft: '32px' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '12px',
                  bottom: '24px',
                  width: '3px',
                  background: '#cbd5e1',
                  borderRadius: '2px'
                }}
              />

              {/* BOSQICH 1: KIRIM */}
              <div style={{ position: 'relative', marginBottom: '22px' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '0',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    boxShadow: '0 0 0 3px #dcfce7'
                  }}
                >
                  📥
                </div>

                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: 800 }}>
                        📥 1-BOSQICH: OMBORGA QABUL QILISH VA BIRINCHI KIRITILISH (KIRIM)
                      </span>
                      <div style={{ fontSize: '13px', color: '#1e293b', marginTop: '4px', fontWeight: 700 }}>
                        Qabul qilingan sana va vaqt: <span style={{ color: '#002d62' }}>{product.entryDate} soat {product.entryTime}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '12px', marginTop: '8px' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Kiritilgan to&apos;liq hajm:</span>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>
                        {initialQty.toLocaleString('uz-UZ')} {product.unit}
                      </strong>
                      <span style={{ color: '#059669', fontWeight: 700, fontSize: '12px', display: 'block' }}>
                        ⚖️ {initialWeight.toLocaleString('uz-UZ')} kg ({Math.round(initialWeight / 1000)} tn)
                      </span>
                    </div>

                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Qabul qilgan mas&apos;ul xodim:</span>
                      <strong style={{ color: '#002d62', fontSize: '13px' }}>{product.placedBy}</strong>
                      <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Lavozimi: {product.placedByRole}</span>
                    </div>

                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Joylashtirilgan sektor:</span>
                      <strong style={{ color: '#0284c7', fontSize: '13px' }}>{product.sectorName}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Tushirish xizmati (Разгрузка):</span>
                      <strong style={{ color: '#002d62', fontSize: '12px' }}>
                        {product.obrabotkaService || 'Standart Tushirish (Разгрузка)'}
                      </strong>
                      {canViewFinances && (
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, display: 'block' }}>
                          To&apos;lovi: {((product.obrabotkaCost || 0) + (product.obrabotkaVat || 0)).toLocaleString('uz-UZ')} UZS
                        </span>
                      )}
                    </div>
                  </div>

                  {product.notes && (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#475569', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      📄 <strong>Birlamchi qabul hujjati / Asos:</strong> {product.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* BOSQICH 2: SAQLASH */}
              <div style={{ position: 'relative', marginBottom: '22px' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '0',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#0284c7',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    boxShadow: '0 0 0 3px #e0f2fe'
                  }}
                >
                  ⏱️
                </div>

                <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: 800 }}>
                      ⏱️ 2-BOSQICH: SAQLANISH REJIMI VA TARIF HISOBI
                    </span>
                    <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>
                      Hozirgacha: {totalDaysStored} kun saqlandi
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px' }}>Harorat va Sektor rejimi:</span>
                      <strong style={{ display: 'block', color: '#002d62' }}>
                        {currentSec?.temperature ? `${product.sectorName} (${currentSec.temperature})` : product.sectorName}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px' }}>Amaldagi kunlik tarif:</span>
                      <strong style={{ display: 'block', color: '#0284c7' }}>
                        {canViewFinances ? `${product.dailyRatePerUnit.toLocaleString('uz-UZ')} UZS / ${product.unit} / kun` : '🔒 Biriktirilgan tarif'}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px' }}>Tarif nomi:</span>
                      <strong style={{ display: 'block', color: '#475569' }}>
                        {product.tariffName || 'Sektor tarifi'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOSQICH 3: CHIQIMLAR */}
              <div style={{ position: 'relative', marginBottom: '22px' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '0',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#dc2626',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    boxShadow: '0 0 0 3px #fee2e2'
                  }}
                >
                  📤
                </div>

                <div style={{ background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: 800 }}>
                      📤 3-BOSQICH: OMBORDAN CHIQIM HARAKATLARI
                    </span>
                    <span style={{ fontSize: '11px', color: '#991b1b', fontWeight: 800 }}>
                      Chiqimlar soni: {product.exitHistory?.length || 0} ta
                    </span>
                  </div>

                  {product.exitHistory && product.exitHistory.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {product.exitHistory.map((rec, idx) => (
                        <div
                          key={rec.id}
                          style={{
                            background: '#ffffff',
                            border: '1.5px solid #fca5a5',
                            borderRadius: '10px',
                            padding: '14px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: '#dc2626', color: '#ffffff', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 800 }}>
                                  № {idx + 1}-CHIQIM AMALI
                                </span>
                                <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#991b1b', margin: 0 }}>
                                  № {rec.invoiceNo || ('NAK-OUT-' + rec.id.slice(-6))}
                                </h4>
                              </div>
                              <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '3px' }}>
                                Sana: <strong>{rec.exitDate} ({rec.exitTime})</strong> • Mas&apos;ul: <strong>{rec.exitedBy}</strong>
                              </span>
                            </div>

                            {canViewFinances && (
                              <button
                                type="button"
                                onClick={() => {
                                  const exitMove: CargoMovement = {
                                    id: rec.id,
                                    invoiceNo: rec.invoiceNo || ('NAK-OUT-' + rec.id.slice(-6)),
                                    productId: product.id,
                                    productName: product.name,
                                    type: 'OUT',
                                    quantity: rec.quantity,
                                    unit: product.unit,
                                    weightKg: rec.weightKg,
                                    initialQuantity: product.initialQuantity,
                                    initialWeightKg: product.initialWeightKg,
                                    remainingQuantity: rec.remainingQuantity,
                                    remainingWeightKg: rec.remainingWeightKg,
                                    userName: rec.exitedBy,
                                    userRole: rec.exitedByRole,
                                    placedBy: product.placedBy,
                                    placedDate: `${product.entryDate} ${product.entryTime}`,
                                    date: rec.exitDate,
                                    time: rec.exitTime,
                                    notes: rec.notes || 'Chiqim nakladnoyi',
                                    clientName: product.clientName,
                                    daysStored: rec.daysStored,
                                    sectorId: product.sectorId,
                                    sectorName: product.sectorName,
                                    tariffDailyRate: product.dailyRatePerUnit,
                                    storageCostUZS: rec.storageBaseCost + rec.storageVat,
                                    loadingType: rec.loadingService,
                                    loadingCostUZS: rec.loadingCost,
                                    servicesApplied: rec.additionalServices,
                                    totalCostUZS: rec.storageBaseCost,
                                    vatTotalUZS: rec.storageVat,
                                    grandTotalUZS: rec.totalCost
                                  };
                                  onViewInvoice(exitMove);
                                }}
                                className="btn-outline"
                                style={{
                                  background: '#fff5f5',
                                  borderColor: '#fca5a5',
                                  color: '#dc2626',
                                  fontWeight: 800,
                                  fontSize: '11px',
                                  padding: '6px 12px',
                                  cursor: 'pointer'
                                }}
                              >
                                🖨️ Nakladnoyni Chop Etish
                              </button>
                            )}
                          </div>

                          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', fontSize: '12px' }}>
                            <div>
                              <span style={{ color: '#64748b', fontSize: '11px' }}>Chiqarilgan yuk:</span>
                              <strong style={{ display: 'block', fontSize: '15px', color: '#dc2626' }}>
                                - {rec.quantity.toLocaleString('uz-UZ')} {product.unit}
                              </strong>
                              <span style={{ color: '#b91c1c', fontWeight: 800, fontSize: '11px' }}>
                                ⚖️ {rec.weightKg.toLocaleString('uz-UZ')} kg
                              </span>
                            </div>

                            <div>
                              <span style={{ color: '#64748b', fontSize: '11px' }}>Qolgan zaxira:</span>
                              <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>
                                {rec.remainingQuantity.toLocaleString('uz-UZ')} {product.unit}
                              </strong>
                              <span style={{ color: '#059669', fontWeight: 700, fontSize: '11px' }}>
                                ⚖️ {rec.remainingWeightKg.toLocaleString('uz-UZ')} kg
                              </span>
                            </div>

                            <div>
                              <span style={{ color: '#64748b', fontSize: '11px' }}>Saqlangan vaqti:</span>
                              <strong style={{ display: 'block', color: '#0f172a' }}>{rec.daysStored} kun</strong>
                            </div>

                            <div>
                              <span style={{ color: '#64748b', fontSize: '11px' }}>Chiqim to&apos;lovi:</span>
                              {canViewFinances ? (
                                <strong style={{ display: 'block', color: '#15803d', fontSize: '15px' }}>
                                  {rec.totalCost.toLocaleString('uz-UZ')} UZS
                                </strong>
                              ) : (
                                <strong style={{ display: 'block', color: '#94a3b8', fontSize: '13px' }}>
                                  🔒 Moliya hisobida
                                </strong>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', background: '#ffffff', border: '1.5px dashed #cbd5e1', borderRadius: '10px', color: '#64748b' }}>
                      <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>📦</span>
                      <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                        Ushbu yukdan hali chiqim qilinmagan
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Pastki Qismi */}
        <div className="modal-footer-clean">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Yopish
          </button>
          {canStockMovement && product.quantity > 0 && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => onOpenExit(product)}
              style={{ background: '#dc2626' }}
            >
              📤 Ushbu Tovardan Chiqim Qilish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

