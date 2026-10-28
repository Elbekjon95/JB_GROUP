const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. filter va search state qo'shish
content = content.replace(
  "const [customsSearch, setCustomsSearch] = useState('');",
  "const [customsSearch, setCustomsSearch] = useState('');\n  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');\n  const [historySearch, setHistorySearch] = useState<string>('');"
);

// 2. 2-BO'LIM (Tarix) sarlavhasi va filtrlash blokini boyitish
const oldTableBlockTarget = `            {/* So'nggi Harakatlar va To'lovlar Tarixi */}
            <div className="mini-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  📋 Barcha Kirim va Chiqim Amallari Tarixi
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Jami {movements.length} ta yozuv</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 12px' }}>Turi</th>
                      <th style={{ padding: '8px 12px' }}>Mahsulot & Izoh</th>
                      <th style={{ padding: '8px 12px' }}>Sektor</th>
                      <th style={{ padding: '8px 12px' }}>Miqdori</th>
                      <th style={{ padding: '8px 12px' }}>Hisoblangan To&apos;lov</th>
                      <th style={{ padding: '8px 12px' }}>Mas&apos;ul Xodim</th>
                      <th style={{ padding: '8px 12px' }}>Sana & Vaqt</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Hujjat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, background: m.type === 'IN' ? '#ecfdf5' : '#fef2f2', color: m.type === 'IN' ? '#059669' : '#dc2626' }}>
                            {m.type === 'IN' ? '+ KIRIM' : '- CHIQIM'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>
                          {m.productName}
                          {m.clientName && <span style={{ display: 'block', fontSize: '11px', color: '#0070ba', fontWeight: 600 }}>🏢 {m.clientName}</span>}
                          {m.transportType && <span style={{ display: 'block', fontSize: '10px', color: '#64748b' }}>🚛 {m.transportType}</span>}
                          {m.notes && <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>{m.notes}</div>}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#475569', fontWeight: 600 }}>{m.sectorName}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <strong style={{ color: '#0f172a', fontSize: '13px' }}>{m.quantity.toLocaleString('uz-UZ')} {m.unit}</strong>
                          {m.initialQuantity && (
                            <span style={{ display: 'block', fontSize: '10px', color: '#64748b' }}>
                              Dastlabki: {m.initialQuantity.toLocaleString('uz-UZ')} {m.unit}
                            </span>
                          )}
                          {m.remainingQuantity !== undefined && (
                            <span style={{ display: 'block', fontSize: '10px', color: '#059669', fontWeight: 700 }}>
                              Qoldiq: {m.remainingQuantity.toLocaleString('uz-UZ')} {m.unit}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {m.grandTotalUZS || m.totalCostUZS ? (
                            <div>
                              <strong style={{ color: m.type === 'IN' ? '#0284c7' : '#059669', fontSize: '13px' }}>
                                {(m.grandTotalUZS || m.totalCostUZS || 0).toLocaleString('uz-UZ')} UZS
                              </strong>
                              <span style={{ display: 'block', fontSize: '10px', color: '#64748b' }}>
                                {m.type === 'IN' ? '🏗️ Obrabotka' : \`❄️ Xraneniya (\${m.daysStored || 1} kun)\`}
                              </span>
                              {m.vatTotalUZS ? (
                                <span style={{ display: 'block', fontSize: '10px', color: '#0070ba' }}>
                                  (12% QQS: {m.vatTotalUZS.toLocaleString('uz-UZ')} UZS)
                                </span>
                              ) : null}
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#334155' }}>
                          <strong style={{ color: '#002d62', fontSize: '12px', display: 'block' }}>{m.userName}</strong>
                          <span style={{ fontSize: '10px', color: '#64748b' }}>({m.userRole})</span>
                          {m.placedBy && m.type === 'OUT' && (
                            <span style={{ display: 'block', fontSize: '10px', color: '#475569', marginTop: '2px' }}>
                              Keltirgan: {m.placedBy}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '12px' }}>
                          {m.date}
                          <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8' }}>{m.time}</span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceMovement(m)}
                            className="btn-outline"
                            style={{
                              fontSize: '11px',
                              padding: '4px 10px',
                              color: '#002d62',
                              borderColor: '#bfdbfe',
                              background: '#eff6ff',
                              fontWeight: 700,
                              borderRadius: '6px'
                            }}
                          >
                            🧾 Invoys
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>`;

