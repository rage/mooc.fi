import { omit } from "lodash"
import { DateTime } from "luxon"

import { initialValues } from "./form-validation"
import { CourseFormValues, CourseTranslationFormValues } from "./types"
import notEmpty from "/util/notEmpty"

import {
  CourseCreateArg,
  CourseStatus,
  CourseUpsertArg,
  EditorCourseDetailedFieldsFragment,
  StudyModuleDetailedFieldsFragment,
} from "/graphql/generated"

const isProduction = process.env.NODE_ENV === "production"

interface ToCourseFormArgs {
  course?: EditorCourseDetailedFieldsFragment
  modules?: StudyModuleDetailedFieldsFragment[]
}

export const toCourseForm = ({
  course,
  modules,
}: ToCourseFormArgs): CourseFormValues => {
  if (!course) {
    return initialValues
  }

  const courseStudyModules =
    course?.study_modules?.map((module) => module.id) ?? []

  return {
    ...omit(course, [
      "__typename",
      "description",
      "link",
      "instructions",
      "created_at",
      "updated_at",
    ]),
    slug: course?.slug ?? "",
    name: course.name ?? "",
    teacher_in_charge_name: course.teacher_in_charge_name ?? "",
    teacher_in_charge_email: course.teacher_in_charge_email ?? "",
    support_email: course.support_email ?? "",
    start_date: course.start_date ? DateTime.fromISO(course.start_date) : "",
    end_date: course.end_date ? DateTime.fromISO(course.end_date) : "",
    start_point: course.start_point ?? false,
    promote: course.promote ?? false,
    hidden: course.hidden ?? false,
    study_module_start_point: course.study_module_start_point ?? false,
    order: course.order ?? undefined,
    study_module_order: course.study_module_order ?? undefined,
    status: course.status ?? CourseStatus.Upcoming,
    course_translations: (course.course_translations || []).map(
      (course_translation) => {
        const open_university_course_link =
          course?.open_university_registration_links?.find(
            (link) => link.language === course_translation.language,
          )

        return {
          ...omit(course_translation, [
            "__typename",
            "id",
            "course_id",
            "created_at",
            "updated_at",
          ]),
          _id: course_translation.id ?? undefined,
          link: course_translation.link ?? "",
          open_university_course_link: {
            _id: open_university_course_link?.id ?? undefined,
            language: open_university_course_link?.language ?? undefined,
            link: open_university_course_link?.link ?? "",
            course_code: open_university_course_link?.course_code ?? "",
          },
          instructions: course_translation.instructions ?? undefined,
        }
      },
    ),
    study_modules: modules?.reduce(
      (acc, module) => ({
        ...acc,
        [module.id]: courseStudyModules.includes(module.id),
      }),
      {},
    ),
    course_variants:
      course?.course_variants?.map((course_variant) => ({
        ...omit(course_variant, [
          "__typename",
          "id",
          "created_at",
          "updated_at",
        ]),
        _id: course_variant.id ?? undefined,
        slug: course_variant.slug ?? undefined,
        description: course_variant.description ?? undefined,
      })) ?? [],
    course_aliases:
      course?.course_aliases?.map((course_alias) => ({
        ...omit(course_alias, ["__typename", "id", "created_at", "updated_at"]),
        _id: course_alias.id ?? undefined,
        course_code: course_alias.course_code ?? undefined,
      })) ?? [],
    new_slug: course.slug,
    thumbnail: course?.photo?.compressed,
    ects: course.ects ?? undefined,
    import_photo: "",
    inherit_settings_from: course.inherit_settings_from?.id,
    completions_handled_by: course.completions_handled_by?.id,
    has_certificate: course?.has_certificate ?? false,
    user_course_settings_visibilities:
      course?.user_course_settings_visibilities?.map((visibility) => ({
        ...omit(visibility, ["__typename", "id", "created_at", "updated_at"]),
        _id: visibility.id ?? undefined,
        language: visibility.language ?? undefined,
      })) ?? [],
    upcoming_active_link: course?.upcoming_active_link ?? false,
    tier: course?.tier ?? undefined,
    automatic_completions: course?.automatic_completions ?? false,
    automatic_completions_eligible_for_ects:
      course?.automatic_completions_eligible_for_ects ?? false,
    exercise_completions_needed:
      course?.exercise_completions_needed ?? undefined,
    points_needed: course?.points_needed ?? undefined,
    // TODO: fix
    new_photo: null, // course?.photo ?? null,
    photo: course?.photo ?? "",
    open_university_registration_links:
      course?.open_university_registration_links?.map((link) => ({
        ...omit(link, ["__typename", "id", "created_at", "updated_at"]),
        _id: link.id ?? undefined,
        course_code: link.course_code ?? undefined,
      })) ?? [],
  }
}

