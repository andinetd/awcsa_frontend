"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { sampleChildrenData } from "@/lib/mock-data";
import Link from "next/link";
import { columns } from "./_components/columns";
import { useAuthStore } from "@/stores/auth-store";
import { useCareCenterChildren } from "@/hooks/adoption/care-center/useChildren";
import { Loader2 } from "lucide-react";
import { useAuthMeQuery } from "@/hooks/applicants-portal";


const CareCentersPortal = () => {

  const { data: me } = useAuthMeQuery();
  const facilityId = me?.facilityId;  

  const { data: children, isLoading } = useCareCenterChildren(facilityId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between ">
        <h1 className="font-bold text-xl">Children Under Your Care</h1>
        <div className="flex gap-2">
          <Link

            href={"/care-centers-portal/add-child/new-form"}
            className="self-end"
          >
            <Button>Add New Child</Button>
          </Link>

          <Link
            href={"/care-centers-portal/monthly-report"}
            className="self-end"
          >
            <Button>Submit Monthly Report</Button>
          </Link>
          <Link href={"/care-centers-portal/reports"} className="self-end">
            <Button>View Past Reports</Button>
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-20 min-h-[300px] border rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={children || []} />
      )}
    </div>
  );
};

export default CareCentersPortal;