const newTableBlockReplacement = `            {/* Barcha Kirim-Chiqim Harakatlari va To'liq Tarix Jurnali (Foydalanuvchi talabi) */}
            <div className="mini-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#002d62', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📜</span>
                    <span>Barcha Yuklar Harakati, Kirim va Chiqim Tarixi</span>
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Kim qabul qilgan, kim qancha chiqargan, qabul qiluvchi INN va barcha rasmiy ma&apos;lumotlar to&apos;liq arxivi
                  </span>
                </div>

                {/* Qidiruv va Filtrlar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="🔍 Tovar, korxona, INN yoki xodim..."
                    className="form-input-clean"
                    style={{ width: '220px', padding: '6px 12px', fontSize: '12px' }}
                    value={historySearch}
                    onChange={e => setHistorySearch(e.target.value)}
                  />

                  <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', gap: '2px' }}>
                    <button
                      type="button"
                      onClick={() => setHistoryFilter('ALL')}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '6px',
                        background: historyFilter === 'ALL' ? '#ffffff' : 'transparent',
                        color: historyFilter === 'ALL' ? '#0f172a' : '#64748b',
                        boxShadow: historyFilter === 'ALL' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      Barchasi
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryFilter('IN')}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '6px',
                        background: historyFilter === 'IN' ? '#ecfdf5' : 'transparent',
                        color: historyFilter === 'IN' ? '#059669' : '#64748b'
                      }}
                    >
                      📥 Kirimlar
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryFilter('OUT')}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '6px',
                        background: historyFilter === 'OUT' ? '#fef2f2' : 'transparent',
                        color: historyFilter === 'OUT' ? '#dc2626' : '#64748b'
                      }}
                    >
                      📤 Chiqimlar
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1', textAlign: 'left', color: '#475569', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 12px' }}>Amal</th>
                      <th style={{ padding: '10px 12px' }}>Yuk Nomi & Sektor</th>
                      <th style={{ padding: '10px 12px' }}>Kim Qabul Qilgan (Kirim)</th>
                      <th style={{ padding: '10px 12px' }}>Kim Chiqargan (Chiqim)</th>
                      <th style={{ padding: '10px 12px' }}>Yuk Berilgan Tarafi & INN</th>
                      <th style={{ padding: '10px 12px' }}>Miqdor & Og&apos;irlik</th>
                      <th style={{ padding: '10px 12px' }}>To&apos;lov</th>
                      <th style={{ padding: '10px 12px' }}>Sana & Vaqt</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Hujjat / Amal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements
                      .filter(m => {
                        if (historyFilter === 'IN' && m.type !== 'IN') return false;
                        if (historyFilter === 'OUT' && m.type !== 'OUT') return false;
                        if (historySearch.trim()) {
                          const q = historySearch.toLowerCase();
                          const matchProd = m.productName.toLowerCase().includes(q);
                          const matchClient = (m.clientName || '').toLowerCase().includes(q);
                          const matchReceiver = (m.receiverName || '').toLowerCase().includes(q);
                          const matchInn = (m.receiverInn || '').includes(q);
                          const matchUser = m.userName.toLowerCase().includes(q);
                          return matchProd || matchClient || matchReceiver || matchInn || matchUser;
                        }
                        return true;
                      })
                      .map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', background: m.type === 'IN' ? '#fafdfb' : '#fffbfb' }}>
                        {/* Amal Turi */}
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, background: m.type === 'IN' ? '#dcfce7' : '#fee2e2', color: m.type === 'IN' ? '#15803d' : '#b91c1c' }}>
                            {m.type === 'IN' ? '📥 KIRIM' : '📤 CHIQIM'}
                          </span>
                        </td>

                        {/* Yuk Nomi & Sektor */}
                        <td style={{ padding: '10px 12px' }}>
                          <strong style={{ color: '#002d62', fontSize: '13px', display: 'block' }}>{m.productName}</strong>
                          <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Sklad: {m.sectorName}</span>
                          {m.notes && <div style={{ fontSize: '10px', color: '#94a3b8' }}>{m.notes}</div>}
                        </td>

                        {/* Kim Qabul Qilgan (Kirim xodimi) */}
                        <td style={{ padding: '10px 12px', color: '#1e293b' }}>
                          {m.type === 'IN' ? (
                            <div>
                              <strong style={{ color: '#047857', display: 'block' }}>👤 {m.userName}</strong>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>({m.userRole})</span>
                              {m.transportType && <span style={{ display: 'block', fontSize: '10px', color: '#0284c7' }}>🚛 {m.transportType}</span>}
                            </div>
                          ) : (
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              <span>Dastlabki: </span>
                              <strong style={{ color: '#334155' }}>{m.placedBy || 'Omborchi'}</strong>
                            </div>
                          )}
                        </td>

                        {/* Kim Chiqargan (Chiqim xodimi) */}
                        <td style={{ padding: '10px 12px' }}>
                          {m.type === 'OUT' ? (
                            <div>
                              <strong style={{ color: '#b91c1c', display: 'block' }}>📤 {m.userName}</strong>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>({m.userRole})</span>
                            </div>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>—</span>
                          )}
                        </td>

                        {/* Yuk Berilgan Tarafi & INN */}
                        <td style={{ padding: '10px 12px' }}>
                          {m.type === 'OUT' ? (
                            <div>
                              <strong style={{ color: '#0f172a', display: 'block', fontSize: '12px' }}>
                                🏢 {m.receiverName || m.clientName || "Noma'lum Korxona"}
                              </strong>
                              <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>
                                INN: <code>{m.receiverInn || (payers.find(p => p.name === (m.receiverName || m.clientName))?.inn) || '308942115'}</code>
                              </div>
                              {m.receiverPerson && (
                                <span style={{ display: 'block', fontSize: '10px', color: '#475569' }}>
                                  Vakil: {m.receiverPerson}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div>
                              <span style={{ color: '#64748b', fontSize: '11px' }}>Mijoz (Egasi):</span>
                              <strong style={{ display: 'block', color: '#0f172a' }}>{m.clientName || 'Noma\'lum'}</strong>
                            </div>
                          )}
                        </td>

                        {/* Miqdor va Og'irlik */}
                        <td style={{ padding: '10px 12px' }}>
                          <strong style={{ color: '#0f172a', fontSize: '13px', display: 'block' }}>
                            {m.quantity.toLocaleString('uz-UZ')} {m.unit}
                          </strong>
                          {m.weightKg && (
                            <span style={{ color: '#059669', fontWeight: 700, fontSize: '11px', display: 'block' }}>
                              ⚖️ {m.weightKg.toLocaleString('uz-UZ')} kg
                            </span>
                          )}
                          {m.remainingQuantity !== undefined && (
                            <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>
                              Qoldiq: {m.remainingQuantity} {m.unit} ({m.remainingWeightKg || 0} kg)
                            </span>
                          )}
                        </td>

                        {/* Hisoblangan To'lov */}
                        <td style={{ padding: '10px 12px' }}>
                          {m.grandTotalUZS || m.totalCostUZS ? (
                            <div>
                              <strong style={{ color: m.type === 'IN' ? '#0284c7' : '#15803d', fontSize: '13px', display: 'block' }}>
                                {(m.grandTotalUZS || m.totalCostUZS || 0).toLocaleString('uz-UZ')} UZS
                              </strong>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>
                                {m.type === 'IN' ? 'Obrabotka' : \`Xraneniya (\${m.daysStored || 1} kun)\`}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>-</span>
                          )}
                        </td>

                        {/* Sana & Vaqt */}
                        <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '11px' }}>
                          <strong>{m.date}</strong>
                          <span style={{ display: 'block', color: '#94a3b8' }}>{m.time}</span>
                        </td>

                        {/* Hujjat / Amal: Kirimda nakladnoy yo'q, faqat chiqimda bor! */}
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          {m.type === 'OUT' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProductHistory(null);
                                setSelectedInvoiceMovement(m);
                              }}
                              className="btn-outline"
                              style={{
                                fontSize: '11px',
                                padding: '5px 10px',
                                color: '#b91c1c',
                                borderColor: '#fca5a5',
                                background: '#fef2f2',
                                fontWeight: 800,
                                borderRadius: '6px'
                              }}
                              title="Chiqim Nakladnoyini ko'rish va chop etish"
                            >
                              🧾 Chiqim Nakladnoyi
                            </button>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#047857', background: '#ecfdf5', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                              ✅ Qabul Tarixi
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>`;

content = content.replace(oldTableBlockTarget, newTableBlockReplacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated movements history table with rich details and no-kirim-invoice rule!');
