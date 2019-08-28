import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"
import { AllCourses_courses } from "/static/types/generated/AllCourses"

export const getPromotedCourses = (
  modules: AllModules_study_modules_with_courses[],
) => {
  return (modules || []).reduce(
    (acc, mod) => {
      ;(mod.courses || []).forEach(course => {
        if (course.promote) {
          acc = acc.concat(course)
        }
      })
      return acc
    },
    [] as AllCourses_courses[],
  )
}

const nextLanguageToLocale: { [key: string]: string } = {
  fi: "fi_FI",
  se: "sv_SE",
  en: "en_US",
}

export const mapNextLanguageToLocaleCode = (language: string) =>
  nextLanguageToLocale[language] || "fi_FI"
