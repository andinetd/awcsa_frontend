import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import React from "react";
import { columns, Payment } from "./_components/columns";

const Children = () => {
  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
  return (
    <SidebarLayout title="Children">
      <div className="container mx-auto py-10 flex flex-col gap-4">
        <Link
          href={"/adoption/children/child-registration/section1"}
          className="self-end"
        >
          <Button>Add New Child</Button>
        </Link>
        <DataTable columns={columns} data={data} />
      </div>
    </SidebarLayout>
  );
};

export default Children;
