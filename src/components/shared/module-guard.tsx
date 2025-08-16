"use client";

import { useAuthStore } from "@/stores/auth-store";
import { DeputyBureau } from "@/types";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import CheckingAccess from "./access-check-ui";

interface ModuleGuardProps {
  allowed: DeputyBureau[];
  children: ReactNode;
}

export default function ModuleGuard({ allowed, children }: ModuleGuardProps) {
  const { user, token, org, hydrated } = useAuthStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true); // Loading state

  useEffect(() => {
    if (!hydrated) return;

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (user.accountType == "CLIENT") {
      router.replace("/adoption/applicant-portal/portal");
      return;
    }
    const bureau = org?.deputyBureau as DeputyBureau;
    if (!allowed.includes(bureau)) {
      router.replace("/unauthorized");
      return;
    }
    console.log(`BUREAU from guard:  `);
    console.log(bureau);
    console.log(`USER IN GUARD: `);
    console.log(user);
    setChecking(false);
  }, [user, allowed, router, org, hydrated, token]);

  // Optional loading state
  // if (!hydrated) {
  //   return <CheckingAccess />;
  // }

  return <>{children}</>;
}
