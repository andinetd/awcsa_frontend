"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewCareCenterSchemaType } from "@/schemas/care-centers";
import { Hash, MapPin, Phone, User, Mail, Home } from "lucide-react";
import React from "react";
import { formatAge } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { uiTokens } from "@/styles/design-system";
import { cn } from "@/lib/utils";

interface CareCenterDetailsDialogProps {
  careCenter: NewCareCenterSchemaType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CareCenterDetailsDialog: React.FC<CareCenterDetailsDialogProps> = ({
  careCenter,
  open,
  onOpenChange,
}) => {
  const t = useTranslations("adoption");
  if (!careCenter) return null;

  const isGov = careCenter.type === "GOVERNMENT";

  const getTypeLabel = (type?: string) => {
    if (!type) return "Care Facility";
    const upper = type.toUpperCase();
    try {
      const translated = t(`careCenters.types.${upper}`);
      if (translated && !translated.includes("careCenters.types")) {
        return translated;
      }
    } catch {
      // ignore
    }
    switch (upper) {
      case "GOVERNMENT":
        return "Government";
      case "NGO":
        return "NGO / Private";
      case "ADOPTION_CENTER":
        return "Adoption Center";
      case "TRANSIT_CENTER":
        return "Transit Center";
      case "ORPHANAGE":
        return "Orphanage";
      case "FOSTER_HOME":
        return "Foster Home";
      case "SHELTER":
        return "Temporary Shelter";
      case "MIXED":
        return "Mixed";
      default:
        return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-[#E3E7EB] rounded-xs shadow-2xs">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3 pr-6">
            <DialogTitle className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
              <span>{careCenter.name}</span>
            </DialogTitle>
            <span
              className={cn(
                uiTokens.statusTag.base,
                isGov ? uiTokens.statusTag.primary : uiTokens.statusTag.neutral,
                "px-2 py-0.5 rounded-xs shrink-0"
              )}
            >
              {getTypeLabel(careCenter.type)}
            </span>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            {t("careCenters.dialog.title") || "Registered Care Facility & Service Center Profile"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-3">
          {/* Contact & Location Card */}
          <div className="bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-2 flex items-center gap-1.5">
              <MapPin className="size-3.5 text-[#1769AA]" />
              {t("careCenters.dialog.contactAddress")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500">{t("careCenters.dialog.email")}:</span>
                <span className="font-mono text-slate-900 font-medium truncate">
                  {careCenter.email || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500">{t("careCenters.dialog.phone")}:</span>
                <span className="font-mono text-slate-900 font-medium">
                  {careCenter.phone || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500">{t("careCenters.dialog.region")}:</span>
                <span className="text-slate-900 font-medium">{careCenter.region || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500">{t("careCenters.dialog.subCity")}:</span>
                <span className="text-slate-900 font-medium">{careCenter.subCity || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500">{t("careCenters.dialog.woreda")}:</span>
                <span className="text-slate-900 font-medium">{careCenter.woreda || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500">{t("careCenters.dialog.kebele")}:</span>
                <span className="text-slate-900 font-medium">{careCenter.kebele || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="size-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500">{t("careCenters.dialog.houseNo")}:</span>
                <span className="text-slate-900 font-medium">{careCenter.houseNumber || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500">{t("careCenters.dialog.place")}:</span>
                <span className="text-slate-900 font-medium">{careCenter.place || "—"}</span>
              </div>
            </div>
          </div>

          {/* Capacity & Operational Details Card */}
          <div className="bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-2 flex items-center gap-1.5">
              <User className="size-3.5 text-[#1769AA]" />
              {t("careCenters.dialog.capacityServices")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <User className="size-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500">{t("careCenters.dialog.ageRange")}:</span>
                <span className="font-mono text-slate-900 font-medium">
                  {formatAge(careCenter.childrenAgeRange.min)} -{" "}
                  {formatAge(careCenter.childrenAgeRange.max)}{" "}
                  {t("careCenters.dialog.years")}
                </span>
              </div>
              {careCenter.orgUnitId && (
                <div className="flex items-center gap-2">
                  <Hash className="size-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-500">{t("careCenters.dialog.orgUnitId")}:</span>
                  <span className="font-mono text-slate-900 font-medium">
                    {careCenter.orgUnitId}
                  </span>
                </div>
              )}
            </div>
            {careCenter.description && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10.5px] font-mono uppercase tracking-wider font-bold text-slate-500">
                  {t("careCenters.dialog.description")}:
                </span>
                <p className="text-xs text-slate-700 bg-white border border-[#E3E7EB] p-3 rounded-xs leading-relaxed">
                  {careCenter.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#E3E7EB]">
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-xs text-xs bg-[#1769AA] hover:bg-[#12568E] text-white px-4 h-8 font-semibold shadow-2xs cursor-pointer"
          >
            {t("careCenters.dialog.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareCenterDetailsDialog;
