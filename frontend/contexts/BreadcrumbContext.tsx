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
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Array<Breadcrumb>>>
}

export const BreadcrumbContext = createContext<BreadcrumbContext>({
  breadcrumbs: [] as Breadcrumb[],
  setBreadcrumbs: () => void 0,
})

export const useBreadcrumbContext = () => {
  const context = useContext(BreadcrumbContext)

  return context
}

export const BreadcrumbProvider = React.memo(function BreadcrumbProvider({
  children,
}: React.PropsWithChildren) {
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
