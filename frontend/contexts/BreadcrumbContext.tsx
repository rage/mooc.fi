import React, { createContext, useContext, useMemo, useState } from "react"

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

export const BreadcrumbProvider = React.memo(function BreadcrumbProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [breadcrumbs, setBreadcrumbs] = useState<Array<Breadcrumb>>([])

  const breadcrumbContextValue = useMemo(
    () => ({ breadcrumbs: breadcrumbs, setBreadcrumbs }),
    [breadcrumbs],
  )

  return (
    <BreadcrumbContext.Provider value={breadcrumbContextValue}>
      {children}
    </BreadcrumbContext.Provider>
  )
})
