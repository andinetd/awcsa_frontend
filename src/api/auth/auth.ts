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
    console.log("SIGN IN REQ RES: ", reqRes);
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
      console.error("Login error response:", error.response?.data);
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("Unexpected error");
  }
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<ClientSignInResponse> => {
  try {
    const sendReq = await axios.post<ClientSignInResponse>(
      `${BASE_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return sendReq.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Refresh failed");
    }
    throw new Error("Unexpected error");
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
