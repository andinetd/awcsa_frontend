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

function Step4() {
  const router = useRouter();

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
                Income & Financial Status
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="incomeAndFinancialStatus.incomeSources"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Income Sources</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Income Sources"
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
                      <FormLabel>Income Support Sources</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Income Support Sources"
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
                      <FormLabel>Income Shortages</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Income Shortages"
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
                      <FormLabel>Income For Extra Child</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Income For Extra Child"
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
                Home & Environment
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="homeAndEnvironment.houseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>House Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter House Type"
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
                      <FormLabel>Ownership Status</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Ownership Status"
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
                      <FormLabel>Rooms And Size</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Rooms And Size"
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
                      <FormLabel>Living Duration</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Living Duration"
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
                      <FormLabel>Suitability For Child</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Suitability For Child"
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
                      <FormLabel>Compound Condition</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Compound Condition"
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
                      <FormLabel>Neighborhood Condition</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Neighborhood Condition"
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
                      <FormLabel>Community Attitude</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Community Attitude"
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
                      <FormLabel>Service Accessibility</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Service Accessibility"
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
                Health & Legal
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="healthAndLegal.currentHealthCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Health Condition</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Current Health Condition"
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
                      <FormLabel>Medication</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Medication"
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
                        Health Condition For Family Responsibility
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Health Condition For Family Responsibility"
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
                      <FormLabel>Mental Health Issues From Family</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Mental Health Issues From Family"
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
                Criminal Issues
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="criminalIssues.criminalRecord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Criminal Record</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Criminal Record"
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
                      <FormLabel>Family Criminal Record</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Family Criminal Record"
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
              Back
            </Button>
            <Button type="submit" className="px-8">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Step4;
