"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, CheckCircle, FileText, Eye } from "lucide-react";
import { useFetchedAdoptionApplicationStore } from "@/stores/fetched-adoption-application";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import Link from "next/link";
import { formatAge } from "@/lib/utils";

export default function Details() {
  const { application } = useFetchedAdoptionApplicationStore();
  const { token } = useAuthStore();
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrls.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {
          // ignore
        }
      });
    };
  }, [objectUrls]);

  const getFileByField = (fieldName: string) => {
    return application?.files?.find(
      (f: any) => f.fieldName === fieldName || f.fileName === fieldName
    );
  };

  const viewRemoteFile = async (publicId: string) => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/adoption/files/${publicId}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch file");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setObjectUrls((s) => [...s, url]);
      window.open(url, "_blank");
    } catch (e: any) {
      console.error("Unable to preview file", e);
      toast.error("Unable to preview file");
    }
  };

  const fileCard = (f: any, label?: string) => {
    if (!f) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between"></div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg min-w-0 flex-1 max-w-xs">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {label ?? "No file"}
                </p>
                <p className="text-xs text-gray-500">No file uploaded</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between"></div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg min-w-0 flex-1 max-w-xs">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {f.fileName ?? f.publicId}
              </p>
              <p className="text-xs text-gray-500">{f.fileType ?? "file"}</p>
            </div>
            <div className="ml-2">
              <Button
                variant="outline"
                size="sm"
                className="hover:cursor-pointer border-blue-200 rounded-lg text-blue-500 hover:text-blue-600"
                onClick={() => viewRemoteFile(f.publicId)}
              >
                <Eye className="text-sm" /> View
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!application) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No application found.</p>
      </div>
    );
  }

  const form = application.formData ?? application.applicationInfo ?? {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Application Details
        </h2>
        <p className="text-gray-600">
          Review the submitted application details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">ID</span>
                {fileCard(getFileByField("idDocument"), "ID")}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Birth Certificate:
                </span>
                {fileCard(
                  getFileByField("birthCertificate"),
                  "Birth Certificate"
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Income Document:
                </span>
                {fileCard(getFileByField("incomeDocument"), "Income Document")}
              </div>
              <div>
                <span className="font-medium text-gray-500">Medical:</span>
                {fileCard(
                  getFileByField("medicalDocument"),
                  "Medical Information"
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Criminal Document:
                </span>
                {fileCard(
                  getFileByField("criminalClearance"),
                  "Criminal Document"
                )}
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-500">
                    City ID Number
                  </span>
                  <p className="text-gray-900">
                    {form.cityIdNumber ??
                      application.client?.cityIdNumber ??
                      "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    Date of Birth
                  </span>
                  <p className="text-gray-900">
                    {form.dateOfBirth ?? application.client?.dateOfBirth ?? "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">Address</span>
                  <p className="text-gray-900">
                    {form.address ?? application.client?.address ?? "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    Education Level
                  </span>
                  <p className="text-gray-900">
                    {form.educationLevel ??
                      application.adoptionData?.educationLevel ??
                      "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">Occupation</span>
                  <p className="text-gray-900">
                    {form.occupation ??
                      application.adoptionData?.occupation ??
                      "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    Monthly Income
                  </span>
                  <p className="text-gray-900">
                    {String(
                      form.monthlyIncome ??
                        application.adoptionData?.monthlyIncome ??
                        "-"
                    )}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    Spouse City ID Number
                  </span>
                  <p className="text-gray-900">
                    {form.spouseCityIdNumber ??
                      application.adoptionData?.spouseCityIdNumber ??
                      "-"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <span className="font-medium text-gray-500">
                    Preferred Children
                  </span>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-gray-500">Age Min</p>
                      <p className="text-gray-900">
                        {formatAge(form.preferredChildren?.ageRange?.min) ??
                          formatAge(application.adoptionData?.preferredChildren?.ageRange
                            ?.min) ??
                          "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Age Max</p>
                      <p className="text-gray-900">
                        {formatAge(form.preferredChildren?.ageRange?.max) ??
                          formatAge(application.adoptionData?.preferredChildren?.ageRange
                            ?.max) ??
                          "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Number</p>
                      <p className="text-gray-900">
                        {form.preferredChildren?.number ??
                          application.adoptionData?.preferredChildren?.number ??
                          "-"}
                      </p>
                    </div>
                    <div className="md:col-span-3 mt-1">
                      <p className="text-xs text-gray-500">Preferred Sex</p>
                      <p className="text-gray-900">
                        {form.preferredChildren?.sex ??
                          application.adoptionData?.preferredChildren?.sex ??
                          "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Additional Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">
                  Marriage Certificate
                </span>
                {fileCard(
                  getFileByField("marriageCertificate") ??
                    getFileByField("marriage_certificate"),
                  "Marriage Certificate"
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Marital Status:
                </span>
                {fileCard(
                  getFileByField("maritalStatusDocument"),
                  "Marital Status"
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">Well being:</span>
                {fileCard(
                  getFileByField("psychologicalWellbeing"),
                  "Well being"
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">Photo:</span>
                {fileCard(getFileByField("photo"), "Photo")}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Criminal Document:
                </span>
                {fileCard(
                  getFileByField("criminalClearance"),
                  "Criminal Document"
                )}
              </div>
            </div>
            {application.remark && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Reviewer Comment
                </h4>
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded text-sm text-gray-900">
                  {application.remark}
                </div>
              </div>
            )}

            {application.status === "RETURNED" && (
              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/applicant-portal/portal/resubmit-application`}>
                    Resubmit Application
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Submitted</h3>
            <p className="text-sm text-blue-800 mt-1">
              This application was submitted on{" "}
              {new Date(
                application.createdAt ?? Date.now()
              ).toLocaleDateString()}
              .
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
    </div>
  );
}
