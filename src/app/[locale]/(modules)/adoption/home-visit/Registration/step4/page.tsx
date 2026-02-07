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
  Step4Schema,
  Step4SchemaType,
} from "@/schemas/home-visit-steps-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useHomeVisitFormStore } from "@/stores/home-visit-store";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

function Step4() {
  const router = useRouter();
  const t = useTranslations("adoption");

  const { step4, setStep4 } = useHomeVisitFormStore();

  const form = useForm<Step4SchemaType>({
    resolver: zodResolver(Step4Schema),
    defaultValues: step4 || {},
  });

  async function handleBack() {
    setStep4(form.getValues());
    router.back();
  }

  async function onSubmit(values: Step4SchemaType) {
    setStep4(values);
    router.push("/adoption/home-visit/Registration/step5");
  }

  return (
    <div className="mx-auto max-w-7xl mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                {t("homeVisitRegistration.step4.financial.title")}
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="incomeAndFinancialStatus.incomeSources"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.financial.incomeSources",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.financial.incomeSources",
                          )}
                          rows={3}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incomeAndFinancialStatus.incomeSupportSources"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.financial.incomeSupportSources",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.financial.incomeSupportSources",
                          )}
                          rows={3}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incomeAndFinancialStatus.incomeShortages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.financial.incomeShortages",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.financial.incomeShortages",
                          )}
                          rows={3}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incomeAndFinancialStatus.incomeForExtraChild"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.financial.incomeForExtraChild",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.financial.incomeForExtraChild",
                          )}
                          rows={2}
                          {...(field as any)}
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
                {t("homeVisitRegistration.step4.environment.title")}
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="homeAndEnvironment.houseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step4.environment.houseType")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step4.environment.houseType",
                          )}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homeAndEnvironment.ownershipStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.environment.ownershipStatus",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step4.environment.ownershipStatus",
                          )}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homeAndEnvironment.roomsAndSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.environment.roomsAndSize",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step4.environment.roomsAndSize",
                          )}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homeAndEnvironment.livingDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.environment.livingDuration",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step4.environment.livingDuration",
                          )}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homeAndEnvironment.suitabilityForChild"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.environment.suitability",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.environment.suitability",
                          )}
                          rows={3}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homeAndEnvironment.compoundCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.environment.compoundCondition",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.environment.compoundCondition",
                          )}
                          rows={2}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homeAndEnvironment.neighborhoodCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.environment.neighborhoodCondition",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.environment.neighborhoodCondition",
                          )}
                          rows={2}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homeAndEnvironment.communityAttitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.environment.communityAttitude",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.environment.communityAttitude",
                          )}
                          rows={2}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homeAndEnvironment.serviceAccessibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.environment.serviceAccessibility",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.environment.serviceAccessibility",
                          )}
                          rows={2}
                          {...(field as any)}
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
                {t("homeVisitRegistration.step4.healthLegal.title")}
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="healthAndLegal.currentHealthCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.healthLegal.currentHealth",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.healthLegal.currentHealth",
                          )}
                          rows={3}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="healthAndLegal.medication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.healthLegal.medication",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.healthLegal.medication",
                          )}
                          rows={2}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="healthAndLegal.healthConditionForFamilyResponsibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.healthLegal.responsibilityHealth",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.healthLegal.responsibilityHealth",
                          )}
                          rows={3}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="healthAndLegal.mentalHealthIssuesFromFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.healthLegal.mentalHealthIssues",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.healthLegal.mentalHealthIssues",
                          )}
                          rows={3}
                          {...(field as any)}
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
                {t("homeVisitRegistration.step4.criminal.title")}
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="criminalIssues.criminalRecord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.criminal.criminalRecord",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.criminal.criminalRecord",
                          )}
                          rows={2}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="criminalIssues.familyCriminalRecord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step4.criminal.familyCriminalRecord",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step4.criminal.familyCriminalRecord",
                          )}
                          rows={2}
                          {...(field as any)}
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

export default Step4;
