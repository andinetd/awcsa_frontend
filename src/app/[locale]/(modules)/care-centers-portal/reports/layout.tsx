import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { useTranslations } from "next-intl";

const Layout = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("care-centers-portal.reports");

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/care-centers-portal">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
