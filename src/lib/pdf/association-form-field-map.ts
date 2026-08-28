import type { WomenAssociationRecord } from "@/api/womens/associations";
import { formatPhone } from "@/lib/utils/format-phone";
import {
  GROUP_NAME_X,
  GROUP_NAME_W,
  GROUP_NUMBER_X,
  GROUP_NUMBER_W,
  GROUP_PHONE_X,
  GROUP_PHONE_W,
  HEADER_BLOCK_X,
  HEADER_BLOCK_W,
  HEADER_COUNT_X,
  HEADER_COUNT_W,
  HEADER_LINE1_HEIGHT,
  HEADER_LINE1_Y,
  HEADER_LINE2_HEIGHT,
  HEADER_LINE2_Y,
  HEADER_NAME_X,
  HEADER_NAME_W,
  HEADER_SUBCITY_X,
  HEADER_SUBCITY_W,
  HEADER_WOREDA_X,
  HEADER_WOREDA_W,
  LEADER5_NAME_Y_P2,
  LEADER5_PHONE_Y_P2,
  LEADER_FIELD_HEIGHT,
  LEADER_NAME_Y,
  LEADER_PHONE_Y,
  LEADERSHIP_LEFT_X,
  LEADERSHIP_NAME_BLANK_W,
  LEADERSHIP_PHONE_BLANK_X,
  LEADERSHIP_PHONE_BLANK_W,
  LEADERSHIP_RIGHT_X,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  ROW_BASELINE_Y,
  ROW_HEIGHT,
  SECTION_APPROVER_DATE_X,
  SECTION_APPROVER_DATE_W,
  SECTION_APPROVER_NAME_X,
  SECTION_APPROVER_NAME_W,
  SECTION_APPROVER_SIG_X,
  SECTION_APPROVER_SIG_W,
  SECTION_APPROVER_Y,
  SECTION_DATA_COLLECTOR_DATE_X,
  SECTION_DATA_COLLECTOR_DATE_W,
  SECTION_DATA_COLLECTOR_NAME_X,
  SECTION_DATA_COLLECTOR_NAME_W,
  SECTION_DATA_COLLECTOR_SIG_X,
  SECTION_DATA_COLLECTOR_SIG_W,
  SECTION_DATA_COLLECTOR_Y,
  SECTION_FIELD_HEIGHT,
} from "./association-form-measured";

export type FormFieldAlign = "left" | "center" | "right";
export type FormFontVariant = "regular" | "bold";

export interface FormFieldDef {
  id: string;
  page: 1 | 2;
  x: number;
  y: number;
  width: number;
  height: number;
  size: number;
  align?: FormFieldAlign;
  font?: FormFontVariant;
  kind: "text" | "signature";
  groupNumber?: 1 | 2 | 3;
  rowNumber?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  leaderIndex?: 1 | 2 | 3 | 4 | 5;
  cell: FormCell;
}

export type FormCell =
  | { kind: "header.subCity" }
  | { kind: "header.woreda" }
  | { kind: "header.block" }
  | { kind: "header.associationName" }
  | { kind: "header.memberCount" }
  | { kind: "leader.fullName"; leaderIndex: 1 | 2 | 3 | 4 | 5 }
  | { kind: "leader.phone"; leaderIndex: 1 | 2 | 3 | 4 | 5 }
  | {
      kind: "group.row.name";
      groupNumber: 1 | 2 | 3;
      rowNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    }
  | {
      kind: "group.row.phone";
      groupNumber: 1 | 2 | 3;
      rowNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    }
  | { kind: "section.dataCollectorName" }
  | { kind: "section.dataCollectorSignature" }
  | { kind: "section.dataCollectorDate" }
  | { kind: "section.approverName" }
  | { kind: "section.approverSignature" }
  | { kind: "section.approverDate" };

export type ResolvedFieldValue = string | null;

export interface DynamicImageSlot {
  page: 1 | 2;
  x: number;
  y: number;
  width: number;
  height: number;
  kind: "entrySignature" | "approvalSignature";
}

