"use client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { NewCareCenterSchemaType } from "@/schemas/care-centers";
import { Building2, Eye, MapPin, Phone, Users } from "lucide-react";
import React from "react";
import { formatAge } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { uiTokens } from "@/styles/design-system";
import { cn } from "@/lib/utils";

interface CareCenterCardProps {
  careCenter: NewCareCenterSchemaType;
  onViewDetails: (careCenter: NewCareCenterSchemaType) => void;
}

const CareCenterCard: React.FC<CareCenterCardProps> = ({
  careCenter,
  onViewDetails,
}) => {
  const t = useTranslations("adoption");
  const isGov = careCenter.type === "GOVERNMENT";

  return (
    <div className="rounded-sm border border-[#E3E7EB] bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between border-l-3 border-l-[#1769AA] p-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-xs bg-[#E8F2FA] text-[#1769AA] flex items-center justify-center shrink-0">
              <Building2 className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
              {careCenter.name}
            </h3>
          </div>

          <span
            className={cn(
              uiTokens.statusTag.base,
              isGov ? uiTokens.statusTag.primary : uiTokens.statusTag.neutral,
              "shrink-0"
            )}
          >
            {t(`careCenters.types.${careCenter.type}`) || careCenter.type}
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-1.5 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="size-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {careCenter.region || "Addis Ababa"}, {careCenter.subCity || "Sub-City"} · Woreda {careCenter.woreda || "—"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="size-3.5 text-slate-400 shrink-0" />
            <span className="font-mono text-[11px]">{careCenter.phone || "—"}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Users className="size-3.5 text-slate-400 shrink-0" />
            <span>
              {t("careCenters.card.age") || "Age Range"}:{" "}
              <strong className="font-semibold text-slate-800">
                {formatAge(careCenter.childrenAgeRange.min)} - {formatAge(careCenter.childrenAgeRange.max)}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Footer action */}
      <div className="flex justify-end pt-3 mt-3 border-t border-[#E3E7EB]">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs px-2.5 text-slate-700 hover:text-[#1769AA] hover:bg-slate-50 border-[#E3E7EB] rounded-xs cursor-pointer shadow-none gap-1.5"
          onClick={() => onViewDetails(careCenter)}
        >
          <Eye className="size-3.5 text-slate-500" />
          <span>{t("careCenters.card.viewDetails") || "View Details"}</span>
        </Button>
      </div>
    </div>
  );
};

export default CareCenterCard;
