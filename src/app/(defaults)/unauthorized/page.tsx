"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center text-center">
      <img
        src="/assets/WCSA_logo.jpg"
        alt="logo"
        className="w-40 h-20 md:w-80 md:h-60 object-contain mb-8"
      />

      <div className="flex flex-col items-center md:items-start justify-center gap-4">
        <h1 className="text-2xl font-semibold font-lexend mb-2">
          Access Denied
        </h1>
        <p className="text-lg text-foreground/60">
          You don't have permission to access this page.
        </p>

        <Button onClick={() => router.back()} className="w-40 h-10">
          Go Back
        </Button>
      </div>
    </div>
  );
}
