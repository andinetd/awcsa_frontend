import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { Button } from "@/components/ui/button";
import { Home, User, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApplicantInfoSectionProps {
  application: {
    applicationId: string;
    applicantName: string;
    status: string;
    submittedDate: string | number | Date;
  };
  photoUrl?: string;
  setServiceDataId: (id: string) => void;
  handleAction: (action: "approve" | "deny") => void;
  handleReturnToApplicant: () => void;
  setIsMatchModalOpen: (isOpen: boolean) => void;
}

const getStatusColor = (status: string) => {
  const s = (status || "").toString().toUpperCase();
  switch (s) {
    case "PENDING_APPROVAL":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "MATCHED":
      return "bg-green-100 text-green-800 border-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

export const ApplicantInfoSection: React.FC<ApplicantInfoSectionProps> = ({
  application,
  photoUrl,
  setServiceDataId,
  handleAction,
  handleReturnToApplicant,
  setIsMatchModalOpen,
}) => {
  const router = useRouter();

  return (
    <Card className="border-l-4 border-l-blue-600 shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">
                Application #{application.applicationId}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                  application.status
                )}`}
              >
                {application.status.replace("_", " ")}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-900">
                  {application.applicantName}
                </span>
              </span>
              <span className="hidden md:inline w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Submitted{" "}
                {new Date(application.submittedDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {(application.status || "").toUpperCase() ===
              "PENDING_APPROVAL" && (
              <div className="mt-6 flex justify-end">
                <div className="space-x-2">
                  <Button
                    onClick={() => {
                      router.push(
                        `/adoption/home-visit/${String(
                          application.applicationId
                        )}/fields`
                      );
                    }}
                  >
                    View Home Visit Feedback
                  </Button>
                  <Button
                    onClick={() => setIsMatchModalOpen(true)}
                    className="flex-1 lg:flex-none"
                  >
                    Approve and match child
                  </Button>
                </div>
              </div>
            )}
            {(application.status || "").toUpperCase() ===
              "MATCHED" && (
              <div className="mt-6 flex justify-end">
                <div className="space-x-2">
                  <Button
                    onClick={() => {
                      router.push(
                        `/adoption/home-visit/${String(
                          application.applicationId
                        )}/fields`
                      );
                    }}
                  >
                    View Home Visit Feedback
                  </Button>
                  <Button
                    onClick={() => setIsMatchModalOpen(true)}
                    className="flex-1 lg:flex-none"
                  >
                    View Matched Child Details
                  </Button>
                </div>
              </div>
            )}
            {(application.status || "").toUpperCase() ===
              "PENDING_HOME_VISIT" && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => {
                    setServiceDataId(String(application.applicationId));
                    router.push("../home-visit/Registration/step1");
                  }}
                >
                  Submit Home Visit Feedback
                </Button>
              </div>
            )}
            {(application.status || "").toUpperCase() === "PENDING_REVIEW" && (
              <div className="flex gap-2 mt-2">
                <Button
                  variant="destructive"
                  onClick={() => handleAction("deny")}
                  className="cursor-pointer"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleReturnToApplicant()}
                  className="cursor-pointer"
                >
                  Return to Applicant
                </Button>
                <Button
                  onClick={() => handleAction("approve")}
                  className="cursor-pointer"
                >
                  Approve
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
