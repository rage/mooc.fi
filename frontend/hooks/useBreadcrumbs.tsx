import { useEffect } from "react"

import { Breadcrumb, useBreadcrumbContext } from "/contexts/BreadcrumbContext"

export function useBreadcrumbs(crumbs: Breadcrumb[]) {
  const { setBreadcrumbs } = useBreadcrumbContext()

  useEffect(() => {
    setBreadcrumbs(crumbs)
  }, [JSON.stringify(crumbs)])
}
