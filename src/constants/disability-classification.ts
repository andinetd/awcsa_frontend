export type DisabilityCategoryKey =
  | "PHYSICAL"
  | "MENTAL_HEALTH"
  | "DEVELOPMENTAL"
  | "SENSORY"
  | "MULTIPLE"
  | "OTHER";

export interface DisabilitySubTypeOption {
  value: string;
  category: DisabilityCategoryKey;
  enLabel: string;
  amLabel: string;
}

export interface DisabilityCategoryOption {
  value: DisabilityCategoryKey;
  enLabel: string;
  amLabel: string;
}

export const DISABILITY_CATEGORIES: DisabilityCategoryOption[] = [
  { value: "PHYSICAL", enLabel: "Physical", amLabel: "አካላዊ" },
  { value: "MENTAL_HEALTH", enLabel: "Mental / Psychiatric", amLabel: "አዕምሮአዊ / ስነ-ልቦናዊ" },
  {
    value: "DEVELOPMENTAL",
    enLabel: "Intellectual & Developmental",
    amLabel: "የአዕምሮ ዕድገት ውስንነት",
  },
  { value: "SENSORY", enLabel: "Sensory", amLabel: "የስሜት ህዋሳዊ" },
  { value: "MULTIPLE", enLabel: "Multiple Disabilities", amLabel: "ባለብዙ / ጥምር ጉዳት" },
  { value: "OTHER", enLabel: "Other", amLabel: "ሌላ" },
];

export const DISABILITY_SUB_TYPES: DisabilitySubTypeOption[] = [
  // 1. Physical (አካላዊ)
  {
    value: "PHYSICAL_LEG",
    category: "PHYSICAL",
    enLabel: "Leg / Lower Limb Impairment",
    amLabel: "የእግር ጉዳት",
  },
  {
    value: "PHYSICAL_ARM",
    category: "PHYSICAL",
    enLabel: "Arm / Upper Limb Impairment",
    amLabel: "የእጅ ጉዳት",
  },
  {
    value: "PHYSICAL_SPINAL_WAIST",
    category: "PHYSICAL",
    enLabel: "Spinal / Waist Impairment",
    amLabel: "የወገብ / የጀርባ ጉዳት",
  },
  {
    value: "PHYSICAL_OTHER",
    category: "PHYSICAL",
    enLabel: "Other Physical Impairment",
    amLabel: "ሌላ አካላዊ ጉዳት",
  },

  // 2. Mental / Psychiatric (አዕምሮአዊ)
  {
    value: "MENTAL_ILLNESS",
    category: "MENTAL_HEALTH",
    enLabel: "Mental Illness",
    amLabel: "የአዕምሮ ህመም",
  },
  {
    value: "PSYCHOSOCIAL_CRISIS",
    category: "MENTAL_HEALTH",
    enLabel: "Psychosocial Crisis / Trauma",
    amLabel: "የስነ ልቦና ቀውስ",
  },
  {
    value: "MENTAL_OTHER",
    category: "MENTAL_HEALTH",
    enLabel: "Other Mental Health Condition",
    amLabel: "ሌላ ስነ-ልቦናዊ ጉዳት",
  },

  // 3. Intellectual & Developmental (የአዕምሮ ዕድገት ውስንነት)
  {
    value: "DOWN_SYNDROME",
    category: "DEVELOPMENTAL",
    enLabel: "Down Syndrome",
    amLabel: "ዳዎን ሲንድሮም",
  },
  {
    value: "AUTISM_SPECTRUM",
    category: "DEVELOPMENTAL",
    enLabel: "Autism Spectrum",
    amLabel: "ኦቲዝም (የኦቲዝም ስፔክትረም)",
  },
  {
    value: "AUTISM_CAREGIVER",
    category: "DEVELOPMENTAL",
    enLabel: "Autism Parent / Caregiver",
    amLabel: "የኦቲዝም ወላጅ / ተንከባካቢ",
  },
  {
    value: "COGNITIVE_MEMORY",
    category: "DEVELOPMENTAL",
    enLabel: "Memory / Cognitive Retention Impairment",
    amLabel: "የማስታወስ ውስንነት",
  },
  {
    value: "COMPREHENSION_LEARNING",
    category: "DEVELOPMENTAL",
    enLabel: "Comprehension / Learning Impairment",
    amLabel: "የመረዳት ውስንነት",
  },
  {
    value: "COMMUNICATION_SOCIAL",
    category: "DEVELOPMENTAL",
    enLabel: "Communication / Social Interaction Impairment",
    amLabel: "የመግባባት ውስንነት",
  },
  {
    value: "DEVELOPMENTAL_OTHER",
    category: "DEVELOPMENTAL",
    enLabel: "Other Developmental Condition",
    amLabel: "ሌላ የዕድገት ውስንነት",
  },

  // 4. Sensory (የስሜት ህዋሳዊ)
  {
    value: "VISUAL_BLINDNESS",
    category: "SENSORY",
    enLabel: "Visual Impairment / Blindness",
    amLabel: "ዓይነ ስውርነት / የማየት ጉዳት",
  },
  {
    value: "HEARING_DEAFNESS",
    category: "SENSORY",
    enLabel: "Hearing Impairment / Deafness",
    amLabel: "መስማት መሳን",
  },
  {
    value: "SPEECH_IMPAIRMENT",
    category: "SENSORY",
    enLabel: "Speech Impairment / Mutism",
    amLabel: "መናገር መሳን",
  },
  {
    value: "DEAF_BLINDNESS",
    category: "SENSORY",
    enLabel: "Deaf-Blindness",
    amLabel: "የማየትና የመስማት ጥምር ጉዳት",
  },
  {
    value: "SENSORY_OTHER",
    category: "SENSORY",
    enLabel: "Other Sensory Impairment",
    amLabel: "ሌላ የስሜት ህዋሳት ጉዳት",
  },

  // 5. Multiple (ባለብዙ ጉዳት)
  {
    value: "MULTIPLE_DISABILITIES",
    category: "MULTIPLE",
    enLabel: "Multiple Disabilities",
    amLabel: "ባለብዙ / ጥምር ጉዳት",
  },

  // 6. Other (ሌላ)
  {
    value: "OTHER_CONDITION",
    category: "OTHER",
    enLabel: "Other Condition",
    amLabel: "ሌላ ያልተጠቀሰ",
  },
];

