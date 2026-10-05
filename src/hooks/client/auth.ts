import { signIn, clientSignup } from "@/api/auth/auth";
import { useAuthStore } from "@/stores/auth-store";
import { ClientSignIn, ClientSignInResponse, JwtPayload } from "@/types/api/auth";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
export const useClientSignupMutation = () =>
  useMutation({
    mutationFn: clientSignup,
    mutationKey: ["Client Sign up"],
  });

export const useSignInMutation = () => {
  const { setAuthSession } = useAuthStore();
  return useMutation<ClientSignInResponse, Error, ClientSignIn>({
    mutationFn: signIn,
    mutationKey: ["Client Sign In"],
    onSuccess: (data: any, variables) => {
      console.log("Sign-in response data:", data);
      const token =
        data?.access_token ||
        data?.accessToken ||
        data?.data?.access_token ||
        data?.data?.accessToken ||
        data?.token;
      const refreshToken =
        data?.refresh_token ||
        data?.refreshToken ||
        data?.data?.refresh_token ||
        data?.data?.refreshToken ||
        token;

      if (!token) {
        console.error("No access token found in response:", data);
        return;
      }

      setAuthSession(
        token,
        refreshToken,
        !!variables.rememberMe,
      );
    },
  });
};
