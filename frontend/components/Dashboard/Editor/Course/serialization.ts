import { initialValues } from "./form-validation"
import { getIn } from "formik"
import { CourseFormValues, CourseTranslationFormValues } from "./types"
import { get, omit } from "lodash"
import {
  CourseDetails_course_photo,
  CourseDetails_course,
  CourseDetails_course_open_university_registration_links,
} from "/static/types/generated/CourseDetails"
import { CourseStatus } from "/static/types/generated/globalTypes"
import { StudyModules_study_modules } from "/static/types/StudyModules"
import {
  addCourse_addCourse_open_university_registration_links,
  addCourse_addCourse_study_modules,
  addCourse_addCourse_course_translations,
} from "/static/types/generated/addCourse"
import {
  updateCourse_updateCourse_open_university_registration_links,
  updateCourse_updateCourse_study_modules,
  updateCourse_updateCourse_course_translations,
} from "/static/types/generated/updateCourse"

const isProduction = process.env.NODE_ENV === "production"

export const toCourseForm = ({
  course,
  modules,
}: {
  course?: CourseDetails_course
  modules?: StudyModules_study_modules[]
}): CourseFormValues => {
  const courseStudyModules = course
    ? (course.study_modules || []).map(module => module.id)
    : []

  return course
    ? {
        ...omit(course, ["open_university_registration_links", "__typename"]),
        start_point: course.start_point || false,
        promote: course.promote || false,
        hidden: course.hidden || false,
        order: course.order || undefined,
        status: course.status || CourseStatus.Upcoming,
        course_translations: (course.course_translations || []).map(c => ({
          ...omit(c, "__typename"),
          link: c.link || "",
          open_university_course_code: get(
            (course.open_university_registration_links || []).find(
              (l: CourseDetails_course_open_university_registration_links) =>
                l.language === c.language,
            ),
            "course_code",
          ),
        })),
        study_modules: modules
          ? modules.reduce(
              (acc, module) => ({
                ...acc,
                [module.id]: courseStudyModules.includes(module.id),
              }),
              {},
            )
          : null,
        new_slug: course.slug,
        thumbnail: course.photo
          ? (course.photo as CourseDetails_course_photo).compressed
          : null,
      }
    : initialValues
}

export const fromCourseForm = ({
  values,
  initialValues,
}: {
  values: CourseFormValues
  initialValues: CourseFormValues
}) => {
  const newCourse = !values.id

  const course_translations = values.course_translations.length
    ? (values.course_translations.map((c: CourseTranslationFormValues) => ({
        ...omit(c, "open_university_course_code"),
        link: c.link || "",
        //open_university_course_code: undefined,
        id: !c.id || c.id === "" ? null : c.id,
      })) as (
        | Omit<addCourse_addCourse_course_translations, "__typename">
        | Omit<updateCourse_updateCourse_course_translations, "__typename">)[])
    : null

  const open_university_registration_links = values.course_translations.length
    ? (values.course_translations
        .map((c: CourseTranslationFormValues) => {
          if (
            !c.open_university_course_code ||
            c.open_university_course_code === ""
          ) {
            return
          }

          const prevLink = (
            initialValues.open_university_registration_links || []
          ).find(l => l.language === c.language)

          if (!prevLink) {
            return {
              language: c.language || "",
              id: undefined,
              link: null,
              course_code: c.open_university_course_code.trim(),
            }
          }

          return {
            ...prevLink,
            course_code: c.open_university_course_code.trim(),
          }
        })
        .filter(v => !!v) as (
        | Omit<
            addCourse_addCourse_open_university_registration_links,
            "__typename"
          >
        | Omit<
            updateCourse_updateCourse_open_university_registration_links,
            "__typename"
          >)[])
    : null

  const study_modules: (
    | Omit<addCourse_addCourse_study_modules, "__typename">
    | Omit<
        updateCourse_updateCourse_study_modules,
        "__typename"
      >)[] = Object.keys(values.study_modules || {})
    .filter(key => (values.study_modules || {})[key])
    .map(id => ({ id }))

  return {
    ...values,
    id: undefined,
    slug: !newCourse ? values.slug : values.new_slug.trim(),
    new_slug: values.new_slug.trim(),
    base64: !isProduction,
    photo: getIn(values, "photo.id"),
    // despite order being a number in the typings, it comes back as an empty string without TS yelling at you
    // @ts-ignore
    order: values.order === "" ? null : values.order,
    course_translations,
    open_university_registration_links,
    study_modules,
  }
}
