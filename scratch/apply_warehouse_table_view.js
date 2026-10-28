const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The block to replace begins around:
// {/* CHAP USTUN: Sektorlar Ro'yxati */}
// and goes down to end of right column before:
// {/* ========================================================
//     MODAL 1: YANGI YUK KIRITISH (KIRIM)

const startAnchor = "{/* CHAP USTUN: Sektorlar Ro'yxati */}";
const endAnchor = "2-BO'LIM: DASHBOARD (Chart va Tarix)";

let startIndex = content.indexOf(startAnchor);
let endIndex = content.indexOf(endAnchor);

if (startIndex === -1 || endIndex === -1) {
  console.error("Anchors not found!", { startIndex, endIndex });
  process.exit(1);
}

// Rewind endIndex slightly to just before the comment header
const commentStart = content.lastIndexOf('{/* ========================================================', endIndex);
if (commentStart !== -1) {
  endIndex = commentStart;
}

const replacement = `{/* CHAP USTUN: Sektorlar Ro'yxati */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    Ombor Sektorlari ({warehouse.sectors.length})
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Ko&apos;rish uchun bosing:</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Barcha Sektorlar Umumiy Tanlovi */}
                  <div
                    onClick={() => setSelectedSectorFilter('ALL')}
                    style={{
                      background: selectedSectorFilter === 'ALL' ? '#eff6ff' : '#ffffff',
                      border: selectedSectorFilter === 'ALL' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      boxShadow: selectedSectorFilter === 'ALL' ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>🏢</span>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#002d62', margin: 0 }}>
                            Barcha Sektorlar (Hammasi)
                          </h4>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            Umumiy: {storedProducts.length} xil yuk partiyasi
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: selectedSectorFilter === 'ALL' ? '#2563eb' : '#f1f5f9', color: selectedSectorFilter === 'ALL' ? '#ffffff' : '#1d4ed8', fontWeight: 800 }}>
                        {storedProducts.length} ta yuk
                      </span>
                    </div>
                  </div>

                  {warehouse.sectors.map(sec => {
                    const meta = getSectorMeta(sec.type);
                    const stockInfo = sectorStockMap[sec.id] || { totalItems: 0, unitsSummary: '' };
                    const isSelected = selectedSectorFilter === sec.id || (selectedSectorFilter === 'ALL' && selectedSector?.id === sec.id);
                    const access = checkSectorAccess(sec, currentUser);

                    return (
                      <div
                        key={sec.id}
                        onClick={() => {
                          setSelectedSector(sec);
                          setSelectedSectorFilter(sec.id);
                        }}
                        style={{
                          background: isSelected && selectedSectorFilter !== 'ALL' ? '#ffffff' : '#fafafa',
                          border: isSelected && selectedSectorFilter !== 'ALL' ? '2px solid #2563eb' : !access.allowed ? '1px dashed #fca5a5' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          cursor: 'pointer',
                          boxShadow: isSelected && selectedSectorFilter !== 'ALL' ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none',
                          transition: 'all 0.15s ease',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '18px' }}>{meta.icon}</span>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#002d62', margin: 0 }}>
                                  {sec.name}
                                </h4>
                                {!access.allowed && (
                                  <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                                    {sec.type === 'HAZARDOUS' ? '☣️ Ruxsatsiz' : '🔒 Ruxsat yo\'q'}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7', marginTop: '1px' }}>
                                📐 Hajmi: {sec.capacity.toLocaleString('uz-UZ')} m²
                              </div>
                              {sec.subSections && (
                                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                                  🏷️ Otseklar: {sec.subSections}
                                </div>
                              )}
                              <div style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>
                                🏷️ Tarif: {sec.tariffName || 'Biriktirilmagan'}
                              </div>
                            </div>
                          </div>
                          <span className={\`sector-badge \${meta.badgeClass}\`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                            {meta.label}
                          </span>
                        </div>

                        {/* Tizim avtomatik hisoblagan tovarlar miqdori */}
                        <div style={{ marginTop: '6px', padding: '6px 8px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b' }}>
                            <span>Mavjud tovarlar: <strong style={{ color: '#0f172a' }}>{stockInfo.totalItems} xil</strong></span>
                            <span style={{ color: '#059669', fontWeight: 700 }}>● {sec.status}</span>
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', marginTop: '1px' }}>
                            {stockInfo.unitsSummary}
                          </div>
                        </div>

                        {/* Sektor Sozlash tugmasi */}
                        {canManageWarehouse && (
                          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                            <button
                              onClick={(e) => openEditSector(sec, e)}
                              className="btn-outline"
                              style={{ fontSize: '10px', padding: '2px 6px' }}
                            >
                              ⚙️ Sozlash
                            </button>
                            {isSuperAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSector(sec.id, sec.name);
                                }}
                                style={{ color: '#dc2626', background: 'transparent', padding: '2px 5px', fontSize: '10px' }}
                                title="O'chirish"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* O'NG USTUN: OMBOR YUKLARI JADVALI VA BOSHQARUV TIZIMI (FOYDALANUVCHI TALABI) */}
              <div>
                <div className="mini-card" style={{ background: '#ffffff', minHeight: '560px', padding: '18px 20px' }}>
                  {/* Sektor Sarlavhasi va Meta Ma'lumotlari */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '28px' }}>
                        {selectedSectorFilter === 'ALL' ? '🏢' : selectedSector ? getSectorMeta(selectedSector.type).icon : '📦'}
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#002d62', margin: 0 }}>
                            {selectedSectorFilter === 'ALL' 
                              ? 'Barcha Sektorlardagi Yuklar Ro\'yxati (Umumiy Baza)'
                              : selectedSector ? selectedSector.name : 'Sektor'}
                          </h3>
                          {selectedSectorFilter !== 'ALL' && selectedSector && (
                            <span className={\`sector-badge \${getSectorMeta(selectedSector.type).badgeClass}\`} style={{ fontSize: '10px' }}>
                              {getSectorMeta(selectedSector.type).label}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>
                          {selectedSectorFilter === 'ALL' ? (
                            <span>Ombor majmuasidagi barcha 6 ta sektor bo&apos;yicha jamlangan tovarlar hisobi</span>
                          ) : selectedSector ? (
                            <>
                              <strong style={{ color: '#0284c7' }}>📐 Maydon: {selectedSector.capacity.toLocaleString('uz-UZ')} m²</strong>
                              {selectedSector.subSections && (
                                <span style={{ marginLeft: '8px', color: '#64748b' }}>(Otseklar: {selectedSector.subSections})</span>
                              )}
                              <span style={{ marginLeft: '8px' }}>• Harorat: <strong>{selectedSector.temperature || 'Standart'}</strong></span>
                              <span style={{ marginLeft: '8px', color: '#059669', fontWeight: 700 }}>• Tarif: {selectedSector.tariffName || 'Biriktirilmagan'}</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Sektorga yangi yuk kiritish tugmasi */}
                    {canStockMovement && (
                      <button
                        onClick={() => {
                          const targetSec = selectedSectorFilter !== 'ALL' 
                            ? warehouse.sectors.find(s => s.id === selectedSectorFilter) || selectedSector || warehouse.sectors[0]
                            : selectedSector || warehouse.sectors[0];
                          const secTariff = tariffs.find(t => t.id === targetSec?.tariffId) || tariffs[0];
                          setProductForm({
                            sectorId: targetSec?.id || '',
                            name: '',
                            category: 'Oziq-ovqat',
                            quantity: 500,
                            unit: 'quti',
                            weightKg: 10000,
                            clientName: '',
                            payerId: '',
                            notes: ''
                          });
                          setIsAddProductModalOpen(true);
                        }}
                        className="btn-primary"
                        style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span>📥</span>
                        <span>+ Yangi Yuk Kirim Qilish</span>
                      </button>
                    )}
                  </div>

                  {/* Ruxsat etilmagan xodim ogohlantirishi */}
                  {selectedSectorFilter !== 'ALL' && selectedSector && !checkSectorAccess(selectedSector, currentUser).allowed && (
                    <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>🚫</span>
                      <div style={{ fontSize: '12px', color: '#b91c1c' }}>
                        <strong>Ushbu Sektor Bilan Ishlash Huquqingiz Cheklangan:</strong> {checkSectorAccess(selectedSector, currentUser).reason}
                      </div>
                    </div>
                  )}

                  {/* ========================================================
                      TEZKOR QIDIRUV VA JADVAL FILTRLASH BOSHQARUVI (TALAB ASOSIDA)
                      ======================================================== */}
                  <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    {/* Qidiruv input */}
                    <div style={{ flex: '1 1 320px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '14px' }}>🔍</span>
                      <input
                        type="text"
                        className="form-input-clean"
                        style={{ paddingLeft: '36px', background: '#ffffff', fontSize: '12.5px' }}
                        placeholder="Yuk nomi, nakladnoy, korxona (to'lovchi), STIR (INN) yoki sektor bo'yicha qidiruv..."
                        value={productSearchQuery}
                        onChange={e => setProductSearchQuery(e.target.value)}
                      />
                      {productSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setProductSearchQuery('')}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Sektor bo'yicha filter dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Sektor:</span>
                      <select
                        className="form-select-clean"
                        value={selectedSectorFilter}
                        onChange={e => setSelectedSectorFilter(e.target.value)}
                        style={{ background: '#ffffff', fontSize: '12px', padding: '6px 10px', width: 'auto' }}
                      >
                        <option value="ALL">🏢 Barcha Sektorlar ({storedProducts.length} ta)</option>
                        {warehouse.sectors.map(sec => {
                          const count = storedProducts.filter(p => p.sectorId === sec.id).length;
                          return (
                            <option key={sec.id} value={sec.id}>
                              {sec.name} ({count} ta yuk)
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Ko'rinish rejimi: Jadval / Kartochkalar */}
                    <div style={{ display: 'flex', alignItems: 'center', background: '#e2e8f0', padding: '3px', borderRadius: '8px', gap: '2px' }}>
                      <button
                        type="button"
                        onClick={() => setProductViewMode('TABLE')}
                        style={{
                          background: productViewMode === 'TABLE' ? '#ffffff' : 'transparent',
                          color: productViewMode === 'TABLE' ? '#002d62' : '#64748b',
                          fontWeight: 700,
                          fontSize: '11px',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: productViewMode === 'TABLE' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                      >
                        <span>📑</span>
                        <span>Jadval Ko&apos;rinishi</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductViewMode('CARDS')}
                        style={{
                          background: productViewMode === 'CARDS' ? '#ffffff' : 'transparent',
                          color: productViewMode === 'CARDS' ? '#002d62' : '#64748b',
                          fontWeight: 700,
                          fontSize: '11px',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: productViewMode === 'CARDS' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                      >
                        <span>🗂️</span>
                        <span>Karta Ko&apos;rinishi</span>
                      </button>
                    </div>
                  </div>

                  {/* Ko'rsatkichlar status paneli */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '12px' }}>
                    <span style={{ color: '#475569', fontWeight: 700 }}>
                      📦 Ko&apos;rsatilmoqda: <strong style={{ color: '#002d62' }}>{filteredWarehouseProducts.length} ta yuk partiyasi</strong>
                      {productSearchQuery && <span style={{ color: '#0284c7', marginLeft: '6px' }}>(Qidiruv: &quot;{productSearchQuery}&quot;)</span>}
                    </span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>
                      Jami og&apos;irlik: {filteredWarehouseProducts.reduce((acc, p) => acc + (p.weightKg || p.quantity), 0).toLocaleString('uz-UZ')} kg
                    </span>
                  </div>

                  {/* ========================================================
                      JADVAL SHAKLI (TABLE VIEW) — FOYDALANUVCHINING 1-TALABI
                      ======================================================== */}
                  {productViewMode === 'TABLE' ? (
                    filteredWarehouseProducts.length > 0 ? (
                      <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ background: '#002d62', color: '#ffffff', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.02em' }}>
                              <th style={{ padding: '10px 12px', width: '35px', textAlign: 'center' }}>№</th>
                              <th style={{ padding: '10px 12px', minWidth: '180px' }}>Yuk (Mahsulot) Nomi & Nakladnoy</th>
                              <th style={{ padding: '10px 12px', minWidth: '100px' }}>Sektor</th>
                              <th style={{ padding: '10px 12px', minWidth: '170px' }}>Yuk To&apos;lovchisi (Mijoz) & STIR</th>
                              <th style={{ padding: '10px 12px', textAlign: 'right', minWidth: '100px' }}>Qoldiq</th>
                              <th style={{ padding: '10px 12px', textAlign: 'right', minWidth: '110px' }}>Og&apos;irligi</th>
                              <th style={{ padding: '10px 12px', minWidth: '120px' }}>Kirim Sanasi & Xodim</th>
                              <th style={{ padding: '10px 12px', textAlign: 'center', minWidth: '80px' }}>Muddati</th>
                              <th style={{ padding: '10px 12px', minWidth: '140px' }}>Tushirish (Разгрузка)</th>
                              <th style={{ padding: '10px 12px', textAlign: 'center', minWidth: '150px' }}>Amallar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredWarehouseProducts.map((prod, idx) => {
                              const daysStored = calculateDaysStored(prod.entryDate);
                              const targetSec = warehouse.sectors.find(s => s.id === prod.sectorId);
                              const canExitThis = canStockMovement && checkSectorAccess(targetSec || null, currentUser).allowed;
                              const matchedPayer = payers.find(p => p.id === prod.payerId || p.name.toLowerCase() === prod.clientName?.toLowerCase());

                              return (
                                <tr
                                  key={prod.id}
                                  style={{
                                    borderBottom: '1px solid #f1f5f9',
                                    background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                                    transition: 'background 0.15s'
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#f8fafc'}
                                >
                                  {/* № */}
                                  <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>
                                    {idx + 1}
                                  </td>

                                  {/* Yuk nomi */}
                                  <td style={{ padding: '10px 12px' }}>
                                    <div
                                      onClick={() => setSelectedProductHistory(prod)}
                                      style={{ fontWeight: 800, color: '#002d62', cursor: 'pointer', textDecoration: 'underline' }}
                                      title="Yuk tarixi va invoyslarni ochish uchun bosing"
                                    >
                                      📦 {prod.name}
                                    </div>
                                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px', display: 'flex', gap: '6px' }}>
                                      <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                                        {prod.category || 'Umumiy'}
                                      </span>
                                      {prod.notes && <span>• {prod.notes}</span>}
                                    </div>
                                  </td>

                                  {/* Sektor */}
                                  <td style={{ padding: '10px 12px' }}>
                                    <strong style={{ color: '#0284c7', display: 'block' }}>{prod.sectorName}</strong>
                                    {targetSec?.temperature && (
                                      <span style={{ fontSize: '10.5px', color: '#059669', fontWeight: 600 }}>
                                        {targetSec.temperature}
                                      </span>
                                    )}
                                  </td>

                                  {/* To'lovchi & STIR */}
                                  <td style={{ padding: '10px 12px' }}>
                                    <strong style={{ color: '#0f172a', display: 'block', fontSize: '12.5px' }}>
                                      🏢 {prod.clientName || 'Noma\'lum mijoz'}
                                    </strong>
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                      STIR (INN): <code style={{ color: '#0284c7', background: '#eff6ff', padding: '1px 4px', borderRadius: '3px' }}>{matchedPayer?.inn || '308942115'}</code>
                                    </div>
                                    {prod.contractNumber && (
                                      <div style={{ fontSize: '10px', color: '#64748b' }}>
                                        Shartnoma: №{prod.contractNumber}
                                      </div>
                                    )}
                                  </td>

                                  {/* Qoldiq */}
                                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                    <strong style={{ color: '#1d4ed8', fontSize: '13px', display: 'block' }}>
                                      {prod.quantity.toLocaleString('uz-UZ')} {prod.unit}
                                    </strong>
                                    <span style={{ fontSize: '10px', color: '#64748b' }}>
                                      Dastlabki: {(prod.initialQuantity || prod.quantity).toLocaleString('uz-UZ')}
                                    </span>
                                  </td>

                                  {/* Og'irligi */}
                                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                    <strong style={{ color: '#059669', fontSize: '13px', display: 'block' }}>
                                      ⚖️ {(prod.weightKg || prod.quantity).toLocaleString('uz-UZ')} kg
                                    </strong>
                                    <span style={{ fontSize: '10px', color: '#64748b' }}>
                                      ({(((prod.weightKg || prod.quantity) / 1000)).toFixed(1)} tn)
                                    </span>
                                  </td>

                                  {/* Kirim sanasi & Mas'ul */}
                                  <td style={{ padding: '10px 12px' }}>
                                    <div style={{ color: '#0f172a', fontWeight: 600 }}>
                                      📅 {prod.entryDate}
                                    </div>
                                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '1px' }}>
                                      👤 {prod.placedBy}
                                    </div>
                                  </td>

                                  {/* Saqlanish muddati */}
                                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                    <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '3px 7px', borderRadius: '5px', fontWeight: 800, fontSize: '11px', display: 'inline-block' }}>
                                      ⏱️ {daysStored} kun
                                    </span>
                                  </td>

                                  {/* Tushirish xizmati */}
                                  <td style={{ padding: '10px 12px' }}>
                                    <span style={{ color: '#0369a1', fontSize: '11.5px', fontWeight: 600, display: 'block' }}>
                                      🚛 {prod.obrabotkaService || 'Yuk tushirish (Разгрузка)'}
                                    </span>
                                  </td>

                                  {/* Amallar */}
                                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedProductHistory(prod)}
                                        style={{
                                          background: '#eff6ff',
                                          border: '1px solid #bfdbfe',
                                          color: '#1d4ed8',
                                          borderRadius: '6px',
                                          padding: '5px 8px',
                                          fontSize: '11px',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '4px'
                                        }}
                                        title="Yuk hayotiy tarixi va barcha nakladnoylarini ko'rish"
                                      >
                                        <span>📜</span>
                                        <span>Tarix</span>
                                      </button>

                                      {canExitThis && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedProductToExit(prod);
                                            setExitQuantity(prod.quantity);
                                            setExitWeightKg(prod.weightKg);
                                            setExitNotes('');
                                            const pMatch = payers.find(p => p.id === prod.payerId || p.name.toLowerCase() === prod.clientName?.toLowerCase());
                                            setExitReceiverInn(pMatch?.inn || '');
                                            setExitReceiverName(pMatch?.name || prod.clientName || '');
                                            setExitReceiverPerson(pMatch?.contactPerson || '');
                                            setIsExitModalOpen(true);
                                          }}
                                          style={{
                                            background: '#fff5f5',
                                            border: '1px solid #fca5a5',
                                            color: '#dc2626',
                                            borderRadius: '6px',
                                            padding: '5px 8px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                          }}
                                          title="Ombordan yuk chiqarish va rasmiy chiqim nakladnoyi shakllantirish"
                                        >
                                          <span>📤</span>
                                          <span>Chiqim</span>
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px 20px', border: '1.5px dashed #cbd5e1', borderRadius: '10px', color: '#64748b' }}>
                        <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>🔍</span>
                        <h4 style={{ fontSize: '15px', color: '#0f172a', margin: '0 0 4px 0' }}>
                          Hech qanday yuk topilmadi
                        </h4>
                        <p style={{ fontSize: '12px', margin: 0 }}>
                          Kiritilgan qidiruv yoki tanlangan sektor bo&apos;yicha omborda tovar mavjud emas.
                        </p>
                      </div>
                    )
                  ) : (
                    /* KARTA KO'RINISHI (CARDS VIEW) */
                    filteredWarehouseProducts.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredWarehouseProducts.map(prod => {
                          const daysStored = calculateDaysStored(prod.entryDate);
                          const targetSec = warehouse.sectors.find(s => s.id === prod.sectorId);
                          const canExitThis = canStockMovement && checkSectorAccess(targetSec || null, currentUser).allowed;

                          return (
                            <div
                              key={prod.id}
                              style={{
                                border: '1px solid #e2e8f0',
                                borderRadius: '10px',
                                padding: '14px 16px',
                                background: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h4
                                      onClick={() => setSelectedProductHistory(prod)}
                                      style={{ fontSize: '16px', fontWeight: 900, color: '#002d62', margin: 0, cursor: 'pointer', textDecoration: 'underline' }}
                                      title="Yuk tarixi va barcha nakladnoylarini ko'rish uchun bosing"
                                    >
                                      📦 {prod.name}
                                    </h4>
                                    <span style={{ fontSize: '10px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                      {prod.sectorName}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#64748b', flexWrap: 'wrap', marginTop: '3px' }}>
                                    <span>Mijoz: <strong style={{ color: '#334155' }}>{prod.clientName || 'Ichki zaxira'}</strong></span>
                                    <span>•</span>
                                    <span>Kategoriya: <strong>{prod.category || 'Umumiy'}</strong></span>
                                  </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#1d4ed8' }}>
                                    {prod.quantity.toLocaleString('uz-UZ')} {prod.unit}
                                  </div>
                                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#059669', marginTop: '1px' }}>
                                    ⚖️ {(prod.weightKg || prod.quantity).toLocaleString('uz-UZ')} kg
                                  </div>
                                </div>
                              </div>

                              <div style={{ margin: '12px 0', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px', fontSize: '12px' }}>
                                <div>
                                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>📅 Kirim Qilingan Sana:</span>
                                  <strong style={{ color: '#0f172a' }}>{prod.entryDate} • {prod.entryTime}</strong>
                                </div>
                                <div>
                                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>👤 Mas&apos;ul Xodim:</span>
                                  <strong style={{ color: '#002d62' }}>{prod.placedBy}</strong>
                                </div>
                                <div>
                                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>🚛 Tushirish Usuli:</span>
                                  <strong style={{ color: '#0284c7' }}>{prod.obrabotkaService || 'Yuk tushirish (Разгрузка)'}</strong>
                                </div>
                                <div>
                                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>⏱️ Saqlanish Muddati:</span>
                                  <strong style={{ color: '#059669' }}>{daysStored} kundan beri</strong>
                                </div>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f8fafc', flexWrap: 'wrap', gap: '8px' }}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedProductHistory(prod)}
                                  className="btn-outline"
                                  style={{ borderColor: '#bfdbfe', color: '#1d4ed8', background: '#eff6ff', fontWeight: 700, fontSize: '12px', padding: '6px 12px' }}
                                >
                                  📜 Tarix & Nakladnoylar (Invoyslar)
                                </button>
                                {canExitThis && (
                                  <button
                                    onClick={() => {
                                      setSelectedProductToExit(prod);
                                      setExitQuantity(prod.quantity);
                                      setExitWeightKg(prod.weightKg);
                                      setExitNotes('');
                                      const pMatch = payers.find(p => p.id === prod.payerId || p.name.toLowerCase() === prod.clientName?.toLowerCase());
                                      setExitReceiverInn(pMatch?.inn || '');
                                      setExitReceiverName(pMatch?.name || prod.clientName || '');
                                      setExitReceiverPerson(pMatch?.contactPerson || '');
                                      setIsExitModalOpen(true);
                                    }}
                                    className="btn-outline"
                                    style={{ borderColor: '#fca5a5', color: '#dc2626', background: '#fff5f5', fontWeight: 700, fontSize: '12px', padding: '6px 14px' }}
                                  >
                                    📤 Ombordan Chiqarish & Tarifni Hisoblash
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px 20px', border: '1.5px dashed #cbd5e1', borderRadius: '10px', color: '#64748b' }}>
                        <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📭</span>
                        <h4 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>Ushbu mezon bo&apos;yicha yuk topilmadi</h4>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        `;

content = content.slice(0, startIndex) + replacement + content.slice(endIndex);
fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully replaced sector & cargo section with unified warehouse table and search!");
