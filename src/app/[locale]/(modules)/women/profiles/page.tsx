"use client";

import React, { useState, useEffect } from "react";
import { useGetWomenProfilesQuery } from "@/hooks/womens";
import WomenProfileCard from "./_components/profile-card";
import NewWomenProfileForm from "./_components/new-women-profile-form";
import EditWomenProfileForm from "./_components/edit-women-profile-form";
import StatusToggleDialog from "./_components/status-toggle-dialog";
import { WomenProfile } from "@/api/womens/women-profile";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const ProfilesPage = () => {
  const { data: profiles, isLoading, isError } = useGetWomenProfilesQuery();
  const t = useTranslations("women");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [editingProfile, setEditingProfile] = useState<WomenProfile | null>(
    null,
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusProfile, setStatusProfile] = useState<WomenProfile | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  if (isLoading) {
    return <div className="p-8">{t("womenList.loading")}</div>;
  }

  const filteredProfiles = (profiles || []).filter(
    (profile: WomenProfile) =>
      profile.client.firstName
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      profile.client.lastName
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      profile.client.phoneNumber?.includes(debouncedSearch) ||
      profile.client.cityIdNumber
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase()),
  );

  const totalItems = filteredProfiles.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const currentProfiles = filteredProfiles.slice(
    startIndex,
    startIndex + limit,
  );

  if (isError) {
    return <div className="p-8 text-red-500">{t("womenList.error")}</div>;
  }

  const handleEdit = (profile: WomenProfile) => {
    setEditingProfile(profile);
    setEditDialogOpen(true);
  };

  const handleStatusToggle = (profile: WomenProfile) => {
    setStatusProfile(profile);
    setStatusDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full gap-6 max-w-7xl mx-auto w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {t("womenList.title")}
          </h1>
          <p className="text-muted-foreground">{t("womenList.subtitle")}</p>
        </div>

        <div className="flex flex-1 w-full md:w-auto md:max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("womenList.searchPlaceholder")}
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NewWomenProfileForm />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-10">
            {t("womenList.loading")}
          </div>
        ) : currentProfiles.length > 0 ? (
          currentProfiles.map((profile: WomenProfile) => (
            <WomenProfileCard
              key={profile.id}
              profile={profile}
              onEdit={handleEdit}
              onStatusToggle={handleStatusToggle}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            {t("womenList.noProfiles")}
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <div className="flex items-center justify-between border-t pt-4 mt-auto">
          <div className="text-sm text-muted-foreground">
            {t("womenList.pagination.showing", {
              start: startIndex + 1,
              end: Math.min(startIndex + limit, totalItems),
              total: totalItems,
            })}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 h-4" />
              {t("womenList.pagination.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              {t("womenList.pagination.next")}
              <ChevronRight className="h-4 h-4" />
            </Button>
          </div>
        </div>
      )}

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
};

export default ProfilesPage;