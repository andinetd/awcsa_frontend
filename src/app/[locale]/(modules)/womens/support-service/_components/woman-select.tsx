"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetWomenProfilesQuery } from "@/hooks/womens";
import { Loader2 } from "lucide-react";

import { WomenProfile } from "@/api/womens/women-profile";
import { useTranslations } from "next-intl";

interface WomanSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export default function WomanSelect({
  value,
  onValueChange,
  placeholder,
}: WomanSelectProps) {
  const { data: profiles, isLoading } = useGetWomenProfilesQuery();
  const t = useTranslations("womens");

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        {t("common.loading")}
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue
          placeholder={placeholder || t("support.history.selectWoman")}
        />
      </SelectTrigger>
      <SelectContent>
        {profiles?.map((profile: WomenProfile) => (
          <SelectItem key={profile.id} value={profile.clientId.toString()}>
            {profile.client.firstName} {profile.client.lastName} (
            {profile.client.cityIdNumber})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
