import React from "react";

import { useTranslations } from "next-intl";

const EdirDashboard = () => {
  const t = useTranslations("social-affairs.edir.list");
  return (
    <div className="flex justify-center items-center h-screen text-3xl">
      {t("title")}
    </div>
  );
};

export default EdirDashboard;
