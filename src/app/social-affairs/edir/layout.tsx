import Link from "next/link";
import React, { ReactNode } from "react";

const Edirlayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex gap-10">
      <div className="flex flex-col gap-1">
        <Link href={"/social-affairs/edir/dashboard"}>Edir Dashboard</Link>
        <Link href={"/social-affairs/edir/generic-setup"}>Generic setup</Link>
        <Link href={"/social-affairs/edir/list"}>Edir list</Link>
        <Link href={"/social-affairs/edir/single-edir"}>single edir</Link>
      </div>
      <div>{children}</div>
    </main>
  );
};

export default Edirlayout;
