"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Search, X } from "lucide-react";
import { Permission } from "@/types/super-admin";
import { useTranslations } from "next-intl";

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
  onToggle,
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

  const groups = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();
    const grouped = allPermissions.reduce(
      (acc, perm) => {
        const resource = perm.resourceType || "Other";
        if (
          lower &&
          !perm.name.toLowerCase().includes(lower) &&
          !resource.toLowerCase().includes(lower)
        ) {
          return acc;
        }
        if (!acc[resource]) acc[resource] = [];
        acc[resource].push(perm);
        return acc;
      },
      {} as Record<string, Permission[]>,
    );
    return grouped;
  }, [allPermissions, searchTerm]);

  const totalSelected = selected.length;
  const totalPermissions = allPermissions.length;

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

      {Object.keys(groups).length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t("noPermissions")}
        </p>
      )}

      <div className="space-y-4">
        {Object.entries(groups).map(([resource, groupPermissions]) => {
          const groupIds = groupPermissions.map((p) => p.id);
          const selectedCount = groupIds.filter((id) =>
            selected.includes(id),
          ).length;
          const allChecked = selectedCount === groupIds.length;
          const someChecked = selectedCount > 0 && !allChecked;

          return (
            <div
              key={resource}
              className="rounded-lg border p-4 bg-slate-50/50"
            >
              <div className="mb-3 flex items-center gap-3">
                <Checkbox
                  id={`group-${resource}`}
                  checked={someChecked ? "indeterminate" : allChecked}
                  onCheckedChange={(checked) => {
                    if (checked) onSelectAll(resource, groupIds);
                    else onClearAll(resource);
                  }}
                  disabled={disabled}
                />
                <Label
                  htmlFor={`group-${resource}`}
                  className="text-sm font-bold uppercase tracking-wider text-muted-foreground cursor-pointer"
                >
                  {resource.replace(/_/g, " ")}
                </Label>
                <Badge variant="secondary" className="ml-auto">
                  {selectedCount}/{groupIds.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {groupPermissions.map((permission) => {
                  const isSelected = selected.includes(permission.id);
                  return (
                    <div
                      key={permission.id}
                      className="flex items-start space-x-2 rounded-md p-2 hover:bg-muted/40"
                    >
                      <Checkbox
                        id={`perm-${permission.id}`}
                        checked={isSelected}
                        onCheckedChange={() => onToggle(permission.id)}
                        disabled={disabled}
                      />
                      <div className="grid gap-1 leading-none">
                        <Label
                          htmlFor={`perm-${permission.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {permission.name.replace(/_/g, " ")}
                        </Label>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">
                          {permission.description}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="ml-auto h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
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