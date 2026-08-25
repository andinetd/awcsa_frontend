import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { ClipboardList } from "lucide-react";

interface MonitoringLogEntry {
  id: number;
  monitoringDate: string;
  assessedBy: string;
  currentStatus: string;
  score: number;
  remark?: string;
}

interface MonitoringTimelineProps {
  logs?: MonitoringLogEntry[];
}

export default function MonitoringTimeline({ logs }: MonitoringTimelineProps) {
  const t = useTranslations("women");

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl grayscale opacity-60">
        <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground font-medium">
          {t("supportDetail.noLogs")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("supportDetail.addFollowUp")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[500px] overflow-y-auto pr-4">
      <div className="relative border-l border-muted-foreground/20 ml-3 pl-8 space-y-8 py-4">
        {logs.map((log) => (
          <div key={log.id} className="relative">
            <div className="absolute -left-[44px] top-1 h-6 w-6 rounded-full border-4 border-background bg-primary shadow-sm" />
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-2">
              <div>
                <p className="font-bold text-lg">
                  {format(new Date(log.monitoringDate), "PPP")}
                </p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">{log.currentStatus}</Badge>
                  <Badge variant="outline">
                    {t("supportDetail.score", { score: log.score })}
                  </Badge>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {t("supportDetail.assessedBy", { name: log.assessedBy })}
                  </p>
                </div>
              </div>
              <div className="w-full md:w-32 h-2 bg-muted rounded-full overflow-hidden mt-2 md:mt-0">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${log.score}%` }}
                />
              </div>
            </div>
            {log.remark && (
              <div className="bg-muted/30 p-4 rounded-xl border border-muted-foreground/10">
                <p className="text-sm whitespace-pre-wrap">{log.remark}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}