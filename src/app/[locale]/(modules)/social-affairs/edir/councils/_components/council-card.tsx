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
  ACTIVE: "bg-green-100 text-green-700",
  EXPIRED: "bg-amber-100 text-amber-700",
  REVOKED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-200 text-gray-700",
};

const levelStyles: Record<string, string> = {
  WOREDA: "bg-blue-100 text-blue-700",
  SUB_CITY: "bg-purple-100 text-purple-700",
  CITY: "bg-teal-100 text-teal-700",
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
    <Card className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">
            {council.name}
          </CardTitle>
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-1" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={statusStyles[council.status] || undefined}>
            {t(`status.${council.status}`)}
          </Badge>
          <Badge
            className={levelStyles[council.level] || undefined}
            variant="outline"
          >
            {t(`level.${council.level}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground flex-1">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>
            {council.subCity}
            {council.woreda ? ` • ${council.woreda}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>
            {memberCount}{" "}
            {memberCount === 1 ? "member edir" : "member edirs"}
          </span>
        </div>
        {council.registrationNumber && (
          <p className="text-xs font-mono">{council.registrationNumber}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onViewDetails(council)}
        >
          {t("buttons.viewDetails")}
        </Button>
      </CardFooter>
    </Card>
  );
}