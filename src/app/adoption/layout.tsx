import Link from "next/link";
import React, { ReactNode } from "react";

const Adoptionlayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex gap-10">
      <div className="flex flex-col gap-1">
        <Link href={"/adoption/dashboard"}>Dashboard</Link>
        <Link href={"/adoption/assisted-homes"}>Assisted homes</Link>
        <Link href={"/adoption/children"}>Children</Link>
        <Link href={"/adoption/adera"}>Adera</Link>
        <Link href={"/adoption/care-centers"}>Care centers</Link>
        <Link href={"/adoption/benefits"}>Benefits</Link>
      </div>
      <div>{children}</div>
    </main>
  );
};

export default Adoptionlayout;
