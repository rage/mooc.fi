import React, { useEffect, useState } from "react"
import NextI18Next from "../i18n"
import ExplanationHero from "../components/Home/ExplanationHero"
import NaviCardList from "../components/Home/NaviCardList"
import CourseHighlights from "../components/Home/CourseHighlights"
import EmailSubscribe from "../components/Home/EmailSubscribe"
import {
  filterAndModifyCoursesByLanguage,
  mapNextLanguageToLocaleCode,
} from "../util/moduleFunctions"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import { AllCourses as AllCoursesData } from "../static/types/generated/AllCourses"
//import { mockModules } from "../mockModuleData"
import CircularProgress from "@material-ui/core/CircularProgress"
import { ObjectifiedCourse } from "../static/types/moduleTypes"
import ErrorBoundary from "../components/ErrorBoundary"
const highlightsBanner = "../static/images/backgroundPattern.svg"

const AllCoursesQuery = gql`
  query AllCourses {
    courses {
      id
      slug
      name
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
  // const { loading, error, data } = useQuery<AllModulesData>(AllModulesQuery)
  const { loading, error, data } = useQuery<AllCoursesData>(AllCoursesQuery)

  //save the default language of NextI18Next instance to state
  const [language, setLanguage] = useState(
    mapNextLanguageToLocaleCode(NextI18Next.config.defaultLanguage),
  )
  //every time the i18n language changes, update the state
  useEffect(() => {
    setLanguage(mapNextLanguageToLocaleCode(NextI18Next.i18n.language))
  }, [NextI18Next.i18n.language])
  //use the language from state to filter shown courses to only those which have translations
  //on the current language

  /*   const courses: [FilteredCourse] = filterAndModifyCoursesByLanguage(
    Courses.allcourses,
    language,
  ) */

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  if (loading || !tReady) {
    return <CircularProgress />
  }

  if (!data) {
    return <div>Error: no data?</div>
  }

  const courses: ObjectifiedCourse[] = filterAndModifyCoursesByLanguage(
    data.courses,
    language,
  )

  return (
    <div>
      <ErrorBoundary>
        <ExplanationHero />
      </ErrorBoundary>
      <ErrorBoundary>
        <NaviCardList />
      </ErrorBoundary>
      <section id="courses-and-modules">
        <ErrorBoundary>
          <CourseHighlights
            courses={courses.filter(
              c => c.promote === true && c.status === "Active",
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
        </ErrorBoundary>
        <ErrorBoundary>
          <CourseHighlights
            courses={courses.filter(c => c.status === "Active")}
            title={t("allCoursesTitle")}
            headerImage={highlightsBanner}
            backgroundColor="#ffffff"
            hueRotateAngle={34}
            brightness={1}
            fontColor="white"
            titleBackground="#008EBD"
          />
        </ErrorBoundary>
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
        <ErrorBoundary>
          <CourseHighlights
            courses={courses.filter(c => c.status === "Ended")}
            title={t("endedCoursesTitle")}
            headerImage={highlightsBanner}
            backgroundColor="#ffffff"
            hueRotateAngle={58}
            brightness={1}
            fontColor="white"
            titleBackground="#3066C0"
          />
        </ErrorBoundary>
      </section>
      <ErrorBoundary>
        <EmailSubscribe />
      </ErrorBoundary>
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
