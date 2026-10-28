const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Yangi statelar: exitReceiverInn, exitReceiverName, exitReceiverPerson
const oldStateTarget = "const [exitNotes, setExitNotes] = useState<string>('');";
const newStateReplacement = `const [exitNotes, setExitNotes] = useState<string>('');
  const [exitReceiverInn, setExitReceiverInn] = useState<string>('');
  const [exitReceiverName, setExitReceiverName] = useState<string>('');
  const [exitReceiverPerson, setExitReceiverPerson] = useState<string>('');`;

content = content.replace(oldStateTarget, newStateReplacement);

// 2. Chiqim modalini ochishda INN va korxona nomini avtomatik to'ldirish
const openExitRegex1 = /setSelectedProductToExit\(prod\);\s+setExitQuantity\(prod\.quantity\);\s+setExitWeightKg\(prod\.weightKg\);\s+setExitNotes\(''\);/g;
content = content.replace(openExitRegex1, (match) => {
  return `${match}
                                        const pMatch = payers.find(p => p.id === prod.payerId || p.name.toLowerCase() === prod.clientName?.toLowerCase());
                                        setExitReceiverInn(pMatch?.inn || '');
                                        setExitReceiverName(pMatch?.name || prod.clientName || '');
                                        setExitReceiverPerson(pMatch?.contactPerson || '');`;
});

// Modal 9 ichidagi chiqim tugmasida ham to'ldirish
const openExitInModal9Target = `const prod = selectedProductHistory;
                    setSelectedProductHistory(null);
                    setSelectedProductToExit(prod);
                    setExitQuantity(prod.quantity);
                    setExitWeightKg(prod.weightKg);
                    setExitNotes('');`;

const openExitInModal9Replacement = `const prod = selectedProductHistory;
                    setSelectedProductHistory(null);
                    setSelectedProductToExit(prod);
                    setExitQuantity(prod.quantity);
                    setExitWeightKg(prod.weightKg);
                    setExitNotes('');
                    const pMatch = payers.find(p => p.id === prod.payerId || p.name.toLowerCase() === prod.clientName?.toLowerCase());
                    setExitReceiverInn(pMatch?.inn || '');
                    setExitReceiverName(pMatch?.name || prod.clientName || '');
                    setExitReceiverPerson(pMatch?.contactPerson || '');`;

content = content.replace(openExitInModal9Target, openExitInModal9Replacement);

// 3. Chiqim modalida INN va qabul qiluvchi ma'lumotlari blokini qo'shish
const exitNotesInputTarget = `                <div className="form-field">
                  <label className="form-label">CHIQIM HUJJATI / ASOS / IZOH</label>
                  <input
                    type="text"
                    className="form-input-clean"
                    placeholder="Masalan: Shartnoma №44, Yuk oluvchi: Aziz Rahimov"
                    value={exitNotes}
                    onChange={e => setExitNotes(e.target.value)}
                  />
                </div>`;

const exitNotesInputReplacement = `                {/* YUKNI QABUL QILUVCHI / CHIQARILAYOTGAN TASHKILOT INN RAQAMI (FOYDALANUVCHI TALABI) */}
                <div style={{ background: '#f0f9ff', border: '1.5px solid #7dd3fc', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0369a1', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' }}>
                    <span>🏢</span>
                    <span>YUKNI QABUL QILIB OLUVCHI KORXONA VA STIR (INN) RAQAMI:</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label className="form-label" style={{ color: '#0284c7', fontWeight: 800 }}>
                        STIR (INN) RAQAMI *
                      </label>
                      <input
                        type="text"
                        required
                        className="form-input-clean"
                        placeholder="Masalan: 308942115"
                        style={{ border: '1.5px solid #0284c7', fontWeight: 800, color: '#002d62', background: '#ffffff' }}
                        value={exitReceiverInn}
                        onChange={e => {
                          const innVal = e.target.value.trim();
                          setExitReceiverInn(innVal);
                          const matched = payers.find(p => p.inn === innVal);
                          if (matched) {
                            setExitReceiverName(matched.name);
                            if (matched.contactPerson) setExitReceiverPerson(matched.contactPerson);
                          }
                        }}
                      />
                    </div>

                    <div>
                      <label className="form-label">QABUL QILUVCHI KORXONA NOMI *</label>
                      <input
                        type="text"
                        required
                        className="form-input-clean"
                        placeholder="Masalan: Sag Agro Logistika MChJ"
                        value={exitReceiverName}
                        onChange={e => setExitReceiverName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">YUKNI TOPSHIRIB OLUVCHI VAKIL (F.I.SH VA ISHONCHNOMA)</label>
                    <input
                      type="text"
                      className="form-input-clean"
                      placeholder="Masalan: Aziz Rahimov (Ishonchnoma №14/B)"
                      value={exitReceiverPerson}
                      onChange={e => setExitReceiverPerson(e.target.value)}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: '#0284c7', display: 'block', marginTop: '6px' }}>
                    * Ushbu STIR (INN) va vakil ma&apos;lumotlari rasmiy Chiqim Nakladnoyida aks ettiriladi.
                  </span>
                </div>

                <div className="form-field">
                  <label className="form-label">CHIQIM HUJJATI / ASOS / IZOH</label>
                  <input
                    type="text"
                    className="form-input-clean"
                    placeholder="Masalan: Shartnoma №44, Hisob-faktura №105"
                    value={exitNotes}
                    onChange={e => setExitNotes(e.target.value)}
                  />
                </div>`;

