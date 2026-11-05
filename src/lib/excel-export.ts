/**
 * Excel-compatible CSV export utility for JB GROUP Warehouse Management System.
 *
 * Ensures 100% proper column separation in Microsoft Excel on Windows (CIS/Uzbek/Russian locales)
 * using UTF-8 BOM, explicit `sep=;` directive, semicolon delimiter, CRLF endings,
 * business column titles, document headers, and summary rows.
 */

export interface ExcelColumn {
  header: string;
  key: string;
  align?: 'left' | 'center' | 'right';
  format?: 'text' | 'number' | 'currency' | 'date';
}

export interface ExcelExportOptions {
  filename: string;
  title: string;
  period?: string;
  subtitle?: string;
  columns: { header: string; width?: number }[];
  rows: (string | number | null | undefined)[][];
  summaryRow?: (string | number | null | undefined)[];
}

function escapeCell(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  if (typeof val === 'number') {
    if (isNaN(val)) return '0';
    return String(val);
  }
  const str = String(val).replace(/\r\n|\r|\n/g, ' ').replace(/"/g, '""');
  return `"${str}"`;
}

export function downloadExcelCSV(options: ExcelExportOptions): void {
  const { filename, title, period, subtitle, columns, rows, summaryRow } = options;

  const lines: string[] = [];

  // Directive for Excel on Windows to parse semicolon delimiter
  lines.push('sep=;');

  // Title Block
  lines.push(`"${title.replace(/"/g, '""')}"`);
  const metaParts: string[] = [];
  if (period) metaParts.push(`Davr: ${period}`);
  metaParts.push(`Shakllantirilgan sana: ${new Date().toLocaleString('uz-UZ')}`);
  if (subtitle) metaParts.push(subtitle);
  metaParts.push('Tizim: JB GROUP WMS');
  lines.push(metaParts.map(p => `"${p.replace(/"/g, '""')}"`).join(';'));

  // Empty line before headers
  lines.push('');

  // Column Headers
  const headerLine = columns.map(c => `"${c.header.replace(/"/g, '""')}"`).join(';');
  lines.push(headerLine);

  // Data Rows
  for (const row of rows) {
    const rowLine = row.map(cell => escapeCell(cell)).join(';');
    lines.push(rowLine);
  }

  // Summary Row (if provided)
  if (summaryRow && summaryRow.length > 0) {
    lines.push('');
    const sumLine = summaryRow.map(cell => escapeCell(cell)).join(';');
    lines.push(sumLine);
  }

  // UTF-8 BOM + CRLF joined lines
  const csvContent = '\uFEFF' + lines.join('\r\n') + '\r\n';

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.setAttribute('download', cleanFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

