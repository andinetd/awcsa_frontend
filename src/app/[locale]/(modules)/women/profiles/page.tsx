"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetWomenProfilesQuery } from "@/hooks/womens";
import NewWomenProfileForm from "./_components/new-women-profile-form";
import EditWomenProfileForm from "./_components/edit-women-profile-form";
import StatusToggleDialog from "./_components/status-toggle-dialog";
import { WomenProfile } from "@/api/womens/women-profile";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  ToggleLeft,
  Users,
  History,
} from "lucide-react";
import PersonHistoryDialog from "@/components/shared/person-history-dialog";
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
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export default function ProfilesPage() {
  const router = useRouter();
  const { data: profiles, isLoading, isError } = useGetWomenProfilesQuery();
  const t = useTranslations("women");

  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [editingProfile, setEditingProfile] = useState<WomenProfile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusProfile, setStatusProfile] = useState<WomenProfile | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredProfiles = useMemo(() => {
    const list = profiles || [];
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return list;

    return list.filter((p: WomenProfile) =>
      [
        p.client.firstName,
        p.client.lastName,
        p.client.cityIdNumber,
        p.client.phoneNumber,
        p.client.address,
        p.educationLevel,
        p.careerStatus,
        p.occupation,
      ]
        .filter(Boolean)
        .some((val) => val?.toString().toLowerCase().includes(q)),
    );
  }, [profiles, debouncedSearch]);

  const totalItems = filteredProfiles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const startIndex = (page - 1) * limit;
  const currentProfiles = filteredProfiles.slice(startIndex, startIndex + limit);

  const handleEdit = (profile: WomenProfile) => {
    setEditingProfile(profile);
    setEditDialogOpen(true);
  };

  const handleStatusToggle = (profile: WomenProfile) => {
    setStatusProfile(profile);
    setStatusDialogOpen(true);
  };

  const getAge = (profile: WomenProfile) => {
    if (profile.client.age) return profile.client.age;
    if (profile.client.dateOfBirth) {
      const diff = Date.now() - new Date(profile.client.dateOfBirth).getTime();
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
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
          {label}
        </Badge>
      );
    }
    if (s === "UNEMPLOYED") {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200">
          {label}
        </Badge>
      );
    }
    return <Badge variant="outline">{label}</Badge>;
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

  if (isError) {
    return <div className="p-8 text-red-500">{t("womenList.error")}</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">
            {t("womenList.title")}
          </h1>
          <p className="text-slate-500 mt-1">{t("womenList.subtitle")}</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder={t("womenList.searchPlaceholder")}
              className="pl-8 bg-slate-50/50 border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <NewWomenProfileForm />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t("womenList.title")}
          </CardTitle>
          <div className="text-sm text-slate-500">
            {t("womenList.pagination.showing", {
              start: totalItems === 0 ? 0 : startIndex + 1,
              end: Math.min(startIndex + limit, totalItems),
              total: totalItems,
            })}
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold">
                    {t("womenList.table.name")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("womenList.table.cityId")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("womenList.table.age")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("womenList.table.phone")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("womenList.table.address")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("womenList.table.educationLevel")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("womenList.table.careerStatus")}
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    {t("womenList.table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      {t("womenList.loading")}
                    </TableCell>
                  </TableRow>
                ) : currentProfiles.length > 0 ? (
                  currentProfiles.map((profile: WomenProfile) => (
                    <TableRow
                      key={profile.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                            {profile.client.firstName?.[0]}
                            {profile.client.lastName?.[0]}
                          </div>
                          <span>
                            {profile.client.firstName} {profile.client.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 font-mono text-xs">
                        {profile.client.cityIdNumber}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {getAge(profile)}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {profile.client.phoneNumber || "-"}
                      </TableCell>
                      <TableCell className="text-slate-600 max-w-[160px] truncate" title={profile.client.address}>
                        {profile.client.address || "-"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {getEducationLabel(profile.educationLevel)}
                      </TableCell>
                      <TableCell>
                        {getCareerStatusLabel(profile)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <PersonHistoryDialog
                            clientId={profile.client.id}
                            personName={`${profile.client.firstName} ${profile.client.lastName}`}
                            cityIdNumber={profile.client.cityIdNumber ?? undefined}
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                title="View cross-department support history"
                                className="text-slate-600 hover:text-primary"
                              >
                                <History className="w-4 h-4" />
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
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={t("womenList.table.edit")}
                            onClick={() => handleEdit(profile)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={t("womenList.table.toggleStatus")}
                            onClick={() => handleStatusToggle(profile)}
                          >
                            <ToggleLeft className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-slate-500"
                    >
                      {t("womenList.noProfiles")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalItems > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-slate-500">
                {t("womenList.pagination.showing", {
                  start: startIndex + 1,
                  end: Math.min(startIndex + limit, totalItems),
                  total: totalItems,
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EditWomenProfileForm
        profile={editingProfile}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <StatusToggleDialog
        profile={statusProfile}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </div>
  );
}