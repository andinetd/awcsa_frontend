"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetServiceTypesQuery } from "@/hooks/support";
import { Loader2 } from "lucide-react";

interface ServiceTypeSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export default function ServiceTypeSelect({
  value,
  onValueChange,
}: ServiceTypeSelectProps) {
  const { data: serviceTypes, isLoading } = useGetServiceTypesQuery();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading service types...
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Service Type" />
      </SelectTrigger>
      <SelectContent>
        {serviceTypes?.map((type) => (
          <SelectItem key={type.id} value={type.id.toString()}>
            {type.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