content = content.replace(exitNotesInputTarget, exitNotesInputReplacement);

// 4. handleConfirmExit da receiver ma'lumotlarini saqlash
const newExitRecTarget = `      daysStored: exitBillingCalculation.daysStored,
      storageBaseCost: exitBillingCalculation.storageBase,
      storageVat: exitBillingCalculation.storageVat,
      additionalServices: exitBillingCalculation.appliedExitServices,
      additionalCost: exitBillingCalculation.exitServicesBase + exitBillingCalculation.exitServicesVat,
      totalCost: exitBillingCalculation.totalCost,
      notes: exitNotes || undefined
    };`;

const newExitRecReplacement = `      daysStored: exitBillingCalculation.daysStored,
      storageBaseCost: exitBillingCalculation.storageBase,
      storageVat: exitBillingCalculation.storageVat,
      additionalServices: exitBillingCalculation.appliedExitServices,
      additionalCost: exitBillingCalculation.exitServicesBase + exitBillingCalculation.exitServicesVat,
      totalCost: exitBillingCalculation.totalCost,
      receiverInn: exitReceiverInn.trim() || undefined,
      receiverName: exitReceiverName.trim() || selectedProductToExit.clientName,
      receiverPerson: exitReceiverPerson.trim() || undefined,
      notes: exitNotes || undefined
    };`;

content = content.replace(newExitRecTarget, newExitRecReplacement);

const newMoveTarget = `      tariffDailyRate: exitBillingCalculation.dailyRate,
      storageCostUZS: exitBillingCalculation.storageTotal,
      additionalCostUZS: exitBillingCalculation.exitServicesBase + exitBillingCalculation.exitServicesVat,
      servicesApplied: exitBillingCalculation.appliedExitServices,
      vatTotalUZS: exitBillingCalculation.totalVat,
      totalCostUZS: exitBillingCalculation.totalBase,
      grandTotalUZS: exitBillingCalculation.totalCost
    };`;

const newMoveReplacement = `      tariffDailyRate: exitBillingCalculation.dailyRate,
      storageCostUZS: exitBillingCalculation.storageTotal,
      additionalCostUZS: exitBillingCalculation.exitServicesBase + exitBillingCalculation.exitServicesVat,
      servicesApplied: exitBillingCalculation.appliedExitServices,
      vatTotalUZS: exitBillingCalculation.totalVat,
      totalCostUZS: exitBillingCalculation.totalBase,
      grandTotalUZS: exitBillingCalculation.totalCost,
      receiverInn: exitReceiverInn.trim() || undefined,
      receiverName: exitReceiverName.trim() || selectedProductToExit.clientName,
      receiverPerson: exitReceiverPerson.trim() || undefined
    };`;

content = content.replace(newMoveTarget, newMoveReplacement);

// 5. Nakladnoy qog'ozida STIR (INN) va Qabul qiluvchini aks ettirish
const oldInvoiceClientBlock = `              {/* Tovar va To'lovchi ma'lumotlari */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '18px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>YUK VA TO&apos;LOVCHI:</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#002d62', marginTop: '2px' }}>
                    {selectedInvoiceMovement.productName}
                  </div>
                  <div style={{ color: '#334155', marginTop: '2px' }}>
                    To&apos;lovchi (Mijoz): <strong>{selectedInvoiceMovement.clientName || "Noma'lum"}</strong>
                  </div>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>HAJM VA SKLAD:</span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    Hajmi: <strong>{selectedInvoiceMovement.quantity} {selectedInvoiceMovement.unit}</strong>
                    {selectedInvoiceMovement.weightKg && (
                      <span style={{ color: '#059669', marginLeft: '6px' }}>
                        (⚖️ {selectedInvoiceMovement.weightKg.toLocaleString('uz-UZ')} kg)
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#475569', marginTop: '2px' }}>
                    Sklad: <strong>{selectedInvoiceMovement.sectorName}</strong>
                    {selectedInvoiceMovement.daysStored && (
                      <span style={{ marginLeft: '6px', color: '#059669', fontWeight: 700 }}>
                        • {selectedInvoiceMovement.daysStored} kun saqlangan
                      </span>
                    )}
                  </div>
                </div>
              </div>`;

