"use client";

import React, { useState } from "react";
import {
  Baby,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  GraduationCap,
  HandHeart,
  Heart,
  Home,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DirectorateDrilldownProps {
  childWelfareData?: any;
  socialRehabData?: any;
  careCentersCount?: number;
  womenProfilesCount?: number;
}

export function DirectorateDrilldown({
  childWelfareData,
  socialRehabData,
  careCentersCount = 18,
  womenProfilesCount = 1280,
}: DirectorateDrilldownProps) {
  const [activeTab, setActiveTab] = useState<"children" | "social" | "women" | "edir">("children");

  // Child welfare domain numbers
  const totalChildren = childWelfareData?.children?.total || 1420;
  const inCare = childWelfareData?.children?.inCare || 680;
  const found = childWelfareData?.children?.found || 240;
  const adopted = childWelfareData?.children?.adopted || 310;
  const fostered = childWelfareData?.children?.fostered || 190;
  const totalApplicants = childWelfareData?.adoption?.totalApplicants || 154;

  // Social rehab domain numbers
  const totalVulnerable = socialRehabData?.beneficiaries?.totalVulnerable || 3850;
  const elderly = socialRehabData?.beneficiaries?.elderly || 1640;
  const disability = socialRehabData?.beneficiaries?.disability || 1280;
  const totalEdirs = socialRehabData?.community?.totalEdirs || 240;
  const totalMembers = socialRehabData?.community?.totalMembers || 48500;
  const totalServices = socialRehabData?.support?.totalServicesProvided || 2340;

  return (
    <div className="space-y-4">
      {/* Directorate Executive Performance Matrix Table */}
      <div className="rounded-sm border border-[#E3E7EB] bg-white shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <tbody className="divide-y divide-[#E3E7EB] font-medium text-slate-700">
              {/* Row 1: Women's Affairs */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#1769AA]" />
                    <div>
                      <div className="font-bold text-slate-900">Women's development &amp; protection</div>
                      <div className="text-[11px] text-slate-400">የሴቶች ልማትና ጥበቃ ዳይሬክቶሬት (WD-03)</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-mono text-slate-800">
                  {womenProfilesCount || 11}
                </td>
                <td className="px-4 py-3 text-center font-mono text-slate-500">+85</td>
                <td className="px-4 py-3 text-center font-mono text-slate-700">840</td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center rounded-xs border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-mono text-slate-600">
                    4 groups
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-mono font-bold text-slate-900">89.5%</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setActiveTab("women")}
                    className="text-[11px] font-medium text-slate-700 hover:text-[#1769AA] underline cursor-pointer"
                  >
                    View dossier
                  </button>
                </td>
              </tr>

              {/* Row 2: Community Edir Associations */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#1769AA]" />
                    <div>
                      <div className="font-bold text-slate-900">Community edir safety net &amp; councils</div>
                      <div className="text-[11px] text-slate-400">የአደራ ማህበረሰብ ድጋፍ ዳይሬክቶሬት (ED-04)</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-mono text-slate-800">
                  3 edirs
                </td>
                <td className="px-4 py-3 text-center font-mono text-slate-500">+6</td>
                <td className="px-4 py-3 text-center font-mono text-slate-700">
                  259 hh
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center rounded-xs border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-mono text-slate-600">
                    Current
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-mono font-bold text-slate-900">96.0%</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setActiveTab("edir")}
                    className="text-[11px] font-medium text-slate-700 hover:text-[#1769AA] underline cursor-pointer"
                  >
                    View dossier
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-tabs with Underline indicator */}
      <div className="border-b border-[#E3E7EB] pt-1 flex flex-wrap gap-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab("children")}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === "children"
              ? "border-b-2 border-[#1769AA] text-slate-900 font-bold"
              : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Child welfare &amp; institutional care
        </button>

        <button
          onClick={() => setActiveTab("social")}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === "social"
              ? "border-b-2 border-[#1769AA] text-slate-900 font-bold"
              : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Elderly, disability &amp; support services
        </button>

        <button
          onClick={() => setActiveTab("women")}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === "women"
              ? "border-b-2 border-[#1769AA] text-slate-900 font-bold"
              : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Women's development &amp; associations
        </button>

        <button
          onClick={() => setActiveTab("edir")}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === "edir"
              ? "border-b-2 border-[#1769AA] text-slate-900 font-bold"
              : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Community edir mutual aid networks
        </button>
      </div>

      {/* Detail Dossier 1: Child Welfare & Residential Centers */}
      {activeTab === "children" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Child legal status & placement */}
          <div className="rounded-sm border border-[#E3E7EB] bg-white p-4 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Child legal status &amp; placement
              </h4>
              <p className="text-[11px] text-slate-500">
                Distribution across the directorate's active caseload
              </p>
            </div>
            <div className="divide-y divide-[#E3E7EB] text-xs pt-1">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-600">Admitted in residential care centers</span>
                <span className="font-bold text-slate-900">1 child</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-600">Identified, rescued or reunified</span>
                <span className="font-bold text-slate-900">1 child</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-600">Legally finalized domestic adoptions</span>
                <span className="font-bold text-slate-900">3 children</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-600">Active community foster care</span>
                <span className="font-bold text-slate-900">1 child</span>
              </div>
              <div className="py-2.5 flex items-center justify-between font-bold">
                <span className="text-slate-900">Total under directorate supervision</span>
                <span className="text-slate-900">8 children</span>
              </div>
            </div>
          </div>

          {/* Right: Adoption screening pipeline */}
          <div className="rounded-sm border border-[#E3E7EB] bg-white p-4 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Adoption screening pipeline
              </h4>
              <p className="text-[11px] text-slate-500">
                Throughput at each stage, applications registered this cycle
              </p>
            </div>
            <div className="space-y-3 text-xs pt-1">
              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>1. Formal applications registered</span>
                  <span className="font-bold text-slate-900">23 · 100%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1769AA] rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>2. Home inspections cleared</span>
                  <span className="font-bold text-slate-900">118 · 76.6%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1769AA] rounded-full" style={{ width: "76.6%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>3. Child matching &amp; bonding approved</span>
                  <span className="font-bold text-slate-900">82 · 53.2%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1769AA] rounded-full" style={{ width: "53.2%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>4. Court decrees finalized</span>
                  <span className="font-bold text-slate-900">64 · 41.5%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1769AA] rounded-full" style={{ width: "41.5%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Dossier 2: Elderly & Disability */}
      {activeTab === "social" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-md border border-[#E3E7EB] bg-white p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#123B5D]">
              Vulnerability Demographics & Case Load
            </h4>
            <div className="divide-y divide-[#E3E7EB] text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Vulnerable Elderly Citizens (Social Pension)</span>
                <span className="font-mono font-bold text-slate-900">{elderly.toLocaleString()}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Persons with Disabilities (PWD Registered)</span>
                <span className="font-mono font-bold text-slate-900">{disability.toLocaleString()}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Institutional Elderly Care Centers</span>
                <span className="font-mono font-bold text-slate-900">6 centers</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Total Vulnerable Citizens Monitored</span>
                <span className="font-mono font-bold text-[#168C86]">{totalVulnerable.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-[#E3E7EB] bg-white p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#123B5D]">
              Disability Support & Assistive Provisioning
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="border border-[#E3E7EB] p-2.5 rounded-sm">
                <span className="text-slate-500">Mobility Impairment</span>
                <div className="text-base font-bold font-mono text-[#123B5D] mt-0.5">540 cases</div>
                <span className="text-[11px] text-slate-400">Wheelchairs & prosthetics</span>
              </div>
              <div className="border border-[#E3E7EB] p-2.5 rounded-sm">
                <span className="text-slate-500">Visual Impairment</span>
                <div className="text-base font-bold font-mono text-[#123B5D] mt-0.5">320 cases</div>
                <span className="text-[11px] text-slate-400">White canes & braille kits</span>
              </div>
              <div className="border border-[#E3E7EB] p-2.5 rounded-sm">
                <span className="text-slate-500">Hearing & Speech</span>
                <div className="text-base font-bold font-mono text-[#123B5D] mt-0.5">260 cases</div>
                <span className="text-[11px] text-slate-400">Hearing aids & training</span>
              </div>
              <div className="border border-[#E3E7EB] p-2.5 rounded-sm">
                <span className="text-slate-500">Developmental</span>
                <div className="text-base font-bold font-mono text-[#123B5D] mt-0.5">160 cases</div>
                <span className="text-[11px] text-slate-400">Specialized therapy</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Dossier 3: Women's Development (Plum Theme) */}
      {activeTab === "women" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-md border border-[#E3E7EB] bg-white p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#74345F]">
              Economic Empowerment & Associations Registry
            </h4>
            <div className="divide-y divide-[#E3E7EB] text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Registered Women's Associations</span>
                <span className="font-mono font-bold text-slate-900">84 associations</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Total Association Members</span>
                <span className="font-mono font-bold text-slate-900">3,420 members</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Revolving Micro-Credit Capital</span>
                <span className="font-mono font-bold text-slate-900 font-mono">ETB 14.8M disbursed</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Active Profiles Under Monitoring</span>
                <span className="font-mono font-bold text-[#74345F]">{womenProfilesCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-[#E3E7EB] bg-white p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#74345F]">
              Vocational Training & Skill Certification
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E3E7EB]">
                <span className="text-slate-600">Textile & Garment Manufacturing</span>
                <span className="font-mono font-bold text-slate-900">320 certified</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E3E7EB]">
                <span className="text-slate-600">Food Processing & Commercial Kitchen</span>
                <span className="font-mono font-bold text-slate-900">235 certified</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E3E7EB]">
                <span className="text-slate-600">Information Technology & Digital Services</span>
                <span className="font-mono font-bold text-slate-900">168 certified</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Formal Industrial Employment Placements</span>
                <span className="font-mono font-bold text-[#168C86]">640 placed</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Dossier 4: Edir Networks */}
      {activeTab === "edir" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-md border border-[#E3E7EB] bg-white p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#123B5D]">
              Traditional Mutual Aid Affiliation Registry
            </h4>
            <div className="divide-y divide-[#E3E7EB] text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Mapped Community Edir Associations</span>
                <span className="font-mono font-bold text-slate-900">{totalEdirs} Edirs</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Affiliated Household Membership</span>
                <span className="font-mono font-bold text-slate-900">{totalMembers.toLocaleString()} households</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Municipal Sub-City Edir Councils</span>
                <span className="font-mono font-bold text-slate-900">11 councils</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600 font-semibold">City-wide Mutual Security Coverage</span>
                <span className="font-mono font-bold text-[#123B5D]">~240,000 residents</span>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-[#E3E7EB] bg-white p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#123B5D]">
              Municipal Partnership & Social Safety Net
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="border border-[#E3E7EB] p-2 rounded-sm">
                <strong className="text-slate-800">Orphan Support:</strong> 340 children supported directly via Edir community solidarity funds.
              </p>
              <p className="border border-[#E3E7EB] p-2 rounded-sm">
                <strong className="text-slate-800">Civil Dispute Resolution:</strong> 88% of community arbitration disputes resolved without formal judicial escalation.
              </p>
              <p className="border border-[#E3E7EB] p-2 rounded-sm">
                <strong className="text-slate-800">Emergency Relief:</strong> Coordinated municipal food and bereavement assistance across all 11 sub-cities.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
