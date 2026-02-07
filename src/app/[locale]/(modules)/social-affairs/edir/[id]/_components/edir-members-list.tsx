"use client";

import { useGetEdirMembersQuery } from "@/hooks/social-affairs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import EdirMemberForm from "./edir-member-form";
import ImportEdirMembersDialog from "./import-edir-members-dialog";

interface EdirMembersListProps {
  associationId: number;
}

import { useTranslations } from "next-intl";

export default function EdirMembersList({
  associationId,
}: EdirMembersListProps) {
  const t = useTranslations("social-affairs.edir.edir-members");
  const {
    data: members,
    isLoading,
    isError,
  } = useGetEdirMembersQuery(associationId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center p-8 text-red-500">{t("error")}</div>;
  }

  const memberList = members || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {t("title", { count: memberList.length })}
        </h3>
        <div className="flex items-center gap-2">
          <ImportEdirMembersDialog />
          <EdirMemberForm associationId={associationId} />
        </div>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.name")}</TableHead>
              <TableHead>{t("table.id")}</TableHead>
              <TableHead>{t("table.position")}</TableHead>
              <TableHead>{t("table.phone")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t("noMembers")}
                </TableCell>
              </TableRow>
            ) : (
              memberList.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.fullName}
                  </TableCell>
                  <TableCell>{member.edirIdNumber}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {t(`positions.${member.position}`)}
                    </span>
                  </TableCell>
                  <TableCell>{member.phoneNumber}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        member.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.isActive
                        ? t("status.active")
                        : t("status.inactive")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <EdirMemberForm
                      associationId={associationId}
                      initialData={member}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
