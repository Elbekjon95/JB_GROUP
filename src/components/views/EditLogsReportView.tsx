import React, { useState, useMemo } from 'react';
import { ProductEditLog, Language } from '@/lib/types';
import { t } from '@/lib/i18n';

interface EditLogsReportViewProps {
  editLogs: ProductEditLog[];
  lang?: Language;
  onExportCSV: (filteredLogs: ProductEditLog[], month: string) => void;
}

export const EditLogsReportView: React.FC<EditLogsReportViewProps> = ({
  editLogs,
  lang = 'uz',
  onExportCSV
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => new Date().toISOString().slice(0, 7));
  const [selectedEmployee, setSelectedEmployee] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mavjud xodimlar ro'yxati
  const uniqueEmployees = useMemo(() => {
    const set = new Set<string>();
    editLogs.forEach(l => {
      if (l.userName) set.add(l.userName);
    });
    return Array.from(set);
  }, [editLogs]);

  // Filtrlangan tahrirlar
  const filteredLogs = useMemo(() => {
    return editLogs.filter(log => {
      const matchMonth = !selectedMonth || (log.month && log.month === selectedMonth) || (log.date && log.date.startsWith(selectedMonth));
      const matchEmp = selectedEmployee === 'ALL' || log.userName === selectedEmployee;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        (log.productName || '').toLowerCase().includes(q) ||
        (log.userName || '').toLowerCase().includes(q) ||
        (log.reason || '').toLowerCase().includes(q) ||
        (log.sectorName || '').toLowerCase().includes(q) ||
        (log.clientName || '').toLowerCase().includes(q);
      return matchMonth && matchEmp && matchSearch;
    });
  }, [editLogs, selectedMonth, selectedEmployee, searchQuery]);

  // Xodimlar kesimida oylik svodka (Kim bir oyda nechta yukni to'g'rilagan)
  const employeeSummary = useMemo(() => {
    const map = new Map<string, {
      userName: string;
      userRole: string;
      editsCount: number;
      fieldsChangedCount: number;
      productsEdited: Set<string>;
      lastEditDate: string;
    }>();

    filteredLogs.forEach(log => {
      const name = log.userName || "Noma'lum xodim";
      const existing = map.get(name) || {
        userName: name,
        userRole: log.userRole || 'USER',
        editsCount: 0,
        fieldsChangedCount: 0,
        productsEdited: new Set<string>(),
        lastEditDate: `${log.date} ${log.time}`
      };

      existing.editsCount += 1;
      existing.fieldsChangedCount += (log.changes?.length || 1);
      if (log.productName) existing.productsEdited.add(log.productName);
      if (`${log.date} ${log.time}` > existing.lastEditDate) {
        existing.lastEditDate = `${log.date} ${log.time}`;
      }

      map.set(name, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.editsCount - a.editsCount);
  }, [filteredLogs]);

  return (
    <div>
      {/* 1. Sarlavha va Eksport tugmalari */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f2b48', margin: '0 0 4px 0' }}>
            {t(lang, 'editLogsTitle')}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            {t(lang, 'editLogsSub')}
          </p>
        </div>

        <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => onExportCSV(filteredLogs, selectedMonth)}
            className="btn-outline"
            style={{ background: '#ecfdf5', borderColor: '#6ee7b7', color: '#047857', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>{t(lang, 'exportExcelBtn')}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn-primary"
            style={{ background: 'linear-gradient(90deg, #002d62 0%, #0070ba 100%)', border: 'none', fontWeight: 800 }}
          >
            <span>{t(lang, 'printReportBtn')}</span>
          </button>
        </div>
      </div>

      {/* 2. Oy va Xodim Filtrlari */}
      <div className="mini-card no-print" style={{ background: '#ffffff', padding: '16px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
              📅 {t(lang, 'monthSelectLabel')}
            </label>
            <input
              type="month"
              className="form-input-clean"
              style={{ padding: '7px 12px', fontSize: '13px', fontWeight: 700, width: '170px' }}
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
              👤 {t(lang, 'employeeFilterLabel')}
            </label>
            <select
              className="form-select-clean"
              style={{ padding: '7px 12px', fontSize: '13px', fontWeight: 700, minWidth: '210px' }}
              value={selectedEmployee}
              onChange={e => setSelectedEmployee(e.target.value)}
            >
              <option value="ALL">👥 {t(lang, 'allEmployees')} ({uniqueEmployees.length})</option>
              {uniqueEmployees.map(emp => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '240px', maxWidth: '340px' }}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
            🔍 Qidiruv (Yuk, Xodim, Sabab):
          </label>
          <input
            type="text"
            className="form-input-clean"
            placeholder="Yuk nomi, xodim yoki sabab bo'yicha..."
            style={{ padding: '7px 12px', fontSize: '13px' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Oylik KPI Kartochkalari */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <div className="mini-card" style={{ background: '#fffbeb', border: '1.5px solid #fcd34d' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
            ✏️ {t(lang, 'totalEditsInMonth')}
          </span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#b45309', marginTop: '4px' }}>
            {filteredLogs.length} marta
          </div>
          <span style={{ fontSize: '11px', color: '#78350f' }}>
            Tanlangan oy: {selectedMonth || 'Barchasi'}
          </span>
        </div>

        <div className="mini-card" style={{ background: '#eff6ff', border: '1.5px solid #93c5fd' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase' }}>
            👥 {t(lang, 'employeesWhoEdited')}
          </span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#1d4ed8', marginTop: '4px' }}>
            {employeeSummary.length} nafar xodim
          </div>
          <span style={{ fontSize: '11px', color: '#1e3a8a' }}>
            Omborda tuzatish kiritgan mas&apos;ullar
          </span>
        </div>

        <div className="mini-card" style={{ background: '#f0fdf4', border: '1.5px solid #86efac' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
            🕒 {t(lang, 'lastEditedAt')}
          </span>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#15803d', marginTop: '8px' }}>
            {filteredLogs[0] ? `${filteredLogs[0].date} (${filteredLogs[0].time})` : '—'}
          </div>
          <span style={{ fontSize: '11px', color: '#14532d' }}>
            {filteredLogs[0] ? `Mas'ul: ${filteredLogs[0].userName}` : 'Tahrirlar mavjud emas'}
          </span>
        </div>
      </div>

      {/* 4. Xodimlar Kesimida Oylik Svodka Jadvali (Kim qancha to'g'rilagan) */}
      {employeeSummary.length > 0 && (
        <div className="mini-card" style={{ background: '#ffffff', padding: '0', overflowX: 'auto', marginBottom: '22px' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: '13px', color: '#0f2b48', textTransform: 'uppercase' }}>
              📊 Xodimlar Kesimida 1 Oylik Tuzatishlar (Tahrirlar) Soni:
            </strong>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
              Oy: {selectedMonth}
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#0f2b48', color: '#ffffff', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px', width: '44px', textAlign: 'center' }}>№</th>
                <th style={{ padding: '10px 14px' }}>{t(lang, 'colEmployee')}</th>
                <th style={{ padding: '10px 14px' }}>{t(lang, 'colRole')}</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>{t(lang, 'colEditsCount')}</th>
                <th style={{ padding: '10px 14px' }}>To&apos;g&apos;rilangan Yuklar</th>
                <th style={{ padding: '10px 14px' }}>{t(lang, 'lastEditedAt')}</th>
              </tr>
            </thead>
            <tbody>
              {employeeSummary.map((emp, idx) => (
                <tr key={emp.userName} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 800, color: '#64748b' }}>{idx + 1}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: '#0f172a' }}>👤 {emp.userName}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#eff6ff', color: '#1d4ed8' }}>
                      {emp.userRole}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 900, padding: '3px 10px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                      ✏️ {emp.editsCount} marta
                    </span>
                  </td>
                  <td data-no-translate="true" style={{ padding: '10px 14px', fontSize: '12px', color: '#334155' }}>
                    {Array.from(emp.productsEdited).join(', ')}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                    {emp.lastEditDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Batafsil Tahrirlar Zanjiri (Eski qiymat ➔ Yangi qiymat) */}
      <div className="mini-card" style={{ background: '#ffffff', padding: '0', overflowX: 'auto' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <strong style={{ fontSize: '13px', color: '#0f2b48', textTransform: 'uppercase' }}>
            📜 Batafsil Tahrirlangan Yuklar Ro&apos;yxati (Eski Qiymat ➔ Yangi Qiymat):
          </strong>
        </div>

        {filteredLogs.length === 0 ? (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📋</span>
            <strong style={{ fontSize: '14px', color: '#0f172a' }}>{t(lang, 'noEditsFound')}</strong>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ background: '#0f2b48', color: '#ffffff', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px', width: '40px', textAlign: 'center' }}>№</th>
                <th style={{ padding: '10px 14px', width: '130px' }}>{t(lang, 'colDateTime')}</th>
                <th style={{ padding: '10px 14px', width: '180px' }}>{t(lang, 'colEmployee')}</th>
                <th style={{ padding: '10px 14px', width: '200px' }}>{t(lang, 'colProduct')}</th>
                <th style={{ padding: '10px 14px' }}>{t(lang, 'colChanges')}</th>
                <th style={{ padding: '10px 14px', width: '230px' }}>{t(lang, 'colReason')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: '#64748b' }}>
                    {idx + 1}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{log.date}</strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>soat {log.time}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <strong style={{ color: '#002d62', display: 'block' }}>{log.userName}</strong>
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>{log.userRole}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <strong data-no-translate="true" style={{ color: '#0f172a', display: 'block' }}>{log.productName}</strong>
                    <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>{log.sectorName}</span>
                    {log.clientName && (
                      <span style={{ fontSize: '10.5px', color: '#64748b', display: 'block' }}>{log.clientName}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {log.changes && log.changes.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {log.changes.map((ch, cIdx) => (
                          <div key={cIdx} style={{ fontSize: '12px', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <strong style={{ color: '#334155' }}>{ch.label}: </strong>
                            <span style={{ color: '#dc2626', textDecoration: 'line-through', marginRight: '6px' }}>
                              {String(ch.oldValue)}
                            </span>
                            <span style={{ color: '#64748b', marginRight: '6px' }}>➔</span>
                            <strong style={{ color: '#059669' }}>
                              {String(ch.newValue)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>Yuk ma&apos;lumotlari yangilandi</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '6px 10px', borderRadius: '6px', color: '#92400e', fontSize: '11.5px', fontWeight: 600 }}>
                      📌 {log.reason}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

