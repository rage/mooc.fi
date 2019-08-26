import React, { useContext, useMemo } from "react"
import CourseHighlights from "./CourseHighlights"
import {
  // filterAndModifyCoursesByLanguage,
  mapNextLanguageToLocaleCode,
  filterAndModifyByLanguage,
} from "/util/moduleFunctions"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { AllModules as AllModulesData } from "/static/types/generated/AllModules"
import { AllCourses as AllCoursesData } from "/static/types/generated/AllCourses"
import {
  /* ObjectifiedCourse, */ ObjectifiedModule,
} from "/static/types/moduleTypes"
import ModuleNavi from "./ModuleNavi"
import ModuleList from "./ModuleList"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"

const highlightsBanner = "/static/images/backgroundPattern.svg"

export const AllModulesQuery = gql`
  query AllModules {
    study_modules(orderBy: order_ASC) {
      id
      slug
      name
      image
      order
      courses(orderBy: study_module_order_ASC) {
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
        course_translations {
          id
          language
          name
          description
          link
        }
      }
      study_module_translations {
        id
        language
        name
        description
      }
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
      hidden
      description
      link
    }
  }
`

/*       course_translations {
        id
        language
        name
        description
        link
      }*/
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
  } = useQuery<AllModulesData>(AllModulesQuery)

  /*   const [language, setLanguage] = useState(
    mapNextLanguageToLocaleCode(lngCtx.language),
  )
  //every time the i18n language changes, update the state
  useEffect(() => {
    setLanguage(mapNextLanguageToLocaleCode(lngCtx.language))
  }, [lngCtx.language]) */

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

  /*   const courses: ObjectifiedCourse[] = useMemo(
    () => filterAndModifyCoursesByLanguage(coursesData.courses, language),
    [coursesData.courses, language],
  ) */

  const modules: ObjectifiedModule[] = useMemo(
    () => filterAndModifyByLanguage(modulesData.study_modules, language),
    [modulesData.study_modules, language],
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
        // loading={coursesLoading}
      />
      <ModuleNavi modules={modules} loading={modulesLoading} />
      <CourseHighlights
        courses={activeCourses}
        title={t("allCoursesTitle")}
        headerImage={highlightsBanner}
        backgroundColor="#ffffff"
        hueRotateAngle={34}
        brightness={1}
        fontColor="white"
        titleBackground="#008EBD"
        // loading={coursesLoading}
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
        // loading={coursesLoading}
      />
      <ModuleList modules={modules} loading={modulesLoading} />
      <CourseHighlights
        courses={endedCourses}
        title={t("endedCoursesTitle")}
        headerImage={highlightsBanner}
        backgroundColor="#ffffff"
        hueRotateAngle={58}
        brightness={1}
        fontColor="white"
        titleBackground="#3066C0"
        // loading={coursesLoading}
      />
    </section>
  )
}

export default React.memo(CourseAndModuleList)
