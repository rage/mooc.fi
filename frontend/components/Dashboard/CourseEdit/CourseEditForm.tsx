import React, { useState } from "react"
import {
  InputLabel,
  FormControl,
  FormControlLabel,
  MenuItem,
  LinearProgress,
  Button,
  Grid,
} from "@material-ui/core"
import {
  Formik,
  Field,
  Form,
  FieldProps,
  FormikActions,
  FormikProps,
} from "formik"
import { TextField, Select, Checkbox } from "formik-material-ui"
import * as Yup from "yup"
import CourseTranslationEditForm from "./CourseTranslationEditForm"
import ImageDropzoneInput from "../ImageDropzoneInput"
import ImagePreview from "../ImagePreview"
import ConfirmationDialog from "../ConfirmationDialog"
import { statuses, study_modules } from "./form-validation"
import { CourseFormValues } from "./types"

const isProduction = process.env.NODE_ENV === "production"

const RenderForm = ({
  submitForm,
  errors,
  dirty,
  isSubmitting,
  values,
  setFieldValue,
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

  return (
    <Grid container direction="column">
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
      <Form style={{ lineHeight: "2" }}>
        <Grid item>
          <Field
            name="name"
            type="text"
            label="Name"
            error={errors.name}
            fullWidth
            component={TextField}
          />
          <Field
            name="new_slug"
            type="text"
            label="Slug"
            error={errors.new_slug}
            fullWidth
            component={TextField}
          />
        </Grid>
        <Grid item container direction="row">
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Field
                  label="Promote"
                  type="checkbox"
                  name="promote"
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
                  component={Checkbox}
                />
              }
              label="Hidden"
            />
          </Grid>
          <Grid item container xs={12} sm={6} justify="space-between">
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="study_module" shrink>
                  Study module
                </InputLabel>
                <Field
                  name="study_module"
                  type="text"
                  label="Study module"
                  component={Select}
                  errors={errors.study_module}
                  width="100%"
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
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="status" shrink>
                  Status
                </InputLabel>
                <Field
                  name="status"
                  type="text"
                  label="Status"
                  component={Select}
                  errors={errors.status}
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
                {errors && errors.status ? (
                  <div style={{ color: "red" }}>required</div>
                ) : null}
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container direction="column">
          <Grid item>
            <InputLabel htmlFor="new_photo" shrink>
              Photo
            </InputLabel>
          </Grid>
          <Grid item>
            <FormControl>
              <Field name="thumbnail" type="hidden" />
              <Field
                name="new_photo"
                type="file"
                label="Upload new photo"
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
                      file={values.thumbnail}
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
          </Grid>
        </Grid>
        <Grid item container direction="column">
          <CourseTranslationEditForm
            values={values.course_translations}
            errors={errors.course_translations}
            isSubmitting={isSubmitting}
          />
        </Grid>
        {isSubmitting && <LinearProgress />}
        <br />
        <Button
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          onClick={submitForm}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={isSubmitting}
          onClick={() => (dirty ? setConfirmationVisible(true) : onCancel())}
        >
          Cancel
        </Button>
        {!isProduction ? (
          <input
            type="checkbox"
            style={{ float: "right" }}
            checked={deleteVisible}
            onClick={() => setDeleteVisible(!deleteVisible)}
          />
        ) : null}
        {deleteVisible && values.id ? (
          <Button
            variant="contained"
            color="secondary"
            style={{ float: "right" }}
            onClick={() => onDelete(values)}
          >
            Delete
          </Button>
        ) : null}
      </Form>
    </Grid>
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

  return (
    <Formik
      initialValues={course}
      validationSchema={validationSchema}
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
