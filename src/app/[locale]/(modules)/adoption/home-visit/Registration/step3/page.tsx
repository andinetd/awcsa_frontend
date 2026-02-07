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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

function Step3() {
  const router = useRouter();
  const t = useTranslations("adoption");

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
                {t("homeVisitRegistration.step3.lifeStyle.title")}
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                {[
                  [
                    "readinessForCare",
                    t(
                      "homeVisitRegistration.step3.lifeStyle.fields.readinessForCare",
                    ),
                  ],
                  [
                    "familyLawsAndRules",
                    t(
                      "homeVisitRegistration.step3.lifeStyle.fields.familyLawsAndRules",
                    ),
                  ],
                  [
                    "dailyLifeRoutine",
                    t(
                      "homeVisitRegistration.step3.lifeStyle.fields.dailyLifeRoutine",
                    ),
                  ],
                  [
                    "familyWorkDistribution",
                    t(
                      "homeVisitRegistration.step3.lifeStyle.fields.familyWorkDistribution",
                    ),
                  ],
                  [
                    "familyTime",
                    t(
                      "homeVisitRegistration.step3.lifeStyle.fields.familyTime",
                    ),
                  ],
                  [
                    "childLifeParticipation",
                    t(
                      "homeVisitRegistration.step3.lifeStyle.fields.childLifeParticipation",
                    ),
                  ],
                  [
                    "holidayTimeActivities",
                    t(
                      "homeVisitRegistration.step3.lifeStyle.fields.holidayTimeActivities",
                    ),
                  ],
                  [
                    "socialLifeAttitude",
                    t(
                      "homeVisitRegistration.step3.lifeStyle.fields.socialLifeAttitude",
                    ),
                  ],
                  [
                    "communityInvolvement",
                    t(
                      "homeVisitRegistration.step3.lifeStyle.fields.communityInvolvement",
                    ),
                  ],
                  [
                    "changeAfterAdoption",
                    t(
                      "homeVisitRegistration.step3.lifeStyle.fields.changeAfterAdoption",
                    ),
                  ],
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
                            placeholder={label}
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
                {t("homeVisitRegistration.step3.parenting.title")}
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="parentingExperience.hasExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step3.parenting.hasExperience",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? "yes" : "no"}
                          onValueChange={(v) => field.onChange(v === "yes")}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t(
                                "homeVisitRegistration.step3.parenting.select",
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">
                              {t("homeVisitRegistration.step3.parenting.yes")}
                            </SelectItem>
                            <SelectItem value="no">
                              {t("homeVisitRegistration.step3.parenting.no")}
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
                  name="parentingExperience.disciplineMethods"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step3.parenting.disciplineMethods",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step3.parenting.disciplineMethods",
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
                  name="parentingExperience.goodMannersApproach"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step3.parenting.goodMannersApproach",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step3.parenting.goodMannersApproach",
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
                  name="parentingExperience.improvementAreas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step3.parenting.improvementAreas",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step3.parenting.improvementAreas",
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
                {t("homeVisitRegistration.step3.adoptionInterest.title")}
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="adoptionInterest.meaningOfAdoption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step3.adoptionInterest.meaningOfAdoption",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step3.adoptionInterest.meaningOfAdoption",
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
                  name="adoptionInterest.reasonForAdoption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step3.adoptionInterest.reasonForAdoption",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step3.adoptionInterest.reasonForAdoption",
                          )}
                          rows={3}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-2 border rounded">
                  <h4 className="font-medium">
                    {t(
                      "homeVisitRegistration.step3.adoptionInterest.preferredChild.title",
                    )}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <FormField
                      control={form.control}
                      name="adoptionInterest.preferredChild.quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "homeVisitRegistration.step3.adoptionInterest.preferredChild.quantity",
                            )}
                          </FormLabel>
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
                                    : Number(e.target.value),
                                )
                              }
                              placeholder={t(
                                "homeVisitRegistration.step3.adoptionInterest.preferredChild.quantity",
                              )}
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
                                  {t("homeVisitRegistration.step2.common.male")}
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
                      name="adoptionInterest.preferredChild.ageRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "homeVisitRegistration.step3.adoptionInterest.preferredChild.ageRange",
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                "homeVisitRegistration.step3.adoptionInterest.preferredChild.ageRange",
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
                      name="adoptionInterest.preferredChild.healthCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "homeVisitRegistration.step3.adoptionInterest.preferredChild.healthCondition",
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                "homeVisitRegistration.step3.adoptionInterest.preferredChild.healthCondition",
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
                      name="adoptionInterest.preferredChild.reasonForChoice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "homeVisitRegistration.step3.adoptionInterest.preferredChild.reasonForChoice",
                            )}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t(
                                "homeVisitRegistration.step3.adoptionInterest.preferredChild.reasonForChoice",
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
                </div>
              </div>
            </Card>

            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                {t("homeVisitRegistration.step3.familyMembers.title")}
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="existingChildrenAndFamilyMembers.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("homeVisitRegistration.step3.familyMembers.name")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "homeVisitRegistration.step3.familyMembers.name",
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
                  name="existingChildrenAndFamilyMembers.behavior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step3.familyMembers.behavior",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step3.familyMembers.behavior",
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
                  name="existingChildrenAndFamilyMembers.adoptionAttitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step3.familyMembers.adoptionAttitude",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step3.familyMembers.adoptionAttitude",
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
                  name="existingChildrenAndFamilyMembers.futureAdoptionContributions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step3.familyMembers.futureContributions",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step3.familyMembers.futureContributions",
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
                  name="existingChildrenAndFamilyMembers.mistakeAttitudes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "homeVisitRegistration.step3.familyMembers.mistakeAttitudes",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "homeVisitRegistration.step3.familyMembers.mistakeAttitudes",
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

export default Step3;
