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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {careCenter.name}
            <span
              className={cn(
                uiTokens.statusTag.base,
                isGov ? uiTokens.statusTag.primary : uiTokens.statusTag.neutral
              )}
            >
              {getTypeLabel(careCenter.type)}
            </span>
          </DialogTitle>
          <DialogDescription>{t("careCenters.dialog.title")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              {t("careCenters.dialog.contactAddress")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {t("careCenters.dialog.email")}:
                </span>{" "}
                {careCenter.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {t("careCenters.dialog.phone")}:
                </span>{" "}
                {careCenter.phone}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {t("careCenters.dialog.region")}:
                </span>{" "}
                {careCenter.region}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {t("careCenters.dialog.subCity")}:
                </span>{" "}
                {careCenter.subCity}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {t("careCenters.dialog.woreda")}:
                </span>{" "}
                {careCenter.woreda}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {t("careCenters.dialog.kebele")}:
                </span>{" "}
                {careCenter.kebele}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Home className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {t("careCenters.dialog.houseNo")}:
                </span>{" "}
                {careCenter.houseNumber}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {t("careCenters.dialog.place")}:
                </span>{" "}
                {careCenter.place}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              {t("careCenters.dialog.capacityServices")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {t("careCenters.dialog.ageRange")}:
                </span>{" "}
                {formatAge(careCenter.childrenAgeRange.min)} -{" "}
                {formatAge(careCenter.childrenAgeRange.max)}{" "}
                {t("careCenters.dialog.years")}
              </div>
              {careCenter.orgUnitId && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">
                    {t("careCenters.dialog.orgUnitId")}:
                  </span>{" "}
                  {careCenter.orgUnitId}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <span className="font-medium text-sm">
                {t("careCenters.dialog.description")}:
              </span>
              <p className="text-sm text-gray-600 bg-slate-50 p-3 rounded-md">
                {careCenter.description}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            {t("careCenters.dialog.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareCenterDetailsDialog;
