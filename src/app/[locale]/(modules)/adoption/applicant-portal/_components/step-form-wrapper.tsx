import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StepFormWrapperProps {
  title?: string;
  description?: string;
  instructions: ReactNode;
  children: ReactNode;
}

export function StepFormWrapper({
  title,
  description,
  instructions,
  children,
}: StepFormWrapperProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <p className="text-gray-600">{description}</p>
          </CardHeader>
          <CardContent>{instructions}</CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardContent className="p-6">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
