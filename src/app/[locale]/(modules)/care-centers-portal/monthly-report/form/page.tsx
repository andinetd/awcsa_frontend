"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import {
  Building2,
  Save,
  FileText,
  Calendar,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export interface CareCenterReport {
  month: number;
  year: number;
  totalChildren: number;
  newAdmissions: number;
  discharges: number;
  notes: string;
  formData: string;
}

export const CareCenterReportForm: React.FC = () => {
  const [report, setReport] = useState<CareCenterReport>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalChildren: 0,
    newAdmissions: 0,
    discharges: 0,
    notes: "",
    formData: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${BASE_URL}/care-center/reports`, report, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("monthly report submitted successfully");
      router.push("/care-centers-portal");
    } catch (error) {
      console.error("Error submitting form:", error);

      // extract a useful message from AxiosError if possible
      let message = "Failed to submit monthly report. Please try again.";

      if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<any>;
        // prefer server-provided message shape
        const respData = axiosErr.response?.data;
        if (respData) {
          if (typeof respData === "string") {
            message = respData;
          } else if (respData.message) {
            message = String(respData.message);
          } else if (respData.errors) {
            try {
              // if errors is array or object, make it readable
              if (Array.isArray(respData.errors)) {
                message = respData.errors
                  .map((e: any) => e.message || JSON.stringify(e))
                  .join("; ");
              } else {
                message = JSON.stringify(respData.errors);
              }
            } catch {
              message = String(respData.errors);
            }
          } else {
            try {
              message = JSON.stringify(respData);
            } catch {
              message = String(respData);
            }
          }
        } else if (axiosErr.message) {
          message = axiosErr.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      // show the extracted message in the toast
      toast.error(message);
      return;
    }
    
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setReport((prev) => ({
      ...prev,
      [name]: name === "notes" || name === "formData" ? value : Number(value),
    }));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Form Section */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Reporting Period
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Month
                    </label>
                    <select
                      name="month"
                      value={report.month}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white text-sm"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString("default", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={report.year}
                      onChange={handleChange}
                      min="2000"
                      max="2100"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Users className="w-5 h-5 text-blue-600" />
                    Population Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold text-sm">
                        <Users className="w-4 h-4" /> Total Children
                      </div>
                      <input
                        type="number"
                        name="totalChildren"
                        value={report.totalChildren}
                        onChange={handleChange}
                        min="0"
                        className="w-full text-2xl font-bold bg-transparent border-0 border-b-2 border-blue-200 focus:border-blue-500 focus:ring-0 px-0 py-1 text-slate-900 placeholder:text-slate-300"
                        placeholder="0"
                      />
                      <p className="text-xs text-blue-600 mt-2">
                        Current census at month end
                      </p>
                    </div>

                    <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 mb-2 text-green-800 font-semibold text-sm">
                        <ArrowUpRight className="w-4 h-4" /> New Admissions
                      </div>
                      <input
                        type="number"
                        name="newAdmissions"
                        value={report.newAdmissions}
                        onChange={handleChange}
                        min="0"
                        className="w-full text-2xl font-bold bg-transparent border-0 border-b-2 border-green-200 focus:border-green-500 focus:ring-0 px-0 py-1 text-slate-900 placeholder:text-slate-300"
                        placeholder="0"
                      />
                      <p className="text-xs text-green-600 mt-2">
                        Intake during this month
                      </p>
                    </div>

                    <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                      <div className="flex items-center gap-2 mb-2 text-orange-800 font-semibold text-sm">
                        <ArrowDownLeft className="w-4 h-4" /> Discharges
                      </div>
                      <input
                        type="number"
                        name="discharges"
                        value={report.discharges}
                        onChange={handleChange}
                        min="0"
                        className="w-full text-2xl font-bold bg-transparent border-0 border-b-2 border-orange-200 focus:border-orange-500 focus:ring-0 px-0 py-1 text-slate-900 placeholder:text-slate-300"
                        placeholder="0"
                      />
                      <p className="text-xs text-orange-600 mt-2">
                        Exits/Adoptions this month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Additional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes & Observations
                    </label>
                    <textarea
                      name="notes"
                      value={report.notes}
                      onChange={handleChange}
                      placeholder="Enter qualitative report details, challenges, or success stories..."
                      className="w-full min-h-[120px] p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional Form Data (JSON/String)
                    </label>
                    <textarea
                      name="formData"
                      value={report.formData}
                      onChange={handleChange}
                      placeholder="Paste specific data strings or encoded form data here..."
                      className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm font-mono text-slate-600 bg-slate-50 resize-y"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar / Instructions */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <Building2 className="w-10 h-10 mb-4" />
                  <h3 className="text-lg font-bold mb-2">Monthly Reporting</h3>
                  <p className="text-sm mb-6">
                    Please ensure all statistical data is accurate before
                    submission. This report feeds into the central bureau
                    dashboard for resource allocation.
                  </p>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full bg-white text-blue-700 hover:bg-blue-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Submit Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareCenterReportForm;
