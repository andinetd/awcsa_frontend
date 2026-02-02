"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    // Ignore locale segment (first segment)
    const breadcrumbs = segments
      .slice(1)
      .map((segment: string, index: number) => {
        const path = `/${segments.slice(0, index + 2).join("/")}`;
        const isLast = index === segments.length - 2;

        // Handle common segment names or formatting
        let label = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase());

        // Special case for dynamic IDs or UUIDs (usually long strings)
        if (segment.length > 20 || /^[a-f0-9-]{36}$/i.test(segment)) {
          label = "Details";
        }

        return { path, label, isLast };
      });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb className="mb-0.5">
      <BreadcrumbList>
        {breadcrumbs.map((bc: any, i: number) => (
          <React.Fragment key={bc.path}>
            <BreadcrumbItem>
              {bc.isLast ? (
                <BreadcrumbPage className="text-xs">{bc.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild className="text-xs">
                  <Link href={bc.path}>{bc.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!bc.isLast && <BreadcrumbSeparator className="[&>svg]:size-3" />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
