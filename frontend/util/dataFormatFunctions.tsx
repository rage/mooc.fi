import { DateTime, DateTimeOptions } from "luxon"
import { useRouter } from "next/router"

export const mapLangToLanguage: Record<string, string> = {
  en_US: "English",
  fi_FI: "Suomi",
  sv_SE: "Swedish",
}

export function formatDateTime(date: string): string
export function formatDateTime(date: string, overrideLocale?: string): string
export function formatDateTime(date: string, options?: DateTimeOptions): string
export function formatDateTime(
  date: string,
  optionsOrOverrideLocale?: string | DateTimeOptions,
  overrideLocale?: string,
) {
  let datetimeOptions: DateTimeOptions | undefined

  if (typeof optionsOrOverrideLocale === "string") {
    overrideLocale ??= optionsOrOverrideLocale
  } else {
    datetimeOptions = optionsOrOverrideLocale
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { locale: routerLocale } = useRouter()
  const locale = overrideLocale ?? routerLocale

  const dt = DateTime.fromISO(date, datetimeOptions)

  if (dt.isValid) {
    return dt.toLocaleString(datetimeOptions, locale ? { locale } : undefined)
  }

  return "-"
}
