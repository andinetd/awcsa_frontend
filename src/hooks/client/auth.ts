import { clientSignup } from "@/api/auth/client";
import { useMutation } from "@tanstack/react-query";

export const useClientSignupMutation = () =>
  useMutation({
    mutationFn: clientSignup,
    mutationKey: ["Client Sign up"],
  });
