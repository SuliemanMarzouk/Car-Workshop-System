import { AuthUser } from '@core/auth/models/auth-session.model';

/** Laravel may wrap resources in `{ data: ... }` — normalize to AuthUser. */
export function normalizeAuthUser(payload: unknown): AuthUser | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const inner =
    record['data'] && typeof record['data'] === 'object'
      ? (record['data'] as Record<string, unknown>)
      : record;

  const id = Number(inner['id']);
  const name = inner['name'];
  const email = inner['email'];

  if (!Number.isFinite(id) || typeof name !== 'string' || typeof email !== 'string') {
    return null;
  }

  const roleRaw = inner['role'];
  const role =
    roleRaw && typeof roleRaw === 'object'
      ? {
          id: Number((roleRaw as Record<string, unknown>)['id']),
          slug: String((roleRaw as Record<string, unknown>)['slug'] ?? ''),
          name: String((roleRaw as Record<string, unknown>)['name'] ?? ''),
          name_ar: String((roleRaw as Record<string, unknown>)['name_ar'] ?? ''),
        }
      : null;

  const permissionsRaw = inner['permissions'];
  const permissions = Array.isArray(permissionsRaw)
    ? permissionsRaw.filter((p): p is string => typeof p === 'string')
    : [];

  return {
    id,
    name,
    email,
    role: role && Number.isFinite(role.id) ? role : null,
    permissions,
  };
}
