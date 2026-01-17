import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BureauReport } from "@/api/bureau/reports";
import { format } from "date-fns";

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
  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>
            Detailed information for {report.facility.name} -{" "}
            {format(new Date(report.year, report.month - 1), "MMMM yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Facility Information</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {report.facility.name}
                  </p>
                  <p>
                    <span className="font-medium">Sub-City:</span>{" "}
                    {report.facility.subCity}
                  </p>
                  <p>
                    <span className="font-medium">Region:</span>{" "}
                    {report.facility.region}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Report Status</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Status:</span>{" "}
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
                    <span className="font-medium">Submitted:</span>{" "}
                    {report.submittedAt
                      ? format(new Date(report.submittedAt), "PPP")
                      : "-"}
                  </p>
                  <p>
                    <span className="font-medium">Approved:</span>{" "}
                    {report.approvedAt
                      ? format(new Date(report.approvedAt), "PPP")
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Statistics</h4>
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold">{report.totalChildren}</p>
                  <p className="text-xs text-muted-foreground">
                    Total Children
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{report.newAdmissions}</p>
                  <p className="text-xs text-muted-foreground">
                    New Admissions
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{report.discharges}</p>
                  <p className="text-xs text-muted-foreground">Discharges</p>
                </div>
              </div>
            </div>

            {report.notes && (
              <div>
                <h4 className="font-semibold mb-2">Notes</h4>
                <div className="p-3 bg-muted/30 rounded-md text-sm whitespace-pre-wrap">
                  {report.notes}
                </div>
              </div>
            )}

            {/* If formData is a JSON string, we might want to parse it or display it. 
                 For now, just showing it if it's simple text, or hiding it if it's complex raw data not meant for display without parsing.
                 Given the example "adfasdfasf", it seems like a string. */}
            {report.formData && (
              <div>
                <h4 className="font-semibold mb-2">Form Data</h4>
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
