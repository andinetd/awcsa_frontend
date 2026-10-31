import { Beneficiary as BeneficiaryV2 } from "@/api/beneficiaries/types-v2";
import {
  getDisabilityDisplayLabel,
  getCategoryForSubType,
} from "@/constants/disability-classification";
import { getWorkSectorDisplayLabel } from "@/constants/work-sectors";
import {
  translateSubCity,
  formatWoreda,
  translateSex,
  translateMaritalStatus,
  translateEducation,
  translateEmployment,
} from "@/lib/pdf/translations";

export function printBeneficiaryDossier(
  beneficiary: BeneficiaryV2 | any,
  lang: "en" | "am" = "en"
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const isAm = lang === "am";
  const fullName = `${beneficiary.firstName || ""} ${beneficiary.lastName || ""} ${beneficiary.grandfatherName || ""}`.trim() || "—";
  const rawDisabilityType = beneficiary.DisabilityProfile?.disabilityType || beneficiary.disabilityType;
  const isCaregiver = rawDisabilityType === "AUTISM_CAREGIVER";
  const categoryLabel = isAm
    ? beneficiary.clientCategory === "DISABLED"
      ? (isCaregiver ? "የኦቲዝም ወላጅ / ተንከባካቢ" : "አካል ጉዳተኛ ዜጋ")
      : "አረጋዊ ዜጋ"
    : beneficiary.clientCategory === "DISABLED"
      ? (isCaregiver ? "Autism Caregiver / የኦቲዝም ወላጅ" : "Person with Disability")
      : "Elderly Citizen";

  const categoryKey = getCategoryForSubType(rawDisabilityType);
  const disabilityCategoryStr = categoryKey
    ? isAm
      ? getDisabilityDisplayLabel(categoryKey, "am")
      : `${getDisabilityDisplayLabel(categoryKey, "en")} / ${getDisabilityDisplayLabel(categoryKey, "am")}`
    : "—";
  const disabilityType = rawDisabilityType
    ? isAm
      ? getDisabilityDisplayLabel(rawDisabilityType, "am")
      : `${getDisabilityDisplayLabel(rawDisabilityType, "en")} / ${getDisabilityDisplayLabel(rawDisabilityType, "am")}`
    : "—";
  const disabilitySeverity = beneficiary.DisabilityProfile?.disabilitySeverity || beneficiary.disabilitySeverity || "—";
  const cause = beneficiary.DisabilityProfile?.cause || beneficiary.cause || "—";
  const faydaId = beneficiary.faydaId || "—";
  const cityId = beneficiary.cityIdNumber || beneficiary.cityId || "—";
  const phone = beneficiary.phoneNumber || "—";
  const subCity = isAm ? translateSubCity(beneficiary.subCity, true) : (beneficiary.subCity || "—");
  const woreda = isAm ? formatWoreda(beneficiary.woreda, true) : (beneficiary.woreda ? formatWoreda(beneficiary.woreda, false) : "—");
  const zone = beneficiary.zone || "—";
  const houseNumber = beneficiary.houseNumber || "—";
  const education = isAm ? translateEducation(beneficiary.educationLevel, true) : (beneficiary.educationLevel || "—");
  const employment = isAm ? translateEmployment(beneficiary.employmentStatus, true) : (beneficiary.employmentStatus || "—");
  const marital = isAm ? translateMaritalStatus(beneficiary.maritalStatus, true) : (beneficiary.maritalStatus || "—");
  const sex = isAm ? translateSex(beneficiary.sex, true) : (beneficiary.sex || "—");
  const workplace = beneficiary.ElderlyProfile?.workplaceCondition || beneficiary.workplaceCondition || "—";
  const isConfirmed = Boolean(beneficiary.DisabilityProfile?.supportConfirmed || beneficiary.ElderlyProfile?.supportConfirmed || beneficiary.supportConfirmed);
  const supportConfirmed = isAm
    ? (isConfirmed ? "የተረጋገጠና የተመረመረ" : "ማረጋገጫ በመጠባበቅ ላይ")
    : (isConfirmed ? "CONFIRMED & AUDITED" : "PENDING VERIFICATION");
  const previousProfession =
    beneficiary.DisabilityProfile?.previousProfession ||
    beneficiary.ElderlyProfile?.previousProfession ||
    beneficiary.previousProfession ||
    "—";
  const isElderly = beneficiary.clientCategory === "ELDERLY" || Boolean(beneficiary.ElderlyProfile);

  const trainings = [
    beneficiary.preferredTraining1,
    beneficiary.preferredTraining2,
    beneficiary.preferredTraining3,
  ]
    .filter(Boolean)
    .map((t: string) =>
      isAm
        ? getWorkSectorDisplayLabel(t, "am")
        : `${getWorkSectorDisplayLabel(t, "am")} (${getWorkSectorDisplayLabel(t, "en")})`
    );

  const trainingStr = trainings.length > 0 ? trainings.join(", ") : (isAm ? "አልተገለጸም" : "None Specified / አልተገለጸም");

  const todayStr = new Date().toLocaleDateString(isAm ? "am-ET" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Beneficiary Dossier - ${fullName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 16mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0F172A;
      margin: 0;
      padding: 16px;
      line-height: 1.4;
      background: #fff;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0B1F3A;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .inst-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #1769AA;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .amharic-title {
      font-size: 13px;
      font-weight: 700;
      color: #0B1F3A;
      margin-bottom: 4px;
    }
    .doc-title {
      font-size: 16px;
      font-weight: 800;
      color: #0B1F3A;
      text-transform: uppercase;
      margin-top: 6px;
      letter-spacing: 0.5px;
    }
    .badge-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 8px 12px;
      margin-bottom: 16px;
      font-family: monospace;
      font-size: 11px;
    }
    .status-badge {
      font-weight: bold;
      color: #0B1F3A;
      background: #E0F2FE;
      padding: 3px 8px;
      border-radius: 2px;
      border: 1px solid #BAE6FD;
    }
    .section {
      margin-bottom: 14px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #1E293B;
      background: #F1F5F9;
      padding: 4px 8px;
      border-left: 3px solid #1769AA;
      margin-bottom: 8px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px 16px;
      padding: 0 4px;
    }
    .field {
      display: flex;
      flex-direction: column;
    }
    .label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 600;
      color: #64748B;
      margin-bottom: 2px;
    }
    .value {
      font-size: 12px;
      font-weight: 600;
      color: #0F172A;
    }
    .mono {
      font-family: monospace;
    }
    .footer {
      margin-top: 24px;
      padding-top: 14px;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 11px;
    }
    .sig-box {
      width: 180px;
      border-top: 1px dashed #64748B;
      padding-top: 4px;
      text-align: center;
      font-size: 10px;
      color: #64748B;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="inst-title">Addis Ababa City Administration Women, Children & Social Affairs Bureau</div>
    <div class="amharic-title">የአዲስ አበባ ከተማ አስተዳደር ሴቶች፣ ሕፃናት እና ማህበራዊ ጉዳይ ቢሮ</div>
    <div class="doc-title">${isAm ? "የአካል ጉዳተኞችና አረጋውያን ማህበራዊ ጥበቃ ዶሲዬ" : "Disability & Elderly Social Protection Dossier"}</div>
  </div>

  <div class="badge-bar">
    <div><strong>${isAm ? "ምድብ:" : "CATEGORY:"}</strong> ${categoryLabel.toUpperCase()}</div>
    <div><strong>${isAm ? "የፋይዳ ቁጥር:" : "FAYDA ID:"}</strong> <span class="mono">${faydaId}</span></div>
    <div><strong>${isAm ? "የከተማ መታወቂያ:" : "CITY ID:"}</strong> <span class="mono">${cityId}</span></div>
    <div class="status-badge">${supportConfirmed}</div>
  </div>

  <div class="section">
    <div class="section-title">${isAm ? "1. የተጠቃሚው አጠቃላይና የግል መረጃ" : "1. Beneficiary Demographics & Identity"}</div>
    <div class="grid">
      <div class="field">
        <span class="label">${isAm ? "ሙሉ ህጋዊ ስም" : "Full Legal Name"}</span>
        <span class="value">${fullName}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? "ስልክ ቁጥር" : "Phone Number"}</span>
        <span class="value mono">${phone}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? "ጾታና ዕድሜ" : "Sex & Age"}</span>
        <span class="value">${sex} / ${beneficiary.age != null ? (isAm ? `${beneficiary.age} ዓመት` : `${beneficiary.age} years`) : "—"}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? "የጋብቻ ሁኔታ" : "Marital Status"}</span>
        <span class="value">${marital}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? "የትምህርት ደረጃ" : "Education Level"}</span>
        <span class="value">${education}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? "የሥራ ሁኔታ" : "Employment Status"}</span>
        <span class="value">${employment}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">${isAm ? "2. የመኖሪያ አድራሻና ማዘጋጃ ቤታዊ ክልል" : "2. Residence & Municipal Jurisdiction"}</div>
    <div class="grid">
      <div class="field">
        <span class="label">${isAm ? "ክፍለ ከተማ" : "Sub-City"}</span>
        <span class="value">${subCity}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? "ወረዳ" : "Woreda"}</span>
        <span class="value">${woreda}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? "ዞን / ብሎክ" : "Zone / Block"}</span>
        <span class="value">${zone} / ${beneficiary.block || "—"}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? "የቤት ቁጥር" : "House Number"}</span>
        <span class="value">${houseNumber}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">${isAm ? (isCaregiver ? "3. የተንከባካቢና የልጁ መረጃ" : "3. የተጋላጭነትና የአካል ጉዳት ምዘና") : (isCaregiver ? "3. Caregiver & Dependent Child Assessment (የተንከባካቢና የልጁ መረጃ)" : "3. Vulnerability & Disability Assessment")}</div>
    <div class="grid">
      <div class="field">
        <span class="label">${isAm ? (isCaregiver ? "የተንከባካቢ ምድብ" : "የአካል ጉዳት ምድብ") : (isCaregiver ? "Caregiver Category" : "Disability Category")}</span>
        <span class="value">${disabilityCategoryStr}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? (isCaregiver ? "የተንከባካቢ ሚና" : "ዝርዝር ሁኔታ / ዓይነት") : (isCaregiver ? "Registered Caregiver Role" : "Specific Condition / Type")}</span>
        <span class="value">${disabilityType}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? (isCaregiver ? "የልጁ ኦቲዝም ደረጃ" : "የጉዳት መጠን / ደረጃ") : (isCaregiver ? "Child's Autism Severity / Level" : "Severity Level")}</span>
        <span class="value">${disabilitySeverity}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? (isCaregiver ? "የህክምና ምርመራ ውጤት" : "መንስኤ / ምክንያት") : (isCaregiver ? "Child Diagnosis & Medical History" : "Cause / Etiology")}</span>
        <span class="value">${cause}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? (isCaregiver ? "ሙሉ ጊዜ እንክብካቤ ይፈልጋል" : "የሥራ ቦታ ሁኔታ") : (isCaregiver ? "Full-Time / Constant Care Needed" : "Workplace Condition")}</span>
        <span class="value">${isCaregiver ? ((beneficiary.DisabilityProfile?.requiresPhysicalAssistance ?? beneficiary.requiresPhysicalAssistance) ? (isAm ? "አዎ (ሙሉ ጊዜ እንክብካቤ ይፈልጋል)" : "Yes (ሙሉ ጊዜ እንክብካቤ ይፈልጋል)") : (isAm ? "አይደለም" : "No")) : workplace}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">${isAm ? "4. የድጋፍ አገልግሎቶችና የኢኮኖሚ መልሶ ማቋቋም" : "4. Support Services & Economic Reintegration"}</div>
    <div class="grid">
      <div class="field">
        <span class="label">${isAm ? "የሚፈለግ የድጋፍ ዓይነት" : "Required Support Type"}</span>
        <span class="value">${beneficiary.requiredSupportType || beneficiary.DisabilityProfile?.requiredSupportType || "—"}</span>
      </div>
      <div class="field">
        <span class="label">${isAm ? "የሚፈለግ አጋዥ መሣሪያ" : "Required Assistive Device"}</span>
        <span class="value">${beneficiary.requiredAssistiveDevice || "—"}</span>
      </div>
      <div class="field" style="grid-column: span 2;">
        <span class="label">${isAm ? "የሚፈልጉት የሥራ / ሥልጠና ዘርፍ" : "Desired Work / Training Sectors (የሚፈልጉት የስራ ዘርፍ)"}</span>
        <span class="value">${trainingStr}</span>
      </div>
      <div class="field" style="grid-column: span 2;">
        <span class="label">${isAm ? (isElderly ? "ያካበቱት ሙያና ለትውልድ የሚተላለፍ ተሞክሮ" : "ያካበቱት / የቀድሞ ሙያ") : (isElderly ? "Lifetime Profession & Knowledge Sharing (ያካበቱት ሙያና ለትውልድ የሚተላለፍ ተሞክሮ)" : "Prior Profession / Acquired Skills (ያካበቱት / የቀድሞ ሙያ)")}</span>
        <span class="value">${previousProfession}</span>
      </div>
      <div class="field" style="grid-column: span 2;">
        <span class="label">${isAm ? "የቀድሞ የድጋፍ ታሪክ" : "Previous Support Record"}</span>
        <span class="value">${beneficiary.previousSupport || (isAm ? "የለም" : "None recorded")}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>
      <div style="font-weight: 600; color: #0B1F3A;">${isAm ? "ይፋዊ የማዘጋጃ ቤት ማረጋገጫ" : "Official Municipal Attestation"}</div>
      <div style="color: #64748B; font-size: 10px; margin-top: 2px;">${isAm ? `የተዘጋጀበት ቀን፡ ${todayStr} በቢሮው ፖርታል` : `Generated on ${todayStr} via AAC-WCSA Portal`}</div>
    </div>
    <div class="sig-box">
      ${isAm ? "የባለሙያ / የማህበራዊ ሰራተኛ ፊርማ" : "Case Officer / Social Worker Signature"}
    </div>
    <div class="sig-box">
      ${isAm ? "የቢሮው ማህተም" : "Bureau Seal / Authorized Stamp"}
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
