export default function prependLocale(path: string, locale?: string) {
  if (!locale) {
    return path
  }

  return `${locale !== "fi" ? `/${locale}` : ""}${path}`
}
