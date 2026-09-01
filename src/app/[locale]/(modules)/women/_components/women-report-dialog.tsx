"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGenerateWomenReportMutation } from "@/hooks/womens";
import { useGetServiceTypesQuery } from "@/hooks/support";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GenerateWomenReportPayload,
  WomenReportCategory,
} from "@/api/womens/generateWomenReport";
import { useTranslations } from "next-intl";

const COLUMNS_BY_CATEGORY: Record<WomenReportCategory, string[]> = {
  SUPPORT_SERVICE: [
    "id",
    "dateProvided",
    "serviceType",
    "category",
    "provider",
    "amountOrQuantity",
    "beneficiaryName",
    "beneficiaryType",
    "subCity",
    "woreda",
    "remark",
  ],
  TECHNOLOGY_SUPPORT: [
    "id",
    "registeredOn",
    "beneficiaryName",
    "cityIdNumber",
    "technologyType",
    "associationName",
    "isPoor",
    "isSexWorker",
    "disabilities",
    "healthConditions",
  ],
  TRAINING: [
    "id",
    "beneficiaryName",
    "cityIdNumber",
    "trainingTopic",
    "startDate",
    "completionDate",
    "attended",
    "remark",
  ],
  EMPLOYMENT: [
    "id",
    "beneficiaryName",
    "cityIdNumber",
    "employmentType",
    "sector",
    "year",
    "remark",
  ],
  ASSOCIATION: [
    "id",
    "registeredOn",
    "name",
    "type",
    "subCity",
    "woreda",
    "block",
    "establishmentDate",
    "totalMembers",
    "chairpersonName",
    "chairpersonPhone",
    "enteredBy",
    "approvedBy",
    "status",
  ],
};

const technologyTypes = [
  "SOLAR", "WATER_PUMP", "IMPROVED_STOVE", "BIODIGESTER", "ELECTRIC_MILL", "OTHER",
];

const trainingTopics = [
  "ENTREPRENEURSHIP", "TAILORING", "AGRICULTURE", "BAKERY",
  "BEAUTY_SALON", "INFORMATION_TECHNOLOGY", "LITERACY",
  "HEALTH_AWARENESS", "LEGAL_RIGHTS", "LEADERSHIP", "OTHER",
];

const sectors = [
  "AGRICULTURE", "TEXTILE", "TRADE", "SERVICES", "MANUFACTURING",
  "CONSTRUCTION", "TRANSPORT", "EDUCATION", "HEALTHCARE", "OTHER",
];

type TriState = "ALL" | "YES" | "NO";

interface WomenReportDialogProps {
  category: WomenReportCategory;
}

