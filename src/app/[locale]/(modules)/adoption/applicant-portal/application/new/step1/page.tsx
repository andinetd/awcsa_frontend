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
} from "@/components/ui/form";
import {
  ApplicationStepOneSchema,
  ApplicationStepOneType,
} from "@/schemas/application/applicationStepsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

export default function Step1Page() {
  const router = useRouter();
  const application = useTranslations("applicationMessages");

  const handleInputChange = (field: string, value: string) => {
    // setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Save to localStorage or state management
    // localStorage.setItem("step1Data", JSON.stringify(formData));
  };

  const form = useForm<ApplicationStepOneType>({
    resolver: zodResolver(ApplicationStepOneSchema),
    defaultValues: {},
  });

  async function onSubmit(values: ApplicationStepOneType) {
    //TODO: handle submission here
    console.log("values submited: ", { values });
    router.push("/adoption/applicant-portal/application/new/step2");
    // setData(values);
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
                      acceptedFileTypes={
                        [
                          // ".pdf",
                          // ".docx",
                          // ".pptx",
                          // ".xlsx",
                          // ".odt",
                          // ".odp",
                          // ".ods",
                        ]
                      }
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
                      acceptedFileTypes={
                        [
                          // "png",
                          // ".pdf",
                          // ".docx",
                          // ".pptx",
                          // ".xlsx",
                          // ".odt",
                          // ".odp",
                          // ".ods",
                        ]
                      }
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
                      acceptedFileTypes={
                        [
                          // "png",
                          // ".pdf",
                          // ".docx",
                          // ".pptx",
                          // ".xlsx",
                          // ".odt",
                          // ".odp",
                          // ".ods",
                        ]
                      }
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
            <Button onClick={handleNext} className="px-8">
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </StepFormWrapper>
  );
}
