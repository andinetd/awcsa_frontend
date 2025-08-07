"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Users, FileText } from "lucide-react";
import { StepFormWrapper } from "../../../_components/step-form-wrapper";

export default function Step2Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    hasConvictions: "",
    convictionDetails: "",
    hasChildAbuse: "",
    reference1Name: "",
    reference1Phone: "",
    reference1Relationship: "",
    reference2Name: "",
    reference2Phone: "",
    reference2Relationship: "",
    reference3Name: "",
    reference3Phone: "",
    reference3Relationship: "",
    previousAdoption: "",
    adoptionExperience: "",
    medicalConditions: "",
    medications: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    localStorage.setItem("step2Data", JSON.stringify(formData));
    router.push("/adoption/applicant-portal/application/new/step3");
  };

  const handleBack = () => {
    router.push("/adoption/applicant-portal/application/new/step1");
  };

  const instructions = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-blue-600">
        <Shield className="h-5 w-5" />
        <h3 className="font-semibold">Background Check & References</h3>
      </div>

      <ul className="space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>
            Criminal background information (honesty is required and
            appreciated)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>
            Three personal references who know you well (non-family members
            preferred)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>Previous adoption experience or child care background</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>Medical history and current health status</span>
        </li>
      </ul>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Confidential:</strong> All information provided will be kept
          strictly confidential and used only for application processing.
        </p>
      </div>
    </div>
  );

  return (
    <StepFormWrapper
      title="Background & References"
      description="Help us understand your background and provide references"
      instructions={instructions}
    >
      <form className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Background Information
          </h3>

          <div>
            <Label>Have you ever been convicted of a crime? *</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasConvictions"
                  value="no"
                  checked={formData.hasConvictions === "no"}
                  onChange={(e) =>
                    handleInputChange("hasConvictions", e.target.value)
                  }
                  className="mr-2"
                />
                No
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasConvictions"
                  value="yes"
                  checked={formData.hasConvictions === "yes"}
                  onChange={(e) =>
                    handleInputChange("hasConvictions", e.target.value)
                  }
                  className="mr-2"
                />
                Yes
              </label>
            </div>
          </div>

          {formData.hasConvictions === "yes" && (
            <div>
              <Label htmlFor="convictionDetails">
                Please provide details *
              </Label>
              <Textarea
                id="convictionDetails"
                value={formData.convictionDetails}
                onChange={(e) =>
                  handleInputChange("convictionDetails", e.target.value)
                }
                rows={3}
                required
              />
            </div>
          )}

          <div>
            <Label>
              Have you ever been investigated for child abuse or neglect? *
            </Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasChildAbuse"
                  value="no"
                  checked={formData.hasChildAbuse === "no"}
                  onChange={(e) =>
                    handleInputChange("hasChildAbuse", e.target.value)
                  }
                  className="mr-2"
                />
                No
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasChildAbuse"
                  value="yes"
                  checked={formData.hasChildAbuse === "yes"}
                  onChange={(e) =>
                    handleInputChange("hasChildAbuse", e.target.value)
                  }
                  className="mr-2"
                />
                Yes
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Personal References
          </h3>

          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <h4 className="font-medium text-gray-900">Reference {num}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor={`reference${num}Name`}>Full Name *</Label>
                  <Input
                    id={`reference${num}Name`}
                    value={
                      formData[`reference${num}Name` as keyof typeof formData]
                    }
                    onChange={(e) =>
                      handleInputChange(`reference${num}Name`, e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`reference${num}Phone`}>Phone Number *</Label>
                  <Input
                    id={`reference${num}Phone`}
                    type="tel"
                    value={
                      formData[`reference${num}Phone` as keyof typeof formData]
                    }
                    onChange={(e) =>
                      handleInputChange(`reference${num}Phone`, e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`reference${num}Relationship`}>
                    Relationship *
                  </Label>
                  <Input
                    id={`reference${num}Relationship`}
                    value={
                      formData[
                        `reference${num}Relationship` as keyof typeof formData
                      ]
                    }
                    onChange={(e) =>
                      handleInputChange(
                        `reference${num}Relationship`,
                        e.target.value
                      )
                    }
                    placeholder="Friend, Colleague, etc."
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Additional Information
          </h3>

          <div>
            <Label>Have you previously adopted or fostered children?</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="previousAdoption"
                  value="no"
                  checked={formData.previousAdoption === "no"}
                  onChange={(e) =>
                    handleInputChange("previousAdoption", e.target.value)
                  }
                  className="mr-2"
                />
                No
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="previousAdoption"
                  value="yes"
                  checked={formData.previousAdoption === "yes"}
                  onChange={(e) =>
                    handleInputChange("previousAdoption", e.target.value)
                  }
                  className="mr-2"
                />
                Yes
              </label>
            </div>
          </div>

          {formData.previousAdoption === "yes" && (
            <div>
              <Label htmlFor="adoptionExperience">
                Please describe your experience
              </Label>
              <Textarea
                id="adoptionExperience"
                value={formData.adoptionExperience}
                onChange={(e) =>
                  handleInputChange("adoptionExperience", e.target.value)
                }
                rows={3}
              />
            </div>
          )}

          <div>
            <Label htmlFor="medicalConditions">
              Current Medical Conditions
            </Label>
            <Textarea
              id="medicalConditions"
              value={formData.medicalConditions}
              onChange={(e) =>
                handleInputChange("medicalConditions", e.target.value)
              }
              placeholder="List any current medical conditions or write 'None'"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="medications">Current Medications</Label>
            <Textarea
              id="medications"
              value={formData.medications}
              onChange={(e) => handleInputChange("medications", e.target.value)}
              placeholder="List current medications or write 'None'"
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Previous Step
          </Button>
          <Button onClick={handleNext} className="px-8">
            Next Step
          </Button>
        </div>
      </form>
    </StepFormWrapper>
  );
}
