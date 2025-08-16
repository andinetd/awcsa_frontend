import { DeputyBureau } from "@/types";
import {
  Baby,
  BarChart3,
  Briefcase,
  Building,
  FileDiff,
  FileText,
  HandHeart,
  Heart,
  Home,
  HouseIcon,
  Settings,
  Settings2,
  Shield,
  User,
  Users,
} from "lucide-react";
import { PermissionType } from "./permission";

export interface NavigationItem {
  title: string;
  url: string;
  icon: any;
  permissions?: PermissionType[];
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

//!! sections to each sidebar can be added
export const navigationConfig: Record<DeputyBureau, NavigationSection[]> = {
  SUPER_ADMIN: [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", url: "/super-admin", icon: Home },
        {
          title: "Analytics",
          url: "/super-admin/analytics",
          icon: BarChart3,
        },
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
          title: "Form Field Settings",
          url: "/super-admin/form-fields",
          icon: FileDiff,
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
      title: "Management",
      items: [
        { title: "Dashboard", url: "/bureau-head", icon: Home },

        { title: "Sub city", url: "/bureau-head/sub-city", icon: Baby },
        {
          title: "Adoption Module",
          url: "/adoption/dashboard",
          icon: FileText,
        },
        {
          title: "Social Module",
          url: "/social-affairs/socials/dashboard",
          icon: FileText,
        },
        { title: "Women", url: "/womens/dashboard", icon: User },
        { title: "Super Admin", url: "/super-admin", icon: FileText },
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
        { title: "Adoption Requests", url: "/adoption/adoption-requests", icon: FileText },
      ],
    },
  ],
  SOCIAL_AFFAIRS: [
    {
      title: "Social Affairs Services",
      items: [
        {
          title: "Dashboard",
          url: "/social-affairs/socials/dashboard",
          icon: Home,
        },
        { title: "Edir", url: "/social-affairs/edir/dashboard", icon: Users },
        {
          title: "Elderly & Disabled",
          url: "/social-affairs/elderly-and-disabled/dashboard",
          icon: Heart,
        },
        {
          title: "Dashboard",
          url: "/social-affairs/elderly-and-disabled/dashboard",
          icon: Home,
        },
        {
          title: "Beneficiaries",
          url: "/social-affairs/elderly-and-disabled/beneficiaries",
          icon: Users,
        },
        {
          title: "Benefit Tracking",
          url: "/social-affairs/elderly-and-disabled/benefit-tracking",
          icon: Heart,
        },
        {
          title: "Jobs",
          url: "/social-affairs/elderly-and-disabled/jobs",
          icon: Briefcase,
        },
      ],
    },
  ],
  CLIENT: [],
  EDIR: [
    {
      title: "Edir Services",
      items: [
        {
          title: "Dashboard",
          url: "/social-affairs/edir/dashboard",
          icon: Home,
        },
        {
          title: "Generic setup",
          url: "/social-affairs/edir/generic-setup",
          icon: Settings,
        },
        {
          title: "Edir List",
          url: "/social-affairs/edir/list",
          icon: Heart,
        },
      ],
    },
  ],
  // "SOCIAL_AFFAIRS": [
  //   {
  //     title: "Elderly and Disabled Services",
  //     items: [
  //       {
  //         title: "Dashboard",
  //         url: "/social-affairs/elderly-and-disabled/dashboard",
  //         icon: Home,
  //       },
  //       {
  //         title: "Beneficiaries",
  //         url: "/social-affairs/elderly-and-disabled/beneficiaries",
  //         icon: Users,
  //       },
  //       {
  //         title: "Benefit Tracking",
  //         url: "/social-affairs/elderly-and-disabled/benefit-tracking",
  //         icon: Heart,
  //       },
  //       {
  //         title: "Jobs",
  //         url: "/social-affairs/elderly-and-disabled/jobs",
  //         icon: Briefcase,
  //       },
  //     ],
  //   },
  // ],

  WOMEN_AFFAIRS: [
    {
      title: "Women Module Services",
      items: [
        { title: "Dashboard", url: "/womens/dashboard", icon: Home },
        { title: "Women List", url: "/womens/women-list", icon: Users },
        {
          title: "Associations",
          url: "/womens/women-associations",
          icon: Building,
        },
        { title: "Support", url: "/womens/support-service", icon: HandHeart },
      ],
    },
  ],
};
