"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

export default function GeneralSettings() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/super-admin/user-management?tab=roles");
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}