import React from "react"
import { Button, InputLabel, MenuItem } from "@material-ui/core"
import { Field, FieldArray, getIn, FormikErrors } from "formik"
import { Select, TextField } from "formik-material-ui"
import { updateCourseTranslationVariables } from "./__generated__/updateCourseTranslation"

export interface CourseTranslationFormValues {
  id?: string | undefined
  language: string | undefined
  name: string | undefined
  description: string | null | undefined
  link: string | undefined
  course?: string | undefined
}

const languages = [
  {
    value: "en",
    label: "English",
  },
  {
    value: "fi",
    label: "Finnish",
  },
]

const initialTranslation: CourseTranslationFormValues = {
  id: undefined,
  language: "",
  name: "",
  description: undefined,
  link: undefined,
}

const languageFilter = (
  index: number,
  course_translations: CourseTranslationFormValues[],
) =>
  languages.filter(
    l =>
      !course_translations
        .filter((_, idx) => idx !== index)
        .map((c: any) => c.language)
        .includes(l.value),
  )

const CourseTranslationEditForm = ({
  values,
  errors,
}: {
  values: CourseTranslationFormValues[]
  errors:
    | (FormikErrors<CourseTranslationFormValues> | undefined)[]
    | undefined
}) => (
  <FieldArray
    name="course_translations"
    render={helpers => (
      <>
        {values && values.length > 0 ? (
          values.map((_: any, index: number) => (
            <React.Fragment key={`translation-${index}`}>
              <InputLabel>Language</InputLabel>
              <Field
                name={`course_translations[${index}].language`}
                type="select"
                label="Language"
                errors={getIn(errors, `[${index}].language`)}
                fullWidth
                component={Select}
              >
                {languages.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
              <Field
                name={`course_translations[${index}].name`}
                type="text"
                label="Name"
                errors={getIn(errors, `[${index}].name`)}
                fullWidth
                component={TextField}
              />
              <Field
                name={`course_translations[${index}].description`}
                type="textarea"
                label="Description"
                errors={getIn(errors, `[${index}].description`)}
                fullWidth
                multiline
                component={TextField}
              />
              <Field
                name={`course_translations[${index}].link`}
                type="text"
                label="Link"
                errors={getIn(errors, `[${index}].link`)}
                fullWidth
                component={TextField}
              />
              {/* TODO here: don't actually remove in case of misclicks */}
              {index === values.length - 1 &&
              index < languages.length - 1 &&
              languageFilter(index + 1, values).length > 0 ? (
                <Button
                  variant="contained"
                  onClick={() => helpers.push({ ...initialTranslation })}
                >
                  +
                </Button>
              ) : null}
              <Button variant="contained" onClick={() => helpers.remove(index)}>
                -
              </Button>
            </React.Fragment>
          ))
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => helpers.push({})}
          >
            Add translations
          </Button>
        )}
      </>
    )}
  />
)

export default CourseTranslationEditForm
