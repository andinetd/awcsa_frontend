import { Beneficiary as BeneficiaryV2 } from "@/api/beneficiaries/types-v2";

export function printBeneficiaryDossier(beneficiary: BeneficiaryV2 | any) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const fullName = `${beneficiary.firstName || ""} ${beneficiary.lastName || ""} ${beneficiary.grandfatherName || ""}`.trim() || "—";
  const categoryLabel = beneficiary.clientCategory === "DISABLED" ? "Person with Disability" : "Elderly Citizen";
  const disabilityType = beneficiary.DisabilityProfile?.disabilityType || beneficiary.disabilityType || "—";
  const disabilitySeverity = beneficiary.DisabilityProfile?.disabilitySeverity || beneficiary.disabilitySeverity || "—";
  const cause = beneficiary.DisabilityProfile?.cause || beneficiary.cause || "—";
  const faydaId = beneficiary.faydaId || "—";
  const cityId = beneficiary.cityIdNumber || beneficiary.cityId || "—";
  const phone = beneficiary.phoneNumber || "—";
  const subCity = beneficiary.subCity || "—";
  const woreda = beneficiary.woreda || "—";
  const zone = beneficiary.zone || "—";
  const houseNumber = beneficiary.houseNumber || "—";
  const education = beneficiary.educationLevel || "—";
  const employment = beneficiary.employmentStatus || "—";
  const marital = beneficiary.maritalStatus || "—";
  const workplace = beneficiary.ElderlyProfile?.workplaceCondition || beneficiary.workplaceCondition || "—";
  const supportConfirmed = (beneficiary.DisabilityProfile?.supportConfirmed || beneficiary.ElderlyProfile?.supportConfirmed || beneficiary.supportConfirmed) ? "CONFIRMED & AUDITED" : "PENDING VERIFICATION";

  const trainings = [
    beneficiary.preferredTraining1,
    beneficiary.preferredTraining2,
    beneficiary.preferredTraining3,
  ].filter(Boolean);

  const trainingStr = trainings.length > 0 ? trainings.join(", ") : "None Specified";

  const todayStr = new Date().toLocaleDateString("en-US", {
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
    <div class="doc-title">Disability & Elderly Social Protection Dossier</div>
  </div>

  <div class="badge-bar">
    <div><strong>CATEGORY:</strong> ${categoryLabel.toUpperCase()}</div>
    <div><strong>FAYDA ID:</strong> <span class="mono">${faydaId}</span></div>
    <div><strong>CITY ID:</strong> <span class="mono">${cityId}</span></div>
    <div class="status-badge">${supportConfirmed}</div>
  </div>

  <div class="section">
    <div class="section-title">1. Beneficiary Demographics & Identity</div>
    <div class="grid">
      <div class="field">
        <span class="label">Full Legal Name</span>
        <span class="value">${fullName}</span>
      </div>
      <div class="field">
        <span class="label">Phone Number</span>
        <span class="value mono">${phone}</span>
      </div>
      <div class="field">
        <span class="label">Sex & Age</span>
        <span class="value">${beneficiary.sex || "—"} / ${beneficiary.age != null ? `${beneficiary.age} years` : "—"}</span>
      </div>
      <div class="field">
        <span class="label">Marital Status</span>
        <span class="value">${marital}</span>
      </div>
      <div class="field">
        <span class="label">Education Level</span>
        <span class="value">${education}</span>
      </div>
      <div class="field">
        <span class="label">Employment Status</span>
        <span class="value">${employment}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">2. Residence & Municipal Jurisdiction</div>
    <div class="grid">
      <div class="field">
        <span class="label">Sub-City</span>
        <span class="value">${subCity}</span>
      </div>
      <div class="field">
        <span class="label">Woreda</span>
        <span class="value">${woreda}</span>
      </div>
      <div class="field">
        <span class="label">Zone / Block</span>
        <span class="value">${zone} / ${beneficiary.block || "—"}</span>
      </div>
      <div class="field">
        <span class="label">House Number</span>
        <span class="value">${houseNumber}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">3. Vulnerability & Disability Assessment</div>
    <div class="grid">
      <div class="field">
        <span class="label">Primary Disability Type</span>
        <span class="value">${disabilityType}</span>
      </div>
      <div class="field">
        <span class="label">Severity Level</span>
        <span class="value">${disabilitySeverity}</span>
      </div>
      <div class="field">
        <span class="label">Cause / Etiology</span>
        <span class="value">${cause}</span>
      </div>
      <div class="field">
        <span class="label">Workplace Condition</span>
        <span class="value">${workplace}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">4. Support Services & Economic Reintegration</div>
    <div class="grid">
      <div class="field">
        <span class="label">Required Support Type</span>
        <span class="value">${beneficiary.requiredSupportType || beneficiary.DisabilityProfile?.requiredSupportType || "—"}</span>
      </div>
      <div class="field">
        <span class="label">Required Assistive Device</span>
        <span class="value">${beneficiary.requiredAssistiveDevice || "—"}</span>
      </div>
      <div class="field" style="grid-column: span 2;">
        <span class="label">Vocational Training Preferences</span>
        <span class="value">${trainingStr}</span>
      </div>
      <div class="field" style="grid-column: span 2;">
        <span class="label">Previous Support Record</span>
        <span class="value">${beneficiary.previousSupport || "None recorded"}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>
      <div style="font-weight: 600; color: #0B1F3A;">Official Municipal Attestation</div>
      <div style="color: #64748B; font-size: 10px; margin-top: 2px;">Generated on ${todayStr} via AAC-WCSA Portal</div>
    </div>
    <div class="sig-box">
      Case Officer / Social Worker Signature
    </div>
    <div class="sig-box">
      Bureau Seal / Authorized Stamp
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
