import React, { useCallback, useMemo, useState } from "react"

import {
  Form,
  Formik,
  FormikHelpers,
  useFormikContext,
  yupToFormErrors,
} from "formik"
import { useRouter } from "next/router"

import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"

import {
  CheckboxField,
  EnumeratingAnchor,
  FormSubtitle,
  inputLabelProps,
  StyledFieldWithAnchor,
  StyledTextField,
  TabSection,
} from "../common"
import FormWrapper from "../FormWrapper"
import CourseAliasEditForm from "./CourseAliasEditForm"
import CourseImageInput from "./CourseImageInput"
import CourseLanguageSelector from "./CourseLanguageSelector"
import CourseTranslationEditForm from "./CourseTranslationEditForm"
import CourseVariantEditForm from "./CourseVariantEditForm"
import DatePickerField from "./DatePickers"
import { CourseEditSchemaType, statuses as statusesT } from "./form-validation"
import { CourseFormValues } from "./types"
import UserCourseSettingsVisibilityEditForm from "./UserCourseSettingsVisibilityEditForm"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import CoursesTranslations from "/translations/courses"

import {
  EditorCourseOtherCoursesFieldsFragment,
  StudyModuleDetailedFieldsFragment,
} from "/graphql/generated"

interface CoverProps {
  covered: boolean
}
const SelectLanguageFirstCover = styled("div", {
  shouldForwardProp: (prop) => prop !== "covered",
})<CoverProps>`
  opacity: ${(props) => (props.covered ? 0.2 : 1)};
`

const ModuleList = styled(List)`
  padding: 0px;
  max-height: 400px;
  overflow: auto;
`

const ModuleListItem = styled(ListItem)`
  padding: 0px;
`

interface Labelprops {
  required?: boolean
}

export const StyledLabel = styled(InputLabel)<Labelprops>`
  margin-bottom: 0.3rem;
  color: ${(props) => (props.required ? "#DF7A46" : "#245B6D")};
`

export const FormFieldGroup = styled("div")`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  width: 90%;
  margin: 1rem auto 3rem auto;
  border-bottom: 4px dotted #98b0a9;
`

interface RenderFormProps {
  initialValues?: CourseFormValues
  courses?: EditorCourseOtherCoursesFieldsFragment[] | null
  studyModules?: StudyModuleDetailedFieldsFragment[] | null
}

interface RenderProps {
  tab: number
  setTab: React.Dispatch<React.SetStateAction<number>>
}

