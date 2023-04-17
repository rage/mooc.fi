import { useMemo } from "react"

import { useRouter } from "next/router"

import { createTheme } from "@mui/material/styles"

import useIsNew from "./useIsNew"
import { datePickersfiFI, fiFI } from "/lib/locale"
import newTheme from "/src/newTheme"
import originalTheme from "/src/theme"

export default function useThemeWithLocale() {
  const router = useRouter()
  const { locale = "fi" } = router

  const isNew = useIsNew()
  const theme = isNew ? newTheme : originalTheme

  const themeWithLocale = useMemo(
    () => (locale === "fi" ? createTheme(theme, fiFI, datePickersfiFI) : theme),
    [theme, locale],
  )

  return themeWithLocale
}
