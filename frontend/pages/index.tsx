import React, { useEffect, useState } from "react"
import NextI18Next from "../i18n"
import ExplanationHero from "../components/Home/ExplanationHero"
import NaviCardList from "../components/Home/NaviCardList"
import CourseHighlights from "../components/Home/CourseHighlights"
import EmailSubscribe from "../components/Home/EmailSubscribe"
import { filterAndModifyCoursesByLanguage } from "../util/moduleFunctions"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import { AllModules as AllModulesData } from "./__generated__/AllModules"
import { Courses } from "../courseData"
import CircularProgress from "@material-ui/core/CircularProgress"
const highlightsBanner = require("../static/images/courseHighlightsBanner.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000")
const allCoursesBanner = require("../static/images/AllCoursesBanner.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000")
const oldCoursesBanner = require("../static/images/oldCoursesBanner.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000")

const AllModulesQuery = gql`
  query AllModules {
    study_modules {
      id
      courses {
        id
        slug
        photo
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
  console.log(courses)

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
        />

        <CourseHighlights
          courses={courses.filter(c => c.status === "Active")}
          title={t("allCoursesTitle")}
          headerImage={allCoursesBanner}
          subtitle={""}
        />
        <CourseHighlights
          courses={courses.filter(c => c.status === "Upcoming")}
          title={t("upcomingCoursesTitle")}
          headerImage={allCoursesBanner}
          subtitle={""}
        />
        <CourseHighlights
          courses={courses.filter(c => c.status === "Ended")}
          title={t("endedCoursesTitle")}
          headerImage={oldCoursesBanner}
          subtitle={""}
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
