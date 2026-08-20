"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function UserInfoAndLogout() {
  const t = useTranslations("components.userLogout");
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getInitials = (email: string) => {
    const parts = email.split("@")[0].split(".");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : email.slice(0, 2).toUpperCase();
  };

  const handleLogout = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsLoggingOut(true);
    try {
      logout({ notifyServer: true });

      toast.success(t("success"), { duration: 2000 });

      router.replace(`/`);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(t("failed"), { duration: 4000 });
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoggingOut}>
        <button className="focus:outline-none" aria-label={t("ariaMenu")}>
          <Avatar className="h-9 w-9 border-2">
            <AvatarImage src="/placeholder-user.jpg" alt={t("avatarAlt")} />
            <AvatarFallback>
              {user?.email ? getInitials(user.email) : "JP"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user && (
          <>
            <DropdownMenuItem disabled className="flex-col items-start">
              <span className="font-medium">{user.email}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full text-left text-destructive flex items-center gap-2"
            aria-label={t("logout")}
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {isLoggingOut ? t("loggingOut") : t("logout")}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
