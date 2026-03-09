import { redirect } from "next/navigation";

export default async function SuperAdminPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  redirect(`/${locale}/super-admin/dashboard`);
}
