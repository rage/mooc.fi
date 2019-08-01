import React, { useState, useCallback } from "react"
import {
  InputLabel,
  FormControl,
  FormControlLabel,
  MenuItem,
  Grid,
  Typography,
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
import CourseTranslationEditForm from "./CourseTranslationEditForm"
import ImageDropzoneInput from "../../ImageDropzoneInput"
import ImagePreview from "../../ImagePreview"
import { statuses, study_modules } from "./form-validation"
import { CourseFormValues } from "./types"
import styled from "styled-components"
import { addDomain } from "../../../../util/imageUtils"
import FormWrapper from "../FormWrapper"

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`

const renderForm = ({
  errors,
  values,
  isSubmitting,
  setFieldValue,
}: Pick<
  FormikProps<CourseFormValues>,
  "errors" | "values" | "isSubmitting" | "setFieldValue"
>) => (
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
              <MenuItem key={`module-${option.value}`} value={option.value}>
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
              <MenuItem key={`status-${option.value}`} value={option.value}>
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
            onImageLoad={(value: any) => setFieldValue("thumbnail", value)}
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
  </Form>
)

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
        <FormWrapper<CourseFormValues>
          {...formikProps}
          renderForm={renderForm}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      )}
    />
  )
}

export default CourseEditForm
