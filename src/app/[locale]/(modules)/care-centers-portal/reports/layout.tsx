import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/care-centers-portal">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Monthly Reports</h2>
          <p className="text-muted-foreground">
            View and manage your submitted monthly reports.
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
