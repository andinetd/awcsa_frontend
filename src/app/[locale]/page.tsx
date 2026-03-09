"use client";

import HeroBanner from "@/layout/common/hero-banner";
import ImageCarousel from "@/layout/common/image-carousel";
import Navbar from "@/layout/common/navbar";
import ServicesSection from "@/layout/common/services-section";
import PartnersSection from "@/layout/common/partners-section";
import TestimonialCarousel from "@/layout/common/testimonial-carousel";
import Footer from "@/layout/common/footer";
import { useGetLandingPage } from "@/hooks/cms";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: landingData, isLoading } = useGetLandingPage();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative">
      <Navbar />
      <HeroBanner data={landingData?.hero} />
      <ImageCarousel items={landingData?.gallery} />
      <ServicesSection items={landingData?.services} />
      <PartnersSection items={landingData?.partners} />
      <TestimonialCarousel items={landingData?.testimonials} />
      <Footer
        socialLinks={landingData?.social}
        quickLinks={landingData?.quickLinks}
        contactInfo={landingData?.contact}
      />
    </div>
  );
}
