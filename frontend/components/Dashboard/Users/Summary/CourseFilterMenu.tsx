import {
  useUserPointsSummaryContext,
  useUserPointsSummaryFunctionsContext,
} from "./contexts"
import FilterMenu from "/components/FilterMenu"
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

  return (
    <FilterMenu
      searchVariables={searchVariables}
      setSearchVariables={setSearchVariables}
      loading={loading ?? true}
      label={t("searchInCourses")}
      fields={{
        hidden: false,
        status: false,
        handler: false,
      }}
    />
  )
}

export default CourseFilterMenu
