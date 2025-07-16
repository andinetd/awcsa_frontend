import Link from "next/link";
import React, { ReactNode } from "react";

const ElderlyAndDisabledLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex gap-10">
      <div className="flex flex-col gap-1">
        <Link href={"/social-affairs/elderly-and-disabled/dashboard"}>
          Elderly and disabled Dashboard
        </Link>
        <Link href={"/social-affairs/elderly-and-disabled/beneficiaries"}>
          Beneficiaries setup
        </Link>
        <Link href={"/social-affairs/elderly-and-disabled/benefit-tracking"}>
          BenefitTracking
        </Link>
        <Link href={"/social-affairs/elderly-and-disabled/jobs"}>Jobs</Link>
      </div>
      <div>{children}</div>
    </main>
  );
};

export default ElderlyAndDisabledLayout;
