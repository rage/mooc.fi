export const MapLangToLanguage = new Map(
  Object.entries({
    en_US: "English",
    fi_FI: "Suomi",
    sv_SE: "Swedish",
  }),
)

export function formatDateTime(date: string) {
  const dateToFormat = new Date(date)
  const day = dateToFormat.getDate()
  const month = dateToFormat.getMonth()
  const year = dateToFormat.getFullYear()
  const formattedDate = `${day}\\${month}\\${year}`
  return formattedDate
}