/**
 * Given a sub-type code or legacy value, find its parent category.
 */
export function getCategoryForSubType(
  subType?: string | null,
): DisabilityCategoryKey | undefined {
  if (!subType) return undefined;

  const found = DISABILITY_SUB_TYPES.find((st) => st.value === subType);
  if (found) return found.category;

  // Legacy fallback heuristics
  const upper = subType.toUpperCase();
  if (
    upper.includes("LEG") ||
    upper.includes("ARM") ||
    upper.includes("SPIN") ||
    upper === "PHYSICAL"
  ) {
    return "PHYSICAL";
  }
  if (
    upper.includes("BLIND") ||
    upper.includes("VISUAL") ||
    upper.includes("HEAR") ||
    upper.includes("DEAF") ||
    upper.includes("SPEECH") ||
    upper === "SENSORY"
  ) {
    return "SENSORY";
  }
  if (
    upper.includes("AUTISM") ||
    upper.includes("DOWN") ||
    upper.includes("MEMORY") ||
    upper.includes("INTELLECTUAL")
  ) {
    return "DEVELOPMENTAL";
  }
  if (upper.includes("MENTAL") || upper.includes("PSYCH")) {
    return "MENTAL_HEALTH";
  }
  if (upper.includes("MULTI")) {
    return "MULTIPLE";
  }

  return undefined;
}

/**
 * Get all sub-types belonging to a category.
 */
export function getSubTypesForCategory(
  category?: DisabilityCategoryKey | null,
): DisabilitySubTypeOption[] {
  if (!category) return [];
  return DISABILITY_SUB_TYPES.filter((st) => st.category === category);
}

/**
 * Get user-facing display label for a given sub-type or category code.
 */
export function getDisabilityDisplayLabel(
  code?: string | null,
  locale: "am" | "en" = "am",
): string {
  if (!code) return "—";

  const subType = DISABILITY_SUB_TYPES.find((st) => st.value === code);
  if (subType) {
    return locale === "am" ? subType.amLabel : subType.enLabel;
  }

  const category = DISABILITY_CATEGORIES.find((cat) => cat.value === code);
  if (category) {
    return locale === "am" ? category.amLabel : category.enLabel;
  }

  return code;
}
