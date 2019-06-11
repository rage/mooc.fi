import React, { useState, useEffect } from "react"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import NextI18Next from "../i18n"

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
    let newModuleTranslations = {}
    study_module_translations.forEach(translation => {
      newModuleTranslations = {
        [translation.language]: translation,
        ...newModuleTranslations,
      }
    })
    const newCourses = courses.map(({ course_translations, ...course }) => {
      let newCourseTranslations = {}
      course_translations.forEach(translation => {
        newCourseTranslations = {
          [translation.language]: translation,
          ...newCourseTranslations,
        }
      })
      return {
        course_translations: newCourseTranslations,
        ...course,
      }
    })
    return {
      study_module_translations: newModuleTranslations,
      courses: newCourses,
      ...module,
    }
  })
}

const MockModules = () => {
  const { loading, error, data } = useQuery(AllModulesQuery)
  const [language, setLanguage] = useState("fi")

  useEffect(() => {
    setLanguage(NextI18Next.i18n.language)
  }, [NextI18Next.i18n.language])

  if (loading) {
    return <div>loading</div>
  } else if (data) {
    const modifiedModules = objectifyTranslations(data.study_modules)
    const filteredModules = modifiedModules
      .filter(mod => mod.study_module_translations[language])
      .map(({ courses, ...rest }) => {
        const filteredCourses = courses.filter(
          course => course.course_translations[language],
        )
        return {
          courses: filteredCourses,
          ...rest,
        }
      })
    console.log(filteredModules)
    return (
      <div>
        {filteredModules.map(module => (
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
}

export default MockModules
