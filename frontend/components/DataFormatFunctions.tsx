import { DateTime } from "luxon"
import { useRouter } from "next/router"

export const mapLangToLanguage: Record<string, string> = {
  en_US: "English",
  fi_FI: "Suomi",
  sv_SE: "Swedish",
}

export function formatDateTime(date: string, overrideLocale?: string) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { locale: routerLocale } = useRouter()
  const locale = overrideLocale ?? routerLocale

  const dt = DateTime.fromISO(date)

  if (dt.isValid) {
    return dt.toLocaleString({}, locale ? { locale } : undefined)
  }

  return "???"
}

export function formatDate(date: string, overrideLocale?: string) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { locale: routerLocale } = useRouter()
  const locale = overrideLocale ?? routerLocale

  const dt = DateTime.fromISO(date)

  if (dt.isValid) {
    return dt.toLocaleString(
      DateTime.DATE_SHORT,
      locale ? { locale } : undefined,
    )
  }

  return "???"
}
