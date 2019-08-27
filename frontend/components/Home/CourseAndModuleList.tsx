import React, { useContext, useMemo } from "react"
import CourseHighlights from "./CourseHighlights"
import {
  // filterAndModifyCoursesByLanguage,
  mapNextLanguageToLocaleCode,
  // filterAndModifyByLanguage,
} from "/util/moduleFunctions"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { AllModules as AllModulesData } from "/static/types/generated/AllModules"
import { AllCourses as AllCoursesData } from "/static/types/generated/AllCourses"
/* import {
  ObjectifiedCourse,  ObjectifiedModule,
} from "/static/types/moduleTypes" */
import ModuleNavi from "./ModuleNavi"
import ModuleList from "./ModuleList"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"

const highlightsBanner = "/static/images/backgroundPattern.svg"

export const AllModulesQuery = gql`
  query AllModules($language: String) {
    study_modules(orderBy: order_ASC, language: $language) {
      id
      slug
      name
      description
      image
      order
    }
  }
`

export const AllCoursesQuery = gql`
  query AllCourses($language: String) {
    courses(orderBy: order_ASC, language: $language) {
      id
      slug
      name
      order
      photo {
        id
        compressed
        uncompressed
      }
      promote
      status
      start_point
      study_module_start_point
      hidden
      description
      link
      study_modules {
        id
      }
    }
  }
`

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

  if (coursesError || modulesError) {
    ;<div>
      Error:{" "}
      <pre>{JSON.stringify(coursesError || modulesError, undefined, 2)}</pre>
    </div>
  }

  if (!coursesData || !modulesData) {
    return <div>Error: no data?</div>
  }

  const { courses } = coursesData
  const { study_modules } = modulesData

  const modulesWithCourses = useMemo(
    (): AllModules_study_modules_with_courses[] =>
      (study_modules || []).map(module => {
        const moduleCourses = (courses || []).filter(
          course =>
            (course!.study_modules || []).filter(
              courseModule => courseModule.id === module.id,
            ).length,
        )

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
    () => (activeCourses || []).filter(c => c.promote),
    [activeCourses],
  )

  return (
    <section id="courses-and-modules">
      <CourseHighlights
        courses={promotedCourses}
        title={t("highlightTitle")}
        headerImage={highlightsBanner}
        subtitle={t("highlightSubtitle")}
        backgroundColor="#009CA6"
        hueRotateAngle={177}
        brightness={5.5}
        fontColor="black"
        titleBackground="#ffffff"
      />
      <ModuleNavi modules={study_modules} loading={modulesLoading} />
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
        fontColor="black"
        titleBackground="#ffffff"
      />
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
  )
}

export default React.memo(CourseAndModuleList)
