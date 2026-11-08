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
import { Users } from "lucide-react";
import { WomenProfileSchemaType } from "@/schemas/women-profile";

interface SocioEconomicSectionProps {
  form: UseFormReturn<WomenProfileSchemaType>;
  sectionNumber?: string;
  columns?: 2 | 3;
}

export function SocioEconomicSection({
  form,
  sectionNumber = "3.",
  columns = 3,
}: SocioEconomicSectionProps) {
  const t = useTranslations("women");

  const gridClass =
    columns === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-3"
      : "grid grid-cols-1 md:grid-cols-3 gap-3";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-[#E3E7EB] pb-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-1.5">
          <Users className="size-3.5 text-[#1769AA]" />
          {sectionNumber ? `${sectionNumber} ` : ""}
          {t("form.familyStatus")} & {t("form.incomeStatus")}
        </h3>
      </div>

      <div className={gridClass}>
        <FormField
          control={form.control}
          name="familyStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {t("form.familyStatus")}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                    <SelectValue placeholder={t("form.familyStatusPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="Has children" className="text-xs">
                    {t("form.familyOptions.HAS_CHILDREN")}
                  </SelectItem>
                  <SelectItem value="No children" className="text-xs">
                    {t("form.familyOptions.NO_CHILDREN")}
                  </SelectItem>
                  <SelectItem
                    value="Single mother raising children alone"
                    className="text-xs"
                  >
                    {t("form.familyOptions.SINGLE_MOTHER")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="incomeStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {t("form.incomeStatus")}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                    <SelectValue placeholder={t("form.incomeStatusPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="Has regular income" className="text-xs">
                    {t("form.incomeOptions.REGULAR")}
                  </SelectItem>
                  <SelectItem value="No regular income" className="text-xs">
                    {t("form.incomeOptions.NO_REGULAR")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="careerStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {t("form.careerStatus")}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || "UNEMPLOYED"}
              >
                <FormControl>
                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                    <SelectValue placeholder={t("form.careerStatusPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="EMPLOYED" className="text-xs">
                    {t("form.careerOptions.EMPLOYED")}
                  </SelectItem>
                  <SelectItem value="SELF_EMPLOYED" className="text-xs">
                    {t("form.careerOptions.SELF_EMPLOYED")}
                  </SelectItem>
                  <SelectItem value="UNEMPLOYED" className="text-xs">
                    {t("form.careerOptions.UNEMPLOYED")}
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
