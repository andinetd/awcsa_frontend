"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const NewAderaSchema = z
  .object({
    cityIdNumber: z.string(),
    educationLevel: z.string(),
    occupation: z.string(),
    monthlyIncome: z.number(),
    partnerCityIdNumber: z.string().optional(),
    facilitatorCityIdNumber: z.string(),
    preferredChildGender: z.enum(["MALE", "FEMALE"]),
    preferredChildMinAge: z
      .number()
      .int()
      .min(0, "Minimum age must me at least 0"),
    preferredChildMaxAge: z.number().int().min(0, "Max age must be atlest 0"),
  })
  .refine((data) => data.preferredChildMinAge <= data.preferredChildMaxAge, {
    error: "Min age can not be larger than max age",
    path: ["preferredChildMaxAge"],
  });

type NewAderaSchemaType = z.infer<typeof NewAderaSchema>;

const NewAderaRegistrationForm = () => {
  const router = useRouter();
  const form = useForm<NewAderaSchemaType>({
    resolver: zodResolver(NewAderaSchema),
    defaultValues: {},
  });

  async function onSubmit(values: NewAderaSchemaType) {
    //TODO: handle submission here
    console.log("values submited: ", { values });
    router.push("/adoption/adera");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="flex flex-col space-y-10 py-8 px-5 w-fit">
          {/* <CardTitle className="text-lg font-semibold">
            {"የከተማ መታወቂያ ቁጥር (City Id Number)"}
          </CardTitle> */}
          {/* Name Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <FormField
              control={form.control}
              name="cityIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> {"የከተማ መታወቂያ ቁጥር (City Id Number)"}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partnerCityIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {" "}
                    {"የትዳር አጋር መታወቅያ ቁትር (Spouce City id number)"}
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* education level */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="educationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> {"የትምህርት ደረጃ (Education Level)"}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/*  JOB AND INCOME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> {"ስራ (Occupation)"}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> {"ወርሃዊ ገቢ (Monthly Income)"}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* PREFERRED CHILD INFO  */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="preferredChildGender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {" "}
                    {"ተመራጭ የልጅ ፆታ  (Preferred child Gender)"}
                  </FormLabel>
                  <FormControl>
                    <Select
                      name="gender"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="ፆታ (gender)" />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="preferredChildMinAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {" "}
                    {"ተመራጭ የልጅ ዝቅተኛ አድሜ (Minimum child age)"}
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredChildMaxAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {" "}
                    {"ተመራጭ የልጅ ከፍተኛ አድሜ (Maximumchild age)"}
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="w-fit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating..." : "Create"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default NewAderaRegistrationForm;
