import React from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { formatAge } from "@/lib/utils";

interface ApplicationField {
  fieldName: string;
  // stable key used when sending fieldComments to the backend (e.g. 'occupation', 'monthlyIncome')
  fieldKey?: string;
  answer: string;
  showComment: boolean;
  comment?: string;
}

interface ApplicationFieldsSectionProps {
  fields: ApplicationField[];
  status: string;
  onToggle: (idx: number) => void;
  onComment: (idx: number, value: string) => void;
}
export const ApplicationFieldsSection: React.FC<
  ApplicationFieldsSectionProps
> = ({ fields, status, onToggle, onComment }) => {
  const t = useTranslations("adoption");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-slate-400" />
          {t("adoptionDetail.sections.details")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {fields.map((field, idx) => (
            <div
              key={field.fieldName}
              className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <span className="font-medium text-slate-500 w-40 inline-block text-sm">
                    {field.fieldName}:
                  </span>
                  {field.fieldKey === "dateOfBirth" ? (
                    <span className="ext-slate-900 font-medium">
                      {field.answer.split("T")[0]}
                    </span>
                  ) : field.fieldKey === "preferredChildren.ageRange.min" ||
                    field.fieldKey === "preferredChildren.ageRange.max" ? (
                    <span className="ext-slate-900 font-medium">
                      {formatAge(
                        field.answer === "" ? undefined : Number(field.answer),
                      )}
                    </span>
                  ) : (
                    <span className="ext-slate-900 font-medium">
                      {field.answer}
                    </span>
                  )}
                </div>

                {status === "pending" && (
                  <div className="flex items-center gap-2 ml-auto">
                    <Checkbox
                      checked={field.showComment}
                      onCheckedChange={() => onToggle(idx)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`check-${field.fieldKey}`}
                      className="text-xs text-slate-400 cursor-pointer select-none"
                    >
                      {t("adoptionDetail.sections.feedback")}
                    </label>
                  </div>
                )}
              </div>
              {field.showComment && status === "pending" && (
                <div className="mt-2 animate-fadeIn">
                  <Textarea
                    value={field.comment}
                    onChange={(e) => onComment(idx, e.target.value)}
                    placeholder={t(
                      "adoptionDetail.sections.feedbackPlaceholder",
                      {
                        field: field.fieldName,
                      },
                    )}
                    className="w-full min-h-[80px] p-3 text-sm rounded-md border border-slate-200 bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400 text-slate-800"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
