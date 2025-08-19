import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface Application {
  id: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  lastUpdated: string;
}

// Mock data - will be replaced with TanStack Query
const mockApplication: Application | null = {
  id: "APP-2024-001",
  status: "pending",
  submittedDate: "2024-01-15",
  lastUpdated: "2024-01-20",
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "approved":
      return <CheckCircle className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ApplicationSummarySection() {
  const application = mockApplication; // This will be replaced with actual data fetching
  const applicationMessages = useTranslations("applicationMessages");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Application Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {application ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Application ID
                </p>
                <p className="text-gray-900">{application.id}</p>
              </div>
              <Badge className={getStatusColor(application.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(application.status)}
                  {application.status.charAt(0).toUpperCase() +
                    application.status.slice(1)}
                </span>
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">
                  Submitted Date
                </p>
                <p className="text-gray-900">
                  {new Date(application.submittedDate).toLocaleDateString()}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">
                  Last Updated
                </p>
                <p className="text-gray-900">
                  {new Date(application.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link
                  href={`/adoption/applicant-portal/application/${application.id}`}
                >
                  {applicationMessages("appSummary.cta")}:
                </Link>
              </Button>
            </div>

            {application.status === "pending" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Your application is currently under review. We will notify you
                  once there are updates.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Application Found
            </h3>
            <p className="text-gray-500 mb-4">
              You haven't submitted an adoption application yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
