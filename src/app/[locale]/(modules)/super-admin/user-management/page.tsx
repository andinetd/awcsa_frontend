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
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="users">{t("tabs.users")}</TabsTrigger>
            <TabsTrigger value="roles">{t("tabs.roles")}</TabsTrigger>
          </TabsList>
          {tab === "users" && (
            <Button onClick={handleAddUser}>
              <Plus className="mr-2 h-4 w-4" /> {t("addUser")}
            </Button>
          )}
        </div>

        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={ft("searchPlaceholder")}
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="md:w-[160px]">
                <SelectValue placeholder={ft("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{ft("allStatuses")}</SelectItem>
                {ACTIVE_STATUS.filter((s) => s).map((s) => (
                  <SelectItem key={s} value={s}>
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
              <SelectTrigger className="md:w-[200px]">
                <SelectValue placeholder={ft("role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{ft("allRoles")}</SelectItem>
                {formData?.roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
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
              <SelectTrigger className="md:w-[180px]">
                <SelectValue placeholder={ft("department")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{ft("allDepartments")}</SelectItem>
                {DEPARTMENTS.filter((d) => d).map((d) => (
                  <SelectItem key={d} value={d}>
                    {t(`dialog.departments.${d}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchInput ||
              status !== "all" ||
              roleFilter !== "all" ||
              department !== "all") && (
              <Button variant="outline" onClick={resetFilters}>
                {ft("clear")}
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
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