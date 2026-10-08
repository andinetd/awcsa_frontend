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
import { Checkbox } from "@/components/ui/checkbox";
import { User, CreateUserDto } from "@/types/super-admin";
import {
  useCreateUser,
  useUpdateUser,
  useGetUserFormData,
} from "@/hooks/super-admin";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

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

const OPERATIONAL_MODULES = [
  "CHILDREN_AFFAIRS",
  "WOMEN_AFFAIRS",
  "SOCIAL_AFFAIRS",
  "EDIR",
] as const;

const SYSTEM_MODULE = "SYSTEM" as const;

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
      assignedModules: z
        .array(z.string())
        .min(1, t("errors.departmentRequired") || "At least one module is required"),
      department: z.string().optional(),
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
      assignedModules: [],
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
        const assigned =
          user.employee.assignedModules && user.employee.assignedModules.length > 0
            ? user.employee.assignedModules
            : user.employee.department
              ? [user.employee.department]
              : [];
        form.reset({
          firstName: user.employee.firstName || "",
          lastName: user.employee.lastName || "",
          email: user.email || "",
          phoneNumber: user.employee.phoneNumber || "",
          cityIdNumber: user.employee.cityIdNumber || "",
          password: "123456",
          roleId: String(user.employee.role?.id || ""),
          orgUnitId: String(user.employee.orgUnit?.id || ""),
          assignedModules: assigned,
          department: user.employee.department || (assigned[0] ?? ""),
          directorateId: user.employee.directorate?.id
            ? String(user.employee.directorate.id)
            : "",
          teamId: user.employee.team?.id ? String(user.employee.team.id) : "",
        });
      } else {
        const defaultBureauId =
          formData?.structure?.bureaus?.length === 1
            ? String(formData.structure.bureaus[0].id)
            : "";
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          cityIdNumber: "",
          password: "",
          roleId: "",
          orgUnitId: defaultBureauId,
          assignedModules: [],
          department: "",
          directorateId: "",
          teamId: "",
        });
      }
    }
  }, [open, user, form, formData]);

  const handleGenerate = () => {
    const generated = generatePassword();
    form.setValue("password", generated, { shouldValidate: true });
    setShowPassword(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const effectiveDepartment = (values.department ||
      values.assignedModules[0]) as CreateUserDto["department"];
    const base = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      cityIdNumber: values.cityIdNumber,
      department: effectiveDepartment,
      assignedModules: values.assignedModules as CreateUserDto["assignedModules"],
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
            const currentAuthUser = useAuthStore.getState().user;
            if (currentAuthUser && currentAuthUser.id === user.id) {
              useAuthStore.setState({
                assignedModules: (values.assignedModules || []) as any,
                department: effectiveDepartment || null,
              });
            }
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3 mb-2">
          <DialogTitle className="text-base font-bold font-mono text-[#0B1F3A] uppercase tracking-wide">
            {isEdit ? t("editTitle") : t("addTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {isEdit ? t("editDescription") : t("addDescription")}
          </DialogDescription>
        </DialogHeader>

        {loadingConfig ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-7 w-7 animate-spin text-[#1769AA]" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              autoComplete="off"
            >
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                  {t("section.personal")}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-700">{t("firstName")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("placeholders.firstName")}
                            {...field}
                            className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-700">{t("lastName")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("placeholders.lastName")}
                            {...field}
                            className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-700">{t("phone")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("placeholders.phone")}
                            {...field}
                            className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cityIdNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-700">{t("cityId")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("placeholders.cityId")}
                            {...field}
                            className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {!isEdit && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                    {t("section.account")}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700">{t("email")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              autoComplete="off"
                              placeholder={t("placeholders.email")}
                              {...field}
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700">{t("role")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                                <SelectValue placeholder={t("select")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md">
                              {formData?.roles.map((role) => (
                                <SelectItem
                                  key={role.id}
                                  value={String(role.id)}
                                  className="text-xs"
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
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-700">{t("password")}</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder={t("placeholders.password")}
                              {...field}
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white pr-20"
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={handleGenerate}
                            className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-1 pr-2 text-[11px] font-mono font-medium text-[#1769AA] hover:underline cursor-pointer"
                          >
                            <RefreshCw className="h-3 w-3" />
                            {t("generate")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                  {t("section.assignment")}
                </h4>
                <FormField
                  control={form.control}
                  name="assignedModules"
                  render={({ field }) => {
                    const currentValues = field.value || [];
                    const allOperationalSelected =
                      OPERATIONAL_MODULES.length > 0 &&
                      OPERATIONAL_MODULES.every((dept) =>
                        currentValues.includes(dept),
                      );
                    const isSystemSelected = currentValues.includes(SYSTEM_MODULE);

                    const operationalCount = OPERATIONAL_MODULES.filter((m) =>
                      currentValues.includes(m),
                    ).length;

                    return (
                      <FormItem className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <FormLabel className="text-xs font-semibold text-slate-700">
                              {t("operationalModules") || "Operational Modules"}
                            </FormLabel>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {operationalCount} / {OPERATIONAL_MODULES.length}{" "}
                              {t("selected") || "selected"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xs border border-[#E3E7EB] bg-slate-50/50">
                            {/* Option for ALL operational modules */}
                            <label
                              className={`col-span-2 flex items-center gap-2 p-2 rounded-xs border cursor-pointer transition-colors text-xs ${
                                allOperationalSelected
                                  ? "border-[#1769AA] bg-blue-50/80 font-bold text-[#0B1F3A]"
                                  : "border-[#E3E7EB] bg-white text-slate-700 hover:bg-slate-50 font-semibold"
                              }`}
                            >
                              <Checkbox
                                checked={allOperationalSelected}
                                onCheckedChange={(isChecked) => {
                                  let updated: string[];
                                  if (isChecked) {
                                    const nonOperational = currentValues.filter(
                                      (v: string) =>
                                        !OPERATIONAL_MODULES.includes(v as any),
                                    );
                                    updated = [...OPERATIONAL_MODULES, ...nonOperational];
                                    form.setValue("department", OPERATIONAL_MODULES[0]);
                                  } else {
                                    updated = currentValues.filter(
                                      (v: string) =>
                                        !OPERATIONAL_MODULES.includes(v as any),
                                    );
                                    if (updated.length > 0) {
                                      form.setValue("department", updated[0]);
                                    }
                                  }
                                  field.onChange(updated);
                                }}
                              />
                              <span className="truncate">
                                {t("allModules") || "All Modules (All 4 Modules)"}
                              </span>
                            </label>

                            {OPERATIONAL_MODULES.map((dept) => {
                              const checked = currentValues.includes(dept);
                              return (
                                <label
                                  key={dept}
                                  className={`flex items-center gap-2 p-2 rounded-xs border cursor-pointer transition-colors text-xs ${
                                    checked
                                      ? "border-[#1769AA] bg-blue-50/60 font-semibold text-[#0B1F3A]"
                                      : "border-[#E3E7EB] bg-white text-slate-700 hover:bg-slate-50"
                                  }`}
                                >
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(isChecked) => {
                                      const updated = isChecked
                                        ? [...currentValues, dept]
                                        : currentValues.filter((v: string) => v !== dept);
                                      field.onChange(updated);
                                      if (updated.length > 0) {
                                        form.setValue("department", updated[0]);
                                      }
                                    }}
                                  />
                                  <span className="truncate">{t(`departments.${dept}`)}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Standalone System Scope Control */}
                        <div>
                          <FormLabel className="text-xs font-semibold text-slate-700 mb-1.5 block">
                            {t("systemAccess") || "System Access"}
                          </FormLabel>
                          <label
                            className={`flex items-start gap-2.5 p-2.5 rounded-xs border cursor-pointer transition-colors text-xs ${
                              isSystemSelected
                                ? "border-slate-800 bg-slate-100 font-semibold text-[#0B1F3A]"
                                : "border-[#E3E7EB] bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <Checkbox
                              checked={isSystemSelected}
                              className="mt-0.5"
                              onCheckedChange={(isChecked) => {
                                const updated = isChecked
                                  ? [...currentValues, SYSTEM_MODULE]
                                  : currentValues.filter((v: string) => v !== SYSTEM_MODULE);
                                field.onChange(updated);
                                if (updated.length > 0) {
                                  form.setValue("department", updated[0]);
                                }
                              }}
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-xs text-[#0B1F3A]">
                                {t("departments.SYSTEM") || "System"}
                              </span>
                              <span className="text-[11px] text-slate-500 font-normal">
                                {t("systemDescription") || "Full administrative/system-level access"}
                              </span>
                            </div>
                          </label>
                        </div>

                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    );
                  }}
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

                    const defaultBureauId =
                      bureaus.length > 0 ? String(bureaus[0].id) : "";

                    const effectiveBureauId = selectedBureau
                      ? String(selectedBureau.id)
                      : defaultBureauId;
                    const effectiveSubCityId = selectedSubCity
                      ? String(selectedSubCity.id)
                      : "";
                    const effectiveWoredaId = selectedWoreda
                      ? String(selectedWoreda.id)
                      : "";

                    const filteredSubCities = effectiveBureauId
                      ? subCities.filter(
                          (sc) => String(sc.parentId) === effectiveBureauId,
                        )
                      : subCities;

                    const filteredWoredas = effectiveSubCityId
                      ? woredas.filter(
                          (w) => String(w.parentId) === effectiveSubCityId,
                        )
                      : [];

                    const showOrgSelect = bureaus.length > 1;

                    return (
                      <div className="space-y-3">
                        {showOrgSelect && (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{t("org")}</FormLabel>
                            <Select
                              onValueChange={(val) => field.onChange(val)}
                              value={effectiveBureauId}
                            >
                              <FormControl>
                                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                                  <SelectValue placeholder={t("select")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md">
                                {bureaus.map((org) => (
                                  <SelectItem key={org.id} value={String(org.id)} className="text-xs">
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
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}

                        {(filteredSubCities.length > 0 ||
                          effectiveSubCityId) && (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{t("subCity")}</FormLabel>
                            <Select
                              onValueChange={(val) => {
                                if (val === "__BUREAU_LEVEL__") {
                                  field.onChange(effectiveBureauId);
                                } else {
                                  field.onChange(val);
                                }
                              }}
                              value={effectiveSubCityId || (effectiveBureauId === field.value ? "__BUREAU_LEVEL__" : "")}
                            >
                              <FormControl>
                                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                                  <SelectValue
                                    placeholder={t("selectSubCity")}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md">
                                <SelectItem value="__BUREAU_LEVEL__" className="text-xs font-medium text-slate-600">
                                  {t("bureauLevel")}
                                </SelectItem>
                                {filteredSubCities.map((sc) => (
                                  <SelectItem key={sc.id} value={String(sc.id)} className="text-xs">
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
                            {!showOrgSelect && <FormMessage className="text-[11px]" />}
                          </FormItem>
                        )}

                        {effectiveSubCityId && filteredWoredas.length > 0 && (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700">{t("woreda")}</FormLabel>
                            <Select
                              onValueChange={(val) => {
                                if (val === "__SUBCITY_LEVEL__") {
                                  field.onChange(effectiveSubCityId);
                                } else {
                                  field.onChange(val);
                                }
                              }}
                              value={effectiveWoredaId || (effectiveSubCityId === field.value ? "__SUBCITY_LEVEL__" : "")}
                            >
                              <FormControl>
                                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                                  <SelectValue placeholder={t("select")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md">
                                <SelectItem value="__SUBCITY_LEVEL__" className="text-xs font-medium text-slate-600">
                                  {t("subCityLevel")}
                                </SelectItem>
                                {filteredWoredas.map((w) => (
                                  <SelectItem key={w.id} value={String(w.id)} className="text-xs">
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

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="directorateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-700">{t("directorate")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                              <SelectValue placeholder={t("select")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md">
                            {formData?.directorates.map((dir) => (
                              <SelectItem key={dir.id} value={String(dir.id)} className="text-xs">
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
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teamId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-700">{t("team")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                              <SelectValue placeholder={t("select")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md">
                            {formData?.teams.map((team) => (
                              <SelectItem key={team.id} value={String(team.id)} className="text-xs">
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
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="pt-3 border-t border-[#E3E7EB] flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
                >
                  {t("cancel") || "Cancel"}
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs gap-1.5 px-4"
                >
                  {isSaving && (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
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