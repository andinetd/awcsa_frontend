import { z } from "zod";

export const Step1Schema = z.object({
  generalInfo: z.object({
    socialWorkerName: z.string().min(1),
    placeOfVisit: z.string().min(1),
    startDate: z.string(),
    startTime: z.string(),
    endDate: z.string(),
    endTime: z.string(),
    address: z.object({
      region: z.string(),
      subCity: z.string(),
      woreda: z.string(),
      kebele: z.string(),
      houseNumber: z.string(),
      neighborhoodName: z.string(),
    }),
  }),
  applicantFather: z.object({
    fullName: z.string(),
    birthDateOrAge: z.string(),
    birthPlace: z.string(),
    religion: z.string(),
    maritalStatus: z.string(),
    educationLevel: z.string(),
    nationality: z.string(),
    occupationType: z.string(),
    occupation: z.string(),
    monthlyIncome: z.number(),
    extraIncome: z.string(),
    phoneHome: z.string(),
    phoneMobile: z.string(),
  }),
  applicantMother: z.object({
    fullName: z.string(),
    birthDateOrAge: z.string(),
    birthPlace: z.string(),
    religion: z.string(),
    maritalStatus: z.string(),
    educationLevel: z.string(),
    nationality: z.string(),
    occupationType: z.string(),
    occupation: z.string(),
    monthlyIncome: z.number(),
    extraIncome: z.string(),
    phoneHome: z.string(),
    phoneMobile: z.string(),
  }),
  marriageInfo: z.object({
    marriageDateAndPlace: z.string(),
    marriageDuration: z.string(),
    relationshipDescription: z.string(),
    conflictResolution: z.string(),
    mutualSupport: z.string(),
    bigDescisionsMakingExperience: z.string(),
    financialManagement: z.string(),
  }),
});

export const Step2Schema = z.object({
  existingChildren: z.array(
    z.object({
      fullName: z.string(),
      age: z.string(),
      sex: z.enum(["MALE", "FEMALE"]),
      relation: z.string(),
      educationOccupation: z.string(),
      maritalStatus: z.string(),
      address: z.string(),
    })
  ),
  householdMembers: z.array(
    z.object({
      fullName: z.string(),
      age: z.string(),
      sex: z.enum(["MALE", "FEMALE"]),
      relation: z.string(),
      educationAndOccupation: z.string(),
    })
  ),
  applicantParents: z.array(
    z.object({
      fullName: z.string(),
      age: z.string(),
      sex: z.enum(["MALE", "FEMALE"]),
      relation: z.string(),
      educationOccupation: z.string(),
      addressAndLivingCondition: z.string(),
    })
  ),
  familyBackground: z.object({
    fatherSide: z.object({
      parentsNames: z.string(),
      addressIfAlive: z.string(),
      birthOrder: z.string(),
      siblingsCount: z.string(),
      relationshipWithFamily: z.string(),
      childhoodFamilyOccupation: z.string(),
      childhoodExperience: z.string(),
      childhoodBehavior: z.string(),
      workExperience: z.string(),
      attitudeToWork: z.string(),
    }),
    motherSide: z.object({
      parentsNames: z.string(),
      addressIfAlive: z.string(),
      birthOrder: z.string(),
      siblingsCount: z.string(),
      relationshipWithFamily: z.string(),
      childhoodFamilyOccupation: z.string(),
      childhoodExperience: z.string(),
      childhoodBehavior: z.string(),
      workExperience: z.string(),
      attitudeToWork: z.string(),
    }),
    spouseEvaluationTogether: z.object({
      strengthAndWeaknesses: z.string(),
      relationShipWithChildren: z.string(),
      LifeGoalsAsGuardian: z.string(),
      spareTimeActivities: z.string(),
    }),
  }),
});

export const Step3Schema = z.object({
  lifeStyleAndSocialRelations: z.object({
    readinessForCare: z.string(),
    familyLawsAndRules: z.string(),
    dailyLifeRoutine: z.string(),
    familyWorkDistribution: z.string(),
    familyTime: z.string(),
    childLifeParticipation: z.string(),
    holidayTimeActivities: z.string(),
    socialLifeAttitude: z.string(),
    communityInvolvement: z.string(),
    changeAfterAdoption: z.string(),
  }),
  parentingExperience: z.object({
    hasExperience: z.boolean(),
    disciplineMethods: z.string(),
    goodMannersApproach: z.string(),
    improvementAreas: z.string(),
  }),
  adoptionInterest: z.object({
    meaningOfAdoption: z.string(),
    reasonForAdoption: z.string(),
    preferredChild: z.object({
      quantity: z.number(),
      sex: z.string(),
      ageRange: z.string(),
      healthCondition: z.string(),
      reasonForChoice: z.string(),
    }),
  }),
  existingChildrenAndFamilyMembers: z.object({
    name: z.string(),
    behavior: z.string(),
    adoptionAttitude: z.string(),
    futureAdoptionContributions: z.string(),
    mistakeAttitudesOfFamily: z.string(),
  }),
});


export const Step4Schema = z.object({
  incomeAndFinancialStatus: z.object({
    incomeSources: z.string(),
    incomeSupportSources: z.string(),
    incomeShortages: z.string(),
    incomeForExtraChild: z.string(),
  }),
  homeAndEnvironment: z.object({
    houseType: z.string(),
    ownershipStatus: z.string(),
    roomsAndSize: z.string(),
    livingDuration: z.string(),
    suitabilityForChild: z.string(),
    compoundCondition: z.string(),
    neighborhoodCondition: z.string(),
    communityAttitude: z.string(),
    serviceAccessibility: z.string(),
  }),
  healthAndLegal: z.object({
    currentHealthCondition: z.string(),
    medication: z.string(),
    healthConditionForFamilyResponsibility: z.string(),
    mentalHealthIssuesFromFamily: z.string(),
  }),
  criminalIssues: z.object({
    criminalRecord: z.string(),
    familyCriminalRecord: z.string(),
  }),
});

export const Step5Schema = z.object({
  witnesses: z.array(
    z.object({
      fullName: z.string(),
      relationToApplicants: z.string(),
      phoneNumber: z.string(),
    })
  ),
  socialWorkerEvaluation: z.object({
    comment: z.string(),
    preparedBy: z.string(),
    preparedDate: z.string(),
    approvedBy: z.string(),
    approvedDate: z.string(),
    signature: z.instanceof(File).refine((file) => file != null, {
      message: "please select social worker signature",
    }),
  }),
  adoptionApplicantFather: z.object({
    fullName: z.string(),
    date: z.string(),
    signature: z.instanceof(File).refine((file) => file != null, {
      message: "please select fathers signature",
    }),
  }),
  adoptionApplicantMother: z.object({
    fullName: z.string(),
    date: z.string(),
    signature: z.instanceof(File).refine((file) => file != null, {
      message: "please select mothers signature",
    }),
  }),
});

export type Step1SchemaType = z.infer<typeof Step1Schema>;
export type Step2SchemaType = z.infer<typeof Step2Schema>;
export type Step3SchemaType = z.infer<typeof Step3Schema>;
export type Step4SchemaType = z.infer<typeof Step4Schema>;
export type Step5SchemaType = z.infer<typeof Step5Schema>;