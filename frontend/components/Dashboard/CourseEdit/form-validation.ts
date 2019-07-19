import * as Yup from "yup"
import { ApolloClient } from "apollo-client"
import { CourseStatus } from "../../../__generated__/globalTypes"
import { CourseFormValues } from "./types"

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
  slug,
}: {
  client: ApolloClient<object>
  checkSlug: Function
  slug: string
}) =>
  Yup.object().shape({
    name: Yup.string().required("required"),
    new_slug: Yup.string()
      .required("required")
      .test(
        "unique",
        `slug is already in use`,
        validateSlug({ client, checkSlug, slug }),
      ),
    status: Yup.mixed()
      .oneOf(statuses.map(s => s.value))
      .required("required"),
    course_translations: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("required"),
        language: Yup.string().required("required"),
        /* TODO: checking that there's no more than one translation per lanaguage per course needs custom validation */
        /*       mixed()
        .oneOf(languages.map(l => l.value))
        .required("required"), */
        description: Yup.string(),
        link: Yup.string()
          .url("must be a valid URL")
          .required("required"),
      }),
    ),
  })

const validateSlug = ({
  slug,
  checkSlug,
  client,
}: {
  slug: string
  checkSlug: Function
  client: any
}) => async (value: string) => {
  let res

  try {
    res = await client.query({
      query: checkSlug,
      variables: { slug: value },
    })
  } catch (e) {
    return true
  }

  const { data } = res
  const existing = data.course_exists

  return existing ? value === slug : !existing
}

export default courseEditSchema
