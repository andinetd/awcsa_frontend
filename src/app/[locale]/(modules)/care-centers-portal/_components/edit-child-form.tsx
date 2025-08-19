"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardTitle } from "@/components/ui/card";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  NewChildformSchema,
  type NewChildformSchemaType,
} from "@/schemas/new-child-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

interface EditChildFormProps {
  childId: string;
}

export default function EditChildForm({ childId }: EditChildFormProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const router = useRouter();

  const form = useForm<NewChildformSchemaType>({
    resolver: zodResolver(NewChildformSchema),
    defaultValues: {
      age: 0,
    },
  });

  // TODO: Fetch existing child data and populate form
  useEffect(() => {
    const existingData = {
      name_by_care_center: decodeURIComponent(childId),
      name_by_family: "John Smith",
      father_name: "Michael Smith",
      age: 8,
      gender: "male" as const,
      admitance_reason: "Found abandoned near the market area",
      found_address: "Central Market",
      found_subcity: "Addis Ketema",
      found_woreda: "03",
      found_date: new Date("2024-01-15"),
      additional_information: "Child was found in good health condition",
      child_founder_name: "Ahmed Hassan",
      child_founder_address: "Merkato Area",
      child_founder_subcity: "Addis Ketema",
      child_found_woreda: "03",
      child_founder_house_no: 123,
      child_founder_phone: "+251911234567",
      officer_name: "Officer Bekele Tadesse",
      officer_responsibility: "Child Protection Officer",
      officer_address: "Police Station 5",
      officer_subcity: "Addis Ketema",
      officer_woreda: "03",
      officer_phone: "+251911987654",
      officer_id_no: "ID123456789",
      care_center_worker_name: "Sister Mary",
      care_center_worker_responsibility: "Child Care Coordinator",
      care_center_worker_address: "Hope Care Center",
      care_center_worker_subcity: "Addis Ketema",
      care_center_worker_woreda: "03",
      care_center_worker_phone: "+251911555666",
      care_center_worker_id_no: "CC987654321",
      health_officer_1_name: "Dr. Almaz Tesfaye",
      heallth_officer_2_name: "Dr. Dawit Kebede",
    };

    form.reset(existingData);
    setDate(existingData.found_date);
  }, [childId, form]);

  async function onSubmit(values: NewChildformSchemaType) {
    console.log("Updating child: ", { values });
    // TODO: Implement API call to update child
    // After successful submission, redirect back to view page
    router.push(`/care-centers-portal/child/${childId}/view`);
  }

  return (
    <div className="mx-auto max-w-5xl mt-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/care-centers-portal/child/${childId}/view`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Edit Child Information</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <Card className="flex flex-col space-y-10 py-8 px-5">
            <CardTitle className="text-lg font-semibold">
              Basic Information
            </CardTitle>

            {/* Name Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="name_by_family"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Given by Family)</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_by_care_center"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Given by Care Center) *</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="father_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Father's Name{" "}
                      <span className="text-muted-foreground text-sm">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <FormControl>
                      <Select
                        name="gender"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const stringValue = e.target.value;
                          const numberValue =
                            stringValue === "" ? null : Number(stringValue);
                          field.onChange(numberValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Admitance Reason */}
            <FormField
              control={form.control}
              name="admitance_reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Admission</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the reason for admission..."
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="found_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place Found</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="found_subcity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub City</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="found_woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Woreda</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date Found */}
            <FormField
              control={form.control}
              name="found_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Found *</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-between w-full font-normal bg-transparent"
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Select date"}
                          <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          {...field}
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            setDate(date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Info */}
            <FormField
              control={form.control}
              name="additional_information"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any extra information..."
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <Card className="flex flex-col space-y-10 py-8 px-5">
            <CardTitle className="text-lg font-semibold">
              Child Founder Information
            </CardTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="child_founder_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founder Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="child_founder_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founder Address</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="child_founder_subcity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founder Sub City</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="child_found_woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founder Woreda</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="child_founder_house_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const stringValue = e.target.value;
                          const numberValue =
                            stringValue === ""
                              ? undefined
                              : Number(stringValue);
                          field.onChange(numberValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="child_founder_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founder Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="flex flex-col space-y-10 py-8 px-5">
            <CardTitle className="text-lg font-semibold">
              Officer Information
            </CardTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="officer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Officer Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officer_responsibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Officer Responsibility</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officer_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Officer Address</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officer_subcity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Officer Sub City</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officer_woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Officer Woreda</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officer_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Officer Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officer_id_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Officer ID Number</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="flex flex-col space-y-10 py-8 px-5">
            <CardTitle className="text-lg font-semibold">
              Care Center Worker Information
            </CardTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="care_center_worker_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="care_center_worker_responsibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker Responsibility</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="care_center_worker_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker Address</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="care_center_worker_subcity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker Sub City</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="care_center_worker_woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker Woreda</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="care_center_worker_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="care_center_worker_id_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker ID Number</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="flex flex-col space-y-10 py-8 px-5">
            <CardTitle className="text-lg font-semibold">
              Health Officers
            </CardTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="health_officer_1_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health Officer 1 Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heallth_officer_2_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health Officer 2 Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(`/care-centers-portal/child/${childId}/view`)
                }
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Updating..." : "Update Child"}
              </Button>
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
}
