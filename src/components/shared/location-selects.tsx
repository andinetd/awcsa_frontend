"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSubCitiesQuery } from "@/hooks/social-affairs";
import { useAuthStore } from "@/stores/auth-store";

interface SubCitySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  extraOptions?: string[];
  disabled?: boolean;
}

export function SubCitySelect({
  value,
  onValueChange,
  placeholder,
  extraOptions = [],
  disabled = false,
}: SubCitySelectProps) {
  const t = useTranslations("social-affairs.edir.location");
  const { data: subCities, isLoading } = useGetSubCitiesQuery();
  const orgUnit = useAuthStore((s) => s.orgUnit);

  const isWoreda = orgUnit?.type === "WOREDA";
  const isSubCity = orgUnit?.type === "OFFICE" || orgUnit?.type === "SUBCITY";
  const lockedSubCity = (isWoreda || isSubCity) && orgUnit?.subCity ? orgUnit.subCity : null;

  // Auto-set the user's assigned subCity if locked
  useEffect(() => {
    if (lockedSubCity && value !== lockedSubCity) {
      onValueChange(lockedSubCity);
    }
  }, [lockedSubCity, value, onValueChange]);

  const known = (subCities || []).filter(
    (s) => !lockedSubCity || s.name.toLowerCase() === lockedSubCity.toLowerCase()
  );
  const knownNames = new Set(known.map((s) => s.name));
  const extras = lockedSubCity
    ? (known.length === 0 ? [lockedSubCity] : [])
    : [...new Set(extraOptions.filter((o) => !knownNames.has(o)))];

  const isDisabled = disabled || isLoading || !!lockedSubCity;

  return (
    <Select
      value={value || undefined}
      onValueChange={onValueChange}
      disabled={isDisabled}
    >
      <SelectTrigger className={lockedSubCity ? "bg-slate-100 cursor-not-allowed" : ""}>
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
  disabled?: boolean;
}

export function WoredaSelect({
  value,
  onValueChange,
  subCity,
  placeholder,
  disabled = false,
}: WoredaSelectProps) {
  const t = useTranslations("social-affairs.edir.location");
  const { data: subCities, isLoading } = useGetSubCitiesQuery();
  const orgUnit = useAuthStore((s) => s.orgUnit);

  const isWoreda = orgUnit?.type === "WOREDA";
  const lockedWoreda = isWoreda && orgUnit?.woreda ? orgUnit.woreda : null;

  // Auto-set the user's assigned woreda if locked
  useEffect(() => {
    if (lockedWoreda && value !== lockedWoreda) {
      onValueChange(lockedWoreda);
    }
  }, [lockedWoreda, value, onValueChange]);

  const subCityRef = (subCities || []).find((s) => s.name === subCity);
  const baseWoredas = subCityRef?.woredas || [];
  const filteredWoredas = baseWoredas.filter(
    (w) => !lockedWoreda || String(w.code) === String(lockedWoreda)
  );
  const displayWoredas =
    lockedWoreda && filteredWoredas.length === 0
      ? [{ id: -1, code: String(lockedWoreda), subCityId: 0 }]
      : filteredWoredas;

  const isDisabled = disabled || isLoading || (!subCityRef && !lockedWoreda) || !!lockedWoreda;

  return (
    <Select
      value={value || undefined}
      onValueChange={onValueChange}
      disabled={isDisabled}
    >
      <SelectTrigger className={lockedWoreda ? "bg-slate-100 cursor-not-allowed" : ""}>
        <SelectValue
          placeholder={isLoading ? t("loading") : placeholder}
        />
      </SelectTrigger>
      <SelectContent>
        {displayWoredas.map((woreda) => (
          <SelectItem key={woreda.id} value={woreda.code}>
            {t("woredaCode", { code: woreda.code })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}