"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  useSaveAssociationMembersMutation,
  useGetAssociationGroupsQuery,
  useAddAssociationGroupMutation,
  useRenameAssociationGroupMutation,
  useDeleteAssociationGroupMutation,
} from "@/hooks/womens";
import {
  WomenAssociationGroup,
  WomenAssociationMember,
  WomenAssociationRecord,
} from "@/api/womens/associations";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Save,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const ROWS_PER_GROUP = 10;
const MAX_GROUPS = 20;

interface MemberRow {
  fullName: string;
  phoneNumber: string;
}

type GroupGrid = Record<number, MemberRow[]>;

const emptyGrid = (): MemberRow[] =>
  Array.from({ length: ROWS_PER_GROUP }, () => ({
    fullName: "",
    phoneNumber: "",
  }));

interface AssociationMembersManagerProps {
  associationId: number;
  members?: WomenAssociationMember[];
  groups?: WomenAssociationGroup[];
  approvalStatus?: WomenAssociationRecord["approvalStatus"];
}

export default function AssociationMembersManager({
  associationId,
  members,
  groups: initialGroups,
  approvalStatus,
}: AssociationMembersManagerProps) {
  const t = useTranslations("women.associations");
  const saveMutation = useSaveAssociationMembersMutation();
  const { data: groupsResponse } = useGetAssociationGroupsQuery(associationId);
  const groups: WomenAssociationGroup[] = useMemo(
    () => groupsResponse?.data ?? initialGroups ?? [],
    [groupsResponse, initialGroups]
  );

  const addGroupMutation = useAddAssociationGroupMutation();
  const renameGroupMutation = useRenameAssociationGroupMutation();
  const deleteGroupMutation = useDeleteAssociationGroupMutation();

  const buildGrid = (
    stored: WomenAssociationMember[] | undefined,
    groupList: WomenAssociationGroup[]
  ): GroupGrid => {
    const out: GroupGrid = {};
    for (const g of groupList) out[g.groupNumber] = emptyGrid();
    stored?.forEach((m) => {
      if (m.isDeleted) return;
      if (!out[m.groupNumber]) out[m.groupNumber] = emptyGrid();
      const slot = m.serialNumber - 1;
      if (slot >= 0 && slot < ROWS_PER_GROUP) {
        out[m.groupNumber][slot] = {
          fullName: m.fullName,
          phoneNumber: m.phoneNumber || "",
        };
      }
    });
    return out;
  };

  const initialGrid = useMemo(
    () => buildGrid(members, groups),
    [members, groups]
  );
  const [grid, setGrid] = useState<GroupGrid>(initialGrid);

  useEffect(() => {
    setGrid(initialGrid);
  }, [initialGrid]);

  const isDirty = useMemo(
    () => JSON.stringify(grid) !== JSON.stringify(initialGrid),
    [grid, initialGrid]
  );

  const filledCount = useMemo(
    () =>
      Object.values(grid)
        .flat()
        .filter((row) => row.fullName.trim().length > 0).length,
    [grid]
  );

  const [activeGroup, setActiveGroup] = useState<string>("");
  useEffect(() => {
    if (!groups.length) {
      setActiveGroup("");
      return;
    }
    if (!groups.find((g) => String(g.groupNumber) === activeGroup)) {
      setActiveGroup(String(groups[0].groupNumber));
    }
  }, [groups, activeGroup]);

  const [addOpen, setAddOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<WomenAssociationGroup | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<WomenAssociationGroup | null>(
    null
  );

  const isLocked = approvalStatus !== undefined && approvalStatus !== "DRAFT";

  const updateCell = (
    groupNumber: number,
    rowIndex: number,
    key: keyof MemberRow,
    value: string
  ) => {
    setGrid((prev) => {
      const existing = prev[groupNumber] ?? emptyGrid();
      const next = existing.map((row, ri) =>
        ri !== rowIndex ? row : { ...row, [key]: value }
      );
      return { ...prev, [groupNumber]: next };
    });
  };

  const handleSave = () => {
    for (const g of groups) {
      const rows = grid[g.groupNumber] ?? [];
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        const hasName = row.fullName.trim().length > 0;
        const hasPhone = row.phoneNumber.trim().length > 0;
        if (!hasName && hasPhone) {
          toast.error(
            t("members.errors.nameRequired", {
              group: g.groupNumber,
              row: r + 1,
            })
          );
          return;
        }
      }
    }

    const payload = groups.flatMap((g) =>
      (grid[g.groupNumber] ?? [])
        .map((row, ri) => ({ row, ri }))
        .filter(({ row }) => row.fullName.trim().length > 0)
        .map(({ row, ri }) => ({
          groupNumber: g.groupNumber,
          serialNumber: ri + 1,
          fullName: row.fullName.trim(),
          phoneNumber: row.phoneNumber.trim() || undefined,
        }))
    );

    saveMutation.mutate(
      { id: associationId, members: payload },
      {
        onSuccess: () => toast.success(t("members.messages.success")),
        onError: (error: any) =>
          toast.error(error?.message || t("members.messages.error")),
      }
    );
  };

  const nextGroupNumber = useMemo(() => {
    if (!groups.length) return 1;
    return Math.max(...groups.map((g) => g.groupNumber)) + 1;
  }, [groups]);

  const canAddGroup =
    !isLocked && groups.length < MAX_GROUPS && nextGroupNumber <= MAX_GROUPS;

  return (
    <Card className="md:col-span-3 rounded-xs border border-[#E3E7EB] bg-white shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-[#E3E7EB] pb-3">
        <div>
          <CardTitle className="text-sm font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">{t("members.title")}</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("members.description")}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {isDirty && (
            <span className="text-xs font-medium text-amber-600 font-mono">{t("members.unsaved")}</span>
          )}
          <span className="text-xs text-slate-500 font-mono">
            {t("members.filledCount", { count: filledCount })}
          </span>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending || isLocked}
            className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {t("members.save")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="text-xs text-slate-500 font-mono">
            {t("groups.count", { count: groups.length, max: MAX_GROUPS })}
          </div>
          {canAddGroup && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA] gap-1.5"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              {t("groups.addButton")}
            </Button>
          )}
        </div>

        {groups.length === 0 ? (
          <div className="rounded-xs border border-[#E3E7EB] bg-[#F7F8FA] p-6 text-center text-xs text-slate-500">
            {t("groups.empty")}
          </div>
        ) : (
          <Tabs value={activeGroup} onValueChange={setActiveGroup}>
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2">
              <TabsList className="flex-wrap h-auto bg-slate-100/80 p-1 border border-[#E3E7EB] rounded-xs">
                {groups.map((g) => (
                  <TabsTrigger key={g.id} value={String(g.groupNumber)} className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-2.5">
                    {t("members.groupTab", { group: g.groupNumber })}
                    <span className="ml-1 text-[11px] text-slate-500 font-mono">
                      ({g._count?.members ?? 0})
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {!isLocked && activeGroup && (
                <GroupActions
                  group={
                    groups.find((g) => String(g.groupNumber) === activeGroup) ??
                    null
                  }
                  onRename={(g) => setRenameTarget(g)}
                  onDelete={(g) => setDeleteTarget(g)}
                />
              )}
            </div>

            {groups.map((g) => (
              <TabsContent key={g.id} value={String(g.groupNumber)}>
                <div className="border border-[#E3E7EB] rounded-xs overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-[#F7F8FA] border-b border-[#E3E7EB]">
                      <tr>
                        <th className="w-16 px-3 py-2 text-left font-mono font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                          {t("members.serialNo")}
                        </th>
                        <th className="px-3 py-2 text-left font-mono font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                          {t("form.fields.memberFullName")}
                        </th>
                        <th className="px-3 py-2 text-left font-mono font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                          {t("form.fields.memberPhone")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E7EB]">
                      {Array.from({ length: ROWS_PER_GROUP }, (_, ri) => (
                        <tr
                          key={ri}
                          className="hover:bg-slate-50/50"
                        >
                          <td className="px-3 py-1.5 text-slate-500 font-mono text-xs">
                            {ri + 1}.
                          </td>
                          <td className="px-3 py-1.5">
                            <Input
                              className="h-7 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                              value={grid[g.groupNumber]?.[ri]?.fullName ?? ""}
                              onChange={(e) =>
                                updateCell(
                                  g.groupNumber,
                                  ri,
                                  "fullName",
                                  e.target.value
                                )
                              }
                              placeholder={t("form.placeholders.memberFullName")}
                              disabled={isLocked}
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <Input
                              className="h-7 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                              value={grid[g.groupNumber]?.[ri]?.phoneNumber ?? ""}
                              onChange={(e) =>
                                updateCell(
                                  g.groupNumber,
                                  ri,
                                  "phoneNumber",
                                  e.target.value
                                )
                              }
                              placeholder={t("form.placeholders.memberPhone")}
                              disabled={isLocked}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>

      <AddGroupDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        associationId={associationId}
        nextGroupNumber={nextGroupNumber}
        mutation={addGroupMutation}
      />
      <RenameGroupDialog
        group={renameTarget}
        onClose={() => setRenameTarget(null)}
        associationId={associationId}
        mutation={renameGroupMutation}
      />
      <DeleteGroupDialog
        group={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        associationId={associationId}
        mutation={deleteGroupMutation}
      />
    </Card>
  );
}

function GroupActions({
  group,
  onRename,
  onDelete,
}: {
  group: WomenAssociationGroup | null;
  onRename: (g: WomenAssociationGroup) => void;
  onDelete: (g: WomenAssociationGroup) => void;
}) {
  const t = useTranslations("women.associations");
  if (!group) return null;
  return (
    <div className="flex items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onRename(group)}
        title={t("groups.rename")}
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="text-destructive"
        onClick={() => onDelete(group)}
        title={t("groups.delete")}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

function AddGroupDialog({
  open,
  onClose,
  associationId,
  nextGroupNumber,
  mutation,
}: {
  open: boolean;
  onClose: () => void;
  associationId: number;
  nextGroupNumber: number;
  mutation: ReturnType<typeof useAddAssociationGroupMutation>;
}) {
  const t = useTranslations("women.associations");
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName(`Group ${nextGroupNumber}`);
  }, [open, nextGroupNumber]);

  const handleSubmit = () => {
    mutation.mutate(
      {
        id: associationId,
        groupNumber: nextGroupNumber,
        name: name.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(t("groups.messages.added"));
          onClose();
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || t("groups.messages.error")),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[420px] rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono">{t("groups.addTitle")}</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {t("groups.addDescription", { number: nextGroupNumber })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 py-2">
          <Label className="text-xs font-semibold text-slate-700">{t("groups.nameLabel")}</Label>
          <Input
            className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("groups.namePlaceholder")}
          />
        </div>
        <DialogFooter className="border-t border-[#E3E7EB] pt-4 gap-2">
          <Button variant="outline" className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]" onClick={onClose}>
            {t("form.buttons.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs"
          >
            {mutation.isPending && (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            )}
            {t("groups.addButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RenameGroupDialog({
  group,
  onClose,
  associationId,
  mutation,
}: {
  group: WomenAssociationGroup | null;
  onClose: () => void;
  associationId: number;
  mutation: ReturnType<typeof useRenameAssociationGroupMutation>;
}) {
  const t = useTranslations("women.associations");
  const [name, setName] = useState("");

  useEffect(() => {
    if (group) setName(group.name ?? `Group ${group.groupNumber}`);
  }, [group]);

  if (!group) return null;

  const handleSubmit = () => {
    const trimmed = name.trim();
    mutation.mutate(
      { id: associationId, groupId: group.id, name: trimmed.length ? trimmed : null },
      {
        onSuccess: () => {
          toast.success(t("groups.messages.renamed"));
          onClose();
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || t("groups.messages.error")),
      }
    );
  };

  return (
    <Dialog open={!!group} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[420px] rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono">{t("groups.renameTitle")}</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {t("groups.renameDescription", { number: group.groupNumber })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 py-2">
          <Label className="text-xs font-semibold text-slate-700">{t("groups.nameLabel")}</Label>
          <Input
            className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("groups.namePlaceholder")}
          />
        </div>
        <DialogFooter className="border-t border-[#E3E7EB] pt-4 gap-2">
          <Button variant="outline" className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]" onClick={onClose}>
            {t("form.buttons.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending} className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs">
            {mutation.isPending && (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            )}
            {t("groups.rename")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteGroupDialog({
  group,
  onClose,
  associationId,
  mutation,
}: {
  group: WomenAssociationGroup | null;
  onClose: () => void;
  associationId: number;
  mutation: ReturnType<typeof useDeleteAssociationGroupMutation>;
}) {
  const t = useTranslations("women.associations");
  if (!group) return null;
  const memberCount = group._count?.members ?? 0;
  const blocked = memberCount > 0;

  const handleConfirm = () => {
    mutation.mutate(
      { id: associationId, groupId: group.id },
      {
        onSuccess: () => {
          toast.success(t("groups.messages.deleted"));
          onClose();
        },
        onError: (err: any) =>
          toast.error(
            err?.response?.data?.message || t("groups.messages.deleteError")
          ),
      }
    );
  };

  return (
    <AlertDialog open={!!group} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="sm:max-w-[420px] rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <AlertDialogHeader className="border-b border-[#E3E7EB] pb-3">
          <AlertDialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono">{t("groups.deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-slate-500">
            {blocked
              ? t("groups.deleteBlocked", {
                  number: group.groupNumber,
                  count: memberCount,
                })
              : t("groups.deleteDescription", { number: group.groupNumber })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="border-t border-[#E3E7EB] pt-4 gap-2">
          <AlertDialogCancel className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]">{t("delete.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={blocked || mutation.isPending}
            className="h-8 text-xs font-semibold rounded-xs bg-red-600 hover:bg-red-700 text-white shadow-2xs"
          >
            {mutation.isPending && (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            )}
            {t("groups.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
