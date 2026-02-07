import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BureauReport } from "@/api/bureau/reports";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface ReportDetailsModalProps {
  report: BureauReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportDetailsModal({
  report,
  isOpen,
  onClose,
}: ReportDetailsModalProps) {
  const t = useTranslations("bureau");
  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("reportDetails.title")}</DialogTitle>
          <DialogDescription>
            {t("reportDetails.description", {
              name: report.facility.name,
              date: `${t(`months.${report.month}`)} ${report.year}`,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">
                  {t("reportDetails.facilityInfo")}
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">
                      {t("reportDetails.name")}:
                    </span>{" "}
                    {report.facility.name}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("reportDetails.subCity")}:
                    </span>{" "}
                    {report.facility.subCity}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("reportDetails.region")}:
                    </span>{" "}
                    {report.facility.region}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  {t("reportDetails.reportStatus")}
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">
                      {t("reportDetails.status")}:
                    </span>{" "}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        report.status === "Submitted" ||
                        report.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("reportDetails.submitted")}:
                    </span>{" "}
                    {report.submittedAt
                      ? format(new Date(report.submittedAt), "PPP")
                      : "-"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("reportDetails.approved")}:
                    </span>{" "}
                    {report.approvedAt
                      ? format(new Date(report.approvedAt), "PPP")
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                {t("reportDetails.statistics")}
              </h4>
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold">{report.totalChildren}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("reportDetails.totalChildren")}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{report.newAdmissions}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("reportDetails.newAdmissions")}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{report.discharges}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("reportDetails.discharges")}
                  </p>
                </div>
              </div>
            </div>

            {report.notes && (
              <div>
                <h4 className="font-semibold mb-2">
                  {t("reportDetails.notes")}
                </h4>
                <div className="p-3 bg-muted/30 rounded-md text-sm whitespace-pre-wrap">
                  {report.notes}
                </div>
              </div>
            )}

            {report.formData && (
              <div>
                <h4 className="font-semibold mb-2">
                  {t("reportDetails.formData")}
                </h4>
                <div className="p-3 bg-muted/30 rounded-md text-sm whitespace-pre-wrap break-all">
                  {report.formData}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
