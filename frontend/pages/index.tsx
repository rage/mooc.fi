import React, { useEffect, useState } from "react"
import NextI18Next from "../i18n"
import ExplanationHero from "../components/Home/ExplanationHero"
import NaviCardList from "../components/Home/NaviCardList"
import CourseHighlights from "../components/Home/CourseHighlights"
import ModuleNavi from "../components/Home/ModuleNavi"
import Modules from "../components/Home/Modules"
import { mockModules } from "../mockModuleData"
import {
  filterAndModifyByLanguage,
  getPromotedCourses,
} from "../util/moduleFunctions"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"

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
  const { loading, error, data } = useQuery(AllModulesQuery)
  const [language, setLanguage] = useState(NextI18Next.config.defaultLanguage)

  useEffect(() => {
    setLanguage(NextI18Next.i18n.language)
  }, [NextI18Next.i18n.language])

  const modules = filterAndModifyByLanguage(mockModules.study_modules, language)
  const promotedCourses = getPromotedCourses(modules)

  console.log("index", modules)
  console.log("index", language)
  console.log("promoted Courses", promotedCourses)

  if (loading) {
    return <div>loading</div>
  } else if (data) {
    return (
      <div>
        <ExplanationHero />
        <NaviCardList />
        <CourseHighlights courses={promotedCourses} />
        <ModuleNavi modules={modules} />
        {modules.map(module => (
          <Modules key={module.id} module={module} />
        ))}
      </div>
    )
  }
}

Home.getInitialProps = function() {
  return {
    namespacesRequired: ["home", "navi"],
  }
}

export default NextI18Next.withNamespaces(["home", "navi"])(Home)
