import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

const RegisterNewChildCareCenter = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/care-centers-portal">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            New Child Registration
          </h2>
          <p className="text-muted-foreground">
            Register a new child into the care center system.
          </p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto w-full">{children}</div>
    </div>
  );
};

export default RegisterNewChildCareCenter;
