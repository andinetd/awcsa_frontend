import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

export const ApplicantCard: React.FC<{ title: string; data: ApplicantProfile }> = ({ title, data }) => (
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
          <Field label="Full Name" value={data.fullName} className="text-lg" />
       </div>
       <Field label="Age" value={data.birthDateOrAge} />
       <Field label="Nationality" value={data.nationality} />
       <Field label="Religion" value={data.religion} />
       <Field label="Education" value={data.educationLevel} />
       <Field label="Occupation" value={data.occupation} />
       <Field label="Monthly Income" value={`${data.monthlyIncome.toLocaleString()} ETB`} />
       <Field label="Phone" value={data.phoneMobile} />
       <Field label="Birth Place" value={data.birthPlace} />
    </CardContent>
  </Card>
);

