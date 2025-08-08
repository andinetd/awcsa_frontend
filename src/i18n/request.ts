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

  const applicationMessages = (
    await import(`../../messages/application-messages/${locale}.json`)
  ).default;

  

  return {
    locale,
    messages: {
      ...generalMessages,
      applicationMessages: applicationMessages,
    },
  };
});
