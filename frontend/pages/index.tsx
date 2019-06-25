import React, { useEffect, useState } from "react"
import NextI18Next, { withTranslation } from "../i18n"
import ExplanationHero from "../components/Home/ExplanationHero"
import NaviCardList from "../components/Home/NaviCardList"
import CourseHighlights from "../components/Home/CourseHighlights"
import ModuleNavi from "../components/Home/ModuleNavi"
import Modules from "../components/Home/Modules"
import EmailSubscribe from "../components/Home/EmailSubscribe"
import { mockModules } from "../mockModuleData"
import {
  filterAndModifyByLanguage,
  getPromotedCourses,
  filterAndModifyCoursesByLanguage,
} from "../util/moduleFunctions"
import { ApolloClient, gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import { AllModules as AllModulesData } from "./__generated__/AllModules"
import { Courses } from "../courseData"

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

const Home = ({ t }) => {
  const { loading, error, data } = useQuery<AllModulesData>(AllModulesQuery)
  const [language, setLanguage] = useState(NextI18Next.config.defaultLanguage)
  useEffect(() => {
    setLanguage(NextI18Next.i18n.language)
  }, [NextI18Next.i18n.language])

  const modules = filterAndModifyByLanguage(mockModules.study_modules, language)
  const promotedCourses = getPromotedCourses(modules)
  const courses = filterAndModifyCoursesByLanguage(Courses.allcourses, language)

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <div>
      <ExplanationHero />
      <NaviCardList />
      <CourseHighlights
        courses={courses.filter(c => c.promote === true)}
        title={t("highlightTitle")}
        headerImage={`${require("../static/images/courseHighlightsBanner.jpg?webp")}`}
        subtitle={t("highlightSubtitle")}
      />

      <CourseHighlights
        courses={courses.filter(c => c.status === "Active")}
        title={t("allCoursesTitle")}
        headerImage={`${require("../static/images/AllCoursesBanner.jpg?webp")}`}
        subtitle={""}
      />
      <CourseHighlights
        courses={courses.filter(c => c.status === "Upcoming")}
        title={t("upcomingCoursesTitle")}
        headerImage={`${require("../static/images/AllCoursesBanner.jpg?webp")}`}
        subtitle={""}
      />
      <CourseHighlights
        courses={courses.filter(c => c.status === "Ended")}
        title={t("endedCoursesTitle")}
        headerImage={`${require("../static/images/oldCoursesBanner.jpg?webp")}`}
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
