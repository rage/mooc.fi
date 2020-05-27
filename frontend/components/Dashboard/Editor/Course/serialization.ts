import { initialValues } from "./form-validation"
import { getIn } from "formik"
import { CourseFormValues, CourseTranslationFormValues } from "./types"
import { omit } from "lodash"
import {
  CourseDetails_course_photo,
  CourseDetails_course,
  CourseDetails_course_open_university_registration_links,
} from "/static/types/generated/CourseDetails"
import { CourseStatus, CourseArg } from "/static/types/generated/globalTypes"
import {
  addCourse_addCourse_open_university_registration_links,
  addCourse_addCourse_study_modules,
  addCourse_addCourse_course_translations,
  addCourse_addCourse_course_variants,
  addCourse_addCourse_course_aliases,
} from "/static/types/generated/addCourse"
import {
  updateCourse_updateCourse_open_university_registration_links,
  updateCourse_updateCourse_study_modules,
  updateCourse_updateCourse_course_translations,
  updateCourse_updateCourse_course_variants,
  updateCourse_updateCourse_course_aliases,
} from "/static/types/generated/updateCourse"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"
import { DateTime } from "luxon"

const isProduction = process.env.NODE_ENV === "production"

export const toCourseForm = ({
  course,
  modules,
}: {
  course?: CourseDetails_course
  modules?: CourseEditorStudyModules_study_modules[]
}): CourseFormValues => {
  const courseStudyModules =
    course?.study_modules?.map((module) => module.id) ?? []

  return course
    ? {
        ...omit(course, ["__typename", "user_course_settings_visibility"]),
        teacher_in_charge_name: course.teacher_in_charge_name ?? "",
        teacher_in_charge_email: course.teacher_in_charge_email ?? "",
        support_email: course.support_email ?? "",
        start_date: course.start_date
          ? DateTime.fromISO(course.start_date)
          : "",
        end_date: course.end_date ? DateTime.fromISO(course.end_date) : "",
        start_point: course.start_point ?? false,
        promote: course.promote ?? false,
        hidden: course.hidden ?? false,
        study_module_start_point: course.study_module_start_point ?? false,
        order: course.order ?? undefined,
        study_module_order: course.study_module_order ?? undefined,
        status: course.status ?? CourseStatus.Upcoming,
        course_translations: (course.course_translations || []).map((c) => ({
          ...omit(c, "__typename"),
          link: c.link || "",
          open_university_course_link: course?.open_university_registration_links?.find(
            (l: CourseDetails_course_open_university_registration_links) =>
              l.language === c.language,
          ),
        })),
        study_modules: modules?.reduce(
          (acc, module) => ({
            ...acc,
            [module.id]: courseStudyModules.includes(module.id),
          }),
          {},
        ),
        course_variants:
          course?.course_variants?.map((c) => ({
            ...c,
            description: c.description || undefined,
          })) ?? [],
        course_aliases: course?.course_aliases ?? [],
        new_slug: course.slug,
        thumbnail: (course?.photo as CourseDetails_course_photo)?.compressed,
        ects: course.ects ?? undefined,
        import_photo: "",
        inherit_settings_from: course.inherit_settings_from?.id,
        completions_handled_by: course.completions_handled_by?.id,
        has_certificate: course?.has_certificate ?? false,
        user_course_settings_visibilities:
          course?.user_course_settings_visibilities ?? [],
      }
    : initialValues
}

export const fromCourseForm = ({
  values,
  initialValues,
}: {
  values: CourseFormValues
  initialValues: CourseFormValues
}): CourseArg => {
  const newCourse = !values.id

  const course_translations = (values?.course_translations?.map(
    (c: CourseTranslationFormValues) => ({
      ...omit(c, "open_university_course_link"),
      link: c.link || "",
      id: !c.id || c.id === "" ? null : c.id,
    }),
  ) ?? []) as (
    | Omit<addCourse_addCourse_course_translations, "__typename">
    | Omit<updateCourse_updateCourse_course_translations, "__typename">
  )[]

  const course_variants = (values?.course_variants ?? []).map((v) =>
    omit(v, ["__typename"]),
  ) as (
    | Omit<addCourse_addCourse_course_variants, "__typename">
    | Omit<updateCourse_updateCourse_course_variants, "__typename">
  )[]

  const course_aliases = (values?.course_aliases ?? []).map((a) =>
    omit(a, ["__typename"]),
  ) as (
    | Omit<addCourse_addCourse_course_aliases, "__typename">
    | Omit<updateCourse_updateCourse_course_aliases, "__typename">
  )[]

  const open_university_registration_links = values?.course_translations
    ?.map((c: CourseTranslationFormValues) => {
      if (
        !c.open_university_course_link ||
        (c.open_university_course_link?.course_code === "" &&
          c.open_university_course_link?.link === "")
      ) {
        return
      }

      const prevLink = initialValues?.open_university_registration_links?.find(
        (l) => l.language === c.language,
      )

      if (!prevLink) {
        return {
          language: c.language ?? "",
          id: undefined,
          link: c.open_university_course_link.link?.trim(),
          course_code: c.open_university_course_link.course_code?.trim(),
        }
      }

      return {
        ...omit(prevLink, ["__typename"]),
        link: c.open_university_course_link.link?.trim(),
        course_code: c.open_university_course_link.course_code.trim(),
      }
    })
    .filter((v) => !!v) as (
    | Omit<addCourse_addCourse_open_university_registration_links, "__typename">
    | Omit<
        updateCourse_updateCourse_open_university_registration_links,
        "__typename"
      >
  )[]

  const study_modules: (
    | Omit<addCourse_addCourse_study_modules, "__typename">
    | Omit<updateCourse_updateCourse_study_modules, "__typename">
  )[] = Object.keys(values.study_modules || {})
    .filter((key) => values?.study_modules?.[key]) // FIXME: (?) why is it like this
    .map((id) => ({ id }))

  const c: CourseArg = {
    ...omit(values, ["id", "thumbnail", "import_photo", "__typename"]),
    slug: !newCourse ? values.slug : values.new_slug.trim(),
    new_slug: values.new_slug.trim(),
    ects: values.ects?.trim() ?? undefined,
    base64: !isProduction,
    photo: getIn(values, "photo.id"),
    // despite orders being numbers in the field typings,
    // these come back as an empty string without TS yelling at you
    order: (values.order as unknown) === "" ? null : values.order,
    study_module_order:
      (values.study_module_order as unknown) === ""
        ? null
        : values.study_module_order,
    course_translations,
    open_university_registration_links,
    study_modules,
    course_variants,
    course_aliases,
    start_date:
      values.start_date instanceof DateTime
        ? values.start_date.toISO()
        : values.start_date,
    end_date:
      values.end_date instanceof DateTime
        ? values.end_date.toISO()
        : values.end_date,
    inherit_settings_from: values.inherit_settings_from,
    completions_handled_by: values.completions_handled_by,
    user_course_settings_visibilities:
      values.user_course_settings_visibilities ?? [],
  }

  return c
}
