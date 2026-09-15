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
import { Edit, Loader2, History } from "lucide-react";
import EdirMemberForm from "./edir-member-form";
import ImportEdirMembersDialog from "./import-edir-members-dialog";
import PersonHistoryDialog from "@/components/shared/person-history-dialog";

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
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
          {t("title", { count: memberList.length })}
        </h3>
        <div className="flex items-center gap-2">
          <ImportEdirMembersDialog />
          <EdirMemberForm associationId={associationId} />
        </div>
      </div>
      <div className="rounded-xs border border-[#E3E7EB] overflow-hidden bg-white shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-[#E3E7EB] hover:bg-slate-50">
              <TableHead className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider py-3 px-4">{t("table.name")}</TableHead>
              <TableHead className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider py-3 px-4">{t("table.id")}</TableHead>
              <TableHead className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider py-3 px-4">{t("table.position")}</TableHead>
              <TableHead className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider py-3 px-4">{t("table.phone")}</TableHead>
              <TableHead className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider py-3 px-4">{t("table.status")}</TableHead>
              <TableHead className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider py-3 px-4 text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#E3E7EB]">
            {memberList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-xs font-mono text-slate-400"
                >
                  {t("noMembers")}
                </TableCell>
              </TableRow>
            ) : (
              memberList.map((member) => (
                <TableRow key={member.id} className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="font-semibold text-xs text-slate-900 px-4 py-2.5">
                    {member.fullName}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600 px-4 py-2.5">{member.edirIdNumber}</TableCell>
                  <TableCell className="px-4 py-2.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {t(`positions.${member.position}`)}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600 px-4 py-2.5">{member.phoneNumber || "—"}</TableCell>
                  <TableCell className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-mono font-semibold border ${
                        member.isActive
                          ? "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {member.isActive
                        ? t("status.active")
                        : t("status.inactive")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-4 py-2.5">
                    <div className="flex justify-end items-center gap-1.5">
                      <PersonHistoryDialog
                        cityIdNumber={member.cityIdNumber}
                        personName={member.fullName}
                      />
                      <EdirMemberForm
                        associationId={associationId}
                        initialData={member}
                        trigger={
                          <Button variant="outline" size="icon" className="h-7 w-7 rounded-xs border-[#E3E7EB] text-slate-600 hover:bg-[#F7F8FA] hover:text-[#1769AA]">
                            <Edit className="w-3.5 h-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        }
                      />
                    </div>
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
