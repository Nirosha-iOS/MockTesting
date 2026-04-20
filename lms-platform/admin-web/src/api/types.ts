export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
}

export interface LeadResponse {
  id: number;
  leadId: string | null;
  fullName: string;
  mobile: string;
  email: string;
  companyName: string | null;
  leadSource: string | null;
  productInterested: string | null;
  budget: string | null;
  description: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  pincode: string | null;
  status: string;
  stage: string;
  priority: string | null;
  assignedTo: string | null;
  expectedCloseDate: string | null;
  campaignId: string | null;
  createdDate: string;
  updatedDate: string;
  createdBy: string | null;
  /** @deprecated Use mobile — kept for older code paths */
  phone?: string;
  /** @deprecated Use companyName */
  company?: string | null;
}

export interface AuthUserProfile {
  email: string;
  displayName: string;
  role: string;
}

export interface AuthResponseBody {
  accessToken: string;
  expiresInSeconds: number;
  user: AuthUserProfile;
}

export interface MasterDto {
  id: number;
  code: string;
  name: string;
  email?: string;
  active: boolean;
}

export interface EmployeeDto {
  id: number;
  code: string;
  name: string;
  email: string;
  phone?: string | null;
  department?: string | null;
  designation?: string | null;
  managerEmpCode?: string | null;
  unavailableFrom?: string | null;
  unavailableTo?: string | null;
  active: boolean;
}

export interface MappingDto {
  id: number;
  verticalId?: number;
  roleId?: number;
  functionId?: number;
}

export interface ProductDocumentDto {
  id: number;
  productId: number;
  documentName: string;
  documentUrl: string;
  documentType: string | null;
}

export interface ResourceLinkDto {
  id: number;
  title: string;
  url: string;
  category: string | null;
  active: boolean;
}

export interface AttendanceConfigDto {
  id: number;
  name: string;
  checkInTime: string;
  checkOutTime: string;
  graceMinutes: number;
  active: boolean;
}

export interface BulkUploadJobDto {
  id: number;
  fileName: string;
  fileType: string;
  status: string;
  totalRows: number;
  successRows: number;
  errorRows: number;
  createdAt: string;
}
