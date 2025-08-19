"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export type AdoptionApplicationField = {
  fieldName: string;
  answer: string;
  comment: string;
};

export type AdoptionApplicationAttachment = {
  label: string;
  fileName: string;
  fileType: string;
  url: string;
};

export type AdoptionApplication = {
  applicationId: string;
  applicantName: string;
  status: string;
  submittedDate: string;
  fields: AdoptionApplicationField[];
  attachments: AdoptionApplicationAttachment[];
};

export const mockApplications: AdoptionApplication[] = [
  {
    applicationId: "APP-2025-00017",
    applicantName: "John Michael Doe",
    status: "pending",
    submittedDate: "2025-08-05T10:15:00Z",
    fields: [
      { fieldName: "Full Name", answer: "John Michael Doe", comment: "" },
      { fieldName: "Date of Birth", answer: "1985-04-17", comment: "" },
      { fieldName: "Gender", answer: "Male", comment: "" },
      { fieldName: "Marital Status", answer: "Married", comment: "" },
      { fieldName: "Nationality", answer: "Ethiopian", comment: "" },
      { fieldName: "City of Residence", answer: "Addis Ababa", comment: "" },
      { fieldName: "Phone Number", answer: "+251912345678", comment: "" },
      { fieldName: "Email Address", answer: "johndoe@email.com", comment: "" },
      {
        fieldName: "Employment Status",
        answer: "Full-time Accountant",
        comment: "",
      },
      { fieldName: "Monthly Income (ETB)", answer: "35,000", comment: "" },
      {
        fieldName: "Reason for Adoption",
        answer:
          "We want to expand our family and provide a loving home to a child in need.",
        comment: "",
      },
      {
        fieldName: "Preferred Child Age Range",
        answer: "2-5 years",
        comment: "",
      },
      { fieldName: "Preferred Child Gender", answer: "Female", comment: "" },
      { fieldName: "Have You Adopted Before?", answer: "No", comment: "" },
      {
        fieldName: "Do You Have Biological Children?",
        answer: "Yes, one daughter (age 8)",
        comment: "",
      },
      {
        fieldName: "Health Status",
        answer: "Excellent - no chronic illnesses",
        comment: "",
      },
      { fieldName: "Home Ownership", answer: "Owned", comment: "" },
      { fieldName: "Type of Home", answer: "3-bedroom apartment", comment: "" },
      { fieldName: "Number of People in Household", answer: "3", comment: "" },
      { fieldName: "Any Criminal Record?", answer: "No", comment: "" },
    ],
    attachments: [
      {
        label: "Passport Scan",
        fileName: "passport_scan.pdf",
        fileType: "application/pdf",
        url: "/uploads/passport_scan.pdf",
      },
      {
        label: "Marriage Certificate",
        fileName: "marriage_certificate.jpg",
        fileType: "image/jpeg",
        url: "/uploads/marriage_certificate.jpg",
      },
      {
        label: "Bank Statement (June 2025)",
        fileName: "bank_statement_june2025.pdf",
        fileType: "application/pdf",
        url: "/uploads/bank_statement_june2025.pdf",
      },
      {
        label: "Medical Clearance",
        fileName: "medical_clearance.pdf",
        fileType: "application/pdf",
        url: "/uploads/medical_clearance.pdf",
      },
    ],
  },
  {
    applicationId: "APP-2025-00018",
    applicantName: "Martha Solomon",
    status: "pending",
    submittedDate: "2025-08-06T14:30:00Z",
    fields: [
      { fieldName: "Full Name", answer: "Martha Solomon", comment: "" },
      { fieldName: "Date of Birth", answer: "1990-02-10", comment: "" },
      { fieldName: "Gender", answer: "Female", comment: "" },
      { fieldName: "Marital Status", answer: "Single", comment: "" },
      { fieldName: "Nationality", answer: "Ethiopian", comment: "" },
      { fieldName: "City of Residence", answer: "Bahir Dar", comment: "" },
      { fieldName: "Phone Number", answer: "+251911998877", comment: "" },
      { fieldName: "Email Address", answer: "martha@email.com", comment: "" },
      { fieldName: "Employment Status", answer: "Teacher", comment: "" },
      { fieldName: "Monthly Income (ETB)", answer: "18,000", comment: "" },
      {
        fieldName: "Reason for Adoption",
        answer: "I want to provide a safe and loving home.",
        comment: "",
      },
      {
        fieldName: "Preferred Child Age Range",
        answer: "1-3 years",
        comment: "",
      },
      { fieldName: "Preferred Child Gender", answer: "Male", comment: "" },
      { fieldName: "Have You Adopted Before?", answer: "No", comment: "" },
      {
        fieldName: "Do You Have Biological Children?",
        answer: "No",
        comment: "",
      },
      { fieldName: "Health Status", answer: "Good", comment: "" },
      { fieldName: "Home Ownership", answer: "Rented", comment: "" },
      { fieldName: "Type of Home", answer: "2-bedroom house", comment: "" },
      { fieldName: "Number of People in Household", answer: "1", comment: "" },
      { fieldName: "Any Criminal Record?", answer: "No", comment: "" },
    ],
    attachments: [
      {
        label: "ID Card",
        fileName: "id_card.pdf",
        fileType: "application/pdf",
        url: "/uploads/id_card.pdf",
      },
      {
        label: "Employment Letter",
        fileName: "employment_letter.jpg",
        fileType: "image/jpeg",
        url: "/uploads/employment_letter.jpg",
      },
      {
        label: "Bank Statement (July 2025)",
        fileName: "bank_statement_july2025.pdf",
        fileType: "application/pdf",
        url: "/uploads/bank_statement_july2025.pdf",
      },
    ],
  },
  {
    applicationId: "APP-2025-00019",
    applicantName: "Samuel Bekele",
    status: "accepted",
    submittedDate: "2025-08-04T09:45:00Z",
    fields: [
      { fieldName: "Full Name", answer: "Samuel Bekele", comment: "" },
      { fieldName: "Date of Birth", answer: "1982-11-05", comment: "" },
      { fieldName: "Gender", answer: "Male", comment: "" },
      { fieldName: "Marital Status", answer: "Married", comment: "" },
      { fieldName: "Nationality", answer: "Ethiopian", comment: "" },
      { fieldName: "City of Residence", answer: "Dire Dawa", comment: "" },
      { fieldName: "Phone Number", answer: "+251911223344", comment: "" },
      {
        fieldName: "Email Address",
        answer: "samuel.bekele@email.com",
        comment: "",
      },
      { fieldName: "Employment Status", answer: "Civil Engineer", comment: "" },
      { fieldName: "Monthly Income (ETB)", answer: "40,000", comment: "" },
      {
        fieldName: "Reason for Adoption",
        answer:
          "We want to share our love and provide stability to a child without parents.",
        comment: "",
      },
      {
        fieldName: "Preferred Child Age Range",
        answer: "3-6 years",
        comment: "",
      },
      { fieldName: "Preferred Child Gender", answer: "Any", comment: "" },
      { fieldName: "Have You Adopted Before?", answer: "No", comment: "" },
      {
        fieldName: "Do You Have Biological Children?",
        answer: "Yes, two sons (ages 10 and 7)",
        comment: "",
      },
      { fieldName: "Health Status", answer: "Excellent", comment: "" },
      { fieldName: "Home Ownership", answer: "Owned", comment: "" },
      { fieldName: "Type of Home", answer: "4-bedroom house", comment: "" },
      { fieldName: "Number of People in Household", answer: "4", comment: "" },
      { fieldName: "Any Criminal Record?", answer: "No", comment: "" },
    ],
    attachments: [
      {
        label: "Passport Scan",
        fileName: "passport_samuel.pdf",
        fileType: "application/pdf",
        url: "/uploads/passport_samuel.pdf",
      },
      {
        label: "Marriage Certificate",
        fileName: "marriage_certificate_samuel.jpg",
        fileType: "image/jpeg",
        url: "/uploads/marriage_certificate_samuel.jpg",
      },
      {
        label: "Bank Statement (May 2025)",
        fileName: "bank_statement_may2025.pdf",
        fileType: "application/pdf",
        url: "/uploads/bank_statement_may2025.pdf",
      },
      {
        label: "Medical Report",
        fileName: "medical_report_samuel.pdf",
        fileType: "application/pdf",
        url: "/uploads/medical_report_samuel.pdf",
      },
    ],
  },
];

const TABS = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "denied", label: "Denied" },
  { value: "returned", label: "Returned to Applicant" },
];

const AdoptionRequests = () => {
  const router = useRouter();
  const [tab, setTab] = useState("pending");

  // Filter applications by status
  const filteredApps = (status: string) =>
    mockApplications.filter((app) => app.status === status);

  return (
    <div className="p-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-6">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="capitalize">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => (
          <TabsContent key={t.value} value={t.value} className="w-full">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredApps(t.value).length === 0 ? (
                <div className="text-gray-500 italic">
                  No applications found.
                </div>
              ) : (
                filteredApps(t.value).map((app, idx) => (
                  <Card
                    key={app.applicationId}
                    className="p-5 flex flex-col gap-2 shadow-md border border-gray-200"
                  >
                    <div className="font-bold text-lg mb-1">
                      {app.applicantName}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      Application ID: {app.applicationId}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      Submitted: {new Date(app.submittedDate).toLocaleString()}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Link
                        href={`/adoption/adoption-requests/${app.applicationId}`}
                        passHref
                      >
                        <Button size="sm">
                          {t.value === "pending" ? "Review" : "View"}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdoptionRequests;
