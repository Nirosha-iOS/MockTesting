import { httpJson } from "./httpClient";
import type {
  ApiEnvelope,
  AttendanceConfigDto,
  BulkUploadJobDto,
  EmployeeDto,
  MappingDto,
  MasterDto,
  ProductDocumentDto,
  ResourceLinkDto,
} from "./types";

function unwrap<T>(env: ApiEnvelope<T>, fallback: string): T {
  if (!env.success || env.data === undefined || env.data === null) {
    throw new Error(env.error?.message ?? fallback);
  }
  return env.data;
}

export async function listMaster(path: string): Promise<MasterDto[]> {
  const env = await httpJson<ApiEnvelope<MasterDto[]>>(path);
  return unwrap(env, "Failed to load master list");
}

export async function listEmployees(): Promise<EmployeeDto[]> {
  const env = await httpJson<ApiEnvelope<EmployeeDto[]>>("/api/v1/config/employees");
  return unwrap(env, "Failed to load employees");
}

export async function createEmployee(payload: Omit<EmployeeDto, "id">): Promise<EmployeeDto> {
  const env = await httpJson<ApiEnvelope<EmployeeDto>>("/api/v1/config/employees", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrap(env, "Failed to create employee");
}

export async function updateEmployee(id: number, payload: Omit<EmployeeDto, "id">): Promise<EmployeeDto> {
  const env = await httpJson<ApiEnvelope<EmployeeDto>>(`/api/v1/config/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return unwrap(env, "Failed to update employee");
}

export async function createMaster(path: string, payload: { code: string; name: string; active: boolean; email?: string }): Promise<MasterDto> {
  const env = await httpJson<ApiEnvelope<MasterDto>>(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrap(env, "Failed to create master record");
}

export async function updateMaster(path: string, payload: { code: string; name: string; active: boolean; email?: string }): Promise<MasterDto> {
  const env = await httpJson<ApiEnvelope<MasterDto>>(path, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return unwrap(env, "Failed to update master record");
}

export async function listMappings(path: string): Promise<MappingDto[]> {
  const env = await httpJson<ApiEnvelope<MappingDto[]>>(path);
  return unwrap(env, "Failed to load mappings");
}

export async function createMapping(path: string, payload: Record<string, number>): Promise<MappingDto> {
  const env = await httpJson<ApiEnvelope<MappingDto>>(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrap(env, "Failed to create mapping");
}

export async function deleteMapping(path: string): Promise<void> {
  await httpJson<ApiEnvelope<null>>(path, { method: "DELETE" });
}

export async function listProductDocuments(): Promise<ProductDocumentDto[]> {
  const env = await httpJson<ApiEnvelope<ProductDocumentDto[]>>("/api/v1/config/product-documents");
  return unwrap(env, "Failed to load product documents");
}

export async function createProductDocument(payload: Omit<ProductDocumentDto, "id">): Promise<ProductDocumentDto> {
  const env = await httpJson<ApiEnvelope<ProductDocumentDto>>("/api/v1/config/product-documents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrap(env, "Failed to create product document");
}

export async function updateProductDocument(id: number, payload: Omit<ProductDocumentDto, "id">): Promise<ProductDocumentDto> {
  const env = await httpJson<ApiEnvelope<ProductDocumentDto>>(`/api/v1/config/product-documents/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return unwrap(env, "Failed to update product document");
}

export async function listLinks(): Promise<ResourceLinkDto[]> {
  const env = await httpJson<ApiEnvelope<ResourceLinkDto[]>>("/api/v1/config/links");
  return unwrap(env, "Failed to load links");
}

export async function createLink(payload: Omit<ResourceLinkDto, "id">): Promise<ResourceLinkDto> {
  const env = await httpJson<ApiEnvelope<ResourceLinkDto>>("/api/v1/config/links", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrap(env, "Failed to create link");
}

export async function updateLink(id: number, payload: Omit<ResourceLinkDto, "id">): Promise<ResourceLinkDto> {
  const env = await httpJson<ApiEnvelope<ResourceLinkDto>>(`/api/v1/config/links/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return unwrap(env, "Failed to update link");
}

export async function listAttendanceConfigs(): Promise<AttendanceConfigDto[]> {
  const env = await httpJson<ApiEnvelope<AttendanceConfigDto[]>>("/api/v1/config/attendance-configs");
  return unwrap(env, "Failed to load attendance configs");
}

export async function createAttendanceConfig(payload: Omit<AttendanceConfigDto, "id">): Promise<AttendanceConfigDto> {
  const env = await httpJson<ApiEnvelope<AttendanceConfigDto>>("/api/v1/config/attendance-configs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrap(env, "Failed to create attendance config");
}

export async function updateAttendanceConfig(id: number, payload: Omit<AttendanceConfigDto, "id">): Promise<AttendanceConfigDto> {
  const env = await httpJson<ApiEnvelope<AttendanceConfigDto>>(`/api/v1/config/attendance-configs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return unwrap(env, "Failed to update attendance config");
}

export async function listBulkUploadJobs(): Promise<BulkUploadJobDto[]> {
  const env = await httpJson<ApiEnvelope<BulkUploadJobDto[]>>("/api/v1/config/bulk-upload-jobs");
  return unwrap(env, "Failed to load bulk upload jobs");
}

export async function createBulkUploadJob(payload: Omit<BulkUploadJobDto, "id" | "createdAt">): Promise<BulkUploadJobDto> {
  const env = await httpJson<ApiEnvelope<BulkUploadJobDto>>("/api/v1/config/bulk-upload-jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrap(env, "Failed to create bulk upload job");
}
