import React, { useCallback } from "react"
import {
  InputLabel,
  FormControl,
  FormControlLabel,
  MenuItem,
  Grid,
  Typography,
  List,
  ListItem,
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
import { Checkbox } from "formik-material-ui"
import * as Yup from "yup"
import CourseTranslationEditForm from "./CourseTranslationEditForm"
import CourseVariantEditForm from "./CourseVariantEditForm"
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"
import { statuses } from "./form-validation"
import { CourseFormValues } from "./types"
import styled from "styled-components"
import { addDomain } from "/util/imageUtils"
import FormWrapper from "/components/Dashboard/Editor/FormWrapper"
import { StudyModules_study_modules } from "/static/types/generated/StudyModules"
import {
  StyledTextField,
  OutlinedFormControl,
  OutlinedInputLabel,
  OutlinedFormGroup,
} from "/components/Dashboard/Editor/common"

const ModuleList = styled(List)`
  padding: 0px;
  max-height: 400px;
  overflow: auto;
`

const ModuleListItem = styled(ListItem)<any>`
  padding: 0px;
`
const FormSubtitle = styled(Typography)`
  padding: 20px 0px 20px 0px;
  margin-bottom: 1rem;
  font-size: 2em;
`
const renderForm = (studyModules?: StudyModules_study_modules[]) => ({
  errors,
  values,
  isSubmitting,
  setFieldValue,
}: // setStatus
Pick<
  FormikProps<CourseFormValues>,
  | "errors"
  | "values"
  | "isSubmitting"
  | "setFieldValue"
  | "initialValues"
  | "setStatus"
>) => (
  <Form>
    <FormSubtitle variant="h6">Course Details</FormSubtitle>
    <Grid container direction="row" spacing={2}>
      <Grid item xs={12} sm={12} md={12}>
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
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
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
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Field
          name="ects"
          type="text"
          label="ECTS"
          errors={errors.ects}
          fullWidth
          autoComplete="off"
          variant="outlined"
          component={StyledTextField}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
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
      <Grid item xs={4} sm={4} md={2}>
        <Field
          name="order"
          type="number"
          label="Order"
          error={errors.order}
          fullWidth
          autoComplete="off"
          variant="outlined"
          component={StyledTextField}
        />
      </Grid>
      <Grid item xs={4} sm={4} md={2}>
        <Field
          name="study_module_order"
          type="number"
          label="In-module order"
          error={errors.study_module_order}
          fullWidth
          autoComplete="off"
          variant="outlined"
          component={StyledTextField}
        />
      </Grid>
    </Grid>
    <Grid container direction="row" justify="space-between" spacing={2}></Grid>
    <Grid container direction="row" justify="space-between" spacing={2}>
      <Grid
        container
        item
        xs={12}
        sm={6}
        direction="column"
        justify="space-between"
      >
        <OutlinedFormControl variant="outlined">
          <OutlinedInputLabel shrink>Properties</OutlinedInputLabel>
          <OutlinedFormGroup>
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
                  label="Study module start point"
                  type="checkbox"
                  name="study_module_start_point"
                  value={values.study_module_start_point}
                  component={Checkbox}
                />
              }
              label="Study module start point"
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
          </OutlinedFormGroup>
        </OutlinedFormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <OutlinedFormControl>
          <OutlinedInputLabel shrink>Study modules</OutlinedInputLabel>
          <OutlinedFormGroup>
            <ModuleList>
              {studyModules?.map((module: StudyModules_study_modules) => (
                <ModuleListItem key={module.id}>
                  <FormControlLabel
                    control={
                      <Field
                        label={module.name}
                        type="checkbox"
                        name={`study_modules[${module.id}]`}
                        value={(values.study_modules || {})[module.id]}
                        component={Checkbox}
                      />
                    }
                    label={module.name}
                  />
                </ModuleListItem>
              ))}
            </ModuleList>
          </OutlinedFormGroup>
        </OutlinedFormControl>
      </Grid>
    </Grid>
    <CourseVariantEditForm
      values={values.course_variants}
      errors={errors.course_variants}
      isSubmitting={isSubmitting}
    />
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
    <FormSubtitle variant="h6">Course translations</FormSubtitle>
    <CourseTranslationEditForm
      values={values.course_translations}
      errors={errors.course_translations}
      isSubmitting={isSubmitting}
    />
  </Form>
)

const CourseEditForm = React.memo(
  ({
    course,
    studyModules,
    validationSchema,
    onSubmit,
    onCancel,
    onDelete,
  }: {
    course: CourseFormValues
    studyModules?: StudyModules_study_modules[]
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
            renderForm={renderForm(studyModules)}
            onCancel={onCancel}
            onDelete={onDelete}
          />
        )}
      />
    )
  },
)

export default CourseEditForm
