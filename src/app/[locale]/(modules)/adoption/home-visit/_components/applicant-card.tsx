import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export interface ApplicantProfile {
  fullName: string;
  religion: string;
  phoneHome: string;
  birthPlace: string;
  occupation: string;
  extraIncome: string;
  nationality: string;
  phoneMobile: string;
  maritalStatus: string;
  monthlyIncome: number;
  birthDateOrAge: string;
  educationLevel: string;
  occupationType: string;
}

export const Field: React.FC<{
  label: string;
  value: string | number | undefined;
  className?: string;
}> = ({ label, value, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
      {label}
    </dt>
    <dd className="text-sm font-medium text-slate-900 break-words">
      {value || "—"}
    </dd>
  </div>
);

export const ApplicantCard: React.FC<{
  title: string;
  data: ApplicantProfile;
}> = ({ title, data }) => {
  const t = useTranslations("adoption");

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{title}</CardTitle>
          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
            {data.maritalStatus}
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-y-4 gap-x-2">
        <div className="col-span-2 pb-2 mb-2 border-b border-slate-100">
          <Field
            label={t("homeVisit.fields.fullName")}
            value={data.fullName}
            className="text-lg"
          />
        </div>
        <Field label={t("homeVisit.fields.age")} value={data.birthDateOrAge} />
        <Field
          label={t("homeVisit.fields.nationality")}
          value={data.nationality}
        />
        <Field label={t("homeVisit.fields.religion")} value={data.religion} />
        <Field
          label={t("homeVisit.fields.education")}
          value={data.educationLevel}
        />
        <Field
          label={t("homeVisit.fields.occupation")}
          value={data.occupation}
        />
        <Field
          label={t("homeVisit.fields.monthlyIncome")}
          value={t("homeVisit.fields.etbValue", {
            amount: data.monthlyIncome.toLocaleString(),
          })}
        />
        <Field label={t("homeVisit.fields.phone")} value={data.phoneMobile} />
        <Field
          label={t("homeVisit.fields.birthPlace")}
          value={data.birthPlace}
        />
      </CardContent>
    </Card>
  );
};
