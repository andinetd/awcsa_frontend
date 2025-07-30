"use client";

import SubmitButton from "@/components/custom/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRegisterCareCenterMutation } from "@/hooks/adoption/care-center";
import {
  NewCareCenterSchema,
  NewCareCenterSchemaType,
} from "@/schemas/care-centers";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const NewCareCenterForm = () => {
  const { mutate } = useRegisterCareCenterMutation();

  const form = useForm<NewCareCenterSchemaType>({
    resolver: zodResolver(NewCareCenterSchema),
    defaultValues: {},
  });

  async function onSubmit(values: NewCareCenterSchemaType) {
    //TODO: handle submission here
    console.log("submitting values: ", JSON.stringify(values));
    mutate(values);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Care Center</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] md:max-w-xl lg:max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Register New Care Center
            </DialogTitle>
            <DialogDescription>
              Register care centers and related organizations for future use.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="p-6 shadow-md">
                {/* Name & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ስም (Name)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter name"
                            className="transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ቦታ (Location)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter location"
                            className="transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Age Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <FormField
                    control={form.control}
                    name="minAge"
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
                            placeholder="e.g., 2"
                            className="transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxAge"
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
                            placeholder="e.g., 10"
                            className="transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit */}
                <CardFooter className="pt-6 flex justify-end">
                  <SubmitButton
                    type="submit"
                    isSubmitting={form.formState.isSubmitting}
                  >
                    {"create"}
                  </SubmitButton>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewCareCenterForm;
