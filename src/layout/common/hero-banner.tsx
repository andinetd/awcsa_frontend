"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroBanner = () => {
  return (
    <div
      className="min-h-screen w-full pt-20 sm:pt-24 md:pt-28 lg:pt-32 flex flex-col items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 relative"
      style={{
        backgroundImage: "url('/assets/background-placeholder.jpg')",
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
          Addis Ababa City Administration
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium font-lexend leading-tight text-white">
          <span className="text-primary">
            Bureau of Women, Children & Social Affairs
          </span>
        </h1>
        <Link href={"/login"}>
          <Button className="w-40 h-10 font-lexend text-lg">Sign In</Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default HeroBanner;
