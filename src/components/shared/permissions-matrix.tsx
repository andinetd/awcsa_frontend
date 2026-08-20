"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Permission } from "@/types/super-admin";
import { useTranslations } from "next-intl";

type PermissionOperation = Permission["operation"];

const OPERATION_RANK: Record<PermissionOperation, number> = {
  READ: 0,
  WRITE: 1,
  MANAGE: 1,
  UPDATE: 2,
  DELETE: 3,
};

type AccessLevel = "none" | "view" | "manage" | "full" | "custom";

interface ResourcePreset {
  resource: string;
  viewIds: number[];
  manageIds: number[];
  fullIds: number[];
  hasView: boolean;
}

function buildPresets(permissions: Permission[]): ResourcePreset[] {
  const grouped = permissions.reduce(
    (acc, perm) => {
      if (!acc[perm.resourceType]) acc[perm.resourceType] = [];
      acc[perm.resourceType].push(perm);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  return Object.entries(grouped).map(([resource, perms]) => {
    const viewIds = perms
      .filter((p) => OPERATION_RANK[p.operation] <= OPERATION_RANK.READ)
      .map((p) => p.id);
    const manageIds = perms
      .filter((p) => OPERATION_RANK[p.operation] <= OPERATION_RANK.UPDATE)
      .map((p) => p.id);
    const fullIds = perms.map((p) => p.id);
    return {
      resource,
      viewIds,
      manageIds,
      fullIds,
      hasView: viewIds.length > 0,
    };
  });
}

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const aSorted = [...a].sort((x, y) => x - y);
  const bSorted = [...b].sort((x, y) => x - y);
  return aSorted.every((v, i) => v === bSorted[i]);
}

function resolveLevel(
  preset: ResourcePreset,
  selected: number[],
): AccessLevel {
  if (selected.length === 0) return "none";
  if (arraysEqual(selected, preset.fullIds)) return "full";
  if (arraysEqual(selected, preset.manageIds)) return "manage";
  if (preset.hasView && arraysEqual(selected, preset.viewIds)) return "view";
  return "custom";
}

interface PermissionsMatrixProps {
  permissions: Permission[];
  selected: number[];
  onToggle: (permissionId: number) => void;
  onSelectAll: (resource: string, permissionIds: number[]) => void;
  onClearAll: (resource: string) => void;
  disabled?: boolean;
  showSearch?: boolean;
  className?: string;
}

export function PermissionsMatrix({
  permissions,
  selected,
  onSelectAll,
  onClearAll,
  disabled = false,
  showSearch = true,
  className,
}: PermissionsMatrixProps) {
  const t = useTranslations("super-admin.permissionsMatrix");
  const [searchTerm, setSearchTerm] = useState("");

  const allPermissions = useMemo(
    () => (Array.isArray(permissions) ? permissions : []),
    [permissions],
  );

  const presets = useMemo(() => buildPresets(allPermissions), [allPermissions]);

  const visiblePresets = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();
    if (!lower) return presets;
    return presets.filter((preset) => {
      const resourceMatches = preset.resource.toLowerCase().includes(lower);
      const permMatches = allPermissions
        .filter((p) => p.resourceType === preset.resource)
        .some(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            (p.description ?? "").toLowerCase().includes(lower),
        );
      return resourceMatches || permMatches;
    });
  }, [presets, allPermissions, searchTerm]);

  const totalSelected = allPermissions.filter((p) =>
    selected.includes(p.id),
  ).length;
  const totalPermissions = allPermissions.length;

  const handleLevelChange = (
    level: Exclude<AccessLevel, "custom">,
    preset: ResourcePreset,
  ) => {
    if (level === "none") {
      onClearAll(preset.resource);
      return;
    }
    onClearAll(preset.resource);
    onSelectAll(
      preset.resource,
      level === "view"
        ? preset.viewIds
        : level === "manage"
          ? preset.manageIds
          : preset.fullIds,
    );
  };

  return (
    <div className={className}>
      {showSearch && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold">{t("label")}</span>
        <Badge variant="outline">
          {t("selected", {
            selected: totalSelected,
            total: totalPermissions,
          })}
        </Badge>
      </div>

      {visiblePresets.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t("noPermissions")}
        </p>
      )}

      <div className="space-y-4">
        {visiblePresets.map((preset) => {
          const resourcePerms = allPermissions.filter(
            (p) => p.resourceType === preset.resource,
          );
          const moduleName = resourcePerms.find((p) => p.module)?.module;
          const resourceSelected = selected.filter((id) =>
            preset.fullIds.includes(id),
          );
          const level = resolveLevel(preset, resourceSelected);

          return (
            <div
              key={preset.resource}
              className="rounded-lg border p-4 bg-slate-50/50"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {preset.resource.replace(/_/g, " ")}
                </Label>
                {moduleName && (
                  <Badge variant="outline">{moduleName}</Badge>
                )}
                <Badge variant="secondary" className="ml-auto">
                  {resourceSelected.length}/{preset.fullIds.length}
                </Badge>
              </div>
              <Select
                value={level}
                disabled={disabled}
                onValueChange={(value) =>
                  handleLevelChange(value as Exclude<AccessLevel, "custom">, preset)
                }
              >
                <SelectTrigger className="w-full md:w-[240px]">
                  <SelectValue placeholder={t("preset.none")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("preset.none")}</SelectItem>
                  {preset.hasView && (
                    <SelectItem value="view">{t("preset.viewOnly")}</SelectItem>
                  )}
                  <SelectItem value="manage">{t("preset.manage")}</SelectItem>
                  <SelectItem value="full">{t("preset.fullControl")}</SelectItem>
                  {level === "custom" && (
                    <SelectItem value="custom" disabled>
                      {t("preset.custom")}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {resourcePerms.map((perm) => {
                  const isSelected = resourceSelected.includes(perm.id);
                  return (
                    <Badge
                      key={perm.id}
                      variant={isSelected ? "default" : "outline"}
                      title={perm.description || perm.name}
                      className="text-[11px] font-normal"
                    >
                      {perm.name.replace(/_/g, " ")}
                    </Badge>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}