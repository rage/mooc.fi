import * as Yup from "yup"
import { ApolloClient } from "apollo-client"
import { CourseStatus } from "../../../static/types/globalTypes"
import { CourseFormValues, CourseTranslationFormValues } from "./types"

export const initialValues: CourseFormValues = {
  id: null,
  name: "",
  slug: "",
  new_slug: "",
  thumbnail: undefined,
  photo: undefined,
  new_photo: undefined,
  start_point: false,
  promote: false,
  hidden: false,
  status: CourseStatus.Upcoming,
  study_module: null,
  course_translations: [],
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
    value: "en",
    label: "English",
  },
  {
    value: "fi",
    label: "Finnish",
  },
]

export const study_modules: { value: any; label: any }[] = []

const courseEditSchema = ({
  client,
  checkSlug,
}: {
  client: ApolloClient<object>
  checkSlug: Function
}) =>
  Yup.object().shape({
    name: Yup.string().required("required"),
    new_slug: Yup.string()
      .required("required")
      .test(
        "unique",
        `slug is already in use`,
        validateSlug({ client, checkSlug }),
      ),
    status: Yup.mixed()
      .oneOf(statuses.map(s => s.value))
      .required("required"),
    course_translations: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("required"),
        language: Yup.string()
          .required("required")
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

              const currentIndexMatch =
                (path || "").match(/^.*\[(\d+)\].*$/) || []
              const currentIndex =
                currentIndexMatch.length > 1 ? Number(currentIndexMatch[1]) : -1
              const otherTranslationLanguages = course_translations
                .filter(
                  (c: CourseTranslationFormValues, index: Number) =>
                    c.language !== "" && index !== currentIndex,
                )
                .map((c: CourseTranslationFormValues) => c.language)

              return otherTranslationLanguages.indexOf(value) === -1
            },
          ),
        description: Yup.string(),
        link: Yup.string()
          .url("must be a valid URL")
          .required("required"),
      }),
    ),
  })

const validateSlug = ({
  checkSlug,
  client,
}: {
  checkSlug: Function
  client: any
}) =>
  async function(this: Yup.TestContext, value: string): Promise<boolean> {
    let res

    const { slug } = this.parent

    try {
      res = await client.query({
        query: checkSlug,
        variables: { slug },
      })
    } catch (e) {
      return true
    }

    const { data } = res
    const existing = data.course_exists

    return existing ? value === slug : !existing
  }

export default courseEditSchema
