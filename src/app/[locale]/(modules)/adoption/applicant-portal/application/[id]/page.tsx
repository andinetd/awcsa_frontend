import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";

interface ApplicationDetail {
  id: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  lastUpdated: string;
  applicantInfo: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
  };
  documents: {
    name: string;
    status: "uploaded" | "pending" | "approved" | "rejected";
    uploadDate?: string;
  }[];
  timeline: {
    date: string;
    event: string;
    description: string;
  }[];
}

// Mock data - will be replaced with TanStack Query
const mockApplicationDetail: ApplicationDetail = {
  id: "APP-2024-001",
  status: "pending",
  submittedDate: "2024-01-15",
  lastUpdated: "2024-01-20",
  applicantInfo: {
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-03-15",
    address: "123 Main St, Anytown, ST 12345",
  },
  documents: [
    { name: "ID", status: "approved", uploadDate: "2025-10-18" },
    {
      name: "Income Verification",
      status: "approved",
      uploadDate: "2024-01-16",
    },
    { name: "Medical Clearance", status: "pending", uploadDate: "2025-10-18" },
    { name: "Criminal clearance", status: "pending", uploadDate: "2025-10-18" },
    {
      name: "Marital status",
      status: "uploaded",
      uploadDate: "2024-01-20",
    },
    { name: "Home Study Report", status: "pending" },
  ],
  timeline: [
    {
      date: "2025-10-18",
      event: "Application Submitted",
      description: "Initial application form completed and submitted",
    },
    {
      date: "2025-10-18",
      event: "Documents Uploaded",
      description: "Background check and income verification uploaded",
    },
    {
      date: "2025-10-18",
      event: "Medical Clearance Uploaded",
      description: "Medical clearance document submitted for review",
    },
  ],
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-3 w-3" />;
    case "approved":
      return <CheckCircle className="h-3 w-3" />;
    case "rejected":
      return <XCircle className="h-3 w-3" />;
    case "uploaded":
      return <FileText className="h-3 w-3" />;
    default:
      return <FileText className="h-3 w-3" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-secondary/10 text-secondary";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "uploaded":
      return "bg-primary/10 text-primary";
    default:
      return "bg-primary/10 text-gray-800";
  }
};

export default function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = mockApplicationDetail; // This will be replaced with actual data fetching

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link
              href="/adoption/applicant-portal/portal"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Application Details
              </h1>
              <p className="text-gray-600">Application ID: {application.id}</p>
            </div>
            <Badge className={getStatusColor(application.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(application.status)}
                {application.status.charAt(0).toUpperCase() +
                  application.status.slice(1)}
              </span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Applicant Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Full Name
                      </p>
                      <p className="text-gray-900">
                        {application.applicantInfo.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">
                        {application.applicantInfo.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">
                        {application.applicantInfo.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Date of Birth
                      </p>
                      <p className="text-gray-900">
                        {new Date(
                          application.applicantInfo.dateOfBirth
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Address
                  </p>
                  <p className="text-gray-900">
                    {application.applicantInfo.address}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {application.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(doc.status)}
                        <div>
                          <p className="font-medium text-gray-900">
                            {doc.name}
                          </p>
                          {doc.uploadDate && (
                            <p className="text-sm text-gray-500">
                              Uploaded:{" "}
                              {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* <Badge className={getStatusColor(doc.status)}>
                        {doc.status.charAt(0).toUpperCase() +
                          doc.status.slice(1)}
                      </Badge> */}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Application Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.timeline.map((event, index) => (
                    <div key={index} className="relative">
                      {index !== application.timeline.length - 1 && (
                        <div className="absolute left-2 top-8 w-0.5 h-8 bg-gray-200"></div>
                      )}
                      <div className="flex gap-3">
                        <div className="w-4 h-4 bg-primary rounded-full mt-1 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {event.event}
                          </p>
                          <p className="text-sm text-gray-500 mb-1">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="w-full pt-2 md:col-span-1">
              <Link
                href={
                  "/adoption/applicant-portal/application/APP-2024-001/edit/section"
                }
              >
                <Button>Edit and Resubmit </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
