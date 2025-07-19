import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React from "react";

const BureauHead = () => {
  return (
    <SidebarLayout>
      <div>
        BureauHead- Head of the offices
        <div className="flex flex-col">
          <p>main dashboard</p>
          <p>Sub city list</p>
          <p>all are side bar</p>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default BureauHead;
