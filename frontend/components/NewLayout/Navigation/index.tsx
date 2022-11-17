import { useRouter } from "next/router"

export function useActiveTab() {
  const { pathname } = useRouter()

  return pathname.match(
    "/(courses|study-modules|email-templates|profile|users|admin)",
  )?.[1]
}

export * from "./NavigationMenu"
