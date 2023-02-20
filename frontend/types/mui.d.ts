import { LinkProps as NextLinkProps } from "next/link"

declare module "@mui/material/Link" {
  import * as base from "@mui/material/Link"
  export type LinkProps<
    D extends React.ElementType = LinkTypeMap["defaultComponent"],
    P = object,
  > = OverrideProps<LinkTypeMap<P, D>, D> & NextLinkProps
  export = base
}

declare module "@mui/material/ButtonBase" {
  import * as base from "@mui/material/ButtonBase"
  export type ButtonBaseProps<
    D extends React.ElementType = ButtonBaseTypeMap["defaultComponent"],
    P = object,
  > = OverrideProps<ButtonBaseTypeMap<P, D>, D> & NextLinkProps
  export = base
}

declare module "@mui/material/Typography" {
  // add typography variants - also needs to be declared in "styles"
  interface TypographyPropsVariantOverrides {
    ingress: true
  }
}

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    // adds breakpoints
    xxxs: true
    xxs: true
  }

  // add typography variants - also needs to be declared in Typography
  interface TypographyVariants {
    ingress: React.CSSProperties
  }
  interface TypographyVariantsOptions {
    ingress?: React.CSSProperties
  }

  interface Theme {
    blue: React.CSSProperties["color"]
    clear: React.CSSProperties["color"]
    crimson: React.CSSProperties["color"]
    gray: React.CSSProperties["color"]
    green: React.CSSProperties["color"]
    purple: React.CSSProperties["color"]
    red: React.CSSProperties["color"]
    yellow: React.CSSProperties["color"]
  }
  interface ThemeOptions {
    blue?: React.CSSProperties["color"]
    clear?: React.CSSProperties["color"]
    crimson?: React.CSSProperties["color"]
    gray?: React.CSSProperties["color"]
    green?: React.CSSProperties["color"]
    purple?: React.CSSProperties["color"]
    red?: React.CSSProperties["color"]
    yellow?: React.CSSProperties["color"]
  }
  interface Palette {
    blue: Palette["primary"]
    clear: Palette["primary"]
    crimson: Palette["primary"]
    gray: Palette["primary"]
    green: Palette["primary"]
    purple: Palette["primary"]
    red: Palette["primary"]
    yellow: Palette["primary"]
  }
  interface PaletteOptions {
    blue?: PaletteOptions["primary"]
    clear?: PaletteOptions["primary"]
    crimson?: PaletteOptions["primary"]
    gray?: PaletteOptions["primary"]
    green?: PaletteOptions["primary"]
    purple?: PaletteOptions["primary"]
    red?: PaletteOptions["primary"]
    yellow?: PaletteOptions["primary"]
  }
  interface PaletteColor {
    light1?: string
    light2?: string
    light3?: string
    dark1?: string
    dark2?: string
    dark3?: string
  }
  interface SimplePaletteColorOptions {
    light1?: string
    light2?: string
    light3?: string
    dark1?: string
    dark2?: string
    dark3?: string
  }
}
