import {
  Accessibility,
  Baby,
  Briefcase,
  Building,
  FileText,
  GraduationCap,
  HandHeart,
  HandHelping,
  Heart,
  Home,
  LayoutDashboard,
  LucideIcon,
  MessageSquareText,
  Settings2,
  ShieldCheck,
  UserRoundCog,
  Users,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  orgType?: string[];
  children?: NavigationItem[];
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const sidebarConfig: Record<
  | "CHILDREN_AFFAIRS"
  | "SOCIAL_AFFAIRS"
  | "WOMENS"
  | "SUPER_ADMIN"
  | "BUREAU_HEAD"
  | "CARE_CENTERS_PORTAL",
  NavigationSection[]
> = {
  CHILDREN_AFFAIRS: [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", url: "/adoption/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Adoption Management",
      items: [
        { title: "Children", url: "/adoption/children", icon: Baby },
        {
          title: "Care Centers",
          url: "/adoption/care-centers",
          icon: Building,
        },
        {
          title: "Adoption Requests",
          url: "/adoption/adoption-requests",
          icon: FileText,
        },
      ],
    },
    {
      title: "Additional Services",
      items: [
        {
          title: "Home Visit",
          url: "/adoption/home-visit",
          icon: Home,
        },
        {
          title: "Benefits",
          url: "/adoption/benefits",
          icon: Heart,
        },
        {
          title: "Assisted Homes",
          url: "/adoption/assisted-homes",
          icon: Home,
        },
        {
          title: "Adera",
          url: "/adoption/adera",
          icon: Building,
        },
      ],
    },
  ],

  SOCIAL_AFFAIRS: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/social-affairs/dashboard",
          icon: LayoutDashboard,
        },
        { title: "Edir", url: "/social-affairs/edir/list", icon: HandHelping },
        {
          title: "Idir Councils",
          url: "/social-affairs/edir/councils",
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: "Elderly & Disabled",
      items: [
        {
          title: "Beneficiaries",
          icon: Users,
          children: [
            {
              title: "Disabled Persons",
              url: "/social-affairs/elderly-and-disabled/beneficiaries/disabled",
              icon: Accessibility,
            },
            {
              title: "Elderly Persons",
              url: "/social-affairs/elderly-and-disabled/beneficiaries/elderly",
              icon: Users,
            },
          ],
        },
        {
          title: "Support Services",
          url: "/social-affairs/elderly-and-disabled/services",
          icon: HandHeart,
        },
        {
          title: "Training Sessions",
          url: "/social-affairs/elderly-and-disabled/training",
          icon: GraduationCap,
        },
        {
          title: "Job Placements",
          url: "/social-affairs/elderly-and-disabled/jobs",
          icon: Briefcase,
        },
      ],
    },
  ],

  WOMENS: [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", url: "/womens/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Women Services",
      items: [
        {
          title: "Support Services",
          url: "/womens/support-service",
          icon: HandHeart,
        },
        { title: "Women List", url: "/womens/women-list", icon: Users },
        {
          title: "Women Associations",
          url: "/womens/women-associations",
          icon: Users,
        },
      ],
    },
  ],

  SUPER_ADMIN: [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", url: "/super-admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "User Management",
          url: "/super-admin/user-management",
          icon: Users,
        },
        {
          title: "Audit Logs",
          url: "/super-admin/audit-logs",
          icon: ShieldCheck,
        },
        { title: "Backups", url: "/super-admin/backups", icon: Settings2 },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Landing Page",
          url: "/super-admin/landing-page",
          icon: Settings2,
        },
      ],
    },
  ],

  BUREAU_HEAD: [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", url: "/bureau-head", icon: LayoutDashboard },
        { title: "Sub City", url: "/bureau-head/sub-city", icon: Building },
        { title: "Complaints", url: "/complaints", icon: MessageSquareText },
      ],
    },
    {
      title: "Modules",
      items: [
        {
          title: "Adoption",
          icon: Baby,
          children: [
            {
              title: "Dashboard",
              url: "/adoption/dashboard",
              icon: LayoutDashboard,
            },
            { title: "Children", url: "/adoption/children", icon: Baby },
            {
              title: "Care Centers",
              url: "/adoption/care-centers",
              icon: Building,
            },
            {
              title: "Adoption Requests",
              url: "/adoption/adoption-requests",
              icon: FileText,
            },
          ],
        },
        {
          title: "Social Affairs",
          icon: HandHeart,
          children: [
            {
              title: "Dashboard",
              url: "/social-affairs/dashboard",
              icon: LayoutDashboard,
            },
            {
              title: "Edir",
              url: "/social-affairs/edir/list",
              icon: HandHelping,
            },
            {
              title: "Idir Councils",
              url: "/social-affairs/edir/councils",
              icon: ShieldCheck,
            },
            {
              title: "Elderly & Disabled",
              url: "/social-affairs/elderly-and-disabled/beneficiaries/elderly",
              icon: Users,
            },
          ],
        },
        {
          title: "Women",
          icon: Users,
          children: [
            {
              title: "Dashboard",
              url: "/womens/dashboard",
              icon: LayoutDashboard,
            },
            {
              title: "Support Services",
              url: "/womens/support-service",
              icon: HandHeart,
            },
            { title: "Women List", url: "/womens/women-list", icon: Users },
          ],
        },
        {
          title: "Admin",
          icon: UserRoundCog,
          children: [
            {
              title: "Dashboard",
              url: "/super-admin/dashboard",
              icon: LayoutDashboard,
            },
            {
              title: "User Management",
              url: "/super-admin/user-management",
              icon: Users,
            },
            { title: "Audit Logs", url: "/super-admin/audit-logs", icon: ShieldCheck },
            { title: "Backups", url: "/super-admin/backups", icon: Settings2 },
            {
              title: "Landing Page",
              url: "/super-admin/landing-page",
              icon: Settings2,
            },
          ],
        },
      ],
    },
  ],

  CARE_CENTERS_PORTAL: [
    {
      title: "Care Center",
      items: [
        { title: "Dashboard", url: "/care-centers-portal", icon: LayoutDashboard },
        { title: "Add Child", url: "/care-centers-portal/add-child", icon: Baby },
        { title: "Reports", url: "/care-centers-portal/reports", icon: FileText },
        {
          title: "Monthly Report",
          url: "/care-centers-portal/monthly-report",
          icon: FileText,
        },
      ],
    },
  ],
};
