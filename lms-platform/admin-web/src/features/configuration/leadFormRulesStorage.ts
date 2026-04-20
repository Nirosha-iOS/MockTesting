import { defaultRequiredByField, type LeadFormFieldKey } from "../leads/createLeadFieldConfig";

const STORAGE_KEY = "lms-admin-lead-form-required";
const VERSION = 1;

type StoredShape = { v: number; required: Partial<Record<LeadFormFieldKey, boolean>> };

export function loadLeadFormRequiredMap(): Record<LeadFormFieldKey, boolean> {
  const base = defaultRequiredByField();
  if (typeof window === "undefined") return base;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const p = JSON.parse(raw) as StoredShape;
    if (p.v !== VERSION || !p.required || typeof p.required !== "object") return base;
    const out = { ...base };
    for (const key of Object.keys(p.required) as LeadFormFieldKey[]) {
      if (key in out) {
        out[key] = Boolean(p.required[key]);
      }
    }
    return out;
  } catch {
    return base;
  }
}

export function saveLeadFormRequiredMap(required: Record<LeadFormFieldKey, boolean>): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredShape = { v: VERSION, required };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent("lms-lead-form-rules-changed"));
  } catch {
    /* quota / private mode */
  }
}
