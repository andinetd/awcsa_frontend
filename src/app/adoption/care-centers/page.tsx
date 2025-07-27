import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import React from "react";
import NewCareCenterForm from "./_components/new-care-center-form";

const CareCenters = () => {
  return (
    <SidebarLayout title="Care Centers">
      <div className="flex flex-col">
        <div className="self-end">
          <NewCareCenterForm />
        </div>
        <DataTable columns={[]} data={[]} />
      </div>
    </SidebarLayout>
  );
};

export default CareCenters;
