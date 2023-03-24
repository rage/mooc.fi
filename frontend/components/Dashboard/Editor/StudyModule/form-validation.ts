import * as Yup from "yup"

import { ApolloClient } from "@apollo/client"

import { testUnique } from "../Common"
import {
  StudyModuleFormValues,
  StudyModuleTranslationFormValues,
} from "./types"
import { Translator } from "/translations"
import { StudyModules } from "/translations/study-modules"

import { StudyModuleExistsDocument } from "/graphql/generated"

export const initialTranslation: StudyModuleTranslationFormValues = {
  _id: undefined,
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

export const languages = (t: Translator<StudyModules>) => [
  {
    value: "fi_FI",
    label: t("moduleFinnish"),
  },
  {
    value: "en_US",
    label: t("moduleEnglish"),
  },
  {
    value: "sv_SE",
    label: t("moduleSwedish"),
  },
]

function validateImage(this: Yup.TestContext, _value?: any): boolean {
  const { image } = this.parent

  if (image === "") return true

  try {
    require(`../../../../public/images/modules/${image}`)
  } catch (e) {
    return false
  }

  return true
}

interface StudyModuleEditSchemaArgs {
  client: ApolloClient<object>
  initialSlug: string | null
  t: Translator<StudyModules>
}

export type StudyModuleEditSchemaType = Yup.ObjectSchema<
  Pick<StudyModuleFormValues, "new_slug" | "image" | "name" | "order"> & {
    study_module_translations?: Array<
      Pick<
        StudyModuleTranslationFormValues,
        "name" | "language" | "description"
      >
    >
  }
>

const studyModuleEditSchema = ({
  client,
  initialSlug,
  t,
}: StudyModuleEditSchemaArgs): StudyModuleEditSchemaType =>
  Yup.object().shape({
    new_slug: Yup.string()
      .required(t("validationRequired"))
      .trim()
      .matches(/^[^\/\\\s]*$/, t("validationNoSpacesSlashes"))
      .test(
        "unique",
        t("validationSlugInUse"),
        validateSlug({ client, initialSlug }),
      ),
    image: Yup.string()
      .required()
      .test("exists", t("moduleImageError"), validateImage),
    name: Yup.string().required(t("validationRequired")),
    study_module_translations: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(t("validationRequired")),
        language: Yup.string()
          .matches(/^((?!_empty).*)/, t("validationRequired"))
          .required(t("validationRequired"))
          .oneOf(
            languages(t).map((l) => l.value),
            t("validationValidLanguageCode"),
          )
          .test(
            "unique",
            t("validationOneTranslation"),
            testUnique<StudyModuleFormValues, StudyModuleTranslationFormValues>(
              "study_module_translations",
              (v) => v.language,
            ),
          ),
        description: Yup.string().required(t("validationRequired")),
      }),
    ),
    order: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : Number(value)))
      .integer(t("validationInteger")),
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
    if (!value || value === "") {
      return true // if it's empty, it's ok by this validation and required will catch it
    }

    if (value === initialSlug) {
      return true
    }

    try {
      const { data } = await client.query({
        query: StudyModuleExistsDocument,
        variables: { slug: value },
      })

      const existing = data.study_module_exists

      return !existing
    } catch (e) {
      return true
    }
  }

export default studyModuleEditSchema
