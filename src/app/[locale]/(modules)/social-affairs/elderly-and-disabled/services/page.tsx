"use client";

import { Suspense } from "react";
import ServicesContent from "../_components/services-content";

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-xs font-mono uppercase text-slate-400">
          Loading...
        </div>
      }
    >
      <ServicesContent initialTab="services" />
    </Suspense>
  );
}
