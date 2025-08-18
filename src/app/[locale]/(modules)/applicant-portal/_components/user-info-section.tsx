"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { User, Mail, Phone, BadgeIcon as IdCard } from "lucide-react";
import { useTranslations } from "next-intl";

interface UserInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
}

// Mock data - will be replaced with TanStack Query
const mockUserData: UserInfo = {
  fullName: "Ammar Mohammed",
  email: "ammarmyp@email.com",
  phoneNumber: "+251941806250",
  idNumber: "ID123456789",
};

export function UserInfoSection() {
  const userInfo = mockUserData; // This will be replaced with actual data fetching
  const applicationMessages = useTranslations("applicationMessages");
  const { user } = useAuthStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {applicationMessages("userInfo.userInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                {applicationMessages("userInfo.name")}
              </p>
              <p className="text-gray-900">{userInfo.fullName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                {" "}
                {applicationMessages("userInfo.email")}
              </p>
              <p className="text-gray-900">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                {applicationMessages("userInfo.phone")}
              </p>
              <p className="text-gray-900">{userInfo.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IdCard className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                {applicationMessages("userInfo.id")}
              </p>
              <p className="text-gray-900">{userInfo.idNumber}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
