const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. exitWeightKg state qo'shish
content = content.replace(
  "const [exitQuantity, setExitQuantity] = useState<number>(125);",
  "const [exitQuantity, setExitQuantity] = useState<number>(10);\n  const [exitWeightKg, setExitWeightKg] = useState<number>(100);"
);

// 2. exitBillingCalculation da exitWeightKg hisobga olish
const oldCalcTarget = `    // 2. Og'irlikni avtomatik hisoblash: chiqarilayotgan soniga proporsional
    const totalProdQty = selectedProductToExit.quantity || 1;
    const totalProdWeight = selectedProductToExit.weightKg || selectedProductToExit.initialWeightKg || totalProdQty;
    const validWeightKg = Math.round((validQty / totalProdQty) * totalProdWeight);
    const remainingQty = selectedProductToExit.quantity - validQty;
    const remainingWeightKg = Math.max(0, totalProdWeight - validWeightKg);

    // 3. Majburiy Xraneniya to'lovi: og'irlik kg bo'yicha: og'irlik * kunlik stavka * kunlar
    const storageBase = validWeightKg * dailyRate * daysStored;`;

const newCalcReplacement = `    // 2. Og'irlikni hisoblash: agar foydalanuvchi og'irlikni kiritgan bo'lsa, uni oladi, aks holda proporsional
    const totalProdQty = selectedProductToExit.quantity || 1;
    const totalProdWeight = selectedProductToExit.weightKg || selectedProductToExit.initialWeightKg || totalProdQty;
    const validWeightKg = exitWeightKg > 0 
      ? Math.min(totalProdWeight, Number(exitWeightKg))
      : Math.round((validQty / totalProdQty) * totalProdWeight);
    const remainingQty = selectedProductToExit.quantity - validQty;
    const remainingWeightKg = Math.max(0, totalProdWeight - validWeightKg);

    // 3. Majburiy Xraneniya to'lovi: og'irlik kg bo'yicha: og'irlik * kunlik stavka * kunlar
    const storageBase = Math.round(validWeightKg * dailyRate * daysStored);`;

content = content.replace(oldCalcTarget, newCalcReplacement);

// useMemo dependency arrayga exitWeightKg qo'shish
content = content.replace(
  "}, [selectedProductToExit, exitQuantity, warehouse.sectors, tariffs, selectedChiqimAdditionalIds, customsServices]);",
  "}, [selectedProductToExit, exitQuantity, exitWeightKg, warehouse.sectors, tariffs, selectedChiqimAdditionalIds, customsServices]);"
);

// 3. Ombordan Chiqarish tugmalarida setExitWeightKg ni o'rnatish
content = content.replace(
  `setSelectedProductToExit(prod);
                                        setExitQuantity(prod.quantity);
                                        setExitNotes('');`,
  `setSelectedProductToExit(prod);
                                        setExitQuantity(prod.quantity);
                                        setExitWeightKg(prod.weightKg);
                                        setExitNotes('');`
);

content = content.replace(
  `setSelectedProductToExit(prod);
                    setExitQuantity(prod.quantity);
                    setExitNotes('');`,
  `setSelectedProductToExit(prod);
                    setExitQuantity(prod.quantity);
                    setExitWeightKg(prod.weightKg);
                    setExitNotes('');`
);

// 4. Chiqim modalidagi Son va Og'irlik kiritish bloki
const oldQtyInputBlock = `                {/* Chiqariladigan miqdorni belgilash */}
                <div className="form-field">
                  <label className="form-label">
                    CHIQARILADIGAN YUK SONI ({selectedProductToExit.unit.toUpperCase()} DA) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={selectedProductToExit.quantity}
                    required
                    className="form-input-clean"
                    value={exitQuantity === 0 ? '' : exitQuantity}
                    onChange={e => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      setExitQuantity(Math.min(selectedProductToExit.quantity, val));
                    }}
                  />

                  {/* Qulay tezkor ulush tugmalari */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setExitQuantity(Math.max(1, Math.round(selectedProductToExit.quantity * 0.25)))}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      25% qismi
                    </button>
                    <button
                      type="button"
                      onClick={() => setExitQuantity(Math.max(1, Math.round(selectedProductToExit.quantity * 0.5)))}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      50% qismi
                    </button>
                    <button
                      type="button"
                      onClick={() => setExitQuantity(Math.max(1, Math.round(selectedProductToExit.quantity * 0.75)))}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      75% qismi
                    </button>
                    <button
                      type="button"
                      onClick={() => setExitQuantity(selectedProductToExit.quantity)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', background: '#eff6ff', color: '#2563eb', fontWeight: 700, border: '1px solid #bfdbfe' }}
                    >
                      ⚡ Hammasini (Butunlay)
                    </button>
                  </div>

                  {/* Chiqariladigan og'irlik va qoldiq zaxiraning avtomatik ko'rsatkichi */}
                  <div style={{ marginTop: '10px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>⚖️ CHIQARILADIGAN OG&apos;IRLIK (AVTOMATIK):</span>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#15803d' }}>
                        {exitBillingCalculation.validWeightKg.toLocaleString('uz-UZ')} kg ({exitBillingCalculation.validQty} {selectedProductToExit.unit})
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>OMBORDAGI QOLDIQ:</span>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                        {exitBillingCalculation.remainingQty.toLocaleString('uz-UZ')} {selectedProductToExit.unit} ({exitBillingCalculation.remainingWeightKg.toLocaleString('uz-UZ')} kg)
                      </div>
                    </div>
                  </div>
                </div>`;

