import { EdirCouncil } from "@/api/social-affairs/edir";
import {
  translateSubCity,
  formatWoreda,
  translateLevel,
  translateStatus,
  translateRole,
} from "./translations";

export function printCouncilDossier(council: EdirCouncil, lang: "en" | "am" = "en") {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const isAm = lang === "am";
  const memberCount = council._count?.memberEdirs ?? council.memberEdirs?.length ?? 0;

  const formatDate = (dateStr?: string | Date | null) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "—";
      return isAm
        ? d.toLocaleDateString("am-ET", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
    } catch {
      return String(dateStr);
    }
  };

  const statusLabel = (status?: string) => {
    return translateStatus(status, isAm);
  };

  const levelLabel = (level?: string) => {
    return translateLevel(level, isAm);
  };

  const memberRows = (council.memberEdirs || [])
    .map(
      (m, idx) => `
      <tr>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${idx + 1}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-weight: 600; font-size: 12px;">${m.name}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${m.registrationNumber || "—"}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px;">${m.subCity ? `${translateSubCity(m.subCity, isAm)}${isAm ? " ክ/ከተማ" : " Sub-City"}` : ""} ${m.woreda ? `· ${formatWoreda(m.woreda, isAm)}` : ""}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 11px; font-weight: 700; text-transform: uppercase;">${statusLabel(m.status)}</td>
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
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; font-weight: 700; color: #1769AA;">${translateRole(l.role, isAm)}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; font-weight: 600; color: #0F172A;">${l.representedEntity || "—"}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${l.phoneNumber || "—"}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; color: #475569;">${l.address || "—"}</td>
      </tr>
    `
    )
    .join("");

  const labels = isAm
    ? {
        pageTitle: `የምክር ቤት ቻርተርና መዝገብ - ${council.name}`,
        printBtn: "ቻርተሩን አትም (Ctrl + P)",
        instTitle1: "የአዲስ አበባ ከተማ አስተዳደር",
        instTitle2: "የሴቶችና ማኅበራዊ ጉዳይ ቢሮ",
        instTitle3: "የባህላዊ ዕድርና ማኅበረሰብ ማኅበራት ዳይሬክቶሬት",
        docTitle: "ይፋዊ የዕድሮች የጋራ ምክር ቤት ቻርተርና መዝገብ",
        councilName: "የምክር ቤቱ ስም",
        charterStatus: "የቻርተሩ ሁኔታ",
        regNumber: "የምዝገባ / ዕውቅና ቁጥር",
        jurisdiction: "የአስተዳደር እርከን",
        jurisdictionVal: `${levelLabel(council.level)} (${council.subCity ? `${translateSubCity(council.subCity, true)} ክ/ከተማ` : ""} ${council.woreda ? `· ${formatWoreda(council.woreda, true)}` : ""})`,
        secLeadership: "የምክር ቤቱ አመራር እና ሥራ አስፈጻሚ ኮሚቴ",
        roleChair: "ሰብሳቢ / ፕሬዚዳንት",
        thNo: "ተ.ቁ",
        thFullName: "ሙሉ ስም",
        thRole: "የሥራ ኃላፊነት",
        thRepresenting: "የወከለው አካል",
        thPhone: "ስልክ ቁጥር",
        thAddress: "አድራሻ / ቦታ",
        secMembers: `አባል የሆኑ የዕድር ማኅበራት (በድምሩ ${memberCount})`,
        thEdirName: "የዕድሩ ስም",
        thRegNo: "የምዝገባ ቁ.",
        thJurisdiction: "የአስተዳደር ወሰን",
        thAccreditation: "የዕውቅና ሁኔታ",
        noMembers: "እስካሁን የተካተቱ አባል ዕድሮች የሉም።",
        signChair: "የምክር ቤቱ ሰብሳቢ",
        signSecretary: "ጸሐፊ / የክትትል ኃላፊ",
        signSeal: "የቢሮው ይፋዊ ማህተም",
      }
    : {
        pageTitle: `Council Charter & Roster - ${council.name}`,
        printBtn: "Print Council Charter (Ctrl + P)",
        instTitle1: "Addis Ababa City Administration",
        instTitle2: "Bureau of Women and Social Affairs",
        instTitle3: "Federated Edir Councils Directorate",
        docTitle: "Official Council Charter & Affiliated Roster",
        councilName: "Council Name",
        charterStatus: "Charter Status",
        regNumber: "Registration / Accreditation Number",
        jurisdiction: "Jurisdictional Level",
        jurisdictionVal: `${council.level} (${council.subCity ? `${council.subCity} Sub-City` : ""} ${council.woreda ? `· ${formatWoreda(council.woreda, false)}` : ""})`,
        secLeadership: "Council Leadership & Executive Committee",
        roleChair: "CHAIRPERSON / PRESIDENT",
        thNo: "#",
        thFullName: "Full Name",
        thRole: "Executive Role",
        thRepresenting: "Representing",
        thPhone: "Phone Number",
        thAddress: "Address / Location",
        secMembers: `Affiliated Member Edir Associations (${memberCount} Total)`,
        thEdirName: "Edir Name",
        thRegNo: "Registration #",
        thJurisdiction: "Jurisdiction",
        thAccreditation: "Accreditation",
        noMembers: "No member edirs affiliated yet.",
        signChair: "Council Chairperson",
        signSecretary: "Secretary / Oversight Officer",
        signSeal: "Bureau Accreditation Seal",
      };

  const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <title>${labels.pageTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Ethiopic", "Nyala", "Abyssinica SIL", Arial, sans-serif;
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
      ${labels.printBtn}
    </button>
  </div>

  <div class="header">
    <div class="inst-title">${labels.instTitle1}</div>
    <div class="sub-title">${labels.instTitle2}</div>
    <div class="inst-title">${labels.instTitle3}</div>
    <div class="doc-title">${labels.docTitle}</div>
  </div>

  <div class="meta-grid">
    <div class="meta-box">
      <div class="meta-label">${labels.councilName}</div>
      <div class="meta-val">${council.name}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">${labels.charterStatus}</div>
      <div class="meta-val" style="color: #047857;">${statusLabel(council.status)}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">${labels.regNumber}</div>
      <div class="meta-val" style="font-family: monospace;">${council.registrationNumber || "—"}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">${labels.jurisdiction}</div>
      <div class="meta-val">${labels.jurisdictionVal}</div>
    </div>
  </div>

  <div class="section-title">${labels.secLeadership}</div>
  <table>
    <thead>
      <tr>
        <th style="width: 40px;">${labels.thNo}</th>
        <th>${labels.thFullName}</th>
        <th>${labels.thRole}</th>
        <th>${labels.thRepresenting}</th>
        <th>${labels.thPhone}</th>
        <th>${labels.thAddress}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">1</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-weight: 700; font-size: 12px;">${council.chairpersonName || "—"}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; font-weight: 700; color: #0B1F3A;">${labels.roleChair}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; color: #475569;">—</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${council.chairpersonPhone || "—"}</td>
        <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; color: #475569;">${council.address || "—"}</td>
      </tr>
      ${leadershipRows}
    </tbody>
  </table>

  <div class="section-title">${labels.secMembers}</div>
  ${
    memberCount > 0
      ? `
  <table>
    <thead>
      <tr>
        <th style="width: 40px;">${labels.thNo}</th>
        <th>${labels.thEdirName}</th>
        <th>${labels.thRegNo}</th>
        <th>${labels.thJurisdiction}</th>
        <th>${labels.thAccreditation}</th>
      </tr>
    </thead>
    <tbody>
      ${memberRows}
    </tbody>
  </table>
  `
      : `<p style="font-size: 12px; color: #64748B; font-style: italic;">${labels.noMembers}</p>`
  }

  <div class="footer-sign">
    <div>
      <div class="sign-line">${labels.signChair}</div>
    </div>
    <div>
      <div class="sign-line">${labels.signSecretary}</div>
    </div>
    <div>
      <div class="sign-line">${labels.signSeal}</div>
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
