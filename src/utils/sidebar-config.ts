import {
  Accessibility,
  Baby,
  BarChart3,
  Briefcase,
  Building,
  FileDiff,
  FileText,
  HandHeart,
  HandHelping,
  Heart,
  Home,
  HouseIcon,
  LayoutDashboard,
  Map,
  Settings,
  Settings2,
  User,
  Users,
  GraduationCap,
  MessageSquareText,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  url: string;
  icon: any;
  orgType?: string[];
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const sidebarConfig: Record<
  | "GLOBAL"
  | "CHILDREN_AFFAIRS"
  | "SOCIAL_AFFAIRS"
  | "WOMENS"
  | "SUPER_ADMIN"
  | "BUREAU_HEAD"
  | "WOREDA"
  | "SUBCITY"
  | "CARE_CENTERS_PORTAL",
  NavigationSection[]
> = {
  GLOBAL: [
    {
      title: "Global",
      items: [
        {
          title: "Adoption",
          url: "/adoption/dashboard",
          icon: Baby,
        },
        {
          title: "Social Affairs",
          url: "/social-affairs/socials/dashboard",
          icon: HandHeart,
        },
        {
          title: "Women",
          url: "/womens/dashboard",
          icon: Users,
        },
        {
          title: "Bureau Head",
          url: "/bureau-head",
          icon: Users,
        },
        {
          title: "Super Admin",
          url: "/super-admin/dashboard",
          icon: Settings,
        },
        {
          title: "Super Admin management",
          url: "/super-admin/user-management",
          icon: Settings,
        },
      ],
    },
  ],

  CHILDREN_AFFAIRS: [
    {
      title: "Adoption Moduel Services",
      items: [
        { title: "Dashboard", url: "/adoption/dashboard", icon: Home },
        { title: "Children", url: "/adoption/children", icon: Baby },
        {
          title: "Care Centers",
          url: "/adoption/care-centers",
          icon: Building,
        },
        // { title: "Benefits", url: "/adoption/benefits", icon: Heart },
        // {
        //   title: "Assisted homes",
        //   url: "/adoption/assisted-homes",
        //   icon: Home,
        // },
        // { title: "Adera", url: "/adoption/adera", icon: HouseIcon },
        {
          title: "Adoption Requests",
          url: "/adoption/adoption-requests",
          icon: FileText,
        },
      ],
    },
  ],

  SOCIAL_AFFAIRS: [
    {
      title: "Social Affairs",
      items: [
        {
          title: "Dashboard",
          url: "/social-affairs/dashboard",
          icon: LayoutDashboard,
        },
        { title: "Edir", url: "/social-affairs/edir/list", icon: HandHelping },
      ],
    },
    {
      title: "Elderly & Disabled",
      items: [
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
      title: "Womens",
      items: [
        { title: "Dashboard", url: "/womens/dashboard", icon: Home },
        {
          title: "Support Services",
          url: "/womens/support-service",
          icon: HandHeart,
        },
        // {
        //   title: "Women Associations",
        //   url: "/womens/women-associations",
        //   icon: Users,
        // },
        { title: "Women List", url: "/womens/women-list", icon: Users },
      ],
    },
  ],

  SUPER_ADMIN: [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", url: "/super-admin/dashboard", icon: Home },
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
          icon: Settings2,
        },
        {
          title: "Backups",
          url: "/super-admin/backups",
          icon: Settings2,
        },
        {
          title: "General Settings",
          url: "/super-admin/general-settings",
          icon: Settings2,
        },
      ],
    },
  ],

  BUREAU_HEAD: [
    {
      title: "Global",
      items: [
        { title: "Dashboard", url: "/bureau-head", icon: Home },

        { title: "Sub city", url: "/bureau-head/sub-city", icon: Baby },
        {
          title: "Adoption",
          url: "/adoption/dashboard",
          icon: FileText,
        },
        {
          title: "Social Affairs",
          url: "/social-affairs/dashboard",
          icon: FileText,
        },
        {
          title: "Complaints",
          url: "/complaints",
          icon: MessageSquareText,
        },
        { title: "Women", url: "/womens/dashboard", icon: User },
        { title: "Super Admin", url: "/super-admin/dashboard", icon: FileText },
      ],
    },
  ],
  WOREDA: [
    {
      title: "Woreda",
      items: [{ title: "Local Dashboard", url: "/woreda", icon: Map }],
    },
  ],

  SUBCITY: [
    {
      title: "Sub  city",
      items: [{ title: "Subcity Dashboard", url: "/subcity", icon: Building }],
    },
  ],
  CARE_CENTERS_PORTAL: [
    {
      title: "Care Centers Portal",
      items: [
        { title: "Dashboard", url: "/care-centers-portal", icon: Home },
        { title: "Children", url: "/care-centers-portal", icon: Baby },
      ],
    },
  ],
};
