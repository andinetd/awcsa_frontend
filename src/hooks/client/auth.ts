import { signIn, clientSignup } from "@/api/auth/auth";
import { useAuthStore } from "@/stores/auth-store";
import { ClientSignIn, ClientSignInResponse, JwtPayload } from "@/types/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useClientSignupMutation = () =>
  useMutation({
    mutationFn: clientSignup,
    mutationKey: ["Client Sign up"],
  });

export const useClientSignInMutation = () => {
  const { setUser, setToken } = useAuthStore();
  return useMutation<ClientSignInResponse, Error, ClientSignIn>({
    mutationFn: signIn,
    mutationKey: ["Client Sign In"],
    onSuccess: (data) => {
      setToken(data.access_token);
      
    },
  });
};
