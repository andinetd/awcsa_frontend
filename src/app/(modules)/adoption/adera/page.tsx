import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import React from "react";
import { Child, columns } from "../children/_components/columns";

const Adera = () => {
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
    <SidebarLayout title="Adera">
      <div className="container mx-auto py-10 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between ">
          <h1 className="font-bold text-xl">List of Adera</h1>
          <Link
            href={"/adoption/adera/adera-registration"}
            className="self-end"
          >
            <Button>New Adera</Button>
          </Link>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </SidebarLayout>
  );
};

export default Adera;
