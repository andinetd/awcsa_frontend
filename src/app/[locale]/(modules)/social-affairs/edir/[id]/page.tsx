"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useGetEdirAssociationByIdQuery } from "@/hooks/social-affairs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Users,
  Building2,
  CreditCard,
  FileText,
} from "lucide-react";
import { Edir } from "@/api/social-affairs/edir";
import NewEdirForm from "../list/_components/new-edir-form";
import EdirMembersList from "./_components/edir-members-list";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EdirDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);

  const { data: edir, isLoading, isError } = useGetEdirAssociationByIdQuery(id);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading details...
      </div>
    );
  }

  if (isError || !edir) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading Edir details or not found.
      </div>
    );
  }

  const typedEdir = edir as Edir; // Cast to Edir interface

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full p-4 md:p-8">
      {/* Header / Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{typedEdir.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                typedEdir.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {typedEdir.status || "Unknown"}
            </span>
            <span>•</span>
            <span>
              Established{" "}
              {new Date(typedEdir.establishmentDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <NewEdirForm
              initialData={typedEdir}
              edirId={typedEdir.id}
              trigger={<Button>Edit Details</Button>}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Info Column */}
            <div className="md:col-span-2 space-y-6">
              {/* General Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    General Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <p className="text-muted-foreground">Formation Method</p>
                    <p className="font-medium">{typedEdir.formationMethod}</p>
                  </div>
                  <div className="col-span-full">
                    <p className="text-muted-foreground">
                      Description / Remarks
                    </p>
                    <p className="leading-relaxed mt-1">
                      {typedEdir.remark || "No additional remarks provided."}
                    </p>
                  </div>
                  {typedEdir.otherReasonDescription && (
                    <div className="col-span-full">
                      <p className="text-muted-foreground">Other Reason</p>
                      <p className="mt-1">{typedEdir.otherReasonDescription}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Membership Stats (Moved back to Overview) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Membership Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-3">
                        Management Members
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            Male
                          </span>
                          <span className="font-medium">
                            {typedEdir.managementMale || 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            Female
                          </span>
                          <span className="font-medium">
                            {typedEdir.managementFemale || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-3">
                        General Members
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            Male
                          </span>
                          <span className="font-medium">
                            {typedEdir.generalMale || 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            Female
                          </span>
                          <span className="font-medium">
                            {typedEdir.generalFemale || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <p className="font-medium text-sm">
                      Total Members:{" "}
                      {(typedEdir.managementMale || 0) +
                        (typedEdir.managementFemale || 0) +
                        (typedEdir.generalMale || 0) +
                        (typedEdir.generalFemale || 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Establishment Reasons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Establishment Reasons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {typedEdir.establishmentReasons?.length > 0 ? (
                      typedEdir.establishmentReasons.map((reason, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {reason}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        No specific reasons listed.
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Info Column */}
            <div className="space-y-6">
              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs">
                      Sub City, Woreda, Kebele
                    </span>
                    <span className="font-medium">
                      {typedEdir.subCity}, Woreda {typedEdir.woreda}, Kebele{" "}
                      {typedEdir.kebele}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">
                      House Number
                    </span>
                    <span className="font-medium">{typedEdir.houseNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">
                      Specific Location
                    </span>
                    <span className="font-medium">
                      {typedEdir.specificLocation}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Financials */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    Financial Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs">
                      Bank Account Number
                    </span>
                    <span className="font-mono text-base font-medium text-slate-700">
                      {typedEdir.bankAccountNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">
                      Monthly Payment
                    </span>
                    <span className="font-medium">
                      {typedEdir.monthlyPaymentDetails}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          {typedEdir.id && <EdirMembersList associationId={typedEdir.id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

