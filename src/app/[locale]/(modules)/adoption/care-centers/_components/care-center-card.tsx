"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { CardFooter } from "@/components/ui/card";  
import { NewCareCenterSchemaType } from "@/schemas/care-centers";
import { Eye, MapPin, Phone, User } from "lucide-react";
import React from "react";
import { formatAge } from "@/lib/utils";

interface CareCenterCardProps {
  careCenter: NewCareCenterSchemaType;
  onViewDetails: (careCenter: NewCareCenterSchemaType) => void;
}

const CareCenterCard: React.FC<CareCenterCardProps> = ({
  careCenter,
  onViewDetails,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex justify-between items-start">
          <span>{careCenter.name}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              careCenter.type === "GOVERNMENT"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {careCenter.type}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>
            {careCenter.region}, {careCenter.subCity}, {careCenter.woreda}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>{careCenter.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>
            Age: {formatAge(careCenter.childrenAgeRange.min)} -{" "}
            {formatAge(careCenter.childrenAgeRange.max)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end mb-3">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => onViewDetails(careCenter)}
        >
          <Eye className="w-4 h-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CareCenterCard;
