"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DebugSentryPage() {
  const [sent, setSent] = useState(false);

  const triggerClientError = () => {
    try {
      throw new Error("Sentry Frontend Client Test Error - Women & Social Affairs Frontend");
    } catch (err) {
      Sentry.captureException(err);
      setSent(true);
    }
  };

  const triggerUnhandledError = () => {
    throw new Error("Sentry Frontend Unhandled Crash Test - Women & Social Affairs Frontend");
  };

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-4 font-lexend">Sentry Frontend Diagnostics</h1>
      <p className="text-slate-600 mb-6 max-w-md">
        Use these buttons to verify that client-side and unhandled exceptions are forwarded directly to your Sentry dashboard.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={triggerClientError} variant="default">
          Trigger Handled Client Error
        </Button>
        <Button onClick={triggerUnhandledError} variant="destructive">
          Trigger Unhandled Crash (Error Boundary)
        </Button>
      </div>

      {sent && (
        <p className="mt-4 text-green-600 font-medium">
          Client exception captured and dispatched to Sentry!
        </p>
      )}
    </div>
  );
}
