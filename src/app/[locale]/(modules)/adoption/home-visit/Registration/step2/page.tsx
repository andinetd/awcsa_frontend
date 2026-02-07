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
  Step2Schema,
  Step2SchemaType,
} from "@/schemas/home-visit-steps-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useHomeVisitFormStore } from "@/stores/home-visit-store";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

function Step2() {
  const router = useRouter();
  const t = useTranslations("adoption");

  const { step2, setStep2 } = useHomeVisitFormStore();

  // Ensure arrays have at least one empty entry when initializing the form
  const initialValues =
    step2 &&
    ((step2.existingChildren && step2.existingChildren.length > 0) ||
      (step2.householdMembers && step2.householdMembers.length > 0) ||
      (step2.applicantParents && step2.applicantParents.length > 0))
      ? step2
      : ({
          ...(step2 || {}),
          existingChildren:
            step2?.existingChildren && step2.existingChildren.length > 0
              ? step2.existingChildren
              : [
                  {
                    fullName: "",
                    age: "",
                    sex: "MALE",
                    relation: "",
                    educationOccupation: "",
                    maritalStatus: "",
                    address: "",
                  },
                ],
          householdMembers:
            step2?.householdMembers && step2.householdMembers.length > 0
              ? step2.householdMembers
              : [
                  {
                    fullName: "",
                    age: "",
                    sex: "MALE",
                    relation: "",
                    educationAndOccupation: "",
                  },
                ],
          applicantParents:
            step2?.applicantParents && step2.applicantParents.length > 0
              ? step2.applicantParents
              : [
                  {
                    fullName: "",
                    age: "",
                    sex: "MALE",
                    relation: "",
                    educationOccupation: "",
                    addressAndLivingCondition: "",
                  },
                ],
        } as any);

  const form = useForm<Step2SchemaType>({
    resolver: zodResolver(Step2Schema),
    defaultValues: initialValues,
  });

  async function handleBack() {
    setStep2(form.getValues());
    router.back();
  }

  async function onSubmit(values: Step2SchemaType) {
    setStep2(values);
    router.push("/adoption/home-visit/Registration/step3");
  }

  // field arrays for dynamic lists
  const existingChildrenArray = useFieldArray({
    control: form.control,
    name: "existingChildren" as const,
  });

  const householdMembersArray = useFieldArray({
    control: form.control,
    name: "householdMembers" as const,
  });

  const applicantParentsArray = useFieldArray({
    control: form.control,
    name: "applicantParents" as const,
  });

  return (
    <div className="mx-auto max-w-7xl mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                {t("homeVisitRegistration.step2.familyBackground.title")}
              </CardTitle>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">
                    {t(
                      "homeVisitRegistration.step2.familyBackground.fatherSide",
                    )}
                  </h4>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {Object.entries({
                      parentsNames: t(
                        "homeVisitRegistration.step2.familyBackground.fields.parentsNames",
                      ),
                      addressIfAlive: t(
                        "homeVisitRegistration.step2.familyBackground.fields.addressIfAlive",
                      ),
                      birthOrder: t(
                        "homeVisitRegistration.step2.familyBackground.fields.birthOrder",
                      ),
                      siblingsCount: t(
                        "homeVisitRegistration.step2.familyBackground.fields.siblingsCount",
                      ),
                      relationshipWithFamily: t(
                        "homeVisitRegistration.step2.familyBackground.fields.relationshipWithFamily",
                      ),
                      childhoodFamilyOccupation: t(
                        "homeVisitRegistration.step2.familyBackground.fields.childhoodFamilyOccupation",
                      ),
                      childhoodExperience: t(
                        "homeVisitRegistration.step2.familyBackground.fields.childhoodExperience",
                      ),
                      childhoodBehavior: t(
                        "homeVisitRegistration.step2.familyBackground.fields.childhoodBehavior",
                      ),
                      workExperience: t(
                        "homeVisitRegistration.step2.familyBackground.fields.workExperience",
                      ),
                      attitudeToWork: t(
                        "homeVisitRegistration.step2.familyBackground.fields.attitudeToWork",
                      ),
                    }).map(([key, label]) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={`familyBackground.fatherSide.${key}` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t(
                                  "homeVisitRegistration.step1.marriageInfo.placeholders.relationshipDescription",
                                ).replace("Relationship Description", label)} // Hacky placeholder or just use label
                                rows={2}
                                {...(field as any)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">
                    {t(
                      "homeVisitRegistration.step2.familyBackground.motherSide",
                    )}
                  </h4>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {Object.entries({
                      parentsNames: t(
                        "homeVisitRegistration.step2.familyBackground.fields.parentsNames",
                      ),
                      addressIfAlive: t(
                        "homeVisitRegistration.step2.familyBackground.fields.addressIfAlive",
                      ),
                      birthOrder: t(
                        "homeVisitRegistration.step2.familyBackground.fields.birthOrder",
                      ),
                      siblingsCount: t(
                        "homeVisitRegistration.step2.familyBackground.fields.siblingsCount",
                      ),
                      relationshipWithFamily: t(
                        "homeVisitRegistration.step2.familyBackground.fields.relationshipWithFamily",
                      ),
                      childhoodFamilyOccupation: t(
                        "homeVisitRegistration.step2.familyBackground.fields.childhoodFamilyOccupation",
                      ),
                      childhoodExperience: t(
                        "homeVisitRegistration.step2.familyBackground.fields.childhoodExperience",
                      ),
                      childhoodBehavior: t(
                        "homeVisitRegistration.step2.familyBackground.fields.childhoodBehavior",
                      ),
                      workExperience: t(
                        "homeVisitRegistration.step2.familyBackground.fields.workExperience",
                      ),
                      attitudeToWork: t(
                        "homeVisitRegistration.step2.familyBackground.fields.attitudeToWork",
                      ),
                    }).map(([key, label]) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={`familyBackground.motherSide.${key}` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={label}
                                rows={2}
                                {...(field as any)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">
                    {t(
                      "homeVisitRegistration.step2.familyBackground.spouseEvaluation",
                    )}
                  </h4>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {Object.entries({
                      strengthAndWeaknesses: t(
                        "homeVisitRegistration.step2.familyBackground.fields.strengthsAndWeaknesses",
                      ),
                      relationShipWithChildren: t(
                        "homeVisitRegistration.step2.familyBackground.fields.relationshipWithChildren",
                      ),
                      LifeGoalsAsGuardian: t(
                        "homeVisitRegistration.step2.familyBackground.fields.lifeGoalsAsGuardian",
                      ),
                      spareTimeActivities: t(
                        "homeVisitRegistration.step2.familyBackground.fields.spareTimeActivities",
                      ),
                    }).map(([key, label]) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={
                          `familyBackground.spouseEvaluationTogether.${key}` as any
                        }
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={label}
                                rows={2}
                                {...(field as any)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Existing Children */}

            <div className="space-y-3">
              <Card className="flex flex-col space-y-4 py-6 px-4">
                <CardTitle className="text-lg font-semibold">
                  {t("homeVisitRegistration.step2.existingChildren.title")}
                </CardTitle>
                <div className="space-y-4">
                  {existingChildrenArray.fields.map((f, idx) => (
                    <div key={f.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">
                          {t(
                            "homeVisitRegistration.step2.existingChildren.childNumber",
                            { number: idx + 1 },
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => existingChildrenArray.remove(idx)}
                        >
                          {t("homeVisitRegistration.step2.common.remove")}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`existingChildren.${idx}.fullName` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  "homeVisitRegistration.step2.common.fullName",
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.fullName",
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
                          name={`existingChildren.${idx}.age` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("homeVisitRegistration.step2.common.age")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.age",
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
                          name={`existingChildren.${idx}.sex` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("homeVisitRegistration.step2.common.gender")}
                              </FormLabel>
                              <FormControl>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-between text-sm text-gray-800"
                                    >
                                      {field.value
                                        ? field.value === "MALE"
                                          ? t(
                                              "homeVisitRegistration.step2.common.male",
                                            )
                                          : t(
                                              "homeVisitRegistration.step2.common.female",
                                            )
                                        : t(
                                            "homeVisitRegistration.step2.common.selectGender",
                                          )}
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
                                      {t(
                                        "homeVisitRegistration.step2.common.male",
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onSelect={() => field.onChange("FEMALE")}
                                    >
                                      {t(
                                        "homeVisitRegistration.step2.common.female",
                                      )}
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
                          name={`existingChildren.${idx}.relation` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  "homeVisitRegistration.step2.common.relation",
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.relation",
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
                          name={
                            `existingChildren.${idx}.educationOccupation` as const
                          }
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  "homeVisitRegistration.step2.common.educationOccupation",
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.educationOccupation",
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
                          name={
                            `existingChildren.${idx}.maritalStatus` as const
                          }
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  "homeVisitRegistration.step2.common.maritalStatus",
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.maritalStatus",
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
                          name={`existingChildren.${idx}.address` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  "homeVisitRegistration.step2.common.address",
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.address",
                                  )}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      existingChildrenArray.append({
                        fullName: "",
                        age: "",
                        sex: "MALE",
                        relation: "",
                        educationOccupation: "",
                        maritalStatus: "",
                        address: "",
                      })
                    }
                  >
                    {t("homeVisitRegistration.step2.existingChildren.addChild")}
                  </Button>
                </div>
              </Card>

              {/* Applicant Parents */}
              <Card className="flex flex-col space-y-4 py-6 px-4">
                <CardTitle className="text-lg font-semibold">
                  {t("homeVisitRegistration.step2.applicantParents.title")}
                </CardTitle>
                <div className="space-y-4">
                  {applicantParentsArray.fields.map((f, idx) => (
                    <div key={f.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">
                          {t(
                            "homeVisitRegistration.step2.applicantParents.personNumber",
                            { number: idx + 1 },
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applicantParentsArray.remove(idx)}
                        >
                          {t("homeVisitRegistration.step2.common.remove")}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`applicantParents.${idx}.fullName` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  "homeVisitRegistration.step2.common.fullName",
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.fullName",
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
                          name={`applicantParents.${idx}.age` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("homeVisitRegistration.step2.common.age")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.age",
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
                          name={`applicantParents.${idx}.sex` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("homeVisitRegistration.step2.common.gender")}
                              </FormLabel>
                              <FormControl>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-between text-sm text-gray-800"
                                    >
                                      {field.value
                                        ? field.value === "MALE"
                                          ? t(
                                              "homeVisitRegistration.step2.common.male",
                                            )
                                          : t(
                                              "homeVisitRegistration.step2.common.female",
                                            )
                                        : t(
                                            "homeVisitRegistration.step2.common.selectGender",
                                          )}
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
                                      {t(
                                        "homeVisitRegistration.step2.common.male",
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onSelect={() => field.onChange("FEMALE")}
                                    >
                                      {t(
                                        "homeVisitRegistration.step2.common.female",
                                      )}
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
                          name={`applicantParents.${idx}.relation` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  "homeVisitRegistration.step2.common.relation",
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.relation",
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
                          name={
                            `applicantParents.${idx}.educationOccupation` as const
                          }
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  "homeVisitRegistration.step2.common.educationOccupation",
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.educationOccupation",
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
                          name={
                            `applicantParents.${idx}.addressAndLivingCondition` as const
                          }
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  "homeVisitRegistration.step2.applicantParents.addressAndLivingCondition",
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.applicantParents.addressAndLivingCondition",
                                  )}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      applicantParentsArray.append({
                        fullName: "",
                        age: "",
                        sex: "MALE",
                        relation: "",
                        educationOccupation: "",
                        addressAndLivingCondition: "",
                      })
                    }
                  >
                    {t(
                      "homeVisitRegistration.step2.applicantParents.addPerson",
                    )}
                  </Button>
                </div>
              </Card>

              {/* Household Members */}
              <Card className="flex flex-col space-y-4 py-6 px-4">
                <CardTitle className="text-lg font-semibold">
                  {t("homeVisitRegistration.step2.householdMembers.title")}
                </CardTitle>
                <div className="space-y-4">
                  {householdMembersArray.fields.map((f, idx) => (
                    <div key={f.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">
                          {t(
                            "homeVisitRegistration.step2.householdMembers.memberNumber",
                            { number: idx + 1 },
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => householdMembersArray.remove(idx)}
                        >
                          {t("homeVisitRegistration.step2.common.remove")}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`householdMembers.${idx}.fullName` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  "homeVisitRegistration.step2.common.fullName",
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.fullName",
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
                          name={`householdMembers.${idx}.age` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("homeVisitRegistration.step2.common.age")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.age",
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
                          name={`householdMembers.${idx}.sex` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("homeVisitRegistration.step2.common.gender")}
                              </FormLabel>
                              <FormControl>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-between text-sm text-gray-800"
                                    >
                                      {field.value
                                        ? field.value === "MALE"
                                          ? t(
                                              "homeVisitRegistration.step2.common.male",
                                            )
                                          : t(
                                              "homeVisitRegistration.step2.common.female",
                                            )
                                        : t(
                                            "homeVisitRegistration.step2.common.selectGender",
                                          )}
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
                                      {t(
                                        "homeVisitRegistration.step2.common.male",
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onSelect={() => field.onChange("FEMALE")}
                                    >
                                      {t(
                                        "homeVisitRegistration.step2.common.female",
                                      )}
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
                          name={`householdMembers.${idx}.relation` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  "homeVisitRegistration.step2.common.relation",
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.common.relation",
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
                          name={
                            `householdMembers.${idx}.educationAndOccupation` as const
                          }
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  "homeVisitRegistration.step2.householdMembers.educationAndOccupation",
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "homeVisitRegistration.step2.householdMembers.educationAndOccupation",
                                  )}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      householdMembersArray.append({
                        fullName: "",
                        age: "",
                        sex: "MALE",
                        relation: "",
                        educationAndOccupation: "",
                      })
                    }
                  >
                    {t(
                      "homeVisitRegistration.step2.householdMembers.addMember",
                    )}
                  </Button>
                </div>
              </Card>
            </div>
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

export default Step2;
