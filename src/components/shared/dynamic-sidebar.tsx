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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { getSidebarItems } from "@/utils/sidebar-helpers";
import { NavigationItem, NavigationSection } from "@/utils/sidebar-config";
import {
  ChevronRight,
  LogOut,
  Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const LOCALE_PREFIX = /^\/[a-z]{2}\//;

function cleanPathname(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX, "/");
}

function isItemActive(pathname: string, url?: string): boolean {
  if (!url) return false;
  const cleanPath = cleanPathname(pathname);
  return cleanPath === url || cleanPath.startsWith(`${url}/`);
}

function getInitials(email?: string): string {
  if (!email) return "?";
  const local = email.split("@")[0] || email;
  const parts = local.split(/[._-]/).filter(Boolean);
  const letters = parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return letters || local.slice(0, 2).toUpperCase();
}

type SidebarT = ReturnType<typeof useTranslations>;

interface SidebarNavItemProps {
  item: NavigationItem;
  pathname: string;
  t: SidebarT;
  isOpen: boolean;
  onToggle: () => void;
}

function SidebarNavItem({
  item,
  pathname,
  t,
  isOpen,
  onToggle,
}: SidebarNavItemProps) {
  const itemRef = useRef<HTMLAnchorElement | null>(null);
  const isActive = isItemActive(pathname, item.url);
  const hasActiveChild = (item.children || []).some((child) =>
    isItemActive(pathname, child.url),
  );

  const itemTitle = t.has(`items.${item.title}`)
    ? t(`items.${item.title}`)
    : item.title;

  useEffect(() => {
    if (isActive) {
      itemRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [isActive, pathname]);

  if (item.children?.length) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={itemTitle}
          isActive={hasActiveChild}
          onClick={onToggle}
          className={cn(
            hasActiveChild &&
              "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
          )}
        >
          {item.icon && (
            <item.icon
              className={cn(
                "size-4 shrink-0",
                hasActiveChild
                  ? "text-sidebar-primary"
                  : "text-sidebar-foreground/50",
              )}
            />
          )}
          <span>{itemTitle}</span>
          <ChevronRight
            className={cn(
              "ml-auto size-4 shrink-0 transition-transform duration-200",
              isOpen && "rotate-90",
              hasActiveChild
                ? "text-sidebar-primary"
                : "text-sidebar-foreground/40",
            )}
          />
        </SidebarMenuButton>
        {isOpen && (
          <SidebarMenuSub>
            {(item.children || []).map((child, index) => {
              const childActive = isItemActive(pathname, child.url);
              return (
                <SidebarMenuSubItem key={(child.title || "") + index}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={childActive}
                    className={cn(
                      childActive && "font-medium text-sidebar-foreground",
                    )}
                  >
                    <Link href={child.url || "#"}>
                      {child.icon && (
                        <child.icon
                          className={cn(
                            "size-4 shrink-0",
                            childActive
                              ? "text-sidebar-primary"
                              : "text-sidebar-foreground/50",
                          )}
                        />
                      )}
                      <span>
                        {t.has(`items.${child.title}`)
                          ? t(`items.${child.title}`)
                          : child.title}
                      </span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={itemTitle}
        isActive={isActive}
        className={cn(isActive && "font-medium")}
      >
        <Link
          ref={itemRef}
          href={item?.url || "#"}
          className={cn(
            "relative",
            isActive &&
              "bg-sidebar-accent text-sidebar-accent-foreground font-medium after:absolute after:left-0 after:top-1/2 after:h-5 after:w-0.5 after:-translate-y-1/2 after:rounded-full after:bg-sidebar-primary",
          )}
        >
          {item?.icon && (
            <item.icon
              className={cn(
                "size-4 shrink-0",
                isActive
                  ? "text-sidebar-primary"
                  : "text-sidebar-foreground/50",
              )}
            />
          )}
          <span>{itemTitle}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

interface SidebarSectionProps {
  section: NavigationSection;
  pathname: string;
  t: SidebarT;
}

function SidebarSection({ section, pathname, t }: SidebarSectionProps) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const item of section.items) {
      if (item.children?.some((child) => isItemActive(pathname, child.url))) {
        initial[item.title] = true;
      }
    }
    return initial;
  });

  useEffect(() => {
    for (const item of section.items) {
      if (
        item.children?.some((child) => isItemActive(pathname, child.url)) &&
        !openMap[item.title]
      ) {
        setOpenMap((prev) => ({ ...prev, [item.title]: true }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggle = (title: string) => {
    setOpenMap((prev) => {
      const next: Record<string, boolean> = {};
      for (const key of Object.keys(prev)) next[key] = false;
      next[title] = !prev[title];
      return next;
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-3 pt-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
        {t.has(`sections.${section.title}`)
          ? t(`sections.${section.title}`)
          : section.title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {(section.items || []).map((item, index) => (
            <SidebarNavItem
              key={(item.title || "") + index}
              item={item}
              pathname={pathname}
              t={t}
              isOpen={!!openMap[item.title]}
              onToggle={() => toggle(item.title)}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

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
  const { state } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const isCollapsed = state === "collapsed";

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
    return getSidebarItems(
      orgUnit,
      pathname,
      user,
      userRole,
      userPermissions,
      entityRole,
      department,
    );
  }, [orgUnit, pathname, user, userRole, department]);

  const roleLabel =
    userRole && t.has(`roles.${userRole}`) ? t(`roles.${userRole}`) : userRole;

  const accountLabel = orgUnit?.type && t.has(`orgTypes.${orgUnit.type}`)
    ? t(`orgTypes.${orgUnit.type}`)
    : roleLabel;

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-center px-1 py-2">
            <Link href={"/"} className="flex w-full items-center gap-2">
              <img
                src="/assets/WCSA_logo.jpg"
                alt="Office logo"
                className={cn(
                  "shrink-0 rounded-md",
                  isCollapsed ? "h-7 w-7" : "h-9 w-9",
                )}
              />
              {!isCollapsed && (
                <div className="flex min-w-0 flex-col text-left leading-tight">
                  <span className="truncate text-sm font-semibold text-sidebar-foreground">
                    {t("header.systemName")}
                  </span>
                  {accountLabel && (
                    <span className="truncate text-xs text-sidebar-foreground/60">
                      {accountLabel}
                    </span>
                  )}
                </div>
              )}
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-1 px-2">
        {(sections || []).map((section: NavigationSection) => (
          <SidebarSection
            key={section?.title}
            section={section}
            pathname={pathname}
            t={t}
          />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={user?.email}
                  className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-7 shrink-0 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-sidebar-primary text-[11px] font-semibold text-sidebar-primary-foreground">
                      {getInitials(user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex min-w-0 flex-1 flex-col text-left leading-tight">
                      <span className="truncate text-sm font-medium text-sidebar-foreground">
                        {user?.email}
                      </span>
                      <span className="truncate text-xs text-sidebar-foreground/60">
                        {accountLabel}
                      </span>
                    </div>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="start"
                sideOffset={8}
                className="w-56 rounded-lg"
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex flex-col gap-1 px-2 py-1.5 leading-snug">
                    <p className="text-sm font-medium text-foreground">
                      {user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {accountLabel}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userRole === "Super_Admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/super-admin/general-settings">
                        <Settings className="size-4" />
                        {t("footer.settings")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4" />
                  {t("footer.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}