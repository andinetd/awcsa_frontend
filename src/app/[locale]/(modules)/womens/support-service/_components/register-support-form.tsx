"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  supportServiceSchema,
  SupportServiceSchemaType,
} from "@/schemas/support-service";
import { useRegisterSupportMutation } from "@/hooks/support";
import ServiceTypeSelect from "./service-type-select";
import WomanSelect from "./woman-select";

interface RegisterSupportFormProps {
  defaultClientId?: number;
  defaultAssociationId?: number;
}

export default function RegisterSupportForm({
  defaultClientId,
  defaultAssociationId,
}: RegisterSupportFormProps) {
  const [open, setOpen] = useState(false);
  const registerMutation = useRegisterSupportMutation();

  const form = useForm<SupportServiceSchemaType>({
    resolver: zodResolver(supportServiceSchema) as any,
    defaultValues: {
      serviceTypeId: 9007199254740991,
      clientId: defaultClientId,
      womenAssociationId: defaultAssociationId,
      provider: "",
      amountOrQuantity: "",
      dateProvided: new Date().toISOString().split("T")[0],
      facilitatorCityId: "",
      subCity: "",
      woreda: "",
      remark: "",
    },
  });

  function onSubmit(values: SupportServiceSchemaType) {
    registerMutation.mutate(values as any, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast.success("Support service registered successfully");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to register support service");
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Register Support Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register Support Service</DialogTitle>
          <DialogDescription>
            Register a new support service for a client or association.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Client or Association Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Beneficiary Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Woman Client</FormLabel>
                      <FormControl>
                        <WomanSelect
                          value={field.value?.toString()}
                          onValueChange={(value: string) =>
                            field.onChange(parseInt(value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="womenAssociationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Women Association ID (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter Association ID"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                * Please provide either a Woman Client ID or a Women Association
                ID.
              </p>
            </div>

            {/* Service & Provider Information */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium">
                Service & Provider Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serviceTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <FormControl>
                        <ServiceTypeSelect
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateProvided"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Provided</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter provider name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amountOrQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount or Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 500 ETB, 2 Boxes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location & Facilitator Information */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium">Location & Facilitator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="facilitatorCityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facilitator City ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter sub-city" {...field} />
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
                        <Input placeholder="Enter woreda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes or remarks..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
