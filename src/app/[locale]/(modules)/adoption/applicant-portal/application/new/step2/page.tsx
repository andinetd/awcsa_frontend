"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Users, FileText, User } from "lucide-react";
import { StepFormWrapper } from "../../../_components/step-form-wrapper";
import {
  ApplicationStepTwoSchema,
  ApplicationStepTwoType,
} from "@/schemas/application/applicationStepsSchema";
import { FileDragAndDrop } from "@/components/custom/file-dropzone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

export default function Step2Page() {
  const router = useRouter();
  const application = useTranslations("applicationMessages");

  const [formData, setFormData] = useState({
    hasConvictions: "",
    convictionDetails: "",
    hasChildAbuse: "",
    reference1Name: "",
    reference1Phone: "",
    reference1Relationship: "",
    reference2Name: "",
    reference2Phone: "",
    reference2Relationship: "",
    reference3Name: "",
    reference3Phone: "",
    reference3Relationship: "",
    previousAdoption: "",
    adoptionExperience: "",
    medicalConditions: "",
    medications: "",
  });

  const form = useForm<ApplicationStepTwoType>({
    resolver: zodResolver(ApplicationStepTwoSchema),
    defaultValues: {},
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    localStorage.setItem("step2Data", JSON.stringify(formData));
    router.push("/adoption/applicant-portal/application/new/step3");
  };

  const handleBack = () => {
    router.push("/adoption/applicant-portal/application/new/step1");
  };
  async function onSubmit(values: ApplicationStepTwoType) {
    //TODO: handle submission here
    console.log("values submited: ", { values });
    router.push("/adoption/applicant-portal/application/new/step3");
    // setData(values);
  }

  const instructions = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <User className="h-5 w-5" />
        <h3 className="font-semibold">
          {application("steptwo.instructions.title")}
        </h3>
      </div>

      <ul className="space-y-2 font-lexend text-gray-600">
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
          <span>{application("steptwo.instructions.one")}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2  bg-primary rounded-full mt-2 flex-shrink-0"></span>
          <span>{application("steptwo.instructions.two")}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2  bg-primary rounded-full mt-2 flex-shrink-0"></span>
          <span> {application("steptwo.instructions.three")} </span>
        </li>
      </ul>

      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm font-bold text-yellow-800">
          {application("steptwo.instructions.note")}
        </p>
      </div>
    </div>
  );

  return (
    <StepFormWrapper instructions={instructions}>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="medical"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[18px] font-lexend">
                    {application("steptwo.form.medical")}*
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
                      error={form.formState.errors.medical?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />{" "}
          </div>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="criminalClearance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[18px] font-lexend">
                    {application("steptwo.form.criminal")}*
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
                      error={form.formState.errors.criminalClearance?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1  gap-4">
            <FormField
              control={form.control}
              name="spouseAgreement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[18px] font-lexend">
                    {application("steptwo.form.spouseAgreement")}*
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
                      error={form.formState.errors.spouseAgreement?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Previous Step
            </Button>
            <Button type="submit" className="px-8">
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </StepFormWrapper>
  );
}
