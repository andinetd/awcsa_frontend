import { BASE_URL } from "@/lib/base-url";
import {
  ClientSignIn,
  ClientSignInResponse,
  ClientSignup,
} from "@/types/api/auth";
import axios from "axios";

export const clientSignup = async (data: ClientSignup) => {
  try {
    const sendReq = await axios.post(
      `${BASE_URL}/auth/clients/register`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const reqRes = await sendReq.data;
    return reqRes;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const signIn = async (data: ClientSignIn): Promise<ClientSignInResponse> => {
  try {
    const sendReq = await axios.post<ClientSignInResponse>(
      `${BASE_URL}/auth/login`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const reqRes = await sendReq.data;
    return reqRes;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        (Array.isArray(error.response?.data?.errors)
          ? error.response?.data?.errors.join(", ")
          : null);
      const fallbackMessage =
        serverMessage ||
        (error.response?.status
          ? `Request failed with status ${error.response.status}`
          : error.message) ||
        "Login failed";
      throw new Error(fallbackMessage);
    }
    throw new Error(error?.message || "Unexpected error");
  }
};

export const normalizeAuthResponse = (data: any): ClientSignInResponse | null => {
  if (!data) return null;
  const payload = data?.data || data;
  const accessToken =
    payload?.access_token ||
    payload?.accessToken ||
    payload?.token ||
    data?.access_token ||
    data?.accessToken ||
    data?.token;

  const refreshToken =
    payload?.refresh_token ||
    payload?.refreshToken ||
    data?.refresh_token ||
    data?.refreshToken ||
    accessToken;

  if (!accessToken) return null;

  return {
    ...data,
    ...payload,
    access_token: accessToken,
    refresh_token: refreshToken,
  };
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<ClientSignInResponse> => {
  try {
    const sendReq = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {
        refreshToken,
        refresh_token: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const normalized = normalizeAuthResponse(sendReq.data);
    if (!normalized) {
      throw new Error("No access token found in refresh response");
    }
    return normalized;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.warn("Refresh request failed:", error.response?.status, error.response?.data);
      throw new Error(error.response?.data?.message || "Refresh failed");
    }
    throw new Error(error?.message || "Unexpected error");
  }
};


export const logoutApi = async (accessToken: string): Promise<void> => {
  try {
    await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    // Logout is best-effort; never surface the failure to the user.
    console.error("Server-side logout failed:", error);
  }
};
