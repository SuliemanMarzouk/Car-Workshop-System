export interface ManagedRole {
  id: number;
  slug: string;
  name: string;
  name_ar: string;
  is_system: boolean;
  users_count?: number;
  permissions: string[];
}

export interface PermissionDefinition {
  id: number;
  slug: string;
  name: string;
  name_ar: string;
  group: string;
}

export interface RoleFormPayload {
  name: string;
  name_ar: string;
  slug?: string;
  permissions: string[];
}
