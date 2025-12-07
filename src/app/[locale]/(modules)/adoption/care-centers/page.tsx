"use client";

import React, { useState } from "react";
import NewCareCenterForm from "./_components/new-care-center-form";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";
import CareCenterCard from "./_components/care-center-card";
import CareCenterDetailsDialog from "./_components/care-center-details-dialog";
import { NewCareCenterSchemaType } from "@/schemas/care-centers";

const CareCenters = () => {
  const { data: careCenters, isLoading, isError } = useGetCareCentersQuery();
  const [selectedCenter, setSelectedCenter] =
    useState<NewCareCenterSchemaType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (center: NewCareCenterSchemaType) => {
    setSelectedCenter(center);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-4">Loading care centers...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Error loading care centers.</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Care Centers</h1>
        <NewCareCenterForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careCenters?.map((center: NewCareCenterSchemaType, index: number) => (
          <CareCenterCard
            key={index}
            careCenter={center}
            onViewDetails={handleViewDetails}
          />
        ))}
        {careCenters?.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">
            No care centers found.
          </div>
        )}
      </div>

      <CareCenterDetailsDialog
        careCenter={selectedCenter}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default CareCenters;
