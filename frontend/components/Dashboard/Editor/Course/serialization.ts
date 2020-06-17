import { initialValues } from "./form-validation"
import { getIn } from "formik"
import { CourseFormValues, CourseTranslationFormValues } from "./types"
import { omit } from "lodash"
import {
  CourseDetails_course_photo,
  CourseDetails_course,
  CourseDetails_course_open_university_registration_link,
} from "/static/types/generated/CourseDetails"
import {
  course_status,
  CourseCreateArg,
  CourseUpsertArg,
} from "/static/types/generated/globalTypes"
import {
  addCourse_addCourse_open_university_registration_link,
  addCourse_addCourse_study_module,
  addCourse_addCourse_course_translation,
  addCourse_addCourse_course_variant,
  addCourse_addCourse_course_alias,
  addCourse_addCourse_user_course_settings_visibility,
} from "/static/types/generated/addCourse"
import {
  updateCourse_updateCourse_open_university_registration_link,
  updateCourse_updateCourse_study_module,
  updateCourse_updateCourse_course_translation,
  updateCourse_updateCourse_course_variant,
  updateCourse_updateCourse_course_alias,
  updateCourse_updateCourse_user_course_settings_visibility,
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
    course?.study_module?.map((module) => module.id) ?? []

  return course
    ? {
        ...omit(course, ["__typename"]),
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
        status: course.status ?? course_status.Upcoming,
        course_translation: (course.course_translation || []).map((c) => ({
          ...omit(c, "__typename"),
          link: c.link || "",
          open_university_course_link: course?.open_university_registration_link?.find(
            (l: CourseDetails_course_open_university_registration_link) =>
              l.language === c.language,
          ),
        })),
        study_module: modules?.reduce(
          (acc, module) => ({
            ...acc,
            [module.id]: courseStudyModules.includes(module.id),
          }),
          {},
        ),
        course_variant:
          course?.course_variant?.map((c) => ({
            ...c,
            description: c.description || undefined,
          })) ?? [],
        course_alias: course?.course_alias ?? [],
        new_slug: course.slug,
        thumbnail: (course?.photo as CourseDetails_course_photo)?.compressed,
        ects: course.ects ?? undefined,
        import_photo: "",
        inherit_settings_from: course.inherit_settings_from?.id,
        completions_handled_by: course.completions_handled_by?.id,
        has_certificate: course?.has_certificate ?? false,
        user_course_settings_visibility:
          course?.user_course_settings_visibility || [],
      }
    : initialValues
}

export const fromCourseForm = ({
  values,
  initialValues,
}: {
  values: CourseFormValues
  initialValues: CourseFormValues
}): CourseCreateArg | CourseUpsertArg => {
  const newCourse = !values.id

  const course_translation =
    values?.course_translation?.map((c: CourseTranslationFormValues) => ({
      ...omit(c, "open_university_course_link"),
      link: c.link || "",
      id: !c.id || c.id === "" ? undefined : c.id,
    })) ??
    [] /* as (
    | Omit<addCourse_addCourse_course_translation, "__typename">
    | Omit<updateCourse_updateCourse_course_translation, "__typename">
  )[]*/

  const course_variant = (values?.course_variant ?? []).map((v) =>
    omit(v, ["__typename"]),
  ) /* as (
    | Omit<addCourse_addCourse_course_variant, "__typename">
    | Omit<updateCourse_updateCourse_course_variant, "__typename">
  )[]*/

  const course_alias = (values?.course_alias ?? []).map((a) => ({
    ...omit(a, ["__typename"]),
    course_code: a.course_code ?? undefined,
  })) /* as (
    | Omit<addCourse_addCourse_course_alias, "__typename">
    | Omit<updateCourse_updateCourse_course_alias, "__typename">
  )[]*/

  const user_course_settings_visibility = (
    values?.user_course_settings_visibility ?? []
  ).map((v) =>
    omit(v, ["__typename"]),
  ) /* as (
    | Omit<addCourse_addCourse_user_course_settings_visibility, "__typename">
    | Omit<
        updateCourse_updateCourse_user_course_settings_visibility,
        "__typename"
      >
  )[]*/

  const open_university_registration_link = values?.course_translation
    ?.map((c: CourseTranslationFormValues) => {
      if (
        !c.open_university_course_link ||
        (c.open_university_course_link?.course_code === "" &&
          c.open_university_course_link?.link === "")
      ) {
        return
      }

      const prevLink = initialValues?.open_university_registration_link?.find(
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
    .filter(
      (v) => !!v,
    ) /* as (
    | Omit<addCourse_addCourse_open_university_registration_link, "__typename">
    | Omit<
        updateCourse_updateCourse_open_university_registration_link,
        "__typename"
      >
  )[]*/

  const study_module /*: (
    | Omit<addCourse_addCourse_study_module, "__typename">
    | Omit<updateCourse_updateCourse_study_module, "__typename">
  )[] */ = Object.keys(
    values.study_module || {},
  )
    .filter((key) => values?.study_module?.[key]) // FIXME: (?) why is it like this
    .map((id) => ({ id }))

  const formValues = newCourse
    ? omit(values, [
        "id",
        "new_slug",
        "thumbnail",
        "import_photo",
        "delete_photo",
      ])
    : {
        ...omit(values, ["id", "thumbnail", "import_photo"]),
        new_slug: values.new_slug.trim(),
      }

  const c = {
    ...formValues,
    name: values.name ?? "",
    slug: !newCourse ? values.slug : values.new_slug.trim(),
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
    course_translation,
    open_university_registration_link,
    study_module,
    course_variant,
    course_alias,
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
    user_course_settings_visibility,
    teacher_in_charge_email: values.teacher_in_charge_email ?? "",
    teacher_in_charge_name: values.teacher_in_charge_name ?? "",
  }

  return c
}
