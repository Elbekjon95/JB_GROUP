const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. activeMenu === 'dashboard' ni activeMenu === 'history' || activeMenu === 'dashboard' ga moslash
content = content.replace(
  "{activeMenu === 'dashboard' && (",
  "{(activeMenu === 'history' || activeMenu === 'dashboard') && ("
);

// 2. 2-BO'LIM tugashidan so'ng 3-BO'LIM (payers) qo'shish
const payersSection = `
        {/* ========================================================
            3-BO'LIM: YUK TO'LOVCHILARI VA SHARTNOMALAR (FOYDALANUVCHI TALABI)
            - Shartnoma tuzgan tashkilotlar ro'yxati
            - Shartnoma muddati (qachongacha tuzilganligi)
            - Muddati o'tgan to'lovchilar to'lov qila olmaydi va chiqim bloklanadi
            ======================================================== */}
        {activeMenu === 'payers' && (
          <div>
            {/* Sarlavha va Yangi Shartnoma Qo'shish */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '26px' }}>🤝</span>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#002d62', margin: 0, letterSpacing: '-0.01em' }}>
                      Yuk To&apos;lovchilari va Shartnomalar Reestri
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                      Bojxona ombori bilan rasmiy saqlash shartnomasi tuzgan mijozlar. Shartnoma muddati tugagan to&apos;lovchilarning tovarlarini chiqarish tizim tomonidan avtomatik bloklanadi.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenNewPayer}
                className="btn-primary"
                style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>➕</span>
                <span>Yangi Shartnoma Tuzish</span>
              </button>
            </div>

            {/* Statistika Kartochkalari */}
            {(() => {
              const todayStr = new Date().toISOString().slice(0, 10);
              const activeCount = payers.filter(p => !p.contractEndDate || p.contractEndDate >= todayStr).length;
              const expiredCount = payers.filter(p => p.contractEndDate && p.contractEndDate < todayStr).length;

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div className="mini-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Jami Shartnomalar</span>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#002d62', margin: '4px 0 2px 0' }}>
                      {payers.length} ta
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Ro&apos;yxatga olingan to&apos;lovchi korxonalar</span>
                  </div>

                  <div className="mini-card" style={{ background: '#f0fdf4', border: '1.5px solid #86efac' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>🟢 Amaldagi Shartnomalar</span>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#15803d', margin: '4px 0 2px 0' }}>
                      {activeCount} ta
                    </div>
                    <span style={{ fontSize: '12px', color: '#166534' }}>To&apos;lov va ombor amallariga ruxsat bor</span>
                  </div>

                  <div className="mini-card" style={{ background: '#fef2f2', border: '1.5px solid #fca5a5' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>⛔ Muddati Tugagan Shartnomalar</span>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#dc2626', margin: '4px 0 2px 0' }}>
                      {expiredCount} ta
                    </div>
                    <span style={{ fontSize: '12px', color: '#b91c1c' }}>To&apos;lov va chiqim avtomatik bloklangan</span>
                  </div>
                </div>
              );
            })()}

            {/* Shartnomalar Jadvali */}
            <div className="mini-card" style={{ background: '#ffffff', padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>📋 Shartnoma Tuzgan Mijozlar Ro&apos;yxati</strong>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Sana formati: YYYY-MM-DD</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #cbd5e1', color: '#475569', fontSize: '11px', textTransform: 'uppercase', textAlign: 'left' }}>
                      <th style={{ padding: '12px 14px', width: '40px', textAlign: 'center' }}>№</th>
                      <th style={{ padding: '12px 14px' }}>To&apos;lovchi Korxona & STIR</th>
                      <th style={{ padding: '12px 14px' }}>Shartnoma Raqami</th>
                      <th style={{ padding: '12px 14px' }}>Tuzilgan Sana</th>
                      <th style={{ padding: '12px 14px' }}>Amal Qilish Muddati (Qachongacha)</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center' }}>Shartnoma Holati</th>
                      <th style={{ padding: '12px 14px' }}>Mas&apos;ul Vakil & Telefon</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center' }}>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payers.map((p, idx) => {
                      const todayStr = new Date().toISOString().slice(0, 10);
                      const isExpired = Boolean(p.contractEndDate && p.contractEndDate < todayStr);

                      return (
                        <tr
                          key={p.id}
                          style={{
                            borderBottom: '1px solid #e2e8f0',
                            background: isExpired ? '#fffbfb' : '#ffffff',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>
                            {idx + 1}
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <strong style={{ color: '#002d62', fontSize: '14px', display: 'block' }}>
                              {p.name}
                            </strong>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              STIR (INN): <strong>{p.inn}</strong>
                              {p.notes && \` • \${p.notes}\`}
                            </span>
                          </td>

                          <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>
                            <code>{p.contractNumber}</code>
                          </td>

                          <td style={{ padding: '12px 14px', color: '#475569', fontSize: '12px' }}>
                            📅 {p.contractStartDate}
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 800, color: isExpired ? '#dc2626' : '#15803d' }}>
                                📅 {p.contractEndDate}
                              </span>
                            </div>
                            <span style={{ fontSize: '10px', color: isExpired ? '#b91c1c' : '#166534', fontWeight: 600 }}>
                              {isExpired ? "Muddati o'tgan!" : "Amal qilish muddati ichida"}
                            </span>
                          </td>

                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            {isExpired ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                                <span>⛔</span>
                                <span>Muddati Tugagan (Bloklangan)</span>
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                                <span>🟢</span>
                                <span>Shartnoma Faol</span>
                              </span>
                            )}
                          </td>

                          <td style={{ padding: '12px 14px', fontSize: '12px' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.contactPerson}</div>
                            <div style={{ color: '#0284c7', fontSize: '11px' }}>📞 {p.phone}</div>
                          </td>

                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditPayer(p)}
                                className="btn-outline"
                                style={{
                                  fontSize: '11px',
                                  padding: '5px 10px',
                                  borderColor: isExpired ? '#fca5a5' : '#bfdbfe',
                                  color: isExpired ? '#dc2626' : '#002d62',
                                  background: isExpired ? '#fef2f2' : '#eff6ff',
                                  fontWeight: 700
                                }}
                                title="Shartnoma muddatini uzaytirish yoki o'zgartirish"
                              >
                                {isExpired ? '⚡ Muddatni Uzaytirish' : '✏️ Tahrirlash'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeletePayer(p.id, p.name)}
                                className="btn-outline"
                                style={{
                                  fontSize: '11px',
                                  padding: '5px 8px',
                                  borderColor: '#fca5a5',
                                  color: '#dc2626'
                                }}
                                title="O'chirish"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Foydalanuvchiga qoidalar eslatmasi */}
            <div style={{ marginTop: '16px', padding: '14px 18px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '22px' }}>ℹ️</span>
              <div style={{ fontSize: '12px', color: '#1e40af', lineHeight: 1.5 }}>
                <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Shartnoma muddati va chiqim qoidasi:</strong>
                Agar to&apos;lovchining shartnoma muddati tugagan bo&apos;lsa, omborchi ushbu mijozning tovarlarini chiqim qila olmaydi (Chiqim modali qizil ogohlantirish beradi va tasdiqlash bloklanadi).
                Tovarni chiqarish va to&apos;lovni amalga oshirish uchun avval <strong>«Muddatni Uzaytirish»</strong> tugmasi orqali yangi muddatni kiritib saqlang.
              </div>
            </div>
          </div>
        )}
`;

