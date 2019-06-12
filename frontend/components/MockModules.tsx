import React, { useState, useEffect } from "react"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import NextI18Next from "../i18n"
import {
  filterAndModifyByLanguage,
  getPromotedCourses,
} from "../util/moduleFunctions"

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

const MockModules = () => {
  const { loading, error, data } = useQuery(AllModulesQuery)
  const [language, setLanguage] = useState(NextI18Next.config.defaultLanguage)

  useEffect(() => {
    setLanguage(NextI18Next.i18n.language)
  }, [NextI18Next.i18n.language])

  if (loading) {
    return <div>loading</div>
  } else if (data) {
    const filteredModules = filterAndModifyByLanguage(
      data.study_modules,
      language,
    )
    const promotedCourses = getPromotedCourses(filteredModules)
    console.log(promotedCourses)
    console.log(filteredModules)
    return (
      <div>
        {filteredModules.map(mod => (
          <div key={mod.id}>
            <div>{mod.name}</div>
            <div>{"____" + mod.description}</div>
            {mod.courses.map(course => (
              <div key={course.id}>
                <div>{"________" + course.name}</div>
                <div>{"____________" + course.description}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
}

export default MockModules
