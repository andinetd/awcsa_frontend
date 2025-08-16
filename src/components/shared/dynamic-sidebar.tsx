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
import { navigationConfig, NavigationItem } from "@/utils/navigation";
import { useCurrentRole, useEmployeModule } from "@/hooks/useCurrentRole";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function DynamicSidebar() {
  const {user, userRole, userPermissions, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
  const module = useEmployeModule();
  const permissions = userPermissions || [];
  const pathname = usePathname();
  // const sections = role && navigationConfig[role] ? navigationConfig[role] : [];
  const sections =
    module && navigationConfig[module] ? navigationConfig[module] : [];

  function hasPermission(item: NavigationItem): boolean {
    if (!item.permissions) return true;
    return item.permissions.every((p) => permissions.includes(p));
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
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
                    {role}
                  </span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.filter(hasPermission).map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground"
                        )}
                      >
                        <a href={item.url}>
                          <item.icon />
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
                <span className="text-xs truncate">{user?.email}</span>
                {user?.email && (
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                )}
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
