import { useContext, useMemo } from "react"
import CourseHighlights from "./CourseHighlights"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"
import { useQuery } from "@apollo/client"
import { AllModules as AllModulesData } from "/static/types/generated/AllModules"
import { AllCourses as AllCoursesData } from "/static/types/generated/AllCourses"
import ModuleNavi from "./ModuleNavi"
import ModuleList from "./ModuleList"
import LanguageContext from "/contexes/LanguageContext"
import HomeTranslations from "/translations/home"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"

const highlightsBanner = "/static/images/backgroundPattern.svg"

import { AllCoursesQuery } from "/graphql/queries/courses"
import { AllModulesQuery } from "/graphql/queries/study-modules"
import { CourseStatus } from "/static/types/generated/globalTypes"
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/util/useTranslator"

const CourseAndModuleList = () => {
  const lngCtx = useContext(LanguageContext)
  const t = useTranslator(HomeTranslations)
  const language = mapNextLanguageToLocaleCode(lngCtx.language)

  const {
    loading: coursesLoading,
    error: coursesError,
    data: coursesData,
  } = useQuery<AllCoursesData>(AllCoursesQuery, { variables: { language } })
  const {
    loading: modulesLoading,
    error: modulesError,
    data: modulesData,
  } = useQuery<AllModulesData>(AllModulesQuery, { variables: { language } })

  const courses = coursesData?.courses
  let study_modules = modulesData?.study_modules?.filter(notEmpty)

  const modulesWithCourses = useMemo(
    (): AllModules_study_modules_with_courses[] =>
      (study_modules || [])
        .filter(notEmpty)
        .map((module) => {
          const moduleCourses =
            courses
              ?.filter(notEmpty)
              .filter(
                (course) =>
                  course?.study_modules?.some(
                    (courseModule) => courseModule.id === module.id,
                  ) && course?.status !== CourseStatus.Ended,
              ) ?? []

          return { ...module, courses: moduleCourses }
        })
        .filter((m) => m.courses.length > 0) ?? [],
    [study_modules, courses],
  )

  study_modules = study_modules?.filter((s) =>
    modulesWithCourses.find((m) => m.id === s.id),
  )

  const [activeCourses, upcomingCourses, endedCourses] = useMemo(
    () =>
      ["Active", "Upcoming", "Ended"].map((status) =>
        (courses || [])
          .filter(notEmpty)
          .filter((c) => !c.hidden && c.status === status),
      ),
    [courses],
  )

  const promotedCourses = useMemo(
    () => activeCourses?.filter(notEmpty).filter((c) => c.promote) ?? [],
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

  return (
    <section>
      <section id="courses">
        <CourseHighlights
          courses={promotedCourses}
          loading={coursesLoading}
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
          loading={coursesLoading}
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
          loading={coursesLoading}
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
        </section>
      ) : null}
      <CourseHighlights
        courses={endedCourses}
        loading={coursesLoading}
        title={t("endedCoursesTitle")}
        headerImage={highlightsBanner}
        backgroundColor="#ffffff"
        hueRotateAngle={58}
        brightness={1}
        fontColor="white"
        titleBackground="#3066C0"
      />
    </section>
  )
}

export default CourseAndModuleList
