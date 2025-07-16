import Link from "next/link";
import React, { ReactNode } from "react";

const SocialAffairslayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex gap-10">
      <div className="flex flex-col gap-1">
        <Link href={"/social-affairs/social/dashboard"}>Dashboard</Link>
        <Link href={"/social-affairs/edir/dashboard"}>Edir </Link>
        <Link href={"/social-affairs/elderly-and-disabled/dashboard"}>
          Elderly and disabled
        </Link>
      </div>
      <div>{children}</div>
    </main>
  );
};

export default SocialAffairslayout;
