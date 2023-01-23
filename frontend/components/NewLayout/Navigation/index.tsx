import { useRouter } from "next/router"

export function useActiveTab() {
  const { pathname } = useRouter()

  return pathname.match(
    "/(courses|study-modules|email-templates|profile|users|admin)",
  )?.[1]
}

export { default as MobileNavigationMenu } from "./MobileNavigationMenu"
export { default as DesktopNavigationMenu } from "./DesktopNavigationMenu"
export * from "./BottomNavigation"
