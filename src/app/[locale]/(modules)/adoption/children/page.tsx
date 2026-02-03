"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import React from "react";
import { getColumns } from "./_components/columns";
import { useChildren } from "@/hooks/adoption/useChildren";
import { useTranslations } from "next-intl";

const Children = () => {
  const t = useTranslations("adoption");
  const { data, isLoading } = useChildren();
  const columns = getColumns(t);

  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between ">
        <h1 className="font-bold text-xl">{t("children.list.title")}</h1>
        <Link
          href={"/adoption/children/child-registration/new"}
          className="self-end"
        >
          <Button>{t("children.list.addNew")}</Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          {t("children.list.loading")}
        </div>
      ) : (
        <DataTable columns={columns} data={data || []} />
      )}
    </div>
  );
};

export default Children;
