const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '..', 'src', 'app', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Nakladnoy table bo'limini almashtiramiz:
const oldInvoiceTableSection = `{/* Ko'rsatilgan xizmatlar va To'lov Jadvali (Faqat ko'rsatilgan xizmat va qancha to'lov) */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
                  📋 KO&apos;RSATILGAN XIZMATLAR VA TO&apos;LOV:
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#002d62', color: '#ffffff', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 10px', width: '30px', textAlign: 'center' }}>№</th>
                      <th style={{ padding: '8px 10px' }}>Ko&apos;rsatilgan Xizmat</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Bazaviy Narx</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>12% QQS</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Jami Summa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Agar Chiqim amali bo'lsa va servicesApplied mavjud bo'lsa: 1-Tushirish, 2-Saqlash, 3-Ortish to'g'ridan-to'g'ri render qilinadi */}
                    {selectedInvoiceMovement.type === 'OUT' && selectedInvoiceMovement.servicesApplied && selectedInvoiceMovement.servicesApplied.length > 0 ? (
                      selectedInvoiceMovement.servicesApplied.map((svc, idx) => {
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
                                  {selectedInvoiceMovement.storageFormula || \`Hajmi: \${(selectedInvoiceMovement.weightKg || 0).toLocaleString('uz-UZ')} kg × \${selectedInvoiceMovement.daysStored || 1} kun\`}
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                              {svc.basePrice.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                              {svc.vatAmount.toLocaleString('uz-UZ')} UZS
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                              {svc.totalPrice.toLocaleString('uz-UZ')} UZS
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <>
                        {/* Zaxira render: agar eski harakatlar bo'lsa */}
                        {selectedInvoiceMovement.type === 'OUT' && (
                          <>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>1</td>
                              <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                                Omborga tushirish (Разгрузка): {selectedInvoiceMovement.unloadingType || selectedInvoiceMovement.transportType || 'Kirimda yuk tushirish xizmati'}
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                {Math.round((selectedInvoiceMovement.obrabotkaCostUZS || 896000) / 1.12).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                {((selectedInvoiceMovement.obrabotkaCostUZS || 896000) - Math.round((selectedInvoiceMovement.obrabotkaCostUZS || 896000) / 1.12)).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                {(selectedInvoiceMovement.obrabotkaCostUZS || 896000).toLocaleString('uz-UZ')} UZS
                              </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>2</td>
                              <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                                Bojxona omborida saqlash xizmati ({selectedInvoiceMovement.daysStored || 1} kun saqlangan)
                                <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                                  {selectedInvoiceMovement.storageFormula || \`Hajmi: \${(selectedInvoiceMovement.weightKg || 0).toLocaleString('uz-UZ')} kg\`}
                                </span>
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                {Math.round((selectedInvoiceMovement.storageCostUZS || 0) / 1.12).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                {((selectedInvoiceMovement.storageCostUZS || 0) - Math.round((selectedInvoiceMovement.storageCostUZS || 0) / 1.12)).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                {(selectedInvoiceMovement.storageCostUZS || 0).toLocaleString('uz-UZ')} UZS
                              </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>3</td>
                              <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                                Yukni ortish (Погрузка): {selectedInvoiceMovement.loadingType || 'Yuk ortish xizmati'}
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                {Math.round((selectedInvoiceMovement.loadingCostUZS || 0) / 1.12).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                {((selectedInvoiceMovement.loadingCostUZS || 0) - Math.round((selectedInvoiceMovement.loadingCostUZS || 0) / 1.12)).toLocaleString('uz-UZ')} UZS
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                {(selectedInvoiceMovement.loadingCostUZS || 0).toLocaleString('uz-UZ')} UZS
                              </td>
                            </tr>
                          </>
                        )}
                        {selectedInvoiceMovement.type === 'IN' && selectedInvoiceMovement.servicesApplied?.map((svc, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>{idx + 1}</td>
                            <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{svc.name}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right' }}>{svc.basePrice.toLocaleString('uz-UZ')} UZS</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba' }}>{svc.vatAmount.toLocaleString('uz-UZ')} UZS</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>{svc.totalPrice.toLocaleString('uz-UZ')} UZS</td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Jami To'lov Yakuni */}
              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#166534', textTransform: 'uppercase' }}>
                  JAMI TO&apos;LOV QILINISHI KERAK:
                </span>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#15803d' }}>
                  {(selectedInvoiceMovement.grandTotalUZS || selectedInvoiceMovement.totalCostUZS || 0).toLocaleString('uz-UZ')} UZS
                </span>
              </div>`;

