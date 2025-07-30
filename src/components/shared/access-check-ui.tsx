import { LoaderIcon } from "lucide-react";
import React from "react";

const CheckingAccess = () => {
  return (
    <div className="flex flex-col md:flex-row gap-5 justify-center items-center min-h-screen">
      <img
        src="/assets/WCSA_logo.jpg"
        alt="logo"
        className="w-40 h-20 md:w-80 md:h-60 object-contain mb-8"
      />

      <h1 className="text-xl font-semibold font-lexend">
        {`Checking Access `}{" "}
        <span className="animate-spin">
          <LoaderIcon />
        </span>
      </h1>
    </div>
  );
};

export default CheckingAccess;