const textPadX = 2;
const textPadY = 1;

function textField(
  id: string,
  page: 1 | 2,
  x: number,
  y: number,
  width: number,
  height: number,
  cell: FormCell,
  options: { size?: number; align?: FormFieldAlign; font?: FormFontVariant } = {}
): FormFieldDef {
  const baseDef: Omit<FormFieldDef, "groupNumber" | "rowNumber" | "leaderIndex"> = {
    id,
    page,
    x: x + textPadX,
    y: y + textPadY,
    width: width - textPadX * 2,
    height: height - textPadY * 2,
    size: options.size ?? 9,
    align: options.align ?? "left",
    font: options.font ?? "regular",
    kind: "text",
    cell,
  };

  if (cell.kind === "group.row.name" || cell.kind === "group.row.phone") {
    return {
      ...baseDef,
      groupNumber: cell.groupNumber,
      rowNumber: cell.rowNumber,
    };
  }
  if (cell.kind === "leader.fullName" || cell.kind === "leader.phone") {
    return {
      ...baseDef,
      leaderIndex: cell.leaderIndex,
    };
  }
  return baseDef as FormFieldDef;
}

/* Helper: a text field positioned with its bottom at `baselineY` (the y
   coordinate of the pre-printed label in the template). pdf-lib draws text
   from the baseline, so y == baselineY aligns the dynamic text with the
   pre-printed label. */
function baselineTextField(
  id: string,
  page: 1 | 2,
  baselineY: number,
  x: number,
  width: number,
  cell: FormCell,
  options: { size?: number; align?: FormFieldAlign; font?: FormFontVariant } = {}
): FormFieldDef {
  return textField(id, page, x, baselineY - (options.size ?? 9), width, options.size ?? 9, cell, options);
}

function buildHeaderFields(): FormFieldDef[] {
  return [
    baselineTextField(
      "header.subCity",
      1,
      HEADER_LINE1_Y,
      HEADER_SUBCITY_X,
      HEADER_SUBCITY_W,
      { kind: "header.subCity" },
      { size: 10 }
    ),
    baselineTextField(
      "header.woreda",
      1,
      HEADER_LINE1_Y,
      HEADER_WOREDA_X,
      HEADER_WOREDA_W,
      { kind: "header.woreda" },
      { size: 10 }
    ),
    baselineTextField(
      "header.block",
      1,
      HEADER_LINE1_Y,
      HEADER_BLOCK_X,
      HEADER_BLOCK_W,
      { kind: "header.block" },
      { size: 10 }
    ),
    baselineTextField(
      "header.associationName",
      1,
      HEADER_LINE2_Y,
      HEADER_NAME_X,
      HEADER_NAME_W,
      { kind: "header.associationName" },
      { size: 11, font: "bold" }
    ),
    baselineTextField(
      "header.memberCount",
      1,
      HEADER_LINE2_Y,
      HEADER_COUNT_X,
      HEADER_COUNT_W,
      { kind: "header.memberCount" },
      { size: 10, align: "right" }
    ),
  ];
}

function buildLeadershipFields(): FormFieldDef[] {
  const fields: FormFieldDef[] = [];
  for (const i of [1, 2, 3, 4] as const) {
    fields.push(
      baselineTextField(
        `leader.${i}.fullName`,
        1,
        LEADER_NAME_Y[i],
        LEADERSHIP_LEFT_X,
        LEADERSHIP_NAME_BLANK_W,
        { kind: "leader.fullName", leaderIndex: i },
        { size: 7 }
      ),
      baselineTextField(
        `leader.${i}.phone`,
        1,
        LEADER_NAME_Y[i] - 8,
        LEADERSHIP_PHONE_BLANK_X,
        LEADERSHIP_PHONE_BLANK_W,
        { kind: "leader.phone", leaderIndex: i },
        { size: 7 }
      )
    );
  }
  /* Leader 5 lives on page 2, above rows 9 & 10. */
  const leader5Index = 5 as const;
  fields.push(
    baselineTextField(
      "leader.5.fullName",
      2,
      LEADER5_NAME_Y_P2,
      LEADERSHIP_LEFT_X,
      LEADERSHIP_NAME_BLANK_W,
      { kind: "leader.fullName", leaderIndex: leader5Index },
      { size: 7 }
    ),
    baselineTextField(
      "leader.5.phone",
      2,
      LEADER5_NAME_Y_P2 - 8,
      LEADERSHIP_PHONE_BLANK_X,
      LEADERSHIP_PHONE_BLANK_W,
      { kind: "leader.phone", leaderIndex: leader5Index },
      { size: 7 }
    )
  );
  return fields;
}

