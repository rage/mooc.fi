import { LinkProps as NextLinkProps } from "next/link"

import { Button as MUIButton } from "@mui/material"
import {
  ButtonProps,
  ButtonTypeMap as MUIButtonTypeMap,
} from "@mui/material/Button"
import {
  ButtonBaseProps,
  ExtendButtonBase,
  ExtendButtonBaseTypeMap,
  ButtonBaseTypeMap as MUIButtonBaseTypeMap,
} from "@mui/material/ButtonBase"
import { LinkTypeMap as MUILinkTypeMap } from "@mui/material/Link"
import { MenuItemTypeMap as MUIMenuItemTypeMap } from "@mui/material/MenuItem"
import {
  OverridableComponent,
  OverridableTypeMap,
  OverrideProps,
} from "@mui/material/OverridableComponent"

type LinkProps = Omit<
  NextLinkProps,
  {
    [K in keyof NextLinkProps]: K extends `on${string}` ? K : never
  }[keyof NextLinkProps]
>

declare module "@mui/material/Link" {
  export type LinkProps<
    D extends React.ElementType = MUILinkTypeMap["defaultComponent"],
    // eslint-disable-next-line @typescript-eslint/ban-types
    P = {},
  > = OverrideProps<MUILinkTypeMap<P, D>, D> & LinkProps
  declare const Link: OverridableComponent<MUILinkTypeMap<LinkProps, "a">>
  export default Link
}
declare module "@mui/material/ButtonBase" {
  export type ButtonBaseProps<
    D extends React.ElementType = MUIButtonBaseTypeMap["defaultComponent"],
    // eslint-disable-next-line @typescript-eslint/ban-types
    P = {},
  > = OverrideProps<MUIButtonBaseTypeMap<P, D>, D> & Partial<LinkProps>
  declare const ButtonBase: ExtendButtonBase<
    MUIButtonBaseTypeMap<Partial<LinkProps>, "button">
  >
  export default ButtonBase
}

declare module "@mui/material/Button" {
  export type ButtonProps<
    D extends React.ElementType = MUIButtonTypeMap["defaultComponent"],
    // eslint-disable-next-line @typescript-eslint/ban-types
    P = {},
  > = OverrideProps<MUIButtonTypeMap<P, D>, D> & Partial<LinkProps>
  declare const Button: ExtendButtonBase<
    MUIButtonTypeMap<Partial<LinkProps>, "button">
  >
  export default Button
}
declare module "@mui/material" {
  export type EnhancedLink<
    D extends React.ElementType = MUILinkTypeMap["defaultComponent"],
    // eslint-disable-next-line @typescript-eslint/ban-types
    P = {},
  > = OverridableComponent<MUILinkTypeMap<P & LinkProps, D>>
  export type EnhancedButtonBase<
    D extends React.ElementType = MUIButtonBaseTypeMap["defaultComponent"],
    // eslint-disable-next-line @typescript-eslint/ban-types
    P = {},
  > = ExtendButtonBase<MUIButtonBaseTypeMap<P & Partial<LinkProps>, D>>
  export type EnhancedButton<
    D extends React.ElementType = MUIButtonTypeMap["defaultComponent"],
    // eslint-disable-next-line @typescript-eslint/ban-types
    P = {},
  > = ExtendButtonBase<MUIButtonTypeMap<P & Partial<LinkProps>, D>>
  export type EnhancedMenuItem<
    D extends React.ElementType = MUIMenuItemTypeMap["defaultComponent"],
    // eslint-disable-next-line @typescript-eslint/ban-types
    P = {},
  > = ExtendButtonBase<MUIMenuItemTypeMap<P & Partial<LinkProps>, D>>
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

  //

  interface ComponentNameToClassKey {
    MUIDataTableHeadCell:
      | "root"
      | "contentWrapper"
      | "data"
      | "dragCursor"
      | "fixedHeader"
      | "hintIconAlone"
      | "hintIconWithSortIcon"
      | "mypopper"
      | "sortAction"
      | "sortActive"
      | "sortLabelRoot"
      | "toolButton"
      | "tooltip"
    MUIDataTable:
      | "root"
      | "caption"
      | "liveAnnounce"
      | "paper"
      | "responsiveScroll"
      | "tableRoot"
      | "responsiveBase" // not sure it's there

    MUIDataTableToolbar:
      | "root"
      | "actions"
      | "filterCloseIcon"
      | "filterPaper"
      | "fullWidthActions"
      | "fullWidthLeft"
      | "fullWidthRoot"
      | "fullWidthTitleText"
      | "icon"
      | "iconActive"
      | "left"
      | "searchIcon"
      | "titleRoot"
      | "titleText"
  }

  interface Components<Theme = unknown> {
    MUIDataTableHeadCell?: {
      styleOverrides?: ComponentsOverrides<Theme>["MUIDataTableHeadCell"]
    }
    MUIDataTable?: {
      styleOverrides?: ComponentsOverrides<Theme>["MUIDataTable"]
    }
    MUIDataTableToolbar?: {
      styleOverrides?: ComponentsOverrides<Theme>["MUIDataTableToolbar"]
    }
  }
}
