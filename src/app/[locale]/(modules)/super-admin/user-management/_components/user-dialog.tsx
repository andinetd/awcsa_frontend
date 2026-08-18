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
import { User, CreateUserDto } from "@/types/super-admin";
import {
  useCreateUser,
  useUpdateUser,
  useGetUserFormData,
} from "@/hooks/super-admin";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";

const PASSWORD_CHARSET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

function generatePassword(length = 12) {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += PASSWORD_CHARSET[bytes[i] % PASSWORD_CHARSET.length];
  }
  return password;
}

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSaved: () => void;
  user?: User | null;
}

const DEPARTMENT_OPTIONS = [
  "CHILDREN_AFFAIRS",
  "WOMEN_AFFAIRS",
  "SOCIAL_AFFAIRS",
  "SYSTEM",
  "EDIR",
] as const;

export function UserDialog({
  open,
  onOpenChange,
  onUserSaved,
  user,
}: UserDialogProps) {
  const t = useTranslations("super-admin.userManagement.dialog");
  const { data: formData, isLoading: loadingConfig } = useGetUserFormData();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isEdit = !!user;
  const isSaving = createUserMutation.isPending || updateUserMutation.isPending;

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
      department: z.string().min(1, t("errors.departmentRequired")),
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
      department: "",
      directorateId: "",
      teamId: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  // Prefill when editing
  useEffect(() => {
    if (open) {
      setShowPassword(false);
      if (user?.employee) {
        form.reset({
          firstName: user.employee.firstName || "",
          lastName: user.employee.lastName || "",
          email: user.email || "",
          phoneNumber: user.employee.phoneNumber || "",
          cityIdNumber: user.employee.cityIdNumber || "",
          password: "123456",
          roleId: String(user.employee.role?.id || ""),
          orgUnitId: String(user.employee.orgUnit?.id || ""),
          department: user.employee.department || "",
          directorateId: user.employee.directorate?.id
            ? String(user.employee.directorate.id)
            : "",
          teamId: user.employee.team?.id ? String(user.employee.team.id) : "",
        });
      } else {
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          cityIdNumber: "",
          password: "",
          roleId: "",
          orgUnitId: "",
          department: "",
          directorateId: "",
          teamId: "",
        });
      }
    }
  }, [open, user, form]);

  const handleGenerate = () => {
    const generated = generatePassword();
    form.setValue("password", generated, { shouldValidate: true });
    setShowPassword(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const base = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      cityIdNumber: values.cityIdNumber,
      department: values.department as CreateUserDto["department"],
      orgUnitId: Number(values.orgUnitId),
      directorateId: values.directorateId
        ? Number(values.directorateId)
        : undefined,
      teamId: values.teamId ? Number(values.teamId) : undefined,
    };

    if (isEdit && user) {
      updateUserMutation.mutate(
        { id: user.id, data: base },
        {
          onSuccess: () => {
            onUserSaved();
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast.error(error.message || t("errors.saveFailed"));
          },
        },
      );
      return;
    }

    const payload: CreateUserDto = {
      ...base,
      email: values.email,
      password: values.password,
      roleId: Number(values.roleId),
    };
    createUserMutation.mutate(payload, {
      onSuccess: () => {
        onUserSaved();
        onOpenChange(false);
        form.reset();
      },
      onError: (error: any) => {
        toast.error(error.message || t("errors.saveFailed"));
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("editTitle") : t("addTitle")}</DialogTitle>
          <DialogDescription>
            {isEdit ? t("editDescription") : t("addDescription")}
          </DialogDescription>
        </DialogHeader>

        {loadingConfig ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  {t("section.personal")}
                </h4>
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
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {!isEdit && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    {t("section.account")}
                  </h4>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("role")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("select")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {formData?.roles.map((role) => (
                                <SelectItem
                                  key={role.id}
                                  value={String(role.id)}
                                >
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("password")}</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder={t("placeholders.password")}
                              {...field}
                              className="pr-20"
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={handleGenerate}
                            className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-1 pr-2 text-xs text-primary hover:underline cursor-pointer"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            {t("generate")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  {t("section.assignment")}
                </h4>
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("department")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("select")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEPARTMENT_OPTIONS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {t(`departments.${dept}`)}
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
                  name="orgUnitId"
                  render={({ field }) => {
                    const bureaus = formData?.structure?.bureaus || [];
                    const subCities = formData?.structure?.subCities || [];
                    const woredas = formData?.structure?.woredas || [];

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
                            ? String(selectedWoreda.parentId)
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
                      <div className="space-y-4">
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
                                <SelectItem key={org.id} value={String(org.id)}>
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
                                  <SelectItem key={sc.id} value={String(sc.id)}>
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
                    );
                  }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="directorateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("directorate")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                          value={field.value}
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
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEdit ? t("save") : t("create")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}