const newInvoiceClientBlock = `              {/* Tovar, Hajm, va Yuk Berilgan Tarafi (INN va Vakil bilan) */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '18px', display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '14px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>TOVAR VA SAQLASH HAJMI:</span>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#002d62', marginTop: '2px' }}>
                    {selectedInvoiceMovement.productName}
                  </div>
                  <div style={{ color: '#0f172a', marginTop: '4px', fontSize: '13px', fontWeight: 700 }}>
                    Hajmi: {selectedInvoiceMovement.quantity} {selectedInvoiceMovement.unit}
                    {selectedInvoiceMovement.weightKg && (
                      <span style={{ color: '#059669', marginLeft: '6px' }}>
                        (⚖️ {selectedInvoiceMovement.weightKg.toLocaleString('uz-UZ')} kg)
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#475569', marginTop: '3px' }}>
                    Sklad: <strong>{selectedInvoiceMovement.sectorName}</strong>
                    {selectedInvoiceMovement.daysStored && (
                      <span style={{ marginLeft: '6px', color: '#059669', fontWeight: 700 }}>
                        • {selectedInvoiceMovement.daysStored} kun saqlangan
                      </span>
                    )}
                  </div>
                  {selectedInvoiceMovement.placedBy && (
                    <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>
                      Keltirgan mas&apos;ul: <strong>{selectedInvoiceMovement.placedBy}</strong>
                    </div>
                  )}
                </div>

                <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '14px' }}>
                  <span style={{ color: '#dc2626', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>YUK BERILGAN TARAFI (QABUL QILUVCHI):</span>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                    🏢 {selectedInvoiceMovement.receiverName || selectedInvoiceMovement.clientName || "Noma'lum Korxona"}
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#0284c7', fontWeight: 800 }}>
                    STIR (INN): <code style={{ fontSize: '13px', background: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>{selectedInvoiceMovement.receiverInn || (payers.find(p => p.name === (selectedInvoiceMovement.receiverName || selectedInvoiceMovement.clientName))?.inn) || '308942115'}</code>
                  </div>
                  {selectedInvoiceMovement.receiverPerson ? (
                    <div style={{ color: '#334155', fontSize: '12px', marginTop: '3px' }}>
                      Qabul qilib oluvchi vakil: <strong>{selectedInvoiceMovement.receiverPerson}</strong>
                    </div>
                  ) : (
                    <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>
                      To&apos;lovchi (Mijoz): <strong>{selectedInvoiceMovement.clientName || "Noma'lum"}</strong>
                    </div>
                  )}
                  {selectedInvoiceMovement.userName && (
                    <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>
                      Chiqargan mas&apos;ul: <strong>{selectedInvoiceMovement.userName}</strong>
                    </div>
                  )}
                </div>
              </div>`;

content = content.replace(oldInvoiceClientBlock, newInvoiceClientBlock);

// 6. Nakladnoy overlayiga z-index: 99999 qo'yish
content = content.replace(
  '<div className="modal-overlay invoice-print-overlay">',
  '<div className="modal-overlay invoice-print-overlay" style={{ zIndex: 99999 }}>'
);

// 7. Modal 9 (Tarix zanjiri):
// - Kirim nakladnoyini chop etish tugmasini olib tashlash
// - "KIRIM NAKLADNOYI" sarlavhasini "KIRIM TARIXI (QABUL QILINISHI)" ga o'zgartirish
const oldKirimDalolatnomaBlock = `<span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: 800 }}>
                        📥 KIRIM NAKLADNOYI (QABUL DALOLATNOMASI)
                      </span>`;

const newKirimDalolatnomaBlock = `<span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: 800 }}>
                        📥 OMBORGA QABUL QILISH VA DASTLABKI KIRIM TARIXI
                      </span>`;

content = content.replace(oldKirimDalolatnomaBlock, newKirimDalolatnomaBlock);

