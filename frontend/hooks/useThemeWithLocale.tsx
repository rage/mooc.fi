import { useMemo } from "react"

import mediaQuery from "css-mediaquery"
import { useRouter } from "next/router"

import { createTheme } from "@mui/material/styles"

import useIsNew from "./useIsNew"
import { datePickersfiFI, fiFI } from "/lib/locale"
import newTheme from "/src/newTheme"
import originalTheme from "/src/theme"

export default function useThemeWithLocale(deviceType?: string) {
  const router = useRouter()
  const { locale = "fi" } = router

  const isNew = useIsNew()
  const theme = isNew ? newTheme : originalTheme

  const mediaQueryDefaultProps = useMemo(() => {
    const ssrMatchMedia = (query: string) => ({
      matches: mediaQuery.match(query, {
        // The estimated CSS width of the browser.
        width: deviceType === "mobile" ? "0px" : "1024px",
      }),
    })

    return {
      components: {
        MuiUseMediaQuery: {
          defaultProps: {
            ssrMatchMedia,
          },
        },
      },
    }
  }, [deviceType])

  const themeWithLocale = useMemo(
    () =>
      locale === "fi"
        ? createTheme(theme, fiFI, datePickersfiFI, mediaQueryDefaultProps)
        : createTheme(theme, mediaQueryDefaultProps),
    [theme, locale, mediaQueryDefaultProps],
  )

  return themeWithLocale
}
