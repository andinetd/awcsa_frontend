import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  resetUserPassword,
  getUserFormData,
  getPermissions,
  getRoleDetails,
  createRole,
  assignPermissionsToRole,
} from "@/api/super-admin/user-management";
import { getAuditLogs, getAuditLogDetails } from "@/api/super-admin/audit-logs";
import { getBackups, downloadBackup } from "@/api/super-admin/backups";
import { CreateUserDto, AuditLogFilters } from "@/types/super-admin";
import { toast } from "sonner";

// User Management Hooks

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

export const useGetUserFormData = () => {
  return useQuery({
    queryKey: ["userFormData"],
    queryFn: getUserFormData,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create user");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateUserDto> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user status");
    },
  });
};

export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      resetUserPassword(id, password),
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reset password");
    },
  });
};

// Audit Logs Hooks

export const useGetAuditLogs = (filters?: AuditLogFilters) => {
  return useQuery({
    queryKey: ["auditLogs", filters],
    queryFn: () => getAuditLogs(filters),
  });
};

export const useGetAuditLogDetails = (id?: number) => {
  return useQuery({
    queryKey: ["auditLog", id],
    queryFn: () => getAuditLogDetails(id!),
    enabled: !!id,
  });
};

// Backups Hooks

export const useGetBackups = () => {
  return useQuery({
    queryKey: ["backups"],
    queryFn: getBackups,
  });
};

export const useDownloadBackup = () => {
  return useMutation({
    mutationFn: downloadBackup,
    onError: (error: any) => {
      toast.error(error.message || "Failed to download backup");
    },
  });
};

// Role & Permission Hooks

export const useGetPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });
};

export const useGetRoleDetails = (roleId?: number) => {
  return useQuery({
    queryKey: ["role", roleId],
    queryFn: () => getRoleDetails(roleId!),
    enabled: !!roleId,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userFormData"] });
      toast.success("Role created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create role");
    },
  });
};

export const useAssignPermissionsToRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: number;
      permissionIds: number[];
    }) => assignPermissionsToRole(roleId, permissionIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["role", variables.roleId] });
      toast.success("Permissions assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign permissions");
    },
  });
};
