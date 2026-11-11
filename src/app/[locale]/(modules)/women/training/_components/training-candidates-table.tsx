"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
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
import Link from "next/link";
import WomenTrainingForm from "./training-form";

interface CandidateRecord {
  id: number;
  wantsTraining: boolean;
  requestedTrainingTopic?: string;
  postTrainingParticipation?: string;
  desiredSector?: string;
  traineeStatus?: string[];
  client: {
    id: number;
    faydaId?: string;
    firstName: string;
    lastName: string;
    grandfatherName?: string;
    phoneNumber?: string;
    age?: number;
    educationLevel?: string;
    subCity?: string;
    woreda?: string;
    zone?: string;
    block?: string;
  };
  trainings?: any[];
}

interface TrainingCandidatesTableProps {
  candidates?: CandidateRecord[];
  isLoading?: boolean;
}

export default function TrainingCandidatesTable({
  candidates = [],
  isLoading,
}: TrainingCandidatesTableProps) {
  const router = useRouter();
  const t = useTranslations("women.training");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(null);
  const [enrollOpen, setEnrollOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (candidates || []).filter((c) => {
      const name = `${c.client?.firstName || ""} ${c.client?.lastName || ""} ${c.client?.grandfatherName || ""}`.toLowerCase();
      const topic = (c.requestedTrainingTopic || "").toLowerCase();
      const fayda = (c.client?.faydaId || "").toLowerCase();
      const phone = (c.client?.phoneNumber || "").toLowerCase();
      const loc = `${c.client?.subCity || ""} ${c.client?.woreda || ""}`.toLowerCase();
      return name.includes(q) || topic.includes(q) || fayda.includes(q) || phone.includes(q) || loc.includes(q);
    });
  }, [candidates, search]);

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const currentData = filtered.slice(startIndex, startIndex + limit);

  return (
    <>
      {selectedCandidate && (
        <WomenTrainingForm
          candidate={selectedCandidate}
          open={enrollOpen}
          onOpenChange={(open) => {
            setEnrollOpen(open);
            if (!open) setSelectedCandidate(null);
          }}
        />
      )}

      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-5 border-b border-[#E3E7EB]">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              <Users className="w-4 h-4 text-amber-600" />
              {t("candidatesTable.title")}
            </CardTitle>
            <Badge variant="outline" className="text-[11px] font-mono bg-amber-50 text-amber-800 border-amber-200">
              {totalItems} Candidates
            </Badge>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder={t("searchPlaceholder")}
              className="pl-8 h-8 text-xs bg-slate-50/50 border-[#E3E7EB] rounded-xs"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-[#E3E7EB]">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3 pl-5">
                    {t("candidatesTable.candidate")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("candidatesTable.demographics")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("candidatesTable.requestedTopic")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("candidatesTable.desiredSector")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("candidatesTable.location")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right py-3 pr-5">
                    {t("candidatesTable.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-500">
                      {t("candidatesTable.loading")}
                    </TableCell>
                  </TableRow>
                ) : currentData.length > 0 ? (
                  currentData.map((cand) => {
                    const fullName = [cand.client?.firstName, cand.client?.lastName, cand.client?.grandfatherName]
                      .filter(Boolean)
                      .join(" ");
                    const enrolledCount = cand.trainings?.length || 0;

                    return (
                      <TableRow
                        key={cand.id}
                        className="hover:bg-[#F7F8FA] cursor-pointer transition-colors border-b border-[#E3E7EB] last:border-0"
                        onClick={() => router.push(`/women/profiles/${cand.id}`)}
                      >
                        <TableCell className="py-3 pl-5">
                          <div className="font-semibold text-xs text-[#0B1F3A]">{fullName || "N/A"}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {cand.client?.faydaId && (
                              <span className="font-mono text-[11px] text-slate-500">
                                Fayda: {cand.client.faydaId}
                              </span>
                            )}
                            {cand.client?.phoneNumber && (
                              <span className="font-mono text-[11px] text-slate-500">
                                {cand.client.phoneNumber}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-700 py-3">
                          <div>{cand.client?.educationLevel || "—"}</div>
                          {cand.client?.age && (
                            <span className="text-[11px] text-slate-500 font-mono">
                              Age: {cand.client.age}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-800 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold bg-[#E8F2FA] text-[#1769AA] border border-[#B8D7F0]">
                            {cand.requestedTrainingTopic || "General"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 py-3">
                          <div>{cand.desiredSector || "—"}</div>
                          {cand.postTrainingParticipation && (
                            <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                              {cand.postTrainingParticipation}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 py-3">
                          <div>
                            {cand.client?.subCity || "—"}
                            {cand.client?.woreda ? `, W. ${cand.client.woreda}` : ""}
                          </div>
                          {cand.client?.block && (
                            <span className="text-[11px] font-mono text-slate-500">
                              Block: {cand.client.block}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-3 pr-5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="h-7 text-xs px-2.5 rounded-xs bg-[#1769AA] hover:bg-[#125386] text-white cursor-pointer"
                              onClick={() => {
                                setSelectedCandidate(cand);
                                setEnrollOpen(true);
                              }}
                            >
                              <GraduationCap className="w-3.5 h-3.5 mr-1" />
                              {t("candidatesTable.enroll")}
                            </Button>
                            <Link
                              href={`/women/profiles/${cand.id}`}
                              className="inline-flex items-center justify-center h-7 w-7 rounded-xs text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA]"
                              title="View Profile"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-400">
                      {t("candidatesTable.noCandidates")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalItems > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E3E7EB] bg-slate-50/40">
              <div className="text-xs text-slate-500 font-mono">
                {t("showing", {
                  from: startIndex + 1,
                  to: Math.min(startIndex + limit, totalItems),
                  total: totalItems,
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-7 px-2.5 text-xs rounded-xs border-[#E3E7EB] hover:bg-white cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  {t("pagination.prev")}
                </Button>
                <div className="text-xs font-mono text-slate-600 px-2">
                  {page} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="h-7 px-2.5 text-xs rounded-xs border-[#E3E7EB] hover:bg-white cursor-pointer disabled:opacity-40"
                >
                  {t("pagination.next")}
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
