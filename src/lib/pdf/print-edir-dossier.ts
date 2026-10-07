import { Edir } from "@/api/social-affairs/edir";

export function printEdirDossier(edir: Edir) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const totalMembers =
    (edir.managementMale || 0) +
    (edir.managementFemale || 0) +
    (edir.generalMale || 0) +
    (edir.generalFemale || 0);

  const formattedDate = edir.establishmentDate
    ? new Date(edir.establishmentDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const regDate = edir.registrationDate
    ? new Date(edir.registrationDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const certDate = edir.certificateIssuedAt
    ? new Date(edir.certificateIssuedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const foundingRows = (edir.foundingMembers || [])
    .map(
      (m, idx) => `
      <tr>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${idx + 1}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-weight: 600; font-size: 12px;">${m.fullName}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; color: #475569;">${m.address || "—"}</td>
      </tr>
    `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Edir Official Record - ${edir.name}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0F172A;
      margin: 0;
      padding: 20px;
      line-height: 1.4;
      background: #fff;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0B1F3A;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .inst-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #1769AA;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .sub-title {
      font-size: 13px;
      font-weight: 700;
      color: #0B1F3A;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .doc-title {
      font-size: 18px;
      font-weight: 800;
      color: #0B1F3A;
      text-transform: uppercase;
      margin-top: 8px;
      letter-spacing: 1px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }
    .meta-box {
      border: 1px solid #E2E8F0;
      padding: 10px 14px;
      border-radius: 2px;
      background: #F8FAFC;
    }
    .meta-label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 0.5px;
    }
    .meta-val {
      font-size: 13px;
      font-weight: 700;
      color: #0F172A;
      margin-top: 2px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0B1F3A;
      border-bottom: 1px solid #CBD5E1;
      padding-bottom: 4px;
      margin-top: 18px;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
    }
    th {
      background: #F1F5F9;
      padding: 6px 10px;
      text-align: left;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 700;
      color: #475569;
      border: 1px solid #CBD5E1;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 2px;
      font-size: 10px;
      font-weight: 700;
      border: 1px solid #CBD5E1;
      text-transform: uppercase;
    }
    .badge-active { background: #ECFDF5; color: #047857; border-color: #A7F3D0; }
    .badge-expired { background: #FFFBEB; color: #B45309; border-color: #FDE68A; }
    .footer-sign {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px dashed #CBD5E1;
      text-align: center;
    }
    .sign-line {
      border-top: 1px solid #0F172A;
      margin-top: 40px;
      padding-top: 4px;
      font-size: 11px;
      font-weight: 600;
      color: #334155;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 16px; text-align: right;">
    <button onclick="window.print()" style="padding: 8px 16px; background: #1769AA; color: #fff; border: none; font-weight: 600; border-radius: 2px; cursor: pointer;">
      Print Document (Ctrl + P)
    </button>
  </div>

  <div class="header">
    <div class="inst-title">Addis Ababa City Administration</div>
    <div class="sub-title">Bureau of Women and Social Affairs</div>
    <div class="inst-title">Traditional Edir &amp; Community Associations Directorate</div>
    <div class="doc-title">Official Association Dossier &amp; Registry</div>
  </div>

  <div class="meta-grid">
    <div class="meta-box">
      <div class="meta-label">Association Full Name</div>
      <div class="meta-val">${edir.name}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Accreditation Status</div>
      <div class="meta-val">
        <span class="badge ${edir.status === "ACTIVE" ? "badge-active" : "badge-expired"}">
          ${edir.status || "PENDING"}
        </span>
      </div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Registration / Certificate ID</div>
      <div class="meta-val" style="font-family: monospace;">${edir.registrationNumber || "—"}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Registration Level</div>
      <div class="meta-val">${edir.registerLevel || "WOREDA"}</div>
    </div>
  </div>

  <div class="section-title">Jurisdiction &amp; Municipal Location</div>
  <div class="meta-grid">
    <div class="meta-box">
      <div class="meta-label">Sub-City &amp; Woreda</div>
      <div class="meta-val">${edir.subCity} · Woreda ${edir.woreda} ${edir.kebele ? `· Kebele ${edir.kebele}` : ""}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">House &amp; Specific Location</div>
      <div class="meta-val">House #${edir.houseNumber || "—"} · ${edir.specificLocation || "—"}</div>
    </div>
  </div>

  <div class="section-title">Membership &amp; Financial Governance</div>
  <table>
    <thead>
      <tr>
        <th>Total Declared Census</th>
        <th>Management (Male)</th>
        <th>Management (Female)</th>
        <th>General (Male)</th>
        <th>General (Female)</th>
        <th>Bank Account</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px 10px; border: 1px solid #CBD5E1; font-weight: 800; font-size: 14px; color: #0B1F3A;">${totalMembers}</td>
        <td style="padding: 8px 10px; border: 1px solid #CBD5E1; font-weight: 600;">${edir.managementMale || 0}</td>
        <td style="padding: 8px 10px; border: 1px solid #CBD5E1; font-weight: 600;">${edir.managementFemale || 0}</td>
        <td style="padding: 8px 10px; border: 1px solid #CBD5E1; font-weight: 600;">${edir.generalMale || 0}</td>
        <td style="padding: 8px 10px; border: 1px solid #CBD5E1; font-weight: 600;">${edir.generalFemale || 0}</td>
        <td style="padding: 8px 10px; border: 1px solid #CBD5E1; font-family: monospace;">${edir.bankAccountNumber || "—"}</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">Statutory Legal Accreditation Dates</div>
  <div class="meta-grid">
    <div class="meta-box">
      <div class="meta-label">Established On</div>
      <div class="meta-val">${formattedDate}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Registered On</div>
      <div class="meta-val">${regDate}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Certificate Issued Date</div>
      <div class="meta-val">${certDate}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Renewed for Fiscal Year</div>
      <div class="meta-val">${edir.renewedForYear ? `Year ${edir.renewedForYear}` : "Not Renewed"}</div>
    </div>
  </div>

  ${
    edir.foundingMembers && edir.foundingMembers.length > 0
      ? `
  <div class="section-title">Founding Members Roster (Article 7.a)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 40px;">#</th>
        <th>Full Name</th>
        <th>Address / Kebele</th>
      </tr>
    </thead>
    <tbody>
      ${foundingRows}
    </tbody>
  </table>
  `
      : ""
  }

  <div class="footer-sign">
    <div>
      <div class="sign-line">Edir Chairperson Signature &amp; Stamp</div>
    </div>
    <div>
      <div class="sign-line">Woreda Social Affairs Officer</div>
    </div>
    <div>
      <div class="sign-line">Municipal Registrar Approval</div>
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
