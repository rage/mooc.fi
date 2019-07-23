import React, { useState } from "react"
import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Typography,
} from "@material-ui/core"
import { Field, FieldArray, getIn, FormikErrors } from "formik"
import { Select, TextField } from "formik-material-ui"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { CourseTranslationFormValues } from "./types"
import ConfirmationDialog from "../ConfirmationDialog"
import { languages } from "./form-validation"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    languageEntry: {
      padding: "20px",
      borderLeft: "2px solid #A0A0FF",
    },
  }),
)

const initialTranslation: CourseTranslationFormValues = {
  id: undefined,
  language: undefined,
  name: undefined,
  description: undefined,
  link: undefined,
  open_university_course_code: undefined,
}

const languageFilter = (
  index: number,
  course_translations: CourseTranslationFormValues[] | null,
) =>
  languages.filter(l =>
    (course_translations || [])
      .filter((_, idx) => idx !== index)
      .map((c: any) => c.language)
      .includes(l.value),
  )

const CourseTranslationEditForm = ({
  values,
  errors,
  isSubmitting,
}: {
  values: CourseTranslationFormValues[]
  errors: (FormikErrors<CourseTranslationFormValues> | undefined)[] | undefined
  isSubmitting: boolean
}) => {
  const classes = useStyles()
  const [dialogVisible, setDialogVisible] = useState(false)
  const [removableIndex, setRemovableIndex] = useState(-1)

  return (
    <section>
      <Typography variant="h4">Course translations</Typography>
      <Grid item container direction="column">
        <FieldArray
          name="course_translations"
          render={helpers => (
            <>
              <ConfirmationDialog
                title="Are you sure?"
                content="Do you want to remove this translation?"
                acceptText="Yes"
                rejectText="No"
                onAccept={() => {
                  setDialogVisible(false)
                  removableIndex >= 0 && helpers.remove(removableIndex)
                  setRemovableIndex(-1)
                }}
                onReject={() => {
                  setDialogVisible(false)
                  setRemovableIndex(-1)
                }}
                open={dialogVisible}
              />
              {values.length
                ? values.map(
                    (value: CourseTranslationFormValues, index: number) => (
                      <Grid
                        item
                        className={classes.languageEntry}
                        key={`translation-${index}`}
                      >
                        <InputLabel
                          htmlFor={`course_translations[${index}].language`}
                          shrink
                        >
                          Language
                        </InputLabel>
                        <Field
                          name={`course_translations[${index}].language`}
                          type="select"
                          label="Language"
                          errors={[getIn(errors, `[${index}].language`)]}
                          fullWidth
                          component={Select}
                        >
                          {languages.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Field>
                        {getIn(errors, `[${index}].language`) ? (
                          <InputLabel shrink style={{ color: "red" }}>
                            {getIn(errors, `[${index}].language`)}
                          </InputLabel>
                        ) : null}
                        <Field
                          name={`course_translations[${index}].name`}
                          type="text"
                          label="Name"
                          error={getIn(errors, `[${index}].name`)}
                          fullWidth
                          component={TextField}
                        />
                        <Field
                          name={`course_translations[${index}].description`}
                          type="textarea"
                          label="Description"
                          error={getIn(errors, `[${index}].description`)}
                          fullWidth
                          multiline
                          rows={5}
                          component={TextField}
                        />
                        <Field
                          name={`course_translations[${index}].link`}
                          type="text"
                          label="Link"
                          error={getIn(errors, `[${index}].link`)}
                          fullWidth
                          component={TextField}
                        />
                        <Field
                          name={`course_translations[${index}].open_university_course_code`}
                          type="text"
                          label="Open university course code"
                          error={getIn(
                            errors,
                            `[${index}].open_university_course_code`,
                          )}
                          fullWidth
                          component={TextField}
                        />
                        <br />
                        {/* TODO here: don't actually remove in case of misclicks */}
                        {/*index === values.length - 1 &&
                        index < languages.length - 1 &&
                        languageFilter(index + 1, values).length > 0 ? (
                          <Button
                            variant="contained"
                            onClick={() => helpers.push({ ...initialTranslation })}
                          >
                            +
                          </Button>
                        ) : null
                      */}
                        <Button
                          style={{ float: "right" }}
                          variant="contained"
                          disabled={isSubmitting}
                          onClick={() => {
                            setDialogVisible(true)
                            setRemovableIndex(index)
                          }}
                        >
                          Remove translation
                        </Button>
                      </Grid>
                    ),
                  )
                : null}
              {values && values.length < languages.length && (
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={isSubmitting}
                  onClick={() => helpers.push({ ...initialTranslation })}
                >
                  Add translation
                </Button>
              )}
            </>
          )}
        />
      </Grid>
    </section>
  )
}

export default CourseTranslationEditForm
