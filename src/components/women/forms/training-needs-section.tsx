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
import { GraduationCap } from "lucide-react";
import { WomenProfileSchemaType } from "@/schemas/women-profile";

interface TrainingNeedsSectionProps {
  form: UseFormReturn<WomenProfileSchemaType>;
  includeTraining: boolean;
  onIncludeTrainingChange: (checked: boolean) => void;
  sectionNumber?: string;
}

export function TrainingNeedsSection({
  form,
  includeTraining,
  onIncludeTrainingChange,
  sectionNumber = "5.",
}: TrainingNeedsSectionProps) {
  const t = useTranslations("women");

  return (
    <div className="space-y-4 border-t border-[#E3E7EB] pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-1.5">
          <GraduationCap className="size-3.5 text-[#1769AA]" />
          {sectionNumber ? `${sectionNumber} ` : ""}
          {t("form.trainingNeedsTitle")}
        </h3>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#1769AA] font-semibold bg-slate-50 border border-[#E3E7EB] px-3 py-1.5 rounded-xs hover:bg-slate-100 transition-colors">
          <input
            type="checkbox"
            checked={includeTraining}
            onChange={(e) => {
              onIncludeTrainingChange(e.target.checked);
              form.setValue("wantsTraining", e.target.checked);
            }}
            className="rounded-xs text-[#1769AA] focus:ring-0 size-4"
          />
          <span>
            {includeTraining
              ? `✓ ${t("form.includeTraining")}`
              : `+ ${t("form.includeTraining")}`}
          </span>
        </label>
      </div>

      {includeTraining && (
        <div className="space-y-4 p-4 rounded-xs border border-[#E3E7EB] bg-slate-50/40 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="requestedTrainingTopic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("form.requestedTrainingTopic")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.requestedTrainingTopicPlaceholder")}
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
              name="desiredSector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("form.desiredSector")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                        <SelectValue placeholder={t("form.desiredSectorPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="LEATHER" className="text-xs">
                        {t("form.sectorOptions.LEATHER")}
                      </SelectItem>
                      <SelectItem value="TEXTILE" className="text-xs">
                        {t("form.sectorOptions.TEXTILE")}
                      </SelectItem>
                      <SelectItem value="FOOD_PROCESSING" className="text-xs">
                        {t("form.sectorOptions.FOOD_PROCESSING")}
                      </SelectItem>
                      <SelectItem value="HANDICRAFT" className="text-xs">
                        {t("form.sectorOptions.HANDICRAFT")}
                      </SelectItem>
                      <SelectItem value="AGRICULTURE" className="text-xs">
                        {t("form.sectorOptions.AGRICULTURE")}
                      </SelectItem>
                      <SelectItem value="OTHER" className="text-xs">
                        {t("form.sectorOptions.OTHER")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postTrainingParticipation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("form.postTrainingParticipation")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.postTrainingParticipationPlaceholder")}
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
              name="traineeCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("form.traineeCategory")}
                  </FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue(
                        "traineeStatus",
                        val && val !== "NONE" ? [val] : [],
                      );
                    }}
                    value={field.value || "NONE"}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                        <SelectValue placeholder={t("form.traineeCategoryPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="NONE" className="text-xs">
                        {t("form.traineeCategoryOptions.NONE")}
                      </SelectItem>
                      <SelectItem value="DISABILITY" className="text-xs">
                        {t("form.traineeCategoryOptions.DISABILITY")}
                      </SelectItem>
                      <SelectItem value="NO_JOB_OPPORTUNITY" className="text-xs">
                        {t("form.traineeCategoryOptions.NO_JOB_OPPORTUNITY")}
                      </SelectItem>
                      <SelectItem value="RETURN_FROM_MIGRATION" className="text-xs">
                        {t("form.traineeCategoryOptions.RETURN_FROM_MIGRATION")}
                      </SelectItem>
                      <SelectItem value="OTHER" className="text-xs">
                        {t("form.traineeCategoryOptions.OTHER")}
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
