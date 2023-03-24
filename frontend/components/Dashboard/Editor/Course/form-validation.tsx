import { DateTime } from "luxon"
import * as Yup from "yup"

import { ApolloClient } from "@apollo/client"

import {
  CourseAliasFormValues,
  CourseFormValues,
  CourseTranslationFormValues,
  CourseVariantFormValues,
  OpenUniversityRegistrationValues,
  UserCourseSettingsVisibilityFormValues,
} from "./types"
import { testUnique } from "../Common"
import { Translator } from "/translations"
import { Courses } from "/translations/courses"

import { CourseFromSlugDocument, CourseStatus } from "/graphql/generated"

export const initialTranslation: CourseTranslationFormValues = {
  _id: undefined,
  language: "",
  name: "",
  description: "",
  link: "",
  open_university_course_link: {
    _id: undefined,
    course_code: "",
    link: "",
  },
}

export const initialVariant: CourseVariantFormValues = {
  _id: undefined,
  slug: "",
  description: "",
}

export const initialAlias: CourseAliasFormValues = {
  _id: undefined,
  course_code: "",
}

export const initialValues: CourseFormValues = {
  id: undefined,
  name: "",
  slug: "",
  new_slug: "",
  ects: "",
  teacher_in_charge_name: "",
  teacher_in_charge_email: "",
  support_email: "",
  start_date: "",
  end_date: undefined,
  thumbnail: undefined,
  photo: undefined,
  new_photo: undefined,
  base64: false,
  start_point: false,
  promote: false,
  hidden: false,
  study_module_start_point: false,
  status: CourseStatus.Upcoming,
  study_modules: {},
  course_translations: [],
  open_university_registration_links: [],
  order: undefined,
  study_module_order: undefined,
  course_variants: [],
  course_aliases: [],
  delete_photo: false,
  has_certificate: false,
  user_course_settings_visibilities: [],
  upcoming_active_link: false,
  tier: undefined,
  automatic_completions: undefined,
  automatic_completions_eligible_for_ects: undefined,
  exercise_completions_needed: undefined,
  points_needed: undefined,
  tags: [],
}

export const initialVisibility: UserCourseSettingsVisibilityFormValues = {
  _id: undefined,
  language: "",
  course: undefined,
}

export const study_modules: { value: any; label: any }[] = []

interface CourseEditSchemaArgs {
  client: ApolloClient<object>
  initialSlug: string | null
  t: Translator<Courses>
}

type CourseTranslationsEditSchemaFields = Pick<
  CourseTranslationFormValues,
  "name" | "language" | "description" | "link"
> & {
  open_university_course_link?: Pick<
    OpenUniversityRegistrationValues,
    "course_code" | "link"
  >
}

type CourseAliasEditSchemaFields = Pick<CourseAliasFormValues, "course_code">

type CourseVariantEditSchemaFields = Pick<
  CourseVariantFormValues,
  "slug" | "description"
>

export type CourseEditSchemaType = Yup.ObjectSchema<
  Pick<
    CourseFormValues,
    | "name"
    | "new_slug"
    | "status"
    | "order"
    | "study_module_order"
    | "ects"
    | "start_date"
    | "teacher_in_charge_email"
    | "teacher_in_charge_name"
    | "support_email"
    | "points_needed"
    | "exercise_completions_needed"
  > & {
    course_translations?: Array<CourseTranslationsEditSchemaFields>
    course_aliases?: Array<CourseAliasEditSchemaFields>
    course_variants?: Array<CourseVariantEditSchemaFields>
  }
>

const courseEditSchema = ({
  client,
  initialSlug,
  t,
}: CourseEditSchemaArgs): CourseEditSchemaType => {
  return Yup.object().shape({
    name: Yup.string().required(t("validationRequired")),
    new_slug: Yup.string()
      .required(t("validationRequired"))
      .trim()
      .matches(/^[^\/\\\s]*$/, t("validationNoSpacesSlashes"))
      .test(
        "unique",
        t("validationSlugInUse"),
        validateSlug({ client, initialSlug }),
      ),
    status: Yup.mixed<CourseStatus>()
      .oneOf(Object.keys(CourseStatus) as CourseStatus[])
      .required(t("validationRequired")),
    course_translations: Yup.array().of(
      Yup.object().shape({
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
        description: Yup.string().required(),
        link: Yup.string(),
        open_university_course_link: Yup.object()
          .shape({
            course_code: Yup.string().defined().strict(true),
            link: Yup.string()
              .url(t("validationValidUrl"))
              .nullable()
              .default(null),
          })
          .default(undefined),
      }),
    ),
    course_variants: Yup.array().of(
      Yup.object().shape({
        slug: Yup.string()
          .required(t("validationRequired"))
          .trim()
          .matches(/^[^\/\\\s]*$/, t("validationNoSpacesSlashes"))
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
          .matches(/^[^\/\\\s]*$/, t("validationNoSpacesSlashes"))
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
    order: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : Number(value)))
      .integer(t("validationInteger")),
    study_module_order: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : Number(value)))
      .integer(t("validationInteger")),
    ects: Yup.string().matches(
      /(^\d+(\-\d+)?$|^$)/,
      t("validationNumberRange"),
    ),
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
        "start_before_end",
        t("courseStartDateLaterThanEndDate"),
        function (this: Yup.TestContext, value?: DateTime | null) {
          const start = value
          const end = this.parent.end_date as DateTime | null

          return start && end ? start <= end : true
        },
      ),
    teacher_in_charge_name: Yup.string().required(
      t("courseTeacherNameRequired"),
    ),
    teacher_in_charge_email: Yup.string()
      .email(t("courseEmailInvalid"))
      .required(t("courseTeacherEmailRequired")),
    support_email: Yup.string().email(t("courseEmailInvalid")),
    exercise_completions_needed: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : Number(value)))
      .min(0),
    points_needed: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : Number(value)))
      .min(0),
  })
}

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

      return !Boolean(data?.course?.id)
    } catch (e) {
      return true
    }
  }

export default courseEditSchema
