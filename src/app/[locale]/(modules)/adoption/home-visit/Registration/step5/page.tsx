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
  Step5Schema,
  Step5SchemaType,
} from "@/schemas/home-visit-steps-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useHomeVisitFormStore } from "@/stores/home-visit-store";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { getAggregatedHomeVisitData } from "@/lib/aggregateHomeVisitData";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "@/lib/base-url";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

function Step5() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const { step5, setStep5, reset, serviceDataId } =
    useHomeVisitFormStore();

  // Ensure there's always at least one empty witness entry when initializing the form
  const initialValues =
    step5 && step5.witnesses && step5.witnesses.length > 0
      ? step5
      : ({
          ...(step5 || {}),
          witnesses: [
            { fullName: "", relationToApplicants: "", phoneNumber: "" },
          ],
        } as any);

  const form = useForm<Step5SchemaType>({
    resolver: zodResolver(Step5Schema),
    defaultValues: initialValues,
  });

  const {
    fields: witnessFields,
    append: appendWitness,
    remove: removeWitness,
  } = useFieldArray({
    control: form.control,
    name: "witnesses",
  });

  async function handleBack() {
    setStep5(form.getValues());
    router.back();
  }

  async function onSubmit(values: Step5SchemaType) {
    setStep5(values);
    const payload = getAggregatedHomeVisitData();

    console.log("Submitting aggregated payload:", payload);
    try {
      await axios.post(
        `${BASE_URL}/adoption/home-visit/${serviceDataId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Home Visit Feedback submitted successfully");
      router.push("/adoption/adoption-requests");
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);

      // extract a useful message from AxiosError if possible
      let message = "Failed to submit home visit feedback. Please try again.";

      if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<any>;
        // prefer server-provided message shape
        const respData = axiosErr.response?.data;
        if (respData) {
          if (typeof respData === "string") {
            message = respData;
          } else if (respData.message) {
            message = String(respData.message);
          } else if (respData.errors) {
            try {
              // if errors is array or object, make it readable
              if (Array.isArray(respData.errors)) {
                message = respData.errors
                  .map((e: any) => e.message || JSON.stringify(e))
                  .join("; ");
              } else {
                message = JSON.stringify(respData.errors);
              }
            } catch {
              message = String(respData.errors);
            }
          } else {
            try {
              message = JSON.stringify(respData);
            } catch {
              message = String(respData);
            }
          }
        } else if (axiosErr.message) {
          message = axiosErr.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      // show the extracted message in the toast
      toast.error(message);
      return;
    }
  }

  return (
    <div className="mx-auto max-w-7xl mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="flex flex-col space-y-4 py-6 px-4">
              <CardTitle className="text-lg font-semibold">
                Social Worker Evaluation
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="socialWorkerEvaluation.comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Comment"
                          rows={3}
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="socialWorkerEvaluation.preparedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prepared By</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Prepared By"
                            {...(field as any)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialWorkerEvaluation.preparedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prepared Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            placeholder="Enter Prepared Date"
                            {...(field as any)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="socialWorkerEvaluation.approvedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approved By</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Approved By"
                            {...(field as any)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialWorkerEvaluation.approvedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approved Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            placeholder="Enter Approved Date"
                            {...(field as any)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="socialWorkerEvaluation.signature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signature</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Signature"
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
                Adoption Applicant - Father
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="adoptionApplicantFather.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Full Name"
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adoptionApplicantFather.date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter Date"
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adoptionApplicantFather.signature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signature</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Signature"
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
                Adoption Applicant - Mother
              </CardTitle>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="adoptionApplicantMother.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Full Name"
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adoptionApplicantMother.date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter Date"
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adoptionApplicantMother.signature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signature</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Signature"
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
              <CardTitle className="text-lg font-semibold">Witnesses</CardTitle>
              <div className="space-y-3">
                {witnessFields.map((w, idx) => (
                  <div key={w.id} className="p-3 border rounded">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name={`witnesses.${idx}.fullName` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter Full Name"
                                {...(field as any)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`witnesses.${idx}.relationToApplicants` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relation To Applicants</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter Relation"
                                {...(field as any)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`witnesses.${idx}.phoneNumber` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter Phone Number"
                                {...(field as any)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeWitness(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <div>
                  <Button
                    type="button"
                    onClick={() =>
                      appendWitness({
                        fullName: "",
                        relationToApplicants: "",
                        phoneNumber: "",
                      })
                    }
                  >
                    Add Witness
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          {/* Submit Button */}
          <div className="flex justify-between mt-4">
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button type="submit" className="px-8">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Step5;
