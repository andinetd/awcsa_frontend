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
        <Button>{t("careCenters.addNew")}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-xl lg:max-w-3xl w-full overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("careCenters.form.registerTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("careCenters.form.registerDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("careCenters.form.registerFacility")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("careCenters.form.facilityName")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("careCenters.form.facilityName")}
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
                          <FormLabel>{t("careCenters.form.type")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t("careCenters.form.selectType")}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NGO">
                                {t("careCenters.form.ngoPrivate")}
                              </SelectItem>
                              <SelectItem value="GOVERNMENT">
                                {t("careCenters.form.government")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2 md:col-span-2">
                      <FormLabel>{t("careCenters.form.ageRange")}</FormLabel>
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
                          <FormLabel>{t("careCenters.form.phone")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("careCenters.form.phone")}
                              {...field}
                            />
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
                      {t("careCenters.form.addressDetails")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("careCenters.form.region")}
                            </FormLabel>
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
                            <FormLabel>
                              {t("careCenters.form.subCity")}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t(
                                      "careCenters.form.selectSubCity",
                                    )}
                                  />
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
                            <FormLabel>
                              {t("careCenters.form.woreda")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("careCenters.form.woreda")}
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
                            <FormLabel>
                              {t("careCenters.form.kebele")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("careCenters.form.kebele")}
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
                            <FormLabel>
                              {t("careCenters.form.houseNumber")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("careCenters.form.houseNumber")}
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
                            <FormLabel>{t("careCenters.form.place")}</FormLabel>
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
                        <FormLabel>
                          {t("careCenters.form.description")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("careCenters.form.description")}
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
                    {t("careCenters.form.accountInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("careCenters.form.email")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t("careCenters.form.email")}
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
                          <FormLabel>
                            {t("careCenters.form.password")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t(
                                "careCenters.form.initialPassword",
                              )}
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
                  {t("careCenters.form.reset")}
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
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
