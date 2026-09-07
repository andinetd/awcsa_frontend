"use client";

import { Plus, UserPlus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useBeneficiaryRegisterStore,
  BeneficiaryCategory,
} from "@/stores/beneficiary-register-store";
import { useSidebar } from "@/components/ui/sidebar";

export function BeneficiaryRegisterTrigger() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.srs");
  const { state } = useSidebar();
  const openDialog = useBeneficiaryRegisterStore((s) => s.openDialog);
  const isCollapsed = state === "collapsed";

  const handleSelect = (category: BeneficiaryCategory) => {
    openDialog(category);
  };

  if (isCollapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-auto text-sidebar-foreground/60 hover:text-sidebar-foreground"
            title={t("quickAdd")}
          >
            <Plus className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-56">
          <DropdownMenuLabel>{t("quickAdd")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleSelect("DISABLED")}>
            <UserPlus className="size-4" />
            {t("registerDisability")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect("ELDERLY")}>
            <Users className="size-4" />
            {t("registerElderly")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 ml-auto text-sidebar-foreground/60 hover:text-sidebar-foreground gap-1"
        >
          <Plus className="size-3.5" />
          <span className="text-[11px] font-medium uppercase tracking-wider">
            {t("quickAdd")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-56">
        <DropdownMenuLabel>{t("quickAdd")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSelect("DISABLED")}>
          <UserPlus className="size-4" />
          {t("registerDisability")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("ELDERLY")}>
          <Users className="size-4" />
          {t("registerElderly")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
