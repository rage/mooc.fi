import { DateTime } from "luxon"

export const mapLangToLanguage: Record<string, string> = {
  en_US: "English",
  fi_FI: "Suomi",
  sv_SE: "Swedish",
}

export function formatDateTime(date: string) {
  var dt = DateTime.fromISO(date)
  return dt.toLocaleString()
}
