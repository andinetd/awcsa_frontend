"use client";

import { useAllComplaintsQuery } from "@/hooks/complaints";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ComplaintStatus } from "@/types/complaints";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ComplaintReviewDialog } from "./_components/complaint-review-dialog";

const statusColorMap: Record<ComplaintStatus, string> = {
  [ComplaintStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [ComplaintStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [ComplaintStatus.RESOLVED]: "bg-green-100 text-green-800",
  [ComplaintStatus.REJECTED]: "bg-red-100 text-red-800",
};

export default function ComplaintsManagementPage() {
  const { data: complaints, isLoading } = useAllComplaintsQuery();
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-gray-600">Review and resolve system complaints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
          <CardDescription>
            A list of all complaints submitted by applicants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints?.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>
                    {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {complaint.submittedBy?.client
                          ? `${complaint.submittedBy.client.firstName} ${complaint.submittedBy.client.lastName}`
                          : "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {complaint.submittedBy?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {complaint.subject}
                  </TableCell>
                  <TableCell>{complaint.category.replace("_", " ")}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColorMap[complaint.status]}
                    >
                      {complaint.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedComplaint(complaint.id);
                        setIsDialogOpen(true);
                      }}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!complaints || complaints.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No complaints found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ComplaintReviewDialog
        complaintId={selectedComplaint}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedComplaint(null);
        }}
      />
    </div>
  );
}
