// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const locales = ["en", "hi", "zh", "id", "ko","ja"] as const;
type Locale = (typeof locales)[number];
const defaultLocale: Locale = "en";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const saved = cookieStore.get("locale")?.value as Locale | undefined;
  const locale = saved && locales.includes(saved) ? saved : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});