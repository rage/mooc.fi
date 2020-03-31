import React, { useCallback, useContext, useState, useMemo } from "react"
import {
  InputLabel,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  FormLabel,
  Radio,
  RadioGroup,
  FormGroup,
  MenuItem,
} from "@material-ui/core"
import {
  Formik,
  Field,
  Form,
  FormikHelpers,
  yupToFormErrors,
  useFormikContext,
} from "formik"

import { CheckboxWithLabel } from "formik-material-ui"
import * as Yup from "yup"
import CourseTranslationEditForm from "./CourseTranslationEditForm"
import CourseVariantEditForm from "./CourseVariantEditForm"
import CourseAliasEditForm from "./CourseAliasEditForm"
import CourseLanguageSelector from "./CourseLanguageSelector"
import CourseImageInput from "./CourseImageInput"
import { statuses as statusesT } from "./form-validation"
import { CourseFormValues } from "./types"
import styled from "styled-components"
import FormWrapper from "/components/Dashboard/Editor/FormWrapper"
import {
  StyledTextField,
  StyledFieldWithAnchor,
  EnumeratingAnchor,
  inputLabelProps,
} from "/components/Dashboard/Editor/common"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import DatePickerField from "./DatePickers"
import LuxonUtils from "@date-io/luxon"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import { CourseEditorCourses_courses } from "/static/types/generated/CourseEditorCourses"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"
import { FormSubtitle } from "/components/Dashboard/Editor/common"
import { useQueryParameter } from "/util/useQueryParameter"

interface CoverProps {
  covered: boolean
}
const SelectLanguageFirstCover = styled.div<CoverProps>`
  ${(props) => `opacity: ${props.covered ? `0.2` : `1`}`}
`
const ModuleList = styled(List)`
  padding: 0px;
  max-height: 400px;
  overflow: auto;
`

const ModuleListItem = styled(ListItem)<any>`
  padding: 0px;
`

interface Labelprops {
  required?: boolean
}
export const StyledLabel = styled(InputLabel)<Labelprops>`
  margin-bottom: 0.3rem;
  ${(props) => `color: ${props.required ? `#DF7A46` : `#245B6D`}`}
`

export const FormFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  width: 90%;
  margin: 1rem auto 3rem auto;
  border-bottom: 4px dotted #98b0a9;
