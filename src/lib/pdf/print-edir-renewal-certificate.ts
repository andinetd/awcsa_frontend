import { Edir } from "@/api/social-affairs/edir";

export interface PrintEdirCertificateOptions {
  officerName?: string;
  refNumber?: string;
  issueDate?: string;
}

export function printEdirRenewalCertificate(
  edir: Edir,
  options?: PrintEdirCertificateOptions
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const totalMembers =
    (edir.managementMale || 0) +
    (edir.managementFemale || 0) +
    (edir.generalMale || 0) +
    (edir.generalFemale || 0);

  const maleMembers =
    (edir.managementMale || 0) + (edir.generalMale || 0);
  const femaleMembers =
    (edir.managementFemale || 0) + (edir.generalFemale || 0);

  // Parse establishment year
  let establishmentYear = "—";
  if (edir.establishmentDate) {
    try {
      const d = new Date(edir.establishmentDate);
      establishmentYear = isNaN(d.getFullYear())
        ? edir.establishmentDate
        : String(d.getFullYear());
    } catch {
      establishmentYear = edir.establishmentDate;
    }
  }

  // Parse initial registration date components
  let regDay = "—";
  let regMonth = "—";
  let regYear = "—";
  if (edir.registrationDate) {
    try {
      const d = new Date(edir.registrationDate);
      if (!isNaN(d.getTime())) {
        regDay = String(d.getDate()).padStart(2, "0");
        regMonth = String(d.getMonth() + 1).padStart(2, "0");
        regYear = String(d.getFullYear());
      } else {
        regYear = edir.registrationDate;
      }
    } catch {
      regYear = edir.registrationDate;
    }
  }

  // Parse renewal date
  const rawRenewalDate =
    options?.issueDate ||
    edir.lastRenewedAt ||
    edir.certificateIssuedAt ||
    new Date().toISOString();

  let formattedRenewalDate = "—";
  try {
    const d = new Date(rawRenewalDate);
    formattedRenewalDate = isNaN(d.getTime())
      ? rawRenewalDate
      : d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
  } catch {
    formattedRenewalDate = rawRenewalDate;
  }

  const refNumber =
    options?.refNumber?.trim() ||
    edir.registrationNumber?.trim() ||
    "—";

  const officerName = options?.officerName?.trim() || "";

  const html = `
<!DOCTYPE html>
<html lang="am">
<head>
  <meta charset="utf-8" />
  <title>የእድሳት ምስክር ወረቀት - ${edir.name}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm 22mm 20mm 22mm;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Noto Sans Ethiopic', 'Nyala', 'Abyssinica SIL', 'Segoe UI', Tahoma, Arial, sans-serif;
      color: #000;
      margin: 0;
      padding: 10px 20px;
      line-height: 1.8;
      background: #fff;
      font-size: 15px;
    }

    .top-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 25px;
      font-size: 14px;
    }
    .meta-box {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .meta-line {
      display: inline-flex;
      align-items: baseline;
      gap: 4px;
    }
    .meta-label {
      font-weight: 700;
    }
    .meta-sub {
      font-size: 13px;
      color: #333;
      margin-left: 2px;
    }

    .directive-header {
      text-align: center;
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 15px;
      line-height: 1.5;
      padding: 0 10px;
    }

    .title-wrapper {
      text-align: center;
      margin: 20px 0 35px 0;
    }
    .cert-title {
      display: inline-block;
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 1px;
      border-bottom: 2px solid #000;
      padding-bottom: 4px;
    }

    .content-section {
      margin-bottom: 20px;
    }

    .row {
      margin-bottom: 14px;
      line-height: 2.2;
    }

    .dotted-fill {
      border-bottom: 1px dotted #000;
      display: inline-block;
      padding: 0 10px;
      font-weight: 700;
      text-align: center;
      min-height: 22px;
    }

    .point-1 {
      font-size: 16px;
      font-weight: 700;
    }

    .point-2 {
      font-size: 15px;
    }

    .point-3 {
      font-size: 15px;
      font-weight: 600;
      margin-top: 25px;
      margin-bottom: 30px;
      text-align: justify;
      line-height: 1.9;
    }

    .footer-section {
      margin-top: 35px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .signature-block {
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-size: 15px;
    }

    .sig-line {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .seal-box {
      width: 130px;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 2px;
      margin-right: 30px;
      margin-bottom: 10px;
    }

    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>

  <!-- Top Reference & Date Block -->
  <div class="top-meta">
    <div class="meta-box">
      <div class="meta-line">
        <span class="meta-label">ቁጥር</span>
        <span class="dotted-fill" style="min-width: 170px;">${refNumber}</span>
      </div>
      <span class="meta-sub">Ref</span>
    </div>

    <div class="meta-box">
      <div class="meta-line">
        <span class="meta-label">ቀን</span>
        <span class="dotted-fill" style="min-width: 170px;">${formattedRenewalDate}</span>
      </div>
      <span class="meta-sub">Date</span>
    </div>
  </div>

  <!-- Directive Subtitle -->
  <div class="directive-header">
    በእድሮች እና እድም ምክር ቤቶች የምዝገባ እና እድሳት መመሪያ ቁጥር 151/2016 መሰረት የተሰጠ
  </div>

  <!-- Certificate Title -->
  <div class="title-wrapper">
    <div class="cert-title">የምስክር ወረቀት</div>
  </div>

  <!-- Section 1: Edir Name -->
  <div class="row point-1">
    <span>1. የእድሩ ስም</span>
    <span class="dotted-fill" style="min-width: 380px; font-size: 17px;">${edir.name}</span>
  </div>

  <!-- Section 2: Details -->
  <div class="content-section point-2">
    <div class="row">
      <span>2. እድሩ የሚገኝበት ክ/ከተማ</span>
      <span class="dotted-fill" style="min-width: 150px;">${edir.subCity || "—"}</span>
      <span>ወረዳ</span>
      <span class="dotted-fill" style="min-width: 90px;">${edir.woreda || "—"}</span>
      <span>የቤት ቁጥር</span>
      <span class="dotted-fill" style="min-width: 90px;">${edir.houseNumber || "—"}</span>
    </div>

    <div class="row">
      <span>የአባላት ብዛት</span>
      <span class="dotted-fill" style="min-width: 90px;">${totalMembers}</span>
      <span>ወንድ</span>
      <span class="dotted-fill" style="min-width: 80px;">${maleMembers}</span>
      <span>ሴት</span>
      <span class="dotted-fill" style="min-width: 80px;">${femaleMembers}</span>
    </div>

    <div class="row">
      <span>እድሩ የተቋቋመበት ዓ.ም.</span>
      <span class="dotted-fill" style="min-width: 320px;">${establishmentYear}</span>
    </div>

    <div class="row">
      <span>እድሩ መጀመሪያ የተመዘገበበት ቀን.</span>
      <span class="dotted-fill" style="min-width: 60px;">${regDay}</span>
      <span>ወር</span>
      <span class="dotted-fill" style="min-width: 70px;">${regMonth}</span>
      <span>ዓ.ም.</span>
      <span class="dotted-fill" style="min-width: 90px;">${regYear}</span>
    </div>

    <div class="row">
      <span>እድሩ እድሳት ያደረገበት ቀን</span>
      <span class="dotted-fill" style="min-width: 310px;">${formattedRenewalDate}</span>
    </div>
  </div>

  <!-- Section 3: Directive Article 7 compliance -->
  <div class="point-3">
    3. እድሩ በመመሪያ ቁጥር 151/2016 አንቀጽ 7 መሰረት ያሉ መስፈርቶችን አሟልቶ በመገኘቱ ይህ የምስክር ወረቀት ተሰጥቶታል።
  </div>

  <!-- Footer Sign-Off Block -->
  <div class="footer-section">
    <div class="signature-block">
      <div class="sig-line">
        <span style="font-weight: 700;">እድሳቱን የሰጠው ባለሙያ ስም</span>
        <span class="dotted-fill" style="min-width: 220px;">${officerName}</span>
      </div>
      <div class="sig-line">
        <span style="font-weight: 700;">ፊርማ</span>
        <span class="dotted-fill" style="min-width: 220px;">&nbsp;</span>
      </div>
      <div class="sig-line">
        <span style="font-weight: 700;">ቀን</span>
        <span class="dotted-fill" style="min-width: 220px;">${formattedRenewalDate}</span>
      </div>
    </div>

    <div class="seal-box">
      ማህተም
    </div>
  </div>

  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 350);
    });
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
