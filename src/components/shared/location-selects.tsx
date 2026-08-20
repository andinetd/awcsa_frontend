"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSubCitiesQuery } from "@/hooks/social-affairs";

interface SubCitySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  extraOptions?: string[];
}

export function SubCitySelect({
  value,
  onValueChange,
  placeholder,
  extraOptions = [],
}: SubCitySelectProps) {
  const t = useTranslations("social-affairs.edir.location");
  const { data: subCities, isLoading } = useGetSubCitiesQuery();

  const known = subCities || [];
  const knownNames = new Set(known.map((s) => s.name));
  const extras = [...new Set(extraOptions.filter((o) => !knownNames.has(o)))];

  return (
    <Select
      value={value || undefined}
      onValueChange={onValueChange}
      disabled={isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? t("loading") : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {known.map((subCity) => (
          <SelectItem key={subCity.id} value={subCity.name}>
            {subCity.name}
          </SelectItem>
        ))}
        {extras.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface WoredaSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  subCity: string;
  placeholder: string;
}

export function WoredaSelect({
  value,
  onValueChange,
  subCity,
  placeholder,
}: WoredaSelectProps) {
  const t = useTranslations("social-affairs.edir.location");
  const { data: subCities, isLoading } = useGetSubCitiesQuery();

  const subCityRef = (subCities || []).find((s) => s.name === subCity);
  const woredas = subCityRef?.woredas || [];

  return (
    <Select
      value={value || undefined}
      onValueChange={onValueChange}
      disabled={isLoading || !subCityRef}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={isLoading ? t("loading") : placeholder}
        />
      </SelectTrigger>
      <SelectContent>
        {woredas.map((woreda) => (
          <SelectItem key={woreda.id} value={woreda.code}>
            {t("woredaCode", { code: woreda.code })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}