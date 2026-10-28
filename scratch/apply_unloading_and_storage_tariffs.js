const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '..', 'src', 'app', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Karta va tarix modalidagi chiqim ochish tugmalarini almashtirish
const oldExitCall1 = `onClick={() => {
                                      setSelectedProductToExit(prod);
                                      setExitQuantity(prod.quantity);
                                      setExitWeightKg(prod.weightKg);
                                      setExitNotes('');
                                      const pMatch = payers.find(p => p.id === prod.payerId || p.name.toLowerCase() === prod.clientName?.toLowerCase());
                                      setExitReceiverInn(pMatch?.inn || '');
                                      setExitReceiverName(pMatch?.name || prod.clientName || '');
                                      setExitReceiverPerson(pMatch?.contactPerson || '');
                                      setIsExitModalOpen(true);
                                    }}`;

content = content.replace(oldExitCall1, `onClick={() => handleOpenExitModalForProduct(prod)}`);

// Agar tarix modalida ham bo'lsa:
content = content.replace(/setSelectedProductToExit\(selectedProductHistory\);\s*setExitQuantity\(selectedProductHistory\.quantity\);[\s\S]*?setIsExitModalOpen\(true\);/, `handleOpenExitModalForProduct(selectedProductHistory);`);

// 2. Chiqim modalidagi Ortish va Saqlash bo'limlarini yangilash
// Izlaymiz: {/* ======================================================== \s* YUKNI ORTISH VA YUKLASH (ПОГРУЗКА)
const exitModalLoadingSectionMarker = `{/* ========================================================
                    YUKNI ORTISH VA YUKLASH (ПОГРУЗКА) TRANSPORT TURI (FOYDALANUVCHI TALABI)
                    ======================================================== */}`;

const newExitModalServicesSections = `{/* ========================================================
                    1. OMBORGA TUSHIRISH (РАЗГРУЗКА) XIZMATI (FOYDALANUVCHI TALABI)
                    ======================================================== */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <label className="form-label" style={{ color: '#002d62', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📥</span>
                      <span>1. OMBORGA TUSHIRISH (РАЗГРУЗКА) XIZMATI *</span>
                    </span>
                    <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      Kirimda Ko'rsatilgan Xizmat
                    </span>
                  </label>
                  <select
                    className="form-select-clean"
                    value={selectedUnloadingServiceId}
                    onChange={e => setSelectedUnloadingServiceId(e.target.value)}
                    required
                    style={{ background: '#ffffff', fontWeight: 600 }}
                  >
                    {customsServices.filter(s => s.category === 'UNLOADING_LOADING').map(s => {
                      const cleanName = (s.nameUz || s.name)
                        .replace('ortish / tushirish', 'tushirish (Разгрузка)')
                        .replace('yuklash / tushirish', 'tushirish (Разгрузка)')
                        .replace('tushirish/ortish', 'tushirish (Разгрузка)');
                      return (
                        <option key={s.id} value={s.id}>
                          {cleanName} ({s.unit}) {canViewFinances ? \`— \${s.basePrice.toLocaleString('uz-UZ')} UZS (+12% QQS)\` : ''}
                        </option>
                      );
                    })}
                  </select>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                    «JB GROUP» Bojxona ombori: yuk omborga qabul qilinganda ko'rsatilgan tushirish (Разгрузка) xizmati. Ushbu xizmat summasi chiqim nakladnoyida aks ettiriladi.
                  </span>
                </div>

                {/* ========================================================
                    2. SAQLASH TARIFI (2-RASMDAGI RASMIY PREYSKURANT 10-19 BANDLAR) (FOYDALANUVCHI TALABI)
                    ======================================================== */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <label className="form-label" style={{ color: '#002d62', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📦</span>
                      <span>2. SAQLASH TARIFI (2-RASM PREYSKURANTI: 10–19 BANDLAR) *</span>
                    </span>
                    <span style={{ fontSize: '11px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      {exitBillingCalculation.daysStored} kun saqlangan
                    </span>
                  </label>
                  <select
                    className="form-select-clean"
                    value={selectedStorageTariffId}
                    onChange={e => setSelectedStorageTariffId(e.target.value)}
                    required
                    style={{ background: '#ffffff', fontWeight: 600 }}
                  >
                    {customsServices.filter(s => s.category === 'STORAGE').map(s => {
                      const cleanName = s.nameUz || s.name;
                      return (
                        <option key={s.id} value={s.id}>
                          №{s.itemNo}: {cleanName} ({s.unit}) {canViewFinances ? \`— \${s.basePrice.toLocaleString('uz-UZ')} UZS/sutka (+12% QQS)\` : ''}
                        </option>
                      );
                    })}
                  </select>
                  {canViewFinances && (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#0369a1', background: '#f0f9ff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #bae6fd' }}>
                      Hisoblash formulasi: <strong>{exitBillingCalculation.storageFormulaText}</strong> = <strong>{exitBillingCalculation.storageBase.toLocaleString('uz-UZ')} UZS</strong> (+12% QQS: {exitBillingCalculation.storageVat.toLocaleString('uz-UZ')} UZS = <strong>{exitBillingCalculation.storageTotal.toLocaleString('uz-UZ')} UZS</strong>)
                    </div>
                  )}
                </div>

                {/* ========================================================
                    3. YUKNI ORTISH VA YUKLASH (ПОГРУЗКА) TRANSPORT TURI (FOYDALANUVCHI TALABI)
                    ======================================================== */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <label className="form-label" style={{ color: '#002d62', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <span>🚛</span>
                    <span>3. YUKNI ORTISH VA YUKLASH (ПОГРУЗКА) TRANSPORT TURI *</span>
                  </label>
                  <select
                    className="form-select-clean"
                    value={selectedLoadingServiceId}
                    onChange={e => setSelectedLoadingServiceId(e.target.value)}
                    required
                    style={{ background: '#ffffff', fontWeight: 600 }}
                  >
                    {customsServices.filter(s => s.category === 'UNLOADING_LOADING').map(s => {
                      const cleanName = (s.nameUz || s.name)
                        .replace('ortish / tushirish', 'ortish (Погрузка)')
                        .replace('yuklash / tushirish', 'ortish (Погрузка)')
                        .replace('tushirish/ortish', 'ortish (Погрузка)');
                      return (
                        <option key={s.id} value={s.id}>
                          {cleanName} ({s.unit}) {canViewFinances ? \`— \${s.basePrice.toLocaleString('uz-UZ')} UZS (+12% QQS)\` : ''}
                        </option>
                      );
                    })}
                  </select>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                    «JB GROUP» Bojxona ombori: yuk ombordan chiqarilganda qanday transportga ortilayotganligini belgilang (ko'rsatilayotgan yuklash xizmati).
                  </span>
                </div>`;

