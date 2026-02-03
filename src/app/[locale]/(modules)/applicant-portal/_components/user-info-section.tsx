"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, BadgeIcon as IdCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuthMeQuery } from "@/hooks/applicants-portal";

export function UserInfoSection() {
  const t = useTranslations("applicants-portal");
  const { data, isLoading, error } = useAuthMeQuery();
  const userData = data;

  if (isLoading) {
    return <div>{t("userInfo.loading")}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {t("userInfo.userInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                {t("userInfo.name")}
              </p>
              <p className="text-gray-900">
                {userData?.profile.firstName} {userData?.profile.lastName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                {" "}
                {t("userInfo.email")}
              </p>

              <p className="text-gray-900">{userData?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                {t("userInfo.phone")}
              </p>
              <p className="text-gray-900">{userData?.profile.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IdCard className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                {t("userInfo.id")}
              </p>
              <p className="text-gray-900">{userData?.id}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
