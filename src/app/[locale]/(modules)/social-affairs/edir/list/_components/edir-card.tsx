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
import { Edir } from "@/api/social-affairs/edir";

interface EdirCardProps {
  edir: Edir;
  onViewDetails?: (edir: Edir) => void;
}

const EdirCard: React.FC<EdirCardProps> = ({ edir, onViewDetails }) => {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex justify-between items-start">
          <span>{edir.name}</span>
          {edir.status && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                edir.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {edir.status}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>
            {edir.subCity}, Woreda {edir.woreda}, Kebele {edir.kebele}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{Intl.NumberFormat().format(totalMembers || 0)} Members</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          <span>
            Est:{" "}
            {new Date(edir.establishmentDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 rounded px-2 py-0.5 max-w-full truncate">
            {edir.formationMethod}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end mb-3">
        <Button variant="outline" size="sm" onClick={handleViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EdirCard;
