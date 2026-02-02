import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EditChildForm from "../../../_components/edit-child-form";

interface EditChildPageProps {
  params: {
    id: string;
  };
}

const EditChildPage = ({ params }: EditChildPageProps) => {
  return (
    <div className="flex flex-col min-h-screen w-full p-6 space-y-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/care-centers-portal/child/${params.id}/view`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Edit Child Information
            </h2>
            <p className="text-muted-foreground">
              Update the details for this child record.
            </p>
          </div>
        </div>
        <EditChildForm childId={params.id} />
      </div>
    </div>
  );
};

export default EditChildPage;
