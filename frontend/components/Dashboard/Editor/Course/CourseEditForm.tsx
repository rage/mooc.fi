import React, { useCallback, useContext, useState } from "react"
import {
  InputLabel,
  FormControl,
  FormControlLabel,
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
  FormikActions,
  FormikProps,
  yupToFormErrors,
} from "formik"

import { Checkbox } from "formik-material-ui"
import * as Yup from "yup"
import CourseTranslationEditForm from "./CourseTranslationEditForm"
import CourseVariantEditForm from "./CourseVariantEditForm"
import CourseLanguageSelector from "./CourseLanguageSelector"
import CourseImageInput from "./CourseImageInput"
import { statuses as statusesT } from "./form-validation"
import { CourseFormValues } from "./types"
import styled from "styled-components"
import FormWrapper from "/components/Dashboard/Editor/FormWrapper"
import { StudyModules_study_modules } from "/static/types/generated/StudyModules"
import { StyledTextField } from "/components/Dashboard/Editor/common"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"

interface CoverProps {
  covered: boolean
}
const SelectLanguageFirtsCover = styled.div<CoverProps>`
  ${props => `opacity: ${props.covered ? `0.2` : `1`}`}
`
const ModuleList = styled(List)`
  padding: 0px;
  max-height: 400px;
  overflow: auto;
`

const ModuleListItem = styled(ListItem)<any>`
  padding: 0px;
`
export const FormSubtitle = styled(Typography)`
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

export const FormFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  width: 90%;
  margin: 1rem auto 3rem auto;
  border-bottom: 4px dotted #98b0a9;
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
  const [selectedLanguage, setSelectedLanguage] = useState(
    values?.course_translations.length === 0
      ? ""
      : values?.course_translations.length == 2
      ? "both"
      : values?.course_translations[0].language,
  )

  const [selectedState, setSelectedState] = useState<string>(values?.status)
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedState((event.target as HTMLInputElement).value)
  }

  return (
    <Form style={{ backgroundColor: "white", padding: "2rem" }}>
      <CourseLanguageSelector
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      <CourseTranslationEditForm
        values={values.course_translations}
        errors={errors.course_translations}
        isSubmitting={isSubmitting}
      />
      <SelectLanguageFirtsCover covered={selectedLanguage === ""}>
        <CourseImageInput
          values={values}
          errors={errors}
          setFieldValue={setFieldValue}
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
            id="input-course-slug"
            style={{ width: "40%" }}
            name="new_slug"
            type="text"
            label={t("courseSlug")}
            InputLabelProps={inputLabelProps}
            error={errors.new_slug}
            variant="outlined"
            autoComplete="off"
            component={StyledTextField}
            required={true}
            helperText={t("courseSlugHelper")}
          />
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
          <StyledField
            id="start-date"
            style={{ width: "50%" }}
            name="start_date"
            type="text"
            error={errors.start_date}
            label={"Alkamispäivä"}
            InputLabelProps={inputLabelProps}
            autoComplete="off"
            variant="outlined"
            component={StyledTextField}
            required={true}
            placeholder={t("courseDatePlaceholder")}
            helperText={t("courseDateHelper")}
          />
          <StyledField
            id="end-date"
            style={{ width: "50%" }}
            name="end_date"
            type="text"
            error={errors.end_date}
            label={"Loppumispäivä"}
            InputLabelProps={inputLabelProps}
            autoComplete="off"
            variant="outlined"
            component={StyledTextField}
            placeholder={t("courseDatePlaceholder")}
            helperText={t("courseDateHelper")}
          />
        </FormFieldGroup>
        <FormFieldGroup>
          <StyledField
            id="input-teacher-in-charge-name"
            style={{ width: "80%" }}
            name="teacher_in_charge_name"
            type="text"
            error={errors.teacher_in_charge_name}
            label={"Vastuuhenkilö"}
            InputLabelProps={inputLabelProps}
            autoComplete="off"
            variant="outlined"
            component={StyledTextField}
            required={true}
          />
          <StyledField
            id="input-teacher-in-charge-email"
            style={{ width: "50%" }}
            name="teacher_in_charge_email"
            type="text"
            error={errors.teacher_in_charge_email}
            label={"Vastuuhenkilön sähköposti"}
            InputLabelProps={inputLabelProps}
            autoComplete="off"
            variant="outlined"
            component={StyledTextField}
            required={true}
          />
          <StyledField
            id="support-email"
            style={{ width: "50%" }}
            name="support_email"
            type="text"
            error={errors.support_email}
            label={"Tukisähköposti"}
            InputLabelProps={inputLabelProps}
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
            <RadioGroup
              aria-label="course status"
              name="courseStatus"
              value={selectedState}
              onChange={handleStatusChange}
            >
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
        </FormFieldGroup>
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
      </SelectLanguageFirtsCover>
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
