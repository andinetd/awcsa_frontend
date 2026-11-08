"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TechnologyRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/women/services");
  }, [router]);

  return null;
}
