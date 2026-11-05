/**
 * Professional Native Excel (.xlsx) Export Utility for JB GROUP Warehouse Management System.
 * 
 * Uses SheetJS (xlsx) to generate true binary OpenXML .xlsx workbooks.
 * - 100% Unicode / UTF-8 safe (No mojibake or corrupt Cyrillic / Uzbek characters in Microsoft Excel)
 * - Automatic column width adjustment
 * - Clean title, metadata, header, and summary rows
 * - Numeric cells formatted as native numbers for Excel summation/formulas
 */

import * as XLSX from 'xlsx';

export interface ExcelColumn {
  header: string;
  width?: number;
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

export function downloadExcelFile(options: ExcelExportOptions): void {
  const { filename, title, period, subtitle, columns, rows, summaryRow } = options;

  // 1. Construct worksheet data rows (Array of Arrays)
  const aoa: any[][] = [];

  // Row 1: Document Main Title
  aoa.push([title]);

  // Row 2: Metadata (Period, Generated Date, Subtitle, System Name)
  const metaRow: string[] = [];
  if (period) metaRow.push(`Davr / Период: ${period}`);
  metaRow.push(`Sana / Дата: ${new Date().toLocaleString('uz-UZ')}`);
  if (subtitle) metaRow.push(subtitle);
  metaRow.push('Tizim: JB GROUP WMS');
  aoa.push(metaRow);

  // Row 3: Blank separator row
  aoa.push([]);

  // Row 4: Column Headers
  aoa.push(columns.map(c => c.header));

  // Rows 5+: Data rows
  for (const r of rows) {
    const cleanRow = r.map(cell => {
      if (cell === null || cell === undefined) return '';
      if (typeof cell === 'number') {
        return isNaN(cell) ? 0 : cell;
      }
      return String(cell).trim();
    });
    aoa.push(cleanRow);
  }

  // Summary Row (if provided)
  if (summaryRow && summaryRow.length > 0) {
    aoa.push([]); // Empty row before summary
    const cleanSum = summaryRow.map(cell => {
      if (cell === null || cell === undefined) return '';
      if (typeof cell === 'number') {
        return isNaN(cell) ? 0 : cell;
      }
      return String(cell).trim();
    });
    aoa.push(cleanSum);
  }

  // 2. Create Sheet from Array of Arrays
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // 3. Dynamic Column Widths calculation
  const colWidths = columns.map((col, colIdx) => {
    let maxLen = (col.header || '').length;
    for (const r of rows) {
      const val = r[colIdx];
      if (val !== null && val !== undefined) {
        const strLen = String(val).length;
        if (strLen > maxLen) maxLen = strLen;
      }
    }
    // Cap minimum and maximum column widths for clean readability
    const calculated = Math.min(Math.max(maxLen + 4, col.width || 12), 60);
    return { wch: calculated };
  });
  ws['!cols'] = colWidths;

  // 4. Create Workbook and Append Sheet
  const wb = XLSX.utils.book_new();
  const safeSheetName = (filename.replace(/[^a-zA-Z0-9_\u0400-\u04FF]/g, '_').slice(0, 28) || 'Hisobot');
  XLSX.utils.book_append_sheet(wb, ws, safeSheetName);

  // 5. Write to ArrayBuffer and trigger browser download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);

  const cleanFilename = filename.replace(/\.(csv|xlsx)$/i, '') + '.xlsx';
  link.setAttribute('download', cleanFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Backward-compatible alias for existing imports
export const downloadExcelCSV = downloadExcelFile;
