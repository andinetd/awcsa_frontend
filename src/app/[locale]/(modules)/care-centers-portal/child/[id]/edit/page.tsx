import { SidebarLayout } from "@/components/shared/sidebar-layout";
import EditChildForm from "../../../_components/edit-child-form";

interface EditChildPageProps {
  params: {
    id: string;
  };
}

const EditChildPage = ({ params }: EditChildPageProps) => {
  return (
    <div className="flex flex-col min-h-screen w-full px-6">
      <EditChildForm childId={params.id} />
    </div>
  );
};

export default EditChildPage;
