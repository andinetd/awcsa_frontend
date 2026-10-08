import { BASE_URL } from "@/lib/base-url";
import axios from "axios";

export interface ForgotPasswordResponse {
  message?: string;
}

export interface ResetPasswordResponse {
  message?: string;
}

export const forgotPasswordApi = async (
  email: string,
): Promise<ForgotPasswordResponse> => {
  try {
    const res = await axios.post<ForgotPasswordResponse>(
      `${BASE_URL}/auth/forgot-password`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to send password reset request",
      );
    }
    throw new Error(error?.message || "Unexpected error");
  }
};

export const resetPasswordApi = async (
  token: string,
  newPassword: string,
): Promise<ResetPasswordResponse> => {
  try {
    const res = await axios.post<ResetPasswordResponse>(
      `${BASE_URL}/auth/reset-password`,
      { token, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to reset password",
      );
    }
    throw new Error(error?.message || "Unexpected error");
  }
};
