"use client";

import { useRegisterCareCenterMutation } from "@/hooks/adoption/care-center";
import {
  NewCareCenterSchema,
  NewCareCenterSchemaType,
} from "@/schemas/care-centers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Hash, Lock, MapPin, Plus, Save } from "lucide-react";
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
import { useTranslations } from "next-intl";

const NewCareCenterForm = () => {
  const t = useTranslations("adoption");
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
      toast.error(t("careCenters.toasts.genericError"));
      return;
    }
    mutate(values, {
      onSuccess: () => {
        toast.success(t("careCenters.toasts.registerSuccess"));
        form.reset();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(
          t("careCenters.toasts.registerError", { message: error.message }),
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1769AA] hover:bg-[#12568E] text-white rounded-xs h-8 text-xs font-semibold px-3 shadow-2xs gap-1.5 cursor-pointer">
          <Plus className="size-3.5" />
          <span>{t("careCenters.addNew") || "Register New Center"}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-xl lg:max-w-3xl w-full overflow-y-auto max-h-[90vh] border-[#E3E7EB] rounded-xs shadow-2xs">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[#0B1F3A]">
            {t("careCenters.form.registerTitle") || "Register New Care Facility"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {t("careCenters.form.registerDescription") || "Enter the administrative, contact, and regional details of the new care center."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="max-w-4xl mx-auto space-y-4">
              <Card className="border-[#E3E7EB] rounded-xs shadow-2xs bg-white">
                <CardHeader className="bg-[#F7F8FA] border-b border-[#E3E7EB] py-3 px-4">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                    {t("careCenters.form.registerFacility") || "Facility Profile & Specifications"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700">
                            {t("careCenters.form.facilityName")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("careCenters.form.facilityName")}
                              className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                              {...field}
                            />
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
                          <FormLabel className="text-xs font-semibold text-slate-700">
                            {t("careCenters.form.type")}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus:border-[#1769AA]">
                                <SelectValue
                                  placeholder={t("careCenters.form.selectType")}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xs border-[#E3E7EB]">
                              <SelectItem value="NGO" className="text-xs">
                                {t("careCenters.form.ngoPrivate")}
                              </SelectItem>
                              <SelectItem value="GOVERNMENT" className="text-xs">
                                {t("careCenters.form.government")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-1.5 md:col-span-2">
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("careCenters.form.ageRange")}
                      </FormLabel>
                      <div className="flex items-center gap-2">
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
                        <span className="self-center text-slate-400 font-mono">-</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700">
                            {t("careCenters.form.phone")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("careCenters.form.phone")}
                              className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address Section */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-2 flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-[#1769AA]" />
                      {t("careCenters.form.addressDetails")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">
                              {t("careCenters.form.region")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Addis Ababa"
                                className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
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
                            <FormLabel className="text-xs font-semibold text-slate-700">
                              {t("careCenters.form.subCity")}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus:border-[#1769AA]">
                                  <SelectValue
                                    placeholder={t(
                                      "careCenters.form.selectSubCity",
                                    )}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xs border-[#E3E7EB]">
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
                            <FormLabel className="text-xs font-semibold text-slate-700">
                              {t("careCenters.form.woreda")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("careCenters.form.woreda")}
                                className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                                {...field}
                              />
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
                            <FormLabel className="text-xs font-semibold text-slate-700">
                              {t("careCenters.form.kebele")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("careCenters.form.kebele")}
                                className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                                {...field}
                              />
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
                            <FormLabel className="text-xs font-semibold text-slate-700">
                              {t("careCenters.form.houseNumber")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("careCenters.form.houseNumber")}
                                className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                                {...field}
                              />
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
                            <FormLabel className="text-xs font-semibold text-slate-700">
                              {t("careCenters.form.place")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Near Bole Medhanialem"
                                className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
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
                        <FormLabel className="text-xs font-semibold text-slate-700">
                          {t("careCenters.form.description")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("careCenters.form.description")}
                            className="min-h-[80px] text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
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
              <Card className="border-[#E3E7EB] rounded-xs shadow-2xs bg-white">
                <CardHeader className="bg-[#F7F8FA] border-b border-[#E3E7EB] py-3 px-4">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-1.5">
                    <Lock className="size-3.5 text-[#1769AA]" />
                    {t("careCenters.form.accountInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700">
                            {t("careCenters.form.email")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t("careCenters.form.email")}
                              className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
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
                          <FormLabel className="text-xs font-semibold text-slate-700">
                            {t("careCenters.form.password")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t(
                                "careCenters.form.initialPassword",
                              )}
                              className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
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

              <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E3E7EB]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="rounded-xs text-xs font-medium h-8 border-[#E3E7EB] px-3"
                >
                  {t("careCenters.form.reset")}
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold rounded-xs text-xs h-8 px-4 shadow-2xs cursor-pointer gap-1.5"
                >
                  <Save className="size-3.5" />
                  {t("careCenters.form.submit")}
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
