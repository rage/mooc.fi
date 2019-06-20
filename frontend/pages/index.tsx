import React, { useEffect, useState } from "react"
import NextI18Next from "../i18n"
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
} from "../util/moduleFunctions"
import { ApolloClient, gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import { AllModules as AllModulesData } from "./__generated__/AllModules"

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

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  if (loading) {
    return <div> I am loading loading</div>
  }

  console.log("Index", data)
  return (
    <div>
      <ExplanationHero />
      <NaviCardList />
      <CourseHighlights
        courses={promotedCourses}
        title={t("highlightTitle")}
        headerImage={"../../static/images/courseHighlightsBanner.jpg"}
        subtitle={t("highlightSubtitle")}
      />
      <ModuleNavi modules={modules} />
      {modules.map(module => (
        <Modules key={module.id} module={module} />
      ))}
      <CourseHighlights
        courses={promotedCourses}
        title={t("allCoursesTitle")}
        headerImage={"../../static/images/AllCoursesBanner.jpeg"}
        subtitle={""}
      />
      <CourseHighlights
        courses={promotedCourses}
        title={t("upcomingCoursesTitle")}
        headerImage={"../../static/images/AllCoursesBanner.jpg"}
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

export default NextI18Next.withNamespaces(["home", "navi"])(Home)
