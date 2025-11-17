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

function Step1() {
  const router = useRouter();

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
                General Information
              </CardTitle>

              {/* General Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="generalInfo.socialWorkerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Worker Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Social Worker Name"
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
                      <FormLabel>Place of Visit</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Place of Visit"
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
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter Start Date"
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
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder="Enter Start Time"
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
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter End Date"
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
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder="Enter End Time"
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
              <CardTitle className="text-lg font-semibold">Address</CardTitle>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="generalInfo.address.region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Region"
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
                      <FormLabel>Sub City</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Sub City"
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
                      <FormLabel>Woreda</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Woreda"
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
                      <FormLabel>Kebele</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Kebele"
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
                      <FormLabel>House Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter House Number"
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
                      <FormLabel>Neighborhood</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Neighborhood"
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
                Father / Applicant
              </CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                <FormField
                  control={form.control}
                  name="applicantFather.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Full Name" {...field} />
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
                      <FormLabel>Birth Date or Age</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Birth Date or Age"
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
                      <FormLabel>Birth Place</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Birth Place" {...field} />
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
                      <FormLabel>Religion</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Religion" {...field} />
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
                      <FormLabel>Marital Status</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Marital Status" {...field} />
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
                      <FormLabel>Education Level</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Education Level" {...field} />
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
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Nationality" {...field} />
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
                      <FormLabel>Occupation Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Occupation Type" {...field} />
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
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Occupation" {...field} />
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
                      <FormLabel>Monthly Income</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          step={1}
                          min={0}
                          placeholder="Enter Monthly Income"
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
                      <FormLabel>Extra Income</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Extra Income" {...field} />
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
                      <FormLabel>Phone (Home)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Phone (Home)" {...field} />
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
                      <FormLabel>Phone (Mobile)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Phone (Mobile)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                Mother / Applicant
              </CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                <FormField
                  control={form.control}
                  name="applicantMother.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Full Name" {...field} />
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
                      <FormLabel>Birth Date or Age</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Birth Date or Age"
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
                      <FormLabel>Birth Place</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Birth Place" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* other mother fields mirror father's fields */}
                <FormField
                  control={form.control}
                  name="applicantMother.religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religion</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Religion" {...field} />
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
                      <FormLabel>Marital Status</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Marital Status" {...field} />
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
                      <FormLabel>Education Level</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Education Level" {...field} />
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
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Nationality" {...field} />
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
                      <FormLabel>Occupation Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Occupation Type" {...field} />
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
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Occupation" {...field} />
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
                      <FormLabel>Monthly Income</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          step={1}
                          min={0}
                          placeholder="Enter Monthly Income"
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
                      <FormLabel>Extra Income</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Extra Income" {...field} />
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
                      <FormLabel>Phone (Home)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Phone (Home)" {...field} />
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
                      <FormLabel>Phone (Mobile)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Phone (Mobile)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                Marriage Information
              </CardTitle>
              <div className="grid grid-cols-1 gap-4 mt-3">
                <FormField
                  control={form.control}
                  name="marriageInfo.marriageDateAndPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marriage Date and Place</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Marriage Date and Place"
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
                      <FormLabel>Marriage Duration</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Marriage Duration"
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
                      <FormLabel>Relationship Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Relationship Description"
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
                      <FormLabel>Conflict Resolution</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Conflict Resolution"
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
                      <FormLabel>Mutual Support</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Mutual Support"
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
                      <FormLabel>Big Decisions Making Experience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Big Decisions Making Experience"
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
                      <FormLabel>Financial Management</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Financial Management"
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
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
            >
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

export default Step1;
