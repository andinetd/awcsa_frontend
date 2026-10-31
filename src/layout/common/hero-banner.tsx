"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

const HeroBanner = ({ data }: { data?: any }) => {
  const t = useTranslations();
  const locale = useLocale() as "en" | "am";

  const getLocalized = (field: any, name?: string) => {
    if (!field && name) {
      // Try flattened pattern (e.g., title_en)
      const flatValue =
        data?.[`${name}_${locale}`] ||
        data?.[`${name}_en`] ||
        data?.[`${name}_am`];
      if (flatValue) return flatValue;
    }
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object") {
      return field[locale] || field.en || field.am || "";
    }
    return "";
  };

  const title =
    getLocalized(data?.title, "title") ||
    t("hero.title_first") + t("hero.title");
  const subtitle =
    getLocalized(data?.subtitle, "subtitle") || t("hero.description");
  const description =
    getLocalized(data?.description || data?.content, "description") ||
    getLocalized(data?.description || data?.content, "content");
  const imageUrl =
    data?.imageUrl && data.imageUrl !== "/assets/background-placeholder.jpg"
      ? data.imageUrl
      : "/assets/hero-bg.jpg";
  const rawButtonText =
    getLocalized(data?.buttonText || data?.linkText, "buttonText") ||
    getLocalized(data?.buttonText || data?.linkText, "linkText");
  // Default to "Explore Services" if no custom text or if set to the legacy "Sign In"
  const buttonText =
    rawButtonText && rawButtonText !== "Sign In" && rawButtonText !== "ግባ"
      ? rawButtonText
      : t("hero.exploreServices");
  const buttonLink =
    data?.buttonLink || data?.link || data?.metadata?.link || "#services";

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLButtonElement>,
    target: string
  ) => {
    if (target.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full pt-20 sm:pt-24 md:pt-28 lg:pt-32 flex flex-col items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 relative"
      style={{
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <motion.div
        className="relative z-10 text-center max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl flex flex-col items-center gap-3 sm:gap-4 md:gap-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-white font-medium font-lexend text-xs sm:text-sm md:text-base px-4">
          {subtitle}
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold font-lexend leading-tight text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-white/80 max-w-2xl">{description}</p>
        )}

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
          {buttonLink.startsWith("#") ? (
            <Button
              onClick={(e) => handleSmoothScroll(e, buttonLink)}
              className="w-full sm:w-auto h-11 sm:h-12 px-6 font-lexend text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {buttonText}
            </Button>
          ) : (
            <Link href={buttonLink} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-11 sm:h-12 px-6 font-lexend text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                {buttonText}
              </Button>
            </Link>
          )}

          <Link href="/register" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-11 sm:h-12 px-6 font-lexend text-sm sm:text-base font-semibold bg-white/10 hover:bg-white/20 text-white border-white/40 hover:border-white backdrop-blur-sm shadow-md transition-all"
            >
              {t("hero.applyAdoption")}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroBanner;
