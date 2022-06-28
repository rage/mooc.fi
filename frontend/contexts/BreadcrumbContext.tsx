import { createContext, useContext } from "react"

import { BreadcrumbsTranslations } from "/translations/breadcrumbs"

export interface Breadcrumb {
  translation?: keyof BreadcrumbsTranslations
  label?: string
  as?: string
  href?: string
}

interface BreadcrumbContext {
  breadcrumbs: Breadcrumb[]
  setBreadcrumbs: (crumbs: Breadcrumb[]) => void
}

export const BreadcrumbContext = createContext({
  breadcrumbs: [] as Breadcrumb[],
  setBreadcrumbs: (_: Breadcrumb[]) => {},
})

export const useBreadcrumbContext = () => {
  const context = useContext(BreadcrumbContext)

  return context
}
