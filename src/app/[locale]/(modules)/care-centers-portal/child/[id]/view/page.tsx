"use client";

import React, { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Edit, ArrowLeft, Loader2, AlertCircle, User, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useChildDetails } from "@/hooks/adoption/useChildDetails";
import { format, differenceInYears } from "date-fns";

interface ViewChildPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ViewChildPage({ params }: ViewChildPageProps) {
  const { id } = use(params);
  const childId = Number(id);

  const t = useTranslations("care-centers-portal.childView");
  const te = useTranslations("care-centers-portal.enums");

  const { data: child, isLoading, isError } = useChildDetails(childId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading child record...</p>
      </div>
    );
  }

  if (isError || !child) {
    return (
      <div className="container mx-auto py-12 max-w-lg text-center">
        <div className="bg-white rounded-xl border p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold">Child Record Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The requested child record could not be found or loaded.
          </p>
          <Link href="/care-centers-portal">
            <Button variant="outline">Back to Children List</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formData = (child.serviceData?.formData || {}) as Record<string, any>;
  const firstName = formData.firstName || "";
  const lastName = formData.lastName || "";
  const fullName =
    `${firstName} ${lastName}`.trim() ||
    child.childIdFromFacility ||
    `Child #${child.id}`;

  const dob = formData.dateOfBirth;
  let computedAge: number | string = "N/A";
  if (dob) {
    try {
      computedAge = differenceInYears(new Date(), new Date(dob));
    } catch {
      computedAge = "N/A";
    }
  } else if (formData.age) {
    computedAge = formData.age;
  }

  const gender = formData.sex || "UNKNOWN";
  const status = child.currentStatus || formData.currentStatus || "IN_CARE";
  const foundDate = child.timeWhenChildFound || formData.timeWhenChildFound;
  const foundAddress = child.placeWhereChildFound || formData.placeWhereChildFound;

  return (
    <div className="container mx-auto py-4 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/care-centers-portal">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">{fullName}</h2>
              <Badge variant="secondary" className="capitalize">
                {te(`status.${status}`) || status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {child.childIdFromFacility
                ? `Facility ID: ${child.childIdFromFacility}`
                : `System ID: #${child.id}`}
            </p>
          </div>
        </div>

        <Link href={`/care-centers-portal/child/${id}/edit`}>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            {t("editDetails")}
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {t("sections.basic")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                First Name
              </label>
              <p className="text-sm font-semibold">{firstName || "N/A"}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Last Name
              </label>
              <p className="text-sm font-semibold">{lastName || "N/A"}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                {t("fields.gender")}
              </label>
              <p className="text-sm capitalize">
                {te(`sex.${gender}`) || gender}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Age / Date of Birth
              </label>
              <p className="text-sm">
                {computedAge !== "N/A" ? `${computedAge} years` : "N/A"}
                {dob ? ` (${format(new Date(dob), "MMM d, yyyy")})` : ""}
              </p>
            </div>
            {formData.name_by_family && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  {t("fields.nameByFamily")}
                </label>
                <p className="text-sm">{formData.name_by_family}</p>
              </div>
            )}
            {formData.father_name && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  {t("fields.fatherName")}
                </label>
                <p className="text-sm">{formData.father_name}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location & Discovery Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {t("sections.location")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                {t("fields.placeFound")}
              </label>
              <p className="text-sm">{foundAddress || "N/A"}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                {t("fields.dateFound")}
              </label>
              <p className="text-sm">
                {foundDate ? format(new Date(foundDate), "MMM d, yyyy") : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Social Worker City ID
              </label>
              <p className="text-sm">
                {child.socialWorkerCityIdNumber ||
                  formData.socialWorkerCityIdNumber ||
                  "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Care Center / Placement Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Care Center & Intake Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Assigned Care Center
              </label>
              <p className="text-sm font-semibold">
                {child.childCareFacility?.name || "This Facility"}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Internal Facility ID
              </label>
              <p className="text-sm">{child.childIdFromFacility || "N/A"}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Intake / Registration Date
              </label>
              <p className="text-sm">
                {child.createdAt
                  ? format(new Date(child.createdAt), "MMM d, yyyy")
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        {(child.additionalInfo ||
          formData.additionalInfo ||
          formData.admitance_reason) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("sections.additional")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.admitance_reason && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    {t("fields.admittanceReason")}
                  </label>
                  <p className="text-sm mt-1">{formData.admitance_reason}</p>
                </div>
              )}
              {(child.additionalInfo || formData.additionalInfo) && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    {t("fields.additionalInfo")}
                  </label>
                  <p className="text-sm mt-1">
                    {child.additionalInfo || formData.additionalInfo}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

