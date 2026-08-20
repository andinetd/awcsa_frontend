"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useGetEdirCouncilByIdQuery } from "@/hooks/social-affairs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  ScrollText,
  Crown,
  Phone,
  Building2,
  Calendar,
  Users,
  ShieldCheck,
} from "lucide-react";
import { EdirCouncil, EdirStatus } from "@/api/social-affairs/edir";
import { useTranslations } from "next-intl";
import { useRemoveEdirFromCouncilMutation } from "@/hooks/social-affairs";
import { toast } from "sonner";
import NewCouncilForm from "../_components/new-council-form";
import CouncilActions from "./_components/council-actions";
import AddMemberDialog from "./_components/add-member-dialog";

const statusStyles: Record<EdirStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  EXPIRED: "bg-amber-100 text-amber-700",
  REVOKED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-200 text-gray-700",
};

const CANCELLATION_REASONS: Record<string, string> = {
  DISSOLVED: "cancellationReasons.DISSOLVED",
  MEMBER_MAJORITY_REQUEST: "cancellationReasons.MEMBER_MAJORITY_REQUEST",
  LAWS_VIOLATION: "cancellationReasons.LAWS_VIOLATION",
  LICENSE_MISUSE: "cancellationReasons.LICENSE_MISUSE",
  FALSE_DOCUMENTS: "cancellationReasons.FALSE_DOCUMENTS",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CouncilDetailsPage({ params }: PageProps) {
  const t = useTranslations("social-affairs.edir.councils");
  const router = useRouter();
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);

  const {
    data: council,
    isLoading,
    isError,
  } = useGetEdirCouncilByIdQuery(id);
  const removeMemberMutation = useRemoveEdirFromCouncilMutation();

  const handleRemoveMember = async (associationId: number) => {
    try {
      await removeMemberMutation.mutateAsync({
        councilId: id,
        associationId,
      });
      toast.success(t("buttons.removeMember"));
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {t("detail.loading")}
      </div>
    );
  }

  if (isError || !council) {
    return <div className="p-8 text-center text-red-500">{t("detail.error")}</div>;
  }

  const typedCouncil = council as EdirCouncil;
  const memberCount =
    typedCouncil._count?.memberEdirs ?? typedCouncil.memberEdirs.length;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/social-affairs/edir/councils")}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{typedCouncil.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Badge className={statusStyles[typedCouncil.status] || undefined}>
              {t(`status.${typedCouncil.status}`)}
            </Badge>
            <Badge variant="outline">{t(`level.${typedCouncil.level}`)}</Badge>
            {typedCouncil.registrationNumber && (
              <span className="font-mono text-xs">
                {typedCouncil.registrationNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end items-center gap-2">
        <AddMemberDialog council={typedCouncil} />
        <CouncilActions council={typedCouncil} />
        <NewCouncilForm
          initialData={typedCouncil}
          councilId={typedCouncil.id}
          trigger={<Button variant="outline">{t("buttons.edit")}</Button>}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-primary" />
                {t("detail.accreditation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase">
                  {t("detail.registrationNumber")}
                </p>
                <p className="font-mono font-medium">
                  {typedCouncil.registrationNumber || t("detail.notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase">
                  {t("detail.registrationDate")}
                </p>
                <p>
                  {typedCouncil.registrationDate
                    ? new Date(typedCouncil.registrationDate).toLocaleDateString()
                    : t("detail.notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase">
                  {t("detail.certificateIssuedAt")}
                </p>
                <p>
                  {typedCouncil.certificateIssuedAt
                    ? new Date(
                        typedCouncil.certificateIssuedAt
                      ).toLocaleDateString()
                    : t("detail.notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase">
                  {t("detail.renewedForYear")}
                </p>
                <p>
                  {typedCouncil.renewedForYear
                    ? typedCouncil.renewedForYear
                    : t("detail.notRenewed")}
                  {typedCouncil.renewalPenaltyApplied && (
                    <span className="ml-2 text-xs text-amber-600">
                      {t("detail.penaltyApplied")}
                    </span>
                  )}
                </p>
              </div>
              {typedCouncil.cancelledAt && (
                <>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">
                      {t("detail.cancelledAt")}
                    </p>
                    <p>{new Date(typedCouncil.cancelledAt).toLocaleDateString()}</p>
                  </div>
                  {typedCouncil.cancellationReason && (
                    <div>
                      <p className="text-muted-foreground text-xs uppercase">
                        {t("detail.cancellationReason")}
                      </p>
                      <p>
                        {t(
                          CANCELLATION_REASONS[typedCouncil.cancellationReason] ||
                            typedCouncil.cancellationReason
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {t("detail.membersTitle", { count: memberCount })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typedCouncil.memberEdirs.length === 0 ? (
                <div className="text-center text-gray-500 py-6 text-sm">
                  {t("detail.noMembers")}
                </div>
              ) : (
                <div className="space-y-3">
                  {typedCouncil.memberEdirs.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between border rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.registrationNumber
                            ? member.registrationNumber
                            : t("detail.notAvailable")}
                          {" • "}
                          {member.subCity}
                          {member.woreda ? ` • ${member.woreda}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={statusStyles[member.status] || undefined}
                        >
                          {t(`status.${member.status}`)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          disabled={removeMemberMutation.isPending}
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          {t("buttons.removeMember")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                {t("detail.leader")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-muted-foreground" />
                <span>
                  {typedCouncil.chairpersonName ||
                    t("detail.notAvailable")}
                </span>
              </div>
              {typedCouncil.chairpersonPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{typedCouncil.chairpersonPhone}</span>
                </div>
              )}
              {typedCouncil.contactPhone && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {t("detail.contactPhone")}: {typedCouncil.contactPhone}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {t("detail.location")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  {t("detail.established")}:{" "}
                  {new Date(typedCouncil.establishmentDate).toLocaleDateString()}
                </span>
              </div>
              <p>
                {typedCouncil.subCity}
                {typedCouncil.woreda ? ` • ${typedCouncil.woreda}` : ""}
                {typedCouncil.kebele ? ` • ${typedCouncil.kebele}` : ""}
              </p>
              {typedCouncil.address && (
                <p className="text-muted-foreground">{typedCouncil.address}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}