import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

const CheckingAccess = () => {
  const t = useTranslations("components.accessCheck");

  return (
    <div className="flex flex-col md:flex-row gap-5 justify-center items-center min-h-screen">
      <img
        src="/assets/WCSA_logo.jpg"
        alt={t("logoAlt")}
        className="w-40 h-20 md:w-80 md:h-60 object-contain mb-8"
      />

      <h1 className="text-xl font-semibold font-lexend">
        {t("checking")}{" "}
        <span className="animate-spin text-primary">
          <Loader2 />
        </span>
      </h1>
    </div>
  );
};

export default CheckingAccess;
