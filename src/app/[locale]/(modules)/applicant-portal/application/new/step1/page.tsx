"use client";

import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
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
} from "@/schemas/application/applicationStepsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useApplicationFormStore } from "@/stores/application-form-store";

export default function Step1Page() {
  const router = useRouter();
  const application = useTranslations("applicationMessages");

  const { step1, setStep1 } = useApplicationFormStore();
  const form = useForm<ApplicationStepOneType>({
    resolver: zodResolver(ApplicationStepOneSchema),
    defaultValues: step1 || {},
  });

  async function onSubmit(values: ApplicationStepOneType) {
    setStep1(values);
    router.push("/applicant-portal/application/new/step2");
  }

  const instructions = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <User className="h-5 w-5" />
        <h3 className="font-semibold">
          {application("stepone.instructions.title")}
        </h3>
      </div>

      <ul className="space-y-2 font-lexend text-gray-600">
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
          <span>{application("stepone.instructions.zero")}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
          <span>{application("stepone.instructions.one")}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2  bg-primary rounded-full mt-2 flex-shrink-0"></span>
          <span>{application("stepone.instructions.two")}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2  bg-primary rounded-full mt-2 flex-shrink-0"></span>
          <span> {application("stepone.instructions.three")} </span>
        </li>
      </ul>

      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm font-bold text-yellow-800">
          {application("stepone.instructions.note")}
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
                  <FormLabel className="text-[18px] font-lexend">
                    {application("stepone.form.cityId")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={application(
                        "stepone.form.cityIdPlaceHolder"
                      )}
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
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[18px] font-lexend">
                    {application("stepone.form.dateOfBirth")}
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel className="text-[18px] font-lexend">
                    {application("stepone.form.MonthlyIncome")}
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
                  <FormLabel className="text-[18px] font-lexend">
                    {application("stepone.form.Address")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={application(
                        "stepone.form.AddressPlaceHolder"
                      )}
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
              name="educationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[18px] font-lexend">
                    {application("stepone.form.EducationLevel")}
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="">Select</option>
                      <option value="none">
                        {application("stepone.form.educationOptions.none")}
                      </option>
                      <option value="primary">
                        {application("stepone.form.educationOptions.primary")}
                      </option>
                      <option value="secondary">
                        {application("stepone.form.educationOptions.secondary")}
                      </option>
                      <option value="Diploma">
                        {application("stepone.form.educationOptions.diploma")}
                      </option>
                      <option value="Bachelor">
                        {application("stepone.form.educationOptions.bachelor")}
                      </option>
                      <option value="Master">
                        {application("stepone.form.educationOptions.master")}
                      </option>
                      <option value="Doctorate">
                        {application("stepone.form.educationOptions.doctorate")}
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
                  <FormLabel className="text-[18px] font-lexend">
                    {application("stepone.form.occupation")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={application(
                        "stepone.form.occupationPlaceholder"
                      )}
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
              name="spouseCityIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[18px] font-lexend">
                    {application("stepone.form.spouseCityIdNumber")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={application(
                        "stepone.form.spouseCityIdNumberPlaceholder"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="preferredChildren.ageRange.min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-lexend">
                    {application("stepone.form.preferredChildAgeMin")}
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

            <FormField
              control={form.control}
              name="preferredChildren.ageRange.max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-lexend">
                    {application("stepone.form.preferredChildAgeMax")}
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

            <FormField
              control={form.control}
              name="preferredChildren.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-lexend">
                    {application("stepone.form.preferredNumberOfChildren")}
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
                  <FormLabel className="text-[18px] font-lexend">
                    {application("stepone.form.preferredChildGender")}
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="ANY">
                        {application("stepone.form.GenderOptions.any")}
                      </option>
                      <option value="MALE">
                        {application("stepone.form.GenderOptions.male")}
                      </option>
                      <option value="FEMALE">
                        {application("stepone.form.GenderOptions.female")}
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1  gap-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[18px] font-lexend">
                    {application("stepone.form.id")}*
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
                  <FormLabel className="text-[18px] font-lexend">
                    {application("stepone.form.birthCertificate")}*
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

          <div className="grid grid-cols-1  gap-4">
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[18px] font-lexend">
                    {application("stepone.form.income")}*
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

          {/* <div>
            <Label htmlFor="maritalStatus">Marital Status *</Label>
            <select
              id="maritalStatus"
              value={formData.maritalStatus}
              onChange={(e) =>
                handleInputChange("maritalStatus", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select marital status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>

          {formData.maritalStatus === "married" && (
            <div>
              <Label htmlFor="spouseInfo">Spouse Information</Label>
              <Textarea
                id="spouseInfo"
                value={formData.spouseInfo}
                onChange={(e) =>
                  handleInputChange("spouseInfo", e.target.value)
                }
                placeholder="Please provide your spouse's full name, occupation, and employer"
                rows={3}
              />
            </div>
          )} */}

          <div className="flex justify-end">
            <Button type="submit" className="px-8">
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </StepFormWrapper>
  );
}
