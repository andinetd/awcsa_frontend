"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name_by_family: z.string(),
  name_by_care_center: z.string().optional(),
  father_name: z.string().optional(),
  age: z
    .number()
    .int()
    .min(0, "Age cannot be negative")
    .max(100, "Age too high")
    .optional()
    .nullable(),
  gender: z.enum(["male", "female"]),
  admitance_reason: z.string(),
  found_address: z.string(),
  found_subcity: z.string(),
  found_woreda: z.string(),
  additional_information: z.string(),
  found_date: z.date(),
});

export default function NewChildFormSectionOne() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    //TODO: handle submission here
    console.log("values submited: ", { values });
    router.push("/adoption/children");
  }

  return (
    <div className="mx-auto max-w-4xl w-full mt-10 px-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Name Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="name_by_family"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (Given by Family)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g., Abel" {...field} />
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
                  <FormLabel>Name (Given by Care Center)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g., Daniel" {...field} />
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
                    <Input type="text" placeholder="e.g., Tesfaye" {...field} />
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
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      name="gender"
                      value={field.value}
                      defaultValue="male"
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
                      placeholder="e.g., 10"
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
                    <Input
                      type="text"
                      placeholder="e.g., Near Piassa"
                      {...field}
                    />
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
                    <Input type="text" placeholder="e.g., Kirkos" {...field} />
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
                    <Input type="text" placeholder="e.g., 08" {...field} />
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
                <FormLabel>Date Found</FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-between w-full font-normal"
                      >
                        {date ? date.toLocaleDateString() : "Select date"}
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit Form"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
