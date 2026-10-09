"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  NewChildformSchema,
  NewChildformSchemaSection1,
  NewChildformTypeSection1,
} from "@/schemas/new-child-form-schema";
import { useNewChildFormStore } from "@/stores/new-child-registration-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useTranslations } from "next-intl";

export default function NewChildFormSectionOne() {
  const t = useTranslations("adoption");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const router = useRouter();
  const setData = useNewChildFormStore((state) => state.setData);

  const form = useForm<NewChildformTypeSection1>({
    resolver: zodResolver(NewChildformSchemaSection1),
    defaultValues: {
      age: 0,
    },
  });

  async function onSubmit(values: NewChildformTypeSection1) {
    //TODO: handle submission here
    console.log("values submited: ", { values });
    setData(values);
    router.push("/adoption/children/child-registration/section2");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span>{t("children.steps.step1.headerAdmin1")}</span>
          <span>·</span>
          <span>{t("children.steps.step1.headerAdmin2")}</span>
          <span>·</span>
          <span className="text-[#1769AA] font-semibold">
            {t("children.steps.step1.headerAdmin3")}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
              {t("children.steps.step1.title")}
            </h1>
            <p className="text-xs text-slate-500">
              {t("children.steps.step1.subtitle")}
            </p>
          </div>
          <div className="px-2.5 py-1 bg-[#E8F2FA] border border-[#BCD5EA] rounded-xs text-[#1769AA] font-mono text-xs font-semibold w-fit">
            {t("children.steps.step1.stepBadge")}
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs p-5 space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-2">
              {t("children.steps.step1.identitySection")}
            </h2>
            {/* Name Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name_by_family"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("children.steps.step1.nameByFamily")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_by_care_center"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("children.steps.step1.nameByCareCenter")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="father_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("children.steps.step1.fatherName")}{" "}
                      <span className="text-slate-400 font-normal text-[11px]">
                        {t("children.steps.step1.optional")}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("children.steps.step1.gender")}
                    </FormLabel>
                    <FormControl>
                      <Select
                        name="sex"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus:border-[#1769AA]">
                          <SelectValue placeholder={t("children.steps.step1.selectGender")} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xs border-[#E3E7EB]">
                          <SelectItem value="MALE" className="text-xs">
                            {t("children.steps.step1.male")}
                          </SelectItem>
                          <SelectItem value="FEMALE" className="text-xs">
                            {t("children.steps.step1.female")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                      {t("children.steps.step1.estimatedAge")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const stringValue = e.target.value;
                          const numberValue =
                            stringValue === "" ? null : Number(stringValue);
                          field.onChange(numberValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Admitance Reason */}
            <FormField
              control={form.control}
              name="admitance_reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("children.steps.step1.reasonForAdmission")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("children.steps.step1.reasonPlaceholder")}
                      rows={3}
                      className="resize-none text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="found_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("children.steps.step1.placeFound")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="found_subcity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("children.steps.step1.subCity")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="found_woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("children.steps.step1.woreda")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date Found */}
            <FormField
              control={form.control}
              name="found_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("children.steps.step1.dateFound")}
                  </FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-between w-full h-8 text-xs bg-white border-[#E3E7EB] rounded-xs text-slate-800"
                        >
                          {date ? date.toLocaleDateString() : t("children.steps.step1.selectDate")}
                          <ChevronDownIcon className="ml-2 h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xs border-[#E3E7EB]" align="start">
                        <Calendar
                          {...field}
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            setDate(date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Info */}
            <FormField
              control={form.control}
              name="additional_information"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("children.steps.step1.additionalInformation")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("children.steps.step1.additionalInfoPlaceholder")}
                      rows={3}
                      className="resize-none text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Submit Button */}
          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/adoption/children/")}
              className="rounded-xs text-xs font-medium h-8 border-[#E3E7EB] px-4 cursor-pointer"
            >
              {t("children.steps.step1.back")}
            </Button>
            <Button
              type="submit"
              className="bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold rounded-xs text-xs h-8 px-6 shadow-2xs cursor-pointer"
            >
              {t("children.steps.step1.nextStep")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
