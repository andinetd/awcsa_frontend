import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom/custom-card";
import { Button } from "@/components/ui/button";
import {
  X,
  User,
  Calendar,
  Tag,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Phone,
  Mail,
} from "lucide-react";

export interface MatchedChildInfo {
  child: {
    id: number;
    cityIdNumber: string | null;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    address: string | null;
    dateOfBirth: string;
    clientCategory: string;
    educationLevel: string;
    occupation: string | null;
    monthlyIncome: number | null;
    spouseCityIdNumber: string | null;
    familyMembersCount: number | null;
    contactInfo: {
      sex: string;
      additionalInfo: string;
    };
    activeStatus: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  adopter: {
    id: number;
    cityIdNumber: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    clientCategory: string;
    educationLevel: string;
    occupation: string;
    monthlyIncome: number;
    spouseCityIdNumber: string;
    familyMembersCount: number | null;
    contactInfo: {
      email: string;
      phoneNumber: string;
    };
    activeStatus: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  matchedAt: string;
  facilityChildId: string;
  status: string;
}

interface MatchedChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MatchedChildInfo;
}

const DetailRow = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | null;
  icon?: any;
}) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
    <div className="flex items-center text-slate-500 text-sm">
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}
    </div>
    <div className="font-medium text-slate-900 text-sm text-right">
      {value || "—"}
    </div>
  </div>
);

export const MatchedChildDetail: React.FC<MatchedChildModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen) return null;

  const childAge =
    new Date().getFullYear() - new Date(data.child.dateOfBirth).getFullYear();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900">
              Matched Child Detail
            </h1>
            <div className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-200 uppercase tracking-wide">
              {data.status}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {/* Main Status Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2 text-blue-200 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> Official Adoption Match
                </div>
                <h2 className="text-3xl font-bold mb-1">
                  {data.child.firstName} {data.child.lastName}
                </h2>
                <p className="text-blue-100 text-sm opacity-90 mt-1">
                  Matched on {new Date(data.matchedAt).toLocaleDateString()} •
                  Facility ID: {data.facilityChildId}
                </p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 min-w-[120px]">
                <span className="block text-3xl font-bold">{childAge}</span>
                <span className="text-[10px] uppercase font-medium opacity-80">
                  Years Old
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Child Details */}
            <Card>
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-4 h-4 text-blue-600" />
                  Child Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <DetailRow label="First Name" value={data.child.firstName} />
                <DetailRow label="Last Name" value={data.child.lastName} />
                <DetailRow label="Gender" value={data.child.contactInfo.sex} />
                <DetailRow
                  label="Date of Birth"
                  value={new Date(data.child.dateOfBirth).toLocaleDateString()}
                  icon={Calendar}
                />
                <DetailRow
                  label="City ID Number"
                  value={data.child.cityIdNumber}
                  icon={Tag}
                />
                <DetailRow
                  label="Client Category"
                  value={data.child.clientCategory}
                />
                <DetailRow
                  label="Additional Info"
                  value={data.child.contactInfo.additionalInfo}
                />
                <DetailRow
                  label="Record Created"
                  value={new Date(data.child.createdAt).toLocaleDateString()}
                />
              </CardContent>
            </Card>

            {/* Adopter Details */}
            <Card>
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-4 h-4 text-green-600" />
                  Adopter Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <DetailRow
                  label="Full Name"
                  value={`${data.adopter.firstName} ${data.adopter.lastName}`}
                />
                <DetailRow
                  label="Adopter ID"
                  value={data.adopter.id.toString()}
                />
                <DetailRow
                  label="City ID Number"
                  value={data.adopter.cityIdNumber}
                  icon={Tag}
                />
                <DetailRow
                  label="Phone Number"
                  value={data.adopter.contactInfo.phoneNumber}
                  icon={Phone}
                />
                <DetailRow
                  label="Email"
                  value={data.adopter.contactInfo.email}
                  icon={Mail}
                />
                <DetailRow
                  label="Address"
                  value={data.adopter.address}
                  icon={MapPin}
                />
                <DetailRow
                  label="Occupation"
                  value={data.adopter.occupation}
                  icon={Briefcase}
                />
                <DetailRow
                  label="Monthly Income"
                  value={`${data.adopter.monthlyIncome?.toLocaleString()} ETB`}
                  icon={DollarSign}
                />
                <DetailRow
                  label="Education"
                  value={data.adopter.educationLevel}
                  icon={GraduationCap}
                />
                <DetailRow
                  label="Date of Birth"
                  value={new Date(
                    data.adopter.dateOfBirth
                  ).toLocaleDateString()}
                  icon={Calendar}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
