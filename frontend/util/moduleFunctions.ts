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

const ObjectifyCourses = courses => {
  return courses.map(({ course_translations, ...course }) => {
    let courseTranslations = {}
    course_translations.forEach(translation => {
      courseTranslations = {
        [translation.language]: translation,
        ...courseTranslations,
      }
    })
    return {
      course_translations: courseTranslations,
      ...course,
    }
  })
}

const filterByLanguage = (modules, language) => {
  const modifiedModules = objectifyTranslations(modules)
  return modifiedModules
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
}

export const filterAndModifyByLanguage = (modules, language) => {
  const modifiedModules = objectifyTranslations(modules)
  return modifiedModules
    .filter(mod => mod.study_module_translations[language])
    .map(({ courses, study_module_translations, ...rest }) => {
      const { name, description } = study_module_translations[language]

      const filteredCourses = courses
        .filter(course => course.course_translations[language])
        .map(({ course_translations, ...course }) => {
          const { name, description, link } = course_translations[language]
          return {
            name: name,
            description: description,
            link: link,
            ...course,
          }
        })
      return {
        name: name,
        description: description,
        courses: filteredCourses,
        ...rest,
      }
    })
}

export const filterAndModifyCoursesByLanguage = (courses, language) => {
  const modifiedCourses = ObjectifyCourses(courses)
  return modifiedCourses
    .filter(c => c.course_translations[language])
    .map(({ course_translations, ...rest }) => {
      const { name, description, link } = course_translations[language]
      return {
        name: name,
        description: description,
        link: link,
        ...rest,
      }
    })
}

export const getPromotedCourses = modules => {
  return modules.reduce((acc, mod) => {
    mod.courses.forEach(course => {
      if (course.promote) {
        acc = acc.concat(course)
      }
    })
    return acc
  }, [])
}
