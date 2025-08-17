"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { ReviewerComment } from "../../../../_components/reviewer-comment";
import { StepFormWrapper } from "../../../../_components/step-form-wrapper";

const returnedFields = {
  personal: {
    fullName: "Please correct the spelling of your last name.",
    address: "Address appears incomplete. Please provide full street address.",
    phone: "Phone number format is invalid.",
  },
  background: {
    reference1Phone: "Reference phone number could not be verified.",
    convictionDetails:
      "Please provide more specific details about the conviction date and charges.",
  },
  preferences: {
    adoptionReason:
      "Please expand on your motivation for adoption with more specific details.",
    expectations:
      "Response is too brief. Please provide more detailed expectations.",
  },
};

const mockApplicationData = {
  personal: {
    firstName: "Sarah",
    lastName: "Johnsn", // Intentional typo
    email: "sarah.johnson@email.com",
    phone: "555-123-456", // Missing digit
    address: "123 Main St", // Incomplete
    city: "Anytown",
    state: "ST",
    zipCode: "12345",
  },
  background: {
    reference1Name: "John Smith",
    reference1Phone: "555-000-000", // Invalid
    reference1Relationship: "Friend",
    hasConvictions: "yes",
    convictionDetails: "Traffic violation", // Too brief
  },
  preferences: {
    childAgeMin: "2",
    childAgeMax: "8",
    adoptionReason: "Want kids", // Too brief
    expectations: "Good process", // Too brief
  },
};

export default function EditSectionPage() {
  const router = useRouter();
  const params = useParams();
  const { id, section } = params;

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading application data
    setTimeout(() => {
      setFormData(
        mockApplicationData[section as keyof typeof mockApplicationData] || {}
      );
      setLoading(false);
    }, 500);
  }, [section]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Simulate saving changes
    console.log("Saving changes:", formData);
    router.push(`/applicant-portal/application/${id}`);
  };

  const getSectionTitle = () => {
    switch (section) {
      case "personal":
        return "Personal Information";
      case "background":
        return "Background & References";
      case "preferences":
        return "Preferences & Requirements";
      default:
        return "Edit Section";
    }
  };

  const getSectionDescription = () => {
    switch (section) {
      case "personal":
        return "Update your personal information based on reviewer feedback";
      case "background":
        return "Update your background information and references";
      case "preferences":
        return "Update your adoption preferences and requirements";
      default:
        return "Update the requested information";
    }
  };

  const getInstructions = () => {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-900 mb-2">
            Application Returned for Revision
          </h3>
          <p className="text-sm text-red-800">
            Please review and correct the highlighted fields below based on the
            reviewer's comments.
          </p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p>• Fields with comments require your attention</p>
          <p>• Make sure all information is accurate and complete</p>
          <p>• Click "Save Changes" when you're finished</p>
        </div>
      </div>
    );
  };

  const renderPersonalFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={""}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={""}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={
              returnedFields.personal?.fullName
                ? "border-red-300 bg-red-50"
                : ""
            }
          />
          {returnedFields.personal?.fullName && (
            <ReviewerComment comment={returnedFields.personal.fullName} />
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={""}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className={
            returnedFields.personal?.phone ? "border-red-300 bg-red-50" : ""
          }
        />
        {returnedFields.personal?.phone && (
          <ReviewerComment comment={returnedFields.personal.phone} />
        )}
      </div>

      <div>
        <Label htmlFor="address">Street Address</Label>
        <Input
          id="address"
          value={""}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className={
            returnedFields.personal?.address ? "border-red-300 bg-red-50" : ""
          }
        />
        {returnedFields.personal?.address && (
          <ReviewerComment comment={returnedFields.personal.address} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={""}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={""}
            onChange={(e) => handleInputChange("state", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={""}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderBackgroundFields = () => (
    <div className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg space-y-3">
        <h4 className="font-medium text-gray-900">Reference 1</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="reference1Name">Full Name</Label>
            <Input
              id="reference1Name"
              value={""}
              onChange={(e) =>
                handleInputChange("reference1Name", e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor="reference1Phone">Phone Number</Label>
            <Input
              id="reference1Phone"
              value={""}
              onChange={(e) =>
                handleInputChange("reference1Phone", e.target.value)
              }
              className={
                returnedFields.background?.reference1Phone
                  ? "border-red-300 bg-red-50"
                  : ""
              }
            />
            {returnedFields.background?.reference1Phone && (
              <ReviewerComment
                comment={returnedFields.background.reference1Phone}
              />
            )}
          </div>
          <div>
            <Label htmlFor="reference1Relationship">Relationship</Label>
            <Input
              id="reference1Relationship"
              value={""}
              onChange={(e) =>
                handleInputChange("reference1Relationship", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {true && (
        <div>
          <Label htmlFor="convictionDetails">Conviction Details</Label>
          <Textarea
            id="convictionDetails"
            value={""}
            onChange={(e) =>
              handleInputChange("convictionDetails", e.target.value)
            }
            rows={3}
            className={
              returnedFields.background?.convictionDetails
                ? "border-red-300 bg-red-50"
                : ""
            }
          />
          {returnedFields.background?.convictionDetails && (
            <ReviewerComment
              comment={returnedFields.background.convictionDetails}
            />
          )}
        </div>
      )}
    </div>
  );

  const renderPreferencesFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="childAgeMin">Minimum Age</Label>
          <Input
            id="childAgeMin"
            type="number"
            value={""}
            onChange={(e) => handleInputChange("childAgeMin", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="childAgeMax">Maximum Age</Label>
          <Input
            id="childAgeMax"
            type="number"
            value={""}
            onChange={(e) => handleInputChange("childAgeMax", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="adoptionReason">Why do you want to adopt?</Label>
        <Textarea
          id="adoptionReason"
          value={""}
          onChange={(e) => handleInputChange("adoptionReason", e.target.value)}
          rows={3}
          className={
            returnedFields.preferences?.adoptionReason
              ? "border-red-300 bg-red-50"
              : ""
          }
        />
        {returnedFields.preferences?.adoptionReason && (
          <ReviewerComment
            comment={returnedFields.preferences.adoptionReason}
          />
        )}
      </div>

      <div>
        <Label htmlFor="expectations">
          What are your expectations for the adoption process?
        </Label>
        <Textarea
          id="expectations"
          value={""}
          onChange={(e) => handleInputChange("expectations", e.target.value)}
          rows={3}
          className={
            returnedFields.preferences?.expectations
              ? "border-red-300 bg-red-50"
              : ""
          }
        />
        {returnedFields.preferences?.expectations && (
          <ReviewerComment comment={returnedFields.preferences.expectations} />
        )}
      </div>
    </div>
  );

  const renderFormFields = () => {
    switch (section) {
      case "personal":
        return renderPersonalFields();
      case "background":
        return renderBackgroundFields();
      case "preferences":
        return renderPreferencesFields();
      default:
        return <div>Section not found</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading application data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link
              href={`/adoption/applicant-portal/application/${id}`}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Application
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit {getSectionTitle()}
            </h1>
            <p className="text-gray-600">Application ID: {id}</p>
          </div>
        </div>

        <StepFormWrapper
          title={getSectionTitle()}
          description={getSectionDescription()}
          instructions={getInstructions()}
        >
          <form className="space-y-6">
            {renderFormFields()}

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="px-8 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </StepFormWrapper>
      </div>
    </div>
  );
}
