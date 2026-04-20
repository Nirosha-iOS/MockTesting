import { LEAD_CREATE_FIELD_DEFS, type LeadFormValues } from "./createLeadFieldConfig";

function csvEscape(cell: string): string {
  if (/[",\n\r]/.test(cell)) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

function toCsvRow(cells: string[]): string {
  return cells.map(csvEscape).join(",");
}

function toTsvRow(cells: string[]): string {
  return cells.map((cell) => cell.replace(/\t/g, " ")).join("\t");
}

/** API-oriented column keys in create-form order (matches bulk import expectations). */
export function leadImportTemplateHeaders(): string[] {
  return LEAD_CREATE_FIELD_DEFS.map((d) => d.name);
}

export function buildLeadImportTemplateCsv(): string {
  const headers = leadImportTemplateHeaders();
  return "\uFEFF" + toCsvRow(headers) + "\n";
}

export function buildLeadImportTemplateExcel(): string {
  const headers = leadImportTemplateHeaders();
  return "\uFEFF" + toTsvRow(headers) + "\n";
}

export function buildLeadFormRowCsv(values: LeadFormValues): string {
  const headers = leadImportTemplateHeaders();
  const row = headers.map((key) => values[key as keyof LeadFormValues] ?? "");
  return "\uFEFF" + toCsvRow(headers) + "\n" + toCsvRow(row) + "\n";
}

function triggerFileDownload(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function triggerCsvDownload(filename: string, csv: string): void {
  triggerFileDownload(filename, csv, "text/csv;charset=utf-8");
}

export function triggerExcelDownload(filename: string, excelContent: string): void {
  triggerFileDownload(filename, excelContent, "application/vnd.ms-excel;charset=utf-8");
}
