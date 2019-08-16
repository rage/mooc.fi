import React, { useContext } from "react"
import ExplanationHero from "/components/Home/ExplanationHero"
import NaviCardList from "/components/Home/NaviCardList"
import CourseHighlights from "/components/Home/CourseHighlights"
import EmailSubscribe from "/components/Home/EmailSubscribe"
import {
  filterAndModifyCoursesByLanguage,
  mapNextLanguageToLocaleCode,
  filterAndModifyByLanguage,
} from "/util/moduleFunctions"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { AllModules as AllModulesData } from "/static/types/generated/AllModules"
import { AllCourses as AllCoursesData } from "/static/types/generated/AllCourses"
// import Spinner from "/components/Spinner"
import { ObjectifiedCourse, ObjectifiedModule } from "/static/types/moduleTypes"
import Spinner from "/components/Spinner"
import ModuleNavi from "/components/Home/ModuleNavi"
import Module from "/components/Home/Module"

/* const allCoursesBanner = require("../static/images/AllCoursesBanner.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000")
const oldCoursesBanner = require("../static/images/oldCoursesBanner.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000") */
const highlightsBanner = "/static/images/backgroundPattern.svg"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"

const AllModulesQuery = gql`
  query AllModules {
    study_modules(orderBy: order_ASC) {
      id
      slug
      name
      image
      order
      courses {
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

const Home = () => {
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

  const lngCtx = useContext(LanguageContext)
  const t = getHomeTranslator(lngCtx.language)

  //save the default language of NextI18Next instance to state

  const language = mapNextLanguageToLocaleCode(lngCtx.language)

  //every time the i18n language changes, update the state

  if (coursesError || modulesError) {
    ;<div>
      Error:{" "}
      <pre>{JSON.stringify(coursesError || modulesError, undefined, 2)}</pre>
    </div>
  }

  if (coursesLoading || modulesLoading) {
    return <Spinner />
  }

  if (!coursesData || !modulesData) {
    return <div>Error: no data?</div>
  }

  //use the language from state to filter shown courses to only those which have translations
  //on the current language
  const courses: ObjectifiedCourse[] = filterAndModifyCoursesByLanguage(
    coursesData.courses,
    language,
  )

  const modules: ObjectifiedModule[] = filterAndModifyByLanguage(
    modulesData.study_modules,
    language,
  )

  return (
    <div>
      <ExplanationHero />
      <NaviCardList />
      <section id="courses-and-modules">
        <CourseHighlights
          courses={courses.filter(
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
        />
        <ModuleNavi modules={modules} />
        <CourseHighlights
          courses={courses.filter(c => !c.hidden && c.status === "Active")}
          title={t("allCoursesTitle")}
          headerImage={highlightsBanner}
          backgroundColor="#ffffff"
          hueRotateAngle={34}
          brightness={1}
          fontColor="white"
          titleBackground="#008EBD"
        />
        <CourseHighlights
          courses={courses.filter(c => !c.hidden && c.status === "Upcoming")}
          title={t("upcomingCoursesTitle")}
          headerImage={highlightsBanner}
          backgroundColor="#007DC8"
          hueRotateAngle={0}
          brightness={5.5}
          fontColor="black"
          titleBackground="#ffffff"
        />
        {modules.map(module => (
          <section id={module.slug}>
            <Module key={`study-module-${module.id}`} module={module} />
          </section>
        ))}
        <CourseHighlights
          courses={courses.filter(c => !c.hidden && c.status === "Ended")}
          title={t("endedCoursesTitle")}
          headerImage={highlightsBanner}
          backgroundColor="#ffffff"
          hueRotateAngle={58}
          brightness={1}
          fontColor="white"
          titleBackground="#3066C0"
        />
      </section>
      <EmailSubscribe />
    </div>
  )
}

export default Home

/*<ModuleNavi modules={modules} />
      {modules.map(module => (
        <Modules key={module.id} module={module} />
      ))}*/
