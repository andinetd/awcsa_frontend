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
import { LOGIN_ROUTE } from "@/lib/auth-routes";
import { getSidebarItems } from "@/utils/sidebar-helpers";
import { NavigationItem, NavigationSection } from "@/utils/sidebar-config";
import {
  ChevronRight,
  LogOut,
  Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { BeneficiaryRegisterTrigger } from "./beneficiary-register-trigger";
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
          size="sm"
          className={cn(
            "h-8 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#0E2646] transition-colors rounded-sm",
            hasActiveChild &&
              "bg-[#142A48] text-white font-semibold",
          )}
        >
          {item.icon && (
            <item.icon
              className={cn(
                "size-4 shrink-0",
                hasActiveChild
                  ? "text-[#38BDF8]"
                  : "text-slate-400",
              )}
            />
          )}
          <span className="text-xs truncate">{itemTitle}</span>
          <ChevronRight
            className={cn(
              "ml-auto size-3.5 shrink-0 transition-transform duration-200",
              isOpen && "rotate-90",
              hasActiveChild
                ? "text-[#38BDF8]"
                : "text-slate-500",
            )}
          />
        </SidebarMenuButton>
        {isOpen && (
          <SidebarMenuSub className="border-l border-white/10 ml-3.5 pl-2 py-0.5 space-y-0.5">
            {(item.children || []).map((child, index) => {
              const childActive = isItemActive(pathname, child.url);
              return (
                <SidebarMenuSubItem key={(child.title || "") + index}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={childActive}
                    size="sm"
                    className={cn(
                      "h-7 text-xs font-normal text-slate-400 hover:text-white hover:bg-[#0E2646] transition-colors rounded-sm",
                      childActive && "bg-[#142A48] text-white font-semibold",
                    )}
                  >
                    <Link href={child.url || "#"} className="flex items-center gap-2">
                      {child.icon && (
                        <child.icon
                          className={cn(
                            "size-3.5 shrink-0",
                            childActive
                              ? "text-[#38BDF8]"
                              : "text-slate-500",
                          )}
                        />
                      )}
                      <span className="text-xs truncate">
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
        size="sm"
        className={cn(
          "h-8 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#0E2646] transition-colors rounded-sm",
          isActive && "bg-[#142A48] text-white font-semibold shadow-2xs",
        )}
      >
        <Link
          ref={itemRef}
          href={item?.url || "#"}
          className={cn(
            "flex items-center gap-2 w-full",
            isActive && "text-white font-semibold",
          )}
        >
          {item?.icon && (
            <item.icon
              className={cn(
                "size-4 shrink-0",
                isActive
                  ? "text-[#38BDF8]"
                  : "text-slate-400",
              )}
            />
          )}
          <span className="text-xs truncate">{itemTitle}</span>
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

  const labelText = t.has(`sections.${section.title}`)
    ? t(`sections.${section.title}`)
    : section.title;

  const showRegisterTrigger = (section.items || []).some(
    (item) => item.showRegisterTrigger,
  );

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
        <SidebarGroupLabel className="px-0 pt-0 h-auto text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
          {labelText}
        </SidebarGroupLabel>
        {showRegisterTrigger && <BeneficiaryRegisterTrigger />}
      </div>
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
      logout({ notifyServer: true });
      router.replace(LOGIN_ROUTE);
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
  }, [orgUnit, pathname, user, userRole, department, userPermissions, entity]);

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
            <Link href={"/"} className="flex w-full items-center gap-2.5 px-2 py-1">
              <img
                src="/assets/WCSA_logo.jpg"
                alt="WCSA Bureau"
                className={cn(
                  "shrink-0 rounded-full border border-white/10",
                  isCollapsed ? "h-7 w-7" : "h-8 w-8",
                )}
              />
              {!isCollapsed && (
                <div className="flex min-w-0 flex-col text-left leading-tight">
                  <span className="truncate text-sm font-bold text-white tracking-tight">
                    WCSA Bureau
                  </span>
                  <span className="truncate text-[11px] text-slate-400 font-medium">
                    Addis Ababa City Government
                  </span>
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
                      <span className="truncate text-xs font-semibold text-slate-200">
                        {user?.email}
                      </span>
                      <span className="truncate text-[11px] text-slate-400">
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
                  <div className="flex flex-col gap-0.5 px-2 py-1.5 leading-snug">
                    <p className="text-xs font-semibold text-foreground">
                      {user?.email}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
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