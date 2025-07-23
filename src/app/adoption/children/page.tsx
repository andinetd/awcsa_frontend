import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Children = () => {
  return (
    <SidebarLayout title="Children">
      <div className="flex flex-col gap-4 items-center justify-center h-full text-3xl">
        Children
        <Link href={"/adoption/children/child-registration/section1"}>
          <Button>Add New Child</Button>
        </Link>
      </div>
    </SidebarLayout>
  );
};

export default Children;
