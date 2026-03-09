import { CareCenterReportForm } from "./_components/monthly-report-form";

const CareCenterReportFormPage = async (props: {
  params: Promise<{ locale: string }>;
}) => {
  await props.params;
  return <CareCenterReportForm />;
};

export default CareCenterReportFormPage;
