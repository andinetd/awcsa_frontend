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
  const tSubCities = useTranslations("subCities.names");
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
    (s) => !lockedSubCity || (s?.name || "").trim().toLowerCase() === (lockedSubCity || "").trim().toLowerCase()
  );
  const knownNames = new Set(known.map((s) => s.name));
  const extras = lockedSubCity
    ? (known.length === 0 ? [lockedSubCity] : [])
    : [...new Set(extraOptions.filter((o) => !!o && !knownNames.has(o)))];

  const isDisabled = disabled || isLoading || !!lockedSubCity;

  const getSubCityLabel = (name: string) => {
    if (!name) return "";
    try {
      if (tSubCities.has(name as any)) {
        return tSubCities(name as any);
      }
      return name;
    } catch {
      return name;
    }
  };

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
        {known
          .filter((subCity) => !!subCity?.name)
          .map((subCity) => (
            <SelectItem key={subCity.id} value={subCity.name}>
              {getSubCityLabel(subCity.name)}
            </SelectItem>
          ))}
        {extras
          .filter((option) => !!option)
          .map((option) => (
            <SelectItem key={option} value={option}>
              {getSubCityLabel(option)}
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

  const DEFAULT_WOREDA_COUNT = 20;
  const subCityRef = (subCities || []).find(
    (s) => (s?.name || "").trim().toLowerCase() === (subCity || "").trim().toLowerCase()
  );

  const defaultWoredaList = Array.from({ length: DEFAULT_WOREDA_COUNT }, (_, i) => ({
    id: i + 1,
    code: String(i + 1).padStart(2, "0"),
    subCityId: subCityRef?.id ?? 0,
  }));

  const baseWoredas =
    subCityRef?.woredas && subCityRef.woredas.length >= DEFAULT_WOREDA_COUNT
      ? subCityRef.woredas
      : defaultWoredaList;

  const filteredWoredas = baseWoredas.filter(
    (w) =>
      !lockedWoreda ||
      String(w.code) === String(lockedWoreda) ||
      Number(w.code) === Number(lockedWoreda)
  );
  const displayWoredas =
    lockedWoreda && filteredWoredas.length === 0
      ? [{ id: -1, code: String(lockedWoreda), subCityId: 0 }]
      : filteredWoredas;

  const isDisabled = disabled || (!subCity && !lockedWoreda) || !!lockedWoreda;

  const getWoredaLabel = (code: string | number) => {
    try {
      return t("woredaCode", { code });
    } catch {
      return `Woreda ${code}`;
    }
  };

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
        {displayWoredas
          .filter((woreda) => !!woreda?.code)
          .map((woreda) => (
            <SelectItem key={woreda.id} value={String(woreda.code)}>
              {getWoredaLabel(woreda.code)}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}