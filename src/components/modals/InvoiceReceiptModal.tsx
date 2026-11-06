import React from 'react';
import { CargoMovement, ContractPayer, Language } from '@/lib/types';
import { formatUnloadingServiceName, formatLoadingServiceName } from '@/lib/customs-formatters';

interface InvoiceReceiptModalProps {
  movement: CargoMovement | null;
  canViewFinances: boolean;
  payers: ContractPayer[];
  lang?: Language;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  movement,
  canViewFinances,
  payers,
  lang = 'uz',
  onClose
}) => {
  if (!movement) return null;

  const isRu = lang === 'ru';
  const isEn = lang === 'en';

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
              {isRu ? 'ОФИЦИАЛЬНАЯ РАСХОДНАЯ НАКЛАДНАЯ' : isEn ? 'OFFICIAL OUTBOUND WAYBILL' : 'RASMIY CHIQIM NAKLADNOYI'}
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
                gap: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span>🖨️</span>
              <span>{isRu ? 'Печать (Print / PDF)' : isEn ? 'Print (PDF)' : 'Chop etish (Print / PDF)'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ color: '#cbd5e1', fontSize: '18px', padding: '2px 8px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Nakladnoy Tanasi */}
        <div id="jb-group-invoice" className="jb-invoice-print-area" style={{ padding: '28px 32px', background: '#ffffff', color: '#0f172a' }}>
          {/* Sarlavha */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #002d62', paddingBottom: '14px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/jb-logo.jpg" alt="JB GROUP" style={{ height: '44px', width: 'auto', borderRadius: '4px' }} />
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#002d62', margin: 0 }}>
                  {isRu ? 'ТАМОЖЕННЫЙ СКЛАД «JB GROUP»' : '«JB GROUP» BOJXONA OMBORI'}
                </h2>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {isRu ? 'Расчетная накладная услуг таможенного склада' : 'Bojxona ombori xizmatlari hisob-kitob nakladnoyi'}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'inline-block', padding: '2px 8px', background: movement.type === 'IN' ? '#ecfdf5' : '#eff6ff', color: movement.type === 'IN' ? '#047857' : '#1d4ed8', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                {movement.type === 'IN' 
                  ? (isRu ? '📥 ПРИХОДНАЯ НАКЛАДНАЯ' : '📥 RASMIY KIRIM NAKLADNOYI')
                  : (isRu ? '📤 РАСХОДНАЯ НАКЛАДНАЯ' : '📤 RASMIY CHIQIM NAKLADNOYI')}
              </span>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                № {movement.invoiceNo || movement.id}
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {isRu ? 'Дата:' : 'Sana:'} {movement.date} {movement.time}
              </span>
            </div>
          </div>

          {/* Tovar, Hajm, va Yuk Berilgan Tarafi */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '18px', display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '14px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                {isRu ? 'ТОВАР И ПАРАМЕТРЫ ХРАНЕНИЯ:' : 'TOVAR VA SAQLASH HAJMI:'}
              </span>
              <div data-no-translate="true" style={{ fontSize: '14px', fontWeight: 900, color: '#002d62', marginTop: '2px' }}>
                {movement.productName}
              </div>
              <div style={{ color: '#0f172a', marginTop: '4px', fontSize: '13px', fontWeight: 700 }}>
                {isRu ? 'Объем:' : 'Hajmi:'} {movement.quantity} {movement.unit}
                {movement.weightKg && (
                  <span style={{ color: '#059669', marginLeft: '6px' }}>
                    (⚖️ {movement.weightKg.toLocaleString('uz-UZ')} kg)
                  </span>
                )}
              </div>
              <div style={{ color: '#475569', marginTop: '3px' }}>
                {isRu ? 'Сектор:' : 'Sklad:'} <strong>{movement.sectorName}</strong>
                {movement.daysStored && (
                  <span style={{ marginLeft: '6px', color: '#059669', fontWeight: 700 }}>
                    • {movement.daysStored} {isRu ? 'дней хранения' : 'kun saqlangan'}
                  </span>
                )}
              </div>
              {movement.type === 'OUT' && (
                <div style={{ marginTop: '6px', fontSize: '11px', lineHeight: '1.6' }}>
                  <div style={{ color: '#0369a1', fontWeight: 700 }}>
                    📥 {isRu ? 'Разгрузка при приходе:' : 'Tushirilgan transport (Разгрузка):'} <strong>{formatUnloadingServiceName(movement.unloadingType || movement.transportType || (isRu ? 'Разгрузка' : 'Kirimda yuk tushirish'), lang)}</strong>
                  </div>
                  <div style={{ color: '#b91c1c', fontWeight: 700 }}>
                    🚛 {isRu ? 'Погрузка при выдаче:' : 'Yuk ortilgan transport (Погрузка):'} <strong>{formatLoadingServiceName(movement.loadingType || (isRu ? 'Погрузка' : 'Yuk ortish'), lang)}</strong>
                  </div>
                </div>
              )}
              {movement.placedBy && (
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>
                  {isRu ? 'Принял сотрудник:' : 'Keltirgan mas\'ul:'} <strong>{movement.placedBy}</strong>
                </div>
              )}
            </div>

            <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '14px' }}>
              <span style={{ color: '#dc2626', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                {isRu ? 'ПОЛУЧАТЕЛЬ ГРУЗА (ПЛАТЕЛЬЩИК):' : 'YUK BERILGAN TARAFI (QABUL QILUVCHI):'}
              </span>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                🏢 {movement.receiverName || movement.clientName || (isRu ? 'Неизвестная организация' : "Noma'lum Korxona")}
              </div>
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#0284c7', fontWeight: 800 }}>
                {isRu ? 'ИНН:' : 'STIR (INN):'} <code style={{ fontSize: '13px', background: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>{payerInn}</code>
              </div>
              {movement.receiverPerson ? (
                <div style={{ color: '#334155', fontSize: '12px', marginTop: '3px' }}>
                  {isRu ? 'Представитель получателя:' : 'Qabul qilib oluvchi vakil:'} <strong>{movement.receiverPerson}</strong>
                </div>
              ) : (
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>
                  {isRu ? 'Плательщик:' : 'To\'lovchi (Mijoz):'} <strong>{movement.clientName || '—'}</strong>
                </div>
              )}
              {movement.userName && (
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>
                  {isRu ? 'Выдал сотрудник:' : 'Chiqargan mas\'ul:'} <strong>{movement.userName}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Ko'rsatilgan xizmatlar va To'lov Jadvali */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
              {canViewFinances 
                ? (isRu ? '📋 ОКАЗАННЫЕ УСЛУГИ И РАСЧЕТ ОПЛАТЫ:' : '📋 KO\'RSATILGAN XIZMATLAR VA TO\'LOV:')
                : (isRu ? '📋 СПИСОК ОКАЗАННЫХ УСЛУГ И ОПЕРАЦИЙ:' : '📋 KO\'RSATILGAN XIZMATLAR VA HARAKATLAR RO\'YXATI:')}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#002d62', color: '#ffffff', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 10px', width: '30px', textAlign: 'center' }}>№</th>
                  <th style={{ padding: '8px 10px' }}>{isRu ? 'Наименование Услуги' : 'Ko\'rsatilgan Xizmat'}</th>
                  {canViewFinances ? (
                    <>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>{isRu ? 'Базовая Цена' : 'Bazaviy Narx'}</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>{isRu ? 'НДС 12%' : '12% QQS'}</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>{isRu ? 'Итого' : 'Jami Summa'}</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>{isRu ? 'Ед. изм.' : 'O\'lchov Birligi'}</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>{isRu ? 'Количество' : 'Hajmi / Miqdori'}</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>{isRu ? 'Статус' : 'Holati'}</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {movement.type === 'OUT' && movement.servicesApplied && movement.servicesApplied.length > 0 ? (
                  movement.servicesApplied.map((svc, idx) => {
                    const isStorage = svc.name.toLowerCase().includes('saqlash') || svc.name.toLowerCase().includes('хранен');
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                        <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                          {(() => {
                            let displayName = svc.name;
                            const lower = displayName.toLowerCase();
                            if (lower.includes('tushirish') || lower.includes('разгруз') || movement.type === 'IN') {
                              displayName = formatUnloadingServiceName(displayName, lang);
                            } else if (lower.includes('ortish') || lower.includes('погруз')) {
                              displayName = formatLoadingServiceName(displayName, lang);
                            }
                            return displayName;
                          })()}
                          {isStorage && (
                            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
                              {canViewFinances 
                                ? (movement.storageFormula || `Hajmi: ${(movement.weightKg || 0).toLocaleString('uz-UZ')} kg × ${movement.daysStored || 1} ${isRu ? 'дней' : 'kun'}`)
                                : `${isRu ? 'Срок хранения:' : 'Saqlangan muddati:'} ${movement.daysStored || 1} ${isRu ? 'дней' : 'kun'}`
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
                              {isRu ? 'Выполнено ✅' : 'Bajarildi ✅'}
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
                            {isRu ? 'Разгрузка на склад' : 'Yukni tushirish (Разгрузка)'}: {formatUnloadingServiceName(movement.unloadingType || movement.transportType || (isRu ? 'Разгрузка' : '1 martalik'), lang)}
                          </td>
                          {canViewFinances ? (
                            <>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                {Math.round((movement.obrabotkaCostUZS || 0) / 1.12).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                {((movement.obrabotkaCostUZS || 0) - Math.round((movement.obrabotkaCostUZS || 0) / 1.12)).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                {(movement.obrabotkaCostUZS || 0).toLocaleString('uz-UZ')} UZS
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '8px 10px', textAlign: 'center' }}>{isRu ? 'разовый' : '1 transport'}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>1</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#166534', fontWeight: 700 }}>{isRu ? 'Выполнено ✅' : 'Bajarildi ✅'}</td>
                            </>
                          )}
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                          <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>2</td>
                          <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                            {isRu ? 'Хранение на таможенном складе' : 'Bojxona omborida saqlash xizmati'}
                            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
                              {movement.daysStored || 1} {isRu ? 'суток хранения' : 'kun saqlangan'}
                            </span>
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
                              <td style={{ padding: '8px 10px', textAlign: 'center' }}>{isRu ? 'посуточно' : 'kunlik'}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>{movement.daysStored || 1} {isRu ? 'дней' : 'kun'}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#166534', fontWeight: 700 }}>{isRu ? 'Выполнено ✅' : 'Bajarildi ✅'}</td>
                            </>
                          )}
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                          <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>3</td>
                          <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                            {isRu ? 'Погрузка со склада' : 'Yukni ortish (Погрузка)'}: {formatLoadingServiceName(movement.loadingType || (isRu ? 'Погрузка' : 'Yuk ortish xizmati'), lang)}
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
                              <td style={{ padding: '8px 10px', textAlign: 'center' }}>{isRu ? 'разовый' : '1 transport'}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>1</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#166534', fontWeight: 700 }}>{isRu ? 'Выполнено ✅' : 'Bajarildi ✅'}</td>
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
                {isRu ? 'ИТОГО К ОПЛАТЕ:' : 'JAMI TO\'LOV QILINISHI KERAK:'}
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
                  {isRu ? 'Финансовые данные скрыты' : 'Moliyaviy ma\'lumotlar yashirilgan'}
                </strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {isRu 
                    ? 'В вашей учетной записи ограничен просмотр финансовых расчетов и сумм.'
                    : 'Sizning foydalanuvchi hisobingizda moliyaviy hisob-kitoblar va summalarni ko\'rish huquqi cheklangan.'}
                </span>
              </div>
            </div>
          )}

          {/* Imzolar qismi */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '28px', paddingTop: '18px', borderTop: '1px dashed #cbd5e1', fontSize: '11px' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '30px' }}>
                {isRu ? 'Сдал (Ответственный сотрудник «JB GROUP»):' : 'Topshirdi («JB GROUP» mas\'ul xodimi):'}
              </span>
              <div style={{ borderBottom: '1px solid #94a3b8', paddingBottom: '4px', fontWeight: 700 }}>
                {movement.userName || 'Alisher Qodirov'} _______________
              </div>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '30px' }}>
                {isRu ? 'Принял (Клиент / Представитель):' : 'Qabul qilib oldi (Mijoz / Qabul qiluvchi):'}
              </span>
              <div style={{ borderBottom: '1px solid #94a3b8', paddingBottom: '4px', fontWeight: 700 }}>
                {movement.receiverPerson || (isRu ? 'Представитель' : 'Vakil')} _______________
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
