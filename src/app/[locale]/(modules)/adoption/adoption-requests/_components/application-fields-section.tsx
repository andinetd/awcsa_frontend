import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface ApplicationField {
  fieldName: string;
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
> = ({ fields, status, onToggle, onComment }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        Application Details
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-4">
        {fields.map((field, idx) => (
          <div
            key={field.fieldName}
            className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium w-56 inline-block">
                {field.fieldName}:
              </span>
              <span>{field.answer}</span>
              {status === "pending" && (
                <>
                  <Checkbox
                    checked={field.showComment}
                    onCheckedChange={() => onToggle(idx)}
                    className="ml-4"
                  />
                  <span className="text-xs text-muted-foreground">
                    Feedback?
                  </span>
                </>
              )}
            </div>
            {field.showComment && status === "pending" && (
              <div className="mt-2">
                <Textarea
                  value={field.comment}
                  onChange={(e) => onComment(idx, e.target.value)}
                  placeholder={`Comment on ${field.fieldName}`}
                  className="w-full min-h-[60px]"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