export default function WomenReportDialog({ category }: WomenReportDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: generateReport, isPending } =
    useGenerateWomenReportMutation();
  const t = useTranslations("women");

  const { data: serviceTypes, isLoading: isLoadingTypes } =
    useGetServiceTypesQuery();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subCity, setSubCity] = useState("");
  const [woreda, setWoreda] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [beneficiaryLevel, setBeneficiaryLevel] = useState<
    "INDIVIDUAL" | "ASSOCIATION" | "ALL"
  >("ALL");
  const [technologyType, setTechnologyType] = useState("all");
  const [isPoor, setIsPoor] = useState<TriState>("ALL");
  const [isSexWorker, setIsSexWorker] = useState<TriState>("ALL");
  const [trainingTopic, setTrainingTopic] = useState("all");
  const [attended, setAttended] = useState<TriState>("ALL");
  const [year, setYear] = useState("");
  const [employmentType, setEmploymentType] = useState("all");
  const [sector, setSector] = useState("all");
  const [associationStatus, setAssociationStatus] = useState("all");
  const [associationTypeFilter, setAssociationTypeFilter] = useState("all");
  const [format, setFormat] = useState<"EXCEL" | "PDF">("EXCEL");
  const [includeMembers, setIncludeMembers] = useState(false);

  const availableColumns = COLUMNS_BY_CATEGORY[category];
  const [selectedColumns, setSelectedColumns] = useState<string[] | null>(null);
  const columns = selectedColumns ?? availableColumns;

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns(() => {
      const current = selectedColumns ?? availableColumns;
      return current.includes(columnId)
        ? current.filter((id) => id !== columnId)
        : [...current, columnId];
    });
  };

  const triStateToBool = (value: TriState) =>
    value === "ALL" ? undefined : value === "YES";

  const handleGenerate = () => {
    const payload: GenerateWomenReportPayload = {
      category,
      selectedColumns: columns,
      format,
    };

    if (category !== "EMPLOYMENT") {
      payload.startDate = startDate || undefined;
      payload.endDate = endDate || undefined;
    }
    if (category === "SUPPORT_SERVICE") {
      payload.subCity = subCity || undefined;
      payload.woreda = woreda || undefined;
      payload.serviceTypeId =
        serviceTypeId && serviceTypeId !== "none"
          ? parseInt(serviceTypeId)
          : undefined;
      payload.beneficiaryLevel =
        beneficiaryLevel === "ALL" ? undefined : beneficiaryLevel;
    }
    if (category === "TECHNOLOGY_SUPPORT") {
      payload.technologyType =
        technologyType === "all" ? undefined : technologyType;
      payload.isPoor = triStateToBool(isPoor);
      payload.isSexWorker = triStateToBool(isSexWorker);
    }
    if (category === "TRAINING") {
      payload.trainingTopic =
        trainingTopic === "all" ? undefined : trainingTopic;
      payload.attended = triStateToBool(attended);
    }
    if (category === "EMPLOYMENT") {
      payload.year = year || undefined;
      payload.employmentType =
        employmentType === "all" ? undefined : (employmentType as "INDIVIDUAL" | "GROUP");
      payload.sector = sector === "all" ? undefined : sector;
    }
    if (category === "ASSOCIATION") {
      payload.subCity = subCity || undefined;
      payload.woreda = woreda || undefined;
      payload.associationType =
        associationTypeFilter === "all"
          ? undefined
          : (associationTypeFilter as "ASSOCIATION" | "DEVELOPMENT_ASSOCIATION" | "FEDERATION");
      payload.status =
        associationStatus === "all"
          ? undefined
          : (associationStatus as "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED");
    }

    generateReport(payload, {
      onSuccess: () => {
        toast.success(t("report.messages.success"));
        setOpen(false);
      },
      onError: (error: any) => {
        console.error(error);
        toast.error(error?.message || t("report.messages.error"));
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileDown className="w-4 h-4" />
          {t("dashboard.generateReport")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t(`report.titles.${category}`)}</DialogTitle>
          <DialogDescription>{t("report.description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {category !== "EMPLOYMENT" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("report.startDate")}</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("report.endDate")}</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {category === "SUPPORT_SERVICE" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("report.subCity")}</Label>
                  <Input
                    placeholder={t("report.subCity")}
                    value={subCity}
                    onChange={(e) => setSubCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("report.woreda")}</Label>
                  <Input
                    placeholder={t("report.woreda")}
                    value={woreda}
                    onChange={(e) => setWoreda(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("report.serviceTypeId")}</Label>
                  <Select value={serviceTypeId} onValueChange={setServiceTypeId}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingTypes
                            ? t("common.loading")
                            : t("report.selectServiceType")
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {t(`serviceTypes.${type.name}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("report.beneficiaryLevel")}</Label>
                  <Select
                    value={beneficiaryLevel}
                    onValueChange={(v) =>
                      setBeneficiaryLevel(
                        v as "INDIVIDUAL" | "ASSOCIATION" | "ALL"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("report.allLevels")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{t("report.allLevels")}</SelectItem>
                      <SelectItem value="INDIVIDUAL">
                        {t("report.individual")}
                      </SelectItem>
                      <SelectItem value="ASSOCIATION">
                        {t("report.group")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {category === "ASSOCIATION" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("report.subCity")}</Label>
                <Input
                  placeholder={t("report.subCity")}
                  value={subCity}
                  onChange={(e) => setSubCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("report.woreda")}</Label>
                <Input
                  placeholder={t("report.woreda")}
                  value={woreda}
                  onChange={(e) => setWoreda(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("report.associationType")}</Label>
                <Select
                  value={associationTypeFilter}
                  onValueChange={setAssociationTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("report.options.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("report.options.all")}</SelectItem>
                    {(
                      [
                        "ASSOCIATION",
                        "DEVELOPMENT_ASSOCIATION",
                        "FEDERATION",
                      ] as const
                    ).map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`associations.form.types.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("report.associationStatus")}</Label>
                <Select
                  value={associationStatus}
                  onValueChange={setAssociationStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("report.options.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("report.options.all")}</SelectItem>
                    {(["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"] as const).map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {t(`associations.status.${status}`)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {category === "TECHNOLOGY_SUPPORT" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t("report.technologyType")}</Label>
                <Select value={technologyType} onValueChange={setTechnologyType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("report.options.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("report.options.all")}</SelectItem>
                    {technologyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`technologySupport.form.technologyTypes.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("report.isPoor")}</Label>
                <Select
                  value={isPoor}
                  onValueChange={(v) => setIsPoor(v as TriState)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t("report.options.all")}</SelectItem>
                    <SelectItem value="YES">{t("report.options.yes")}</SelectItem>
                    <SelectItem value="NO">{t("report.options.no")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("report.isSexWorker")}</Label>
                <Select
                  value={isSexWorker}
                  onValueChange={(v) => setIsSexWorker(v as TriState)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t("report.options.all")}</SelectItem>
                    <SelectItem value="YES">{t("report.options.yes")}</SelectItem>
                    <SelectItem value="NO">{t("report.options.no")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {category === "TRAINING" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("report.trainingTopic")}</Label>
                <Select value={trainingTopic} onValueChange={setTrainingTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("report.options.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("report.options.all")}</SelectItem>
                    {trainingTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {t(`training.form.trainingTopics.${topic}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("report.attended")}</Label>
                <Select
                  value={attended}
                  onValueChange={(v) => setAttended(v as TriState)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t("report.options.all")}</SelectItem>
                    <SelectItem value="YES">{t("report.options.yes")}</SelectItem>
                    <SelectItem value="NO">{t("report.options.no")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {category === "EMPLOYMENT" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("report.employmentType")}</Label>
                  <Select
                    value={employmentType}
                    onValueChange={setEmploymentType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("report.options.all")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("report.options.all")}
                      </SelectItem>
                      <SelectItem value="INDIVIDUAL">
                        {t("employment.form.employmentTypes.INDIVIDUAL")}
                      </SelectItem>
                      <SelectItem value="GROUP">
                        {t("employment.form.employmentTypes.GROUP")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("report.year")}</Label>
                  <Input
                    type="number"
                    min="2000"
                    max="2100"
                    placeholder="2025"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("report.sector")}</Label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("report.options.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("report.options.all")}</SelectItem>
                    {sectors.map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(`employment.form.sectors.${s}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {category === "ASSOCIATION" && (
            <div className="flex items-start space-x-2 rounded-md border p-3 bg-slate-50/40">
              <Checkbox
                id="include-members"
                checked={includeMembers}
                onCheckedChange={(checked) =>
                  setIncludeMembers(checked === true)
                }
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor="include-members"
                  className="text-sm font-medium cursor-pointer"
                >
                  {t("report.includeMembers")}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t("report.includeMembersHint")}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>{t("report.format")}</Label>
            <Select
              value={format}
              onValueChange={(v) => setFormat(v as "EXCEL" | "PDF")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXCEL">Excel</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("report.columns")}</Label>
            <div className="grid grid-cols-2 gap-2 border rounded-md p-4">
              {availableColumns.map((col) => (
                <div key={col} className="flex items-center space-x-2">
                  <Checkbox
                    id={`col-${col}`}
                    checked={columns.includes(col)}
                    onCheckedChange={() => handleColumnToggle(col)}
                  />
                  <Label htmlFor={`col-${col}`} className="text-sm">
                    {t(`report.columnsList.${col}`)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t("form.buttons.cancel")}
          </Button>
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t("report.buttons.download")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
