/* eslint-disable complexity */
import { getIn } from "formik"
import { DateTime } from "luxon"
import { omit } from "remeda"

import { initialValues } from "./form-validation"
import { CourseFormValues, CourseTranslationFormValues } from "./types"
import { filterNull } from "/util/filterNull"
import { isDefinedAndNotEmpty } from "/util/guards"

import {
  CourseCreateArg,
  CourseStatus,
  CourseUpsertArg,
  EditorCourseDetailedFieldsFragment,
  StudyModuleDetailedFieldsFragment,
} from "/graphql/generated"

const isProduction = process.env.NODE_ENV === "production"

interface ToCourseFormArgs {
  course?: EditorCourseDetailedFieldsFragment | null
  modules?: StudyModuleDetailedFieldsFragment[] | null
}

const statusMap: Record<string, CourseStatus> = {
  Upcoming: CourseStatus.Upcoming,
  Active: CourseStatus.Active,
  Ended: CourseStatus.Ended,
}

export const toCourseForm = ({
  course,
  modules,
}: ToCourseFormArgs): CourseFormValues => {
  if (!course) {
    return initialValues
  }

  const courseStudyModuleIds = (course?.study_modules ?? []).map(
    (studyModule) => studyModule.id,
  )

  const study_modules: Record<string, boolean> = {}

  for (const studyModule of modules ?? []) {
    study_modules[studyModule.id] = courseStudyModuleIds.includes(
      studyModule.id,
    )
  }

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
    language: course.language ?? undefined,
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
    course_translations: (course.course_translations ?? []).map(
      (course_translation) => ({
        ...omit(course_translation, [
          "__typename",
          "course_id",
          "created_at",
          "updated_at",
        ]),
        link: course_translation.link ?? "",
        open_university_course_link:
          course?.open_university_registration_links?.find(
            (link) => link.language === course_translation.language,
          ),
        instructions: course_translation.instructions ?? undefined,
      }),
    ),
    study_modules,
    course_variants:
      course?.course_variants?.map((course_variant) => ({
        ...omit(course_variant, ["__typename"]),
        slug: course_variant.slug ?? "",
        description: course_variant.description ?? undefined,
      })) ?? [],
    course_aliases:
      course?.course_aliases?.map((course_alias) => ({
        ...omit(course_alias, ["__typename"]),
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
        ...omit(visibility, ["__typename"]),
        language: visibility.language ?? undefined,
      })),
    upcoming_active_link: course?.upcoming_active_link ?? false,
    tier: course?.tier ?? undefined,
    automatic_completions: course?.automatic_completions ?? false,
    automatic_completions_eligible_for_ects:
      course?.automatic_completions_eligible_for_ects ?? false,
    exercise_completions_needed:
      course?.exercise_completions_needed ?? undefined,
    points_needed: course?.points_needed ?? undefined,
    tags:
      course?.tags?.map((tag) => ({
        ...omit(tag, ["__typename"]),
        hidden: tag.hidden ?? false,
        tag_translations: tag.tag_translations?.map((tagTranslation) => ({
          ...omit(tagTranslation, ["__typename"]),
          description: tagTranslation.description ?? undefined,
        })),
      })) ?? [],
  }
}

type FromCourseFormReturn<Values extends CourseFormValues> = Values extends {
  id: null | undefined
}
  ? CourseCreateArg
  : CourseUpsertArg

export function fromCourseForm<Values extends CourseFormValues>({
  values,
  initialValues,
}: {
  values: Values
  initialValues: CourseFormValues
}): FromCourseFormReturn<Values> {
  const newCourse = !values.id

  const course_translations =
    values?.course_translations?.map(
      (course_translation: CourseTranslationFormValues) => ({
        ...omit(course_translation, ["open_university_course_link"]),
        link: course_translation.link ?? "",
        id:
          !course_translation.id || course_translation.id === ""
            ? undefined
            : course_translation.id,
      }),
    ) ?? []

  const { course_variants = [], user_course_settings_visibilities = [] } =
    values

  const course_aliases = (values?.course_aliases ?? []).map(filterNull)

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
            course_translation.open_university_course_link.course_code?.trim(),
        }
      }

      return {
        ...omit(prevLink, ["__typename"]),
        link: course_translation.open_university_course_link.link?.trim(),
        course_code:
          course_translation.open_university_course_link.course_code.trim(),
      }
    })
    .filter(isDefinedAndNotEmpty)

  const study_modules = Object.keys(values.study_modules ?? {})
    .filter((key) => values?.study_modules?.[key])
    .map((id) => ({ id }))

  const tags = values?.tags?.map(
    (tag) => omit(tag, ["tag_translations"]) as Values["tags"][number],
  )

  const formValues = newCourse
    ? omit(values, [
        "id",
        "new_slug",
        "thumbnail",
        "import_photo",
        "delete_photo",
      ])
    : ({
        ...omit(values, ["id", "thumbnail", "import_photo"]),
        new_slug: values.new_slug.trim(),
      } as Omit<Values, "id" | "thumbnail" | "import_photo"> & {
        new_slug: string
      })

  const status = statusMap[values.status]

  const c: FromCourseFormReturn<Values> = {
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
    tags,
  }

  return c
}
