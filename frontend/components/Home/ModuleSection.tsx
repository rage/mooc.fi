import { useRouter } from "next/router"
import { isDefined } from "remeda"

import { useQuery } from "@apollo/client"

import ModifiableErrorMessage from "../ModifiableErrorMessage"
import ModuleList from "./ModuleList"
import ModuleNavi from "./ModuleNavi"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

import {
  CourseStatus,
  FrontpageModulesWithCoursesDocument,
  FrontpageModulesWithCoursesQuery,
} from "/graphql/generated"

const hasCourses = (
  studyModule: NonNullable<
    FrontpageModulesWithCoursesQuery["study_modules"]
  >[number],
): studyModule is NonNullable<
  FrontpageModulesWithCoursesQuery["study_modules"]
>[number] & {
  courses: NonNullable<
    NonNullable<
      FrontpageModulesWithCoursesQuery["study_modules"]
    >[number]["courses"]
  >
} => isDefined(studyModule?.courses) && studyModule.courses.length > 0

const ModuleSection = () => {
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)

  const { loading, error, data } = useQuery(
    FrontpageModulesWithCoursesDocument,
    {
      variables: {
        language,
        statuses: [CourseStatus.Active, CourseStatus.Upcoming],
      },
    },
  )

  const studyModulesWithCourses = (data?.study_modules ?? []).filter(hasCourses)

  if (error) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error, undefined, 2)}
      />
    )
  }

  return (
    <section id="modules">
      <ModuleNavi studyModules={data?.study_modules ?? []} loading={loading} />
      <ModuleList studyModules={studyModulesWithCourses} loading={loading} />
    </section>
  )
}

export default ModuleSection
