"use client";

import {
  Briefcase,
  ClipboardCheck,
  BarChart,
  Users,
  TrendingUp,
  Info,
  Baby,
} from "lucide-react";
import { delay, motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

const ServicesSection = () => {
  const t = useTranslations();
  const services = [
    {
      icon: Baby,
      title: t("services.adoptionTitle"),
      description: t("services.adoptionDescription"),
      link: "/register",
      linkText: t("services.adoptionLinkText"),
    },
    {
      icon: Users,
      title: t("services.organizingTitle"),
      description: t("services.organizingDescription"),
    },
    {
      icon: Info,
      title: t("services.infoTitle"),
      description: t("services.infoDescription"),
    },
    {
      icon: ClipboardCheck,
      title: t("services.legalTitle"),
      description: t("services.legalDescription"),
    },
    {
      icon: BarChart,
      title: t("services.marketTitle"),
      description: t("services.marketDescription"),
    },
    {
      icon: TrendingUp,
      title: t("services.kaizenTitle"),
      description: t("services.kaizenDescription"),
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-12 bg-gray-50 sm:py-16 lg:py-20" id="services">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl xl:text-5xl font-pj">
            {t("services.sectionTitle")}
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600 sm:mt-8 font-pj">
            {t("services.sectionDescription")}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-6 px-8 mt-12 sm:grid-cols-2 md:grid-cols-3 sm:px-0 xl:mt-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="transition-all duration-200 bg-white transform-gpu hover:-translate-y-2 hover:shadow-lg flex flex-col"
              variants={itemVariants}
            >
              <div className="py-10 px-9 flex-grow">
                <service.icon className="w-16 h-16 text-gray-900" />
                <h3 className="mt-8 text-lg font-semibold text-black font-pj">
                  {service.title}
                </h3>
                <p className="mt-4 text-base text-gray-600 font-pj">
                  {service.description}
                </p>
              </div>
              {service.link && (
                <div className="px-9 pb-10">
                  <Link href={service.link}>
                    <span className="text-primary font-semibold hover:underline cursor-pointer">
                      {service.linkText}
                    </span>
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
