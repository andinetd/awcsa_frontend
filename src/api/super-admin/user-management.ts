import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import {
  User,
  CreateUserDto,
  UserFormData,
  Permission,
  Role,
} from "@/types/super-admin";

const getAuthHeader = () => {
  const { token } = useAuthStore.getState();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getUsers = async (): Promise<User[]> => {
  const res = await axios.get(`${BASE_URL}/admin/users`, getAuthHeader());
  return res.data;
};

export const getUserFormData = async (): Promise<UserFormData> => {
  const res = await axios.get(
    `${BASE_URL}/admin/users/form-data`,
    getAuthHeader(),
  );
  return res.data;
};

export const createUser = async (data: CreateUserDto) => {
  const res = await axios.post(
    `${BASE_URL}/admin/users`,
    data,
    getAuthHeader(),
  );
  return res.data;
};

export const getPermissions = async (): Promise<Permission[]> => {
  const res = await axios.get(
    `${BASE_URL}/admin/users/permissions`,
    getAuthHeader(),
  );
  return res.data;
};

export const getRoleDetails = async (id: number): Promise<Role> => {
  const res = await axios.get(
    `${BASE_URL}/admin/users/roles/${id}`,
    getAuthHeader(),
  );
  return res.data;
};

export const createRole = async () => {
  // Schema said "no parameters", typically this might be for creating a blank role or strictly defined by creating one via a different flow?
  // Following user request: "for POST /admin/users/roles, no parameters"
  const res = await axios.post(
    `${BASE_URL}/admin/users/roles`,
    {},
    getAuthHeader(),
  );
  return res.data;
};

export const assignPermissionsToRole = async (
  roleId: number,
  permissionIds: number[],
) => {
  const res = await axios.post(
    `${BASE_URL}/admin/users/roles/${roleId}/permissions`,
    { permissionIds },
    getAuthHeader(),
  );
  return res.data;
};

export const updateUserStatus = async (id: number, status: string) => {
  const res = await axios.patch(
    `${BASE_URL}/admin/users/${id}/status`,
    { status },
    getAuthHeader(),
  );
  return res.data;
};

export const resetUserPassword = async (id: number, newPassword: string) => {
  const res = await axios.post(
    `${BASE_URL}/admin/users/${id}/reset-password`,
    { newPassword },
    getAuthHeader(),
  );
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await axios.delete(
    `${BASE_URL}/admin/users/${id}`,
    getAuthHeader(),
  );
  return res.data;
};

export const updateUser = async (id: number, data: Partial<CreateUserDto>) => {
  const res = await axios.put(
    `${BASE_URL}/admin/users/${id}`,
    data,
    getAuthHeader(),
  );
  return res.data;
};
