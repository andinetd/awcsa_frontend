import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Edit, ArrowLeft } from "lucide-react";

interface ViewChildPageProps {
  params: Promise<{
    id: string;
  }>;
}

import { useTranslations } from "next-intl";

const ViewChildPage = async ({ params }: ViewChildPageProps) => {
  const { id } = await params;
  const t = useTranslations("care-centers-portal.childView");
  const te = useTranslations("care-centers-portal.enums");

  // TODO: Fetch child data based on params.id
  const childData = {
    name_by_care_center: decodeURIComponent(id),
    name_by_family: "John Smith",
    father_name: "Michael Smith",
    age: 8,
    gender: "MALE",
    admitance_reason: "Found abandoned near the market area",
    found_address: "Central Market",
    found_subcity: "Addis Ketema",
    found_woreda: "03",
    found_date: new Date("2024-01-15"),
    additional_information: "Child was found in good health condition",
    child_founder_name: "Ahmed Hassan",
    child_founder_address: "Merkato Area",
    child_founder_subcity: "Addis Ketema",
    child_found_woreda: "03",
    child_founder_house_no: 123,
    child_founder_phone: "+251911234567",
    officer_name: "Officer Bekele Tadesse",
    officer_responsibility: "Child Protection Officer",
    officer_address: "Police Station 5",
    officer_subcity: "Addis Ketema",
    officer_woreda: "03",
    officer_phone: "+251911987654",
    officer_id_no: "ID123456789",
    care_center_worker_name: "Sister Mary",
    care_center_worker_responsibility: "Child Care Coordinator",
    care_center_worker_address: "Hope Care Center",
    care_center_worker_subcity: "Addis Ketema",
    care_center_worker_woreda: "03",
    care_center_worker_phone: "+251911555666",
    care_center_worker_id_no: "CC987654321",
    health_officer_1_name: "Dr. Almaz Tesfaye",
    heallth_officer_2_name: "Dr. Dawit Kebede",
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/care-centers-portal">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
        <Link href={`/care-centers-portal/child/${id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            {t("editDetails")}
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("sections.basic")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.nameByCenter")}
              </label>
              <p className="text-sm font-semibold">
                {childData.name_by_care_center}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.nameByFamily")}
              </label>
              <p className="text-sm">{childData.name_by_family || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.fatherName")}
              </label>
              <p className="text-sm">{childData.father_name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.age", { age: "" }).replace("{age}", "")}
              </label>
              <p className="text-sm">
                {t("fields.age", { age: childData.age })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.gender")}
              </label>
              <div className="capitalize">{te(`sex.${childData.gender}`)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.dateFound")}
              </label>
              <p className="text-sm">
                {childData.found_date.toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sections.location")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.placeFound")}
              </label>
              <p className="text-sm">{childData.found_address || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.subCity")}
              </label>
              <p className="text-sm">{childData.found_subcity || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.woreda")}
              </label>
              <p className="text-sm">{childData.found_woreda || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sections.founder")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.founderName")}
              </label>
              <p className="text-sm">{childData.child_founder_name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.founderAddress")}
              </label>
              <p className="text-sm">
                {childData.child_founder_address || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.founderSubCity")}
              </label>
              <p className="text-sm">
                {childData.child_founder_subcity || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.founderWoreda")}
              </label>
              <p className="text-sm">{childData.child_found_woreda || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.houseNo")}
              </label>
              <p className="text-sm">
                {childData.child_founder_house_no || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.founderPhone")}
              </label>
              <p className="text-sm">
                {childData.child_founder_phone || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sections.officer")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.officerName")}
              </label>
              <p className="text-sm">{childData.officer_name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.responsibility")}
              </label>
              <p className="text-sm">
                {childData.officer_responsibility || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.officerAddress")}
              </label>
              <p className="text-sm">{childData.officer_address || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.officerSubCity")}
              </label>
              <p className="text-sm">{childData.officer_subcity || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.officerWoreda")}
              </label>
              <p className="text-sm">{childData.officer_woreda || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.officerPhone")}
              </label>
              <p className="text-sm">{childData.officer_phone || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.officerId")}
              </label>
              <p className="text-sm">{childData.officer_id_no || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sections.worker")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.workerName")}
              </label>
              <p className="text-sm">
                {childData.care_center_worker_name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.responsibility")}
              </label>
              <p className="text-sm">
                {childData.care_center_worker_responsibility || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.workerAddress")}
              </label>
              <p className="text-sm">
                {childData.care_center_worker_address || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.workerSubCity")}
              </label>
              <p className="text-sm">
                {childData.care_center_worker_subcity || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.workerWoreda")}
              </label>
              <p className="text-sm">
                {childData.care_center_worker_woreda || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.workerPhone")}
              </label>
              <p className="text-sm">
                {childData.care_center_worker_phone || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.workerId")}
              </label>
              <p className="text-sm">
                {childData.care_center_worker_id_no || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sections.health")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.healthOfficer1")}
              </label>
              <p className="text-sm">
                {childData.health_officer_1_name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.healthOfficer2")}
              </label>
              <p className="text-sm">
                {childData.heallth_officer_2_name || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sections.additional")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.admittanceReason")}
              </label>
              <p className="text-sm mt-1">
                {childData.admitance_reason || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("fields.additionalInfo")}
              </label>
              <p className="text-sm mt-1">
                {childData.additional_information || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewChildPage;
