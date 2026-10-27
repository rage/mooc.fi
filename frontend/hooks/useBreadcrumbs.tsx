import { useEffect } from "react"

import { Breadcrumb, useBreadcrumbContext } from "/contexts/BreadcrumbContext"

/** `isNarrow` aligns the trail with a text column narrower than the page. */
export function useBreadcrumbs(crumbs: Breadcrumb[], isNarrow = false) {
  const { setBreadcrumbs, setIsNarrow } = useBreadcrumbContext()

  useEffect(() => {
    setBreadcrumbs(crumbs)
  }, [JSON.stringify(crumbs)])

  useEffect(() => {
    setIsNarrow(isNarrow)
    return () => setIsNarrow(false)
  }, [isNarrow])
}
