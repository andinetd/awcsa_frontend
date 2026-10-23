import { AidDistribution } from "@/api/beneficiaries/aid-distribution";

export interface PrintRosterOptions {
  distributions: AidDistribution[];
  subCity?: string;
  woreda?: string;
  distributionMonth?: string;
  preparedByName?: string;
  preparedByTitle?: string;
  approvedByName?: string;
  approvedByTitle?: string;
}

export function printAidDistributionRoster(options: PrintRosterOptions) {
  const {
    distributions,
    subCity = "ለሚ ኩራ",
    woreda = "",
    distributionMonth = "",
    preparedByName = "",
    preparedByTitle = "የቡድን መሪ / ባለሙያ",
    approvedByName = "",
    approvedByTitle = "የጽ/ቤት ኃላፊ",
  } = options;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  // Compute Grand Totals
  const totals = distributions.reduce(
    (acc, item) => {
      acc.male += item.familyMaleCount || 0;
      acc.female += item.familyFemaleCount || 0;
      acc.familyTotal += item.familyTotalCount || 0;
      acc.oil += item.oilLiters || 0;
      acc.flour += item.flourKg || 0;
      acc.onions += item.onionsKg || 0;
      if (item.clothingSupport) acc.clothingCount += 1;
      acc.cash += item.cashAmount || 0;
      if (item.healthInsuranceSponsorship) acc.insuranceCount += 1;
      acc.totalValue += item.totalCashEquivalent || 0;
      return acc;
    },
    {
      male: 0,
      female: 0,
      familyTotal: 0,
      oil: 0,
      flour: 0,
      onions: 0,
      clothingCount: 0,
      cash: 0,
      insuranceCount: 0,
      totalValue: 0,
    }
  );

  const displayWoreda = woreda || (distributions[0]?.woreda || "______");
  const displaySubCity = subCity || (distributions[0]?.subCity || "ለሚ ኩራ");
  const displayMonth = distributionMonth || (distributions[0]?.distributionMonth || "__________");

  const rowsHtml = distributions
    .map((item, idx) => {
      const fullName = item.client
        ? `${item.client.firstName || ""} ${item.client.lastName || ""} ${item.client.grandfatherName || ""}`.trim()
        : "—";
      const sexLabel = item.client?.sex === "FEMALE" ? "ሴት" : item.client?.sex === "MALE" ? "ወንድ" : "—";
      const age = item.client?.age ?? "—";
      const rowWoreda = item.woreda || item.client?.woreda || displayWoreda;
      const phone = item.client?.phoneNumber || "—";

      const oilText = item.oilLiters && item.oilLiters > 0 ? `${item.oilLiters} ሊ` : "—";
      const flourText = item.flourKg && item.flourKg > 0 ? `${item.flourKg} ኪ` : "—";
      const onionText = item.onionsKg && item.onionsKg > 0 ? `${item.onionsKg} ኪ` : "—";
      const clothingText = item.clothingSupport ? (item.clothingDetails || "✓") : "—";
      const cashText = item.cashAmount && item.cashAmount > 0 ? `${item.cashAmount.toLocaleString()} ብር` : "—";
      const insuranceText = item.healthInsuranceSponsorship ? "✓" : "—";
      const totalCashValue = item.totalCashEquivalent && item.totalCashEquivalent > 0
        ? `${item.totalCashEquivalent.toLocaleString()} ብር`
        : "—";

      return `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td class="text-left font-bold">${fullName}</td>
          <td class="text-center">${sexLabel}</td>
          <td class="text-center">${age}</td>
          <td class="text-center">${rowWoreda}</td>
          <td class="text-center">${item.familyMaleCount || 0}</td>
          <td class="text-center">${item.familyFemaleCount || 0}</td>
          <td class="text-center font-bold">${item.familyTotalCount || 0}</td>
          <td class="text-center">${oilText}</td>
          <td class="text-center">${flourText}</td>
          <td class="text-center">${onionText}</td>
          <td class="text-center">${clothingText}</td>
          <td class="text-right">${cashText}</td>
          <td class="text-center">${insuranceText}</td>
          <td class="text-center font-mono">${phone}</td>
          <td class="text-right font-bold">${totalCashValue}</td>
          <td class="signature-cell">${item.signatureTaken ? "✓ የተፈረመ" : ""}</td>
        </tr>
      `;
    })
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="am">
<head>
  <meta charset="utf-8" />
  <title>የቤተሰብ ድጋፍና ተሃድሶ ስርጭት ጥቅል መረጃ - ${displayMonth}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm 8mm 10mm 8mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: 'Segoe UI', Tahoma, 'Nyala', 'Abyssinica SIL', Arial, sans-serif;
      font-size: 10.5px;
      line-height: 1.25;
      color: #111;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 12px;
      border-bottom: 2px solid #222;
      padding-bottom: 8px;
    }
    .gov-title {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .gov-sub {
      font-size: 13px;
      font-weight: 700;
      color: #222;
      margin-bottom: 4px;
    }
    .gov-desc {
      font-size: 11.5px;
      font-weight: 600;
      color: #333;
      max-width: 95%;
      margin: 0 auto;
      line-height: 1.4;
    }
    .gov-desc u {
      font-weight: 800;
      text-decoration: underline;
      padding: 0 4px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      table-layout: auto;
    }
    th, td {
      border: 1px solid #333;
      padding: 4px 5px;
      font-size: 9.5px;
      vertical-align: middle;
    }
    th {
      background-color: #f1f3f5 !important;
      font-weight: 700;
      text-align: center;
    }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    .font-mono { font-family: monospace; font-size: 9px; }

    .signature-cell {
      min-width: 75px;
      text-align: center;
      font-style: italic;
      color: #444;
    }

    .totals-row td {
      background-color: #e9ecef !important;
      font-weight: 800;
      border-top: 2px solid #111;
      border-bottom: 2px solid #111;
    }

    .signatures-section {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
      font-size: 11px;
      padding: 0 20px;
    }
    .sig-block {
      width: 44%;
      border: 1px solid #777;
      padding: 12px 16px;
      background: #fafafa;
      border-radius: 4px;
    }
    .sig-title {
      font-weight: 800;
      font-size: 12px;
      margin-bottom: 10px;
      text-decoration: underline;
    }
    .sig-line {
      margin: 8px 0;
      display: flex;
      justify-content: space-between;
    }
    .sig-dots {
      flex: 1;
      border-bottom: 1px dotted #333;
      margin-left: 8px;
    }

    @media print {
      body { margin: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="gov-title">በ${displaySubCity} ክፍለ ከተማ አስተዳደር የሴቶች ህጻናት እና ማህበራዊ ጉዳይ ጽ/ቤት</div>
    <div class="gov-sub">የአካል ጉዳተኞች ፣የአረጋውያን እና ቤተሰብ ጉዳይ መከታተያ ማስተባበርያ ቡድን</div>
    <div class="gov-desc">
      በ${displaySubCity} ክፍለ ከተማ የወረዳ <u>${displayWoreda}</u> ሴቶች ህፃናት እና ማህበራዊ ጉዳይ ጽ/ቤት የአካል ጉዳተኞች፣ የአረጋዊያን እና ቤተሰብ ጉዳይ ማስተባበርያና መከታተያ ቡድን ለችግር ተጋላጭ የሆኑና የስነልቦና፣ የማህበራዊ እና ሌሎች የተሃድሶ አገልግሎቶች ተጠቃሚ ቤተሰቦች የ<u>${displayMonth}</u> ወር ጥቅል መረጃ
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th rowspan="2" style="width: 25px;">ተ.ቁ</th>
        <th rowspan="2" style="width: 140px;">የተጠቃሚው/ዋ ሙሉ ስም</th>
        <th rowspan="2" style="width: 35px;">ፆታ</th>
        <th rowspan="2" style="width: 32px;">እድሜ</th>
        <th rowspan="2" style="width: 45px;">ወረዳ</th>
        <th colspan="3">የቤተሰብ ብዛት</th>
        <th colspan="6">የድጋፉ ዓይነት</th>
        <th rowspan="2" style="width: 80px;">ስልክ ቁጥር</th>
        <th rowspan="2" style="width: 85px;">ወደ ገንዘብ ሲቀየር</th>
        <th rowspan="2" style="width: 80px;">ፊርማ</th>
      </tr>
      <tr>
        <th style="width: 32px;">ወንድ</th>
        <th style="width: 32px;">ሴት</th>
        <th style="width: 36px;">ድምር</th>
        <th style="width: 50px;">ዘይት 3 ሊትር</th>
        <th style="width: 50px;">ዱቄት 10 ኪሎ</th>
        <th style="width: 50px;">ሽንኩርት 5 ኪሎ</th>
        <th style="width: 50px;">አልባሳት</th>
        <th style="width: 60px;">የጥሬ ገንዘብ</th>
        <th style="width: 75px;">ጤና መድን (ስፖንሰር)</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || `<tr><td colspan="17" class="text-center" style="padding: 16px;">ምንም የተመዘገበ የድጋፍ ስርጭት መረጃ የለም (No Records Found)</td></tr>`}
      <tr class="totals-row">
        <td colspan="5" class="text-center font-bold">አጠቃላይ ድምር (Grand Total)</td>
        <td class="text-center">${totals.male}</td>
        <td class="text-center">${totals.female}</td>
        <td class="text-center font-bold">${totals.familyTotal}</td>
        <td class="text-center font-bold">${totals.oil > 0 ? `${totals.oil} ሊ` : "0"}</td>
        <td class="text-center font-bold">${totals.flour > 0 ? `${totals.flour} ኪ` : "0"}</td>
        <td class="text-center font-bold">${totals.onions > 0 ? `${totals.onions} ኪ` : "0"}</td>
        <td class="text-center font-bold">${totals.clothingCount > 0 ? `${totals.clothingCount} ተጠቃሚ` : "0"}</td>
        <td class="text-right font-bold">${totals.cash > 0 ? `${totals.cash.toLocaleString()} ብር` : "0.00"}</td>
        <td class="text-center font-bold">${totals.insuranceCount > 0 ? `${totals.insuranceCount} ተጠቃሚ` : "0"}</td>
        <td class="text-center">—</td>
        <td class="text-right font-bold">${totals.totalValue.toLocaleString()} ብር</td>
        <td class="text-center">—</td>
      </tr>
    </tbody>
  </table>

  <div class="signatures-section">
    <div class="sig-block">
      <div class="sig-title">ያዘጋጀው ባለሙያ / አስተባባሪ (Prepared By):</div>
      <div class="sig-line"><span>ስም (Name):</span><span class="sig-dots">${preparedByName}</span></div>
      <div class="sig-line"><span>የስራ ድርሻ (Job Title):</span><span class="sig-dots">${preparedByTitle}</span></div>
      <div class="sig-line"><span>ፊርማ (Signature):</span><span class="sig-dots"></span></div>
      <div class="sig-line"><span>ቀን (Date):</span><span class="sig-dots"></span></div>
    </div>

    <div class="sig-block">
      <div class="sig-title">ያረጋገጠው / ያጸደቀው የስራ ኃላፊ (Approved By):</div>
      <div class="sig-line"><span>ስም (Name):</span><span class="sig-dots">${approvedByName}</span></div>
      <div class="sig-line"><span>የስራ ድርሻ (Job Title):</span><span class="sig-dots">${approvedByTitle}</span></div>
      <div class="sig-line"><span>ፊርማ (Signature):</span><span class="sig-dots"></span></div>
      <div class="sig-line"><span>ቀን (Date):</span><span class="sig-dots"></span></div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
