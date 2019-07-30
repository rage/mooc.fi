import React, { useState, useCallback } from "react"
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
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import * as Yup from "yup"
import CourseTranslationEditForm from "./CourseTranslationEditForm"
import ImageDropzoneInput from "../ImageDropzoneInput"
import ImagePreview from "../ImagePreview"
import ConfirmationDialog from "../ConfirmationDialog"
import { statuses, study_modules } from "./form-validation"
import { CourseFormValues } from "./types"
import styled from "styled-components"
import { addDomain } from "../../../util/imageUtils"

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

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`

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
}: FormikProps<CourseFormValues> & {
  onCancel: () => void
  onDelete: (values: CourseFormValues) => void
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
          <Field
            name="name"
            type="text"
            label="Name"
            error={errors.name}
            fullWidth
            autoComplete="off"
            variant="outlined"
            component={StyledTextField}
          />
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
          <Grid container direction="row">
            <Grid container item xs={12} sm={6} justify="space-between">
              <FormControlLabel
                control={
                  <Field
                    label="Promote"
                    type="checkbox"
                    name="promote"
                    value={values.promote}
                    component={Checkbox}
                  />
                }
                label="Promote"
              />
              <FormControlLabel
                control={
                  <Field
                    label="Start point"
                    type="checkbox"
                    name="start_point"
                    value={values.start_point}
                    component={Checkbox}
                  />
                }
                label="Start point"
              />
              <FormControlLabel
                control={
                  <Field
                    label="Hidden"
                    type="checkbox"
                    name="hidden"
                    value={values.hidden}
                    component={Checkbox}
                  />
                }
                label="Hidden"
              />
            </Grid>
            <Grid container item xs={12} sm={6} justify="space-between">
              <FormControl>
                <Field
                  name="study_module"
                  type="text"
                  label="Study module"
                  component={StyledTextField}
                  variant="outlined"
                  select
                  fullWidth
                >
                  {study_modules.map(option => (
                    <MenuItem
                      key={`module-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              <FormControl>
                <Field
                  name="status"
                  type="text"
                  label="Status"
                  select
                  component={StyledTextField}
                  errors={errors.status}
                  variant="outlined"
                  fullWidth
                >
                  {statuses.map(option => (
                    <MenuItem
                      key={`status-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Grid>
          </Grid>
          <InputLabel htmlFor="new_photo" shrink>
            Photo
          </InputLabel>
          <FormControl>
            <Field name="thumbnail" type="hidden" />
            <Field
              name="new_photo"
              type="file"
              label="Upload new photo"
              errors={errors.new_photo}
              fullWidth
              render={({ field, form }: FieldProps<CourseFormValues>) => (
                <ImageDropzoneInput
                  field={field}
                  form={form}
                  onImageLoad={(value: any) =>
                    setFieldValue("thumbnail", value)
                  }
                >
                  <ImagePreview
                    file={addDomain(values.thumbnail)}
                    onClose={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ): void => {
                      e.stopPropagation()
                      e.nativeEvent.stopImmediatePropagation()
                      setFieldValue("photo", undefined)
                      setFieldValue("new_photo", undefined)
                      setFieldValue("thumbnail", undefined)
                    }}
                  />
                </ImageDropzoneInput>
              )}
            />
          </FormControl>
          <Typography variant="h6" style={{ padding: "20px 0px 20px 0px" }}>
            Course translations
          </Typography>
          <CourseTranslationEditForm
            values={values.course_translations}
            errors={errors.course_translations}
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

const CourseEditForm = ({
  course,
  validationSchema,
  onSubmit,
  onCancel,
  onDelete,
}: {
  course: CourseFormValues
  validationSchema: Yup.ObjectSchema
  onSubmit: (
    values: CourseFormValues,
    formikActions: FormikActions<CourseFormValues>,
  ) => void
  onCancel: () => void
  onDelete: (values: CourseFormValues) => void
}) => {
  const [confirmationVisible, setConfirmationVisible] = useState(false)

  const validate = useCallback(
    async (values: CourseFormValues) =>
      validationSchema
        .validate(values, { abortEarly: false, context: { values } })
        .catch(err => {
          throw yupToFormErrors(err)
        }),
    [],
  )

  return (
    <Formik
      initialValues={course}
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

export default CourseEditForm
