"use client";

import React from "react";
import RegisterSupportForm from "./_components/register-support-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import WomanSelect from "./_components/woman-select";
import SupportHistoryTable from "./_components/support-history-table";
import { useGetClientHistoryQuery } from "@/hooks/support";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import GenerateWomenReportDialog from "./_components/generate-women-report-dialog";
import QuickRegistrationForm from "./_components/quick-registration-form";

export default function SupportServicePage() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const { data: clientHistory, isLoading: isLoadingHistory } =
    useGetClientHistoryQuery(selectedClientId as number);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Support Services</h1>
          <p className="text-muted-foreground">
            Manage support services for clients and associations
          </p>
        </div>
        <GenerateWomenReportDialog />
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList>
          <TabsTrigger value="services">Service Management</TabsTrigger>
          <TabsTrigger value="combined">Quick Registration</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Column: Registration Form */}
            <div className="xl:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Register Support Service</CardTitle>
                  <CardDescription>
                    Register a new support service for an existing client or
                    association
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RegisterSupportForm />
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Service History */}
            <div className="xl:col-span-9 space-y-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Service History</CardTitle>
                  <CardDescription>
                    Select a woman to view her support service history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="max-w-sm">
                    <WomanSelect
                      value={selectedClientId?.toString()}
                      onValueChange={(value) =>
                        setSelectedClientId(parseInt(value))
                      }
                      placeholder="Select a woman to view history"
                    />
                  </div>

                  {selectedClientId ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Support Records
                        </h3>
                        <Badge variant="outline">
                          {clientHistory?.length || 0} Total
                        </Badge>
                      </div>
                      {isLoadingHistory ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Loading history...
                        </div>
                      ) : (
                        <SupportHistoryTable data={clientHistory || []} />
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-muted/10">
                      <p className="text-muted-foreground">
                        Please select a woman above to display her support
                        records.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="combined" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Registration</CardTitle>
              <CardDescription>
                Register a new client and support service in one step
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuickRegistrationForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
