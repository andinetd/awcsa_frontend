"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldAlert } from "lucide-react";
import { WomenProfileSchemaType } from "@/schemas/women-profile";

interface HealthAssessmentSectionProps {
  form: UseFormReturn<WomenProfileSchemaType>;
  sectionNumber?: string;
}

export function HealthAssessmentSection({
  form,
  sectionNumber = "4.",
}: HealthAssessmentSectionProps) {
  const t = useTranslations("women");

  return (
    <div className="space-y-3 border-t border-[#E3E7EB] pt-4">
      <div className="flex items-center justify-between border-b border-[#E3E7EB] pb-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-1.5">
          <ShieldAlert className="size-3.5 text-[#1769AA]" />
          {sectionNumber ? `${sectionNumber} ` : ""}
          {t("form.healthTitle")}
        </h3>
        <span className="text-[11px] text-slate-500 font-normal">
          {t("form.healthDescription")}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="healthStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {t("form.healthTitle")}
              </FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue(
                    "healthConditions",
                    val && val !== "NONE" ? [val] : [],
                  );
                }}
                value={field.value || "NONE"}
              >
                <FormControl>
                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                    <SelectValue placeholder={t("form.healthStatusPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="NONE" className="text-xs">
                    {t("form.healthConditions.NONE")}
                  </SelectItem>
                  <SelectItem value="BREAST_CANCER" className="text-xs">
                    {t("form.healthConditions.BREAST_CANCER")}
                  </SelectItem>
                  <SelectItem value="CERVICAL_CANCER" className="text-xs">
                    {t("form.healthConditions.CERVICAL_CANCER")}
                  </SelectItem>
                  <SelectItem value="HIV" className="text-xs">
                    {t("form.healthConditions.HIV")}
                  </SelectItem>
                  <SelectItem value="OTHER" className="text-xs">
                    {t("form.healthConditions.OTHER")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
