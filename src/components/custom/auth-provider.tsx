"use client";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token && !user) {
      router.push("/login");
    }
  }, [token, user]);
  return <div>AuthProvider</div>;
};

export default AuthProvider;
