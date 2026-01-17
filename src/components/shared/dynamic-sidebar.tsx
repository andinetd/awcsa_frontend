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
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export function DynamicSidebar() {
  const { user, logout, orgUnit } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sections = useMemo(
    () => (orgUnit ? getSidebarItems(orgUnit, pathname) : []),
    [orgUnit, pathname]
  );

  return (
    <Sidebar className="">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="p-1 border-b border-slate-100">
            <Link href={"/"}>
              <SidebarMenuButton size="lg" className="flex items-center gap-2">
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
                  <span className="font-semibold">WCSA System</span>
                  <span className="text-xs capitalize">
                    {/* {user.role.replace("-", " ")} */}
                    {orgUnit?.type}
                  </span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="">
        {sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item, index) => {
                  const isActive = pathname.endsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title + index}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <a href={item.url}>
                          <item.icon
                            className={`w-5 h-5 ${
                              isActive ? "text-blue-600" : "text-slate-400"
                            }`}
                          />
                          <span>{item.title}</span>
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
              <span>{false ? "Logging out..." : "Logout"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
