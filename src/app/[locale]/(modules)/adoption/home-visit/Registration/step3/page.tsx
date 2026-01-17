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
  Step3Schema,
  Step3SchemaType,
} from "@/schemas/home-visit-steps-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useHomeVisitFormStore } from "@/stores/home-visit-store";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

function Step3() {
  const router = useRouter();

  const { step3, setStep3, reset } = useHomeVisitFormStore();

  const form = useForm<Step3SchemaType>({
    resolver: zodResolver(Step3Schema),
    defaultValues: step3 || {},
  });

  async function handleBack() {
    setStep3(form.getValues());
    router.back();
  }

  async function onSubmit(values: Step3SchemaType) {
    setStep3(values);
    router.push("/adoption/home-visit/Registration/step4");
  }

  return (
    <div className="mx-auto max-w-7xl mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                Life Style & Social Relations
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                {[
                  ["readinessForCare", "Readiness For Care"],
                  ["familyLawsAndRules", "Family Laws and Rules"],
                  ["dailyLifeRoutine", "Daily Life Routine"],
                  ["familyWorkDistribution", "Family Work Distribution"],
                  ["familyTime", "Family Time"],
                  ["childLifeParticipation", "Child Life Participation"],
                  ["holidayTimeActivities", "Holiday Time Activities"],
                  ["socialLifeAttitude", "Social Life Attitude"],
                  ["communityInvolvement", "Community Involvement"],
                  ["changeAfterAdoption", "Change After Adoption"],
                ].map(([key, label]) => (
                  <FormField
                    key={String(key)}
                    control={form.control}
                    name={`lifeStyleAndSocialRelations.${String(key)}` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`Enter ${label}`}
                            rows={3}
                            {...(field as any)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </Card>

            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                Parenting Experience
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="parentingExperience.hasExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Has Parenting Experience?</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? "yes" : "no"}
                          onValueChange={(v) => field.onChange(v === "yes")}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentingExperience.disciplineMethods"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discipline Methods</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Discipline Methods"
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
                  name="parentingExperience.goodMannersApproach"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Good Manners Approach</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Good Manners Approach"
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
                  name="parentingExperience.improvementAreas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Improvement Areas</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Improvement Areas"
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
                Adoption Interest
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="adoptionInterest.meaningOfAdoption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meaning Of Adoption</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Meaning Of Adoption"
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
                  name="adoptionInterest.reasonForAdoption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason For Adoption</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Reason For Adoption"
                          rows={3}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-2 border rounded">
                  <h4 className="font-medium">Preferred Child</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <FormField
                      control={form.control}
                      name="adoptionInterest.preferredChild.quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              inputMode="numeric"
                              step={1}
                              min={0}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value)
                                )
                              }
                              placeholder="Enter Quantity"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adoptionInterest.preferredChild.sex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between text-sm text-gray-800"
                                >
                                  {field.value
                                    ? field.value === "MALE"
                                      ? "Male"
                                      : "Female"
                                    : "Select gender"}
                                  <ChevronDown />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="start"
                                className="w-full"
                              >
                                <DropdownMenuItem
                                  onSelect={() => field.onChange("MALE")}
                                >
                                  Male
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={() => field.onChange("FEMALE")}
                                >
                                  Female
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adoptionInterest.preferredChild.ageRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age Range</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Age Range"
                              {...(field as any)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adoptionInterest.preferredChild.healthCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Health Condition</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Health Condition"
                              {...(field as any)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adoptionInterest.preferredChild.reasonForChoice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason For Choice</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter Reason For Choice"
                              rows={2}
                              {...(field as any)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                Existing Children & Family Members
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="existingChildrenAndFamilyMembers.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Name" {...(field as any)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="existingChildrenAndFamilyMembers.behavior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Behavior</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Behavior"
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
                  name="existingChildrenAndFamilyMembers.adoptionAttitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adoption Attitude</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Adoption Attitude"
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
                  name="existingChildrenAndFamilyMembers.futureAdoptionContributions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Future Adoption Contributions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Future Adoption Contributions"
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
                  name="existingChildrenAndFamilyMembers.mistakeAttitudesOfFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mistake Attitudes Of Family</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Mistake Attitudes Of Family"
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

export default Step3;
