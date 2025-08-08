"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Heart, CheckCircle, FileText } from "lucide-react";

export default function ReviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    step1: null,
    step2: null,
    step3: null,
  });

  // useEffect(() => {
  //   const step1Data = localStorage.getItem("step1Data");
  //   const step2Data = localStorage.getItem("step2Data");
  //   const step3Data = localStorage.getItem("step3Data");

  //   setFormData({
  //     step1: step1Data ? JSON.parse(step1Data) : null,
  //     step2: step2Data ? JSON.parse(step2Data) : null,
  //     step3: step3Data ? JSON.parse(step3Data) : null,
  //   });
  // }, []);

  const handleSubmit = () => {
    // Simulate application submission
    const applicationId = `APP-${Date.now()}`;
    localStorage.setItem(
      "submittedApplication",
      JSON.stringify({
        id: applicationId,
        ...formData,
        submittedAt: new Date().toISOString(),
        status: "pending",
      })
    );

    // Clear form data
    localStorage.removeItem("step1Data");
    localStorage.removeItem("step2Data");
    localStorage.removeItem("step3Data");

    router.push("/adoption/applicant-portal/portal");
  };

  const handleBack = () => {
    router.push("/adoption/applicant-portal/application/new/step3");
  };

  async function onSubmit() {
    //TODO: handle submission here
    router.push("/adoption/applicant-portal/portal");
    // setData(values);
  }

  // if (!formData.step1 || !formData.step2 || !formData.step3) {
  //   return (
  //     <div className="text-center py-8">
  //       <p className="text-gray-600">Loading application data...</p>
  //     </div>
  //   );
  // }

  const filePlaceholder = (name: string) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between"></div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg min-w-0 flex-1 max-w-xs">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {name}
              </p>
              <p className="text-xs text-gray-500">
                {/* {formatFileSize(fileItem.size)} */}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Your Application
        </h2>
        <p className="text-gray-600">
          Please review all information before submitting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1 Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">ID</span>

                {filePlaceholder("id")}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Birth Certificate:
                </span>
                {filePlaceholder("birthCertificate")}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Income Document:
                </span>
                {filePlaceholder("income")}
              </div>
              <div>
                <span className="font-medium text-gray-500">Medical:</span>
                {filePlaceholder("Medical Information")}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Criminal Document:
                </span>
                {filePlaceholder("criminal")}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Additional Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">
                  Spouse Agreement
                </span>

                {filePlaceholder("agreement")}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Marital Status:
                </span>
                {filePlaceholder("marital")}
              </div>
              <div>
                <span className="font-medium text-gray-500">Well being:</span>
                {filePlaceholder("wellbeig")}
              </div>
              <div>
                <span className="font-medium text-gray-500">photo:</span>
                {filePlaceholder("photo")}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Criminal Document:
                </span>
                {filePlaceholder("criminal")}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 Review */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Data from ID number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">First Name</h4>
                <div>
                  <span className="font-medium text-gray-500">Last Name</span>
                  <p></p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Gender:</span>
                  <p>male</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Age</span>
                  <p>22</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Adress</h4>
                <div>
                  <span className="font-medium text-gray-500">City</span>
                  <p></p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">sub city</span>
                  <p></p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">woreda</span>
                  <p></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Ready to Submit</h3>
            <p className="text-sm text-blue-800 mt-1">
              By submitting this application, you confirm that all information
              provided is accurate and complete. You understand that false
              information may result in application rejection.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Previous Step
        </Button>
        <Button
          onClick={onSubmit}
          className="px-8 bg-green-600 hover:bg-green-700"
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
}
