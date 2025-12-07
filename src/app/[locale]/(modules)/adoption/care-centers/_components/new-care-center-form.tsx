"use client";

import { useRegisterCareCenterMutation } from "@/hooks/adoption/care-center";
import {
  NewCareCenterSchema,
  NewCareCenterSchemaType,
} from "@/schemas/care-centers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Hash, Lock, MapPin, Save } from "lucide-react";
import { toast } from "sonner";
import AgeInput from "@/components/custom/age-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";

const NewCareCenterForm = () => {
  const [open, setOpen] = useState(false);
  const { mutate, isError } = useRegisterCareCenterMutation();

  const form = useForm({
    resolver: zodResolver(NewCareCenterSchema),
    defaultValues: {
      name: "",
      type: "NGO",
      phone: "",
      email: "",
      region: "Addis Ababa",
      subCity: "",
      woreda: "",
      kebele: "",
      houseNumber: "",
      place: "",
      description: "",
      childrenAgeRange: { min: 0, max: 18 },
      orgUnitId: 2,
      password: "",
    },
  });

  const onSubmit: SubmitHandler<NewCareCenterSchemaType> = async (values) => {
    console.log("submitting values: ", JSON.stringify(values));
    if (isError) {
      toast.error("An error occurred while registering the care center.");
      return;
    }
    mutate(values, {
      onSuccess: () => {
        toast.success("Care center registered successfully!");
        form.reset();
        setOpen(false);
      },
      onError: (error) => {
        toast.error("Failed to register care center: " + error.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Care Center</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-xl lg:max-w-3xl w-full overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Register New Care Center
          </DialogTitle>
          <DialogDescription>
            Register care centers and related organizations for future use.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Register New Facility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facility Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Facility Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NGO">NGO / Private</SelectItem>
                              <SelectItem value="GOVERNMENT">
                                Government
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2 md:col-span-2">
                      <FormLabel>Age Range (Min - Max)</FormLabel>
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="childrenAgeRange.min"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <AgeInput
                                  label=""
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span className="self-center text-slate-400">-</span>
                        <FormField
                          control={form.control}
                          name="childrenAgeRange.max"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <AgeInput
                                  label=""
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Address Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Addis Ababa"
                                {...field}
                              />
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Sub-City" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Bole">Bole</SelectItem>
                                <SelectItem value="Yeka">Yeka</SelectItem>
                                <SelectItem value="Kirkos">Kirkos</SelectItem>
                                <SelectItem value="Arada">Arada</SelectItem>
                                <SelectItem value="Lideta">Lideta</SelectItem>
                                <SelectItem value="Nifas Silk">
                                  Nifas Silk
                                </SelectItem>
                                <SelectItem value="Akaki Kality">
                                  Akaki Kality
                                </SelectItem>
                                <SelectItem value="Addis Ketema">
                                  Addis Ketema
                                </SelectItem>
                                <SelectItem value="Gullele">Gullele</SelectItem>
                                <SelectItem value="Lemi Kura">
                                  Lemi Kura
                                </SelectItem>
                              </SelectContent>
                            </Select>
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
                              <Input placeholder="Woreda" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="kebele"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kebele</FormLabel>
                            <FormControl>
                              <Input placeholder="Kebele" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="houseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>House Number</FormLabel>
                            <FormControl>
                              <Input placeholder="House Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="place"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Place (Display Name)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Near Bole Medhanialem"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description / Services</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Account & Contact Section */}
              <Card>
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    Account & Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Set initial password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Register Facility & Create Account
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCareCenterForm;
