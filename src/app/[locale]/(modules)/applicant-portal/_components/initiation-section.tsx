"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle, FileText, Users } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useFetchedAdoptionApplicationStore } from "@/stores/fetched-adoption-application";

export function InitiationSection() {
  const t = useTranslations("applicants-portal");
  const { application } = useFetchedAdoptionApplicationStore();

  const adoptionRequirements = [
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: t("requirements.one"),
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: t("requirements.two"),
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: t("requirements.three"),
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: t("requirements.four"),
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: t("requirements.five"),
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: t("requirements.six"),
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: t("requirements.seven"),
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: t("requirements.eight"),
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: t("requirements.nine"),
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: t("requirements.ten"),
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: t("requirements.eleven"),
    },
  ];
  return (
    <Card className="h-fit">
      {/* <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Start Your Journey
        </CardTitle>
      </CardHeader> */}
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t("initiation.requirement")}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t("initiation.requirementSubtitle")}:
          </p>
          <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
            <ul className="space-y-2">
              {adoptionRequirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5 flex-shrink-0">
                    {requirement.icon}
                  </span>
                  <span className="text-gray-700 text-[16px]">
                    {requirement.text}
                  </span>
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
            <Users className="h-4 w-4 text-primary" />
            <h4 className="font-medium text-primary">{t("footer.title")}</h4>
          </div>
          <p className="text-sm text-blue-800 mb-4">{t("footer.subtitle")}</p>
          {application ? (
            <Button
              disabled
              className="w-full"
              title={t("footer.cta_submitted") ?? undefined}
            >
              {t("footer.cta_submitted")}
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link href="/applicant-portal/application/new/step1">
                {t("footer.cta")}
              </Link>
            </Button>
          )}
        </div>

        <div className="text-center space-y-3 pt-4 border-t">
          <div className="px-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {t("initiation.complaintsTitle")}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t("initiation.complaintsDescription")}
            </p>
          </div>
          <Link
            href="/applicant-portal/complaints"
            className="text-sm font-medium text-primary hover:underline flex items-center justify-center gap-1"
          >
            Complaints
          </Link>
          <p className="text-[10px] text-gray-400">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:wcsa@gov.org"
              className="text-blue-600 hover:underline"
            >
              wcsa@gov.org
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
