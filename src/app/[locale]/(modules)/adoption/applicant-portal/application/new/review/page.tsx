"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Heart, CheckCircle } from "lucide-react";

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

  // if (!formData.step1 || !formData.step2 || !formData.step3) {
  //   return (
  //     <div className="text-center py-8">
  //       <p className="text-gray-600">Loading application data...</p>
  //     </div>
  //   );
  // }

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
                <span className="font-medium text-gray-500">Name:</span>
                <p>{formData.step1} </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Email:</span>
                <p>{formData.step1}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Phone:</span>
                <p>{formData.step1}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Date of Birth:
                </span>
                {/* <p>{new Date(formData).toLocaleDateString()}</p> */}
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-500">Address:</span>
                <p>
                  {formData.step1}, {formData.step1}, {formData.step1}{" "}
                  {formData.step1}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Occupation:</span>
                <p>{formData.step1}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Marital Status:
                </span>
                <p>{formData.step1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Background & References
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div>
                <span className="font-medium text-gray-500">
                  Criminal Convictions:
                </span>
                <p>
                  {formData.step2 === "yes" ? "Yes - Details provided" : "No"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Child Abuse Investigation:
                </span>
                <p>{formData.step2 === "yes" ? "Yes" : "No"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">References:</span>
                <ul className="list-disc list-inside ml-2">
                  <li>
                    {formData.step2} - {formData.step2}
                  </li>
                  <li>
                    {formData.step2} - {formData.step2}
                  </li>
                  <li>
                    {formData.step2} - {formData.step2}
                  </li>
                </ul>
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Previous Adoption Experience:
                </span>
                <p>{formData.step2 === "yes" ? "Yes" : "No"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 Review */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Preferences & Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">
                  Child Preferences
                </h4>
                <div>
                  <span className="font-medium text-gray-500">Age Range:</span>
                  <p>
                    {formData.step3} - {formData.step3} years
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Gender:</span>
                  <p>{formData.step3}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">
                    Special Needs:
                  </span>
                  <p>{formData.step3}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Siblings:</span>
                  <p>
                    {formData.step3 === "yes"
                      ? "Would consider"
                      : "Prefer single child"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">
                  Home Environment
                </h4>
                <div>
                  <span className="font-medium text-gray-500">Home Type:</span>
                  <p>{formData.step3}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Ownership:</span>
                  <p>{formData.step3}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Yard Space:</span>
                  <p>{formData.step3 === "yes" ? "Yes" : "No"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">
                    Other Children:
                  </span>
                  <p>{formData.step3 === "yes" ? "Yes" : "No"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Pets:</span>
                  <p>{formData.step3 === "yes" ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div>
                <span className="font-medium text-gray-500">
                  Adoption Motivation:
                </span>
                <p className="mt-1 text-sm">{formData.step3}</p>
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
          onClick={handleSubmit}
          className="px-8 bg-green-600 hover:bg-green-700"
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
}
