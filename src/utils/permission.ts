export const Permissions = {
  ViewClients: "view_clients",
  CreateClient: "create_client",
  UpdateClient: "update_client",
  ViewEmployees: "view_employees",
} as const;

export type PermissionType = (typeof Permissions)[keyof typeof Permissions];

export function hasRequiredPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every((p) => userPermissions.includes(p));
}
