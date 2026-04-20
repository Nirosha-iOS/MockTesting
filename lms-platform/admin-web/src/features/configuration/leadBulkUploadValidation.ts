import { loadLeadFormRequiredMap } from "./leadFormRulesStorage";
import { leadImportTemplateHeaders } from "../leads/leadCsvExport";

export interface BulkValidationResult {
  headers: string[];
  rows: string[][];
  missingRequiredColumns: string[];
  unknownColumns: string[];
  rowErrors: string[];
}

function normalizeHeader(h: string): string {
  return h.trim();
}

/** Minimal CSV parser with quoted-cell support for preview/validation. */
export function parseCsv(csvText: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let i = 0;
  let inQuotes = false;
  const text = csvText.replace(/^\uFEFF/, "");

  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === "\"") {
        if (text[i + 1] === "\"") {
          cell += "\"";
          i += 2;
          continue;
        }
        inQuotes = false;
      } else {
        cell += ch;
      }
      i += 1;
      continue;
    }

    if (ch === "\"") {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ",") {
      row.push(cell.trim());
      cell = "";
      i += 1;
      continue;
    }
    if (ch === "\n") {
      row.push(cell.trim());
      out.push(row);
      row = [];
      cell = "";
      i += 1;
      continue;
    }
    if (ch === "\r") {
      i += 1;
      continue;
    }

    cell += ch;
    i += 1;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    out.push(row);
  }

  return out.filter((r) => r.some((c) => c.length > 0));
}

export function validateLeadCsv(csvText: string): BulkValidationResult {
  const records = parseCsv(csvText);
  if (records.length === 0) {
    return {
      headers: [],
      rows: [],
      missingRequiredColumns: [],
      unknownColumns: [],
      rowErrors: ["File is empty."],
    };
  }

  const expectedHeaders = leadImportTemplateHeaders();
  const headers = records[0].map(normalizeHeader);
  const rows = records.slice(1);

  const headerSet = new Set(headers);
  const unknownColumns = headers.filter((h) => !expectedHeaders.includes(h));

  const requiredMap = loadLeadFormRequiredMap();
  const requiredColumns = expectedHeaders.filter((h) => requiredMap[h as keyof typeof requiredMap]);
  const missingRequiredColumns = requiredColumns.filter((h) => !headerSet.has(h));

  const rowErrors: string[] = [];
  rows.forEach((row, index) => {
    const humanRow = index + 2;
    if (row.length !== headers.length) {
      rowErrors.push(`Row ${humanRow}: column count mismatch (${row.length} vs ${headers.length}).`);
      return;
    }

    requiredColumns.forEach((col) => {
      const idx = headers.indexOf(col);
      const value = idx >= 0 ? (row[idx] ?? "").trim() : "";
      if (value === "") rowErrors.push(`Row ${humanRow}: "${col}" is required.`);
    });

    const emailIdx = headers.indexOf("email");
    if (emailIdx >= 0) {
      const email = (row[emailIdx] ?? "").trim();
      if (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        rowErrors.push(`Row ${humanRow}: invalid email format.`);
      }
    }
  });

  return { headers, rows, missingRequiredColumns, unknownColumns, rowErrors };
}