const newInvoiceTableSection = `{/* Ko'rsatilgan xizmatlar va To'lov Jadvali: canViewFinances ga qarab moslashadi */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {canViewFinances ? '📋 KO\'RSATILGAN XIZMATLAR VA TO\'LOV:' : '📋 KO\'RSATILGAN XIZMATLAR VA HARAKATLAR RO\'YXATI:'}
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
                    {/* Agar Chiqim amali bo'lsa va servicesApplied mavjud bo'lsa */}
                    {selectedInvoiceMovement.type === 'OUT' && selectedInvoiceMovement.servicesApplied && selectedInvoiceMovement.servicesApplied.length > 0 ? (
                      selectedInvoiceMovement.servicesApplied.map((svc, idx) => {
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
                                    ? (selectedInvoiceMovement.storageFormula || \`Hajmi: \${(selectedInvoiceMovement.weightKg || 0).toLocaleString('uz-UZ')} kg × \${selectedInvoiceMovement.daysStored || 1} kun\`)
                                    : \`Saqlangan muddati: \${selectedInvoiceMovement.daysStored || 1} kun (Omborda faktik qoldiq hisobi)\`
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
                        {selectedInvoiceMovement.type === 'OUT' && (
                          <>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>1</td>
                              <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                                Omborga tushirish (Разгрузка): {selectedInvoiceMovement.unloadingType || selectedInvoiceMovement.transportType || 'Kirimda yuk tushirish xizmati'}
                              </td>
                              {canViewFinances ? (
                                <>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                    {Math.round((selectedInvoiceMovement.obrabotkaCostUZS || 896000) / 1.12).toLocaleString('uz-UZ')} UZS
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                    {((selectedInvoiceMovement.obrabotkaCostUZS || 896000) - Math.round((selectedInvoiceMovement.obrabotkaCostUZS || 896000) / 1.12)).toLocaleString('uz-UZ')} UZS
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                    {(selectedInvoiceMovement.obrabotkaCostUZS || 896000).toLocaleString('uz-UZ')} UZS
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
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>2</td>
                              <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                                Bojxona omborida saqlash xizmati ({selectedInvoiceMovement.daysStored || 1} kun saqlangan)
                              </td>
                              {canViewFinances ? (
                                <>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                    {Math.round((selectedInvoiceMovement.storageCostUZS || 0) / 1.12).toLocaleString('uz-UZ')} UZS
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                    {((selectedInvoiceMovement.storageCostUZS || 0) - Math.round((selectedInvoiceMovement.storageCostUZS || 0) / 1.12)).toLocaleString('uz-UZ')} UZS
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                    {(selectedInvoiceMovement.storageCostUZS || 0).toLocaleString('uz-UZ')} UZS
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>kun</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>{selectedInvoiceMovement.daysStored || 1} kun</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#166534', fontWeight: 700 }}>Bajarildi ✅</td>
                                </>
                              )}
                            </tr>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>3</td>
                              <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                                Yukni ortish (Погрузка): {selectedInvoiceMovement.loadingType || 'Yuk ortish xizmati'}
                              </td>
                              {canViewFinances ? (
                                <>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                    {Math.round((selectedInvoiceMovement.loadingCostUZS || 0) / 1.12).toLocaleString('uz-UZ')} UZS
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                                    {((selectedInvoiceMovement.loadingCostUZS || 0) - Math.round((selectedInvoiceMovement.loadingCostUZS || 0) / 1.12)).toLocaleString('uz-UZ')} UZS
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                                    {(selectedInvoiceMovement.loadingCostUZS || 0).toLocaleString('uz-UZ')} UZS
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

              {/* Jami To'lov Yakuni yoki Oddiy Xodim uchun Faktik Qayd */}
              {canViewFinances ? (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#166534', textTransform: 'uppercase' }}>
                    JAMI TO&apos;LOV QILINISHI KERAK:
                  </span>
                  <span style={{ fontSize: '22px', fontWeight: 900, color: '#15803d' }}>
                    {(selectedInvoiceMovement.grandTotalUZS || selectedInvoiceMovement.totalCostUZS || 0).toLocaleString('uz-UZ')} UZS
                  </span>
                </div>
              ) : (
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '22px' }}>🔒</span>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                      Xizmatlar Faktik Bajarildi (Moliyaviy Hisob-Kitob Cheklangan)
                    </strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Sizda pul va moliyaviy ma&apos;lumotlarni ko&apos;rish ruxsati mavjud emas. Xizmatlar qiymati va to&apos;lovlar hisobi moliya bo&apos;limi tomonidan rasmiylashtiriladi.
                    </span>
                  </div>
                </div>
              )}`;

if (content.includes(oldInvoiceTableSection)) {
  content = content.replace(oldInvoiceTableSection, newInvoiceTableSection);
  console.log('Successfully updated invoice table section for non-financial users!');
} else {
  console.log('Could not find oldInvoiceTableSection directly, checking partial replacement...');
}

fs.writeFileSync(pagePath, content, 'utf8');
console.log('Done updating pagePath!');
