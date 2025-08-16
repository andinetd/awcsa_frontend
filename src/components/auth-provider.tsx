"use client";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@/types/api/auth";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
  allowedRoles?: UserRole[]
}

const AuthProvider = ({ children, allowedRoles }: AuthProviderProps) => {
  const { userRole, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // if (!hydrated) {
    //   router.push("/login");
    // }
    if(!hydrated) return;
    
    //redirect if role is not allowed
    if(allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
      router.replace("/unauthorized");
    }
  }, [hydrated, userRole, allowedRoles]);


  if(!hydrated || (allowedRoles && !userRole)) return null;

  return <>{children}</>;
};

export default AuthProvider;
