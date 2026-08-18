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
  changeUserRole,
} from "@/api/super-admin/user-management";
import { getAuditLogs, getAuditLogDetails } from "@/api/super-admin/audit-logs";
import { getBackups, downloadBackup } from "@/api/super-admin/backups";
import {
  CreateUserDto,
  UserFilters,
  AuditLogFilters,
  CreateRoleDto,
} from "@/types/super-admin";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

// User Management Hooks

export const useGetUsers = (filters?: UserFilters) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
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
  const t = useTranslations("super-admin.userManagement.actions.messages");
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(t("createSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("createError"));
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("super-admin.userManagement.actions.messages");
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateUserDto> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(t("updateSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("updateError"));
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("super-admin.userManagement.actions.messages");
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(t("deleteSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("deleteError"));
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("super-admin.userManagement.actions.messages");
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.message || t("statusError"));
    },
  });
};

export const useResetUserPassword = () => {
  const t = useTranslations("super-admin.userManagement.actions.messages");
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      resetUserPassword(id, password),
    onSuccess: () => {
      toast.success(t("passwordResetSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("passwordResetError"));
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
  const t = useTranslations("super-admin.backups.messages");
  return useMutation({
    mutationFn: downloadBackup,
    onError: (error: any) => {
      toast.error(error.message || t("downloadFailed"));
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
  const t = useTranslations("super-admin.settings.roleManagement.messages");
  return useMutation({
    mutationFn: (data: CreateRoleDto) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userFormData"] });
      toast.success(t("createSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("createError"));
    },
  });
};

export const useAssignPermissionsToRole = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("super-admin.settings.roleManagement.messages");
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
      toast.success(t("permissionsAssignSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("permissionsAssignError"));
    },
  });
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("super-admin.userManagement.actions.messages");
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) =>
      changeUserRole(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(t("roleUpdateSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("roleUpdateError"));
    },
  });
};
