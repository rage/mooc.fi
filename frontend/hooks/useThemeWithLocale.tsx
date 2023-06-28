import { useMemo } from "react"

import mediaQuery from "css-mediaquery"
import { useRouter } from "next/router"

import { createTheme } from "@mui/material/styles"

import useIsNew from "./useIsNew"
import { datePickersfiFI, fiFI } from "/lib/locale"
import newTheme from "/src/newTheme"
import originalTheme from "/src/theme"

const getMediaQueryDefaultProps = (deviceType?: string) => {
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
}

export default function useThemeWithLocale(deviceType?: string) {
  const router = useRouter()
  const { locale = "fi" } = router

  const isNew = useIsNew()
  const theme = isNew ? newTheme : originalTheme

  const themeWithLocale = useMemo(
    () =>
      locale === "fi"
        ? createTheme(
            theme,
            fiFI,
            datePickersfiFI,
            getMediaQueryDefaultProps(deviceType),
          )
        : createTheme(theme, getMediaQueryDefaultProps(deviceType)),
    [theme, locale, deviceType],
  )

  return themeWithLocale
}
