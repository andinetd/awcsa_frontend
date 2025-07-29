import { Button } from "@/components/ui/button";
import HeroBanner from "@/layout/common/hero-banner";
import Navbar from "@/layout/common/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <HeroBanner />
    </div>
  );
}
