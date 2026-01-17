"use client";

import { useTranslations } from "next-intl";
import { ComplaintForm } from "./_components/complaint-form";
import { ComplaintList } from "./_components/complaint-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ApplicantComplaintsPage() {
  const application = useTranslations("applicationMessages");
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/applicant-portal/portal">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Complaints Service
          </h1>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
          <TabsList>
            <TabsTrigger value="new">New Complaint</TabsTrigger>
            <TabsTrigger value="history">Complaint History</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Complaint History</CardTitle>
                <CardDescription>
                  View and track the status of your submitted complaints.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplaintList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>Submit a New Complaint</CardTitle>
                <CardDescription>
                  Found an issue with the system or process? Let us know.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplaintForm onSuccess={() => setActiveTab("history")} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
