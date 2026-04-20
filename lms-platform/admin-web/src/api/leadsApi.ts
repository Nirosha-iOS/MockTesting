import { httpJson } from "./httpClient";
import type { ApiEnvelope, LeadResponse } from "./types";

export async function fetchLeads(): Promise<LeadResponse[]> {
  const env = await httpJson<ApiEnvelope<LeadResponse[]>>("/api/v1/leads");
  if (!env.success || !env.data) {
    throw new Error(env.error?.message ?? "Failed to load leads");
  }
  return env.data;
}

export async function fetchLeadsByAssignedEmpId(assignedEmpId: string): Promise<LeadResponse[]> {
  const q = encodeURIComponent(assignedEmpId);
  const env = await httpJson<ApiEnvelope<LeadResponse[]>>(`/api/v1/leads?assignedEmpId=${q}`);
  if (!env.success || !env.data) {
    throw new Error(env.error?.message ?? "Failed to load leads");
  }
  return env.data;
}

export async function fetchLeadById(id: number): Promise<LeadResponse> {
  const env = await httpJson<ApiEnvelope<LeadResponse>>(`/api/v1/leads/${id}`);
  if (!env.success || !env.data) {
    throw new Error(env.error?.message ?? "Failed to load lead");
  }
  return env.data;
}

/** Body matches `CreateLeadRequest` — optional keys omitted when empty. */
export type CreateLeadPayload = Record<string, unknown>;

export async function createLead(payload: CreateLeadPayload): Promise<LeadResponse> {
  const env = await httpJson<ApiEnvelope<LeadResponse>>("/api/v1/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!env.success || !env.data) {
    throw new Error(env.error?.message ?? "Failed to create lead");
  }
  return env.data;
}

export async function reassignLead(
  id: number,
  payload: { newAssignedEmpId: string; reason?: string; unavailableFrom?: string; unavailableTo?: string },
): Promise<LeadResponse> {
  const env = await httpJson<ApiEnvelope<LeadResponse>>(`/api/v1/leads/${id}/assign`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!env.success || !env.data) {
    throw new Error(env.error?.message ?? "Failed to reassign lead");
  }
  return env.data;
}
