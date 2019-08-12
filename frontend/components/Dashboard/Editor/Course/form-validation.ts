import * as Yup from "yup"
import { ApolloClient } from "apollo-client"
import { CourseStatus } from "../../../../static/types/globalTypes"
import { CourseFormValues, CourseTranslationFormValues } from "./types"

export const initialTranslation: CourseTranslationFormValues = {
  id: undefined,
  language: "",
  name: "",
  description: "",
  link: "",
  open_university_course_code: undefined,
}

export const initialValues: CourseFormValues = {
  id: null,
  name: "",
  slug: "",
  new_slug: "",
  thumbnail: undefined,
  photo: undefined,
  new_photo: undefined,
  base64: false,
  start_point: false,
  promote: false,
  hidden: false,
  status: CourseStatus.Upcoming,
  study_modules: {},
  course_translations: [initialTranslation],
  open_university_registration_links: [],
  order: undefined,
}

export const statuses = [
  {
    value: CourseStatus.Upcoming,
    label: "Upcoming",
  },
  {
    value: CourseStatus.Active,
    label: "Active",
  },
  {
    value: CourseStatus.Ended,
    label: "Ended",
  },
]

export const languages = [
  {
    value: "fi_FI",
    label: "Finnish",
  },
  {
    value: "en_US",
    label: "English",
  },
  {
    value: "sv_SE",
    label: "Swedish",
  },
]

export const study_modules: { value: any; label: any }[] = []

const courseEditSchema = ({
  client,
  checkSlug,
  initialSlug,
}: {
  client: ApolloClient<object>
  checkSlug: Function
  initialSlug: string | null
}) =>
  Yup.object().shape({
    name: Yup.string().required("required"),
    // TODO: prevent spaces in slug
    new_slug: Yup.string()
      .required("required")
      .test(
        "unique",
        `slug is already in use`,
        validateSlug({ client, checkSlug, initialSlug }),
      ),
    status: Yup.mixed()
      .oneOf(statuses.map(s => s.value))
      .required("required"),
    course_translations: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("required"),
        language: Yup.string()
          .required("required")
          .oneOf(languages.map(l => l.value), "must have a valid language code")
          .test(
            "unique",
            "cannot have more than one translation per language",
            function(this: Yup.TestContext, value?: any): boolean {
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
            },
          ),
        description: Yup.string(),
        link: Yup.string(),
      }),
    ),
    order: Yup.number()
      .transform(value => (isNaN(value) ? undefined : Number(value)))
      .integer("must be integer"),
  })

const validateSlug = ({
  checkSlug,
  client,
  initialSlug,
}: {
  checkSlug: Function
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
