import React from "react";

import { useTranslations } from "next-intl";

const GenericSetup = () => {
  const t = useTranslations("social-affairs.edir.list");
  return (
    <div className="flex items-center justify-center h-full text-3xl">
      Generic setup
    </div>
  );
};

export default GenericSetup;
