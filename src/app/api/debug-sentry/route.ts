import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    throw new Error("Sentry Frontend Server Test Error - Women & Social Affairs Frontend");
  } catch (error) {
    Sentry.captureException(error);
    await Sentry.flush(2000);
    return NextResponse.json({
      status: "ok",
      message: "Frontend Sentry test error captured and flushed to Sentry successfully",
    });
  }
}