// Kirim chop etish tugmasini butunlay olib tashlash
const kirimPrintBtnTarget = `<button
                        type="button"
                        onClick={() => {
                          const inMove: CargoMovement = {
                            id: selectedProductHistory.id,
                            invoiceNo: selectedProductHistory.notes?.startsWith('№') ? selectedProductHistory.notes : ('NAK-IN-' + selectedProductHistory.id.slice(-6)),
                            productId: selectedProductHistory.id,
                            productName: selectedProductHistory.name,
                            type: 'IN',
                            quantity: selectedProductHistory.initialQuantity || selectedProductHistory.quantity,
                            unit: selectedProductHistory.unit,
                            weightKg: selectedProductHistory.initialWeightKg || selectedProductHistory.weightKg,
                            initialQuantity: selectedProductHistory.initialQuantity,
                            initialWeightKg: selectedProductHistory.initialWeightKg,
                            remainingQuantity: selectedProductHistory.quantity,
                            remainingWeightKg: selectedProductHistory.weightKg,
                            userName: selectedProductHistory.placedBy,
                            userRole: selectedProductHistory.placedByRole,
                            placedBy: selectedProductHistory.placedBy,
                            placedDate: \`\${selectedProductHistory.entryDate} \${selectedProductHistory.entryTime}\`,
                            date: selectedProductHistory.entryDate,
                            time: selectedProductHistory.entryTime,
                            notes: selectedProductHistory.notes || 'Boshlang\\'ich kirim nakladnoyi',
                            clientName: selectedProductHistory.clientName,
                            sectorId: selectedProductHistory.sectorId,
                            sectorName: selectedProductHistory.sectorName,
                            transportType: selectedProductHistory.obrabotkaService,
                            totalCostUZS: selectedProductHistory.obrabotkaCost || 0,
                            vatTotalUZS: selectedProductHistory.obrabotkaVat || 0,
                            grandTotalUZS: (selectedProductHistory.obrabotkaCost || 0) + (selectedProductHistory.obrabotkaVat || 0)
                          };
                          setSelectedInvoiceMovement(inMove);
                        }}
                        className="btn-outline"
                        style={{
                          background: '#ecfdf5',
                          borderColor: '#86efac',
                          color: '#059669',
                          fontWeight: 700,
                          fontSize: '11px',
                          padding: '6px 12px'
                        }}
                      >
                        🖨️ Kirim Nakladnoyini Chop Etish
                      </button>`;

content = content.replace(kirimPrintBtnTarget, `<span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700, background: '#dcfce7', padding: '4px 8px', borderRadius: '4px' }}>
                        ✅ Omborga qabul qilingan (Faqat Tarix)
                      </span>`);

// Chiqim nakladnoyini chop etish tugmasi bosilganda:
// setSelectedInvoiceMovement(exitMove) qilinadi VA setSelectedProductHistory(null) qilinadi!
// Shunda Chiqim Nakladnoyi hech qachon orqa fonda qolib ketmaydi, darhol eng yuqorida ochiladi!
const oldExitInvoiceClickTarget = `                                setSelectedInvoiceMovement(exitMove);
                              }}
                              className="btn-outline"`;

const newExitInvoiceClickReplacement = `                                setSelectedProductHistory(null);
                                setSelectedInvoiceMovement(exitMove);
                              }}
                              className="btn-outline"`;

content = content.replace(oldExitInvoiceClickTarget, newExitInvoiceClickReplacement);

// Chiqim nakladnoyi modalini Modal 9 dan KEYINGA, ya'ni faylning eng oxiriga ko'chiramiz!
// Shunda DOM tartibida ham u eng ustki element bo'ladi!
// Buning uchun Modal 7 qismini topib, uni Modal 9 dan keyinga ko'chiramiz.
const modal7StartMarker = "{/* ========================================================\n          MODAL 7: RASMIY «JB GROUP» BOJXONA INVOYSI / DALOLATNOMA";
const modal7EndMarker = "{/* ========================================================\n          MODAL 8: BOJXONA XIZMATINI QO'SHISH / TAHRIRLASH";

const modal7StartIndex = content.indexOf(modal7StartMarker);
const modal7EndIndex = content.indexOf(modal7EndMarker);

if (modal7StartIndex !== -1 && modal7EndIndex !== -1) {
  const modal7Code = content.slice(modal7StartIndex, modal7EndIndex);
  content = content.slice(0, modal7StartIndex) + content.slice(modal7EndIndex);
  
  // Endi Modal 9 dan keyin qo'shamiz (Modal 10 oldiga yoki Modal 9 oxiriga)
  const modal10Marker = "{/* ========================================================\n          MODAL 10: TO'LOVCHI SHARTNOMASINI QO'SHISH / MUDDATINI UZAYTIRISH";
  const modal10Index = content.indexOf(modal10Marker);
  if (modal10Index !== -1) {
    content = content.slice(0, modal10Index) + modal7Code + "\n      " + content.slice(modal10Index);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated page.tsx with receiver INN, top-level invoice modal, and no-kirim-invoice rule!');
