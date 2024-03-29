/* eslint-disable @typescript-eslint/ban-types */
import { LinkProps as NextLinkProps } from "next/link"

import { ListItemButtonTypeMap } from "@mui/material"
import { ButtonTypeMap } from "@mui/material/Button"
import { ButtonBaseTypeMap, ExtendButtonBase } from "@mui/material/ButtonBase"
import { IconButtonTypeMap } from "@mui/material/IconButton"
import { LinkTypeMap } from "@mui/material/Link"
import { MenuItemTypeMap } from "@mui/material/MenuItem"
import {
  OverridableComponent,
  OverrideProps,
} from "@mui/material/OverridableComponent"
import { ComponentsOverrides } from "@mui/material/styles"

import { LinkBehavior } from "/components/Link"

type DefaultNextLinkProps = Omit<
  NextLinkProps,
  {
    [K in Exclude<keyof NextLinkProps, undefined>]: K extends `on${string}`
      ? K
      : never
  }[keyof NextLinkProps]
>

declare module "@mui/material/Link" {
  export type EnhancedLinkProps<
    D extends React.ElementType = LinkTypeMap["defaultComponent"],
    P = {},
  > = OverrideProps<
    LinkTypeMap<P & Partial<DefaultNextLinkProps>, D>,
    D & typeof LinkBehavior
  >
  export type EnhancedLink<
    D extends React.ElementType = LinkTypeMap["defaultComponent"],
    P = {},
  > = OverridableComponent<LinkTypeMap<P & Partial<DefaultNextLinkProps>, D>>
  const Link: OverridableComponent<
    LinkTypeMap<Partial<DefaultNextLinkProps>, typeof LinkBehavior>
  >
}

declare module "@mui/material/ButtonBase" {
  export type EnhancedButtonBaseProps<
    D extends React.ElementType = ButtonBaseTypeMap["defaultComponent"],
    P = {},
  > = OverrideProps<ButtonBaseTypeMap<P & Partial<DefaultNextLinkProps>, D>, D>
  export type EnhancedButtonBase<
    D extends React.ElementType = ButtonBaseTypeMap["defaultComponent"],
    P = {},
  > = ExtendButtonBase<ButtonBaseTypeMap<P & Partial<DefaultNextLinkProps>, D>>
  const ButtonBase: ExtendButtonBase<
    ButtonBaseTypeMap<Partial<DefaultNextLinkProps>>
  >
}

declare module "@mui/material/Button" {
  export type EnhancedButtonProps<
    D extends React.ElementType = ButtonTypeMap["defaultComponent"],
    P = {},
  > = OverrideProps<ButtonTypeMap<P & Partial<DefaultNextLinkProps>, D>, D>
  export type EnhancedButton<
    D extends React.ElementType = ButtonTypeMap["defaultComponent"],
    P = {},
  > = ExtendButtonBase<ButtonTypeMap<P & Partial<DefaultNextLinkProps>, D>>
  const Button: ExtendButtonBase<ButtonTypeMap<Partial<DefaultNextLinkProps>>>
}

declare module "@mui/material/MenuItem" {
  export type EnhancedMenuItemProps<
    D extends React.ElementType = MenuItemTypeMap["defaultComponent"],
    P = {},
  > = OverrideProps<MenuItemTypeMap<P & Partial<DefaultNextLinkProps>, D>, D>
  export type EnhancedMenuItem<
    D extends React.ElementType = MenuItemTypeMap["defaultComponent"],
    P = {},
  > = ExtendButtonBase<MenuItemTypeMap<P & Partial<DefaultNextLinkProps>, D>>
  const MenuItem: ExtendButtonBase<
    MenuItemTypeMap<Partial<DefaultNextLinkProps>>
  >
}

declare module "@mui/material/ListItemButton" {
  export type EnhancedListItemButtonProps<
    RootComponent extends
      React.ElementType = ListItemButtonTypeMap["defaultComponent"],
    AdditionalProps = {},
  > = OverrideProps<
    ListItemButtonTypeMap<
      AdditionalProps & Partial<DefaultNextLinkProps>,
      RootComponent
    >,
    RootComponent
  > & { component?: React.ElementType }
  export type EnhancedListItemButton<
    D extends React.ElementType = ButtonTypeMap["defaultComponent"],
    P = {},
  > = ExtendButtonBase<ButtonTypeMap<P & Partial<DefaultNextLinkProps>, D>>
  const ListItemButton: ExtendButtonBase<
    ListItemButtonTypeMap<Partial<DefaultNextLinkProps>>
  >
}

declare module "@mui/material/IconButton" {
  export type EnhancedIconButtonProps<
    D extends React.ElementType = IconButtonTypeMap["defaultComponent"],
    P = {},
  > = OverrideProps<IconButtonTypeMap<P & Partial<DefaultNextLinkProps>, D>, D>
  export type EnhancedIconButton<
    D extends React.ElementType = ButtonTypeMap["defaultComponent"],
    P = {},
  > = ExtendButtonBase<IconButtonTypeMap<P & Partial<DefaultNextLinkProps>, D>>
  const IconButton: ExtendButtonBase<
    IconButonTypeMap<Partial<DefaultNextLinkProps>>
  >
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
    xxl: true
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

declare module "@mui/material/styles/createPalette" {
  interface CommonColors {
    brand: {
      main: string
      soft: string
      bright: string
      light: string
      active: string
      dark: string
      nearlyBlack: string
    }
    link: {
      blue: string
      disabled: string
    }
    grayscale: {
      white: string
      slightlyGray: string
      light: string
      medium: string
      backgroundBox: string
      tabsBorder: string
      backgroundArrow: string
      mediumDark: string
      dark: string
      darkText: string
      black: string
    }
    additional: {
      red: {
        light: string
        dark: string
      }
      purple: {
        light: string
      }
      yellow: {
        light: string
        main: string
      }
      skyblue: string
      orange: string
      green: {
        light: string
        dark: string
      }
    }
    hover: {
      gray: string
    }
  }
}
