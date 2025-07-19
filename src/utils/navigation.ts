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
        { title: "Reports", url: "/bureau-head/reports", icon: FileText },
      ],
    },
  ],
  adoption: [
    {
      title: "Dashboard",
      items: [{ title: "Overview", url: "/adoption/dashboard", icon: Home }],
    },
    {
      title: "Services",
      items: [
        { title: "Children", url: "/adoption/children", icon: Baby },
        {
          title: "Care Centers",
          url: "/adoption/care-centers",
          icon: Building,
        },
        { title: "Benefits", url: "/adoption/benefits", icon: Heart },
      ],
    },
  ],
  "social-affairs": [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          url: "/social-affairs/socials/dashboard",
          icon: Home,
        },
      ],
    },
    {
      title: "Services",
      items: [
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
      title: "Dashboard",
      items: [{ title: "Overview", url: "/womens/dashboard", icon: Home }],
    },
    {
      title: "Services",
      items: [
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
