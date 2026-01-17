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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

function Step2() {
  const router = useRouter();

  const { step2, setStep2 } = useHomeVisitFormStore();

  // Ensure arrays have at least one empty entry when initializing the form
  const initialValues = (step2 && (
    (step2.existingChildren && step2.existingChildren.length > 0) ||
    (step2.householdMembers && step2.householdMembers.length > 0) ||
    (step2.applicantParents && step2.applicantParents.length > 0)
  ))
    ? step2
    : {
        ...(step2 || {}),
        existingChildren: step2?.existingChildren && step2.existingChildren.length > 0 ? step2.existingChildren : [{ fullName: "", age: "", sex: "MALE", relation: "", educationOccupation: "", maritalStatus: "", address: "" }],
        householdMembers: step2?.householdMembers && step2.householdMembers.length > 0 ? step2.householdMembers : [{ fullName: "", age: "", sex: "MALE", relation: "", educationAndOccupation: "" }],
        applicantParents: step2?.applicantParents && step2.applicantParents.length > 0 ? step2.applicantParents : [{ fullName: "", age: "", sex: "MALE", relation: "", educationOccupation: "", addressAndLivingCondition: "" }],
      } as any;

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
                Family Background
              </CardTitle>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Father Side</h4>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {Object.entries({
                      parentsNames: "Parents Names",
                      addressIfAlive: "Address If Alive",
                      birthOrder: "Birth Order",
                      siblingsCount: "Siblings Count",
                      relationshipWithFamily: "Relationship With Family",
                      childhoodFamilyOccupation: "Childhood Family Occupation",
                      childhoodExperience: "Childhood Experience",
                      childhoodBehavior: "Childhood Behavior",
                      workExperience: "Work Experience",
                      attitudeToWork: "Attitude To Work",
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
                                placeholder={`Enter ${label}`}
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
                  <h4 className="font-medium">Mother Side</h4>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {Object.entries({
                      parentsNames: "Parents Names",
                      addressIfAlive: "Address If Alive",
                      birthOrder: "Birth Order",
                      siblingsCount: "Siblings Count",
                      relationshipWithFamily: "Relationship With Family",
                      childhoodFamilyOccupation: "Childhood Family Occupation",
                      childhoodExperience: "Childhood Experience",
                      childhoodBehavior: "Childhood Behavior",
                      workExperience: "Work Experience",
                      attitudeToWork: "Attitude To Work",
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
                                placeholder={`Enter ${label}`}
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
                  <h4 className="font-medium">Spouse Evaluation Together</h4>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {Object.entries({
                      strengthAndWeaknesses: "Strengths and Weaknesses",
                      relationShipWithChildren: "Relationship With Children",
                      LifeGoalsAsGuardian: "Life Goals As Guardian",
                      spareTimeActivities: "Spare Time Activities",
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
                                placeholder={`Enter ${label}`}
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
                  Existing Children
                </CardTitle>
                <div className="space-y-4">
                  {existingChildrenArray.fields.map((f, idx) => (
                    <div key={f.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">
                          Child #{idx + 1}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => existingChildrenArray.remove(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`existingChildren.${idx}.fullName` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Full Name"
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
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter Age" {...field} />
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
                          name={`existingChildren.${idx}.relation` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relation</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Relation"
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
                              <FormLabel>Education / Occupation</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Education or Occupation"
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
                              <FormLabel>Marital Status</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Marital Status"
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
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter Address" {...field} />
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
                    Add Child
                  </Button>
                </div>
              </Card>

              {/* Applicant Parents */}
              <Card className="flex flex-col space-y-4 py-6 px-4">
                <CardTitle className="text-lg font-semibold">
                  Applicant Parents
                </CardTitle>
                <div className="space-y-4">
                  {applicantParentsArray.fields.map((f, idx) => (
                    <div key={f.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">
                          Person #{idx + 1}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applicantParentsArray.remove(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`applicantParents.${idx}.fullName` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Full Name"
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
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter Age" {...field} />
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
                          name={`applicantParents.${idx}.relation` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relation</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Relation"
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
                              <FormLabel>Education / Occupation</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Education / Occupation"
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
                                Address and Living Condition
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Address and Living Condition"
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
                    Add Person
                  </Button>
                </div>
              </Card>

              {/* Household Members */}
              <Card className="flex flex-col space-y-4 py-6 px-4">
                <CardTitle className="text-lg font-semibold">
                  Household Members
                </CardTitle>
                <div className="space-y-4">
                  {householdMembersArray.fields.map((f, idx) => (
                    <div key={f.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">
                          Member #{idx + 1}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => householdMembersArray.remove(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`householdMembers.${idx}.fullName` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Full Name"
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
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter Age" {...field} />
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
                          name={`householdMembers.${idx}.relation` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relation</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Relation"
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
                              <FormLabel>Education and Occupation</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Education and Occupation"
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
                    Add Member
                  </Button>
                </div>
              </Card>
            </div>
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

export default Step2;
