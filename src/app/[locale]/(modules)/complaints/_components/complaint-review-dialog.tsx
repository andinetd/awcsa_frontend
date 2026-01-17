"use client";

import {
  useComplaintDetailsQuery,
  useResolveComplaintMutation,
} from "@/hooks/complaints";
import { ComplaintStatus } from "@/types/complaints";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ComplaintReviewDialogProps {
  complaintId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ComplaintReviewDialog({
  complaintId,
  isOpen,
  onClose,
}: ComplaintReviewDialogProps) {
  const { data: detailData, isLoading: isDetailLoading } =
    useComplaintDetailsQuery(complaintId || "");
  const [resolution, setResolution] = useState("");
  const { mutate: updateComplaint, isPending } = useResolveComplaintMutation();

  useEffect(() => {
    if (!isOpen) {
      setResolution("");
    }
  }, [isOpen]);

  const handleResolve = (status: ComplaintStatus) => {
    if (!complaintId) return;
    if (!resolution && status === ComplaintStatus.RESOLVED) {
      toast.error("Please provide a resolution");
      return;
    }

    updateComplaint(
      {
        id: complaintId,
        data: {
          status,
          resolution,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complaint Review & Resolution</DialogTitle>
          <DialogDescription>
            Review the detailed complaint and applicant information to provide a
            resolution.
          </DialogDescription>
        </DialogHeader>

        {isDetailLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500">
              Loading complaint details...
            </p>
          </div>
        ) : detailData ? (
          <div className="space-y-6 py-4">
            {/* Applicant Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-1 flex items-center gap-2">
                  <User className="h-4 w-4" /> Applicant Details
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Full Name:</span>
                    <span className="font-medium">
                      {detailData.submittedBy?.client.firstName}{" "}
                      {detailData.submittedBy?.client.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">City ID:</span>
                    <span className="font-medium">
                      {detailData.submittedBy?.client.cityIdNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {detailData.submittedBy?.client.clientCategory}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-1 flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span>{detailData.submittedBy?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span>{detailData.submittedBy?.client.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="truncate">
                      {detailData.submittedBy?.client.address ||
                        "No address provided"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-1 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Professional & Personal
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" /> Education:
                    </span>
                    <span className="font-medium">
                      {detailData.submittedBy?.client.educationLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Occupation:</span>
                    <span className="font-medium">
                      {detailData.submittedBy?.client.occupation || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Users className="h-3 w-3" /> Family Size:
                    </span>
                    <span className="font-medium">
                      {detailData.submittedBy?.client.familyMembersCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Vital Dates
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date of Birth:</span>
                    <span className="font-medium">
                      {detailData.submittedBy?.client.dateOfBirth
                        ? format(
                            new Date(detailData.submittedBy.client.dateOfBirth),
                            "MMM dd, yyyy",
                          )
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Created:</span>
                    <span className="font-medium">
                      {detailData.submittedBy?.client.createdAt &&
                        format(
                          new Date(detailData.submittedBy.client.createdAt),
                          "MMM dd, yyyy",
                        )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Complaint Section */}
            <div className="space-y-4 pt-2 border-t">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-1">
                  Subject
                </h4>
                <p className="text-lg font-bold text-gray-900">
                  {detailData.subject}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-1">
                  Description
                </h4>
                <div className="text-sm text-gray-700 bg-blue-50/50 p-4 rounded-md border border-blue-100 italic leading-relaxed">
                  "{detailData.description}"
                </div>
              </div>
            </div>

            <hr />

            {/* Resolution Input */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                Resolution Details / Decision Rationale
              </label>
              <Textarea
                placeholder="Provide a detailed explanation of the resolution or why it was rejected..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="min-h-[120px] focus-visible:ring-primary shadow-sm"
              />
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                This note will be visible to the applicant upon resolution.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-red-500 flex flex-col items-center gap-2">
            <p className="font-medium">Failed to load complaint details.</p>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        )}

        <DialogFooter className="gap-3 sm:gap-2 border-t pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="hidden sm:inline-flex"
          >
            Cancel
          </Button>
          <div className="flex flex-1 gap-2 justify-end w-full sm:w-auto">
            <Button
              variant="destructive"
              onClick={() => handleResolve(ComplaintStatus.REJECTED)}
              disabled={isPending || isDetailLoading || !detailData}
              className="px-6"
            >
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => handleResolve(ComplaintStatus.IN_PROGRESS)}
              disabled={isPending || isDetailLoading || !detailData}
              className="px-6"
            >
              Take Action
            </Button>
            <Button
              onClick={() => handleResolve(ComplaintStatus.RESOLVED)}
              disabled={isPending || isDetailLoading || !detailData}
              className="px-8"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resolve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
