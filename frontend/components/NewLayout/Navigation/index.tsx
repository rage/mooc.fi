import { useRouter } from "next/router"

import { css } from "@mui/material/styles"

import { fontSize } from "/src/theme/util"

export const NavigationLinkStyle = css`
  ${fontSize(14, 16)}
  font-weight: 700;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  height: 100%;
  letter-spacing: -0.7px;
  padding: 26px 10px;
  width: auto;
  text-transform: uppercase;
  text-decoration: none;
  text-align: left;
  align-items: center;
  justify-content: center;
  transition: 0.1s;

  svg {
    pointer-events: none;
    margin-left: 4px;
    height: 10px;
    width: 10px;
    font-size: 10px;
  }
`
export function useActiveTab() {
  const { pathname } = useRouter()

  return pathname.match(
    "/(courses|study-modules|email-templates|profile|users|admin)",
  )?.[1]
}

export type NavigationMenuLinkItem = {
  href: string
  label: string
  name?: string
  description?: string
  onClick?: (...params: any[]) => any
}

export type NavigationMenuShortcutItem = {
  href: string
  label: string
  name?: string
  description?: string
  external?: boolean
  onClick?: (...params: any[]) => any
}

export type NavigationMenuSubmenuItem = NavigationMenuLinkItem & {
  items: Array<NavigationMenuItem>
  shortcuts?: Array<NavigationMenuShortcutItem>
}

export type NavigationMenuItem =
  | NavigationMenuLinkItem
  | NavigationMenuSubmenuItem

export const isSubmenuItem = (
  item: NavigationMenuItem,
): item is NavigationMenuSubmenuItem =>
  Boolean((item as NavigationMenuSubmenuItem).items)

export { default as MobileNavigationMenu } from "./MobileNavigationMenu"
export { default as DesktopNavigationMenu } from "./DesktopNavigationMenu"
export { default as NavigationMenu } from "./NavigationMenu"
