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
import { HandHeart } from "lucide-react";
import { WomenProfileSchemaType } from "@/schemas/women-profile";
import AssociationSelect from "@/app/[locale]/(modules)/women/services/_components/association-select";

interface SupportNeedsSectionProps {
  form: UseFormReturn<WomenProfileSchemaType>;
  includeSupport: boolean;
  onIncludeSupportChange: (checked: boolean) => void;
  associations: any[];
  sectionNumber?: string;
}

export function SupportNeedsSection({
  form,
  includeSupport,
  onIncludeSupportChange,
  associations,
  sectionNumber = "6.",
}: SupportNeedsSectionProps) {
  const t = useTranslations("women");

  return (
    <div className="space-y-4 border-t border-[#E3E7EB] pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-1.5">
          <HandHeart className="size-3.5 text-[#1769AA]" />
          {sectionNumber ? `${sectionNumber} ` : ""}
          {t("form.supportNeedsTitle")}
        </h3>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#1769AA] font-semibold bg-slate-50 border border-[#E3E7EB] px-3 py-1.5 rounded-xs hover:bg-slate-100 transition-colors">
          <input
            type="checkbox"
            checked={includeSupport}
            onChange={(e) => {
              onIncludeSupportChange(e.target.checked);
              form.setValue("wantsSupport", e.target.checked);
            }}
            className="rounded-xs text-[#1769AA] focus:ring-0 size-4"
          />
          <span>
            {includeSupport
              ? `✓ ${t("form.includeSupport")}`
              : `+ ${t("form.includeSupport")}`}
          </span>
        </label>
      </div>

      {includeSupport && (
        <div className="space-y-4 p-4 rounded-xs border border-[#E3E7EB] bg-slate-50/40 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="associationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("form.womenAssociation")}
                  </FormLabel>
                  <FormControl>
                    <AssociationSelect
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(val) => {
                        if (!val) {
                          field.onChange(null);
                          form.setValue("cooperativeName", "");
                        } else {
                          const idNum = Number(val);
                          field.onChange(idNum);
                          const match = associations.find(
                            (a: any) => a.id === idNum,
                          );
                          form.setValue(
                            "cooperativeName",
                            match ? match.name : "",
                          );
                        }
                      }}
                      placeholder={t("form.womenAssociationPlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestedTechnologyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("form.requestedTechnologyType")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.requestedTechnologyTypePlaceholder")}
                      className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white"
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
              name="supportStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("form.supportStatus")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                        <SelectValue
                          placeholder={t("form.supportStatusPlaceholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem
                        value="Poorest of the poor"
                        className="text-xs"
                      >
                        {t("form.supportStatusOptions.POOREST")}
                      </SelectItem>
                      <SelectItem
                        value="Engaged in sex work"
                        className="text-xs"
                      >
                        {t("form.supportStatusOptions.SEX_WORK")}
                      </SelectItem>
                      <SelectItem
                        value="Returnee from migration"
                        className="text-xs"
                      >
                        {t("form.supportStatusOptions.RETURN_MIGRANT")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supportMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("form.supportMode")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                        <SelectValue
                          placeholder={t("form.supportModePlaceholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="INDIVIDUAL" className="text-xs">
                        {t("form.supportModeOptions.INDIVIDUAL")}
                      </SelectItem>
                      <SelectItem value="GROUP" className="text-xs">
                        {t("form.supportModeOptions.GROUP")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