const markerTariffs = "{/* ========================================================\n            3-BO'LIM: BOJXONA PREYSKURANTI VA SAQLASH TARIFLARI";
content = content.replace(markerTariffs, payersSection + "\n\n        " + markerTariffs);

// 3. Yangi Shartnoma modali (Modal 10)
const payerModalStr = `
      {/* ========================================================
          MODAL 10: TO'LOVCHI SHARTNOMASINI QO'SHISH / MUDDATINI UZAYTIRISH
          ======================================================== */}
      {isPayerModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '580px' }}>
            <div className="modal-header-clean">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#002d62', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🤝</span>
                  <span>{editingPayer ? \`Shartnomani Yangilash: \${editingPayer.name}\` : 'Yangi Saqlash Shartnomasini Tuzish'}</span>
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  «JB GROUP» Bojxona ombori xizmatlari ko&apos;rsatish shartnomasi
                </span>
              </div>
              <button onClick={() => setIsPayerModalOpen(false)} style={{ fontSize: '18px', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleSavePayer}>
              <div className="modal-body-clean">
                <div className="form-field">
                  <label className="form-label">TO&apos;LOVCHI / KORXONA NOMI *</label>
                  <input
                    type="text"
                    required
                    className="form-input-clean"
                    placeholder="Masalan: Sag Agro Logistika MChJ"
                    value={payerForm.name}
                    onChange={e => setPayerForm({ ...payerForm, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">STIR / INN RAQAMI *</label>
                    <input
                      type="text"
                      required
                      className="form-input-clean"
                      placeholder="Masalan: 308942115"
                      value={payerForm.inn}
                      onChange={e => setPayerForm({ ...payerForm, inn: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">SHARTNOMA RAQAMI *</label>
                    <input
                      type="text"
                      required
                      className="form-input-clean"
                      placeholder="Masalan: SH-2026/01"
                      value={payerForm.contractNumber}
                      onChange={e => setPayerForm({ ...payerForm, contractNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">SHARTNOMA TUZILGAN SANA *</label>
                    <input
                      type="date"
                      required
                      className="form-input-clean"
                      value={payerForm.contractStartDate}
                      onChange={e => setPayerForm({ ...payerForm, contractStartDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ color: '#0070ba', fontWeight: 800 }}>
                      AMAL QILISH MUDDATI (QACHONGACHA) *
                    </label>
                    <input
                      type="date"
                      required
                      className="form-input-clean"
                      style={{ border: '1.5px solid #0070ba', background: '#f0f9ff' }}
                      value={payerForm.contractEndDate}
                      onChange={e => setPayerForm({ ...payerForm, contractEndDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Muddat ogohlantirishi */}
                {(() => {
                  const todayStr = new Date().toISOString().slice(0, 10);
                  const isExp = Boolean(payerForm.contractEndDate && payerForm.contractEndDate < todayStr);
                  return isExp ? (
                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '12px', color: '#dc2626' }}>
                      ⚠️ <strong>Diqqat:</strong> Ushbu sana bugungi kundan ({todayStr}) oldingi sana. Agar shu muddat saqlansa, mijoz muddati o&apos;tgan deb hisoblanadi va chiqim bloklanadi!
                    </div>
                  ) : (
                    <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '12px', color: '#166534' }}>
                      ✅ <strong>Shartnoma amalda bo&apos;ladi:</strong> Belgilangan muddatgacha ({payerForm.contractEndDate}) barcha yuk operatsiyalari va chiqimlar to&apos;siqsiz amalga oshiriladi.
                    </div>
                  );
                })()}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">MAS&apos;UL VAKIL F.I.SH</label>
                    <input
                      type="text"
                      className="form-input-clean"
                      placeholder="Masalan: Sirojiddin Aliyev"
                      value={payerForm.contactPerson}
                      onChange={e => setPayerForm({ ...payerForm, contactPerson: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">TELEFON RAQAMI</label>
                    <input
                      type="text"
                      className="form-input-clean"
                      placeholder="+998 90 123 45 67"
                      value={payerForm.phone}
                      onChange={e => setPayerForm({ ...payerForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">QO&apos;SHIMCHA IZOH / ASOS</label>
                  <textarea
                    rows={2}
                    className="form-input-clean"
                    placeholder="Shartnoma bo'yicha maxsus shartlar yoki qaydlar..."
                    value={payerForm.notes}
                    onChange={e => setPayerForm({ ...payerForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-clean">
                <button type="button" className="btn-secondary" onClick={() => setIsPayerModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)' }}>
                  💾 Shartnomani Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

const lastDivIndex = content.lastIndexOf('</div>\n  );\n}');
if (lastDivIndex !== -1) {
  content = content.slice(0, lastDivIndex) + payerModalStr + "\n    </div>\n  );\n}\n";
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated page.tsx with payers section and payer modal!');