const newQtyInputBlock = `                {/* Chiqariladigan soni va aniq og'irligini belgilash (Foydalanuvchi talabi) */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#002d62', marginBottom: '10px', textTransform: 'uppercase' }}>
                    📦 CHIQARILADIGAN YUK JOYI VA ANIQ OG&apos;IRLIGI (KG):
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {/* 1. Joylar soni */}
                    <div>
                      <label className="form-label">
                        JOY / SONI ({selectedProductToExit.unit.toUpperCase()} DA) *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={selectedProductToExit.quantity}
                        required
                        className="form-input-clean"
                        value={exitQuantity === 0 ? '' : exitQuantity}
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          const newQty = Math.min(selectedProductToExit.quantity, Math.max(0, val));
                          setExitQuantity(newQty);
                          const unitWeight = selectedProductToExit.quantity > 0 ? (selectedProductToExit.weightKg / selectedProductToExit.quantity) : 1;
                          setExitWeightKg(Math.round(newQty * unitWeight));
                        }}
                      />
                    </div>

                    {/* 2. Aniq og'irlik (kg da) */}
                    <div>
                      <label className="form-label" style={{ color: '#047857', fontWeight: 800 }}>
                        ⚖️ ANIQ OG&apos;IRLIGI (KG DA) *
                      </label>
                      <input
                        type="number"
                        min={0.1}
                        max={selectedProductToExit.weightKg}
                        step="any"
                        required
                        className="form-input-clean"
                        style={{ border: '1.5px solid #10b981', background: '#f0fdf4', fontWeight: 800, fontSize: '15px', color: '#15803d' }}
                        value={exitWeightKg === 0 ? '' : exitWeightKg}
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          setExitWeightKg(Math.min(selectedProductToExit.weightKg, Math.max(0, val)));
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                    💡 <em>Har bir yuk bir xil og&apos;irlikda bo&apos;lmasligi mumkin. Tarozi ko&apos;rsatkichiga qarab og&apos;irlikni (kg) xohlagancha qo&apos;lda kiritishingiz mumkin.</em>
                  </div>

                  {/* Qulay tezkor ulush tugmalari */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const newQty = Math.max(1, Math.round(selectedProductToExit.quantity * 0.25));
                        setExitQuantity(newQty);
                        const unitWeight = selectedProductToExit.weightKg / selectedProductToExit.quantity;
                        setExitWeightKg(Math.round(newQty * unitWeight));
                      }}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      25% qismi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newQty = Math.max(1, Math.round(selectedProductToExit.quantity * 0.5));
                        setExitQuantity(newQty);
                        const unitWeight = selectedProductToExit.weightKg / selectedProductToExit.quantity;
                        setExitWeightKg(Math.round(newQty * unitWeight));
                      }}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      50% qismi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newQty = Math.max(1, Math.round(selectedProductToExit.quantity * 0.75));
                        setExitQuantity(newQty);
                        const unitWeight = selectedProductToExit.weightKg / selectedProductToExit.quantity;
                        setExitWeightKg(Math.round(newQty * unitWeight));
                      }}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      75% qismi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExitQuantity(selectedProductToExit.quantity);
                        setExitWeightKg(selectedProductToExit.weightKg);
                      }}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', background: '#eff6ff', color: '#2563eb', fontWeight: 700, border: '1px solid #bfdbfe' }}
                    >
                      ⚡ Hammasini (Butunlay)
                    </button>
                  </div>

                  {/* Chiqariladigan og'irlik va qoldiq zaxiraning ko'rsatkichi */}
                  <div style={{ marginTop: '10px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>⚖️ CHIQARILAYOTGAN YUK VA VAZN:</span>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#15803d' }}>
                        {exitBillingCalculation.validWeightKg.toLocaleString('uz-UZ')} kg ({exitBillingCalculation.validQty} {selectedProductToExit.unit})
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>OMBORDAGI QOLDIQ:</span>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                        {exitBillingCalculation.remainingQty.toLocaleString('uz-UZ')} {selectedProductToExit.unit} ({exitBillingCalculation.remainingWeightKg.toLocaleString('uz-UZ')} kg)
                      </div>
                    </div>
                  </div>
                </div>`;

content = content.replace(oldQtyInputBlock, newQtyInputBlock);

// 5. Nakladnoy modalida id="jb-group-invoice" va chop etish tugmasi
content = content.replace(
  '<div style={{ padding: \'28px 32px\', background: \'#ffffff\', color: \'#0f172a\' }}>',
  '<div id="jb-group-invoice" className="jb-invoice-print-area" style={{ padding: \'28px 32px\', background: \'#ffffff\', color: \'#0f172a\' }}>'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated exit weights and invoice print container in page.tsx!');
