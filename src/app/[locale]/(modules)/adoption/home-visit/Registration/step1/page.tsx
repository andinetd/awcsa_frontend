"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Step1Schema,
  Step1SchemaType,
} from "@/schemas/home-visit-steps-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useHomeVisitFormStore } from "@/stores/home-visit-store";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

function Step1() {
  const router = useRouter();
  const t = useTranslations("adoption");

  const { step1, setStep1, reset } = useHomeVisitFormStore();

  const form = useForm<Step1SchemaType>({
    resolver: zodResolver(Step1Schema),
    defaultValues: step1 || {},
  });

  async function handleBack() {
    reset();
    router.back();
  }

  async function onSubmit(values: Step1SchemaType) {
    setStep1(values);
    router.push("/adoption/home-visit/Registration/step2");
  }

  return (
    <div className="mx-auto max-w-7xl mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                {t("homeVisitRegistration.step1.generalInfo.title")}
              </CardTitle>

              {/* General Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="generalInfo.socialWorkerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.generalInfo.socialWorkerName",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t(
                            "homeVisitRegistration.step1.generalInfo.placeholders.socialWorkerName",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalInfo.placeOfVisit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.generalInfo.placeOfVisit",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t(
                            "homeVisitRegistration.step1.generalInfo.placeholders.placeOfVisit",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalInfo.startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.generalInfo.startDate")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder={t(
                            "homeVisitRegistration.step1.generalInfo.placeholders.startDate",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalInfo.startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.generalInfo.startTime")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder={t(
                            "homeVisitRegistration.step1.generalInfo.placeholders.startTime",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalInfo.endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.generalInfo.endDate")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder={t(
                            "homeVisitRegistration.step1.generalInfo.placeholders.endDate",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalInfo.endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.generalInfo.endTime")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder={t(
                            "homeVisitRegistration.step1.generalInfo.placeholders.endTime",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                {t("homeVisitRegistration.step1.address.title")}
              </CardTitle>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="generalInfo.address.region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.address.region")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t(
                            "homeVisitRegistration.step1.address.placeholders.region",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalInfo.address.subCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.address.subCity")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t(
                            "homeVisitRegistration.step1.address.placeholders.subCity",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalInfo.address.woreda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.address.woreda")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t(
                            "homeVisitRegistration.step1.address.placeholders.woreda",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalInfo.address.kebele"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.address.kebele")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t(
                            "homeVisitRegistration.step1.address.placeholders.kebele",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalInfo.address.houseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.address.houseNumber")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t(
                            "homeVisitRegistration.step1.address.placeholders.houseNumber",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalInfo.address.neighborhoodName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.address.neighborhood")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t(
                            "homeVisitRegistration.step1.address.placeholders.neighborhood",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                {t("homeVisitRegistration.step1.applicant.fatherTitle")}
              </CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                <FormField
                  control={form.control}
                  name="applicantFather.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.fullName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.fullName",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantFather.birthDateOrAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.applicant.birthDateOrAge",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.birthDateOrAge",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantFather.birthPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.birthPlace")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.birthPlace",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantFather.religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.religion")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.religion",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantFather.maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.applicant.maritalStatus",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.maritalStatus",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantFather.educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.applicant.educationLevel",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.educationLevel",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantFather.nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.nationality")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.nationality",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantFather.occupationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.applicant.occupationType",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.occupationType",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantFather.occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.occupation")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.occupation",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantFather.monthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.applicant.monthlyIncome",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          step={1}
                          min={0}
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.monthlyIncome",
                          )}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            field.onChange(v === "" ? undefined : Number(v));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantFather.extraIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.extraIncome")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.extraIncome",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantFather.phoneHome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.phoneHome")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.phoneHome",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantFather.phoneMobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.phoneMobile")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.phoneMobile",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                {t("homeVisitRegistration.step1.applicant.motherTitle")}
              </CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                <FormField
                  control={form.control}
                  name="applicantMother.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.fullName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.fullName",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantMother.birthDateOrAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.applicant.birthDateOrAge",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.birthDateOrAge",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantMother.birthPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.birthPlace")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.birthPlace",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantMother.religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.religion")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.religion",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantMother.maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.applicant.maritalStatus",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.maritalStatus",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantMother.educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.applicant.educationLevel",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.educationLevel",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantMother.nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.nationality")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.nationality",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantMother.occupationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.applicant.occupationType",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.occupationType",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantMother.occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.occupation")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.occupation",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantMother.monthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.applicant.monthlyIncome",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          step={1}
                          min={0}
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.monthlyIncome",
                          )}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            field.onChange(v === "" ? undefined : Number(v));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantMother.extraIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.extraIncome")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.placeholders.extraIncome",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantMother.phoneHome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.phoneHome")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.phoneHome",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantMother.phoneMobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step1.applicant.phoneMobile")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.applicant.phoneMobile",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                {t("homeVisitRegistration.step1.marriageInfo.title")}
              </CardTitle>
              <div className="grid grid-cols-1 gap-4 mt-3">
                <FormField
                  control={form.control}
                  name="marriageInfo.marriageDateAndPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.marriageInfo.marriageDateAndPlace",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.marriageInfo.placeholders.marriageDateAndPlace",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marriageInfo.marriageDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.marriageInfo.marriageDuration",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step1.marriageInfo.placeholders.marriageDuration",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marriageInfo.relationshipDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.marriageInfo.relationshipDescription",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step1.marriageInfo.placeholders.relationshipDescription",
                          )}
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marriageInfo.conflictResolution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.marriageInfo.conflictResolution",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step1.marriageInfo.placeholders.conflictResolution",
                          )}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marriageInfo.mutualSupport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.marriageInfo.mutualSupport",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step1.marriageInfo.placeholders.mutualSupport",
                          )}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marriageInfo.bigDescisionsMakingExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.marriageInfo.bigDecisions",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step1.marriageInfo.placeholders.bigDecisions",
                          )}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marriageInfo.financialManagement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step1.marriageInfo.financialManagement",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step1.marriageInfo.placeholders.financialManagement",
                          )}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </div>
          {/* Submit Button */}
          <div className="flex justify-between mt-4">
            <Button type="button" variant="outline" onClick={handleBack}>
              {t("homeVisitRegistration.buttons.back")}
            </Button>
            <Button type="submit" className="px-8">
              {t("homeVisitRegistration.buttons.next")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Step1;
