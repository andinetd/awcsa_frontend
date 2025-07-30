import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React from "react";
import NewAderaRegistrationForm from "../_components/adera-registration-form";

const NewAderaRegistration = () => {
  return (
    <SidebarLayout title="የአደራ ምዝገባ">
      <div className="">
        <NewAderaRegistrationForm />
      </div>
    </SidebarLayout>
  );
};

export default NewAderaRegistration;
