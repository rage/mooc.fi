import { createContext, useContext } from "react"

export interface Breadcrumb {
  label?: string
  as?: string
  href?: string
}

interface BreadcrumbContext {
  breadcrumbs: Breadcrumb[]
  setBreadcrumbs: (crumbs: Breadcrumb[]) => void
}

export const BreadcrumbContext = createContext({
  breadcrumbs: [],
  setBreadcrumbs: (_: Breadcrumb[]) => {},
})

export const useBreadcrumbContext = () => {
  const context = useContext(BreadcrumbContext)

  return context
}
