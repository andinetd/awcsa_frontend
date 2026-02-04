import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const generalMessages = (await import(`../../messages/${locale}.json`))
    .default;

  const adoptionMessages = (
    await import(`../../messages/adoption/${locale}.json`)
  ).default;

  const applicantsPortalMessages = (
    await import(`../../messages/applicants-portal/${locale}.json`)
  ).default;

  const sidebarMessages = (
    await import(`../../messages/sidebar/${locale}.json`)
  ).default;

  const componentMessages = (
    await import(`../../messages/components/${locale}.json`)
  ).default;

  const loginMessages = (await import(`../../messages/login/${locale}.json`))
    .default;

  const bureauMessages = (await import(`../../messages/bureau/${locale}.json`))
    .default;

  return {
    locale,
    messages: {
      ...generalMessages,
      adoption: adoptionMessages,
      "applicants-portal": applicantsPortalMessages,
      sidebar: sidebarMessages,
      components: componentMessages,
      login: loginMessages,
      bureau: bureauMessages,
    },
  };
});
