import type { LeadFormFieldKey, LeadFormValues } from "./createLeadFieldConfig";

function opt(s: string): string | undefined {
  const t = s.trim();
  return t === "" ? undefined : t;
}

/** Maps form state to API JSON (undefined keys are dropped by `JSON.stringify`). */
export function leadFormValuesToCreatePayload(values: LeadFormValues): Record<string, unknown> {
  const body: Record<string, unknown> = {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    status: values.status.trim() || "NEW",
  };

  const maybe = (key: LeadFormFieldKey, apiKey: string) => {
    const v = opt(values[key]);
    if (v !== undefined) body[apiKey] = v;
  };

  maybe("leadId", "leadId");
  maybe("mobile", "mobile");
  maybe("companyName", "companyName");
  maybe("leadSource", "leadSource");
  maybe("productInterested", "productInterested");
  maybe("budget", "budget");
  maybe("description", "description");
  maybe("country", "country");
  maybe("state", "state");
  maybe("city", "city");
  maybe("pincode", "pincode");
  maybe("priority", "priority");
  maybe("assignedTo", "assignedTo");
  maybe("expectedCloseDate", "expectedCloseDate");
  maybe("campaignId", "campaignId");

  return body;
}
