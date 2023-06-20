import { DateTime } from "luxon"
import * as Yup from "yup"

import { ApolloClient } from "@apollo/client"

import { testUnique } from "../Common"
import {
  CourseAliasFormValues,
  CourseFormValues,
  CourseTranslationFormValues,
  CourseVariantFormValues,
  UserCourseSettingsVisibilityFormValues,
} from "./types"
import { Translator } from "/translations"
import { Courses } from "/translations/courses"

import { CourseFromSlugDocument, CourseStatus } from "/graphql/generated"

export const initialTranslation: CourseTranslationFormValues = {
  _id: undefined,
  // @ts-expect-error: empty language is expected
  language: "",
  name: "",
  description: "",
  instructions: "",
  link: "",
  open_university_course_link: {
    _id: undefined,
    course_code: "",
    link: "",
  },
}

export const initialVariant: CourseVariantFormValues = {
  slug: "",
  description: "",
}

export const initialAlias: CourseAliasFormValues = {
  course_code: "",
}

export const initialValues: CourseFormValues = {
  name: "",
  slug: "",
  new_slug: "",
  ects: "",
  language: "",
  teacher_in_charge_name: "",
  teacher_in_charge_email: "",
  // @ts-expect-error: empty date is expected
  start_date: "",
  base64: false,
  start_point: false,
  promote: false,
  hidden: false,
  study_module_start_point: false,
  status: CourseStatus.Upcoming,
  study_modules: [],
  course_translations: [],
  open_university_registration_links: [],
  course_variants: [],
  course_aliases: [],
  delete_photo: false,
  has_certificate: false,
  user_course_settings_visibilities: [],
  upcoming_active_link: false,
  tags: [],
  sponsors: [],
  completions_handled_by: "",
  inherit_settings_from: "",
}

export const initialVisibility: UserCourseSettingsVisibilityFormValues = {
  language: "",
}

export const study_modules: { value: any; label: any }[] = []

interface CourseEditSchemaArgs {
  client: ApolloClient<object>
  initialSlug: string | null
  t: Translator<Courses>
}

const courseEditSchema = ({ client, initialSlug, t }: CourseEditSchemaArgs) => {
  return Yup.object({
    name: Yup.string().required(t("validationRequired")),
    teacher_in_charge_name: Yup.string().required(
      t("courseTeacherNameRequired"),
    ),
    teacher_in_charge_email: Yup.string()
      .email(t("courseEmailInvalid"))
      .required(t("courseTeacherEmailRequired")),
    support_email: Yup.string().email(t("courseEmailInvalid")),
    start_date: Yup.mixed<DateTime>()
      .typeError(t("courseStartDateRequired"))
      .required(t("courseStartDateRequired"))
      .transform((datetime?: string | DateTime) => {
        if (typeof datetime === "string") {
          return DateTime.fromISO(datetime)
        }
        return datetime
      })
      .test(
        "start_invalid_or_missing",
        t("invalidDate"),
        function (value?: DateTime | null) {
          if (!value) {
            return false
          }
          return value.isValid
        },
      )
      .test(
        "start_before_end",
        t("courseStartDateLaterThanEndDate"),
        function (this: Yup.TestContext, value?: DateTime | null) {
          const start = value
          const end = this.parent.end_date as DateTime | null

          return start && end ? start <= end : true
        },
      ),
    end_date: Yup.mixed<DateTime>()
      .test(
        "end_invalid",
        t("invalidDate"),
        function (value?: DateTime | null) {
          if (!value) {
            return true
          }
          return value.isValid
        },
      )
      .test(
        "start_before_end",
        t("courseStartDateLaterThanEndDate"),
        function (this: Yup.TestContext, value: DateTime | null | undefined) {
          const end = value
          const start = this.parent.start_date as DateTime | null

          return start && end ? start <= end : true
        },
      ),
    ects: Yup.string().matches(/(^\d+(-\d+)?$|^$)/, t("validationNumberRange")),
    status: Yup.mixed<CourseStatus>()
      .oneOf(Object.keys(CourseStatus) as CourseStatus[])
      .required(t("validationRequired")),
    course_translations: Yup.array().of(
      Yup.object({
        name: Yup.string().required(t("validationRequired")),
        language: Yup.string()
          .required(t("validationRequired"))
          .oneOf(["fi_FI", "en_US", "sv_SE"], t("validationValidLanguageCode"))
          .test(
            "unique",
            t("validationOneTranslation"),
            testUnique<CourseFormValues, CourseTranslationFormValues>(
              "course_translations",
              (value) => value.language,
            ),
          ),
        description: Yup.string().required(t("validationRequired")),
        instructions: Yup.string().optional(),
        open_university_course_link: Yup.object({
          course_code: Yup.string().defined().strict(true),
          link: Yup.string().url(t("validationValidUrl")).nullable().optional(),
        })
          .optional()
          .default(undefined),
      }),
    ),
    course_variants: Yup.array().of(
      Yup.object().shape({
        slug: Yup.string()
          .required(t("validationRequired"))
          .trim()
          .matches(/^[^/\\\s]*$/, t("validationNoSpacesSlashes"))
          .test(
            "unique",
            t("validationTwoVariants"),
            testUnique<CourseFormValues, CourseVariantFormValues>(
              "course_variants",
              (v) => v.slug,
            ),
          ),
        description: Yup.string(),
      }),
    ),
    course_aliases: Yup.array().of(
      Yup.object().shape({
        course_code: Yup.string()
          .required(t("validationRequired"))
          .trim()
          .matches(/^[^/\\\s]*$/, t("validationNoSpacesSlashes"))
          .test(
            "unique",
            t("validationTwoAliases"),
            testUnique<CourseFormValues, CourseAliasFormValues>(
              "course_aliases",
              (v) => v.course_code,
            ),
          ),
      }),
    ),
    new_slug: Yup.string()
      .required(t("validationRequired"))
      .trim()
      .matches(/^[^/\\\s]*$/, t("validationNoSpacesSlashes"))
      .test(
        "unique",
        t("validationSlugInUse"),
        validateSlug({ client, initialSlug }),
      ),
    order: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : Number(value)))
      .integer(t("validationInteger")),
    study_module_order: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : Number(value)))
      .integer(t("validationInteger")),
    user_course_settings_visibilities: Yup.array().of(
      Yup.object().shape({
        language: Yup.string().required(),
      }),
    ),
    exercise_completions_needed: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : Number(value)))
      .min(0),
    points_needed: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : Number(value)))
      .min(0),
  })
}

export type CourseEditSchemaType = Yup.InferType<
  ReturnType<typeof courseEditSchema>
>

interface ValidateSlugArgs {
  client: ApolloClient<object>
  initialSlug: string | null
}

const validateSlug = ({ client, initialSlug }: ValidateSlugArgs) =>
  async function (
    this: Yup.TestContext,
    value?: string | null,
  ): Promise<boolean> {
    if (!value) {
      return true // if it's empty, it's ok by this validation and required will catch it
    }

    if (value === initialSlug) {
      return true
    }

    try {
      const { data } = await client.query({
        query: CourseFromSlugDocument,
        variables: { slug: value },
      })

      return !data?.course?.id
    } catch (e) {
      return true
    }
  }

export default courseEditSchema
