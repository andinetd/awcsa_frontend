"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { CardFooter } from "@/components/ui/card";
import { MapPin, Phone, User, CalendarDays, Users } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { Edir, EdirStatus } from "@/api/social-affairs/edir";

interface EdirCardProps {
  edir: Edir;
  onViewDetails?: (edir: Edir) => void;
}

import { useTranslations } from "next-intl";

const statusStyles: Record<EdirStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  EXPIRED: "bg-amber-100 text-amber-700",
  REVOKED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-200 text-gray-700",
};

const EdirCard: React.FC<EdirCardProps> = ({ edir, onViewDetails }) => {
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
    <Card className="hover:shadow-md transition-shadow max-h-[300px]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex justify-between items-start">
          <span>{edir.name}</span>
          {edir.status && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                statusStyles[edir.status] || "bg-gray-100 text-gray-700"
              }`}
            >
              {t(`status.${edir.status}`)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>
            {edir.subCity}, {t("woreda")} {edir.woreda}, {t("kebele")}{" "}
            {edir.kebele}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>
            {Intl.NumberFormat().format(totalMembers || 0)} {t("members")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          <span>
            {t("established")}:{" "}
            {new Date(edir.establishmentDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        {edir.registrationNumber && (
          <div className="text-xs text-slate-500">
            <span className="font-medium">{t("registrationNumber")}:</span>{" "}
            {edir.registrationNumber}
            {edir.renewedForYear ? ` • ${t("renewedForYear")} ${edir.renewedForYear}` : ""}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end mb-3">
        <Button variant="outline" size="sm" onClick={handleViewDetails}>
          {t("buttons.viewDetails")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EdirCard;
