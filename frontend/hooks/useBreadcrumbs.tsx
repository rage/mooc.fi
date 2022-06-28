import { Breadcrumb, useBreadcrumbContext } from "/contexts/BreadcrumbContext"
import { useEffect } from "react"

export function useBreadcrumbs(crumbs: Breadcrumb[]) {
  const { setBreadcrumbs } = useBreadcrumbContext()

  useEffect(() => {
    setBreadcrumbs(crumbs)
  }, [JSON.stringify(crumbs)])
}
