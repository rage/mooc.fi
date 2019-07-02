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

const Home = ({ t, tReady }) => {
  const { loading, error, data } = useQuery<AllModulesData>(AllModulesQuery)
  const [language, setLanguage] = useState(NextI18Next.config.defaultLanguage)
  useEffect(() => {
    setLanguage(NextI18Next.i18n.language)
  }, [NextI18Next.i18n.language])
  const courses = filterAndModifyCoursesByLanguage(Courses.allcourses, language)

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  if (loading || !tReady) {
    return <div>Loading</div>
  }

  return (
    <div>
      <ExplanationHero />
      <NaviCardList />
      <CourseHighlights
        courses={courses.filter(c => c.promote === true)}
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
