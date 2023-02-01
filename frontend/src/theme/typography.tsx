import { createTheme, Theme } from "@mui/material/styles"

import { openSansCondensedDeclaration, roboto } from "/src/fonts"

export const withTypography = (theme: Theme) =>
  createTheme(theme, {
    typography: {
      fontFamily: roboto.style.fontFamily,
      button: {
        label: {
          textTransform: "none",
          ...openSansCondensedDeclaration,
        },
      },
      h1: {
        paddingBottom: "1rem",
        fontSize: 32,
        ...openSansCondensedDeclaration,
        "@media (min-width: 600px)": {
          fontSize: 42,
        },
        "@media (min-width: 960px)": {
          fontSize: 58,
        },
        "@media (min-width: 1440px)": {
          fontSize: 68,
        },
        letterSpacing: "-1px",
      },
      h2: {
        paddingBottom: "1rem",
        ...openSansCondensedDeclaration,
        fontSize: 46,
        "@media (min-width: 600px)": {
          fontSize: 56,
        },
        "@media (min-width: 960px)": {
          fontSize: 72,
        },
      },
      h3: {
        paddingBottom: "0.5rem",
        paddingTop: "0.7rem",
        ...openSansCondensedDeclaration,
        fontSize: 16,
        "@media (min-width: 600px)": {
          fontSize: 20,
        },
      },
      h4: {
        ...openSansCondensedDeclaration,
        fontSize: 14,
        "@media (min-width: 600px)": {
          fontSize: 16,
        },
      },
      subtitle1: {
        ...openSansCondensedDeclaration,
        fontSize: 18,
        "@media (min-width: 600px)": {
          fontSize: 22,
        },
        "@media (min-width: 1440px)": {
          fontSize: 32,
        },
      },
      body1: {
        fontSize: 12,
        "@media (min-width: 600px)": {
          fontSize: 14,
        },
        "@media (min-width: 960px)": {
          fontSize: 16,
        },
      },
    },
  })
