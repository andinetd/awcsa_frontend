"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  combinedRegistrationSchema,
  CombinedRegistrationSchemaType,
} from "@/schemas/support-service";
import { useRegisterCombinedMutation } from "@/hooks/support";
import ServiceTypeSelect from "./service-type-select";

export default function QuickRegistrationForm() {
  const registerCombinedMutation = useRegisterCombinedMutation();

  const form = useForm<CombinedRegistrationSchemaType>({
    resolver: zodResolver(combinedRegistrationSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      cityIdNumber: "",
      phoneNumber: "",
      educationLevel: "",
      occupation: "",
      serviceTypeId: 0,
      provider: "",
      amountOrQuantity: "",
      dateProvided: new Date().toISOString().split("T")[0],
      subCity: "",
      woreda: "",
      facilitatorCityId: "",
      remark: "",
    },
  });

  function onSubmit(values: CombinedRegistrationSchemaType) {
    const payload = {
      ...values,
      remark: values.remark || "",
    };
    registerCombinedMutation.mutate(payload, {
      onSuccess: () => {
        form.reset();
        toast.success("Client and Support Service registered successfully");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to register. Please try again.");
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Woman Profile Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Woman Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cityIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City ID Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AA-12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="09..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter level" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter occupation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Support Service Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Support Details
            </h3>

            <FormField
              control={form.control}
              name="serviceTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <FormControl>
                    <ServiceTypeSelect
                      value={field.value.toString()}
                      onValueChange={(val) => field.onChange(parseInt(val))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter provider" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amountOrQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount/Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 500 ETB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dateProvided"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Provided</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter sub-city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Woreda</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter woreda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="facilitatorCityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facilitator City ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter facilitator ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter additional notes..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end border-t pt-6">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto px-12"
            disabled={registerCombinedMutation.isPending}
          >
            {registerCombinedMutation.isPending
              ? "Registering..."
              : "Register Woman & Support"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
