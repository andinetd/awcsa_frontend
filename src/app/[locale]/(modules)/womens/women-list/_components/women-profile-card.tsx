"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { CardFooter } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  User,
  CalendarDays,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { WomenProfile } from "@/api/womens/women-profile";

interface WomenProfileCardProps {
  profile: WomenProfile;
  onEdit?: (profile: WomenProfile) => void;
  onStatusToggle?: (profile: WomenProfile) => void;
}

const WomenProfileCard: React.FC<WomenProfileCardProps> = ({
  profile,
  onEdit,
  onStatusToggle,
}) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/womens/profiles/${profile.id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex justify-between items-start">
          <span>
            {profile.client.firstName} {profile.client.lastName}
          </span>
          <div className="flex gap-2">
            {profile.approvalStatus && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  profile.approvalStatus === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : profile.approvalStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profile.approvalStatus}
              </span>
            )}
            {profile.isActive && (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>ID: {profile.client.cityIdNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>{profile.client.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{profile.client.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          <span>{profile.occupation}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          <span>
            {new Date(profile.client.dateOfBirth).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            )}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 mb-3">
        <Button variant="outline" size="sm" onClick={() => onEdit?.(profile)}>
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={handleViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WomenProfileCard;
