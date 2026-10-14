import { redirect } from "next/navigation";

export default async function EdirIndex(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  redirect(`/${locale}/social-affairs/edir/dashboard`);
}
