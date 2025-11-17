"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";

function LabeledRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-1">
      <div className="text-sm text-gray-600 col-span-1">{label}</div>
      <div className="col-span-2">{value ?? ""}</div>
    </div>
  );
}

export default function HomeVisitFieldsPage() {
  const router = useRouter();
  const params = useParams();
  const serviceDataId = (params as any)?.serviceDataId ?? "";
  const token = useAuthStore((s) => s.token);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/adoption/home-visit/${serviceDataId}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        if (!mounted) return;
        // API returns { message, data: { id, formData, ... } } - extract formData when present
        const raw = res.data;
        const form = raw?.data?.formData ?? raw?.formData ?? raw;
        setData(form ?? null);
        setMeta(raw?.data ?? raw ?? null);
      } catch (err) {
        console.error("Error fetching home visit data:", err);
        toast.error("Failed to load home visit data");
        setData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (serviceDataId) fetchData();
    else setLoading(false);

    return () => {
      mounted = false;
    };
  }, [serviceDataId, token]);

  // A simple fallback/shape so we can render fields even when no backend data exists.
  const fallback = {
    generalInfo: {
      socialWorkerName: "",
      placeOfVisit: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      address: {
        region: "",
        subCity: "",
        woreda: "",
        kebele: "",
        houseNumber: "",
        neighborhoodName: "",
      },
    },
    applicantFather: {},
    applicantMother: {},
    witnesses: [],
    socialWorkerEvaluation: {},
  };

  const payload = data ?? fallback;
  const metaInfo = meta ?? {};

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Home Visit — Fields</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/adoption/adoption-requests/${serviceDataId}`)
            }
          >
            Back
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-2">
          <div className="space-y-2 xl:flex xl:justify-between xl:space-x-2">
            {/* Metadata */}
            <Card className="p-4 space-y-1 w-full">
              <h2 className="text-lg font-medium mb-2">Metadata</h2>
              <LabeledRow label="Service Data ID" value={serviceDataId} />
              <LabeledRow label="Created" value={metaInfo.createdAt} />
              <LabeledRow label="Updated" value={metaInfo.updatedAt} />
              <LabeledRow
                label="Filled By"
                value={metaInfo.filledBy?.email ?? metaInfo.filledById}
              />
              <LabeledRow
                label="Application Status"
                value={metaInfo.adoptionData?.serviceData?.status}
              />
              <LabeledRow
                label="Client"
                value={
                  metaInfo.adoptionData?.serviceData?.client
                    ? `${metaInfo.adoptionData.serviceData.client.firstName} ${metaInfo.adoptionData.serviceData.client.lastName}`
                    : ""
                }
              />
            </Card>
            <Card className="p-4 w-full">
              <h2 className="text-lg font-medium mb-2">General Info</h2>
              <LabeledRow
                label="Social Worker"
                value={payload.generalInfo?.socialWorkerName}
              />
              <LabeledRow
                label="Place of Visit"
                value={payload.generalInfo?.placeOfVisit}
              />
              <LabeledRow
                label="Start"
                value={`${payload.generalInfo?.startDate ?? ""} ${
                  payload.generalInfo?.startTime ?? ""
                }`}
              />
              <LabeledRow
                label="End"
                value={`${payload.generalInfo?.endDate ?? ""} ${
                  payload.generalInfo?.endTime ?? ""
                }`}
              />
              <LabeledRow
                label="Region"
                value={payload.generalInfo?.address?.region}
              />
              <LabeledRow
                label="SubCity"
                value={payload.generalInfo?.address?.subCity}
              />
              <LabeledRow
                label="Woreda"
                value={payload.generalInfo?.address?.woreda}
              />
              <LabeledRow
                label="Kebele"
                value={payload.generalInfo?.address?.kebele}
              />
              <LabeledRow
                label="House No"
                value={payload.generalInfo?.address?.houseNumber}
              />
              <LabeledRow
                label="Neighborhood"
                value={payload.generalInfo?.address?.neighborhoodName}
              />
            </Card>
          </div>
          <div className="space-y-2 xl:flex xl:justify-between xl:space-x-2 mt-1">
            <Card className="p-4 w-full">
              <h2 className="text-lg font-medium mb-2">Applicant Father</h2>
              {Object.keys(payload.applicantFather || {}).length === 0 ? (
                <div className="text-sm text-gray-500">No data</div>
              ) : (
                <div className="space-y-1">
                  {Object.entries(payload.applicantFather).map(([k, v]) => (
                    <LabeledRow key={k} label={k} value={String(v)} />
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-4 w-full">
              <h2 className="text-lg font-medium mb-2">Applicant Mother</h2>
              {Object.keys(payload.applicantMother || {}).length === 0 ? (
                <div className="text-sm text-gray-500">No data</div>
              ) : (
                <div className="space-y-1">
                  {Object.entries(payload.applicantMother).map(([k, v]) => (
                    <LabeledRow key={k} label={k} value={String(v)} />
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Witnesses</h2>
            {Array.isArray(payload.witnesses) &&
            payload.witnesses.length > 0 ? (
              payload.witnesses.map((w: any, idx: number) => (
                <div key={idx} className="border rounded p-2 mb-2">
                  <LabeledRow label="Full Name" value={w.fullName} />
                  <LabeledRow label="Relation" value={w.relationToApplicants} />
                  <LabeledRow label="Phone" value={w.phoneNumber} />
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No witnesses</div>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">
              Social Worker Evaluation
            </h2>
            {Object.keys(payload.socialWorkerEvaluation || {}).length === 0 ? (
              <div className="text-sm text-gray-500">No data</div>
            ) : (
              <div className="space-y-1">
                {Object.entries(payload.socialWorkerEvaluation).map(
                  ([k, v]) => (
                    <LabeledRow key={k} label={k} value={String(v)} />
                  )
                )}
              </div>
            )}
          </Card>
          {/* extra sections */}
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Marriage Info</h2>
            {Object.keys(payload.marriageInfo || {}).length === 0 ? (
              <div className="text-sm text-gray-500">No data</div>
            ) : (
              <div className="space-y-1">
                {Object.entries(payload.marriageInfo).map(([k, v]) => (
                  <LabeledRow key={k} label={k} value={String(v)} />
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Criminal Issues</h2>
            {Object.keys(payload.criminalIssues || {}).length === 0 ? (
              <div className="text-sm text-gray-500">No data</div>
            ) : (
              <div className="space-y-1">
                {Object.entries(payload.criminalIssues).map(([k, v]) => (
                  <LabeledRow key={k} label={k} value={String(v)} />
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Health & Legal</h2>
            {Object.keys(payload.healthAndLegal || {}).length === 0 ? (
              <div className="text-sm text-gray-500">No data</div>
            ) : (
              <div className="space-y-1">
                {Object.entries(payload.healthAndLegal).map(([k, v]) => (
                  <LabeledRow key={k} label={k} value={String(v)} />
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Adoption Interest</h2>
            <LabeledRow
              label="Meaning of Adoption"
              value={payload.adoptionInterest?.meaningOfAdoption}
            />
            <LabeledRow
              label="Reason for Adoption"
              value={payload.adoptionInterest?.reasonForAdoption}
            />
            {payload.adoptionInterest?.preferredChild && (
              <div className="mt-2">
                <div className="font-medium">Preferred Child</div>
                <LabeledRow
                  label="Quantity"
                  value={payload.adoptionInterest.preferredChild.quantity}
                />
                <LabeledRow
                  label="Sex"
                  value={payload.adoptionInterest.preferredChild.sex}
                />
                <LabeledRow
                  label="Age Range"
                  value={payload.adoptionInterest.preferredChild.ageRange}
                />
                <LabeledRow
                  label="Health Condition"
                  value={
                    payload.adoptionInterest.preferredChild.healthCondition
                  }
                />
                <LabeledRow
                  label="Reason For Choice"
                  value={
                    payload.adoptionInterest.preferredChild.reasonForChoice
                  }
                />
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Existing Children</h2>
            {Array.isArray(payload.existingChildren) &&
            payload.existingChildren.length > 0 ? (
              payload.existingChildren.map((c: any, i: number) => (
                <div key={i} className="border rounded p-2 mb-2">
                  {Object.entries(c).map(([k, v]) => (
                    <LabeledRow key={k} label={k} value={String(v)} />
                  ))}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No existing children</div>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Applicant Parents</h2>
            {Array.isArray(payload.applicantParents) &&
            payload.applicantParents.length > 0 ? (
              payload.applicantParents.map((p: any, i: number) => (
                <div key={i} className="border rounded p-2 mb-2">
                  {Object.entries(p).map(([k, v]) => (
                    <LabeledRow key={k} label={k} value={String(v)} />
                  ))}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No applicant parents</div>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Household Members</h2>
            {Array.isArray(payload.householdMembers) &&
            payload.householdMembers.length > 0 ? (
              payload.householdMembers.map((h: any, i: number) => (
                <div key={i} className="border rounded p-2 mb-2">
                  {Object.entries(h).map(([k, v]) => (
                    <LabeledRow key={k} label={k} value={String(v)} />
                  ))}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No household members</div>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Family Background</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium mb-2">Father Side</div>
                {Object.entries(payload.familyBackground?.fatherSide || {}).map(
                  ([k, v]) => (
                    <LabeledRow key={k} label={k} value={String(v)} />
                  )
                )}
              </div>
              <div>
                <div className="font-medium mb-2">Mother Side</div>
                {Object.entries(payload.familyBackground?.motherSide || {}).map(
                  ([k, v]) => (
                    <LabeledRow key={k} label={k} value={String(v)} />
                  )
                )}
              </div>
            </div>
            <div className="mt-4">
              <div className="font-medium mb-2">Spouse Evaluation Together</div>
              {Object.entries(
                payload.familyBackground?.spouseEvaluationTogether || {}
              ).map(([k, v]) => (
                <LabeledRow key={k} label={k} value={String(v)} />
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">
              Income & Financial Status
            </h2>
            {Object.entries(payload.incomeAndFinancialStatus || {}).map(
              ([k, v]) => (
                <LabeledRow key={k} label={k} value={String(v)} />
              )
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Home & Environment</h2>
            {Object.entries(payload.homeAndEnvironment || {}).map(([k, v]) => (
              <LabeledRow key={k} label={k} value={String(v)} />
            ))}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Parenting Experience</h2>
            {Object.entries(payload.parentingExperience || {}).map(([k, v]) => (
              <LabeledRow key={k} label={k} value={String(v)} />
            ))}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">
              Existing Children & Family Members (Summary)
            </h2>
            {Object.entries(payload.existingChildrenAndFamilyMembers || {}).map(
              ([k, v]) => (
                <LabeledRow key={k} label={k} value={String(v)} />
              )
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">
              Adoption Applicants Signatures
            </h2>
            <LabeledRow
              label="Father Full Name"
              value={payload.adoptionApplicantFather?.fullName}
            />
            <LabeledRow
              label="Father Date"
              value={payload.adoptionApplicantFather?.date}
            />
            <LabeledRow
              label="Father Signature"
              value={payload.adoptionApplicantFather?.signature}
            />
            <div className="mt-2" />
            <LabeledRow
              label="Mother Full Name"
              value={payload.adoptionApplicantMother?.fullName}
            />
            <LabeledRow
              label="Mother Date"
              value={payload.adoptionApplicantMother?.date}
            />
            <LabeledRow
              label="Mother Signature"
              value={payload.adoptionApplicantMother?.signature}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
