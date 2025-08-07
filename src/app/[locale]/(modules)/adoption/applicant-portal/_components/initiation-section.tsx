import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle, FileText, Users } from "lucide-react";
import Link from "next/link";

const adoptionRequirements = [
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: "Must be 21 years or older",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: "Stable housing and income verification",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: "Background check and references required",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: "Home study evaluation by licensed social worker",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: "Completion of required pre-adoption training (40+ hours)",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: "Medical clearance from licensed physician",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: "Financial stability documentation",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: "Character references from non-family members",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: "Criminal background check clearance",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: "Child abuse clearance certificate",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: "Proof of marriage certificate (if applicable)",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: "Employment verification letter",
  },
];

export function InitiationSection() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Start Your Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Adoption Requirements
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Before starting your application, please ensure you meet the
            following requirements:
          </p>
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
            <ul className="space-y-2">
              {adoptionRequirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5 flex-shrink-0">
                    {requirement.icon}
                  </span>
                  <span className="text-gray-700">{requirement.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Scroll to view all requirements
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-blue-900">Ready to Begin?</h4>
          </div>
          <p className="text-sm text-blue-800 mb-4">
            Our comprehensive application process will guide you through each
            step of your adoption journey.
          </p>
          <Button asChild className="w-full">
            <Link href="/adoption/applicant-portal/application/new/step1">
              Start Application
            </Link>
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@adoption.org"
              className="text-blue-600 hover:underline"
            >
              support@adoption.org
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
