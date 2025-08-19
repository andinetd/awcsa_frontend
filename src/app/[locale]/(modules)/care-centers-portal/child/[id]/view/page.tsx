import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Edit, ArrowLeft } from "lucide-react";

interface ViewChildPageProps {
  params: {
    id: string;
  };
}

const ViewChildPage = ({ params }: ViewChildPageProps) => {
  // TODO: Fetch child data based on params.id
  const childData = {
    name_by_care_center: decodeURIComponent(params.id),
    name_by_family: "John Smith",
    father_name: "Michael Smith",
    age: 8,
    gender: "male",
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
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Child Information</h1>
        </div>
        <Link href={`/care-centers-portal/child/${params.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Details
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name by Care Center
              </label>
              <p className="text-sm font-semibold">
                {childData.name_by_care_center}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name by Family
              </label>
              <p className="text-sm">{childData.name_by_family || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Father's Name
              </label>
              <p className="text-sm">{childData.father_name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Age
              </label>
              <p className="text-sm">{childData.age} years old</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Gender
              </label>
              <div className="capitalize">{childData.gender}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date Found
              </label>
              <p className="text-sm">
                {childData.found_date.toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Place Found
              </label>
              <p className="text-sm">{childData.found_address || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Sub City
              </label>
              <p className="text-sm">{childData.found_subcity || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Woreda
              </label>
              <p className="text-sm">{childData.found_woreda || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Child Founder Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Founder Name
              </label>
              <p className="text-sm">{childData.child_founder_name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Founder Address
              </label>
              <p className="text-sm">
                {childData.child_founder_address || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Founder Sub City
              </label>
              <p className="text-sm">
                {childData.child_founder_subcity || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Founder Woreda
              </label>
              <p className="text-sm">{childData.child_found_woreda || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                House Number
              </label>
              <p className="text-sm">
                {childData.child_founder_house_no || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Founder Phone
              </label>
              <p className="text-sm">
                {childData.child_founder_phone || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Officer Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Officer Name
              </label>
              <p className="text-sm">{childData.officer_name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Responsibility
              </label>
              <p className="text-sm">
                {childData.officer_responsibility || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Officer Address
              </label>
              <p className="text-sm">{childData.officer_address || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Officer Sub City
              </label>
              <p className="text-sm">{childData.officer_subcity || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Officer Woreda
              </label>
              <p className="text-sm">{childData.officer_woreda || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Officer Phone
              </label>
              <p className="text-sm">{childData.officer_phone || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Officer ID
              </label>
              <p className="text-sm">{childData.officer_id_no || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Care Center Worker Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Worker Name
              </label>
              <p className="text-sm">
                {childData.care_center_worker_name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Responsibility
              </label>
              <p className="text-sm">
                {childData.care_center_worker_responsibility || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Worker Address
              </label>
              <p className="text-sm">
                {childData.care_center_worker_address || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Worker Sub City
              </label>
              <p className="text-sm">
                {childData.care_center_worker_subcity || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Worker Woreda
              </label>
              <p className="text-sm">
                {childData.care_center_worker_woreda || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Worker Phone
              </label>
              <p className="text-sm">
                {childData.care_center_worker_phone || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Worker ID
              </label>
              <p className="text-sm">
                {childData.care_center_worker_id_no || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Officers</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Health Officer 1
              </label>
              <p className="text-sm">
                {childData.health_officer_1_name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Health Officer 2
              </label>
              <p className="text-sm">
                {childData.heallth_officer_2_name || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Reason for Admission
              </label>
              <p className="text-sm mt-1">
                {childData.admitance_reason || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Additional Information
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