function buildMemberGridFields(
  page: 1 | 2,
  rows: number[],
  baselineY: (row: number) => number
): FormFieldDef[] {
  const fields: FormFieldDef[] = [];
  for (const row of rows) {
    const y = baselineY(row);
    const rowConst = row as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    for (const g of [1, 2, 3] as const) {
      fields.push(
        baselineTextField(
          `group.${g}.row${row}.name`,
          page,
          y,
          GROUP_NAME_X[g],
          GROUP_NAME_W,
          { kind: "group.row.name", groupNumber: g, rowNumber: rowConst },
          { size: 7 }
        ),
        baselineTextField(
          `group.${g}.row${row}.phone`,
          page,
          y,
          GROUP_PHONE_X[g],
          GROUP_PHONE_W,
          { kind: "group.row.phone", groupNumber: g, rowNumber: rowConst },
          { size: 7 }
        )
      );
    }
  }
  return fields;
}

function printableFormBaseline(row: number): number {
  return ROW_BASELINE_Y[row as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10];
}

/* For DETAILED_REPORT, fit 10 rows in the page 1 grid space.
   Top of data area (just below column labels): y=412 - 16 = 396
   Bottom of page 1 grid (just above signature lines): y=109 (last row in template)
   We use 10 evenly-spaced rows from y=384 (row 1) down to y=110 (row 10). */
const DETAILED_ROW_TOP = 384;
const DETAILED_ROW_BOTTOM = 110;
const DETAILED_ROW_COUNT = 10;
const DETAILED_ROW_STEP =
  (DETAILED_ROW_TOP - DETAILED_ROW_BOTTOM) / (DETAILED_ROW_COUNT - 1);

function detailedReportBaseline(row: number): number {
  return DETAILED_ROW_TOP - (row - 1) * DETAILED_ROW_STEP;
}

function buildBottomSectionFields(): FormFieldDef[] {
  return [
    baselineTextField(
      "section.dataCollectorName",
      2,
      SECTION_DATA_COLLECTOR_Y,
      SECTION_DATA_COLLECTOR_NAME_X,
      SECTION_DATA_COLLECTOR_NAME_W,
      { kind: "section.dataCollectorName" },
      { size: 9 }
    ),
    baselineTextField(
      "section.dataCollectorSignature",
      2,
      SECTION_DATA_COLLECTOR_Y,
      SECTION_DATA_COLLECTOR_SIG_X,
      SECTION_DATA_COLLECTOR_SIG_W,
      { kind: "section.dataCollectorSignature" },
      { size: 9 }
    ),
    baselineTextField(
      "section.dataCollectorDate",
      2,
      SECTION_DATA_COLLECTOR_Y,
      SECTION_DATA_COLLECTOR_DATE_X,
      SECTION_DATA_COLLECTOR_DATE_W,
      { kind: "section.dataCollectorDate" },
      { size: 9 }
    ),
    baselineTextField(
      "section.approverName",
      2,
      SECTION_APPROVER_Y,
      SECTION_APPROVER_NAME_X,
      SECTION_APPROVER_NAME_W,
      { kind: "section.approverName" },
      { size: 9 }
    ),
    baselineTextField(
      "section.approverSignature",
      2,
      SECTION_APPROVER_Y,
      SECTION_APPROVER_SIG_X,
      SECTION_APPROVER_SIG_W,
      { kind: "section.approverSignature" },
      { size: 9 }
    ),
    baselineTextField(
      "section.approverDate",
      2,
      SECTION_APPROVER_Y,
      SECTION_APPROVER_DATE_X,
      SECTION_APPROVER_DATE_W,
      { kind: "section.approverDate" },
      { size: 9 }
    ),
  ];
}

