import { useMemo } from "react"

import {
  useUserPointsSummaryContext,
  useUserPointsSummaryFunctionsContext,
} from "./contexts"
import FilterMenu from "/components/FilterMenu"
import { FilterContext } from "/contexts/FilterContext"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import ProfileTranslations from "/translations/profile"
import UsersTranslations from "/translations/users"

const CourseFilterMenu = () => {
  const t = useTranslator(
    UsersTranslations,
    ProfileTranslations,
    CommonTranslations,
  )

  const { loading, searchVariables } = useUserPointsSummaryContext()
  const { setSearchVariables } = useUserPointsSummaryFunctionsContext()

  const value = useMemo(
    () => ({
      loading: loading ?? false,
      searchVariables,
      setSearchVariables,
    }),
    [loading, searchVariables, setSearchVariables],
  )

  return (
    <FilterContext.Provider value={value}>
      <FilterMenu
        label={t("searchInCourses")}
        fields={{
          hidden: false,
          status: false,
          handler: false,
        }}
      />
    </FilterContext.Provider>
  )
}

export default CourseFilterMenu
