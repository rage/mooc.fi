import {
  AllCourses_courses,
  AllCourses_courses_course_translations,
} from "/static/types/generated/AllCourses"
import {
  AllModules_study_modules,
  AllModules_study_modules_courses,
} from "/static/types/generated/AllModules"
import {
  ObjectifiedModule,
  ObjectifiedModuleTranslations,
  ObjectifiedModuleCourse,
  ObjectifiedCourse,
  ObjectifiedCourseTranslations,
} from "../static/types/moduleTypes"

const objectifyTranslations = (
  modules: AllModules_study_modules[] | null,
): ObjectifiedModule[] => {
  return (modules || []).map((module: AllModules_study_modules) => {
    const { study_module_translations, courses } = module

    const newModuleTranslations: ObjectifiedModuleTranslations = (
      study_module_translations || []
    ).reduce(
      (acc, translation) => ({
        ...acc,
        [translation.language]: translation,
      }),
      {},
    )

    const newCourses: ObjectifiedModuleCourse[] = (courses || []).map(
      course => ({
        ...course,
        course_translations: (course.course_translations || []).reduce(
          (acc, course_translation) => ({
            [course_translation.language]: course_translation,
            ...acc,
          }),
          {},
        ),
      }),
    )

    return {
      ...module,
      study_module_translations: newModuleTranslations,
      courses: newCourses,
    }
  })
}

const ObjectifyCourses = (
  courses: AllCourses_courses[],
): ObjectifiedCourse[] => {
  return (courses || []).map(course => {
    const { course_translations } = course
    const courseTranslations = (course_translations || []).reduce(
      (acc, translation: AllCourses_courses_course_translations) => ({
        ...acc,
        [translation.language]: translation,
      }),
      {},
    )

    return {
      ...course,
      course_translations: courseTranslations,
    }
  })
}

// I think this isn't used, so I any'ed it
/* const filterByLanguage = (
  modules: AllModules_study_modules[],
  language: string,
) => {
  const modifiedModules = objectifyTranslations(modules)

  return modifiedModules
    .filter((mod: any) => mod.study_module_translations[language])
    .map((module: any) => {
      const { courses } = module
      const filteredCourses = (courses || []).filter(
        (course: any) => (course.course_translations || {})[language],
      )
      return {
        ...module,
        courses: filteredCourses,
      }
    })
} */

export const filterAndModifyByLanguage = (
  modules: AllModules_study_modules[],
  language: string,
) => {
  const modifiedModules = objectifyTranslations(modules)

  return modifiedModules
    .filter(
      mod =>
        (mod.study_module_translations as ObjectifiedModuleTranslations)[
          language
        ],
    )
    .map(mod => {
      const { courses, study_module_translations } = mod

      const {
        name,
        description,
      } = (study_module_translations as ObjectifiedModuleTranslations)[language]

      const filteredCourses = (courses || [])
        .filter(
          course =>
            (course.course_translations as ObjectifiedCourseTranslations)[
              language
            ],
        )
        .map(course => {
          const { course_translations } = course
          const {
            name,
            description,
            link,
          } = (course_translations as ObjectifiedCourseTranslations)[language]
          return {
            ...course,
            name: name,
            description: description,
            link: link,
          }
        })
      return {
        ...mod,
        name: name,
        description: description,
        courses: filteredCourses,
      }
    })
}

export const filterAndModifyCoursesByLanguage = (
  courses: AllCourses_courses[],
  language: string,
): ObjectifiedCourse[] => {
  const modifiedCourses = ObjectifyCourses(courses)

  return modifiedCourses
    .filter(
      c => (c.course_translations as ObjectifiedCourseTranslations)[language],
    )
    .map(course => {
      const { course_translations } = course
      const {
        name,
        description,
        link,
      } = (course_translations as ObjectifiedCourseTranslations)[language]

      return {
        ...course,
        name: name,
        description: description,
        link: link,
      }
    })
}

export const getPromotedCourses = (modules: AllModules_study_modules[]) => {
  return (modules || []).reduce(
    (acc, mod) => {
      ;(mod.courses || []).forEach(course => {
        if (course.promote) {
          acc = acc.concat(course)
        }
      })
      return acc
    },
    [] as AllModules_study_modules_courses[],
  )
}

const nextLanguageToLocale: { [key: string]: string } = {
  fi: "fi_FI",
  se: "sv_SE",
  en: "en_US",
}

export const mapNextLanguageToLocaleCode = (language: string) =>
  nextLanguageToLocale[language] || "fi_FI"
