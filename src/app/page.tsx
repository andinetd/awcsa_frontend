import { Button } from "@/components/ui/button";
import HeroBanner from "@/layout/common/hero-banner";
import ImageCarousel from "@/layout/common/image-carousel";
import Navbar from "@/layout/common/navbar";
import ServicesSection from "@/layout/common/services-section";
import TestimonialCarousel from "@/layout/common/testimonial-carousel";
import Link from "next/link";
import Footer from "@/layout/common/footer";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <HeroBanner />
      <ImageCarousel />
      <ServicesSection />
      <TestimonialCarousel />
      <Footer />
    </div>
  );
}
