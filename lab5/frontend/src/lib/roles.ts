const ADMIN_ROLE_NAMES = ['Admin', 'Administrator', 'Адміністратор'] as const;

export function isAdminRole(role?: string | null): boolean {
  if (!role) {
    return false;
  }

  return ADMIN_ROLE_NAMES.includes(role as (typeof ADMIN_ROLE_NAMES)[number]);
}
