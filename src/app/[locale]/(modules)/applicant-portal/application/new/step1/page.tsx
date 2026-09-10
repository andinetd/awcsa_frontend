"use client";

import { Button } from "@/components/ui/button";
import { User, ShieldCheck, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { StepFormWrapper } from "../../../_components/step-form-wrapper";

import { FileDragAndDrop } from "@/components/custom/file-dropzone";
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
  ApplicationStepOneSchema,
  ApplicationStepOneType,
  calculateApplicantAge,
} from "@/schemas/application/applicationStepsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useApplicationFormStore } from "@/stores/application-form-store";
import AgeInput from "@/components/custom/age-input";

export default function Step1Page() {
  const router = useRouter();
  const t = useTranslations("applicants-portal");

  const { step1, setStep1 } = useApplicationFormStore();
  const form = useForm<ApplicationStepOneType>({
    resolver: zodResolver(ApplicationStepOneSchema),
    defaultValues: step1 || {},
  });

  function normalizeAgeDisplay(ageInYears: number | undefined) {
    if (!ageInYears) {
      return { displayValue: 1, displayUnit: "years" as const };
    }

    // If it's a whole number → years
    if (Number.isInteger(ageInYears)) {
      return { displayValue: ageInYears, displayUnit: "years" as const };
    }

    // Float → months
    return {
      displayValue: Math.round(ageInYears * 12), // convert years → months
      displayUnit: "months" as const,
    };
  }

  const storedMinAge = step1?.preferredChildren?.ageRange?.min;
  const storedMaxAge = step1?.preferredChildren?.ageRange?.max;

  const { displayValue: minValue, displayUnit: minUnit } =
    normalizeAgeDisplay(storedMinAge);
  const { displayValue: maxValue, displayUnit: maxUnit } =
    normalizeAgeDisplay(storedMaxAge);

  // Applicant must be between 21 and 60 years old
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 21,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];
  const minDate = new Date(
    today.getFullYear() - 60,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  async function onSubmit(values: ApplicationStepOneType) {
    setStep1(values);
    router.push("/applicant-portal/application/new/step2");
  }

  const instructions = (
    <div className="space-y-4">
      {/* Prominent Eligibility Criteria Callout */}
      <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-xl space-y-2">
        <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          Adoption Eligibility Criteria
        </h4>
        <ul className="text-xs text-blue-900 space-y-1.5 list-disc pl-4 font-lexend">
          <li>
            <strong>Age requirement:</strong> You must be between <strong>21 and 60 years old</strong> to apply for adoption.
          </li>
          <li>
            <strong>Identification:</strong> Official Kebele/City ID & Birth Certificate.
          </li>
          <li>
            <strong>Income:</strong> Verifiable monthly or annual income statement.
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-2 text-primary">
        <User className="h-5 w-5" />
        <h3 className="font-semibold">{t("stepone.instructions.title")}</h3>
      </div>

      <ul className="space-y-2 font-lexend text-gray-600">
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
          <span>{t("stepone.instructions.zero")}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
          <span>{t("stepone.instructions.one")}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2  bg-primary rounded-full mt-2 flex-shrink-0"></span>
          <span>{t("stepone.instructions.two")}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2  bg-primary rounded-full mt-2 flex-shrink-0"></span>
          <span> {t("stepone.instructions.three")} </span>
        </li>
      </ul>

      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm font-bold text-yellow-800">
          {t("stepone.instructions.note")}
        </p>
      </div>
    </div>
  );

  return (
    <StepFormWrapper
      // title={application("stepone.instructions.title")}
      // description="Tell us about yourself and your current situation"
      instructions={instructions}
    >
      {" "}
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="cityIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-lexend">
                    {t("stepone.form.cityId")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("stepone.form.cityIdPlaceHolder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => {
                const age = calculateApplicantAge(field.value);
                const hasValue = !!field.value;
                const isAgeEligible = age !== null && age >= 21 && age <= 60;

                return (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-base sm:text-lg font-lexend">
                        {t("stepone.form.dateOfBirth")}
                      </FormLabel>
                      <span className="text-xs text-muted-foreground font-lexend">
                        Age 21 – 60
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        type="date"
                        min={minDate}
                        max={maxDate}
                        {...field}
                      />
                    </FormControl>
                    {hasValue && age !== null && !isAgeEligible && (
                      <div className="text-xs font-medium mt-1.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md border bg-rose-50 text-rose-700 border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>
                          {age < 21
                            ? `Age: ${age} years old — Ineligible: Applicant must be at least 21 years old.`
                            : `Age: ${age} years old — Ineligible: Applicant must be 60 years old or younger.`}
                        </span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-lexend">
                    {t("stepone.form.MonthlyIncome")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-lexend">
                    {t("stepone.form.Address")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("stepone.form.AddressPlaceHolder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="educationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-lexend">
                    {t("stepone.form.EducationLevel")}
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                    >
                      <option value="">{t("form.select")}</option>
                      <option value="none">
                        {t("stepone.form.educationOptions.none")}
                      </option>
                      <option value="primary">
                        {t("stepone.form.educationOptions.primary")}
                      </option>
                      <option value="secondary">
                        {t("stepone.form.educationOptions.secondary")}
                      </option>
                      <option value="Diploma">
                        {t("stepone.form.educationOptions.diploma")}
                      </option>
                      <option value="Bachelor">
                        {t("stepone.form.educationOptions.bachelor")}
                      </option>
                      <option value="Masters">
                        {t("stepone.form.educationOptions.masters")}
                      </option>
                      <option value="Doctorate">
                        {t("stepone.form.educationOptions.doctorate")}
                      </option>
                    </select>
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
                  <FormLabel className="text-base sm:text-lg font-lexend">
                    {t("stepone.form.occupation")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("stepone.form.occupationPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="spouseCityIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-lexend">
                    {t("stepone.form.spouseCityIdNumber")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("stepone.form.spouseCityIdNumber")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="preferredChildren.ageRange.min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-lexend">
                    {t("stepone.form.preferredChildAgeMin")}
                  </FormLabel>
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

            <FormField
              control={form.control}
              name="preferredChildren.ageRange.max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-lexend">
                    {t("stepone.form.preferredChildAgeMax")}
                  </FormLabel>
                  <FormControl>
                    <AgeInput
                      label=""
                      value={field.value}
                      onChange={field.onChange} // receives converted years
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredChildren.number"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="text-xs sm:text-sm font-lexend">
                    {t("stepone.form.preferredNumberOfChildren")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="preferredChildren.sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-lexend">
                    {t("stepone.form.preferredChildGender")}
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                    >
                      <option value="ANY">
                        {t("stepone.form.GenderOptions.any")}
                      </option>
                      <option value="MALE">
                        {t("stepone.form.GenderOptions.male")}
                      </option>
                      <option value="FEMALE">
                        {t("stepone.form.GenderOptions.female")}
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-lexend">
                    {t("stepone.form.id")}*
                  </FormLabel>
                  <FormControl>
                    <FileDragAndDrop
                      value={[field.value]}
                      onChange={(files) => {
                        field.onChange(files[0]);
                      }}
                      maxFiles={1}
                      acceptedFileTypes={[".pdf", ".png", ".jpg", ".jpeg"]}
                      maxSize={10 * 1024 * 1024} // 10MB
                      error={form.formState.errors.id?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />{" "}
          </div>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="birthCertificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-lexend">
                    {t("stepone.form.birthCertificate")}*
                  </FormLabel>
                  <FormControl>
                    <FileDragAndDrop
                      value={[field.value]}
                      onChange={(files) => {
                        field.onChange(files[0]);
                      }}
                      maxFiles={1}
                      acceptedFileTypes={[".pdf", ".png", ".jpg", ".jpeg"]}
                      maxSize={10 * 1024 * 1024} // 10MB
                      error={form.formState.errors.birthCertificate?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-lexend">
                    {t("stepone.form.income")}*
                  </FormLabel>
                  <FormControl>
                    <FileDragAndDrop
                      value={[field.value]}
                      onChange={(files) => {
                        field.onChange(files[0]);
                      }}
                      maxFiles={1}
                      acceptedFileTypes={[".pdf", ".png", ".jpg", ".jpeg"]}
                      maxSize={10 * 1024 * 1024} // 10MB
                      error={form.formState.errors.income?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => router.push("/applicant-portal/portal")}
            >
              {t("form.backToPortal")}
            </Button>
            <Button type="submit" className="w-full sm:w-auto px-8">
              {t("form.nextStep")}
            </Button>
          </div>
        </form>
      </Form>
    </StepFormWrapper>
  );
}
