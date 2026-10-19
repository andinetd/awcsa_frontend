import { EdirCouncil } from "@/api/social-affairs/edir";

export function printCouncilDossier(council: EdirCouncil) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const memberCount = council._count?.memberEdirs ?? council.memberEdirs?.length ?? 0;

  const formattedDate = council.establishmentDate
    ? new Date(council.establishmentDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const memberRows = (council.memberEdirs || [])
    .map(
      (m, idx) => `
      <tr>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${idx + 1}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-weight: 600; font-size: 12px;">${m.name}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${m.registrationNumber || "—"}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px;">${m.subCity} ${m.woreda ? `· Woreda ${m.woreda}` : ""}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 11px; font-weight: 700; text-transform: uppercase;">${m.status}</td>
      </tr>
    `
    )
    .join("");

  const leadershipRows = (council.leadershipMembers || [])
    .map(
      (l, idx) => `
      <tr>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${idx + 2}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-weight: 600; font-size: 12px;">${l.fullName}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; font-weight: 700; color: #1769AA;">${l.role}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; font-weight: 600; color: #0F172A;">${l.representedEntity || "—"}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${l.phoneNumber || "—"}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; color: #475569;">${l.address || "—"}</td>
      </tr>
    `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Council Charter & Roster - ${council.name}</title>
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
      Print Council Charter (Ctrl + P)
    </button>
  </div>

  <div class="header">
    <div class="inst-title">Addis Ababa City Administration</div>
    <div class="sub-title">Bureau of Women and Social Affairs</div>
    <div class="inst-title">Federated Edir Councils Directorate</div>
    <div class="doc-title">Official Council Charter &amp; Affiliated Roster</div>
  </div>

  <div class="meta-grid">
    <div class="meta-box">
      <div class="meta-label">Council Name</div>
      <div class="meta-val">${council.name}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Charter Status</div>
      <div class="meta-val" style="color: #047857;">${council.status}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Registration / Accreditation Number</div>
      <div class="meta-val" style="font-family: monospace;">${council.registrationNumber || "—"}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Jurisdictional Level</div>
      <div class="meta-val">${council.level} (${council.subCity} ${council.woreda ? `· Woreda ${council.woreda}` : ""})</div>
    </div>
  </div>

  <div class="section-title">Council Leadership &amp; Executive Committee</div>
  <table>
    <thead>
      <tr>
        <th style="width: 40px;">#</th>
        <th>Full Name</th>
        <th>Executive Role</th>
        <th>Representing</th>
        <th>Phone Number</th>
        <th>Address / Location</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">1</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-weight: 700; font-size: 12px;">${council.chairpersonName || "—"}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; font-weight: 700; color: #0B1F3A;">CHAIRPERSON / PRESIDENT</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; color: #475569;">—</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${council.chairpersonPhone || "—"}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; color: #475569;">${council.address || "—"}</td>
      </tr>
      ${leadershipRows}
    </tbody>
  </table>

  <div class="section-title">Affiliated Member Edir Associations (${memberCount} Total)</div>
  ${
    memberCount > 0
      ? `
  <table>
    <thead>
      <tr>
        <th style="width: 40px;">#</th>
        <th>Edir Name</th>
        <th>Registration #</th>
        <th>Jurisdiction</th>
        <th>Accreditation</th>
      </tr>
    </thead>
    <tbody>
      ${memberRows}
    </tbody>
  </table>
  `
      : `<p style="font-size: 12px; color: #64748B; font-style: italic;">No member edirs affiliated yet.</p>`
  }

  <div class="footer-sign">
    <div>
      <div class="sign-line">Council Chairperson</div>
    </div>
    <div>
      <div class="sign-line">Secretary / Oversight Officer</div>
    </div>
    <div>
      <div class="sign-line">Bureau Accreditation Seal</div>
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