// Agar marker bo'lsa almashtiramiz:
if (content.includes(exitModalLoadingSectionMarker)) {
  // loading sectionning oxirigacha olamiz
  const loadingSectionEndMarker = `«JB GROUP» Bojxona ombori: yuk ombordan chiqarilganda qanday transportga ortilayotganligini belgilang (ko&apos;rsatilayotgan yuklash xizmati).\n                  </span>\n                </div>`;
  const startIdx = content.indexOf(exitModalLoadingSectionMarker);
  const endIdx = content.indexOf(loadingSectionEndMarker, startIdx);
  if (startIdx !== -1 && endIdx !== -1) {
    const fullLoadingSection = content.slice(startIdx, endIdx + loadingSectionEndMarker.length);
    content = content.replace(fullLoadingSection, newExitModalServicesSections);
    console.log('Successfully replaced exit modal loading & storage sections!');
  }
}

// 3. Chiqim modalidagi To'lov blokini (Finance block) yangilash: Tushirish, Saqlash, Ortish, QQS, JAMI
const oldFinanceGrid = `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '11px', color: '#334155', marginBottom: '10px' }}>
                        <div>
                          <span style={{ color: '#166534' }}>Saqlash (Xraneniya):</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a', marginTop: '2px' }}>
                            {exitBillingCalculation.storageBase.toLocaleString('uz-UZ')} UZS
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#166534' }}>Yuk ortish (Погрузка):</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0284c7', marginTop: '2px' }}>
                            {exitBillingCalculation.loadingBase.toLocaleString('uz-UZ')} UZS
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#166534' }}>Qo&apos;shimcha xizmatlar:</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a', marginTop: '2px' }}>
                            {exitBillingCalculation.additionalExitBase.toLocaleString('uz-UZ')} UZS
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#166534' }}>12% QQS miqdori:</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0070ba', marginTop: '2px' }}>
                            {exitBillingCalculation.totalVat.toLocaleString('uz-UZ')} UZS
                          </strong>
                        </div>
                      </div>`;

const newFinanceGrid = `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', fontSize: '11px', color: '#334155', marginBottom: '10px' }}>
                        <div>
                          <span style={{ color: '#166534' }}>1. Tushirish (Разгрузка):</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0284c7', marginTop: '2px' }}>
                            {exitBillingCalculation.unloadingBase.toLocaleString('uz-UZ')} UZS
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#166534' }}>2. Saqlash ({exitBillingCalculation.daysStored} kun):</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a', marginTop: '2px' }}>
                            {exitBillingCalculation.storageBase.toLocaleString('uz-UZ')} UZS
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#166534' }}>3. Ortish (Погрузка):</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0284c7', marginTop: '2px' }}>
                            {exitBillingCalculation.loadingBase.toLocaleString('uz-UZ')} UZS
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#166534' }}>Qo&apos;shimcha xizmatlar:</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a', marginTop: '2px' }}>
                            {exitBillingCalculation.additionalExitBase.toLocaleString('uz-UZ')} UZS
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#166534' }}>12% QQS miqdori:</span>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0070ba', marginTop: '2px' }}>
                            {exitBillingCalculation.totalVat.toLocaleString('uz-UZ')} UZS
                          </strong>
                        </div>
                      </div>`;

if (content.includes(oldFinanceGrid)) {
  content = content.replace(oldFinanceGrid, newFinanceGrid);
  console.log('Successfully replaced finance grid in exit modal!');
}

