"use client";

import React from "react";
import { Building2, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";

interface SubCityRow {
  name: string;
  subCityKey: string;
  elderlyCount: number;
  disabledCount: number;
  totalBeneficiaries: number;
  servicesProvided: number;
  coverageStatus: "COMPREHENSIVE" | "ACTIVE" | "PENDING AID" | "NO RECORDS";
}

interface ElderlyDisabledSubCityMatrixProps {
  beneficiariesList?: any[];
  servicesList?: any[];
}

const CANONICAL_SUBCITIES: { name: string; key: string }[] = [
  { name: "Bole", key: "bole" },
  { name: "Yeka", key: "yeka" },
  { name: "Kirkos", key: "kirkos" },
  { name: "Arada", key: "arada" },
  { name: "Gulele", key: "gulele" },
  { name: "Lideta", key: "lideta" },
  { name: "Nifas Silk-Lafto", key: "nifasSilk" },
  { name: "Kolfe Keranio", key: "kolfeKeranio" },
  { name: "Akaky Kaliti", key: "akakiKality" },
  { name: "Addis Ketema", key: "addisKetema" },
  { name: "Lemi Kura", key: "lemiKura" },
];

const SUBCITY_ALIAS_MAP: Record<string, string> = {
  "bole": "bole",
  "yeka": "yeka",
  "kirkos": "kirkos",
  "arada": "arada",
  "gulele": "gulele",
  "gullele": "gulele",
  "lideta": "lideta",
  "nifas silk-lafto": "nifasSilk",
  "nifas silk lafto": "nifasSilk",
  "nifassilk": "nifasSilk",
  "nifas silk": "nifasSilk",
  "nifas-silk": "nifasSilk",
  "kolfe keranio": "kolfeKeranio",
  "kolfe-keranio": "kolfeKeranio",
  "kolfe": "kolfeKeranio",
  "akaky kaliti": "akakiKality",
  "akaki kality": "akakiKality",
  "akaki kaliti": "akakiKality",
  "akaky-kaliti": "akakiKality",
  "akaki-kality": "akakiKality",
  "addis ketema": "addisKetema",
  "addis-ketema": "addisKetema",
  "lemi kura": "lemiKura",
  "lemi-kura": "lemiKura",
};

export function ElderlyDisabledSubCityMatrix({
  beneficiariesList = [],
  servicesList = [],
}: ElderlyDisabledSubCityMatrixProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.dashboard.matrix");
  const tSub = useTranslations("subCities");
  const { userSubCity } = useJurisdictionScope();

  const subCities: SubCityRow[] = React.useMemo(() => {
    const map: Record<
      string,
      {
        name: string;
        subCityKey: string;
        elderly: number;
        disabled: number;
        services: number;
      }
    > = {};

    const targetCanonical = userSubCity
      ? CANONICAL_SUBCITIES.filter(
          (c) =>
            c.name.toLowerCase() === userSubCity.toLowerCase() ||
            c.name.toLowerCase().replace(/[^a-z]/g, "") ===
              userSubCity.toLowerCase().replace(/[^a-z]/g, "")
        ).length > 0
        ? CANONICAL_SUBCITIES.filter(
            (c) =>
              c.name.toLowerCase() === userSubCity.toLowerCase() ||
              c.name.toLowerCase().replace(/[^a-z]/g, "") ===
                userSubCity.toLowerCase().replace(/[^a-z]/g, "")
          )
        : [{ name: userSubCity, key: userSubCity.toLowerCase().replace(/[^a-z]/g, "") }]
      : CANONICAL_SUBCITIES;

    targetCanonical.forEach(({ name, key }) => {
      map[key] = {
        name,
        subCityKey: key,
        elderly: 0,
        disabled: 0,
        services: 0,
      };
    });

    const resolveKey = (raw: string): string | null => {
      if (!raw) return null;
      const clean = raw.toLowerCase().trim();
      if (!clean) return null;

      // Check direct alias match
      if (SUBCITY_ALIAS_MAP[clean]) {
        return SUBCITY_ALIAS_MAP[clean];
      }

      // Check if any alias substring is present (e.g. "addis ababa, ethiopia" or "Bole Sub City")
      for (const [alias, canonical] of Object.entries(SUBCITY_ALIAS_MAP)) {
        if (clean.includes(alias)) {
          return canonical;
        }
      }

      return null;
    };

    beneficiariesList.forEach((b) => {
      const rawSc = (b.subCity || b.address || "").trim();
      const resolvedKey = resolveKey(rawSc);
      if (!resolvedKey) return;

      if (!map[resolvedKey]) {
        if (userSubCity) return;
        map[resolvedKey] = {
          name: rawSc,
          subCityKey: resolvedKey,
          elderly: 0,
          disabled: 0,
          services: 0,
        };
      }

      if (b.clientCategory === "ELDERLY") {
        map[resolvedKey].elderly += 1;
      } else {
        map[resolvedKey].disabled += 1;
      }
    });

    servicesList.forEach((s) => {
      const rawSc = (s.subCity || "").trim();
      const resolvedKey = resolveKey(rawSc);
      if (!resolvedKey) return;

      if (!map[resolvedKey]) {
        if (userSubCity) return;
        map[resolvedKey] = {
          name: rawSc,
          subCityKey: resolvedKey,
          elderly: 0,
          disabled: 0,
          services: 0,
        };
      }

      map[resolvedKey].services += 1;
    });

    return Object.values(map).map((sc) => {
      const total = sc.elderly + sc.disabled;
      let status: SubCityRow["coverageStatus"] = "NO RECORDS";

      if (total > 0) {
        if (sc.services >= total) status = "COMPREHENSIVE";
        else if (sc.services > 0) status = "ACTIVE";
        else status = "PENDING AID";
      }

      return {
        name: sc.name,
        subCityKey: sc.subCityKey,
        elderlyCount: sc.elderly,
        disabledCount: sc.disabled,
        totalBeneficiaries: total,
        servicesProvided: sc.services,
        coverageStatus: status,
      };
    });
  }, [beneficiariesList, servicesList]);

  const totalElderly = subCities.reduce((a, b) => a + b.elderlyCount, 0);
  const totalDisabled = subCities.reduce((a, b) => a + b.disabledCount, 0);
  const totalCensus = subCities.reduce((a, b) => a + b.totalBeneficiaries, 0);
  const totalServices = subCities.reduce((a, b) => a + b.servicesProvided, 0);

  const getSubCityLabel = (key: string, defaultName: string) => {
    try {
      const translated = tSub(key as any);
      if (translated && !translated.startsWith("subCities.")) {
        return translated;
      }
    } catch {
      // ignore
    }
    try {
      const translatedName = tSub(`names.${defaultName}` as any);
      if (translatedName && !translatedName.startsWith("subCities.names.")) {
        return translatedName;
      }
    } catch {
      // ignore
    }
    return defaultName;
  };

  const getStatusLabel = (status: SubCityRow["coverageStatus"]) => {
    switch (status) {
      case "COMPREHENSIVE":
        return t("statusComprehensive");
      case "ACTIVE":
        return t("statusActive");
      case "PENDING AID":
        return t("statusPendingAid");
      case "NO RECORDS":
      default:
        return t("statusNoRecords");
    }
  };

  return (
    <div className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-[#E3E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-[#1769AA]" />
          <div>
            <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide font-mono">
              {t("title")}
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="size-2 rounded-full bg-emerald-500" />
            {t("subCitiesBadge")}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-[#E3E7EB] text-slate-600 font-bold uppercase text-[11px]">
            <tr>
              <th className="py-2.5 px-3">{t("colSubCity")}</th>
              <th className="py-2.5 px-3 text-right">{t("colElderly")}</th>
              <th className="py-2.5 px-3 text-right">{t("colDisabled")}</th>
              <th className="py-2.5 px-3 text-right">{t("colTotalCensus")}</th>
              <th className="py-2.5 px-3 text-right">{t("colServicesDelivered")}</th>
              <th className="py-2.5 px-3 text-center">{t("colProtectionCoverage")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E7EB]">
            {subCities.map((row) => (
              <tr key={row.name} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="size-3 text-slate-400" />
                  <span>{getSubCityLabel(row.subCityKey, row.name)}</span>
                </td>
                <td className="py-2 px-3 text-right text-slate-700">
                  {row.elderlyCount.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-slate-700">
                  {row.disabledCount.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right font-bold text-[#0B1F3A]">
                  {row.totalBeneficiaries.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                  {row.servicesProvided.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-center">
                  <Badge
                    variant="outline"
                    className={`rounded-xs text-[10px] uppercase font-bold tracking-wider font-mono border ${
                      row.coverageStatus === "COMPREHENSIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : row.coverageStatus === "ACTIVE"
                        ? "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]"
                        : row.coverageStatus === "PENDING AID"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-50 text-slate-400 border-slate-200"
                    }`}
                  >
                    {getStatusLabel(row.coverageStatus)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50/80 border-t-2 border-[#E3E7EB] font-bold text-slate-900">
            <tr>
              <td className="py-2.5 px-3 uppercase text-[11px]">{t("totalCensusLabel")}</td>
              <td className="py-2.5 px-3 text-right text-slate-800">{totalElderly.toLocaleString()}</td>
              <td className="py-2.5 px-3 text-right text-slate-800">{totalDisabled.toLocaleString()}</td>
              <td className="py-2.5 px-3 text-right text-[#0B1F3A]">{totalCensus.toLocaleString()}</td>
              <td className="py-2.5 px-3 text-right text-emerald-700">{totalServices.toLocaleString()}</td>
              <td className="py-2.5 px-3 text-center text-[10px] text-slate-500 font-normal">
                {totalCensus > 0
                  ? t("coverageRatio", {
                      ratio: Math.round((totalServices / totalCensus) * 100),
                    })
                  : t("noRecords")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
