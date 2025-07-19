import {
  Home,
  Users,
  Baby,
  Heart,
  Building,
  BarChart3,
  Shield,
  HandHeart,
  FileText,
  User,
  HouseIcon,
} from "lucide-react";
import type { UserRole } from "@/hooks/useCurrentRole";

export interface NavigationItem {
  title: string;
  url: string;
  icon: any;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

//!! sections to each sidebar can be added
export const navigationConfig: Record<UserRole, NavigationSection[]> = {
  "super-admin": [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", url: "/super-admin", icon: Home },
        { title: "Analytics", url: "/super-admin/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "Management",
      items: [
        { title: "Users", url: "/super-admin/users", icon: Users },
        { title: "Roles", url: "/super-admin/roles", icon: Shield },
      ],
    },
  ],
  "bureau-head": [
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
  adoption: [
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
      ],
    },
  ],
  "social-affairs": [
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
      ],
    },
  ],
  womens: [
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