export type AssociationFormFormat = "printable_form" | "detailed_report";

export function buildFields(format: AssociationFormFormat): FormFieldDef[] {
  const header = buildHeaderFields();
  const leadership = buildLeadershipFields();
  const memberGrid =
    format === "detailed_report"
      ? buildMemberGridFields(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], detailedReportBaseline)
      : [
          ...buildMemberGridFields(1, [1, 2, 3, 4, 5, 6, 7, 8], printableFormBaseline),
          ...buildMemberGridFields(2, [9, 10], printableFormBaseline),
        ];
  const bottom = buildBottomSectionFields();
  return [...header, ...leadership, ...memberGrid, ...bottom];
}

export const ASSOCIATION_FORM_FIELDS: FormFieldDef[] = buildFields("printable_form");

import { SIGNATURE_APPROVAL_SLOT, SIGNATURE_ENTRY_SLOT } from "./association-form-measured";

export const ASSOCIATION_FORM_IMAGE_SLOTS: DynamicImageSlot[] = [
  { ...SIGNATURE_ENTRY_SLOT, kind: "entrySignature" },
  { ...SIGNATURE_APPROVAL_SLOT, kind: "approvalSignature" },
];

export const ASSOCIATION_FORM_LAYOUT = {
  page: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
};

const LEADER_POSITIONS = [
  "CHAIRPERSON",
  "VICE_CHAIRPERSON",
  "SECRETARY",
  "WORK_SKILLS_RESPONSIBLE",
  "EDUCATION_RESPONSIBLE",
] as const;

export function resolveFieldValue(
  field: FormFieldDef,
  record: WomenAssociationRecord
): ResolvedFieldValue {
  const cell = field.cell;

  switch (cell.kind) {
    case "header.subCity":
      return record.subCity || null;
    case "header.woreda":
      return record.woreda || null;
    case "header.block":
      return record.block || null;
    case "header.associationName":
      return record.name || null;
    case "header.memberCount":
      return record.totalMembers != null ? String(record.totalMembers) : null;

    case "leader.fullName": {
      const pos = LEADER_POSITIONS[cell.leaderIndex - 1];
      const leader = record.leaders?.find((l) => l.position === pos);
      return leader?.fullName || record.leaderName || null;
    }
    case "leader.phone": {
      const pos = LEADER_POSITIONS[cell.leaderIndex - 1];
      const leader = record.leaders?.find((l) => l.position === pos);
      return formatPhone(leader?.phoneNumber || record.leaderPhoneNumber);
    }

    case "group.row.name": {
      const member = record.oneToTenMembers?.find(
        (m) =>
          m.groupNumber === cell.groupNumber &&
          m.serialNumber === cell.rowNumber
      );
      return member?.fullName || null;
    }
    case "group.row.phone": {
      const member = record.oneToTenMembers?.find(
        (m) =>
          m.groupNumber === cell.groupNumber &&
          m.serialNumber === cell.rowNumber
      );
      return formatPhone(member?.phoneNumber);
    }

    case "section.dataCollectorName":
      return record.enteredByName || null;
    case "section.dataCollectorDate":
      return formatDate(record.enteredAt);
    case "section.approverName":
      return record.approvedByName || null;
    case "section.approverDate":
      return formatDate(record.approvedAt);
    case "section.dataCollectorSignature":
    case "section.approverSignature":
      return null;
  }
}

function formatDate(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
