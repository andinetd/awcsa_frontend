import React from "react";
import { useTranslations } from "next-intl";

export interface Person {
  fullName: string;
  phoneNumber?: string;
  relationToApplicants?: string;
  relation?: string;
  age?: string;
  sex?: string;
  educationOccupation?: string;
  educationAndOccupation?: string;
  addressAndLivingCondition?: string;
  address?: string;
  maritalStatus?: string;
}

export const PersonTable: React.FC<{
  data: Person[];
  columns: (keyof Person)[];
}> = ({ data, columns }) => {
  const t = useTranslations("adoption");

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium">
          <tr>
            {columns.map((col) => {
              const translationKey = `homeVisit.fields.${col}`;
              const label = t.has(translationKey)
                ? t(translationKey)
                : col.replace(/([A-Z])/g, " $1").trim();

              return (
                <th key={col} className="px-4 py-3 capitalize">
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 text-slate-900">
                  {row[col] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
