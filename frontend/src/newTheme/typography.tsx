import { createTheme, responsiveFontSizes, Theme } from "@mui/material/styles"

import { openSansCondensedDeclaration, roboto } from "/src/fonts"

export const withTypography = (theme: Theme) => {
  let newTheme = createTheme(theme, {
    typography: {
      fontFamily: roboto.style.fontFamily,
      button: {
        label: {
          textTransform: "none",
          ...openSansCondensedDeclaration,
        },
      },
      // FIXME: disrepancy as h2 is larger than h1?
      h1: {
        paddingBottom: "1rem",
        fontSize: 40,
        fontFamily: roboto.style.fontFamily,
        /*"@media (min-width: 600px)": {
        fontSize: 30,
      },
      "@media (min-width: 960px)": {
        fontSize: 36,
      },
      "@media (min-width: 1440px)": {
        fontSize: 44,
      },*/
      },
      h2: {
        paddingBottom: "1rem",
        fontFamily: roboto.style.fontFamily,
        fontSize: 32,
        /*"@media (min-width: 600px)": {
        fontSize: 56,
      },
      "@media (min-width: 960px)": {
        fontSize: 72,
      },*/
      },
      h3: {
        paddingBottom: "0.5rem",
        paddingTop: "0.7rem",
        fontFamily: roboto.style.fontFamily,
        fontSize: 16,
        /*"@media (min-width: 600px)": {
        fontSize: 20,
      },*/
      },
      h4: {
        fontFamily: roboto.style.fontFamily,
        fontSize: 14,
        /*"@media (min-width: 600px)": {
        fontSize: 16,
      },*/
      },
      subtitle1: {
        fontFamily: roboto.style.fontFamily,
        fontSize: 18,
        /*"@media (min-width: 600px)": {
        fontSize: 22,
      },
      "@media (min-width: 1440px)": {
        fontSize: 32,
      },*/
      },
      body1: {
        fontSize: 12,
        /*"@media (min-width: 600px)": {
        fontSize: 14,
      },
      "@media (min-width: 960px)": {
        fontSize: 16,
      },*/
      },
    },
  })

  newTheme = responsiveFontSizes(newTheme)

  return newTheme
}
