import React from "react";
import { useTranslations } from "next-intl";

const WomenAssociations = () => {
  const t = useTranslations("womens");

  return (
    <div className="flex items-center justify-center h-full text-3xl">
      {t("associations.title")}
    </div>
  );
};

export default WomenAssociations;
