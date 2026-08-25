"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useSaveAssociationMembersMutation } from "@/hooks/womens";
import {
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
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const GROUPS = [1, 2, 3];
const ROWS_PER_GROUP = 10;

interface MemberRow {
  fullName: string;
  phoneNumber: string;
}

const emptyGrid = (): MemberRow[][] =>
  GROUPS.map(() =>
    Array.from({ length: ROWS_PER_GROUP }, () => ({
      fullName: "",
      phoneNumber: "",
    })),
  );

interface AssociationMembersManagerProps {
  associationId: number;
  members?: WomenAssociationMember[];
}

export default function AssociationMembersManager({
  associationId,
  members,
}: AssociationMembersManagerProps) {
  const t = useTranslations("women.associations");
  const saveMutation = useSaveAssociationMembersMutation();

  const buildGrid = (stored?: WomenAssociationMember[]): MemberRow[][] => {
    const grid = emptyGrid();
    stored?.forEach((m) => {
      if (
        m.groupNumber >= 1 &&
        m.groupNumber <= GROUPS.length &&
        m.serialNumber >= 1 &&
        m.serialNumber <= ROWS_PER_GROUP
      ) {
        grid[m.groupNumber - 1][m.serialNumber - 1] = {
          fullName: m.fullName,
          phoneNumber: m.phoneNumber || "",
        };
      }
    });
    return grid;
  };

  const initialGrid = useMemo(() => buildGrid(members), [members]);
  const [grid, setGrid] = useState<MemberRow[][]>(initialGrid);

  useEffect(() => {
    setGrid(initialGrid);
  }, [initialGrid]);

  const isDirty = useMemo(
    () => JSON.stringify(grid) !== JSON.stringify(initialGrid),
    [grid, initialGrid],
  );

  const filledCount = useMemo(
    () =>
      grid.flat().filter((row) => row.fullName.trim().length > 0).length,
    [grid],
  );

  const updateCell = (
    groupIndex: number,
    rowIndex: number,
    key: keyof MemberRow,
    value: string
  ) => {
    setGrid((prev) =>
      prev.map((group, gi) =>
        gi !== groupIndex
          ? group
          : group.map((row, ri) =>
              ri !== rowIndex ? row : { ...row, [key]: value },
            ),
      ),
    );
  };

  const handleSave = () => {
    // Validate: a filled name requires a phone number and vice versa.
    for (let g = 0; g < grid.length; g++) {
      for (let r = 0; r < grid[g].length; r++) {
        const row = grid[g][r];
        const hasName = row.fullName.trim().length > 0;
        const hasPhone = row.phoneNumber.trim().length > 0;
        if (!hasName && hasPhone) {
          toast.error(t("members.errors.nameRequired", { group: g + 1, row: r + 1 }));
          return;
        }
      }
    }

    const payload = grid.flatMap((group, gi) =>
      group
        .map((row, ri) => ({ row, gi, ri }))
        .filter(({ row }) => row.fullName.trim().length > 0)
        .map(({ row, ri }) => ({
          groupNumber: gi + 1,
          serialNumber: ri + 1,
          fullName: row.fullName.trim(),
          phoneNumber: row.phoneNumber.trim() || undefined,
        })),
    );

    saveMutation.mutate(
      { id: associationId, members: payload },
      {
        onSuccess: () => toast.success(t("members.messages.success")),
        onError: (error: any) =>
          toast.error(error?.message || t("members.messages.error")),
      },
    );
  };

  return (
    <Card className="md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{t("members.title")}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t("members.description")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs text-amber-600">{t("members.unsaved")}</span>
          )}
          <span className="text-sm text-muted-foreground">
            {t("members.filledCount", { count: filledCount })}
          </span>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="gap-2"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {t("members.save")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="0">
          <TabsList>
            {GROUPS.map((group, gi) => (
              <TabsTrigger key={group} value={String(gi)}>
                {t("members.groupTab", { group })}
              </TabsTrigger>
            ))}
          </TabsList>

          {GROUPS.map((_, gi) => (
            <TabsContent key={gi} value={String(gi)}>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="w-16 px-3 py-2 text-left font-semibold">
                        {t("members.serialNo")}
                      </th>
                      <th className="px-3 py-2 text-left font-semibold">
                        {t("form.fields.memberFullName")}
                      </th>
                      <th className="px-3 py-2 text-left font-semibold">
                        {t("form.fields.memberPhone")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: ROWS_PER_GROUP }, (_, ri) => (
                      <tr key={ri} className="border-t hover:bg-slate-50/50">
                        <td className="px-3 py-1.5 text-slate-500 font-medium">
                          {ri + 1}.
                        </td>
                        <td className="px-3 py-1.5">
                          <Input
                            className="h-8"
                            value={grid[gi]?.[ri]?.fullName ?? ""}
                            onChange={(e) =>
                              updateCell(gi, ri, "fullName", e.target.value)
                            }
                            placeholder={t("form.placeholders.memberFullName")}
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <Input
                            className="h-8"
                            value={grid[gi]?.[ri]?.phoneNumber ?? ""}
                            onChange={(e) =>
                              updateCell(gi, ri, "phoneNumber", e.target.value)
                            }
                            placeholder={t("form.placeholders.memberPhone")}
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
      </CardContent>
    </Card>
  );
}
