import * as Yup from "yup"
import {
  StudyModuleFormValues,
  StudyModuleTranslationFormValues,
} from "./types"
import { ApolloClient } from "apollo-boost"

export const initialTranslation: StudyModuleTranslationFormValues = {
  id: undefined,
  language: "",
  name: "",
  description: "",
}

export const initialValues: StudyModuleFormValues = {
  id: null,
  slug: "",
  new_slug: "",
  name: "",
  image: "",
  study_module_translations: [initialTranslation],
}

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

const studyModuleEditSchema = ({
  client,
  checkSlug,
  initialSlug,
}: {
  client: ApolloClient<object>
  checkSlug: Function
  initialSlug: string | null
}) =>
  Yup.object().shape({
    new_slug: Yup.string()
      .required("required")
      .trim()
      .matches(/^[^\/\\\s]*$/, "can't include spaces or slashes")
      .test(
        "unique",
        `slug is already in use`,
        validateSlug({ client, checkSlug, initialSlug }),
      ),
    name: Yup.string().required("required"),
    study_module_translations: Yup.array().of(
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
                values: { study_module_translations },
              } = context

              if (!value || value === "") {
                return true // previous should have caught the empty
              }

              const currentIndexMatch =
                (path || "").match(/^.*\[(\d+)\].*$/) || []
              const currentIndex =
                currentIndexMatch.length > 1 ? Number(currentIndexMatch[1]) : -1
              const otherTranslationLanguages = study_module_translations
                .filter(
                  (c: StudyModuleTranslationFormValues, index: number) =>
                    c.language !== "" && index !== currentIndex,
                )
                .map((c: StudyModuleTranslationFormValues) => c.language)

              return otherTranslationLanguages.indexOf(value) === -1
            },
          ),
        description: Yup.string().required("required"),
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

      const existing = data.study_module_exists

      return !existing
    } catch (e) {
      return true
    }
  }

export default studyModuleEditSchema
