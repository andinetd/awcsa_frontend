"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Instructions column: Collapsible on mobile, persistent on desktop */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="overflow-hidden border-border/80 shadow-sm">
          {/* Mobile Accordion Header */}
          <div className="lg:hidden p-4 bg-muted/40 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary shrink-0" />
              <span className="font-semibold text-sm text-foreground">
                {title || "Step Guidance & Rules"}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsInstructionsOpen((prev) => !prev)}
              className="h-8 px-2.5 text-xs text-primary font-medium flex items-center gap-1 hover:bg-primary/10"
            >
              <span>{isInstructionsOpen ? "Hide Details" : "View Details"}</span>
              {isInstructionsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Desktop Header */}
          {(title || description) && (
            <CardHeader className="hidden lg:block pb-3">
              {title && <CardTitle className="text-xl">{title}</CardTitle>}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </CardHeader>
          )}

          {/* Content: always visible on desktop, toggled on mobile */}
          <CardContent
            className={`p-4 sm:p-6 ${
              !isInstructionsOpen ? "hidden lg:block" : "block"
            }`}
          >
            {instructions}
          </CardContent>
        </Card>
      </div>

      {/* Form column */}
      <div className="lg:col-span-7">
        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4 sm:p-6">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
