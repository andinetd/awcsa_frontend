"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import React, { useMemo } from "react";
import { getAderaColumns } from "./_components/columns";
import { useTranslations } from "next-intl";

const mockAderaData: any[] = [];

const Adera = () => {
  const t = useTranslations("adoption");
  const columns = useMemo(() => getAderaColumns(t), [t]);

  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-bold text-xl text-[#0B1F3A]">{t("adera.title")}</h1>
          <p className="text-xs text-slate-500">{t("adera.subtitle")}</p>
        </div>
        <Link href={"/adoption/adera/adera-registration"} className="self-end md:self-auto">
          <Button className="bg-[#1769AA] hover:bg-[#12568E] text-white rounded-xs h-8 text-xs font-semibold px-3 shadow-2xs">
            {t("adera.newAdera")}
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={mockAderaData} />
    </div>
  );
};

export default Adera;
