"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { User, UserFilters } from "@/types/super-admin";
import { useGetUsers, useGetUserFormData } from "@/hooks/super-admin";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./_components/columns";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Search } from "lucide-react";
import { UserDialog } from "./_components/user-dialog";
import { ChangeRoleDialog } from "./_components/change-role-dialog";
import { ChangePermissionsDialog } from "./_components/change-permissions-dialog";
import { RolesPanel } from "./_components/roles-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

const ACTIVE_STATUS = ["", "ACTIVE", "INACTIVE", "LOCKED"] as const;
const DEPARTMENTS = [
  "",
  "CHILDREN_AFFAIRS",
  "WOMEN_AFFAIRS",
  "SOCIAL_AFFAIRS",
  "SYSTEM",
  "EDIR",
] as const;

export default function UserManagementPage() {
  const t = useTranslations("super-admin.userManagement");
  const ft = useTranslations("super-admin.userManagement.filters");
  const router = useRouter();
  const pathname = usePathname();

  const [tab, setTab] = useState<"users" | "roles">("users");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);

  // Sync tab with URL (?tab=roles) without extra suspense boundary
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "roles") setTab("roles");
  }, []);

  const handleTabChange = useCallback(
    (value: string) => {
      const nextTab = value === "roles" ? "roles" : "users";
      setTab(nextTab);
      router.replace(
        nextTab === "roles" ? `${pathname}?tab=roles` : pathname,
        { scroll: false },
      );
    },
    [router, pathname],
  );

  // Server-side table state
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [department, setDepartment] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filters: UserFilters = useMemo(
    () => ({
      page,
      limit: pageSize,
      search: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : status,
      roleId: roleFilter !== "all" && roleFilter ? Number(roleFilter) : undefined,
      department: department === "all" ? undefined : department,
    }),
    [page, pageSize, debouncedSearch, status, roleFilter, department],
  );

  const { data, isLoading, refetch } = useGetUsers(filters);
  const { data: formData } = useGetUserFormData();
  const users = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  const resetFilters = () => {
    setSearchInput("");
    setStatus("all");
    setRoleFilter("all");
    setDepartment("all");
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleUserSaved = () => {
    setDialogOpen(false);
    refetch();
  };

  const columns = getColumns({
    onUserUpdated: refetch,
    onEdit: handleEditUser,
    onChangeRole: (user: User) => {
      setSelectedUser(user);
      setRoleDialogOpen(true);
    },
    onChangePermissions: (user: User) => {
      setSelectedUser(user);
      setPermissionsDialogOpen(true);
    },
    t: (key) => t(`table.${key}`),
  });

  return (
    <div className="h-full flex-1 flex-col space-y-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-1 border-b border-[#E3E7EB] pb-4">
        <div className="flex items-center gap-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
          <span>SUPER ADMIN</span>
          <span>/</span>
          <span className="text-[#1769AA] font-bold">{t("title")}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A] font-mono uppercase">
              {t("title")}
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              {t("description")}
            </p>
          </div>
          {tab === "users" && (
            <Button
              onClick={handleAddUser}
              className="h-8 rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white text-xs font-semibold shadow-2xs gap-1.5 px-3 self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" /> {t("addUser")}
            </Button>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-slate-100/80 p-1 border border-[#E3E7EB] rounded-xs h-9">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-3"
            >
              {t("tabs.users")}
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="data-[state=active]:bg-white data-[state=active]:text-[#0B1F3A] data-[state=active]:shadow-2xs rounded-xs text-xs font-medium py-1 px-3"
            >
              {t("tabs.roles")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users" className="space-y-4 mt-0">
          <div className="flex flex-col gap-2.5 md:flex-row md:items-center p-3 bg-white border border-[#E3E7EB] rounded-xs shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder={ft("searchPlaceholder")}
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                className="pl-8 h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="md:w-[150px] h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                <SelectValue placeholder={ft("status")} />
              </SelectTrigger>
              <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md">
                <SelectItem value="all" className="text-xs">{ft("allStatuses")}</SelectItem>
                {ACTIVE_STATUS.filter((s) => s).map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {ft(`statuses.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="md:w-[180px] h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                <SelectValue placeholder={ft("role")} />
              </SelectTrigger>
              <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md">
                <SelectItem value="all" className="text-xs">{ft("allRoles")}</SelectItem>
                {formData?.roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)} className="text-xs">
                    {role.name.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={department}
              onValueChange={(value) => {
                setDepartment(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="md:w-[170px] h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                <SelectValue placeholder={ft("department")} />
              </SelectTrigger>
              <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md">
                <SelectItem value="all" className="text-xs">{ft("allDepartments")}</SelectItem>
                {DEPARTMENTS.filter((d) => d).map((d) => (
                  <SelectItem key={d} value={d} className="text-xs">
                    {t(`dialog.departments.${d}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchInput ||
              status !== "all" ||
              roleFilter !== "all" ||
              department !== "all") && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="h-8 px-3 text-xs rounded-xs border-[#E3E7EB] text-slate-600 hover:bg-slate-50"
              >
                {ft("clear")}
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex h-[350px] items-center justify-center border border-[#E3E7EB] rounded-xs bg-white">
              <Loader2 className="h-7 w-7 animate-spin text-[#1769AA]" />
            </div>
          ) : (
            <div className="border border-[#E3E7EB] rounded-xs bg-white shadow-2xs overflow-hidden">
              <DataTable
                data={users}
                columns={columns}
                manualPagination
                page={page}
                onPageChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                totalRows={total}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="roles">
          <RolesPanel />
        </TabsContent>
      </Tabs>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUserSaved={handleUserSaved}
        user={editingUser}
      />

      {selectedUser && (
        <>
          <ChangeRoleDialog
            open={roleDialogOpen}
            onOpenChange={setRoleDialogOpen}
            user={selectedUser}
            onSuccess={refetch}
          />
          <ChangePermissionsDialog
            open={permissionsDialogOpen}
            onOpenChange={setPermissionsDialogOpen}
            user={selectedUser}
            onSuccess={refetch}
          />
        </>
      )}
    </div>
  );
}