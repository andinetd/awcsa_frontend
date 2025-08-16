import { clientSignIn, clientSignup } from "@/api/auth/client";
import { useAuthStore } from "@/stores/auth-store";
import { ClientSignIn, ClientSignInResponse } from "@/types/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useClientSignupMutation = () =>
  useMutation({
    mutationFn: clientSignup,
    mutationKey: ["Client Sign up"],
  });

export const useClientSignInMutation = () => {
  const { setOrg, setUser, setToken } = useAuthStore();
  return useMutation<ClientSignInResponse, Error, ClientSignIn>({
    mutationFn: clientSignIn,
    mutationKey: ["Client Sign In"],
    onSuccess: (data) => {
      setToken(data.access_token);
      setOrg(data.org);
    },
  });
};
