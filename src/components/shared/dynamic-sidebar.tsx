"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Building, LogOut, User } from "lucide-react";
import { navigationConfig } from "@/utils/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import Link from "next/link";

export function DynamicSidebar() {
  // const { user, logout, loading } = useAuthStore();

  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     window.location.href = "/login";
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  // if (!user) {
  //   return (
  //     <Sidebar>
  //       <SidebarContent>
  //         <div className="flex items-center justify-center h-full">
  //           <p className="text-sm text-muted-foreground">
  //             {loading ? "Loading..." : "Please log in"}
  //           </p>
  //         </div>
  //       </SidebarContent>
  //     </Sidebar>
  //   );
  // }

  // const navigation = navigationConfig[user.role] || [];
  // const mockNavigation = navigationConfig["bureau-head"];
  const role = useCurrentRole();
  const sections = role ? navigationConfig[role] : [];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" >
              {/* <Building className="size-4" /> */}
              <Link href={"/"} className="flex items-center gap-2">
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
                    {role}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <User className="size-4" />
              <div className="flex flex-col text-left flex-1">
                <span className="font-semibold truncate">{user.name}</span>
                <span className="text-xs truncate">{user.email}</span>
                {user.department && (
                  <span className="text-xs text-muted-foreground truncate">
                    {user.department}
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} disabled={loading}>
              <LogOut className="size-4" />
              <span>{loading ? "Logging out..." : "Logout"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  );
}
