"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegisterAderaMutation } from "@/hooks/adoption/adera";
import { NewAderaSchema, NewAderaSchemaType } from "@/schemas/adera-schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const NewAderaRegistrationForm = () => {
  const { mutate, isPending, error } = useRegisterAderaMutation();
  const router = useRouter();

  const form = useForm<NewAderaSchemaType>({
    resolver: zodResolver(NewAderaSchema),
    defaultValues: {},
  });

  async function onSubmit(values: NewAderaSchemaType) {
    //TODO: handle submission here
    console.log("submitting values: ", JSON.stringify(values));
    mutate(values);
    if (isPending) console.log("Pending....");
    if (error) console.log(error.message);
    // router.push("/adoption/adera");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="max-w-6xl mx-auto px-6 py-10 shadow-lg space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cityIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>የከተማ መታወቂያ ቁጥር (City ID Number)</FormLabel>
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
                    <FormLabel>የትዳር አጋር መታወቂያ ቁጥር (Spouse City ID)</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Education and Job Info */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Background</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>የትምህርት ደረጃ (Education Level)</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
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
                    <FormLabel>ስራ (Occupation)</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ወርሃዊ ገቢ (Monthly Income)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Child Preference Info */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Preferred Child
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="preferredChildGender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ተመራጭ ፆታ (Preferred Gender)</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="ፆታ (Gender)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredChildMinAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ዝቅተኛ አድሜ (Min Age)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
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
                    <FormLabel>ከፍተኛ አድሜ (Max Age)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Facilitator */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Facilitator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="facilitatorCityIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>መዝጋቢ ባለሞያ መታወቂያ ቁጥር (Expert ID)</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit */}
          <CardFooter className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="px-6"
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