// FormulaText ni ham yangilaymiz
content = content.replace(`Formulasi: <code style={{ fontWeight: 700, background: 'rgba(255,255,255,0.7)', padding: '2px 6px', borderRadius: '4px' }}>{exitBillingCalculation.formulaText}</code>`,
  `Hisob-kitob tarkibi: <code style={{ fontWeight: 700, background: 'rgba(255,255,255,0.7)', padding: '2px 6px', borderRadius: '4px' }}>Tushirish (\${exitBillingCalculation.unloadingTotal.toLocaleString('uz-UZ')} UZS) + Saqlash (\${exitBillingCalculation.storageTotal.toLocaleString('uz-UZ')} UZS) + Ortish (\${exitBillingCalculation.loadingTotal.toLocaleString('uz-UZ')} UZS)</code>`);

// 4. Chiqim Nakladnoyidagi ma'lumotlar va xizmatlar jadvalini yangilash
// Nakladnoy yuqori qismida kelgan transport va ortilgan transport
const oldInvoiceTransports = `{selectedInvoiceMovement.type === 'OUT' && (selectedInvoiceMovement.loadingType || selectedInvoiceMovement.transportType) && (
                      <div style={{ marginTop: '4px', color: '#dc2626', fontSize: '11px', fontWeight: 600 }}>
                        🚛 Yuk ortilgan transport: <strong>{selectedInvoiceMovement.loadingType || selectedInvoiceMovement.transportType}</strong>
                      </div>
                    )}`;

const newInvoiceTransports = `{selectedInvoiceMovement.type === 'OUT' && (
                      <div style={{ marginTop: '6px', fontSize: '11px', lineHeight: '1.6' }}>
                        <div style={{ color: '#0369a1', fontWeight: 600 }}>
                          📥 Omborga tushirilgan transport: <strong>{selectedInvoiceMovement.unloadingType || selectedInvoiceMovement.transportType || 'Standart tushirish'}</strong>
                        </div>
                        <div style={{ color: '#dc2626', fontWeight: 600 }}>
                          🚛 Yuk ortilgan transport: <strong>{selectedInvoiceMovement.loadingType || 'Standart ortish'}</strong>
                        </div>
                      </div>
                    )}`;

if (content.includes(oldInvoiceTransports)) {
  content = content.replace(oldInvoiceTransports, newInvoiceTransports);
  console.log('Successfully updated invoice transport lines!');
}

// Endi nakladnoy xizmatlar jadvali: 1-Tushirish, 2-Saqlash, 3-Ortish, 4-Qo'shimcha
const oldInvoiceTableBody = `<tbody>
                    {/* Chiqim amali uchun Saqlash (Xraneniya) xizmati */}
                    {selectedInvoiceMovement.type === 'OUT' && (
                      <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>1</td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                          Bojxona omborida saqlash xizmati ({selectedInvoiceMovement.daysStored || 1} kun saqlangan)
                          {selectedInvoiceMovement.weightKg && (
                            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                              Hajmi: {selectedInvoiceMovement.weightKg.toLocaleString('uz-UZ')} kg × 50 so&apos;m/kg/kun
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                          {(
                            (selectedInvoiceMovement.totalCostUZS || 0) -
                            (selectedInvoiceMovement.servicesApplied?.reduce((acc, s) => acc + s.basePrice, 0) || 0)
                          ).toLocaleString('uz-UZ')} UZS
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba', fontWeight: 600 }}>
                          {(
                            (selectedInvoiceMovement.vatTotalUZS || 0) -
                            (selectedInvoiceMovement.servicesApplied?.reduce((acc, s) => acc + s.vatAmount, 0) || 0)
                          ).toLocaleString('uz-UZ')} UZS
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                          {(
                            ((selectedInvoiceMovement.grandTotalUZS || selectedInvoiceMovement.totalCostUZS || 0) -
                              (selectedInvoiceMovement.servicesApplied?.reduce((acc, s) => acc + s.totalPrice, 0) || 0))
                          ).toLocaleString('uz-UZ')} UZS
                        </td>
                      </tr>
                    )}

                    {/* Kirim amali yoki Qo'shimcha xizmatlar */}
                    {selectedInvoiceMovement.servicesApplied && selectedInvoiceMovement.servicesApplied.map((svc, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>
                          {selectedInvoiceMovement.type === 'OUT' ? idx + 2 : idx + 1}
                        </td>
                        <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>
                          {svc.name}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                          {svc.basePrice.toLocaleString('uz-UZ')} UZS
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0070ba' }}>
                          {svc.vatAmount.toLocaleString('uz-UZ')} UZS
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>
                          {svc.totalPrice.toLocaleString('uz-UZ')} UZS
                        </td>
                      </tr>
                    ))}
                  </tbody>`;

const newInvoiceTableBody = `<tbody>
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
                  </tbody>`;

if (content.includes(oldInvoiceTableBody)) {
  content = content.replace(oldInvoiceTableBody, newInvoiceTableBody);
  console.log('Successfully updated invoice table body with Unloading + Storage + Loading!');
}

fs.writeFileSync(pagePath, content, 'utf8');
console.log('Page.tsx updated successfully!');
