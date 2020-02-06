import * as Yup from "yup"
import { ApolloClient } from "apollo-client"
import { CourseStatus } from "../../../../static/types/globalTypes"
import {
  CourseFormValues,
  CourseTranslationFormValues,
  CourseVariantFormValues,
} from "./types"
import { DocumentNode } from "apollo-boost"

export const initialTranslation: CourseTranslationFormValues = {
  id: undefined,
  language: "",
  name: "",
  description: "",
  link: "",
  open_university_course_code: "",
}

export const initialVariant: CourseVariantFormValues = {
  id: undefined,
  slug: "",
  description: "",
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
  course_translations: [initialTranslation],
  open_university_registration_links: [],
  order: undefined,
  study_module_order: undefined,
  course_variants: [],
}

export const statuses = (t: Function) => [
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

export const languages = (t: Function) => [
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

const courseEditSchema = ({
  client,
  checkSlug,
  initialSlug,
  t,
}: {
  client: ApolloClient<object>
  checkSlug: DocumentNode
  initialSlug: string | null
  t: (key: any) => string
}) =>
  Yup.object().shape({
    name: Yup.string().required(t("validationRequired")),
    new_slug: Yup.string()
      .required(t("validationRequired"))
      .trim()
      .matches(/^[^\/\\\s]*$/, t("validationNoSpacesSlashes"))
      .test(
        "unique",
        t("validationSlugInUse"),
        validateSlug({ client, checkSlug, initialSlug }),
      ),
    status: Yup.mixed()
      .oneOf(statuses(t).map(s => s.value))
      .required(t("validationRequired")),
    course_translations: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(t("validationRequired")),
        language: Yup.string()
          .required(t("validationRequired"))
          .oneOf(
            languages(t).map(l => l.value),
            t("validationValidLanguageCode"),
          )
          .test("unique", t("validationOneTranslation"), function(
            this: Yup.TestContext,
            value?: any,
          ): boolean {
            const {
              context,
              path,
            }: { context?: any; path?: string | undefined } = this.options
            if (!context) {
              return true
            }

            const {
              values: { course_translations },
            } = context

            if (!value || value === "") {
              return true // previous should have caught the empty
            }

            const currentIndexMatch =
              (path || "").match(/^.*\[(\d+)\].*$/) || []
            const currentIndex =
              currentIndexMatch.length > 1 ? Number(currentIndexMatch[1]) : -1
            const otherTranslationLanguages = course_translations
              .filter(
                (c: CourseTranslationFormValues, index: number) =>
                  c.language !== "" && index !== currentIndex,
              )
              .map((c: CourseTranslationFormValues) => c.language)

            return otherTranslationLanguages.indexOf(value) === -1
          }),
        description: Yup.string(),
        link: Yup.string(),
      }),
    ),
    course_variants: Yup.array().of(
      Yup.object().shape({
        slug: Yup.string()
          .required(t("validationRequired"))
          .trim()
          .matches(/^[^\/\\\s]*$/, t("validationNoSpacesSlashes"))
          .test("unique", t("validationTwoVariants"), function(
            this: Yup.TestContext,
            value?: any,
          ): boolean {
            const {
              context,
              path,
            }: { context?: any; path?: string } = this.options
            if (!context) {
              return true
            }

            const {
              values: { course_variants },
            } = context

            if (!value || value === "") {
              return true
            }

            const currentIndexMatch =
              (path || "").match(/^.*\[(\d+)\].*$/) || []
            const currentIndex =
              currentIndexMatch.length > 1 ? Number(currentIndexMatch[1]) : -1
            const otherSlugs = course_variants
              .filter(
                (c: CourseVariantFormValues, index: number) =>
                  c.slug !== "" && index !== currentIndex,
              )
              .map((c: CourseVariantFormValues) => c.slug)

            return otherSlugs.indexOf(value) === -1
          }),
        description: Yup.string(),
      }),
    ),
    order: Yup.number()
      .transform(value => (isNaN(value) ? undefined : Number(value)))
      .integer(t("validationInteger")),
    study_module_order: Yup.number()
      .transform(value => (isNaN(value) ? undefined : Number(value)))
      .integer(t("validationInteger")),
    ects: Yup.string().matches(
      /(^\d+(\-\d+)?$|^$)/,
      t("validationNumberRange"),
    ),
  })

const validateSlug = ({
  checkSlug,
  client,
  initialSlug,
}: {
  checkSlug: DocumentNode
  client: ApolloClient<object>
  initialSlug: string | null
}) =>
  async function(this: Yup.TestContext, value: string): Promise<boolean> {
    if (!value || value === "") {
      return true // if it's empty, it's ok by this validation and required will catch it
    }

    if (value === initialSlug) {
      return true
    }

    try {
      const { data } = await client.query({
        query: checkSlug,
        variables: { slug: value },
      })

      const existing = data.course_exists

      return !existing
    } catch (e) {
      return true
    }
  }

export default courseEditSchema
