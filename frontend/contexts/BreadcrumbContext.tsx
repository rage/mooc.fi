import React, { createContext, useContext, useMemo, useState } from "react"

import { KeyOfTranslation } from "/translations"
import { Breadcrumbs } from "/translations/breadcrumbs"

export interface Breadcrumb {
  translation?: KeyOfTranslation<Breadcrumbs>
  label?: string
  as?: string
  href?: string
}

export interface BreadcrumbContextType {
  breadcrumbs: Breadcrumb[]
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Array<Breadcrumb>>>
  isNarrow: boolean
  setIsNarrow: React.Dispatch<React.SetStateAction<boolean>>
}

export const BreadcrumbContext = createContext<BreadcrumbContextType>({
  breadcrumbs: [] as Breadcrumb[],
  setBreadcrumbs: () => void 0,
  isNarrow: false,
  setIsNarrow: () => void 0,
})

export const useBreadcrumbContext = () => {
  const context = useContext(BreadcrumbContext)

  return context
}

export const BreadcrumbProvider = React.memo(function BreadcrumbProvider({
  children,
}: React.PropsWithChildren) {
  const [breadcrumbs, setBreadcrumbs] = useState<Array<Breadcrumb>>([])

  const [isNarrow, setIsNarrow] = useState(false)

  const breadcrumbContextValue = useMemo(
    () => ({ breadcrumbs, setBreadcrumbs, isNarrow, setIsNarrow }),
    [breadcrumbs, isNarrow],
  )

  return (
    <BreadcrumbContext.Provider value={breadcrumbContextValue}>
      {children}
    </BreadcrumbContext.Provider>
  )
})
