import { useMemo } from "react"

import { useRouter } from "next/router"

export const mapLangToLanguage: Record<string, string> = {
  en_US: "English",
  fi_FI: "suomi",
  sv_SE: "svenska",
}

const defaultDateTimeOptions: Intl.DateTimeFormatOptions = {
  dateStyle: "short",
}

type Optional<T> = T | undefined | null
type DateType = Optional<string | number | Date>

const createFormatDateTime = (locale?: string) => {
  return function formatDateTime(
    date: DateType,
    optionsOrOverrideLocale?: Intl.DateTimeFormatOptions | string,
    overrideLocale?: string,
  ) {
    const options =
      typeof optionsOrOverrideLocale === "object"
        ? optionsOrOverrideLocale
        : undefined
    const _overrideLocale =
      typeof optionsOrOverrideLocale === "string"
        ? optionsOrOverrideLocale
        : overrideLocale
    const _locale = _overrideLocale ?? locale ?? "fi"

    const dt = new Date(date ?? "")

    if (isNaN(dt.getTime())) {
      return "-"
    } else {
      return dt.toLocaleString(_locale, {
        ...defaultDateTimeOptions,
        ...(options ?? {}),
      })
    }
  }
}

export const formatDateTime = createFormatDateTime()
/* export function formatDateTime(date: DateType): string
export function formatDateTime(date: DateType, overrideLocale?: string): string
export function formatDateTime(
  date: DateType,
  options?: Intl.DateTimeFormatOptions,
): string
export function formatDateTime(
  date: DateType,
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

  const dt = new Date(date ?? "")

  if (isNaN(dt.getTime())) {
    return "-"
  } else {
    return dt.toLocaleString(locale, {
      ...defaultDateTimeOptions,
      ...(datetimeOptions ?? {}),
    })
  }
} */

export const useFormatDateTime = () => {
  const { locale } = useRouter()

  return useMemo(() => createFormatDateTime(locale), [locale])
}

export default formatDateTime
