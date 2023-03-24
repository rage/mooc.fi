import { DateTime } from "luxon"
import * as Yup from "yup"

import { ApolloClient } from "@apollo/client"

import {
  CourseAliasFormValues,
  CourseFormValues,
  CourseTranslationFormValues,
  CourseVariantFormValues,
  UserCourseSettingsVisibilityFormValues,
} from "./types"
import { FormValues } from "../types"
import { Translator } from "/translations"
import { Courses } from "/translations/courses"

import {
  CourseFromSlugDocument,
  CourseStatus,
  OpenUniversityRegistrationLinkCoreFieldsFragment,
} from "/graphql/generated"

export const initialTranslation: CourseTranslationFormValues = {
  id: undefined,
  language: "",
  name: "",
  description: "",
  link: "",
  open_university_course_link: {
    course_code: "",
    link: "",
  } as OpenUniversityRegistrationLinkCoreFieldsFragment,
}

export const initialVariant: CourseVariantFormValues = {
  id: undefined,
  slug: "",
  description: "",
}

export const initialAlias: CourseAliasFormValues = {
  id: undefined,
  course_code: "",
}

export const initialValues: CourseFormValues = {
  id: null,
  name: "",
  slug: "",
  new_slug: "",
  ects: "",
  teacher_in_charge_name: "",
  teacher_in_charge_email: "",
  support_email: "",
  start_date: "",
  end_date: "",
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
  automatic_completions: false,
  automatic_completions_eligible_for_ects: false,
  exercise_completions_needed: undefined,
  points_needed: undefined,
  tags: [],
}

export const initialVisibility: UserCourseSettingsVisibilityFormValues = {
  id: undefined,
  language: "",
  course: undefined,
}

export const statuses = (t: Translator<Courses>) => [
  {
    value: CourseStatus.Upcoming,
    label: t("courseUpcoming"),
  },
  {
    value: CourseStatus.Active,
    label: t("courseActive"),
  },
  {
    value: CourseStatus.Ended,
    label: t("courseEnded"),
  },
]

export const languages = (t: Translator<Courses>) => [
  {
    value: "fi_FI",
    label: t("courseFinnish"),
  },
  {
    value: "en_US",
    label: t("courseEnglish"),
  },
  {
    value: "sv_SE",
    label: t("courseSwedish"),
  },
]

export const study_modules: { value: any; label: any }[] = []

const testUnique = <T extends FormValues>(
  valueField: keyof CourseFormValues,
  field: string,
) =>
  function (this: Yup.TestContext, value?: any): boolean {
    const { context, path }: { context?: any; path?: string | undefined } =
      this.options
    if (!context) {
      return true
    }

    const fieldValues = context.values[valueField]

    if (!value) {
      return true // previous should have caught the empty
    }

    const currentIndexMatch = (path ?? "").match(/^.*\[(\d+)\].*$/) ?? []
    const currentIndex =
      currentIndexMatch.length > 1 ? Number(currentIndexMatch[1]) : -1
    const otherValues = fieldValues
      .filter(
        (c: T, index: number) =>
          // @ts-ignore: we don't know the fields before use
          c[field] !== "" && index !== currentIndex,
      )
      // @ts-ignore: ditto
      .map((c: T) => c[field])

    return otherValues.indexOf(value) === -1
  }

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
    OpenUniversityRegistrationLinkCoreFieldsFragment,
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
}: CourseEditSchemaArgs): CourseEditSchemaType =>
  Yup.object().shape({
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
      .oneOf(statuses(t).map((s) => s.value))
      .required(t("validationRequired")),
    course_translations: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(t("validationRequired")),
        language: Yup.string()
          .required(t("validationRequired"))
          .oneOf(
            languages(t).map((l) => l.value),
            t("validationValidLanguageCode"),
          )
          .test(
            "unique",
            t("validationOneTranslation"),
            testUnique<CourseTranslationFormValues>(
              "course_translations",
              "language",
            ),
          ),
        description: Yup.string().required(t("validationRequired")),
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
            testUnique<CourseVariantFormValues>("course_variants", "slug"),
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
            testUnique<CourseAliasFormValues>("course_aliases", "course_code"),
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
        function (this: Yup.TestContext<any>, value?: DateTime | null) {
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
