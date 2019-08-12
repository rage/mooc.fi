import React, { useEffect, useState } from "react"
import NextI18Next from "../i18n"
import ExplanationHero from "../components/Home/ExplanationHero"
import NaviCardList from "../components/Home/NaviCardList"
import CourseHighlights from "../components/Home/CourseHighlights"
import EmailSubscribe from "../components/Home/EmailSubscribe"
import {
  filterAndModifyCoursesByLanguage,
  mapNextLanguageToLocaleCode,
  filterAndModifyByLanguage,
} from "../util/moduleFunctions"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import { AllModules as AllModulesData } from "/static/types/generated/AllModules"
import { AllCourses as AllCoursesData } from "/static/types/generated/AllCourses"
import Spinner from "/components/Spinner"
import {
  ObjectifiedCourse,
  ObjectifiedModule,
} from "../static/types/moduleTypes"
import ModuleNavi from "/components/Home/ModuleNavi"
import Module from "/components/Home/Module"

/* const allCoursesBanner = require("../static/images/AllCoursesBanner.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000")
const oldCoursesBanner = require("../static/images/oldCoursesBanner.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000") */
const highlightsBanner = "../static/images/backgroundPattern.svg"

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

interface HomeProps {
  t: Function
  tReady: boolean
}

const Home = (props: HomeProps) => {
  const { t, tReady } = props
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

  //save the default language of NextI18Next instance to state
  const [language, setLanguage] = useState(
    mapNextLanguageToLocaleCode(NextI18Next.config.defaultLanguage),
  )
  //every time the i18n language changes, update the state
  useEffect(() => {
    setLanguage(mapNextLanguageToLocaleCode(NextI18Next.i18n.language))
  }, [NextI18Next.i18n.language])

  if (coursesError || modulesError) {
    ;<div>
      Error:{" "}
      <pre>{JSON.stringify(coursesError || modulesError, undefined, 2)}</pre>
    </div>
  }

  if (coursesLoading || modulesLoading || !tReady) {
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
        {modules.map(module => (
          <section id={module.slug}>
            <Module module={module} />
          </section>
        ))}
      </section>
      <EmailSubscribe />
    </div>
  )
}

Home.getInitialProps = function() {
  return {
    namespacesRequired: ["home", "navi"],
  }
}

export default NextI18Next.withTranslation("home")(Home)

/*<ModuleNavi modules={modules} />
      {modules.map(module => (
        <Modules key={module.id} module={module} />
      ))}*/
