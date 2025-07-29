"use client";

import { useAuthStore } from "@/stores/auth-store";
import { DeputyBureau } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckingAccess from "./access-check-ui";

interface ModuleGuardProps {
  allowed: DeputyBureau[];
  children: React.ReactNode;
}

export default function ModuleGuard({ allowed, children }: ModuleGuardProps) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [checking, setChecking] = useState(true); // Loading state

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const bureau = user.org?.deputyBureau;

    if (!allowed.includes(bureau)) {
      router.replace("/unauthorized");
      return;
    }

    setChecking(false); // Passed checks
  }, [user, allowed, router]);

  // Optional loading state
  if (checking) {
    return <CheckingAccess />;
  }

  return <>{children}</>;
}
