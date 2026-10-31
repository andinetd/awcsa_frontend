import { Edir } from "@/api/social-affairs/edir";

export function printEdirDossier(edir: Edir, lang: "en" | "am" = "en") {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const isAm = lang === "am";

  const totalMembers =
    (edir.managementMale || 0) +
    (edir.managementFemale || 0) +
    (edir.generalMale || 0) +
    (edir.generalFemale || 0);

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

  const formattedDate = formatDate(edir.establishmentDate);
  const regDate = formatDate(edir.registrationDate);
  const certDate = formatDate(edir.certificateIssuedAt);

  const statusLabel = () => {
    const s = edir.status || "PENDING";
    if (!isAm) return s;
    switch (s) {
      case "ACTIVE":
        return "ንቁ";
      case "EXPIRED":
        return "ጊዜው ያለፈበት";
      case "REVOKED":
        return "የታገደ";
      case "CANCELLED":
        return "የተሰረዘ";
      case "PENDING":
        return "በመጠባበቅ ላይ";
      default:
        return s;
    }
  };

  const registerLevelLabel = () => {
    const l = edir.registerLevel || "WOREDA";
    if (!isAm) return l;
    switch (l as string) {
      case "WOREDA":
        return "ወረዳ";
      case "SUBCITY":
      case "SUB_CITY":
        return "ክፍለ ከተማ";
      case "CITY":
        return "ከተማ";
      default:
        return l;
    }
  };

  const renewalYearLabel = () => {
    if (edir.renewedForYear) {
      return isAm ? `${edir.renewedForYear} ዓ.ም` : `Year ${edir.renewedForYear}`;
    }
    return isAm ? "ያልታደሰ" : "Not Renewed";
  };

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

  const labels = isAm
    ? {
        pageTitle: `የዕድር ይፋዊ መዝገብ - ${edir.name}`,
        printBtn: "ሰነዱን አትም (Ctrl + P)",
        instTitle1: "የአዲስ አበባ ከተማ አስተዳደር",
        instTitle2: "የሴቶችና ማኅበራዊ ጉዳይ ቢሮ",
        instTitle3: "የባህላዊ ዕድርና ማኅበረሰብ ማኅበራት ዳይሬክቶሬት",
        docTitle: "ይፋዊ የዕድር ማኅበር ዶሴና መዝገብ",
        name: "የማኅበሩ ሙሉ ስም",
        status: "የዕውቅና ሁኔታ",
        regId: "የምዝገባ / የምስክር ወረቀት ቁጥር",
        level: "የምዝገባ ደረጃ",
        secLocation: "የአስተዳደር ወሰንና አድራሻ",
        subCityWoreda: "ክፍለ ከተማና ወረዳ",
        houseSpecific: "የቤት ቁጥርና ልዩ ቦታ",
        subCityVal: `${edir.subCity ? `${edir.subCity} ክፍለ ከተማ` : ""} · ወረዳ ${edir.woreda || "—"}${edir.kebele ? ` · ቀበሌ ${edir.kebele}` : ""}`,
        houseVal: `የቤት ቁጥር #${edir.houseNumber || "—"} · ${edir.specificLocation || "—"}`,
        secMembership: "የአባላት ስታትስቲክስና የባንክ ሒሳብ",
        totalMembers: "ጠቅላላ የተመዘገቡ አባላት",
        mgmtMale: "አመራር (ወንድ)",
        mgmtFemale: "አመራር (ሴት)",
        genMale: "አባላት (ወንድ)",
        genFemale: "አባላት (ሴት)",
        bankAcc: "የባንክ ሒሳብ ቁጥር",
        secDates: "ሕጋዊ የዕውቅናና የምስክር ወረቀት ቀናት",
        established: "የተመሠረተበት ቀን",
        registered: "የተመዘገበበት ቀን",
        certIssued: "የምስክር ወረቀት የተሰጠበት ቀን",
        renewedYear: "የታደሰበት የበጀት ዓመት",
        secFounding: "የመሪ አባላት ዝርዝር (መመሪያ አንቀጽ 7.ሀ)",
        tableNo: "ተ.ቁ",
        tableName: "ሙሉ ስም",
        tableAddress: "አድራሻ / ቀበሌ",
        signChair: "የዕድሩ ሊቀመንበር ፊርማና ማህተም",
        signOfficer: "የወረዳው ማኅበራዊ ጉዳይ ኃላፊ",
        signApproval: "የማዘጋጃ ቤት መዝጋቢ ማረጋገጫ",
      }
    : {
        pageTitle: `Edir Official Record - ${edir.name}`,
        printBtn: "Print Document (Ctrl + P)",
        instTitle1: "Addis Ababa City Administration",
        instTitle2: "Bureau of Women and Social Affairs",
        instTitle3: "Traditional Edir & Community Associations Directorate",
        docTitle: "Official Association Dossier & Registry",
        name: "Association Full Name",
        status: "Accreditation Status",
        regId: "Registration / Certificate ID",
        level: "Registration Level",
        secLocation: "Jurisdiction & Municipal Location",
        subCityWoreda: "Sub-City & Woreda",
        houseSpecific: "House & Specific Location",
        subCityVal: `${edir.subCity} · Woreda ${edir.woreda} ${edir.kebele ? `· Kebele ${edir.kebele}` : ""}`,
        houseVal: `House #${edir.houseNumber || "—"} · ${edir.specificLocation || "—"}`,
        secMembership: "Membership & Financial Governance",
        totalMembers: "Total Declared Census",
        mgmtMale: "Management (Male)",
        mgmtFemale: "Management (Female)",
        genMale: "General (Male)",
        genFemale: "General (Female)",
        bankAcc: "Bank Account",
        secDates: "Statutory Legal Accreditation Dates",
        established: "Established On",
        registered: "Registered On",
        certIssued: "Certificate Issued Date",
        renewedYear: "Renewed for Fiscal Year",
        secFounding: "Leader Members Roster (Article 7.a)",
        tableNo: "#",
        tableName: "Full Name",
        tableAddress: "Address / Kebele",
        signChair: "Edir Chairperson Signature & Stamp",
        signOfficer: "Woreda Social Affairs Officer",
        signApproval: "Municipal Registrar Approval",
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
      <div class="meta-label">${labels.name}</div>
      <div class="meta-val">${edir.name}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">${labels.status}</div>
      <div class="meta-val">
        <span class="badge ${edir.status === "ACTIVE" ? "badge-active" : "badge-expired"}">
          ${statusLabel()}
        </span>
      </div>
    </div>
    <div class="meta-box">
      <div class="meta-label">${labels.regId}</div>
      <div class="meta-val" style="font-family: monospace;">${edir.registrationNumber || "—"}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">${labels.level}</div>
      <div class="meta-val">${registerLevelLabel()}</div>
    </div>
  </div>

  <div class="section-title">${labels.secLocation}</div>
  <div class="meta-grid">
    <div class="meta-box">
      <div class="meta-label">${labels.subCityWoreda}</div>
      <div class="meta-val">${labels.subCityVal}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">${labels.houseSpecific}</div>
      <div class="meta-val">${labels.houseVal}</div>
    </div>
  </div>

  <div class="section-title">${labels.secMembership}</div>
  <table>
    <thead>
      <tr>
        <th>${labels.totalMembers}</th>
        <th>${labels.mgmtMale}</th>
        <th>${labels.mgmtFemale}</th>
        <th>${labels.genMale}</th>
        <th>${labels.genFemale}</th>
        <th>${labels.bankAcc}</th>
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

  <div class="section-title">${labels.secDates}</div>
  <div class="meta-grid">
    <div class="meta-box">
      <div class="meta-label">${labels.established}</div>
      <div class="meta-val">${formattedDate}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">${labels.registered}</div>
      <div class="meta-val">${regDate}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">${labels.certIssued}</div>
      <div class="meta-val">${certDate}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">${labels.renewedYear}</div>
      <div class="meta-val">${renewalYearLabel()}</div>
    </div>
  </div>

  ${
    edir.foundingMembers && edir.foundingMembers.length > 0
      ? `
  <div class="section-title">${labels.secFounding}</div>
  <table>
    <thead>
      <tr>
        <th style="width: 40px;">${labels.tableNo}</th>
        <th>${labels.tableName}</th>
        <th>${labels.tableAddress}</th>
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
      <div class="sign-line">${labels.signChair}</div>
    </div>
    <div>
      <div class="sign-line">${labels.signOfficer}</div>
    </div>
    <div>
      <div class="sign-line">${labels.signApproval}</div>
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
