import React, { useState } from "react"
import { mockModules } from "../mockModuleData"
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

const objectifyTranslations = modules => {
  return modules.map(({ study_module_translations, courses, ...module }) => {
    let module_translations = {}
    study_module_translations.forEach(translation => {
      module_translations = {
        [translation.language]: translation,
        ...module_translations,
      }
    })
    const mutilatedCourses = courses.map(
      ({ course_translations, ...course }) => {
        let translations = {}
        course_translations.forEach(translation => {
          translations = {
            [translation.language]: translation,
            ...translations,
          }
        })
        return {
          course_translations: translations,
          ...course,
        }
      },
    )
    return {
      study_module_translations: module_translations,
      courses: mutilatedCourses,
      ...module,
    }
  })
}

const MockModules = () => {
  const [modules, setModules] = useState(mockModules.study_modules)
  const [language, setLanguage] = useState("fi")

  const mutilatedModules = objectifyTranslations(modules)

  if (modules) {
    return (
      <div>
        {mutilatedModules.map(module => (
          <div key={module.id}>
            <div>{module.study_module_translations[language].name}</div>
            <div>
              {"____" + module.study_module_translations[language].description}
            </div>
            {module.courses.map(course => (
              <div key={course.id}>
                {"________" + course.course_translations[language].name}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
  return <div>loading</div>
}

export default MockModules
