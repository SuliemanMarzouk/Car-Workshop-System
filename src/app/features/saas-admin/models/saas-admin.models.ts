export type TenantStatus = 'active' | 'suspended';

export interface CentralAdminUser {
  id: number;
  name: string;
  email: string;
}

export interface CentralAuthLoginResponse {
  access_token: string;
  token_type: string;
  user: CentralAdminUser;
}

export interface TenantSummary {
  id: string;
  name: string;
  status: TenantStatus;
  domains: string[];
  primary_domain: string | null;
  workshop_url: string | null;
  created_at: string | null;
}

export interface TenantUsersListResponse {
  data: TenantWorkshopUser[];
  meta: TenantsListMeta;
}

export interface TenantWorkshopUser {
  id: number;
  name: string;
  email: string;
  role?: {
    id: number;
    slug: string;
    name: string;
    name_ar: string;
  } | null;
  created_at?: string;
}

export interface TenantRoleOption {
  id: number;
  slug: string;
  name: string;
  name_ar: string;
}

export interface CreateTenantUserPayload {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

export interface ResetTenantUserPasswordPayload {
  password: string;
  password_confirmation: string;
}

export interface CentralDashboardStats {
  total_tenants: number;
  active_tenants: number;
  suspended_tenants: number;
  recent_tenants: TenantSummary[];
}

export interface TenantsListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface TenantsListResponse {
  data: TenantSummary[];
  meta: TenantsListMeta;
}

export interface CreateTenantPayload {
  id: string;
  domain?: string;
  /** Optional explicit domain; defaults to `{id}.localhost` on server */
  workshop_name: string;
  address?: string;
  city?: string;
  country?: string;
  phone: string;
  email: string;
  tax_number?: string;
  default_currency: 'USD' | 'SAR';
  vat_rate: number;
  email_notifications?: boolean;
  sms_notifications?: boolean;
}

export const DEFAULT_CREATE_TENANT_FORM: CreateTenantPayload = {
  id: '',
  workshop_name: '',
  phone: '',
  email: '',
  address: '',
  city: 'Riyadh',
  country: 'Saudi Arabia',
  tax_number: '',
  default_currency: 'USD',
  vat_rate: 0.15,
  email_notifications: true,
  sms_notifications: false,
};
