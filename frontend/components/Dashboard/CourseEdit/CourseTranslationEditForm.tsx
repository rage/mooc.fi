import React, { useState } from "react"
import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Typography,
  Paper,
} from "@material-ui/core"
import { Field, FieldArray, getIn, FormikErrors, FieldProps } from "formik"
import { Select, TextField } from "formik-material-ui"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { CourseTranslationFormValues } from "./types"
import ConfirmationDialog from "../ConfirmationDialog"
import { languages } from "./form-validation"
import styled from "styled-components"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    languageEntry: {
      spacing: "10px",
      lineHeight: "2",
      padding: "0 0 20px 0",
    },
    paper: {
      borderLeft: "2px solid #A0A0FF",
      padding: "20px",
    },
  }),
)

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`

const StyledSelect = styled(Select)`
  margin-bottom: 1rem;
`

const initialTranslation: CourseTranslationFormValues = {
  id: undefined,
  language: "",
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
      <Grid container direction="column">
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
              {values.length ? (
                values.map(
                  (value: CourseTranslationFormValues, index: number) => (
                    <Grid
                      item
                      className={classes.languageEntry}
                      key={`translation-${index}`}
                    >
                      <Paper className={classes.paper} elevation={2}>
                        <Field
                          name={`course_translations[${index}].language`}
                          type="select"
                          label="Language"
                          errors={[getIn(errors, `[${index}].language`)]}
                          fullWidth
                          variant="outlined"
                          select
                          autocomplete="off"
                          component={StyledTextField}
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
                          error={getIn(errors, `[${index}].name`)}
                          fullWidth
                          autocomplete="off"
                          variant="outlined"
                          component={StyledTextField}
                        />
                        <Field
                          name={`course_translations[${index}].description`}
                          type="textarea"
                          label="Description"
                          error={getIn(errors, `[${index}].description`)}
                          fullWidth
                          multiline
                          rows={5}
                          autocomplete="off"
                          variant="outlined"
                          component={StyledTextField}
                        />
                        <Field
                          name={`course_translations[${index}].link`}
                          type="text"
                          label="Link"
                          error={getIn(errors, `[${index}].link`)}
                          fullWidth
                          autocomplete="off"
                          variant="outlined"
                          component={StyledTextField}
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
                          autocomplete="off"
                          variant="outlined"
                          component={StyledTextField}
                        />
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
                        <br />
                        <Grid container justify="flex-end">
                          <Button
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
                      </Paper>
                    </Grid>
                  ),
                )
              ) : (
                <Typography variant="body1">
                  Please add at least one translation!
                </Typography>
              )}
              {values && values.length < languages.length && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
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
