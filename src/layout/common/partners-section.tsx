import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { CMSContent } from "@/types/cms";

interface PartnersSectionProps {
  items?: CMSContent[];
}

const PartnersSection = ({ items }: PartnersSectionProps) => {
  const t = useTranslations("partners");
  const locale = useLocale() as "en" | "am";

  if (!items || items.length === 0) return null;

  const visibleItems = items.filter((item) => item.isVisible);
  if (visibleItems.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-lexend text-slate-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-lexend">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {visibleItems
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full flex justify-center"
              >
                {item.metadata?.link ? (
                  <a
                    href={item.metadata.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110"
                  >
                    <Image
                      src={item.imageUrl || ""}
                      alt={item.title?.[locale] || "Partner"}
                      width={160}
                      height={80}
                      className="h-16 w-auto object-contain"
                    />
                  </a>
                ) : (
                  <div className="grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110">
                    <Image
                      src={item.imageUrl || ""}
                      alt={item.title?.[locale] || "Partner"}
                      width={160}
                      height={80}
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