`

interface RenderFormProps {
  initialValues?: CourseFormValues
  courses?: CourseEditorCourses_courses[]
  studyModules?: CourseEditorStudyModules_study_modules[]
}

const renderForm = ({ courses, studyModules }: RenderFormProps) => () => {
  const { errors, values, setFieldValue } = useFormikContext<CourseFormValues>()
  const secret = useQueryParameter("secret", false)
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
  // @ts-ignore: for now
  const [enableSuperSecret, setEnableSuperSecret] = useState(!!secret)
  const sortedCourses = useMemo(
    () =>
      courses
        ?.filter((c: CourseEditorCourses_courses) => c.id !== values?.id)
        .sort(
          (a: CourseEditorCourses_courses, b: CourseEditorCourses_courses) =>
            a?.name < b?.name ? -1 : 1,
        ),
    [courses],
  )

  return (
    <MuiPickersUtilsProvider utils={LuxonUtils}>
      <Form style={{ backgroundColor: "white", padding: "2rem" }}>
        <CourseLanguageSelector
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
        <CourseTranslationEditForm />
        <SelectLanguageFirstCover covered={selectedLanguage === ""}>
          <CourseImageInput courses={courses} />

          <FormSubtitle variant="h6" component="h3" align="center">
            {t("courseDetails")}
          </FormSubtitle>
          <FormFieldGroup>
            <StyledFieldWithAnchor
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
            <StyledFieldWithAnchor
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
            <StyledFieldWithAnchor
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
            <StyledFieldWithAnchor
              id="start-date"
              name="start_date"
              label={t("courseStartDate")}
              as={DatePickerField}
              required
              InputLabelProps={inputLabelProps}
              emptyLabel={t("courseDatePlaceholder")}
            />
            <StyledFieldWithAnchor
              id="end-date"
              name="end_date"
              label={t("courseEndDate")}
              as={DatePickerField}
              InputLabelProps={inputLabelProps}
              emptyLabel={t("courseDatePlaceholder")}
            />
          </FormFieldGroup>

          <FormFieldGroup>
            <StyledFieldWithAnchor
              id="input-teacher-in-charge-name"
              style={{ width: "80%" }}
              name="teacher_in_charge_name"
              type="text"
              error={errors.teacher_in_charge_name}
              label={t("courseTeacherInChargeName")}
              InputLabelProps={inputLabelProps}
              autoComplete="off"
              variant="outlined"
              component={StyledTextField}
              required={true}
            />
            <StyledFieldWithAnchor
              id="input-teacher-in-charge-email"
              style={{ width: "60%" }}
              name="teacher_in_charge_email"
              type="text"
              error={errors.teacher_in_charge_email}
              label={t("courseTeacherInChargeEmail")}
              InputLabelProps={inputLabelProps}
              autoComplete="off"
              variant="outlined"
              component={StyledTextField}
              required={true}
            />
            <StyledFieldWithAnchor
              id="support-email"
              style={{ width: "60%" }}
              name="support_email"
              type="text"
              error={errors.support_email}
              label={t("courseSupportEmail")}
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
              <EnumeratingAnchor id="status" />
              <RadioGroup
                aria-label="course status"
                name="status"
                value={values.status}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue(
                    "status",
                    (event.target as HTMLInputElement).value,
                  )
                }
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
                  <EnumeratingAnchor id="study_modules" />
                  {studyModules?.map(
                    (module: CourseEditorStudyModules_study_modules) => (
                      <ModuleListItem key={module.id}>
                        <Field
                          id={`study_modules[${module.id}]`}
                          label={module.name}
                          type="checkbox"
                          name={`study_modules[${module.id}]`}
                          checked={values?.study_modules?.[module.id]}
                          component={CheckboxWithLabel}
                          Label={{ label: module.name }}
                        />
                      </ModuleListItem>
                    ),
                  )}
                </ModuleList>
              </FormGroup>
            </FormControl>
          </FormFieldGroup>
          <FormFieldGroup>
            <FormControl>
              <FormLabel>{t("courseProperties")}</FormLabel>
              <FormGroup>
                <Field
                  id="promote"
                  label={t("coursePromote")}
                  type="checkbox"
                  name="promote"
                  checked={values.promote}
                  component={CheckboxWithLabel}
                  Label={{ label: t("coursePromote") }}
                />
                <Field
                  id="start_point"
                  label={t("courseStartPoint")}
                  type="checkbox"
                  name="start_point"
                  checked={values.start_point}
                  component={CheckboxWithLabel}
                  Label={{ label: t("courseStartPoint") }}
                />
                <Field
                  id="study_module_start_point"
                  label={t("courseModuleStartPoint")}
                  type="checkbox"
                  name="study_module_start_point"
                  checked={values.study_module_start_point}
                  component={CheckboxWithLabel}
                  Label={{ label: t("courseModuleStartPoint") }}
                />
                <Field
                  id="hidden"
                  label={t("courseHidden")}
                  type="checkbox"
                  name="hidden"
                  checked={values.hidden}
                  component={CheckboxWithLabel}
                  Label={{ label: t("courseHidden") }}
                />
              </FormGroup>
            </FormControl>
          </FormFieldGroup>
          <FormFieldGroup>
            <StyledFieldWithAnchor
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
            <StyledFieldWithAnchor
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
          {enableSuperSecret ? (
            <>
              <FormSubtitle
                variant="h6"
                component="h3"
                align="center"
                stlyle={{ marginTop: "3rem " }}
              >
                Super secret values
              </FormSubtitle>
              <FormFieldGroup>
                <FormControl>
                  <FormGroup>
                    <StyledFieldWithAnchor
                      name="completions_handled_by"
                      type="select"
                      label="completions handled by"
                      variant="outlined"
                      select
                      autoComplete="off"
                      component={StyledTextField}
                      InputLabelProps={inputLabelProps}
                    >
                      <MenuItem key="handledby-empty" value={undefined}>
                        (no choice)
                      </MenuItem>
                      {sortedCourses?.map(
                        (course: CourseEditorCourses_courses) => (
                          <MenuItem
                            key={`handledby-${course.id}`}
                            value={course.id}
                          >
                            {course.name}
                          </MenuItem>
                        ),
                      )}
                    </StyledFieldWithAnchor>
                    <StyledFieldWithAnchor
                      name="inherit_settings_from"
                      type="select"
                      label="inherit settings from"
                      variant="outlined"
                      select
                      autoComplete="off"
                      component={StyledTextField}
                      InputLabelProps={inputLabelProps}
                    >
                      <MenuItem key="inheritfrom-empty" value={undefined}>
                        (no choice)
                      </MenuItem>
                      {sortedCourses?.map(
                        (course: CourseEditorCourses_courses) => (
                          <MenuItem
                            key={`inheritfrom-${course.id}`}
                            value={course.id}
                          >
                            {course.name}
                          </MenuItem>
                        ),
                      )}
                    </StyledFieldWithAnchor>
                  </FormGroup>
                </FormControl>
              </FormFieldGroup>
            </>
          ) : null}
          <FormSubtitle
            variant="h6"
            component="h3"
            align="center"
            style={{ marginTop: "3rem" }}
          >
            {t("courseVariantsTitle")}
          </FormSubtitle>
          <CourseVariantEditForm />
          <FormSubtitle
            variant="h6"
            component="h3"
            align="center"
            style={{ marginTop: "3rem" }}
          >
            {t("courseAliasesTitle")}
          </FormSubtitle>
          <CourseAliasEditForm />
        </SelectLanguageFirstCover>
      </Form>
    </MuiPickersUtilsProvider>
  )
}

const CourseEditForm = React.memo(
  ({
    course,
    studyModules,
    courses,
    validationSchema,
    onSubmit,
    onCancel,
    onDelete,
  }: {
    course: CourseFormValues
    studyModules?: CourseEditorStudyModules_study_modules[]
    courses?: CourseEditorCourses_courses[]
    validationSchema: Yup.ObjectSchema
    onSubmit: (
      values: CourseFormValues,
      FormikHelpers: FormikHelpers<CourseFormValues>,
    ) => void
    onCancel: () => void
    onDelete: (values: CourseFormValues) => void
  }) => {
    const validate = useCallback(async (values: CourseFormValues) => {
      try {
        await validationSchema.validate(values, {
          abortEarly: false,
          context: { values },
        })
      } catch (e) {
        return yupToFormErrors(e)
      }
    }, [])

    return (
      <Formik initialValues={course} validate={validate} onSubmit={onSubmit}>
        <FormWrapper<CourseFormValues>
          renderForm={renderForm({
            initialValues: course,
            courses,
            studyModules,
          })}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </Formik>
    )
  },
)

export default CourseEditForm
