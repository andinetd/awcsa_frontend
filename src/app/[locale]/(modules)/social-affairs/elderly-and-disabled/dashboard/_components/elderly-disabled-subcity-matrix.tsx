"use client";

import React from "react";
import { Building2, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

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

const ADDIS_ABABA_SUBCITIES = [
  "Bole",
  "Yeka",
  "Kirkos",
  "Arada",
  "Gulele",
  "Lideta",
  "Nifas Silk-Lafto",
  "Kolfe Keranio",
  "Akaky Kaliti",
  "Addis Ketema",
  "Lemi Kura",
];

const SUBCITY_KEY_MAP: Record<string, string> = {
  "bole": "bole",
  "yeka": "yeka",
  "kirkos": "kirkos",
  "arada": "arada",
  "gulele": "gulele",
  "lideta": "lideta",
  "nifas silk-lafto": "nifasSilk",
  "nifassilk": "nifasSilk",
  "nifas silk": "nifasSilk",
  "kolfe keranio": "kolfeKeranio",
  "kolfe": "kolfeKeranio",
  "akaky kaliti": "akakiKality",
  "akaki kality": "akakiKality",
  "addis ketema": "addisKetema",
  "lemi kura": "lemiKura",
};

export function ElderlyDisabledSubCityMatrix({
  beneficiariesList = [],
  servicesList = [],
}: ElderlyDisabledSubCityMatrixProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.dashboard.matrix");
  const tSub = useTranslations("social-affairs.subCities");

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

    ADDIS_ABABA_SUBCITIES.forEach((name) => {
      const lower = name.toLowerCase();
      map[lower] = {
        name,
        subCityKey: SUBCITY_KEY_MAP[lower] || lower,
        elderly: 0,
        disabled: 0,
        services: 0,
      };
    });

    beneficiariesList.forEach((b) => {
      const rawSc = (b.subCity || b.address || "").trim();
      const scKey = rawSc.toLowerCase();
      if (!scKey) return;

      if (!map[scKey]) {
        map[scKey] = {
          name: rawSc,
          subCityKey: SUBCITY_KEY_MAP[scKey] || scKey,
          elderly: 0,
          disabled: 0,
          services: 0,
        };
      }

      if (b.clientCategory === "ELDERLY") {
        map[scKey].elderly += 1;
      } else {
        map[scKey].disabled += 1;
      }
    });

    servicesList.forEach((s) => {
      const rawSc = (s.subCity || "").trim();
      const scKey = rawSc.toLowerCase();
      if (!scKey) return;

      if (!map[scKey]) {
        map[scKey] = {
          name: rawSc,
          subCityKey: SUBCITY_KEY_MAP[scKey] || scKey,
          elderly: 0,
          disabled: 0,
          services: 0,
        };
      }

      map[scKey].services += 1;
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
      return tSub(key as any);
    } catch {
      return defaultName;
    }
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
