"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { CardFooter } from "@/components/ui/card";
import { MapPin, CalendarDays, Users } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { Edir, EdirStatus } from "@/api/social-affairs/edir";
import { useTranslations } from "next-intl";

interface EdirCardProps {
  edir: Edir;
  onViewDetails?: (edir: Edir) => void;
}

const statusStyles: Record<EdirStatus, string> = {
  ACTIVE: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
  EXPIRED: "bg-amber-50 text-amber-700 border-amber-200",
  REVOKED: "bg-rose-50 text-rose-700 border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

const EdirCard: React.FC<EdirCardProps> = ({ edir }) => {
  const t = useTranslations("social-affairs.edir.edir.list");
  const router = useRouter();
  const totalMembers =
    (edir.managementMale || 0) +
    (edir.managementFemale || 0) +
    (edir.generalMale || 0) +
    (edir.generalFemale || 0);

  const handleViewDetails = () => {
    router.push(`/social-affairs/edir/${edir.id}`);
  };

  return (
    <Card className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <CardHeader className="p-4 pb-3 border-b border-[#E3E7EB]">
          <CardTitle className="flex justify-between items-start gap-2">
            <span className="text-sm font-bold text-[#0B1F3A] leading-tight line-clamp-1">
              {edir.name}
            </span>
            {edir.status && (
              <span
                className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-xs border shrink-0 ${
                  statusStyles[edir.status] || "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {t(`status.${edir.status}`)}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {edir.subCity}, {t("woreda")} {edir.woreda}, {t("kebele")}{" "}
              {edir.kebele}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono">
              {Intl.NumberFormat().format(totalMembers || 0)} {t("members")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono text-slate-500">
              {t("established")}:{" "}
              {new Date(edir.establishmentDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          {edir.registrationNumber && (
            <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
              <span className="font-semibold text-slate-700">{t("registrationNumber")}:</span>{" "}
              {edir.registrationNumber}
              {edir.renewedForYear ? ` • ${t("renewedForYear")} ${edir.renewedForYear}` : ""}
            </div>
          )}
        </CardContent>
      </div>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs rounded-xs border-[#E3E7EB] hover:bg-[#E8F2FA] hover:text-[#1769AA] hover:border-[#BCD5EA] transition-colors"
          onClick={handleViewDetails}
        >
          {t("buttons.viewDetails")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EdirCard;
