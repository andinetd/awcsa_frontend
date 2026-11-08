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
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { WomenProfileSchemaType } from "@/schemas/women-profile";

interface PersonalDemographicsSectionProps {
  form: UseFormReturn<WomenProfileSchemaType>;
  includeCityId?: boolean;
  includeCareerStatus?: boolean;
  sectionNumber?: string;
  columns?: 2 | 4;
}

export function PersonalDemographicsSection({
  form,
  includeCityId = false,
  includeCareerStatus = false,
  sectionNumber = "1.",
  columns = 4,
}: PersonalDemographicsSectionProps) {
  const t = useTranslations("women");

  const gridClass =
    columns === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-3"
      : "grid grid-cols-1 md:grid-cols-4 gap-3";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-[#E3E7EB] pb-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-1.5">
          <User className="size-3.5 text-[#1769AA]" />
          {sectionNumber ? `${sectionNumber} ` : ""}
          {t("form.personalInfo")}
        </h3>
      </div>

      <div className={gridClass}>
        <FormField
          control={form.control}
          name="faydaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {t("form.faydaId")} *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("form.faydaIdPlaceholder")}
                  className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {includeCityId && (
          <FormField
            control={form.control}
            name="cityIdNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-slate-700">
                  {t("form.cityId")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.cityIdPlaceholder")}
                    className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className={columns === 4 ? "md:col-span-2" : ""}>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {t("form.fullName")} *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("form.fullNamePlaceholder")}
                  className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {t("form.age")} *
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t("form.agePlaceholder")}
                  className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {t("form.phoneNumber")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="09..."
                  className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="educationLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {t("form.educationLevel")} *
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                    <SelectValue placeholder={t("form.educationLevelPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="DEGREE_AND_ABOVE" className="text-xs">
                    {t("form.educationOptions.DEGREE_AND_ABOVE")}
                  </SelectItem>
                  <SelectItem value="DIPLOMA" className="text-xs">
                    {t("form.educationOptions.DIPLOMA")}
                  </SelectItem>
                  <SelectItem value="GRADE_9_12" className="text-xs">
                    {t("form.educationOptions.GRADE_9_12")}
                  </SelectItem>
                  <SelectItem value="GRADE_5_8" className="text-xs">
                    {t("form.educationOptions.GRADE_5_8")}
                  </SelectItem>
                  <SelectItem value="READ_AND_WRITE" className="text-xs">
                    {t("form.educationOptions.READ_AND_WRITE")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="disabilityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {t("form.disabilityType")}
              </FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue(
                    "disabilities",
                    val && val !== "NONE" ? [val] : [],
                  );
                }}
                value={field.value || "NONE"}
              >
                <FormControl>
                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                    <SelectValue placeholder={t("form.disabilityTypePlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="NONE" className="text-xs">
                    {t("form.disabilityTypeOptions.NONE")}
                  </SelectItem>
                  <SelectItem value="LIMB_IMPAIRMENT" className="text-xs">
                    {t("form.disabilityTypeOptions.LIMB_IMPAIRMENT")}
                  </SelectItem>
                  <SelectItem value="BLIND" className="text-xs">
                    {t("form.disabilityTypeOptions.BLIND")}
                  </SelectItem>
                  <SelectItem value="HARD_OF_HEARING" className="text-xs">
                    {t("form.disabilityTypeOptions.HARD_OF_HEARING")}
                  </SelectItem>
                  <SelectItem value="OTHER" className="text-xs">
                    {t("form.disabilityTypeOptions.OTHER")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {includeCareerStatus && (
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
                      <SelectValue
                        placeholder={t("form.careerStatusPlaceholder")}
                      />
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
        )}
      </div>
    </div>
  );
}
