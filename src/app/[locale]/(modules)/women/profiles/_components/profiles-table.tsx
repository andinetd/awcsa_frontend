"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { WomenProfile } from "@/api/womens/women-profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  ToggleLeft,
  Users,
  History,
} from "lucide-react";
import PersonHistoryDialog from "@/components/shared/person-history-dialog";
import { uiTokens } from "@/styles/design-system";

interface ProfilesTableProps {
  currentProfiles: WomenProfile[];
  isLoading: boolean;
  totalItems: number;
  startIndex: number;
  limit: number;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onEdit: (profile: WomenProfile) => void;
  onStatusToggle: (profile: WomenProfile) => void;
}

export function ProfilesTable({
  currentProfiles,
  isLoading,
  totalItems,
  startIndex,
  limit,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onStatusToggle,
}: ProfilesTableProps) {
  const t = useTranslations("women");
  const router = useRouter();

  const getAge = (profile: WomenProfile) => {
    if (profile.client.age) return profile.client.age;
    if (profile.client.dateOfBirth) {
      const diff =
        Date.now() - new Date(profile.client.dateOfBirth).getTime();
      const age = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
      if (!isNaN(age) && age > 0) return age;
    }
    return "-";
  };

  const getCareerStatusLabel = (profile: WomenProfile) => {
    const status = profile.careerStatus || profile.occupation || "";
    if (!status) return <span className="text-slate-400">-</span>;

    let label = status;
    try {
      if (t.has(`form.careerOptions.${status}`)) {
        label = t(`form.careerOptions.${status}`);
      }
    } catch {
      // fallback
    }

    const s = status.toUpperCase();
    if (s === "EMPLOYED" || s.includes("WORK")) {
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold border ${uiTokens.statusTag.primary}`}
        >
          {label}
        </span>
      );
    }
    if (s === "UNEMPLOYED") {
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold border ${uiTokens.statusTag.warning}`}
        >
          {label}
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-medium border ${uiTokens.statusTag.neutral}`}
      >
        {label}
      </span>
    );
  };

  const getEducationLabel = (level?: string) => {
    if (!level) return <span className="text-slate-400">-</span>;
    try {
      if (t.has(`form.educationOptions.${level}`)) {
        return t(`form.educationOptions.${level}`);
      }
    } catch {
      // fallback
    }
    return level;
  };

  return (
    <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3.5 px-5 border-b border-[#E3E7EB]">
        <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
          <Users className="w-4 h-4 text-[#1769AA]" />
          {t("womenList.title")}
        </CardTitle>
        <div className="text-xs font-mono text-slate-500">
          {t("womenList.pagination.showing", {
            start: totalItems === 0 ? 0 : startIndex + 1,
            end: Math.min(startIndex + limit, totalItems),
            total: totalItems,
          })}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-[#E3E7EB]">
              <TableRow>
                <TableHead className="text-xs font-semibold text-slate-700 py-3 pl-5">
                  {t("womenList.table.name")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 py-3">
                  {t("womenList.table.cityId")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 py-3">
                  {t("womenList.table.age")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 py-3">
                  {t("womenList.table.phone")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 py-3">
                  {t("womenList.table.address")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 py-3">
                  {t("womenList.table.educationLevel")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 py-3">
                  {t("womenList.table.careerStatus")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 text-right py-3 pr-5">
                  {t("womenList.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-xs text-slate-500"
                  >
                    {t("womenList.loading")}
                  </TableCell>
                </TableRow>
              ) : currentProfiles.length > 0 ? (
                currentProfiles.map((profile: WomenProfile) => (
                  <TableRow
                    key={profile.id}
                    className="hover:bg-[#F7F8FA] transition-colors border-b border-[#E3E7EB] last:border-0"
                  >
                    <TableCell className="font-medium py-3 pl-5">
                      <span className="text-xs font-semibold text-[#0B1F3A]">
                        {profile.client.firstName} {profile.client.lastName}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA] rounded-xs">
                        {profile.client.faydaId ||
                          profile.client.cityIdNumber ||
                          "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600 text-xs font-mono py-3">
                      {getAge(profile)}
                    </TableCell>
                    <TableCell className="text-slate-600 font-mono text-xs py-3">
                      {profile.client.phoneNumber || "—"}
                    </TableCell>
                    <TableCell
                      className="text-slate-600 text-xs max-w-[200px] truncate py-3"
                      title={[
                        profile.client.subCity,
                        profile.client.woreda
                          ? `${t("form.woreda")} ${profile.client.woreda}`
                          : null,
                        profile.client.address,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    >
                      {[
                        profile.client.subCity,
                        profile.client.woreda
                          ? `${t("form.woreda")} ${profile.client.woreda}`
                          : null,
                        profile.client.address,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </TableCell>
                    <TableCell className="text-slate-600 text-xs py-3">
                      {getEducationLabel(profile.educationLevel)}
                    </TableCell>
                    <TableCell className="py-3">
                      {getCareerStatusLabel(profile)}
                    </TableCell>
                    <TableCell className="text-right py-3 pr-5">
                      <div className="flex justify-end gap-1">
                        <PersonHistoryDialog
                          clientId={profile.client.id}
                          personName={`${profile.client.firstName} ${profile.client.lastName}`}
                          cityIdNumber={
                            profile.client.cityIdNumber ?? undefined
                          }
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View cross-department support history"
                              className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                            >
                              <History className="w-3.5 h-3.5" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t("womenList.table.viewDetails")}
                          onClick={() =>
                            router.push(`/women/profiles/${profile.id}`)
                          }
                          className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t("womenList.table.edit")}
                          onClick={() => onEdit(profile)}
                          className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t("womenList.table.toggleStatus")}
                          onClick={() => onStatusToggle(profile)}
                          className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                        >
                          <ToggleLeft className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-xs text-slate-500"
                  >
                    {t("womenList.noProfiles")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalItems > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[#E3E7EB]">
            <p className="text-xs text-slate-500 font-mono">
              {t("womenList.pagination.showing", {
                start: startIndex + 1,
                end: Math.min(startIndex + limit, totalItems),
                total: totalItems,
              })}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="h-7 w-7 rounded-xs border-[#E3E7EB] cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-mono px-2 text-slate-600">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="h-7 w-7 rounded-xs border-[#E3E7EB] cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
