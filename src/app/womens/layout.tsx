import Link from "next/link";
import React, { ReactNode } from "react";

const WomenLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex gap-10">
      <div className="flex flex-col gap-1">
        <Link href={"/womens/dashboard"}>Women Dashboard</Link>
        <Link href={"/womens/support-service"}>Support service</Link>
        <Link href={"/womens/women-list"}>women list</Link>
        <Link href={"/womens/women-associations"}>Women assoiciations</Link>
      </div>
      <div>{children}</div>
    </main>
  );
};

export default WomenLayout;
