import { LEAD_PRIORITY_OPTIONS, LEAD_SOURCE_OPTIONS, LEAD_STAGE_OPTIONS } from "./leadFormOptions";

export type LeadFormFieldKey =
  | "leadId"
  | "fullName"
  | "mobile"
  | "email"
  | "companyName"
  | "leadSource"
  | "productInterested"
  | "budget"
  | "description"
  | "country"
  | "state"
  | "city"
  | "pincode"
  | "status"
  | "priority"
  | "assignedTo"
  | "expectedCloseDate"
  | "campaignId";

export type LeadFieldType = "text" | "email" | "tel" | "textarea" | "select" | "date";

export interface LeadFieldDefinition {
  name: LeadFormFieldKey;
  label: string;
  /** Default required flag — override at runtime with `requiredByField` in the form. */
  required: boolean;
  type: LeadFieldType;
  section: string;
  options?: readonly { value: string; label: string }[];
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}

/**
 * Single source for create-lead layout. Change `required` here, or override per field in state in `CreateLeadPanel`.
 */
export const LEAD_CREATE_FIELD_DEFS: LeadFieldDefinition[] = [
  { name: "leadId", label: "Lead ID", required: false, type: "text", section: "Identity", placeholder: "Optional — e.g. LD1001 (auto if empty)" },
  { name: "fullName", label: "Full name", required: true, type: "text", section: "Identity", placeholder: "John Doe", maxLength: 200 },
  { name: "mobile", label: "Mobile", required: false, type: "tel", section: "Identity", placeholder: "9876543210", maxLength: 40 },
  { name: "email", label: "Email", required: true, type: "email", section: "Identity", placeholder: "john@example.com", maxLength: 320 },
  { name: "companyName", label: "Company name", required: false, type: "text", section: "Identity", placeholder: "ABC Pvt Ltd", maxLength: 200 },

  { name: "leadSource", label: "Lead source", required: false, type: "select", section: "Opportunity", options: LEAD_SOURCE_OPTIONS },
  { name: "productInterested", label: "Product interested", required: false, type: "text", section: "Opportunity", placeholder: "CRM Software", maxLength: 255 },
  { name: "budget", label: "Budget", required: false, type: "text", section: "Opportunity", placeholder: "50000-100000", maxLength: 100 },
  { name: "description", label: "Description", required: false, type: "textarea", section: "Opportunity", placeholder: "Looking for CRM solution", rows: 3, maxLength: 2000 },

  { name: "country", label: "Country", required: false, type: "text", section: "Location", placeholder: "India", maxLength: 120 },
  { name: "state", label: "State", required: false, type: "text", section: "Location", placeholder: "Tamil Nadu", maxLength: 120 },
  { name: "city", label: "City", required: false, type: "text", section: "Location", placeholder: "Chennai", maxLength: 120 },
  { name: "pincode", label: "Pincode", required: false, type: "text", section: "Location", placeholder: "600001", maxLength: 20 },

  { name: "status", label: "Status", required: true, type: "select", section: "Pipeline", options: LEAD_STAGE_OPTIONS },
  { name: "priority", label: "Priority", required: false, type: "select", section: "Pipeline", options: LEAD_PRIORITY_OPTIONS },
  { name: "assignedTo", label: "Assigned to", required: false, type: "text", section: "Pipeline", placeholder: "SalesUser1", maxLength: 120 },
  { name: "expectedCloseDate", label: "Expected close date", required: false, type: "date", section: "Pipeline" },
  { name: "campaignId", label: "Campaign ID", required: false, type: "text", section: "Pipeline", placeholder: "FB_AD_001", maxLength: 80 },
];

export function defaultRequiredByField(): Record<LeadFormFieldKey, boolean> {
  const m = {} as Record<LeadFormFieldKey, boolean>;
  for (const f of LEAD_CREATE_FIELD_DEFS) {
    m[f.name] = f.required;
  }
  return m;
}

export type LeadFormValues = Record<LeadFormFieldKey, string>;

export function emptyLeadFormValues(): LeadFormValues {
  const v = {} as LeadFormValues;
  for (const f of LEAD_CREATE_FIELD_DEFS) {
    v[f.name] = f.name === "status" ? "NEW" : "";
  }
  return v;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates visible fields using the current required map (so toggling required ↔ optional updates rules immediately).
 */
export function validateLeadCreate(
  values: LeadFormValues,
  requiredByField: Record<LeadFormFieldKey, boolean>,
): Partial<Record<LeadFormFieldKey, string>> {
  const errors: Partial<Record<LeadFormFieldKey, string>> = {};
  for (const def of LEAD_CREATE_FIELD_DEFS) {
    const raw = values[def.name]?.trim() ?? "";
    const req = requiredByField[def.name] ?? false;
    if (req && raw === "") {
      errors[def.name] = "This field is required.";
      continue;
    }
    if (def.type === "email" && raw !== "" && !EMAIL_RE.test(raw)) {
      errors[def.name] = "Enter a valid email address.";
    }
  }
  return errors;
}
