"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { StepFormWrapper } from "../../../_components/step-form-wrapper";

export default function Step1Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    occupation: "",
    employer: "",
    maritalStatus: "",
    spouseInfo: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Save to localStorage or state management
    localStorage.setItem("step1Data", JSON.stringify(formData));
    router.push("/adoption/applicant-portal/application/new/step2");
  };

  const instructions = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-blue-600">
        <User className="h-5 w-5" />
        <h3 className="font-semibold">Personal Information Required</h3>
      </div>

      <ul className="space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>
            Provide your complete legal name as it appears on official documents
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>Current contact information including phone and email</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>Complete residential address where you currently live</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>Employment information and marital status</span>
        </li>
      </ul>

      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> All information must be accurate and will be
          verified during the application process.
        </p>
      </div>
    </div>
  );

  return (
    <StepFormWrapper
      title="Personal Information"
      description="Tell us about yourself and your current situation"
      instructions={instructions}
    >
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="occupation">Occupation *</Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) => handleInputChange("occupation", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="employer">Employer</Label>
            <Input
              id="employer"
              value={formData.employer}
              onChange={(e) => handleInputChange("employer", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="maritalStatus">Marital Status *</Label>
          <select
            id="maritalStatus"
            value={formData.maritalStatus}
            onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select marital status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        {formData.maritalStatus === "married" && (
          <div>
            <Label htmlFor="spouseInfo">Spouse Information</Label>
            <Textarea
              id="spouseInfo"
              value={formData.spouseInfo}
              onChange={(e) => handleInputChange("spouseInfo", e.target.value)}
              placeholder="Please provide your spouse's full name, occupation, and employer"
              rows={3}
            />
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleNext} className="px-8">
            Next Step
          </Button>
        </div>
      </form>
    </StepFormWrapper>
  );
}
