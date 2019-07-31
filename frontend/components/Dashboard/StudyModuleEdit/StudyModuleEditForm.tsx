import React, { useState, useCallback } from "react"
import StudyModuleTranslationEditForm from "./StudyModuleTranslationEditForm"
import { StudyModuleFormValues } from "./types"
import {
  InputLabel,
  FormControl,
  FormControlLabel,
  MenuItem,
  CircularProgress,
  Button,
  Grid,
  Container,
  Typography,
  Checkbox as MUICheckbox,
  Paper,
} from "@material-ui/core"
import {
  Formik,
  Field,
  Form,
  FieldProps,
  FormikActions,
  FormikProps,
  yupToFormErrors,
} from "formik"
import { TextField, Checkbox } from "formik-material-ui"
import * as Yup from "yup"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import ConfirmationDialog from "../ConfirmationDialog"

const isProduction = process.env.NODE_ENV === "production"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      spacing: "4",
    },
    paper: {
      padding: "1em",
    },
    status: (props: { [key: string]: any }) => ({
      color: props.error ? "#FF0000" : "default",
    }),
  }),
)

const RenderForm = ({
  submitForm,
  errors,
  dirty,
  isSubmitting,
  values,
  status,
  setFieldValue,
  setStatus,
  onCancel,
  onDelete,
  confirmationVisible,
  setConfirmationVisible,
}: FormikProps<StudyModuleFormValues> & {
  onCancel: () => void
  onDelete: (values: StudyModuleFormValues) => void
  confirmationVisible: boolean
  setConfirmationVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [deleteVisible, setDeleteVisible] = useState(false)
  const classes = useStyles({ error: status ? status.error : null })

  return (
    <Container maxWidth="md" className={classes.form}>
      <Paper elevation={1} className={classes.paper}>
        <ConfirmationDialog
          title="You have unsaved changes"
          content="Are you sure you want to leave without saving?"
          acceptText="Yes"
          rejectText="No"
          onAccept={(e: React.MouseEvent) => {
            setConfirmationVisible(false)
            onCancel()
          }}
          onReject={() => setConfirmationVisible(false)}
          open={confirmationVisible}
        />
        <Form>
          {/* study module doesn't really have any fields (yet) */}
          <StudyModuleTranslationEditForm
            values={values.study_module_translations}
            errors={errors.study_module_translations}
            isSubmitting={isSubmitting}
          />
          <br />
          <Grid container direction="row">
            <Grid item xs={3}>
              {!isProduction && values.id ? (
                <MUICheckbox
                  checked={deleteVisible}
                  onChange={() => setDeleteVisible(!deleteVisible)}
                />
              ) : null}
              {deleteVisible && values.id ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => onDelete(values)}
                >
                  Delete
                </Button>
              ) : null}
            </Grid>
            <Grid container item justify="flex-end" xs={9}>
              <Button
                color="secondary"
                style={{ marginRight: "6px" }}
                disabled={isSubmitting}
                onClick={() =>
                  dirty ? setConfirmationVisible(true) : onCancel()
                }
              >
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={
                  !dirty || Object.keys(errors).length > 0 || isSubmitting
                }
                onClick={submitForm}
              >
                {isSubmitting ? <CircularProgress size={20} /> : "Save"}
              </Button>
            </Grid>
          </Grid>
          {status && status.message ? (
            <p className={classes.status}>
              {status.error ? "Error submitting: " : null}
              <b>{status.message}</b>
            </p>
          ) : null}
        </Form>
      </Paper>
    </Container>
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
  const [confirmationVisible, setConfirmationVisible] = useState(false)

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
        <RenderForm
          {...formikProps}
          onCancel={onCancel}
          onDelete={onDelete}
          confirmationVisible={confirmationVisible}
          setConfirmationVisible={setConfirmationVisible}
        />
      )}
    />
  )
}

export default StudyModuleEditForm
