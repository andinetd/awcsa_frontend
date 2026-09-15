import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/custom/custom-card";
import { X, Check, Baby, MapPin, User, Search } from "lucide-react";
import { Child, MatchRequest } from "@/types/child-matching-types";
import { useAuthStore } from "@/stores/auth-store";
import { BASE_URL } from "@/lib/base-url";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useChildrenByStatus } from "@/hooks/adoption/useChildren";
import { useQueryClient } from "@tanstack/react-query";

interface ChildMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number;
  applicantId?: number;
}

export const ChildMatchingModal: React.FC<ChildMatchingModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  applicantId,
}) => {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [matchNote, setMatchNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations("adoption");
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const router = useRouter();

  const { data: availableChildren = [], isLoading: loadingChildren } =
    useChildrenByStatus(isOpen ? "IN_CARE" : "");

  if (!isOpen) return null;

  const filteredChildren = (
    Array.isArray(availableChildren) ? availableChildren : []
  ).filter((child: Child) => {
    const fullName =
      `${child.serviceData.formData.firstName} ${child.serviceData.formData.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleMatch = async () => {
    if (!selectedChild) return;

    setIsSubmitting(true);

    const applicantIdNum =
      applicantId != null ? Number(applicantId) : undefined;
    const applicationIdNum = Number(applicationId);

    if (
      applicantIdNum == null ||
      isNaN(applicantIdNum) ||
      isNaN(applicationIdNum)
    ) {
      toast.error(t("adoptionDetail.matching.invalidId"));
      return;
    }

    const payload: MatchRequest = {
      childIdFromFacility: selectedChild.childIdFromFacility || "",
      applicantId: applicantIdNum,
      applicationId: applicationIdNum,
      note: matchNote,
    };

    console.log("Submitting match:", payload);

    try {
      await axios.put(
        `${BASE_URL}/adoption/applications/${applicationIdNum}/approve`,
        { status: "APPROVED" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const res = await axios.post(`${BASE_URL}/adoption/matches`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      queryClient.invalidateQueries({ queryKey: ["adoption", "applications"] });
      queryClient.invalidateQueries({ queryKey: ["adoption-children"] });
      queryClient.invalidateQueries({ queryKey: ["adoption", "matches"] });

      setSelectedChild(null);
      setMatchNote("");
      setIsSubmitting(false);
      onClose();
      router.push("../adoption-requests");
      toast.success(t("adoptionDetail.matching.success"));
    } catch (error) {
      console.error("Error submitting form:", error);

      // extract a useful message from AxiosError if possible
      let message = "Failed to submit home visit feedback. Please try again.";

      if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<any>;
        // prefer server-provided message shape
        const respData = axiosErr.response?.data;
        if (respData) {
          if (typeof respData === "string") {
            message = respData;
          } else if (respData.message) {
            message = String(respData.message);
          } else if (respData.errors) {
            try {
              // if errors is array or object, make it readable
              if (Array.isArray(respData.errors)) {
                message = respData.errors
                  .map((e: any) => e.message || JSON.stringify(e))
                  .join("; ");
              } else {
                message = JSON.stringify(respData.errors);
              }
            } catch {
              message = String(respData.errors);
            }
          } else {
            try {
              message = JSON.stringify(respData);
            } catch {
              message = String(respData);
            }
          }
        } else if (axiosErr.message) {
          message = axiosErr.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      // show the extracted message in the toast
      toast.error(message);
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {t("adoptionDetail.matching.title")}
            </h2>
            <p className="text-sm text-slate-500">
              {t("adoptionDetail.matching.subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left: List */}
          <div className="w-full md:w-1/2 border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={t("adoptionDetail.matching.searchPlaceholder")}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredChildren.map((child: Child) => (
                <div
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedChild?.id === child.id
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {child.serviceData.formData.firstName}{" "}
                        {child.serviceData.formData.lastName}
                      </h4>
                      <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                        <p>
                          {child.serviceData.formData.sex
                            ? t(`enums.sex.${child.serviceData.formData.sex}`)
                            : t("adoptionDetail.matching.unknown")}{" "}
                          •{" "}
                          {child.serviceData.formData.dateOfBirth
                            ? t("adoptionDetail.matching.yearsOld", {
                                count:
                                  new Date().getFullYear() -
                                  new Date(
                                    child.serviceData.formData.dateOfBirth,
                                  ).getFullYear(),
                              })
                            : t("adoptionDetail.matching.ageUnknown")}
                        </p>
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {child.placeWhereChildFound ||
                            t("adoptionDetail.matching.locationUnknown")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                        {child.currentStatus
                          ? t(
                              `statuses.${child.currentStatus
                                .toLowerCase()
                                .replace(/ /g, "_")}`,
                            )
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details & Confirm */}
          <div className="w-full md:w-1/2 p-6 bg-slate-50/50 flex flex-col overflow-y-auto">
            {selectedChild ? (
              <div className="space-y-6">
                <div className="text-center pb-6 border-b border-slate-200">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Baby className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedChild.serviceData.formData.firstName}{" "}
                    {selectedChild.serviceData.formData.lastName}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    ID: {selectedChild.childIdFromFacility || "N/A"}
                  </p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">
                        {t("adoptionDetail.matching.dob")}
                      </label>
                      <p className="font-medium">
                        {selectedChild.serviceData.formData.dateOfBirth
                          ? new Date(
                              selectedChild.serviceData.formData.dateOfBirth,
                            ).toLocaleDateString()
                          : t("adoptionDetail.matching.unknown")}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">
                        {t("adoptionDetail.matching.gender")}
                      </label>
                      <p className="font-medium">
                        {selectedChild.serviceData.formData.sex
                          ? t(
                              `enums.sex.${selectedChild.serviceData.formData.sex}`,
                            )
                          : t("adoptionDetail.matching.unknown")}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">
                        {t("adoptionDetail.matching.facility")}
                      </label>
                      <p className="font-medium">
                        {selectedChild.childCareFacility?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">
                        {t("adoptionDetail.matching.status")}
                      </label>
                      <p className="font-medium">
                        {selectedChild.currentStatus
                          ? t(
                              `statuses.${selectedChild.currentStatus
                                .toLowerCase()
                                .replace(/ /g, "_")}`,
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">
                      {t("adoptionDetail.matching.additionalInfo")}
                    </label>
                    <div className="p-3 bg-white rounded border border-slate-200 text-slate-600">
                      {selectedChild.additionalInfo ||
                        t("adoptionDetail.matching.noAdditionalInfo")}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <label className="text-sm font-bold text-slate-700 block mb-2">
                      {t("adoptionDetail.matching.matchingNote")}
                    </label>
                    <textarea
                      className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[80px]"
                      placeholder={t("adoptionDetail.matching.notePlaceholder")}
                      value={matchNote}
                      onChange={(e) => setMatchNote(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <User className="w-12 h-12 mb-3 opacity-20" />
                <p>{t("adoptionDetail.matching.emptyState")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="cursor-pointer">
            {t("adoptionDetail.matching.cancel")}
          </Button>
          <Button
            disabled={!selectedChild}
            onClick={handleMatch}
            className="cursor-pointer"
          >
            {t("adoptionDetail.matching.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
};
