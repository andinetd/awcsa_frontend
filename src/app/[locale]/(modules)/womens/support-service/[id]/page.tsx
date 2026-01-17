"use client";

import React from "react";
import { useGetSupportByIdQuery } from "@/hooks/support";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Calendar,
  User,
  MapPin,
  ClipboardList,
  Package,
} from "lucide-react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import MonitoringForm from "../_components/monitoring-form";

export default function SupportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supportId = parseInt(id as string);

  const { data: support, isLoading, error } = useGetSupportByIdQuery(supportId);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !support) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-medium">
          {error instanceof Error ? error.message : "Support record not found"}
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Support Details</h1>
          <p className="text-muted-foreground">Reference ID: {support.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Service Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Service Information
            </CardTitle>
            <CardDescription>Details of the support provided</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Service Type
              </p>
              <p className="text-lg font-semibold">
                {support.serviceType?.name || "N/A"}
              </p>
              {support.serviceType?.category && (
                <Badge variant="outline" className="mt-1">
                  {support.serviceType.category}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Provider
              </p>
              <p className="text-lg font-semibold">{support.provider}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Amount / Quantity
              </p>
              <p className="text-lg font-semibold">
                {support.amountOrQuantity}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Date Provided
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-lg font-semibold">
                  {support.dateProvided
                    ? format(new Date(support.dateProvided), "PPP")
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="md:col-span-2 space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Remark / Notes
              </p>
              <p className="p-3 bg-muted/50 rounded-lg text-sm">
                {support.remark || "No remarks provided."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Beneficiary & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Beneficiary & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1 text-center bg-primary/5 p-4 rounded-xl border border-primary/10">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Beneficiary Type
              </p>
              <p className="text-xl font-bold text-primary">
                {support.clientId ? "Individual Woman" : "Women Association"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ID: {support.clientId || support.womenAssociationId}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Location
                  </p>
                  <p className="font-semibold">{support.subCity}</p>
                  <p className="text-sm">Woreda {support.woreda}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClipboardList className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Facilitator
                  </p>
                  <p className="font-semibold">{support.facilitatorCityId}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Section */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Monitoring History
              </CardTitle>
              <CardDescription>Track follow-ups and outcomes</CardDescription>
            </div>
            <MonitoringForm supportServiceId={support.id} />
          </CardHeader>
          <CardContent>
            {support.monitoringLogs && support.monitoringLogs.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                <div className="relative border-l border-muted-foreground/20 ml-3 pl-8 space-y-8 py-4">
                  {support.monitoringLogs.map((log, index) => (
                    <div key={log.id} className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[44px] top-1 h-6 w-6 rounded-full border-4 border-background bg-primary shadow-sm" />

                      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-2">
                        <div>
                          <p className="font-bold text-lg">
                            {format(new Date(log.monitoringDate), "PPP")}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary">
                              {log.currentStatus}
                            </Badge>
                            <Badge variant="outline">Score: {log.score}%</Badge>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <User className="w-3 h-3" />
                              By: {log.assessedBy}
                            </p>
                          </div>
                        </div>
                        <div className="w-full md:w-32 h-2 bg-muted rounded-full overflow-hidden mt-2 md:mt-0">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${log.score}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-xl border border-muted-foreground/10">
                        <p className="text-sm whitespace-pre-wrap">
                          {log.remark}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-xl grayscale opacity-60">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-medium">
                  No monitoring logs recorded yet.
                </p>
                <p className="text-xs text-muted-foreground">
                  Add a new follow-up using the button above.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
