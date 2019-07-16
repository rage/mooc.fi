import React from "react"
import { Button, InputLabel, MenuItem } from "@material-ui/core"
import { Field, FieldArray, getIn, FormikErrors } from "formik"
import { Select, TextField, TextAreaField } from "formik-material-ui"
import { updateCourse_updateCourse_course_translations } from "./__generated__/updateCourse"

export interface CourseTranslationFormValues
  extends updateCourse_updateCourse_course_translations {
  /* 
  id?: string | undefined
  language: string | undefined,
  name: string | undefined,
  description: string | undefined,
  link: string | undefined
 */
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
  id: "",
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
  values: (CourseTranslationFormValues | undefined)[]
  errors: (FormikErrors<CourseTranslationFormValues | undefined>)[] | undefined
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
                errors={getIn(errors, `course_translations[${index}].language`)}
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
                errors={getIn(errors, `course_translations[${index}].name`)}
                fullWidth
                component={TextField}
              />
              <Field
                name={`course_translations[${index}].description`}
                type="textarea"
                label="Description"
                errors={getIn(
                  errors,
                  `course_translations[${index}].description`,
                )}
                fullWidth
                multiline
                component={TextField}
              />
              <Field
                name={`course_translations[${index}].link`}
                type="text"
                label="Link"
                errors={getIn(errors, `course_translations[${index}].link`)}
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
            Add a translation
          </Button>
        )}
      </>
    )}
  />
)

export default CourseTranslationEditForm
