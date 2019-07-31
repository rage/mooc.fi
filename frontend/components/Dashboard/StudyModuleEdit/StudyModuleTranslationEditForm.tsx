import React, { useState } from "react"
import { Button, Grid, MenuItem, Typography, Paper } from "@material-ui/core"
import { Field, FieldArray, getIn, FormikErrors, FieldProps } from "formik"
import { TextField } from "formik-material-ui"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { StudyModuleTranslationFormValues } from "./types"
import ConfirmationDialog from "../ConfirmationDialog"
import { languages, initialTranslation } from "./form-validation"
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

const StudyModuleTranslationForm = ({
  values,
  errors,
  isSubmitting,
}: {
  values: StudyModuleTranslationFormValues[]
  errors:
    | (FormikErrors<StudyModuleTranslationFormValues> | undefined)[]
    | undefined
  isSubmitting: boolean
}) => {
  const classes = useStyles()
  const [dialogVisible, setDialogVisible] = useState(false)
  const [removableIndex, setRemovableIndex] = useState(-1)

  return (
    <section>
      <Grid container direction="column">
        <FieldArray
          name="study_module_translations"
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
                values.map((_: any, index: number) => (
                  <Grid
                    item
                    className={classes.languageEntry}
                    key={`translation-${index}`}
                  >
                    <Paper className={classes.paper} elevation={2}>
                      <Field
                        name={`study_module_translations[${index}].language`}
                        type="select"
                        label="Language"
                        errors={[getIn(errors, `[${index}].language`)]}
                        fullWidth
                        variant="outlined"
                        select
                        autoComplete="off"
                        component={StyledTextField}
                      >
                        {languages.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Field>
                      <Field
                        name={`study_module_translations[${index}].name`}
                        type="text"
                        label="Name"
                        error={getIn(errors, `[${index}].name`)}
                        fullWidth
                        autoComplete="off"
                        variant="outlined"
                        component={StyledTextField}
                      />
                      <Field
                        name={`study_module_translations[${index}].description`}
                        type="textarea"
                        label="Description"
                        error={getIn(errors, `[${index}].description`)}
                        fullWidth
                        multiline
                        rows={5}
                        autoComplete="off"
                        variant="outlined"
                        component={StyledTextField}
                      />
                      <br />
                      <Grid container justify="flex-end">
                        <Button
                          variant="contained"
                          disabled={isSubmitting}
                          color="secondary"
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
                ))
              ) : (
                <Paper className={classes.paper} elevation={2}>
                  <Typography variant="body1">
                    Please add at least one translation!
                  </Typography>
                </Paper>
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

export default StudyModuleTranslationForm
