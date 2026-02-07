"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { useCareCenterChildren } from "@/hooks/adoption/care-center/useChildren";
import { Loader2 } from "lucide-react";
import { useAuthMeQuery } from "@/hooks/applicants-portal";
import { useTranslations } from "next-intl";
import { Columns } from "./_components/columns";

const CareCentersPortal = () => {
  const t = useTranslations("care-centers-portal.dashboard");
  const columns = Columns();

  const { data: me } = useAuthMeQuery();
  const facilityId = me?.facilityId;

  const { data: children, isLoading } = useCareCenterChildren(facilityId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between ">
        <h1 className="font-bold text-xl">{t("title")}</h1>
        <div className="flex gap-2">
          <Link href={"/care-centers-portal/add-child"} className="self-end">
            <Button>{t("addChild")}</Button>
          </Link>

          <Link
            href={"/care-centers-portal/monthly-report"}
            className="self-end"
          >
            <Button>{t("submitMonthlyReport")}</Button>
          </Link>
          <Link href={"/care-centers-portal/reports"} className="self-end">
            <Button>{t("viewPastReports")}</Button>
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-20 min-h-[300px] border rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">{t("loading")}</span>
        </div>
      ) : (
        <DataTable columns={columns} data={children || []} />
      )}
    </div>
  );
};

export default CareCentersPortal;
