import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import React from "react";
import { columns, Child } from "./_components/columns";
import { sampleChildrenData } from "@/lib/mock-data";

const Children = () => {
  const data: Child[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between ">
        <h1 className="font-bold text-xl">List of Children</h1>
        <Link
          href={"/adoption/children/child-registration/section1"}
          className="self-end"
        >
          <Button>Add New Child</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={sampleChildrenData} />
    </div>
  );
};

export default Children;
