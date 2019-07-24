import React, { useEffect, useState } from "react"
import NextI18Next from "../i18n"
import ExplanationHero from "../components/Home/ExplanationHero"
import NaviCardList from "../components/Home/NaviCardList"
import CourseHighlights from "../components/Home/CourseHighlights"
import EmailSubscribe from "../components/Home/EmailSubscribe"
import {
  filterAndModifyCoursesByLanguage,
  filterAndModifyByLanguage,
} from "../util/moduleFunctions"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import { AllModules as AllModulesData } from "../static/types/AllModules"
import { Courses } from "../courseData"
import { mockModules } from "../mockModuleData"
import CircularProgress from "@material-ui/core/CircularProgress"
const highlightsBanner = "../static/images/backgroundPattern.svg"

const AllModulesQuery = gql`
  query AllModules {
    study_modules {
      id
      courses {
        id
        slug
        photo {
          id
          compressed
          uncompressed
        }
        promote
        status
        start_point
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

type FilteredCourse = {
  name: string
  description: string
  id: string
  link: string
  photo: any[]
  promote: boolean
  slug: string
  start_point: boolean
  status: string
}

interface HomeProps {
  t: Function
  tReady: boolean
}

const Home = (props: HomeProps) => {
  const { t, tReady } = props
  const { loading, error, data } = useQuery<AllModulesData>(AllModulesQuery)

  //save the default language of NextI18Next instance to state
  const [language, setLanguage] = useState(NextI18Next.config.defaultLanguage)
  //every time the i18n language changes, update the state
  useEffect(() => {
    setLanguage(NextI18Next.i18n.language)
  }, [NextI18Next.i18n.language])
  //use the language from state to filter shown courses to only those which have translations
  //on the current language
  const courses: [FilteredCourse] = filterAndModifyCoursesByLanguage(
    Courses.allcourses,
    language,
  )

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  if (loading || !tReady) {
    return <CircularProgress />
  }

  return (
    <div>
      <ExplanationHero />
      <NaviCardList />
      <section id="courses-and-modules">
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
        <CourseHighlights
          courses={courses.filter(c => c.status === "Upcoming")}
          title={t("upcomingCoursesTitle")}
          headerImage={highlightsBanner}
          backgroundColor="#007DC8"
          hueRotateAngle={0}
          brightness={5.5}
          fontColor="black"
          titleBackground="#ffffff"
        />
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
