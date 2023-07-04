/* eslint-disable @typescript-eslint/ban-types */
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
import { ComponentsOverrides } from "@mui/material/styles"

type DefaultNextLinkProps = Omit<
  NextLinkProps,
  {
    [K in Exclude<keyof NextLinkProps, undefined>]: K extends `on${string}`
      ? K
      : never
  }[keyof NextLinkProps]
>

declare module "@mui/material/Link" {
  export type LinkProps<
    D extends React.ElementType = MUILinkTypeMap["defaultComponent"],
    P = {},
  > = OverrideProps<MUILinkTypeMap<P, D>, D> & Partial<DefaultNextLinkProps>
  const Link: OverridableComponent<
    MUILinkTypeMap<Partial<DefaultNextLinkProps>, "a">
  >
}
declare module "@mui/material/ButtonBase" {
  export type ButtonBaseProps<
    D extends React.ElementType = MUIButtonBaseTypeMap["defaultComponent"],
    P = {},
  > = OverrideProps<MUIButtonBaseTypeMap<P, D>, D> &
    Partial<DefaultNextLinkProps>
  const ButtonBase: ExtendButtonBase<
    MUIButtonBaseTypeMap<Partial<DefaultNextLinkProps>, "button">
  >
}

declare module "@mui/material/Button" {
  export type ButtonProps<
    D extends React.ElementType = MUIButtonTypeMap["defaultComponent"],
    P = {},
  > = OverrideProps<MUIButtonTypeMap<P, D>, D> & Partial<DefaultNextLinkProps>
  const Button: ExtendButtonBase<
    MUIButtonTypeMap<Partial<DefaultNextLinkProps>, "button">
  >
}
declare module "@mui/material" {
  export type EnhancedLink<
    D extends React.ElementType = MUILinkTypeMap["defaultComponent"],
    P = {},
  > = OverridableComponent<MUILinkTypeMap<P & DefaultNextLinkProps, D>>
  export type EnhancedButtonBase<
    D extends React.ElementType = MUIButtonBaseTypeMap["defaultComponent"],
    P = {},
  > = ExtendButtonBase<
    MUIButtonBaseTypeMap<P & Partial<DefaultNextLinkProps>, D>
  >
  export type EnhancedButton<
    D extends React.ElementType = MUIButtonTypeMap["defaultComponent"],
    P = {},
  > = ExtendButtonBase<MUIButtonTypeMap<P & Partial<DefaultNextLinkProps>, D>>
  export type EnhancedMenuItem<
    D extends React.ElementType = MUIMenuItemTypeMap["defaultComponent"],
    P = {},
  > = ExtendButtonBase<MUIMenuItemTypeMap<P & Partial<DefaultNextLinkProps>, D>>
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
    desktop: true
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
