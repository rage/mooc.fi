import React, { useCallback, useContext } from "react"

import {
  InputLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Typography,
  List,
  ListItem,
  FormLabel,
  RadioGroup,
  Radio,
  FormGroup,
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
import { statuses as statusesT } from "./form-validation"
import { CourseFormValues } from "./types"
import styled from "styled-components"

import { addDomain } from "/util/imageUtils"
import FormWrapper from "/components/Dashboard/Editor/FormWrapper"
import { StudyModules_study_modules } from "/static/types/generated/StudyModules"
import { StyledTextField } from "/components/Dashboard/Editor/common"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"

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
interface Labelprops {
  required?: boolean
}
const StyledLabel = styled(InputLabel)<Labelprops>`
  margin-bottom: 0.3rem;
  ${props => `color: ${props.required ? `#DF7A46` : `#245B6D`}`}
`

const StyledHelperText = styled(FormHelperText)`
  margin-bottom: 0.3rem;
  margin-top: 0.1rem;
`
const FormFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid #ffa17a;
  padding: 0.5rem;
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
>) => {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const statuses = statusesT(t)

  return (
    <Form>
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("courseDetails")}
      </FormSubtitle>
      <FormFieldGroup>
        <StyledLabel htmlFor="input-course-name" required={true}>
          {t("courseName")}
        </StyledLabel>
        <Field
          id="input-course-name"
          style={{ width: "80%" }}
          name="name"
          type="text"
          error={errors.name}
          autoComplete="off"
          variant="outlined"
          component={StyledTextField}
          required={true}
        />
        <StyledLabel
          style={{ marginBottom: "0.0rem" }}
          htmlFor="input-course-slug"
          required={true}
        >
          {t("courseSlug")}
        </StyledLabel>
        <StyledHelperText>{t("courseSlugHelper")}</StyledHelperText>
        <Field
          id="input-course-slug"
          style={{ width: "80%" }}
          name="new_slug"
          type="text"
          error={errors.new_slug}
          variant="outlined"
          autoComplete="off"
          component={StyledTextField}
          required={true}
        />
        <StyledLabel>{t("courseECTS")}</StyledLabel>
        <Field
          style={{ width: "25%" }}
          name="ects"
          type="text"
          errors={errors.ects}
          autoComplete="off"
          variant="outlined"
          component={StyledTextField}
        />
      </FormFieldGroup>

      <FormFieldGroup>
        <FormControl component="fieldset">
          <FormLabel component="legend" style={{ color: "#DF7A46" }}>
            {t("courseStatus")}*
          </FormLabel>
          <RadioGroup aria-label="course status" name="courseStatus">
            {statuses.map((option: { value: string; label: string }) => (
              <FormControlLabel
                key={`status-${option.value}`}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </FormFieldGroup>

      <FormFieldGroup>
        <FormControl>
          <FormLabel>{t("courseModules")}</FormLabel>
          <FormGroup>
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
          </FormGroup>
        </FormControl>
      </FormFieldGroup>
      <FormFieldGroup>
        <FormControl>
          <FormLabel>{t("courseProperties")}</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Field
                  label={t("coursePromote")}
                  type="checkbox"
                  name="promote"
                  value={values.promote}
                  component={Checkbox}
                />
              }
              label={t("coursePromote")}
            />
            <FormControlLabel
              control={
                <Field
                  label={t("courseStartPoint")}
                  type="checkbox"
                  name="start_point"
                  value={values.start_point}
                  component={Checkbox}
                />
              }
              label={t("courseStartPoint")}
            />
            <FormControlLabel
              control={
                <Field
                  label={t("courseModuleStartPoint")}
                  type="checkbox"
                  name="study_module_start_point"
                  value={values.study_module_start_point}
                  component={Checkbox}
                />
              }
              label={t("courseModuleStartPoint")}
            />
            <FormControlLabel
              control={
                <Field
                  label={t("courseHidden")}
                  type="checkbox"
                  name="hidden"
                  value={values.hidden}
                  component={Checkbox}
                />
              }
              label={t("courseHidden")}
            />
          </FormGroup>
        </FormControl>
      </FormFieldGroup>
      <FormFieldGroup>
        <StyledLabel htmlFor="new_photo">{t("coursePhoto")}</StyledLabel>
        <FormControl>
          <Field name="thumbnail" type="hidden" />
          <Field
            name="new_photo"
            type="file"
            label={t("courseNewPhoto")}
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
      </FormFieldGroup>
      <StyledLabel>{t("courseOrder")}</StyledLabel>
      <Field
        name="order"
        type="number"
        error={errors.order}
        fullWidth
        autoComplete="off"
        variant="outlined"
        component={StyledTextField}
        style={{ width: "20%" }}
      />
      <StyledLabel>{t("courseModuleOrder")}</StyledLabel>
      <Field
        name="study_module_order"
        type="number"
        error={errors.study_module_order}
        fullWidth
        autoComplete="off"
        variant="outlined"
        component={StyledTextField}
        style={{ width: "20%" }}
      />
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("courseTranslations")}
      </FormSubtitle>
      <CourseTranslationEditForm
        values={values.course_translations}
        errors={errors.course_translations}
        isSubmitting={isSubmitting}
      />
      <FormSubtitle variant="h6" component="h3" align="center">
        Course variants
      </FormSubtitle>
      <CourseVariantEditForm
        values={values.course_variants}
        errors={errors.course_variants}
        isSubmitting={isSubmitting}
      />
    </Form>
  )
}

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
