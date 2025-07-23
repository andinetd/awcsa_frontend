import NewChildFormSectionOne from "@/app/adoption/children/child-registration/_components/new-child-section1-form";
import React, { ReactNode } from "react";

const RegisterNewChild = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen w-full py-10 px-8">
      <h1 className="text-2xl font-bold">{`የህፃናት መመዝገቢያ (New Child Registration)`}</h1>
      {children}
    </div>
  );
};

export default RegisterNewChild;
