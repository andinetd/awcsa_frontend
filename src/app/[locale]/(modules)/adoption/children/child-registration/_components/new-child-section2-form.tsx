"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  NewChildformSchemaSection2,
  NewChildformTypeSection2,
} from "@/schemas/new-child-form-schema";
import { useNewChildFormStore } from "@/stores/new-child-registration-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function NewChildFormSectionTwo() {
  const router = useRouter();
  const store = useNewChildFormStore();

  const form = useForm<NewChildformTypeSection2>({
    resolver: zodResolver(NewChildformSchemaSection2),
    defaultValues: {},
  });

  const handleBack = (values: NewChildformTypeSection2) => {
    store.setData(values);
    router.push("/adoption/children/child-registration/section1");
  };

  async function onSubmit(values: NewChildformTypeSection2) {
    console.log("section 2 values submitted : ", { values });
    store.setData(values);
    router.push("/adoption/children/");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span>Addis Ababa City Administration</span>
          <span>·</span>
          <span>Women &amp; Social Affairs Bureau</span>
          <span>·</span>
          <span className="text-[#1769AA] font-semibold">
            Child Protection &amp; Care
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
              Child Registration (Step 2 of 2)
            </h1>
            <p className="text-xs text-slate-500">
              Enter finder identity, reporting officer credentials, care center recipient worker, and attending medical officers.
            </p>
          </div>
          <div className="px-2.5 py-1 bg-[#E8F2FA] border border-[#BCD5EA] rounded-xs text-[#1769AA] font-mono text-xs font-semibold w-fit">
            Step 2 / 2
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Child Founder Section */}
            <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs p-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-2">
                Child Founder Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="child_founder_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="child_founder_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Phone No
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="child_founder_house_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      House No
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const stringValue = e.target.value;
                          const numberValue =
                            stringValue === "" ? null : Number(stringValue);
                          field.onChange(numberValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="child_founder_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="child_founder_subcity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Sub City
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="child_found_woreda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Woreda
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Officer Details Section */}
            <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs p-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-2">
                Reporting Officer Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="officer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Officer Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="officer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Phone No
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="officer_id_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Badge / ID No
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="officer_responsibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      Responsibility / Role
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="officer_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="officer_subcity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Sub City
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="officer_woreda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Woreda
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Receiving Care Center Worker Section */}
            <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs p-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-2">
                Receiving Care Center Worker
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="care_center_worker_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Worker Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="care_center_worker_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Phone No
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="care_center_worker_id_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Staff ID No
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="care_center_worker_responsibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      Responsibility / Role
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="care_center_worker_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="care_center_worker_subcity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Sub City
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="care_center_worker_woreda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Woreda
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Health Officers Section */}
            <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs p-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-2">
                On-Duty Health Officers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="health_officer_1_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Primary Health Officer Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="heallth_officer_2_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Secondary Health Officer Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </div>

          {/* Navigation / Submit Action Bar */}
          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleBack(form.getValues())}
              className="rounded-xs text-xs font-medium h-8 border-[#E3E7EB] px-4 cursor-pointer"
            >
              Back to Step 1
            </Button>
            <Button
              type="submit"
              className="bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold rounded-xs text-xs h-8 px-6 shadow-2xs cursor-pointer"
            >
              Submit Registration
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