interface FromCourseFormArgs {
  values: CourseFormValues
  initialValues: CourseFormValues
}

export const fromCourseForm = ({
  values,
  initialValues,
}: FromCourseFormArgs): CourseCreateArg | CourseUpsertArg => {
  const newCourse = !values.id

  console.log(values)
  const course_translations =
    values?.course_translations?.map(
      (course_translation: CourseTranslationFormValues) => ({
        ...omit(course_translation, ["open_university_course_link", "_id"]),
        link: course_translation.link || "",
        description: course_translation.description || "",
        id:
          !course_translation._id || course_translation._id === ""
            ? undefined
            : course_translation._id,
      }),
    ) ?? []

  const course_variants = (values?.course_variants ?? []).map(
    (course_variant) => ({
      ...omit(course_variant, ["__typename", "_id"]),
      id:
        !course_variant._id || course_variant._id === ""
          ? undefined
          : course_variant._id,
    }),
  )

  const course_aliases = (values?.course_aliases ?? []).map((course_alias) => ({
    ...omit(course_alias, ["__typename", "_id"]),
    id: course_alias._id ?? undefined,
    course_code: course_alias.course_code ?? undefined,
  }))

  const user_course_settings_visibilities = (
    values?.user_course_settings_visibilities ?? []
  ).map((visibility) => ({
    ...omit(visibility, ["__typename", "_id"]),
    id: !visibility._id || visibility._id === "" ? undefined : visibility._id,
  }))

  const open_university_registration_links = values?.course_translations
    ?.map((course_translation: CourseTranslationFormValues) => {
      if (
        !course_translation.open_university_course_link ||
        (course_translation.open_university_course_link?.course_code === "" &&
          course_translation.open_university_course_link?.link === "")
      ) {
        return
      }

      const prevLink = initialValues?.open_university_registration_links?.find(
        (link) => link.language === course_translation.language,
      )

      if (!prevLink) {
        return {
          language: course_translation.language ?? "",
          id: undefined,
          link: course_translation.open_university_course_link.link?.trim(),
          course_code:
            course_translation.open_university_course_link.course_code?.trim() ??
            "",
        }
      }

      return {
        ...omit(prevLink, ["__typename", "_id"]),
        id: !prevLink._id || prevLink._id === "" ? undefined : prevLink._id,
        link: course_translation.open_university_course_link.link?.trim(),
        course_code:
          course_translation.open_university_course_link.course_code.trim() ??
          "",
      }
    })
    .filter(notEmpty)

  const study_modules = Object.keys(values.study_modules || {})
    .filter((key) => values?.study_modules?.[key])
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

  const status =
    values.status === "Active"
      ? CourseStatus.Active
      : values.status === "Ended"
      ? CourseStatus.Ended
      : values.status === "Upcoming"
      ? CourseStatus.Upcoming
      : undefined

  const c = {
    ...formValues,
    name: values.name ?? "",
    slug: !newCourse ? values.slug : values.new_slug.trim(),
    ects: values.ects?.trim() ?? undefined,
    base64: !isProduction,
    photo: typeof values?.photo === "string" ? values.photo : values?.photo?.id,
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
    user_course_settings_visibilities,
    teacher_in_charge_email: values.teacher_in_charge_email ?? "",
    teacher_in_charge_name: values.teacher_in_charge_name ?? "",
    status, //values.status as CourseStatus
    upcoming_active_link: values.upcoming_active_link ?? false,
    automatic_completions: values.automatic_completions ?? false,
    automatic_completions_eligible_for_ects:
      values.automatic_completions_eligible_for_ects ?? false,
    exercise_completions_needed:
      (values.exercise_completions_needed as unknown) === ""
        ? null
        : values.exercise_completions_needed,
    points_needed:
      (values.points_needed as unknown) == "" ? null : values.points_needed,
  }

  return newCourse ? (c as CourseCreateArg) : (c as CourseUpsertArg)
}
