"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Home, Baby } from "lucide-react";
import { StepFormWrapper } from "../../../_components/step-form-wrapper";

export default function Step3Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    childAgeMin: "",
    childAgeMax: "",
    childGender: "",
    childRace: "",
    specialNeeds: "",
    specialNeedsDetails: "",
    siblings: "",
    homeType: "",
    homeOwnership: "",
    yardSpace: "",
    otherChildren: "",
    otherChildrenDetails: "",
    pets: "",
    petDetails: "",
    adoptionReason: "",
    expectations: "",
    challenges: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    localStorage.setItem("step3Data", JSON.stringify(formData));
    router.push("/adoption/applicant-portal/application/new/review");
  };

  const handleBack = () => {
    router.push("/adoption/applicant-portal/application/new/step2");
  };

  const instructions = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-blue-600">
        <Heart className="h-5 w-5" />
        <h3 className="font-semibold">Child Preferences & Home Environment</h3>
      </div>

      <ul className="space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>Specify your preferences for the child you wish to adopt</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>Describe your home environment and living situation</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>Share your motivation and expectations for adoption</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>
            Consider any challenges you may face and how you'll address them
          </span>
        </li>
      </ul>

      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Remember:</strong> Being open to different possibilities may
          increase your chances of a successful match.
        </p>
      </div>
    </div>
  );

  return (
    <StepFormWrapper
      title="Preferences & Requirements"
      description="Tell us about your preferences and home environment"
      instructions={instructions}
    >
      <form className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Baby className="h-4 w-4" />
            Child Preferences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="childAgeMin">Minimum Age *</Label>
              <Input
                id="childAgeMin"
                type="number"
                min="0"
                max="18"
                value={formData.childAgeMin}
                onChange={(e) =>
                  handleInputChange("childAgeMin", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="childAgeMax">Maximum Age *</Label>
              <Input
                id="childAgeMax"
                type="number"
                min="0"
                max="18"
                value={formData.childAgeMax}
                onChange={(e) =>
                  handleInputChange("childAgeMax", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div>
            <Label>Gender Preference</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="childGender"
                  value="no-preference"
                  checked={formData.childGender === "no-preference"}
                  onChange={(e) =>
                    handleInputChange("childGender", e.target.value)
                  }
                  className="mr-2"
                />
                No Preference
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="childGender"
                  value="male"
                  checked={formData.childGender === "male"}
                  onChange={(e) =>
                    handleInputChange("childGender", e.target.value)
                  }
                  className="mr-2"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="childGender"
                  value="female"
                  checked={formData.childGender === "female"}
                  onChange={(e) =>
                    handleInputChange("childGender", e.target.value)
                  }
                  className="mr-2"
                />
                Female
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="childRace">Race/Ethnicity Preferences</Label>
            <Input
              id="childRace"
              value={formData.childRace}
              onChange={(e) => handleInputChange("childRace", e.target.value)}
              placeholder="Any preferences or 'No preference'"
            />
          </div>

          <div>
            <Label>Would you consider a child with special needs?</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="specialNeeds"
                  value="yes"
                  checked={formData.specialNeeds === "yes"}
                  onChange={(e) =>
                    handleInputChange("specialNeeds", e.target.value)
                  }
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="specialNeeds"
                  value="no"
                  checked={formData.specialNeeds === "no"}
                  onChange={(e) =>
                    handleInputChange("specialNeeds", e.target.value)
                  }
                  className="mr-2"
                />
                No
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="specialNeeds"
                  value="depends"
                  checked={formData.specialNeeds === "depends"}
                  onChange={(e) =>
                    handleInputChange("specialNeeds", e.target.value)
                  }
                  className="mr-2"
                />
                Depends on the condition
              </label>
            </div>
          </div>

          {(formData.specialNeeds === "yes" ||
            formData.specialNeeds === "depends") && (
            <div>
              <Label htmlFor="specialNeedsDetails">Please specify</Label>
              <Textarea
                id="specialNeedsDetails"
                value={formData.specialNeedsDetails}
                onChange={(e) =>
                  handleInputChange("specialNeedsDetails", e.target.value)
                }
                rows={2}
              />
            </div>
          )}

          <div>
            <Label>Would you consider siblings?</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="siblings"
                  value="yes"
                  checked={formData.siblings === "yes"}
                  onChange={(e) =>
                    handleInputChange("siblings", e.target.value)
                  }
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="siblings"
                  value="no"
                  checked={formData.siblings === "no"}
                  onChange={(e) =>
                    handleInputChange("siblings", e.target.value)
                  }
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home Environment
          </h3>

          <div>
            <Label htmlFor="homeType">Type of Home *</Label>
            <select
              id="homeType"
              value={formData.homeType}
              onChange={(e) => handleInputChange("homeType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select home type</option>
              <option value="house">Single Family House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condominium</option>
              <option value="townhouse">Townhouse</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <Label>Do you own or rent your home? *</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="homeOwnership"
                  value="own"
                  checked={formData.homeOwnership === "own"}
                  onChange={(e) =>
                    handleInputChange("homeOwnership", e.target.value)
                  }
                  className="mr-2"
                />
                Own
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="homeOwnership"
                  value="rent"
                  checked={formData.homeOwnership === "rent"}
                  onChange={(e) =>
                    handleInputChange("homeOwnership", e.target.value)
                  }
                  className="mr-2"
                />
                Rent
              </label>
            </div>
          </div>

          <div>
            <Label>Do you have yard space?</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="yardSpace"
                  value="yes"
                  checked={formData.yardSpace === "yes"}
                  onChange={(e) =>
                    handleInputChange("yardSpace", e.target.value)
                  }
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="yardSpace"
                  value="no"
                  checked={formData.yardSpace === "no"}
                  onChange={(e) =>
                    handleInputChange("yardSpace", e.target.value)
                  }
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div>
            <Label>Do you have other children in the home?</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="otherChildren"
                  value="yes"
                  checked={formData.otherChildren === "yes"}
                  onChange={(e) =>
                    handleInputChange("otherChildren", e.target.value)
                  }
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="otherChildren"
                  value="no"
                  checked={formData.otherChildren === "no"}
                  onChange={(e) =>
                    handleInputChange("otherChildren", e.target.value)
                  }
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {formData.otherChildren === "yes" && (
            <div>
              <Label htmlFor="otherChildrenDetails">
                Please provide details about other children
              </Label>
              <Textarea
                id="otherChildrenDetails"
                value={formData.otherChildrenDetails}
                onChange={(e) =>
                  handleInputChange("otherChildrenDetails", e.target.value)
                }
                placeholder="Ages, relationship to you, etc."
                rows={2}
              />
            </div>
          )}

          <div>
            <Label>Do you have pets?</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pets"
                  value="yes"
                  checked={formData.pets === "yes"}
                  onChange={(e) => handleInputChange("pets", e.target.value)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pets"
                  value="no"
                  checked={formData.pets === "no"}
                  onChange={(e) => handleInputChange("pets", e.target.value)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {formData.pets === "yes" && (
            <div>
              <Label htmlFor="petDetails">Please describe your pets</Label>
              <Textarea
                id="petDetails"
                value={formData.petDetails}
                onChange={(e) =>
                  handleInputChange("petDetails", e.target.value)
                }
                placeholder="Type, breed, age, temperament, etc."
                rows={2}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">
            Motivation & Expectations
          </h3>

          <div>
            <Label htmlFor="adoptionReason">Why do you want to adopt? *</Label>
            <Textarea
              id="adoptionReason"
              value={formData.adoptionReason}
              onChange={(e) =>
                handleInputChange("adoptionReason", e.target.value)
              }
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="expectations">
              What are your expectations for the adoption process?
            </Label>
            <Textarea
              id="expectations"
              value={formData.expectations}
              onChange={(e) =>
                handleInputChange("expectations", e.target.value)
              }
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="challenges">
              What challenges do you anticipate and how will you address them?
            </Label>
            <Textarea
              id="challenges"
              value={formData.challenges}
              onChange={(e) => handleInputChange("challenges", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Previous Step
          </Button>
          <Button onClick={handleNext} className="px-8">
            Review Application
          </Button>
        </div>
      </form>
    </StepFormWrapper>
  );
}
