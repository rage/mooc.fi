import { DateTime } from "luxon"
import { useRouter } from "next/router"

export const mapLangToLanguage: Record<string, string> = {
  en_US: "English",
  fi_FI: "Suomi",
  sv_SE: "Swedish",
}

export function formatDateTime(
  date?: string,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
) {
  if (!date) return "-"

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { locale: _locale } = useRouter()

  return DateTime.fromISO(date).toLocaleString(options ?? {}, {
    locale: locale ?? _locale,
  })
}
