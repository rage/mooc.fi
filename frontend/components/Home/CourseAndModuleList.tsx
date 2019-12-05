import React, { useContext, useMemo } from "react"
import CourseHighlights from "./CourseHighlights"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"
import { useQuery } from "@apollo/react-hooks"
import { AllModules as AllModulesData } from "/static/types/generated/AllModules"
import { AllCourses as AllCoursesData } from "/static/types/generated/AllCourses"
import ModuleNavi from "./ModuleNavi"
import ModuleList from "./ModuleList"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"

const highlightsBanner = "/static/images/backgroundPattern.svg"

import { AllCoursesQuery } from "/graphql/queries/courses"
import { AllModulesQuery } from "/graphql/queries/study-modules"

const CourseAndModuleList = () => {
  const lngCtx = useContext(LanguageContext)
  const t = getHomeTranslator(lngCtx.language)
  const language = mapNextLanguageToLocaleCode(lngCtx.language)

  const {
    // @ts-ignore
    loading: coursesLoading,
    error: coursesError,
    data: coursesData,
  } = useQuery<AllCoursesData>(AllCoursesQuery, { variables: { language } })
  const {
    loading: modulesLoading,
    error: modulesError,
    data: modulesData,
  } = useQuery<AllModulesData>(AllModulesQuery, { variables: { language } })

  const courses = coursesData?.courses ?? undefined
  const study_modules = modulesData?.study_modules ?? undefined

  const modulesWithCourses = useMemo(
    (): AllModules_study_modules_with_courses[] =>
      (study_modules || []).map(module => {
        const moduleCourses =
          courses?.filter(course =>
            course?.study_modules?.some(
              courseModule => courseModule.id === module.id,
            ),
          ) ?? []

        return { ...module, courses: moduleCourses }
      }),
    [study_modules, courses],
  )

  const [activeCourses, upcomingCourses, endedCourses] = useMemo(
    () =>
      ["Active", "Upcoming", "Ended"].map(status =>
        (courses || []).filter(c => !c.hidden && c.status === status),
      ),
    [courses],
  )
  const promotedCourses = useMemo(
    () => activeCourses?.filter(c => c.promote) ?? [],
    [activeCourses],
  )

  if (coursesError || modulesError) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(
          coursesError || modulesError,
          undefined,
          2,
        )}
      />
    )
  }

  if (!coursesData) {
    return <div>Error: no courses data?</div>
  }
  if (!modulesData) {
    return <div>Error: no modules data? </div>
  }

  return (
    <section>
      <section id="courses">
        <CourseHighlights
          courses={promotedCourses}
          title={t("highlightTitle")}
          headerImage={highlightsBanner}
          subtitle={t("highlightSubtitle")}
          backgroundColor="#4D78A3"
          hueRotateAngle={177}
          brightness={5.5}
          fontColor="#4D78A3"
          titleBackground="#ffffff"
        />
        <CourseHighlights
          courses={activeCourses}
          title={t("allCoursesTitle")}
          headerImage={highlightsBanner}
          backgroundColor="#ffffff"
          hueRotateAngle={34}
          brightness={1}
          fontColor="white"
          titleBackground="#008EBD"
        />
        <CourseHighlights
          courses={upcomingCourses}
          title={t("upcomingCoursesTitle")}
          headerImage={highlightsBanner}
          backgroundColor="#007DC8"
          hueRotateAngle={0}
          brightness={5.5}
          fontColor="#007DC8"
          titleBackground="#ffffff"
        />
      </section>
      {language === "fi_FI" ? (
        <section id="modules">
          <ModuleNavi modules={study_modules} loading={modulesLoading} />
          <ModuleList modules={modulesWithCourses} loading={modulesLoading} />
          <CourseHighlights
            courses={endedCourses}
            title={t("endedCoursesTitle")}
            headerImage={highlightsBanner}
            backgroundColor="#ffffff"
            hueRotateAngle={58}
            brightness={1}
            fontColor="white"
            titleBackground="#3066C0"
          />
        </section>
      ) : null}
    </section>
  )
}

export default CourseAndModuleList
