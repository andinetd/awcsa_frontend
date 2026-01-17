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
  if (!careCenter) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {careCenter.name}
            <span
              className={`text-xs px-2 py-1 rounded-full font-normal ${
                careCenter.type === "GOVERNMENT"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {careCenter.type}
            </span>
          </DialogTitle>
          <DialogDescription>
            Detailed information about the care center.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Contact & Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Email:</span> {careCenter.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Phone:</span> {careCenter.phone}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Region:</span> {careCenter.region}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Sub-City:</span>{" "}
                {careCenter.subCity}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Woreda:</span> {careCenter.woreda}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Kebele:</span> {careCenter.kebele}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Home className="w-4 h-4 text-gray-500" />
                <span className="font-medium">House No:</span>{" "}
                {careCenter.houseNumber}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Place:</span> {careCenter.place}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Capacity & Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Age Range:</span>{" "}
                {formatAge(careCenter.childrenAgeRange.min)} -{" "}
                {formatAge(careCenter.childrenAgeRange.max)} years
              </div>
              {careCenter.orgUnitId && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Org Unit ID:</span>{" "}
                  {careCenter.orgUnitId}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <span className="font-medium text-sm">Description:</span>
              <p className="text-sm text-gray-600 bg-slate-50 p-3 rounded-md">
                {careCenter.description}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareCenterDetailsDialog;
