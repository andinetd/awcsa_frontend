"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { trainingSchema, TrainingSchemaType } from "@/schemas/beneficiaries";
import {
  useRegisterTrainingMutation,
  useGetBeneficiariesQuery,
} from "@/hooks/beneficiaries";

interface TrainingFormProps {
  cityIdNumber?: string;
  trigger?: React.ReactNode;
}

export default function TrainingForm({
  cityIdNumber,
  trigger,
}: TrainingFormProps) {
  const [open, setOpen] = React.useState(false);
  const registerMutation = useRegisterTrainingMutation();
  const { data: disabled } = useGetBeneficiariesQuery("DISABLED");
  const { data: elderly } = useGetBeneficiariesQuery("ELDERLY");

  const beneficiaries = [...(disabled || []), ...(elderly || [])];
  const form = useForm<TrainingSchemaType>({
    resolver: zodResolver(trainingSchema) as any,
    defaultValues: {
      cityIdNumber: cityIdNumber || "",
      trainingType: "AGRICULTURE",
      provider: "",
      startDate: "",
      completionDate: "",
      dropoutDate: "",
      dropoutReason: "",
      hasCOC: false,
      remark: "",
    },
  });

  const onSubmit = (values: TrainingSchemaType) => {
    registerMutation.mutate(values as any, {
      onSuccess: () => {
        toast.success("Training record registered successfully");
        form.reset();
        setOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to register training");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Add Record
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-lexend flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            Add Training Record
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            {!cityIdNumber && (
              <FormField
                control={form.control}
                name="cityIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beneficiary</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a beneficiary" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {beneficiaries.map((b) => (
                          <SelectItem key={b.id} value={b.cityIdNumber}>
                            {b.firstName} {b.lastName} ({b.cityIdNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="trainingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select training type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGRICULTURE">Agriculture</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                      <SelectItem value="HOTEL_HOSPITALITY">
                        Hotel & Hospitality
                      </SelectItem>
                      <SelectItem value="HOUSE_CONSTRUCTION">
                        House Construction
                      </SelectItem>
                      <SelectItem value="AUTOMOTIVE">Automotive</SelectItem>
                      <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                      <SelectItem value="ICT">ICT</SelectItem>
                      <SelectItem value="MUNICIPALITY_ADMIN">
                        Municipality Admin
                      </SelectItem>
                      <SelectItem value="ROAD_CONSTRUCTION">
                        Road Construction
                      </SelectItem>
                      <SelectItem value="AGRO_PROCESSING">
                        Agro Processing
                      </SelectItem>
                      <SelectItem value="FURNITURE_MAKING">
                        Furniture Making
                      </SelectItem>
                      <SelectItem value="TEXTILE_GARMENT">
                        Textile & Garment
                      </SelectItem>
                      <SelectItem value="LEATHER_WORK">Leather Work</SelectItem>
                      <SelectItem value="METAL_WORKING">
                        Metal Working
                      </SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider / Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter provider name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="completionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dropoutDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dropout Date (If any)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dropoutReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dropout Reason</FormLabel>
                    <FormControl>
                      <Input placeholder="..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hasCOC"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Has COC Certificate</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Add any notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Training
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
