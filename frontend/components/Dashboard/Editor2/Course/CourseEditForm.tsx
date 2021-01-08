import { useFormContext } from "react-hook-form"
import { CourseFormValues } from "/components/Dashboard/Editor2/Course/types"
import { useEditorContext } from "/components/Dashboard/Editor2/EditorContext"
import { Tabs, Tab, FormControl, FormLabel, FormGroup } from "@material-ui/core"
import {
  ControlledHiddenField,
  ControlledTextField,
  ControlledImageInput,
  ControlledModuleList,
  ControlledCheckbox,
  ControlledSelect,
  FormFieldGroup,
  ControlledRadioGroup,
} from "/components/Dashboard/Editor2/FormFields"
import CourseTranslationForm from "./CourseTranslationForm"
import DisableAutoComplete from "/components/DisableAutoComplete"
import { useMemo, useState } from "react"
import EditorContainer from "/components/Dashboard/Editor2/EditorContainer"
import CourseLanguageSelector from "./CourseLanguageSelector"
import styled from "styled-components"
import LocalizationProvider from "@material-ui/lab/LocalizationProvider"
import AdapterLuxon from "@material-ui/lab/AdapterLuxon"
import { useTranslator } from "/util/useTranslator"
import CoursesTranslations from "/translations/courses"
import { CourseDetails_course } from "/static/types/generated/CourseDetails"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"
import { CourseStatus } from "/static/types/generated/globalTypes"
import CommonTranslations from "/translations/common"
import { FormSubtitle } from "../common"
import { useQueryParameter } from "/util/useQueryParameter"
import { CourseEditorCourses_courses } from "/static/types/generated/CourseEditorCourses"
import { TabSection } from "../common"

import CourseVariantForm from "/components/Dashboard/Editor2/Course/CourseVariantForm"
import CourseAliasForm from "/components/Dashboard/Editor2/Course/CourseAliasForm"
import UserCourseSettingsVisibilityForm from "/components/Dashboard/Editor2/Course/UserCourseSettingsVisibllityForm"
import CourseInfoForm from "./CourseInfoForm"

const SelectLanguageFirstCover = styled.div<{ covered: boolean }>`
  ${(props) => `opacity: ${props.covered ? `0.2` : `1`}`}
`

interface CourseEditFormProps {
  course: CourseDetails_course
  courses?: CourseEditorCourses_courses[]
  studyModules?: CourseEditorStudyModules_study_modules[]
}

export default function CourseEditForm({
  course,
  courses,
  studyModules,
}: CourseEditFormProps) {
  const t = useTranslator(CoursesTranslations, CommonTranslations)
  const { tab, setTab, initialValues } = useEditorContext<CourseFormValues>()
  const { watch } = useFormContext()
  const statuses = Object.keys(CourseStatus).map((value) => ({
    value,
    label: t(`course${value.toString()}` as any),
  }))

  const enableSuperSecret = useQueryParameter("secret", false)

  const [selectedLanguage, setSelectedLanguage] = useState(
    initialValues?.course_translations.length === 0
      ? ""
      : initialValues?.course_translations.length == 2
      ? "both"
      : initialValues?.course_translations[0].language,
  )
  const sortedCourses = useMemo(
    () =>
      courses
        ?.filter((c: CourseEditorCourses_courses) => c.id !== course?.id)
        .sort(
          (a: CourseEditorCourses_courses, b: CourseEditorCourses_courses) =>
            a?.name < b?.name ? -1 : 1,
        ),
    [courses],
  )

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <EditorContainer<CourseFormValues>>
        <Tabs
          variant="fullWidth"
          value={tab}
          onChange={(_, newTab) => setTab(newTab)}
        >
          <Tab label="Course info" value={0} />
          <Tab label="Course status" value={1} />
          <Tab label="Advanced" value={2} />
        </Tabs>
        <TabSection currentTab={tab} tab={0} style={{ paddingTop: "0.5rem" }}>
          <DisableAutoComplete />
          <ControlledHiddenField name="id" defaultValue={watch("id")} />
          <ControlledHiddenField name="slug" defaultValue={watch("slug")} />
          <CourseLanguageSelector
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
          <CourseTranslationForm />
          <SelectLanguageFirstCover covered={selectedLanguage === ""}>
            <ControlledImageInput
              name="new_photo"
              label={t("courseNewPhoto")}
            />
            <CourseInfoForm />
          </SelectLanguageFirstCover>
        </TabSection>

        <TabSection currentTab={tab} tab={1} style={{ paddingTop: "0.5rem" }}>
          <FormFieldGroup>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                style={{ color: watch("status") ? "default" : "#f44336" }}
              >
                {t("courseStatus")}
                {watch("status") ? "" : "*"}
              </FormLabel>
              <ControlledRadioGroup
                name="status"
                label={t("courseStatus")}
                options={statuses}
              />
            </FormControl>
          </FormFieldGroup>
          <FormFieldGroup>
            <ControlledModuleList
              name="study_modules"
              label={t("courseModules")}
              modules={studyModules}
            />
          </FormFieldGroup>
          <FormFieldGroup>
            <FormControl>
              <FormLabel>{t("courseProperties")}</FormLabel>
              <ControlledCheckbox name="promote" label={t("coursePromote")} />
              <ControlledCheckbox
                name="start_point"
                label={t("courseStartPoint")}
              />
              <ControlledCheckbox name="hidden" label={t("courseHidden")} />
              <ControlledCheckbox
                name="has_certificate"
                label={t("courseHasCertificate")}
              />
              <ControlledCheckbox
                name="upcoming_active_link"
                label={t("courseUpcomingActiveLink")}
              />
            </FormControl>
          </FormFieldGroup>

          <FormFieldGroup>
            <ControlledTextField
              name="order"
              label={t("courseOrder")}
              type="number"
            />
            <ControlledTextField
              name="study_module_order"
              label={t("courseModuleOrder")}
              type="number"
            />
          </FormFieldGroup>
        </TabSection>

        <TabSection currentTab={tab} tab={2}>
          <FormFieldGroup>
            <ControlledTextField
              name="exercise_completions_needed"
              label={t("courseExerciseCompletionsNeeded")}
              type="number"
            />
            <ControlledTextField
              name="points_needed"
              label={t("coursePointsNeeded")}
              type="number"
            />
            <ControlledCheckbox
              name="automatic_completions"
              label={t("courseAutomaticCompletions")}
            />
            <ControlledCheckbox
              name="automatic_completions_eligible_for_ects"
              label={t("courseAutomaticCompletionsEligibleForEcts")}
            />
          </FormFieldGroup>
          {enableSuperSecret ? (
            <>
              <FormSubtitle
                variant="h6"
                component="h3"
                align="center"
                style={{ marginTop: "3rem" }}
              >
                Super secret values
              </FormSubtitle>
              <FormFieldGroup>
                <FormGroup>
                  <ControlledSelect
                    name="completions_handled_by"
                    label="completions handled by"
                    items={sortedCourses ?? []}
                  />
                  <ControlledTextField name="tier" label="tier" type="number" />
                  <ControlledSelect
                    name="inherit_settings_from"
                    label="inherit settings from"
                    items={sortedCourses ?? []}
                  />
                </FormGroup>
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
          <CourseVariantForm />
          <FormSubtitle
            variant="h6"
            component="h3"
            align="center"
            style={{ marginTop: "3rem" }}
          >
            {t("courseAliasesTitle")}
          </FormSubtitle>
          <CourseAliasForm />
          <UserCourseSettingsVisibilityForm />
        </TabSection>
      </EditorContainer>
    </LocalizationProvider>
  )
}
