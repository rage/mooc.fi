import { useRouter } from "next/router"

export const mapLangToLanguage: Record<string, string> = {
  en_US: "English",
  fi_FI: "suomi",
  sv_SE: "svenska",
}

const defaultDateTimeOptions: Intl.DateTimeFormatOptions = {
  dateStyle: "short",
}
export function formatDateTime(date: string): string
export function formatDateTime(date: string, overrideLocale?: string): string
export function formatDateTime(
  date: string,
  options?: Intl.DateTimeFormatOptions,
): string
export function formatDateTime(
  date: string,
  optionsOrOverrideLocale?: string | Intl.DateTimeFormatOptions,
  overrideLocale?: string,
) {
  let datetimeOptions: Intl.DateTimeFormatOptions | undefined

  if (typeof optionsOrOverrideLocale === "string") {
    overrideLocale ??= optionsOrOverrideLocale
  } else {
    datetimeOptions = optionsOrOverrideLocale
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { locale: routerLocale } = useRouter()
  const locale = overrideLocale ?? routerLocale ?? "fi"

  const dt = new Date(date)

  if (isNaN(dt.getTime())) {
    return "-"
  } else {
    return dt.toLocaleString(locale, {
      ...defaultDateTimeOptions,
      ...(datetimeOptions ?? {}),
    })
  }
}
