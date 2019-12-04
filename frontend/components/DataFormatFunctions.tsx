export const mapLangToLanguage: Record<string, string> = {
  en_US: "English",
  fi_FI: "Suomi",
  sv_SE: "Swedish",
}

export function formatDateTime(date: string) {
  const dateToFormat = new Date(date)
  const day = dateToFormat.getDate()
  const month = dateToFormat.getMonth()
  const year = dateToFormat.getFullYear()
  // TODO: fix the date format
  const formattedDate = `${day}/${month}/${year}`
  return formattedDate
}
