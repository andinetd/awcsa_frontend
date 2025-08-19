import {
  Baby,
  BarChart3,
  Building,
  FileDiff,
  FileText,
  Heart,
  Home,
  HouseIcon,
  Settings,
  Settings2,
  User,
  Users,
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
          icon: Users,
        },
        {
          title: "Social Affairs",
          url: "/social-affairs/socials/dashboard",
          icon: Building,
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
          url: "/super-admin/general-settings",
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
        { title: "Benefits", url: "/adoption/benefits", icon: Heart },
        {
          title: "Assisted homes",
          url: "/adoption/assisted-homes",
          icon: Home,
        },
        { title: "Adera", url: "/adoption/adera", icon: HouseIcon },
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
          url: "/social-affairs/socials/dashboard",
          icon: Users,
        },

        { title: "Edir", url: "/social-affairs/edir/list", icon: Users },
        {
          title: "Elderly",
          url: "/social-affairs/elderly-and-disabled/dashboard",
          icon: Users,
        },

        {
          title: "Beneficiaries",
          url: "/social-affairs/elderly-and-disabled/beneficiaries",
          icon: Users,
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
          icon: Users,
        },
        {
          title: "Women Associations",
          url: "/womens/women-associations",
          icon: Users,
        },
        { title: "Women List", url: "/womens/women-list", icon: Users },
      ],
    },
  ],

  SUPER_ADMIN: [
    {
      title: "Overview",
      items: [{ title: "Dashboard", url: "/super-admin", icon: Home }],
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
        {
          title: "Adoption",
          url: "/adoption/dashboard",
          icon: Users,
        },
        {
          title: "Social Affairs",
          url: "/social-affairs/socials/dashboard",
          icon: Building,
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
          url: "/super-admin/general-settings",
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
