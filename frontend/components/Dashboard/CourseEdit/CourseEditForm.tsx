import React from "react"
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
import { statuses, study_modules } from "./form-validation"
import { CourseFormValues } from "./types"

const renderForm = ({
  submitForm,
  errors,
  isSubmitting,
  values,
  setFieldValue,
}: FormikProps<CourseFormValues>) => (
  <Grid container direction="column">
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
                  <MenuItem key={`module-${option.value}`} value={option.value}>
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
                  <MenuItem key={`status-${option.value}`} value={option.value}>
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
    </Form>
  </Grid>
)

const CourseEditForm = ({
  course,
  validationSchema,
  onSubmit,
}: {
  course: CourseFormValues
  validationSchema: Yup.ObjectSchema
  onSubmit: (
    values: CourseFormValues,
    formikActions: FormikActions<CourseFormValues>,
  ) => void
}) => {
  return (
    <Formik
      initialValues={course}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      render={renderForm}
    />
  )
}

export default CourseEditForm
