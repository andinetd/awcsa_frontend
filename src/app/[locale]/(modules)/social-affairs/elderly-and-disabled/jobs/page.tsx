"use client";

import { Suspense } from "react";
import ServicesContent from "../_components/services-content";

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-xs font-mono uppercase text-slate-400">
          Loading...
        </div>
      }
    >
      <ServicesContent initialTab="jobs" />
    </Suspense>
  );
}
