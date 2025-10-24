import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApplicantInfoSectionProps {
  application: {
    applicationId: string;
    applicantName: string;
    status: string;
    submittedDate: string | number | Date;
  };
  photoUrl?: string;
}

export const ApplicantInfoSection: React.FC<ApplicantInfoSectionProps> = ({
  application,
  photoUrl,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        Application Info
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {photoUrl && (
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <img
              src={photoUrl}
              alt={`Photo of ${application.applicantName}`}
              className="h-24 w-24 object-cover rounded-md shadow-sm"
            />
          </div>
        )}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-500">
            Application ID
          </span>
          <span className="text-gray-900 text-sm font-medium">
            {application.applicationId}
          </span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-500">
            Applicant Name
          </span>
          <span className="text-gray-900 text-sm font-medium">
            {application.applicantName}
          </span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-500">Status</span>
          <span className="text-gray-900 text-sm font-medium">
            {application.status}
          </span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-500">Submitted</span>
          <span className="text-gray-900 text-sm font-medium">
            {new Date(application.submittedDate).toLocaleString()}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);
