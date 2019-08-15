import React, { useCallback } from "react"
import {
  InputLabel,
  FormControl,
  FormControlLabel,
  FormGroup,
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
  // getIn,
} from "formik"
import { TextField, Checkbox } from "formik-material-ui"
import * as Yup from "yup"
import CourseTranslationEditForm from "./CourseTranslationEditForm"
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"
import { statuses } from "./form-validation"
import { CourseFormValues } from "./types"
import styled from "styled-components"
import { addDomain } from "/util/imageUtils"
import FormWrapper from "/components/Dashboard/Editor/FormWrapper"
import { StudyModules_study_modules } from "/static/types/StudyModules"

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`

const OutlinedInputLabel = styled(InputLabel)`
  background-color: #ffffff;
  padding: 0 4px 0 4px;
`

const OutlinedFormControl = styled(FormControl)`
  margin-bottom: 1rem;
`

const OutlinedFormGroup = styled(FormGroup)<{ error?: boolean }>`
  border-radius: 4px;
  border: 1px solid
    ${props => (props.error ? "#F44336" : "rgba(0, 0, 0, 0.23)")};
  padding: 18.5px 14px;
  transition: padding-left 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    border-color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    border-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.87);
  }

  &:focus {
    bordercolor: "#3f51b5";
  }

  @media (hover: none) {
    border: 1px solid rgba(0, 0, 0, 0.23);
  }
`

const ModuleList = styled(List)`
  padding: 0px;
  max-height: 400px;
  overflow: auto;
`

const ModuleListItem = styled(ListItem)<any>`
  padding: 0px;
`

const renderForm = ({
  studyModules,
}: {
  studyModules?: StudyModules_study_modules[]
}) => ({
  errors,
  values,
  isSubmitting,
  setFieldValue,
}: Pick<
  FormikProps<CourseFormValues>,
  "errors" | "values" | "isSubmitting" | "setFieldValue" | "initialValues"
>) => (
  <Form>
    <Grid container direction="row" spacing={2}>
      <Grid item xs={10}>
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
      <Grid item xs={2}>
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
    </Grid>
    <Grid container direction="row" justify="space-between" spacing={2}>
      <Grid item xs={12} sm={6}>
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
    </Grid>
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
              {(studyModules || []).map(
                (module: StudyModules_study_modules) => (
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
                ),
              )}
            </ModuleList>
          </OutlinedFormGroup>
        </OutlinedFormControl>
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
            renderForm={renderForm({ studyModules })}
            onCancel={onCancel}
            onDelete={onDelete}
          />
        )}
      />
    )
  },
)

export default CourseEditForm
