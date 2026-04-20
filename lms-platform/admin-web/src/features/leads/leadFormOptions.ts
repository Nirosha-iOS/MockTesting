/** Maps to backend `LeadStage` (JSON field `status`). */
export const LEAD_STAGE_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "LOST", label: "Lost" },
] as const;

export type LeadStageValue = (typeof LEAD_STAGE_OPTIONS)[number]["value"];

export const LEAD_PRIORITY_OPTIONS = [
  { value: "", label: "Not specified" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
] as const;

export const LEAD_SOURCE_OPTIONS = [
  { value: "", label: "Not specified" },
  { value: "WEBSITE", label: "Website" },
  { value: "REFERRAL", label: "Referral" },
  { value: "CAMPAIGN", label: "Campaign / list upload" },
  { value: "ROADSHOW", label: "Event or roadshow" },
  { value: "SELF_GENERATED", label: "Outbound / self-generated" },
  { value: "PARTNER", label: "Partner" },
  { value: "OTHER", label: "Other" },
] as const;
