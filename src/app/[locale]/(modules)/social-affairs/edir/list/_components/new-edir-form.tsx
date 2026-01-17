"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useCreateEdirMutation,
  useUpdateEdirMutation,
} from "@/hooks/social-affairs";
import { newEdirSchema, NewEdirSchemaType } from "@/schemas/edir";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edir } from "@/api/social-affairs/edir";

interface NewEdirFormProps {
  initialData?: Edir;
  edirId?: number;
  trigger?: React.ReactNode;
}

export default function NewEdirForm({
  initialData,
  edirId,
  trigger,
}: NewEdirFormProps) {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateEdirMutation();
  const updateMutation = useUpdateEdirMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isEditMode = !!edirId;

  // Helper to map array reasons to object
  const mapReasonsToObject = (reasons: string[] = []) => {
    return {
      religionBased: reasons.includes("RELIGION"),
      workplaceBased: reasons.includes("WORKPLACE"),
      birthplaceBased: reasons.includes("BIRTHPLACE"),
      professionBased: reasons.includes("PROFESSION"),
      residenceBased: reasons.includes("RESIDENCE"),
      genderBased: reasons.includes("GENDER"),
      ethnicityBased: reasons.includes("ETHNICITY"),
      other: "", // Mapped separately or not strictly mapped from array if it just contains "OTHER"
    };
  };

  const form = useForm<NewEdirSchemaType>({
    resolver: zodResolver(newEdirSchema) as any,
    defaultValues: {
      name: "",
      establishmentDate: new Date().toISOString().split("T")[0],
      formationMethod: "WILL_OF_PEOPLE",
      subCity: "",
      woreda: "",
      kebele: "",
      houseNumber: "",
      specificLocation: "",
      members: {
        management: { male: 0, female: 0, total: 0 },
        general: { male: 0, female: 0, total: 0 },
      },
      establishmentReasons: {
        religionBased: false,
        workplaceBased: false,
        birthplaceBased: false,
        professionBased: false,
        residenceBased: false,
        genderBased: false,
        ethnicityBased: false,
        other: "",
      },
      bankAccountNumber: "",
      monthlyPaymentDetails: "",
      remark: "",
    },
  });

  // Populate form with initial data when available
  useEffect(() => {
    if (initialData) {
      // Create a date object or use string directly if formatted correctly 'YYYY-MM-DD'
      const dateStr = initialData.establishmentDate
        ? new Date(initialData.establishmentDate).toISOString().split("T")[0]
        : "";

      form.reset({
        name: initialData.name,
        establishmentDate: dateStr,
        formationMethod: initialData.formationMethod as any,
        subCity: initialData.subCity,
        woreda: initialData.woreda,
        kebele: initialData.kebele,
        houseNumber: initialData.houseNumber,
        specificLocation: initialData.specificLocation,
        members: {
          management: {
            male: initialData.managementMale || 0,
            female: initialData.managementFemale || 0,
            total:
              (initialData.managementMale || 0) +
              (initialData.managementFemale || 0),
          },
          general: {
            male: initialData.generalMale || 0,
            female: initialData.generalFemale || 0,
            total:
              (initialData.generalMale || 0) + (initialData.generalFemale || 0),
          },
        },
        establishmentReasons: {
          ...mapReasonsToObject(initialData.establishmentReasons),
          other: initialData.otherReasonDescription || "",
        },
        bankAccountNumber: initialData.bankAccountNumber,
        monthlyPaymentDetails: initialData.monthlyPaymentDetails,
        remark: initialData.remark || "",
      });
    }
  }, [initialData, form]);

  function onSubmit(values: NewEdirSchemaType) {
    // Transform nested form data to flat structure expected by API
    const apiPayload = {
      ...values,
      managementMale: values.members.management.male,
      managementFemale: values.members.management.female,
      generalMale: values.members.general.male,
      generalFemale: values.members.general.female,
      establishmentReasons: values.establishmentReasons, // Send as object as required by backend
      otherReasonDescription: values.establishmentReasons.other,
      // Remove nested objects meant for form state only
    };

    if (isEditMode && edirId) {
      updateMutation.mutate(
        { id: edirId, data: apiPayload },
        {
          onSuccess: () => {
            setOpen(false);
            toast.success("Edir updated successfully");
          },
        }
      );
    } else {
      createMutation.mutate(apiPayload as any, {
        onSuccess: () => {
          setOpen(false);
          form.reset(); // Only reset on create success
          toast.success("Edir created successfully");
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Edir
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update Edir Association" : "Register New Edir"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details of the Edir association."
              : "Enter the details of the new Edir association."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edir Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Edir Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Establishment Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="formationMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formation Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GOVERNMENT_ISSUED">
                            Government Issued
                          </SelectItem>
                          <SelectItem value="WILL_OF_PEOPLE">
                            Will of People
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="subCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub City</FormLabel>
                      <FormControl>
                        <Input placeholder="Sub City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="woreda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Woreda</FormLabel>
                      <FormControl>
                        <Input placeholder="Woreda" {...field} />
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
                      <FormLabel>Kebele</FormLabel>
                      <FormControl>
                        <Input placeholder="Kebele" {...field} />
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
                      <FormLabel>House Number</FormLabel>
                      <FormControl>
                        <Input placeholder="House No." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specificLocation"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Specific Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Near Church" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Members Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Membership Statistics</h3>
              <div className="space-y-2">
                <FormLabel>Management Members</FormLabel>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="members.management.male"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Male</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members.management.female"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Female</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members.management.total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Total</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <FormLabel>General Members</FormLabel>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="members.general.male"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Male</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members.general.female"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Female</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members.general.total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Total</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Financials & Remarks */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Financials & Remarks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bankAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Account No." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyPaymentDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Contribution</FormLabel>
                      <FormControl>
                        <Input placeholder="Amount/Details" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Establishment Reasons - Checkboxes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Establishment Reasons</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="establishmentReasons.residenceBased"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Residence Based</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishmentReasons.religionBased"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Religion Based</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishmentReasons.workplaceBased"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Workplace Based</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishmentReasons.genderBased"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Gender Based</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishmentReasons.ethnicityBased"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Ethnicity Based</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEditMode
                    ? "Updating..."
                    : "Registering..."
                  : isEditMode
                  ? "Update Edir"
                  : "Register Edir"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
