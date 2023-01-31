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

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    // adds breakpoints
    xxxs: true
    xxs: true
  }
}