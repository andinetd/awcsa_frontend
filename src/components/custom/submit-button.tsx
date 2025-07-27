import React, { ComponentProps, ReactNode } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Loader, Loader2 } from "lucide-react";

type Props = {
  children: ReactNode;
  isSubmitting: boolean;
  disabled?: boolean;
} & ComponentProps<"button">;

const SubmitButton = ({
  children,
  isSubmitting,
  disabled,
  ...props
}: Props) => {
  return (
    <Button
      disabled={isSubmitting || disabled}
      {...props}
      className={cn(props.className, "relative")}
    >
      {isSubmitting ? (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
