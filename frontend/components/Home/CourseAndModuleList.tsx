import React, { useState, useEffect, useContext } from "react"
import CourseHighlights from "./CourseHighlights"
import {
  filterAndModifyCoursesByLanguage,
  mapNextLanguageToLocaleCode,
  filterAndModifyByLanguage,
} from "/util/moduleFunctions"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { AllModules as AllModulesData } from "/static/types/generated/AllModules"
import { AllCourses as AllCoursesData } from "/static/types/generated/AllCourses"
import { ObjectifiedCourse, ObjectifiedModule } from "/static/types/moduleTypes"
import ModuleNavi from "./ModuleNavi"
import ModuleList from "./ModuleList"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"

const highlightsBanner = "/static/images/backgroundPattern.svg"

const AllModulesQuery = gql`
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

const AllCoursesQuery = gql`
  query AllCourses {
    courses(orderBy: order_ASC) {
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
      course_translations {
        id
        language
        name
        description
        link
      }
    }
  }
`

const CourseAndModuleList = () => {
  const lng = useContext(LanguageContext)
  const t = getHomeTranslator(lng.language)
  const {
    loading: coursesLoading,
    error: coursesError,
    data: coursesData,
  } = useQuery<AllCoursesData>(AllCoursesQuery)
  const {
    loading: modulesLoading,
    error: modulesError,
    data: modulesData,
  } = useQuery<AllModulesData>(AllModulesQuery)

  const [language, setLanguage] = useState(
    mapNextLanguageToLocaleCode(lng.language),
  )
  //every time the i18n language changes, update the state
  useEffect(() => {
    setLanguage(mapNextLanguageToLocaleCode(lng.language))
  }, [lng.language])

  if (coursesError || modulesError) {
    ;<div>
      Error:{" "}
      <pre>{JSON.stringify(coursesError || modulesError, undefined, 2)}</pre>
    </div>
  }

  if (!coursesData || !modulesData) {
    return <div>Error: no data?</div>
  }

  const courses: ObjectifiedCourse[] = filterAndModifyCoursesByLanguage(
    coursesData.courses,
    language,
  )

  const modules: ObjectifiedModule[] = filterAndModifyByLanguage(
    modulesData.study_modules,
    language,
  )

  return (
    <section id="courses-and-modules">
      <CourseHighlights
        courses={(courses || []).filter(
          c => !c.hidden && c.promote === true && c.status === "Active",
        )}
        title={t("highlightTitle")}
        headerImage={highlightsBanner}
        subtitle={t("highlightSubtitle")}
        backgroundColor="#009CA6"
        hueRotateAngle={177}
        brightness={5.5}
        fontColor="black"
        titleBackground="#ffffff"
        loading={coursesLoading}
      />
      <ModuleNavi modules={modules} loading={modulesLoading} />
      <CourseHighlights
        courses={(courses || []).filter(
          c => !c.hidden && c.status === "Active",
        )}
        title={t("allCoursesTitle")}
        headerImage={highlightsBanner}
        backgroundColor="#ffffff"
        hueRotateAngle={34}
        brightness={1}
        fontColor="white"
        titleBackground="#008EBD"
        loading={coursesLoading}
      />
      <CourseHighlights
        courses={(courses || []).filter(
          c => !c.hidden && c.status === "Upcoming",
        )}
        title={t("upcomingCoursesTitle")}
        headerImage={highlightsBanner}
        backgroundColor="#007DC8"
        hueRotateAngle={0}
        brightness={5.5}
        fontColor="black"
        titleBackground="#ffffff"
        loading={coursesLoading}
      />
      <ModuleList modules={modules} loading={modulesLoading} />
      <CourseHighlights
        courses={(courses || []).filter(c => !c.hidden && c.status === "Ended")}
        title={t("endedCoursesTitle")}
        headerImage={highlightsBanner}
        backgroundColor="#ffffff"
        hueRotateAngle={58}
        brightness={1}
        fontColor="white"
        titleBackground="#3066C0"
        loading={coursesLoading}
      />
    </section>
  )
}

CourseAndModuleList.getInitialProps = function() {
  return {}
}

export default CourseAndModuleList
