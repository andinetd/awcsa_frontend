"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { getSidebarItems } from "@/utils/sidebar-helpers";
import { Home, LogOut, User, LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export function DynamicSidebar() {
  const {
    user,
    userRole,
    logout,
    orgUnit,
    userPermissions,
    entity,
    department,
  } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("sidebar");

  const handleLogout = async () => {
    try {
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sections = useMemo(() => {
    const entityRole = (entity as any)?.role || "";
    const baseSections = getSidebarItems(
      orgUnit,
      pathname,
      user,
      userRole,
      userPermissions,
      entityRole,
      department,
    );

    const isSystemUser = department === "SYSTEM";

    if (isSystemUser) {
      return [
        {
          title: "Home",
          items: [
            {
              title: "Home",
              url: "/bureau-head",
              icon: LayoutDashboard,
            },
          ],
        },
        ...baseSections,
      ];
    }
    return baseSections;
  }, [orgUnit, pathname, user, userRole, department]);

  return (
    <Sidebar className="">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="p-1 border-b border-slate-100">
            <Link href={"/"}>
              <SidebarMenuButton
                size="lg"
                className="flex items-center gap-2 hover:bg-slate-50 hover:underline transition-colors cursor-pointer p-2"
              >
                {/* <Building className="size-4" /> */}
                <div>
                  <img
                    src="/assets/WCSA_logo.jpg"
                    alt="Office logo"
                    width={"50px"}
                    height={"50px"}
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold">
                    {t("header.systemName")}
                  </span>
                  <span className="text-xs">
                    {orgUnit?.type && t.has(`orgTypes.${orgUnit.type}`)
                      ? t(`orgTypes.${orgUnit.type}`)
                      : orgUnit?.type}
                  </span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="">
        {(sections || []).map((section) => (
          <SidebarGroup key={section?.title || Math.random()}>
            <SidebarGroupLabel>
              {t.has(`sections.${section?.title}`)
                ? t(`sections.${section?.title}`)
                : section?.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {(section?.items || []).map((item, index) => {
                  const isActive = pathname.endsWith(item?.url || "");
                  const itemTitle = t.has(`items.${item?.title}`)
                    ? t(`items.${item?.title}`)
                    : item?.title;

                  return (
                    <SidebarMenuItem key={(item?.title || "") + index}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        <a href={item?.url || "#"}>
                          {item?.icon && (
                            <item.icon
                              className={`w-5 h-5 ${
                                isActive ? "text-blue-600" : "text-slate-400"
                              }`}
                            />
                          )}
                          <span>{itemTitle}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <User className="size-4" />
              <div className="flex flex-col text-left flex-1">
                <span className="font-semibold truncate">{user?.email}</span>
                {/* <span className="text-xs truncate">{user?.email}</span> */}
                {/* {user?.email && (
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                )} */}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="size-4" />
              <span>{t("footer.logout")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
