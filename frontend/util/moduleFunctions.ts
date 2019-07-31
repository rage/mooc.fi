import { AllCourses_courses } from "../static/types/AllCourses"
import { AllCourses_courses_course_translations } from "../static/types/AllCourses"
import {
  AllModules_study_modules_courses,
  AllModules_study_modules_courses_course_translations,
} from "../static/types/AllModules"
import { AllModules_study_modules_study_module_translations } from "../static/types/AllModules"
import { AllModules_study_modules } from "../static/types/AllModules"

interface ObjectifiedModuleCourseTranslations {
  [key: string]: AllModules_study_modules_courses_course_translations
}

interface ObjectifiedCourseTranslations {
  [key: string]: AllCourses_courses_course_translations
}

interface ObjectifiedModuleCourse
  extends Omit<AllModules_study_modules_courses, "course_translations"> {
  course_translations:
    | ObjectifiedModuleCourseTranslations
    | AllModules_study_modules_courses_course_translations[]
    | null
}

interface ObjectifiedCourse
  extends Omit<AllCourses_courses, "course_translations"> {
  course_translations:
    | ObjectifiedCourseTranslations
    | AllCourses_courses_course_translations[]
    | null
}

interface ObjectifiedModuleTranslations {
  [key: string]: AllModules_study_modules_study_module_translations
}

interface ObjectifiedModule
  extends Omit<
    AllModules_study_modules,
    "study_module_translations" | "courses"
  > {
  study_module_translations:
    | ObjectifiedModuleTranslations
    | AllModules_study_modules_study_module_translations[]
    | null
  courses: ObjectifiedModuleCourse[] | null
}

type FilteredCourse = {
  name: string
  description: string
  id: string
  link: string
  photo: any
  promote: boolean
  slug: string
  start_point: boolean
  hidden: boolean
  status: string
}

const objectifyTranslations = (
  modules: AllModules_study_modules[] | null,
): ObjectifiedModule[] => {
  return (modules || []).map((module: AllModules_study_modules) => {
    const { study_module_translations, courses } = module

    const newModuleTranslations: ObjectifiedModuleTranslations = (
      study_module_translations || []
    ).reduce(
      (acc, translation) => ({
        [translation.language]: translation,
        ...acc,
      }),
      {},
    )

    const newCourses: ObjectifiedModuleCourse[] = (courses || []).map(
      course => ({
        course_translations: (course.course_translations || []).reduce(
          (acc, course_translation) => ({
            [course_translation.language]: course_translation,
            ...acc,
          }),
          {},
        ),
        ...course,
      }),
    )

    return {
      study_module_translations: newModuleTranslations,
      courses: newCourses,
      ...module,
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
        [translation.language]: translation,
        ...acc,
      }),
      {},
    )

    return {
      course_translations: courseTranslations,
      ...course,
    }
  })
}

// I think this isn't used, so I any'ed it
const filterByLanguage = (
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
        courses: filteredCourses,
        ...module,
      }
    })
}

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
      /*       ({ courses, study_module_translations, ...rest }) => { */
      const { courses, study_module_translations } = mod

      const {
        name,
        description,
      } = (study_module_translations as ObjectifiedModuleTranslations)[language]

      const filteredCourses = (courses || [])
        .filter(
          course =>
            (course.course_translations as ObjectifiedModuleCourseTranslations)[
              language
            ],
        )
        .map(course => {
          const { course_translations } = course
          const {
            name,
            description,
            link,
          } = (course_translations as ObjectifiedModuleCourseTranslations)[
            language
          ]
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
        ...mod,
      }
    })
}

export const filterAndModifyCoursesByLanguage = (
  courses: AllCourses_courses[],
  language: string,
) => {
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
        name: name,
        description: description,
        link: link,
        ...course,
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