const CourseEditFormComponent = ({
  courses,
  studyModules,
  tab,
  setTab,
}: RenderFormProps & RenderProps) => {
  const { locale } = useRouter()
  const { errors, values, setFieldValue } = useFormikContext<CourseFormValues>()
  const secret = useQueryParameter("secret", { enforce: false })
  const t = useTranslator(CoursesTranslations, CommonTranslations)
  const statuses = statusesT(t)
  const [selectedLanguage, setSelectedLanguage] = useState(
    values?.course_translations.length === 0
      ? ""
      : values?.course_translations.length == 2
      ? "both"
      : values?.course_translations[0].language,
  )
  // @ts-ignore: for now
  const [enableSuperSecret] = useState(!!secret)
  const sortedCourses = useMemo(
    () =>
      courses
        ?.filter((c) => c.id !== values?.id)
        .sort((a, b) => (a?.name < b?.name ? -1 : 1)),
    [courses],
  )

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={locale}>
      <Form style={{ backgroundColor: "white", padding: "2rem" }}>
        {}
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
              name="name"
              type="text"
              label={t("courseName")}
              error={errors.name}
              autoComplete="off"
              variant="outlined"
              InputLabelProps={inputLabelProps}
              component={StyledTextField}
              required
            />
            <StyledFieldWithAnchor
              id="input-course-slug"
              name="new_slug"
              type="text"
              label={t("courseSlug")}
              InputLabelProps={inputLabelProps}
              error={errors.new_slug}
              variant="outlined"
              autoComplete="off"
              component={StyledTextField}
              required
              helperText={t("courseSlugHelper")}
            />
            <StyledFieldWithAnchor
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
              placeholder={t("courseDatePlaceholder")}
            />
            <StyledFieldWithAnchor
              id="end-date"
              name="end_date"
              label={t("courseEndDate")}
              as={DatePickerField}
              InputLabelProps={inputLabelProps}
              placeholder={t("courseDatePlaceholder")}
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
              required
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
              required
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

          <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
            <Tab label="Basic settings" value={0} />
            <Tab label="Advanced settings" value={1} />
          </Tabs>
          <TabSection currentTab={tab} tab={0}>
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
                      key={option.value}
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
                    {studyModules?.map((studyModule) => (
                      <ModuleListItem key={studyModule.id}>
                        <CheckboxField
                          id={`study_modules[${studyModule.id}]`}
                          label={studyModule.name}
                          checked={
                            values?.study_modules?.[studyModule.id] ?? false
                          }
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
                  <CheckboxField
                    id="promote"
                    label={t("coursePromote")}
                    checked={values.promote}
                  />
                  <CheckboxField
                    id="start_point"
                    label={t("courseStartPoint")}
                    checked={values.start_point}
                  />
                  <CheckboxField
                    id="study_module_start_point"
                    label={t("courseModuleStartPoint")}
                    checked={values.study_module_start_point}
                  />
                  <CheckboxField
                    id="hidden"
                    label={t("courseHidden")}
                    checked={values.hidden}
                  />
                  <CheckboxField
                    id="has_certificate"
                    label={t("courseHasCertificate")}
                    checked={values.has_certificate}
                  />
                  <CheckboxField
                    id="upcoming_active_link"
                    label={t("courseUpcomingActiveLink")}
                    checked={values.upcoming_active_link ?? false}
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
                InputLabelProps={inputLabelProps}
              />
            </FormFieldGroup>
          </TabSection>

          <TabSection currentTab={tab} tab={1}>
            <FormFieldGroup>
              <StyledFieldWithAnchor
                name="exercise_completions_needed"
                type="number"
                label={t("courseExerciseCompletionsNeeded")}
                error={errors.exercise_completions_needed}
                fullWidth
                autoComplete="off"
                variant="outlined"
                component={StyledTextField}
                style={{ width: "60%" }}
                InputLabelProps={inputLabelProps}
                tab={1}
              />
              <StyledFieldWithAnchor
                name="points_needed"
                type="number"
                label={t("coursePointsNeeded")}
                error={errors.points_needed}
                fullWidth
                autoComplete="off"
                variant="outlined"
                component={StyledTextField}
                style={{ width: "60%" }}
                InputLabelProps={inputLabelProps}
                tab={1}
              />
              <CheckboxField
                id="automatic_completions"
                label={t("courseAutomaticCompletions")}
                checked={values.automatic_completions ?? false}
              />
              <CheckboxField
                id="automatic_completions_eligible_for_ects"
                label={t("courseAutomaticCompletionsEligibleForEcts")}
                checked={
                  values.automatic_completions_eligible_for_ects ?? false
                }
              />
            </FormFieldGroup>
          </TabSection>
          {enableSuperSecret ? (
            <>
              <FormSubtitle
                variant="h6"
                component="h3"
                align="center"
                style={{ marginTop: "3rem " }}
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
                      {sortedCourses?.map((course) => (
                        <MenuItem
                          key={`handledby-${course.id}`}
                          value={course.id}
                        >
                          {course.name}
                        </MenuItem>
                      ))}
                    </StyledFieldWithAnchor>
                    <StyledFieldWithAnchor
                      name="tier"
                      type="number"
                      label="tier"
                      variant="outlined"
                      autoComplete="off"
                      component={StyledTextField}
                      error={errors.tier}
                      style={{ width: "20%" }}
                      InputLabelProps={inputLabelProps}
                    />
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
                      {sortedCourses?.map((course) => (
                        <MenuItem
                          key={`inheritfrom-${course.id}`}
                          value={course.id}
                        >
                          {course.name}
                        </MenuItem>
                      ))}
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
          <FormSubtitle
            variant="h6"
            component="h3"
            align="center"
            style={{ marginTop: "3rem" }}
          >
            {t("courseUserCourseSettingsVisibility")}
          </FormSubtitle>
          <UserCourseSettingsVisibilityEditForm />
        </SelectLanguageFirstCover>
      </Form>
    </LocalizationProvider>
  )
}

interface CourseEditFormProps {
  course: CourseFormValues
  studyModules?: StudyModuleDetailedFieldsFragment[]
  courses?: EditorCourseOtherCoursesFieldsFragment[]
  validationSchema: CourseEditSchemaType
  onSubmit: (
    values: CourseFormValues,
    FormikHelpers: FormikHelpers<CourseFormValues>,
  ) => void
  onCancel: () => void
  onDelete: (values: CourseFormValues) => void
}

function CourseEditForm({
  course,
  studyModules,
  courses,
  validationSchema,
  onSubmit,
  onCancel,
  onDelete,
}: CourseEditFormProps) {
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

  const [tab, setTab] = useState(0)

  return (
    <Formik
      initialValues={course}
      validate={validate}
      onSubmit={onSubmit}
      validateOnChange={false}
    >
      <FormWrapper<CourseFormValues>
        onCancel={onCancel}
        onDelete={onDelete}
        tab={tab}
        setTab={setTab}
      >
        <CourseEditFormComponent
          courses={courses}
          studyModules={studyModules}
          tab={tab}
          setTab={setTab}
        />
      </FormWrapper>
    </Formik>
  )
}

export default CourseEditForm
