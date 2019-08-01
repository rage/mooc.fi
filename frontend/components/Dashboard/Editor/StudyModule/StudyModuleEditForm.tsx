import React, { useCallback, useState } from "react"
import { StudyModuleFormValues } from "./types"
import {
  Field,
  Formik,
  Form,
  FormikActions,
  FormikProps,
  yupToFormErrors,
  FieldArray,
  getIn,
} from "formik"
import * as Yup from "yup"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import FormWrapper from "../FormWrapper"
import { languages, initialTranslation } from "./form-validation"
import styled from "styled-components"
import { TextField } from "formik-material-ui"
import { Grid, MenuItem, Typography, Button, Paper } from "@material-ui/core"
import ConfirmationDialog from "../../ConfirmationDialog"

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

const renderForm = ({
  errors,
  values,
  isSubmitting,
}: Pick<
  FormikProps<StudyModuleFormValues>,
  "errors" | "values" | "isSubmitting" | "setFieldValue"
>) => {
  const classes = useStyles()
  const [removeDialogVisible, setRemoveDialogVisible] = useState(false)
  const [removableIndex, setRemovableIndex] = useState(-1)

  return (
    <Form>
      <Field
        name="new_slug"
        type="text"
        label="Slug"
        error={errors.new_slug}
        fullWidth
        variant="outlined"
        autoComplete="off"
        component={StyledTextField}
      />
      <Field
        name="name"
        type="text"
        label="Name"
        error={errors.name}
        fullWidth
        variant="outlined"
        autoComplete="off"
        component={StyledTextField}
      />
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
                  setRemoveDialogVisible(false)
                  removableIndex >= 0 && helpers.remove(removableIndex)
                  setRemovableIndex(-1)
                }}
                onReject={() => {
                  setRemoveDialogVisible(false)
                  setRemovableIndex(-1)
                }}
                open={removeDialogVisible}
              />
              {values && values.study_module_translations.length ? (
                values.study_module_translations.map(
                  (_: any, index: number) => (
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
                          errors={[
                            getIn(
                              errors,
                              `study_module_translations[${index}].language`,
                            ),
                          ]}
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
                          error={getIn(
                            errors,
                            `study_module_translations[${index}].name`,
                          )}
                          fullWidth
                          autoComplete="off"
                          variant="outlined"
                          component={StyledTextField}
                        />
                        <Field
                          name={`study_module_translations[${index}].description`}
                          type="textarea"
                          label="Description"
                          error={getIn(
                            errors,
                            `study_module_translations[${index}].description`,
                          )}
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
                              setRemoveDialogVisible(true)
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
                <Paper className={classes.paper} elevation={2}>
                  <Typography variant="body1">
                    Please add at least one translation!
                  </Typography>
                </Paper>
              )}
              {values &&
                values.study_module_translations &&
                values.study_module_translations.length < languages.length && (
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
    </Form>
  )
}

const StudyModuleEditForm = ({
  module,
  validationSchema,
  onSubmit,
  onCancel,
  onDelete,
}: {
  module: StudyModuleFormValues
  validationSchema: Yup.ObjectSchema
  onSubmit: (
    values: StudyModuleFormValues,
    formikActions: FormikActions<StudyModuleFormValues>,
  ) => void
  onCancel: () => void
  onDelete: (values: StudyModuleFormValues) => void
}) => {
  const validate = useCallback(
    async (values: StudyModuleFormValues) =>
      validationSchema
        .validate(values, { abortEarly: false, context: { values } })
        .catch(err => {
          throw yupToFormErrors(err)
        }),
    [],
  )

  return (
    <Formik
      initialValues={module}
      validate={validate}
      onSubmit={onSubmit}
      render={formikProps => (
        <FormWrapper<StudyModuleFormValues>
          {...formikProps}
          renderForm={renderForm}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      )}
    />
  )
}

export default StudyModuleEditForm
