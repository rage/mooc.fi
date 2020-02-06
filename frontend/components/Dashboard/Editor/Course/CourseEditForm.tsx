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
  Radio,
  RadioGroup,
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
  FieldArray,
} from "formik"

import { Checkbox } from "formik-material-ui"
import * as Yup from "yup"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Button from "@material-ui/core/Button"
import CourseTranslationEditForm from "./CourseTranslationEditForm"
import { initialTranslation } from "./form-validation"
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
export const StyledLabel = styled(InputLabel)<Labelprops>`
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

const ButtonGroupContainer = styled(ButtonGroup)`
  width: 90%;
  margin: auto;
  display: flex;
  margin-bottom: 1rem;
  margin-top: 1 rem;
`

const StyledLanguageButton = styled(Button)`
  width: 33%;
  background-color: #00ada7;
  margin: 0.5rem;
  padding: 1rem;
  color: white;
  font-size: 18px;
  border: 1px solid #8cc0bd;
  &:hover {
    background-color: #8cc0bd;
    border: 1px solid #8cc0bd;
  }
  &:focus {
    background-color: #7fd1ae;
    border: 1px solid #8cc0bd;
    color: black;
  }
`

const StyledField = styled(Field)`
  .input-label {
    background-color: white;
    font-size: 23px;
    padding-right: 7px;
    transform: translate(14px, -9px) scale(0.75);
  }
  .input-required {
    color: #df7a46;
  }
`
const inputLabelProps = {
  fontSize: 16,
  shrink: true,
  classes: { root: "input-label", required: "input-required" },
}
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
  console.log(values)
  return (
    <Form style={{ backgroundColor: "white", padding: "1rem" }}>
      <FormSubtitle variant="h6" component="h3" align="center">
        Missä kieliversiossa haluat kurssin näkyvän?
      </FormSubtitle>
      <FieldArray
        name="course_translations"
        render={helpers => (
          <ButtonGroupContainer
            color="secondary"
            aria-label="course language select button group"
            id={`course_translations`}
          >
            <StyledLanguageButton
              onClick={() =>
                helpers.push({ language: "fi_FI", ...initialTranslation })
              }
            >
              Suomi
            </StyledLanguageButton>
            <StyledLanguageButton>Englanti</StyledLanguageButton>
            <StyledLanguageButton>Molemmat</StyledLanguageButton>
          </ButtonGroupContainer>
        )}
      />
      <CourseTranslationEditForm
        values={values.course_translations}
        errors={errors.course_translations}
        isSubmitting={isSubmitting}
      />
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("courseDetails")}
      </FormSubtitle>
      <FormFieldGroup>
        <StyledField
          id="input-course-name"
          style={{ width: "80%" }}
          name="name"
          type="text"
          label={t("courseName")}
          error={errors.name}
          autoComplete="off"
          variant="outlined"
          InputLabelProps={inputLabelProps}
          component={StyledTextField}
          required={true}
        />
        <StyledField
          id="input-teacher-in-charge-name"
          style={{ width: "80%" }}
          name="teacher_in_charge_name"
          type="text"
          error={errors.name}
          label={"Vastuuhenkilö"}
          InputLabelProps={inputLabelProps}
          autoComplete="off"
          variant="outlined"
          component={StyledTextField}
          required={true}
        />

        <StyledField
          id="input-course-slug"
          style={{ width: "80%" }}
          name="new_slug"
          type="text"
          label={t("courseSlug")}
          InputLabelProps={inputLabelProps}
          error={errors.new_slug}
          variant="outlined"
          autoComplete="off"
          component={StyledTextField}
          required={true}
        />
        <StyledHelperText>{t("courseSlugHelper")}</StyledHelperText>
        <StyledField
          style={{ width: "25%" }}
          name="ects"
          type="text"
          label={t("courseECTS")}
          InputLabelProps={inputLabelProps}
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
      <StyledField
        name="order"
        type="number"
        label={t("courseOrder")}
        error={errors.order}
        fullWidth
        autoComplete="off"
        variant="outlined"
        component={StyledTextField}
        style={{ width: "20%" }}
        InputLabelProps={inputLabelProps}
      />
      <StyledField
        label={t("courseModuleOrder")}
        name="study_module_order"
        type="number"
        error={errors.study_module_order}
        fullWidth
        autoComplete="off"
        variant="outlined"
        component={StyledTextField}
        style={{ width: "20%" }}
        InputLabelProps={inputLabelProps}
      />
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("courseTranslations")}
      </FormSubtitle>
      <CourseTranslationEditForm
        values={values.course_translations}
        errors={errors.course_translations}
        isSubmitting={isSubmitting}
      />
      <FormSubtitle
        variant="h6"
        component="h3"
        align="center"
        style={{ marginTop: "3rem" }}
      >
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
