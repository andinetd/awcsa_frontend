"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, ShieldCheck } from "lucide-react";
import { EdirCouncil, EdirStatus } from "@/api/social-affairs/edir";

const statusStyles: Record<EdirStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXPIRED: "bg-amber-50 text-amber-700 border-amber-200",
  REVOKED: "bg-rose-50 text-rose-700 border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-700 border-slate-200",
};

const levelStyles: Record<string, string> = {
  WOREDA: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
  SUB_CITY: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
  CITY: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
};

interface CouncilCardProps {
  council: EdirCouncil;
  onViewDetails: (council: EdirCouncil) => void;
}

export default function CouncilCard({
  council,
  onViewDetails,
}: CouncilCardProps) {
  const t = useTranslations("social-affairs.edir.councils");
  const memberCount = council._count?.memberEdirs ?? council.memberEdirs.length;

  return (
    <Card className="flex flex-col overflow-hidden rounded-xs border-[#E3E7EB] bg-white shadow-2xs hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b border-[#E3E7EB] bg-slate-50/30">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-bold text-[#0B1F3A] leading-tight">
            {council.name}
          </CardTitle>
          <ShieldCheck className="w-5 h-5 text-[#1769AA] shrink-0 mt-0.5" />
        </div>
        <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
          <Badge
            variant="outline"
            className={`font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border ${
              statusStyles[council.status] || "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {t(`status.${council.status}`)}
          </Badge>
          <Badge
            variant="outline"
            className={`font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border ${
              levelStyles[council.level] || "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {t(`level.${council.level}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 text-xs text-slate-600 flex-1 pt-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {council.subCity}
            {council.woreda ? ` • ${council.woreda}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {memberCount}{" "}
            {memberCount === 1 ? "member edir" : "member edirs"}
          </span>
        </div>
        {council.registrationNumber && (
          <div className="pt-1">
            <span className="font-mono text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded-xs border border-slate-200/80">
              {council.registrationNumber}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-3 border-t border-[#E3E7EB] bg-slate-50/20">
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#E8F2FA] hover:text-[#1769AA] hover:border-[#BCD5EA] transition-colors"
          onClick={() => onViewDetails(council)}
        >
          {t("buttons.viewDetails")}
        </Button>
      </CardFooter>
    </Card>
  );
}