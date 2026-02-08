"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateUserDto } from "@/types/super-admin";
import { useCreateUser, useGetUserFormData } from "@/hooks/super-admin";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSaved: () => void;
}

export function UserDialog({
  open,
  onOpenChange,
  onUserSaved,
}: UserDialogProps) {
  const t = useTranslations("super-admin.userManagement.dialog");
  const { data: formData, isLoading: loadingConfig } = useGetUserFormData();
  const createUserMutation = useCreateUser();
  const isSaving = createUserMutation.isPending;

  // Schema for the form
  const formSchema = useMemo(() => {
    return z.object({
      firstName: z.string().min(2, t("errors.firstNameRequired")),
      lastName: z.string().min(2, t("errors.lastNameRequired")),
      email: z.string().email(t("errors.invalidEmail")),
      phoneNumber: z.string().min(10, t("errors.phoneRequired")),
      cityIdNumber: z.string().min(1, t("errors.cityIdRequired")),
      password: z.string().min(6, t("errors.passwordMin")),
      roleId: z.string().min(1, t("errors.roleRequired")),
      orgUnitId: z.string().min(1, t("errors.orgRequired")),
      directorateId: z.string().optional(),
      teamId: z.string().optional(),
    });
  }, [t]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      cityIdNumber: "",
      password: "",
      roleId: "",
      orgUnitId: "",
      directorateId: "",
      teamId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload: CreateUserDto = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        cityIdNumber: values.cityIdNumber,
        password: values.password,
        roleId: Number(values.roleId),
        orgUnitId: Number(values.orgUnitId),
        directorateId: values.directorateId
          ? Number(values.directorateId)
          : undefined,
        teamId: values.teamId ? Number(values.teamId) : undefined,
      };

      createUserMutation.mutate(payload, {
        onSuccess: () => {
          onUserSaved();
          onOpenChange(false);
          form.reset();
        },
      });
    } catch (error: any) {
      console.error(error);
      toast.error(t("errors.saveFailed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("addTitle")}</DialogTitle>
          <DialogDescription>{t("addDescription")}</DialogDescription>
        </DialogHeader>

        {loadingConfig ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("firstName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholders.firstName")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.firstName &&
                          t("errors.firstNameRequired")}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("lastName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholders.lastName")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.lastName &&
                          t("errors.lastNameRequired")}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholders.email")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.email &&
                          t("errors.invalidEmail")}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("phone")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholders.phone")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.phoneNumber &&
                          t("errors.phoneRequired")}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cityIdNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("cityId")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholders.cityId")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.cityIdNumber &&
                          t("errors.cityIdRequired")}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("password")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("placeholders.password")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.password &&
                          t("errors.passwordMin")}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("role")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("select")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formData?.roles.map((role) => (
                            <SelectItem key={role.id} value={String(role.id)}>
                              <span
                                className="truncate max-w-[180px] block"
                                title={role.name.replace(/_/g, " ")}
                              >
                                {role.name.replace(/_/g, " ")}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {form.formState.errors.roleId &&
                          t("errors.roleRequired")}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orgUnitId"
                  render={({ field }) => {
                    const bureaus = formData?.structure?.bureaus || [];
                    const subCities = formData?.structure?.subCities || [];
                    const woredas = formData?.structure?.woredas || [];

                    // Find if current value is a Woreda, Sub-City, or Bureau
                    const selectedWoreda = woredas.find(
                      (w) => String(w.id) === field.value,
                    );
                    const selectedSubCity = subCities.find(
                      (sc) =>
                        String(sc.id) ===
                        (selectedWoreda
                          ? String(selectedWoreda.parentId)
                          : field.value),
                    );
                    const selectedBureau = bureaus.find(
                      (b) =>
                        String(b.id) ===
                        (selectedSubCity
                          ? String(selectedSubCity.parentId)
                          : selectedWoreda
                            ? String(selectedWoreda.parentId) // Fallback (shouldn't happen with correct data)
                            : field.value),
                    );

                    const effectiveBureauId = selectedBureau
                      ? String(selectedBureau.id)
                      : "";
                    const effectiveSubCityId = selectedSubCity
                      ? String(selectedSubCity.id)
                      : "";
                    const effectiveWoredaId = selectedWoreda
                      ? String(selectedWoreda.id)
                      : "";

                    const filteredSubCities = bureaus.find(
                      (b) => String(b.id) === effectiveBureauId,
                    )
                      ? subCities.filter(
                          (sc) => String(sc.parentId) === effectiveBureauId,
                        )
                      : [];

                    const filteredWoredas = subCities.find(
                      (sc) => String(sc.id) === effectiveSubCityId,
                    )
                      ? woredas.filter(
                          (w) => String(w.parentId) === effectiveSubCityId,
                        )
                      : [];

                    return (
                      <div className="space-y-4 col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormItem>
                            <FormLabel>{t("org")}</FormLabel>
                            <Select
                              onValueChange={(val) => field.onChange(val)}
                              value={effectiveBureauId}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("select")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {bureaus.map((org) => (
                                  <SelectItem
                                    key={org.id}
                                    value={String(org.id)}
                                  >
                                    <span
                                      className="truncate max-w-[150px] block"
                                      title={org.name}
                                    >
                                      {org.name}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>

                          {(filteredSubCities.length > 0 ||
                            effectiveSubCityId) && (
                            <FormItem>
                              <FormLabel>{t("subCity")}</FormLabel>
                              <Select
                                onValueChange={(val) => field.onChange(val)}
                                value={effectiveSubCityId}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={t("selectSubCity")}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {filteredSubCities.map((sc) => (
                                    <SelectItem
                                      key={sc.id}
                                      value={String(sc.id)}
                                    >
                                      <span
                                        className="truncate max-w-[150px] block"
                                        title={sc.name}
                                      >
                                        {sc.name}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}

                          {(filteredWoredas.length > 0 ||
                            effectiveWoredaId) && (
                            <FormItem>
                              <FormLabel>{t("woreda")}</FormLabel>
                              <Select
                                onValueChange={(val) => field.onChange(val)}
                                value={effectiveWoredaId}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t("select")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {filteredWoredas.map((w) => (
                                    <SelectItem key={w.id} value={String(w.id)}>
                                      <span
                                        className="truncate max-w-[150px] block"
                                        title={w.name}
                                      >
                                        {w.name}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="directorateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("directorate")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("select")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formData?.directorates.map((dir) => (
                            <SelectItem key={dir.id} value={String(dir.id)}>
                              <span
                                className="truncate max-w-[180px] block"
                                title={dir.name.replace(/_/g, " ")}
                              >
                                {dir.name.replace(/_/g, " ")}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("team")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("select")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formData?.teams.map((team) => (
                            <SelectItem key={team.id} value={String(team.id)}>
                              <span
                                className="truncate max-w-[180px] block"
                                title={team.name}
                              >
                                {team.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("create")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
