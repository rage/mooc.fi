import * as Yup from "yup"
import {
  StudyModuleFormValues,
  StudyModuleTranslationFormValues,
} from "./types"

export const initialTranslation: StudyModuleTranslationFormValues = {
  id: undefined,
  language: "",
  name: "",
  description: "",
}

export const initialValues: StudyModuleFormValues = {
  id: null,
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

const studyModuleEditSchema = Yup.object().shape({
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
})

export default studyModuleEditSchema
