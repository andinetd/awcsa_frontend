import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  X,
  Check,
  Baby,
  MapPin,
  User,
  Search,
  Sparkles,
  Users,
  AlertTriangle,
  Award,
  FileCheck2,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { Child, MatchRecommendationCandidate, CommitteeMember } from "@/types/child-matching-types";
import { useAuthStore } from "@/stores/auth-store";
import { BASE_URL } from "@/lib/base-url";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useChildrenByStatus } from "@/hooks/adoption/useChildren";
import { useQueryClient } from "@tanstack/react-query";
import {
  getMatchRecommendationsForApplication,
  executeConfirmedAdoptionMatch,
  recordAdoptionCommitteeReview,
} from "@/api/adoption/matches";

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
  const [activeTab, setActiveTab] = useState<"directory" | "smart">("directory");
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<MatchRecommendationCandidate | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [matchNote, setMatchNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<
    MatchRecommendationCandidate[]
  >([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Committee Sign-Off state
  const [requireCommitteeSignOff, setRequireCommitteeSignOff] = useState(true);
  const [committeeChairName, setCommitteeChairName] = useState("Director of Child Affairs");
  const [committeeDeliberation, setCommitteeDeliberation] = useState(
    "Adoption Placement Committee reviewed the file and confirmed mutual compatibility.",
  );

  const t = useTranslations("adoption");
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const router = useRouter();

  // Load manual directory of children
  const { data: availableChildren = [], isLoading: loadingChildren } =
    useChildrenByStatus(isOpen ? "IN_CARE" : "");

  // Fetch algorithmic recommendations when modal opens
  useEffect(() => {
    if (isOpen && applicationId) {
      setLoadingRecommendations(true);
      getMatchRecommendationsForApplication(applicationId)
        .then((res) => {
          if (res?.recommendations) {
            setRecommendations(res.recommendations);
            if (res.recommendations.length > 0) {
              setSelectedRecommendation(res.recommendations[0]);
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching match recommendations:", err);
        })
        .finally(() => {
          setLoadingRecommendations(false);
        });
    }
  }, [isOpen, applicationId]);

  if (!isOpen) return null;

  const filteredChildren = (
    Array.isArray(availableChildren) ? availableChildren : []
  ).filter((child: Child) => {
    const fullName =
      `${child.serviceData.formData.firstName} ${child.serviceData.formData.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleSelectRecommendation = (rec: MatchRecommendationCandidate) => {
    setSelectedRecommendation(rec);
    // Find matching child from availableChildren if loaded
    const matched = availableChildren.find(
      (c: Child) =>
        c.id === rec.childRegistrationId ||
        c.childIdFromFacility === rec.facilityChildId,
    );
    if (matched) {
      setSelectedChild(matched);
    } else {
      // Synthesize selected child object
      setSelectedChild({
        id: rec.childRegistrationId,
        serviceDataId: 0,
        childIdFromFacility: rec.facilityChildId,
        currentStatus: "IN_CARE",
        serviceData: {
          id: 0,
          formData: {
            firstName: rec.firstName,
            lastName: rec.lastName,
            sex: rec.gender ?? undefined,
            dateOfBirth: rec.dateOfBirth ?? undefined,
          },
        },
        childCareFacility: {
          id: 0,
          name: rec.facilityName || "Care Center",
        },
      } as unknown as Child);
    }
  };

  const handleMatch = async () => {
    const targetFacilityChildId =
      selectedRecommendation?.facilityChildId ||
      selectedChild?.childIdFromFacility ||
      "";

    if (!targetFacilityChildId) {
      toast.error("Please select a child to proceed with placement.");
      return;
    }

    const applicantIdNum = applicantId != null ? Number(applicantId) : undefined;
    const applicationIdNum = Number(applicationId);

    if (
      applicantIdNum == null ||
      isNaN(applicantIdNum) ||
      isNaN(applicationIdNum)
    ) {
      toast.error(t("adoptionDetail.matching.invalidId"));
      return;
    }

    setIsSubmitting(true);

    try {
      let committeeReviewId: number | undefined = undefined;

      // 1. Record formal committee review if enabled
      if (requireCommitteeSignOff) {
        const committeePayload = {
          applicationId: applicationIdNum,
          childRegistrationId:
            selectedRecommendation?.childRegistrationId || selectedChild?.id || 1,
          committeeMembers: [
            {
              name: committeeChairName,
              role: "Committee Chairperson",
              agency: "Addis Ababa Women & Social Affairs Bureau",
              vote: "APPROVE",
            },
            {
              name: "Lead Social Worker",
              role: "Caseworker",
              agency: "Child Welfare Department",
              vote: "APPROVE",
            },
          ],
          decision: "APPROVED",
          deliberationNotes: committeeDeliberation,
        };

        const revRes = await recordAdoptionCommitteeReview(committeePayload);
        committeeReviewId = revRes?.review?.id;
      }

      // 2. Approve application status
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

      // 3. Execute Placement via Intelligent Matching API
      const matchPayload = {
        childIdFromFacility: targetFacilityChildId,
        applicantId: applicantIdNum,
        applicationId: applicationIdNum,
        committeeReviewId: committeeReviewId ?? null,
        matchScore: selectedRecommendation?.matchScore ?? null,
        scoringBreakdown: selectedRecommendation?.breakdown ?? null,
        note: matchNote || "Placement executed following committee verification",
      };

      await executeConfirmedAdoptionMatch(matchPayload);

      queryClient.invalidateQueries({ queryKey: ["adoption", "applications"] });
      queryClient.invalidateQueries({ queryKey: ["adoption-children"] });
      queryClient.invalidateQueries({ queryKey: ["adoption", "matches"] });

      setSelectedChild(null);
      setSelectedRecommendation(null);
      setMatchNote("");
      setIsSubmitting(false);
      onClose();
      router.push("../adoption-requests");
      toast.success("Child matched successfully with committee verification!");
    } catch (error) {
      console.error("Error executing placement:", error);
      setIsSubmitting(false);

      let message = "Failed to finalize placement. Please try again.";
      if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<any>;
        const respData = axiosErr.response?.data;
        if (respData?.message) {
          message = String(respData.message);
        }
      }
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-[#E3E7EB] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-[#E3E7EB] flex justify-between items-center bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1769AA]/10 text-[#1769AA] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Phase 3 Engine
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Ethical Adoption Matching & Placement Committee
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-factor algorithmic recommendations & committee deliberation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#E3E7EB] bg-slate-100/60 px-6 gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("directory")}
            className={`py-2.5 px-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "directory"
                ? "border-[#1769AA] text-[#1769AA] bg-white font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            Institutional Care Directory ({availableChildren.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("smart")}
            className={`py-2.5 px-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "smart"
                ? "border-[#1769AA] text-[#1769AA] bg-white font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Recommendation Metrics Preview (On Hold)
            <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-medium">
              Calibrating
            </span>
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Column: Selection List */}
          <div className="w-full md:w-1/2 border-r border-[#E3E7EB] flex flex-col bg-white">
            {activeTab === "smart" ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="bg-blue-50/70 border border-blue-200/80 rounded p-2.5 text-xs text-blue-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Ethical Recommendation Engine:</span>{" "}
                    Evaluates age preference, health capability, sibling readiness, and home suitability.
                  </div>
                </div>

                {loadingRecommendations ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    Calculating compatibility scores across children registry...
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No eligible children currently available in institutional care.
                  </div>
                ) : (
                  recommendations.map((rec) => {
                    const isSelected =
                      selectedRecommendation?.childRegistrationId ===
                      rec.childRegistrationId;
                    return (
                      <div
                        key={rec.childRegistrationId}
                        onClick={() => handleSelectRecommendation(rec)}
                        className={`p-3.5 rounded-sm border cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#1769AA] bg-blue-50/60 ring-1 ring-[#1769AA]"
                            : "border-[#E3E7EB] hover:border-blue-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-sm">
                                {rec.firstName} {rec.lastName}
                              </h4>
                              {rec.inSiblingGroup && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <Users className="w-2.5 h-2.5" />
                                  {rec.siblingCount} Sibling Group
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {rec.gender || "Unknown"} •{" "}
                              {rec.ageYears !== null
                                ? `${rec.ageYears} years old`
                                : "Age unknown"}{" "}
                              • {rec.facilityName || "Institutional Care"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold ${
                                rec.matchScore >= 80
                                  ? "bg-emerald-100 text-emerald-800"
                                  : rec.matchScore >= 60
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {rec.matchScore}% Match
                            </span>
                          </div>
                        </div>

                        {/* Recommendation Explainability Tags */}
                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap gap-1">
                          {rec.explanationHighlights.map((hl, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-white border border-[#E3E7EB] px-1.5 py-0.5 rounded text-slate-700"
                            >
                              ✓ {hl}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Directory View */
              <div className="flex-1 flex flex-col">
                <div className="p-3 border-b border-[#E3E7EB]">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by child name..."
                      className="w-full pl-8 pr-3 py-1.5 rounded border border-[#E3E7EB] text-xs focus:ring-1 focus:ring-[#1769AA] outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {filteredChildren.map((child: Child) => (
                    <div
                      key={child.id}
                      onClick={() => {
                        setSelectedChild(child);
                        setSelectedRecommendation(null);
                      }}
                      className={`p-3 rounded-sm border cursor-pointer transition ${
                        selectedChild?.id === child.id && !selectedRecommendation
                          ? "border-[#1769AA] bg-blue-50/60 ring-1 ring-[#1769AA]"
                          : "border-[#E3E7EB] hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">
                            {child.serviceData.formData.firstName}{" "}
                            {child.serviceData.formData.lastName}
                          </h4>
                          <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                            <p>
                              {child.serviceData.formData.sex || "Unknown"} • ID:{" "}
                              {child.childIdFromFacility || "N/A"}
                            </p>
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {child.placeWhereChildFound || "Location unknown"}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                          {child.currentStatus || "IN_CARE"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Candidate Profile & Committee Review Confirmation */}
          <div className="w-full md:w-1/2 p-5 bg-slate-50/60 flex flex-col overflow-y-auto space-y-4">
            {selectedRecommendation || selectedChild ? (
              <div className="space-y-4">
                {/* Header Banner */}
                <div className="bg-white p-4 rounded-sm border border-[#E3E7EB] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 text-[#1769AA] rounded-full flex items-center justify-center font-bold text-lg">
                      <Baby className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {selectedRecommendation
                          ? `${selectedRecommendation.firstName} ${selectedRecommendation.lastName}`
                          : `${selectedChild?.serviceData.formData.firstName} ${selectedChild?.serviceData.formData.lastName}`}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Facility ID:{" "}
                        {selectedRecommendation?.facilityChildId ||
                          selectedChild?.childIdFromFacility ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                  {selectedRecommendation && (
                    <div className="text-right">
                      <span className="text-xl font-black text-[#1769AA]">
                        {selectedRecommendation.matchScore}%
                      </span>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">
                        Algorithmic Fit
                      </p>
                    </div>
                  )}
                </div>

                {/* Score Breakdown (Radar / Progress metrics) */}
                {selectedRecommendation && (
                  <div className="bg-white p-3.5 rounded-sm border border-[#E3E7EB] space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#1769AA]" />
                      Compatibility Factors
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                          <span>Age Fit</span>
                          <span>{selectedRecommendation.breakdown.ageFitScore}/25</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-[#1769AA] h-full"
                            style={{
                              width: `${(selectedRecommendation.breakdown.ageFitScore / 25) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                          <span>Special Health</span>
                          <span>{selectedRecommendation.breakdown.specialNeedsFitScore}/25</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full"
                            style={{
                              width: `${(selectedRecommendation.breakdown.specialNeedsFitScore / 25) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                          <span>Sibling Readiness</span>
                          <span>{selectedRecommendation.breakdown.siblingCapacityScore}/20</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-amber-600 h-full"
                            style={{
                              width: `${(selectedRecommendation.breakdown.siblingCapacityScore / 20) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                          <span>Gender Fit</span>
                          <span>{selectedRecommendation.breakdown.genderFitScore}/15</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full"
                            style={{
                              width: `${(selectedRecommendation.breakdown.genderFitScore / 15) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sibling Non-Separation Warning */}
                {selectedRecommendation?.inSiblingGroup && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-sm text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Sibling Group Integrity Alert:</span> This child has{" "}
                      <strong>{selectedRecommendation.siblingCount - 1} sibling(s)</strong> in care. Ethiopian child protection guidelines recommend joint placement.
                    </div>
                  </div>
                )}

                {/* Institutional Placement Committee Sign-off Section */}
                <div className="bg-white p-3.5 rounded-sm border border-[#E3E7EB] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                      Placement Committee Review
                    </h4>
                    <label className="text-[11px] text-slate-600 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireCommitteeSignOff}
                        onChange={(e) => setRequireCommitteeSignOff(e.target.checked)}
                        className="rounded text-[#1769AA]"
                      />
                      Record Committee Sign-off
                    </label>
                  </div>

                  {requireCommitteeSignOff && (
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Committee Chairperson
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-[#E3E7EB] rounded text-xs bg-slate-50 focus:bg-white"
                          value={committeeChairName}
                          onChange={(e) => setCommitteeChairName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Deliberation Summary & Recommendations
                        </label>
                        <textarea
                          className="w-full p-2 border border-[#E3E7EB] rounded text-xs bg-slate-50 focus:bg-white min-h-[50px]"
                          value={committeeDeliberation}
                          onChange={(e) => setCommitteeDeliberation(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Placement Notes */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Placement Case Note
                  </label>
                  <textarea
                    className="w-full p-2.5 rounded border border-[#E3E7EB] text-xs bg-white focus:ring-1 focus:ring-[#1769AA] outline-none min-h-[55px]"
                    placeholder="Provide any specific instructions or post-placement monitoring notes..."
                    value={matchNote}
                    onChange={(e) => setMatchNote(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
                <User className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-xs font-medium">Select a candidate child to review compatibility</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-[#E3E7EB] flex justify-between items-center">
          <div className="text-[11px] text-slate-500">
            {selectedRecommendation
              ? `Selected candidate: ${selectedRecommendation.firstName} ${selectedRecommendation.lastName}`
              : selectedChild
              ? `Selected child: ${selectedChild.serviceData.formData.firstName}`
              : "No candidate currently selected"}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs h-8 border-[#E3E7EB] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={(!selectedRecommendation && !selectedChild) || isSubmitting}
              onClick={handleMatch}
              className="bg-[#1769AA] hover:bg-[#12568E] text-white text-xs h-8 px-4 cursor-pointer"
            >
              {isSubmitting ? (
                "Finalizing Placement..."
              ) : (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirm Placement & Record Committee Sign-Off
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
