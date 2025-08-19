import UserInfoAndLogout from "@/components/shared/user_logout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { sampleChildrenData } from "@/lib/mock-data";
import Link from "next/link";
import { columns } from "./_components/columns";

const CareCentersPortal = () => {
  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between ">
        <h1 className="font-bold text-xl">Children Under Your Care</h1>
        <div className="flex gap-2">
          <Link
            href={"/care-centers-portal/add-child/section1"}
            className="self-end"
          >
            <Button>Add New Child</Button>
          </Link>
          <UserInfoAndLogout />
        </div>
      </div>
      <DataTable columns={columns} data={sampleChildrenData} />
    </div>
  );
};

export default CareCentersPortal;
