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
    onSuccess: (data, variables) => {
      setAuthSession(
        data.access_token,
        data.refresh_token,
        !!variables.rememberMe,
      );
    },
  });
};
