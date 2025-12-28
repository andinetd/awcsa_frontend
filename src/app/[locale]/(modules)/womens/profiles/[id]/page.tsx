"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetWomenProfileByIdQuery } from "@/hooks/womens";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Phone,
  MapPin,
  CalendarDays,
  Briefcase,
  GraduationCap,
  DollarSign,
  ArrowLeft,
  Edit,
  ToggleLeft,
} from "lucide-react";
import EditWomenProfileForm from "../../women-list/_components/edit-women-profile-form";
import StatusToggleDialog from "../../women-list/_components/status-toggle-dialog";

const WomenProfileDetail = () => {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const { data: profile, isLoading, isError } = useGetWomenProfileByIdQuery(id);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-lg text-red-500">Failed to load profile</div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="w-full p-4 space-y-6">
      {/* Header with breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/womens/women-list")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {profile.client.firstName} {profile.client.lastName}
            </h1>
            <p className="text-muted-foreground">Women Profile Details</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {profile.approvalStatus && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
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
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              Active
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={() => setEditDialogOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
        <Button variant="outline" onClick={() => setStatusDialogOpen(true)}>
          <ToggleLeft className="h-4 w-4 mr-2" />
          Toggle Status
        </Button>
      </div>

      {/* Profile Information Cards - 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">City ID Number</p>
              <p className="font-medium">{profile.client.cityIdNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">
                {profile.client.firstName} {profile.client.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">
                {new Date(profile.client.dateOfBirth).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{profile.client.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{profile.client.address}</p>
            </div>
            {profile.client.contactInfo?.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">
                  {profile.client.contactInfo.email}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education & Employment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-5 w-5" />
              Education & Employment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Education Level</p>
              <p className="font-medium">{profile.educationLevel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Occupation</p>
              <p className="font-medium">{profile.occupation}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Income</p>
              <p className="font-medium">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "ETB",
                }).format(profile.client.monthlyIncome)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-5 w-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.photoUrl && (
                <div>
                  <p className="text-sm text-muted-foreground">Photo URL</p>
                  <a
                    href={profile.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Photo
                  </a>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Client Category</p>
                <p className="font-medium">{profile.client.clientCategory}</p>
              </div>
              {profile.createdAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Registered On</p>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
              {profile.updatedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {new Date(profile.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <EditWomenProfileForm
        profile={profile}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <StatusToggleDialog
        profile={profile}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </div>
  );
};

export default WomenProfileDetail;
