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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  beneficiaryRegistrationSchema,
  BeneficiaryRegistrationSchemaType,
} from "@/schemas/beneficiaries";
import { useRegisterBeneficiaryMutation } from "@/hooks/beneficiaries";
import { BeneficiaryType } from "@/api/beneficiaries/types";

interface RegistrationFormProps {
  type: BeneficiaryType;
}

export default function RegistrationForm({ type }: RegistrationFormProps) {
  const [open, setOpen] = React.useState(false);
  const registerMutation = useRegisterBeneficiaryMutation();

  const form = useForm<BeneficiaryRegistrationSchemaType>({
    resolver: zodResolver(beneficiaryRegistrationSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      cityIdNumber: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      educationLevel: "",
      occupation: "",
      disabilityType: "",
      disabilityLevel: "",
      cause: "",
      familyMembersCount: 0,
      type,
    },
  });

  const onSubmit = (values: BeneficiaryRegistrationSchemaType) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        toast.success(
          `${
            type === "DISABLED" ? "Disabled person" : "Elderly person"
          } registered successfully`
        );
        form.reset();
        setOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Registration failed");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Register New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-lexend">
            Register{" "}
            {type === "DISABLED" ? "Person with Disability" : "Elderly Person"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Basic Information
                </h3>
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
                {type === "DISABLED" && (
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  {type === "DISABLED"
                    ? "Disability Details"
                    : "Elderly Details"}
                </h3>
                {type === "DISABLED" && (
                  <>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="disabilityType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disability Type</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Physical, Visual"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="disabilityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disability Level</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MILD">Mild</SelectItem>
                                <SelectItem value="MODERATE">
                                  Moderate
                                </SelectItem>
                                <SelectItem value="SEVERE">Severe</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cause"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cause of Disability</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Accident, Birth"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

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
                <FormField
                  control={form.control}
                  name="familyMembersCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family Members Count</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Register Beneficiary
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
