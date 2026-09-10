"use client";

import React, { useState } from "react";
import {
  Baby,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  GraduationCap,
  HandHeart,
  Heart,
  Home,
  Layers,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  const [activeDirectorate, setActiveDirectorate] = useState<
    "children" | "social" | "women" | "edir"
  >("children");

  // Child welfare numbers
  const totalChildren = childWelfareData?.children?.total || 1420;
  const inCare = childWelfareData?.children?.inCare || 680;
  const found = childWelfareData?.children?.found || 240;
  const adopted = childWelfareData?.children?.adopted || 310;
  const fostered = childWelfareData?.children?.fostered || 190;
  const totalApplicants = childWelfareData?.adoption?.totalApplicants || 154;

  // Social rehab numbers
  const totalVulnerable = socialRehabData?.beneficiaries?.totalVulnerable || 3850;
  const elderly = socialRehabData?.beneficiaries?.elderly || 1640;
  const disability = socialRehabData?.beneficiaries?.disability || 1280;
  const totalEdirs = socialRehabData?.community?.totalEdirs || 240;
  const totalMembers = socialRehabData?.community?.totalMembers || 48500;
  const totalServices = socialRehabData?.support?.totalServicesProvided || 2340;

  return (
    <div className="space-y-6">
      {/* Directorate Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/80 bg-card/60 p-1.5 backdrop-blur-md">
        <button
          onClick={() => setActiveDirectorate("children")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            activeDirectorate === "children"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <Baby className="h-4 w-4" />
          <span>Child Welfare & Adoption</span>
          <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-mono">
            {totalChildren.toLocaleString()}
          </span>
        </button>

        <button
          onClick={() => setActiveDirectorate("social")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            activeDirectorate === "social"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <Heart className="h-4 w-4" />
          <span>Elderly & Disability</span>
          <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-mono">
            {totalVulnerable.toLocaleString()}
          </span>
        </button>

        <button
          onClick={() => setActiveDirectorate("women")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            activeDirectorate === "women"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <HandHeart className="h-4 w-4" />
          <span>Women's Empowerment</span>
          <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-mono">
            {womenProfilesCount.toLocaleString()}
          </span>
        </button>

        <button
          onClick={() => setActiveDirectorate("edir")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            activeDirectorate === "edir"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Community Edir Safety Net</span>
          <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-mono">
            {totalEdirs.toLocaleString()}
          </span>
        </button>
      </div>

      {/* Tab 1: Child Welfare Directorate Details */}
      {activeDirectorate === "children" && (
        <div className="space-y-6">
          {/* Numbers grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Total In Care</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                {inCare.toLocaleString()}
              </h4>
              <p className="text-xs text-sky-600 dark:text-sky-400 mt-1 flex items-center gap-1">
                <Home className="h-3 w-3" /> In care centers
              </p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Found / Rescued</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                {found.toLocaleString()}
              </h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <UserCheck className="h-3 w-3" /> Identified
              </p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Finalized Adoptions</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                {adopted.toLocaleString()}
              </h4>
              <p className="text-xs text-violet-600 dark:text-violet-400 mt-1 flex items-center gap-1">
                <Heart className="h-3 w-3" /> Placed families
              </p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Fostered</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                {fostered.toLocaleString()}
              </h4>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <Users className="h-3 w-3" /> Foster care
              </p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Adoption Applicants</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                {totalApplicants.toLocaleString()}
              </h4>
              <p className="text-xs text-teal-600 dark:text-teal-400 mt-1 flex items-center gap-1">
                <FileText className="h-3 w-3" /> In screening
              </p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Care Facilities</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                {careCentersCount}
              </h4>
              <p className="text-xs text-primary mt-1 flex items-center gap-1">
                <Building2 className="h-3 w-3" /> Verified centers
              </p>
            </Card>
          </div>

          {/* Adoption Funnel & Care Center Capacity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 rounded-2xl border-border/80">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Adoption Processing Funnel
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Pipeline conversion from applicant registry to legal finalization
              </CardDescription>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-muted-foreground">1. Applications Registered</span>
                    <span className="font-mono text-foreground font-bold">{totalApplicants} (100%)</span>
                  </div>
                  <Progress value={100} className="h-2 bg-muted" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-muted-foreground">2. Home Visits & Background Screened</span>
                    <span className="font-mono text-foreground font-bold">118 (76.6%)</span>
                  </div>
                  <Progress value={76.6} className="h-2 bg-muted" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-muted-foreground">3. Child Matched & Bonding Stage</span>
                    <span className="font-mono text-foreground font-bold">82 (53.2%)</span>
                  </div>
                  <Progress value={53.2} className="h-2 bg-muted" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-muted-foreground">4. Court Sanctioned & Finalized</span>
                    <span className="font-mono text-foreground font-bold">64 (41.5%)</span>
                  </div>
                  <Progress value={41.5} className="h-2 bg-muted" />
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl border-border/80">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-500" />
                Care Centers Infrastructure Load
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Capacity utilization across {careCentersCount} accredited residential facilities
              </CardDescription>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/40 text-xs">
                  <span className="text-muted-foreground">Overall City Capacity</span>
                  <span className="font-mono font-bold text-foreground">920 Beds Available</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/40 text-xs">
                  <span className="text-muted-foreground">Current Occupancy</span>
                  <span className="font-mono font-bold text-foreground">{inCare} Children ({Math.round((inCare / 920) * 100)}%)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/40 text-xs">
                  <span className="text-muted-foreground">Monthly Intake Velocity</span>
                  <span className="font-mono font-bold text-emerald-600">+38 Admissions</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/40 text-xs">
                  <span className="text-muted-foreground">Monthly Reunifications & Discharges</span>
                  <span className="font-mono font-bold text-sky-600">22 Discharges</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Elderly & Disability Details */}
      {activeDirectorate === "social" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Elderly Beneficiaries</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                {elderly.toLocaleString()}
              </h4>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Social pensions & shelter</p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Persons with Disabilities</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                {disability.toLocaleString()}
              </h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Rehabilitation & aids</p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Support Services</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                {totalServices.toLocaleString()}
              </h4>
              <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">Medical, food & legal</p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Assistive Devices</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                1,240
              </h4>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Wheelchairs, canes & kits</p>
            </Card>
          </div>

          <Card className="p-6 rounded-2xl border-border/80">
            <CardTitle className="text-base font-bold">Disability Categories & Intervention Allocation</CardTitle>
            <CardDescription className="text-xs mt-1">Breakdown of registered clients needing specialized community assistance</CardDescription>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-xl border border-border/70 bg-card">
                <p className="text-xs text-muted-foreground">Mobility Impairment</p>
                <p className="text-xl font-bold font-mono text-foreground mt-1">540</p>
                <Badge variant="outline" className="mt-2 text-xs bg-sky-500/10 text-sky-600 border-sky-200">
                  42.2% of total
                </Badge>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card">
                <p className="text-xs text-muted-foreground">Visual Impairment</p>
                <p className="text-xl font-bold font-mono text-foreground mt-1">320</p>
                <Badge variant="outline" className="mt-2 text-xs bg-emerald-500/10 text-emerald-600 border-emerald-200">
                  25.0% of total
                </Badge>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card">
                <p className="text-xs text-muted-foreground">Hearing & Speech</p>
                <p className="text-xl font-bold font-mono text-foreground mt-1">260</p>
                <Badge variant="outline" className="mt-2 text-xs bg-purple-500/10 text-purple-600 border-purple-200">
                  20.3% of total
                </Badge>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card">
                <p className="text-xs text-muted-foreground">Intellectual / Developmental</p>
                <p className="text-xl font-bold font-mono text-foreground mt-1">160</p>
                <Badge variant="outline" className="mt-2 text-xs bg-amber-500/10 text-amber-600 border-amber-200">
                  12.5% of total
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Women's Empowerment Directorate Details */}
      {activeDirectorate === "women" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Registered Profiles</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                {womenProfilesCount.toLocaleString()}
              </h4>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">Active case files</p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Vocational Training</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                840
              </h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <GraduationCap className="h-3 w-3" /> Certified graduates
              </p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Technology Toolkits</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                420
              </h4>
              <p className="text-xs text-sky-600 dark:text-sky-400 mt-1 flex items-center gap-1">
                <Zap className="h-3 w-3" /> Equipment delivered
              </p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Formal Job Placements</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                640
              </h4>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
                <Briefcase className="h-3 w-3" /> Employed in industry
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 rounded-2xl border-border/80">
              <CardTitle className="text-base font-bold">Women Associations & Cooperatives</CardTitle>
              <CardDescription className="text-xs mt-1">Community micro-enterprises and savings groups</CardDescription>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card text-xs">
                  <span className="text-muted-foreground">Registered Associations</span>
                  <span className="font-mono font-bold text-foreground">84 Groups</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card text-xs">
                  <span className="text-muted-foreground">Total Cooperative Members</span>
                  <span className="font-mono font-bold text-foreground">3,420 Women</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card text-xs">
                  <span className="text-muted-foreground">Seed Capital & Grant Disbursal</span>
                  <span className="font-mono font-bold text-emerald-600">ETB 14.8M Total</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl border-border/80">
              <CardTitle className="text-base font-bold">Training Program Specializations</CardTitle>
              <CardDescription className="text-xs mt-1">Distribution of graduates by vocational discipline</CardDescription>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Textile & Garment Production</span>
                    <span className="font-mono font-bold">38% (320 women)</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Food Preparation & Hospitality</span>
                    <span className="font-mono font-bold">28% (235 women)</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Digital & IT Services</span>
                    <span className="font-mono font-bold">20% (168 women)</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Handicrafts & Leatherwork</span>
                    <span className="font-mono font-bold">14% (117 women)</span>
                  </div>
                  <Progress value={14} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 4: Edir Safety Net Details */}
      {activeDirectorate === "edir" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Registered Edirs</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                {totalEdirs.toLocaleString()}
              </h4>
              <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">Mapped in registry</p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Affiliated Households</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                {totalMembers.toLocaleString()}
              </h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Beneficiary families</p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Idir Sub-City Councils</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                11
              </h4>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Council federations</p>
            </Card>

            <Card className="p-4 border-border/80 bg-card/80">
              <p className="text-xs font-medium text-muted-foreground">Social Security Payouts</p>
              <h4 className="text-2xl font-bold text-foreground font-mono mt-1">
                ETB 28.5M
              </h4>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Mutual bereavement aid</p>
            </Card>
          </div>

          <Card className="p-6 rounded-2xl border-border/80">
            <CardTitle className="text-base font-bold">Community Safety Net Integration</CardTitle>
            <CardDescription className="text-xs mt-1">Traditional mutual aid institutions digitized into municipal social protection</CardDescription>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
                <span className="font-semibold text-foreground">Bereavement & Emergency Aid</span>
                <p className="text-muted-foreground">100% of member families receive immediate financial and communal bereavement support.</p>
              </div>
              <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
                <span className="font-semibold text-foreground">Orphan Support Networks</span>
                <p className="text-muted-foreground">Over 340 orphans locally sponsored through Edir community solidarity funds.</p>
              </div>
              <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
                <span className="font-semibold text-foreground">Legal & Dispute Mediation</span>
                <p className="text-muted-foreground">Idir councils resolved 88% of community civil mediation cases without court escalation.</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
