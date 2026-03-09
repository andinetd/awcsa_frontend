import { useHomeVisitFormStore } from "@/stores/home-visit-store";

// Returns a merged object of all steps from the store with sensible defaults matching the requested shape.
export function getAggregatedHomeVisitData(): any {
  const { step1, step2, step3, step4, step5 } =
    useHomeVisitFormStore.getState();

  return {
    generalInfo: {
      socialWorkerName: step1?.generalInfo?.socialWorkerName ?? "",
      placeOfVisit: step1?.generalInfo?.placeOfVisit ?? "",
      startDate: step1?.generalInfo?.startDate ?? "",
      startTime: step1?.generalInfo?.startTime ?? "",
      endDate: step1?.generalInfo?.endDate ?? "",
      endTime: step1?.generalInfo?.endTime ?? "",
      address: {
        region: step1?.generalInfo?.address?.region ?? "",
        subCity: step1?.generalInfo?.address?.subCity ?? "",
        woreda: step1?.generalInfo?.address?.woreda ?? "",
        kebele: step1?.generalInfo?.address?.kebele ?? "",
        houseNumber: step1?.generalInfo?.address?.houseNumber ?? "",
        neighborhoodName: step1?.generalInfo?.address?.neighborhoodName ?? "",
      },
    },

    applicantFather: {
      fullName: step1?.applicantFather?.fullName ?? "",
      birthDateOrAge: step1?.applicantFather?.birthDateOrAge ?? "",
      birthPlace: step1?.applicantFather?.birthPlace ?? "",
      religion: step1?.applicantFather?.religion ?? "",
      maritalStatus: step1?.applicantFather?.maritalStatus ?? "",
      educationLevel: step1?.applicantFather?.educationLevel ?? "",
      nationality: step1?.applicantFather?.nationality ?? "",
      occupationType: step1?.applicantFather?.occupationType ?? "",
      occupation: step1?.applicantFather?.occupation ?? "",
      monthlyIncome: step1?.applicantFather?.monthlyIncome ?? 0,
      extraIncome: step1?.applicantFather?.extraIncome ?? "",
      phoneHome: step1?.applicantFather?.phoneHome ?? "",
      phoneMobile: step1?.applicantFather?.phoneMobile ?? "",
    },

    applicantMother: {
      fullName: step1?.applicantMother?.fullName ?? "",
      birthDateOrAge: step1?.applicantMother?.birthDateOrAge ?? "",
      birthPlace: step1?.applicantMother?.birthPlace ?? "",
      religion: step1?.applicantMother?.religion ?? "",
      maritalStatus: step1?.applicantMother?.maritalStatus ?? "",
      educationLevel: step1?.applicantMother?.educationLevel ?? "",
      nationality: step1?.applicantMother?.nationality ?? "",
      occupationType: step1?.applicantMother?.occupationType ?? "",
      occupation: step1?.applicantMother?.occupation ?? "",
      monthlyIncome: step1?.applicantMother?.monthlyIncome ?? 0,
      extraIncome: step1?.applicantMother?.extraIncome ?? "",
      phoneHome: step1?.applicantMother?.phoneHome ?? "",
      phoneMobile: step1?.applicantMother?.phoneMobile ?? "",
    },

    existingChildren:
      step2?.existingChildren && step2.existingChildren.length > 0
        ? step2.existingChildren
        : [],

    householdMembers:
      step2?.householdMembers && step2.householdMembers.length > 0
        ? step2.householdMembers
        : [],

    applicantParents:
      step2?.applicantParents && step2.applicantParents.length > 0
        ? step2.applicantParents
        : [],

    familyBackground: {
      fatherSide: {
        parentsNames: step2?.familyBackground?.fatherSide?.parentsNames ?? "",
        addressIfAlive:
          step2?.familyBackground?.fatherSide?.addressIfAlive ?? "",
        birthOrder: step2?.familyBackground?.fatherSide?.birthOrder ?? "",
        siblingsCount: step2?.familyBackground?.fatherSide?.siblingsCount ?? "",
        relationshipWithFamily:
          step2?.familyBackground?.fatherSide?.relationshipWithFamily ?? "",
        childhoodFamilyOccupation:
          step2?.familyBackground?.fatherSide?.childhoodFamilyOccupation ?? "",
        childhoodExperience:
          step2?.familyBackground?.fatherSide?.childhoodExperience ?? "",
        childhoodBehavior:
          step2?.familyBackground?.fatherSide?.childhoodBehavior ?? "",
        workExperience:
          step2?.familyBackground?.fatherSide?.workExperience ?? "",
        attitudeToWork:
          step2?.familyBackground?.fatherSide?.attitudeToWork ?? "",
      },
      motherSide: {
        parentsNames: step2?.familyBackground?.motherSide?.parentsNames ?? "",
        addressIfAlive:
          step2?.familyBackground?.motherSide?.addressIfAlive ?? "",
        birthOrder: step2?.familyBackground?.motherSide?.birthOrder ?? "",
        siblingsCount: step2?.familyBackground?.motherSide?.siblingsCount ?? "",
        relationshipWithFamily:
          step2?.familyBackground?.motherSide?.relationshipWithFamily ?? "",
        childhoodFamilyOccupation:
          step2?.familyBackground?.motherSide?.childhoodFamilyOccupation ?? "",
        childhoodExperience:
          step2?.familyBackground?.motherSide?.childhoodExperience ?? "",
        childhoodBehavior:
          step2?.familyBackground?.motherSide?.childhoodBehavior ?? "",
        workExperience:
          step2?.familyBackground?.motherSide?.workExperience ?? "",
        attitudeToWork:
          step2?.familyBackground?.motherSide?.attitudeToWork ?? "",
      },
      spouseEvaluationTogether: {
        strengthAndWeaknesses:
          step2?.familyBackground?.spouseEvaluationTogether
            ?.strengthAndWeaknesses ?? "",
        relationShipWithChildren:
          step2?.familyBackground?.spouseEvaluationTogether
            ?.relationShipWithChildren ?? "",
        LifeGoalsAsGuardian:
          step2?.familyBackground?.spouseEvaluationTogether
            ?.LifeGoalsAsGuardian ?? "",
        spareTimeActivities:
          step2?.familyBackground?.spouseEvaluationTogether
            ?.spareTimeActivities ?? "",
      },
    },

    marriageInfo: {
      marriageDateAndPlace: step1?.marriageInfo?.marriageDateAndPlace ?? "",
      marriageDuration: step1?.marriageInfo?.marriageDuration ?? "",
      relationshipDescription:
        step1?.marriageInfo?.relationshipDescription ?? "",
      conflictResolution: step1?.marriageInfo?.conflictResolution ?? "",
      mutualSupport: step1?.marriageInfo?.mutualSupport ?? "",
      bigDescisionsMakingExperience:
        step1?.marriageInfo?.bigDescisionsMakingExperience ?? "",
      financialManagement: step1?.marriageInfo?.financialManagement ?? "",
    },

    lifeStyleAndSocialRelations: {
      readinessForCare:
        step3?.lifeStyleAndSocialRelations?.readinessForCare ?? "",
      familyLawsAndRules:
        step3?.lifeStyleAndSocialRelations?.familyLawsAndRules ?? "",
      dailyLifeRoutine:
        step3?.lifeStyleAndSocialRelations?.dailyLifeRoutine ?? "",
      familyWorkDistribution:
        step3?.lifeStyleAndSocialRelations?.familyWorkDistribution ?? "",
      familyTime: step3?.lifeStyleAndSocialRelations?.familyTime ?? "",
      childLifeParticipation:
        step3?.lifeStyleAndSocialRelations?.childLifeParticipation ?? "",
      holidayTimeActivities:
        step3?.lifeStyleAndSocialRelations?.holidayTimeActivities ?? "",
      socialLifeAttitude:
        step3?.lifeStyleAndSocialRelations?.socialLifeAttitude ?? "",
      communityInvolvement:
        step3?.lifeStyleAndSocialRelations?.communityInvolvement ?? "",
      changeAfterAdoption:
        step3?.lifeStyleAndSocialRelations?.changeAfterAdoption ?? "",
    },

    parentingExperience: {
      hasExperience: step3?.parentingExperience?.hasExperience ?? true,
      disciplineMethods: step3?.parentingExperience?.disciplineMethods ?? "",
      goodMannersApproach:
        step3?.parentingExperience?.goodMannersApproach ?? "",
      improvementAreas: step3?.parentingExperience?.improvementAreas ?? "",
    },

    adoptionInterest: {
      meaningOfAdoption: step3?.adoptionInterest?.meaningOfAdoption ?? "",
      reasonForAdoption: step3?.adoptionInterest?.reasonForAdoption ?? "",
      preferredChild: {
        quantity: step3?.adoptionInterest?.preferredChild?.quantity ?? 0,
        sex: step3?.adoptionInterest?.preferredChild?.sex ?? "MALE",
        ageRange: step3?.adoptionInterest?.preferredChild?.ageRange ?? "",
        healthCondition:
          step3?.adoptionInterest?.preferredChild?.healthCondition ?? "",
        reasonForChoice:
          step3?.adoptionInterest?.preferredChild?.reasonForChoice ?? "",
      },
    },

    existingChildrenAndFamilyMembers: {
      name: step3?.existingChildrenAndFamilyMembers?.name ?? "",
      behavior: step3?.existingChildrenAndFamilyMembers?.behavior ?? "",
      adoptionAttitude:
        step3?.existingChildrenAndFamilyMembers?.adoptionAttitude ?? "",
      futureAdoptionContributions:
        step3?.existingChildrenAndFamilyMembers?.futureAdoptionContributions ??
        "",
      mistakeAttitudes:
        step3?.existingChildrenAndFamilyMembers?.mistakeAttitudes ?? "",
    },

    incomeAndFinancialStatus: {
      incomeSources: step4?.incomeAndFinancialStatus?.incomeSources ?? "",
      incomeSupportSources:
        step4?.incomeAndFinancialStatus?.incomeSupportSources ?? "",
      incomeShortages: step4?.incomeAndFinancialStatus?.incomeShortages ?? "",
      incomeForExtraChild:
        step4?.incomeAndFinancialStatus?.incomeForExtraChild ?? "",
    },

    homeAndEnvironment: {
      houseType: step4?.homeAndEnvironment?.houseType ?? "",
      ownershipStatus: step4?.homeAndEnvironment?.ownershipStatus ?? "",
      roomsAndSize: step4?.homeAndEnvironment?.roomsAndSize ?? "",
      livingDuration: step4?.homeAndEnvironment?.livingDuration ?? "",
      suitabilityForChild: step4?.homeAndEnvironment?.suitabilityForChild ?? "",
      compoundCondition: step4?.homeAndEnvironment?.compoundCondition ?? "",
      neighborhoodCondition:
        step4?.homeAndEnvironment?.neighborhoodCondition ?? "",
      communityAttitude: step4?.homeAndEnvironment?.communityAttitude ?? "",
      serviceAccessibility:
        step4?.homeAndEnvironment?.serviceAccessibility ?? "",
    },

    healthAndLegal: {
      currentHealthCondition:
        step4?.healthAndLegal?.currentHealthCondition ?? "",
      medication: step4?.healthAndLegal?.medication ?? "",
      healthConditionForFamilyResponsibility:
        step4?.healthAndLegal?.healthConditionForFamilyResponsibility ?? "",
      mentalHealthIssuesFromFamily:
        step4?.healthAndLegal?.mentalHealthIssuesFromFamily ?? "",
    },

    criminalIssues: {
      criminalRecord: step4?.criminalIssues?.criminalRecord ?? "",
      familyCriminalRecord: step4?.criminalIssues?.familyCriminalRecord ?? "",
    },

    witnesses:
      step5?.witnesses && step5.witnesses.length > 0
        ? step5.witnesses
        : [
            {
              fullName: "",
              relationToApplicants: "",
              phoneNumber: "",
            },
          ],

    socialWorkerEvaluation: {
      comment: step5?.socialWorkerEvaluation?.comment ?? "",
      preparedBy: step5?.socialWorkerEvaluation?.preparedBy ?? "",
      preparedDate: step5?.socialWorkerEvaluation?.preparedDate ?? "",
      approvedBy: step5?.socialWorkerEvaluation?.approvedBy ?? "",
      approvedDate: step5?.socialWorkerEvaluation?.approvedDate ?? "",
      signature: step5?.socialWorkerEvaluation?.signature ?? "",
    },

    adoptionApplicantFather: {
      fullName: step5?.adoptionApplicantFather?.fullName ?? "",
      date: step5?.adoptionApplicantFather?.date ?? "",
      signature: step5?.adoptionApplicantFather?.signature ?? "",
    },

    adoptionApplicantMother: {
      fullName: step5?.adoptionApplicantMother?.fullName ?? "",
      date: step5?.adoptionApplicantMother?.date ?? "",
      signature: step5?.adoptionApplicantMother?.signature ?? "",
    },
  };
}
