import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { columns } from "./_components/columns";
import { sampleChildrenData } from "@/lib/mock-data";

const CareCentersPortal = () => {
  return (
    <SidebarLayout title="Care Centers Portal">
      <div className="container mx-auto py-10 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between ">
          <h1 className="font-bold text-xl">Children Under Your Care</h1>
          <div className="flex gap-2">
            <Link href={"/care-centers-portal/add-child"} className="self-end">
              <Button>Add New Child</Button>
            </Link>
            <Link
              href={"/care-centers-portal/monthly-report"}
              className="self-end"
            >
              <Button>Submit Monthly Report</Button>
            </Link>
          </div>
        </div>
        <DataTable columns={columns} data={sampleChildrenData} />
      </div>
    </SidebarLayout>
  );
};

export default CareCentersPortal;
