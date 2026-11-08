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
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { SubCitySelect, WoredaSelect } from "@/components/shared/location-selects";
import { WomenProfileSchemaType } from "@/schemas/women-profile";

interface LocationAddressSectionProps {
  form: UseFormReturn<WomenProfileSchemaType>;
  sectionNumber?: string;
  columns?: 2 | 4;
  includeZoneBlock?: boolean;
  includeAddress?: boolean;
  extraSubCityOptions?: string[];
}

export function LocationAddressSection({
  form,
  sectionNumber = "2.",
  columns = 4,
  includeZoneBlock = true,
  includeAddress = false,
  extraSubCityOptions,
}: LocationAddressSectionProps) {
  const t = useTranslations("women");
  const subCity = form.watch("subCity");

  const gridClass =
    columns === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-3"
      : "grid grid-cols-1 md:grid-cols-4 gap-3";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-[#E3E7EB] pb-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-1.5">
          <MapPin className="size-3.5 text-[#1769AA]" />
          {sectionNumber ? `${sectionNumber} ` : ""}
          {t("form.addressTitle")}
        </h3>
      </div>

      <div className={gridClass}>
        <FormField
          control={form.control}
          name="subCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {t("form.subCity")}
              </FormLabel>
              <FormControl>
                <SubCitySelect
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue("woreda", "");
                  }}
                  placeholder={t("form.subCityPlaceholder")}
                  extraOptions={extraSubCityOptions}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="woreda"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {t("form.woreda")}
              </FormLabel>
              <FormControl>
                <WoredaSelect
                  subCity={subCity || ""}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("form.woredaPlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {includeZoneBlock && (
          <>
            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("form.zone")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.zonePlaceholder")}
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
              name="block"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("form.block")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.blockPlaceholder")}
                      className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {includeAddress && (
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className={columns === 4 ? "md:col-span-2" : ""}>
                <FormLabel className="text-xs font-semibold text-slate-700">
                  {t("form.address")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.addressPlaceholder")}
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
      </div>
    </div>
  );
}
