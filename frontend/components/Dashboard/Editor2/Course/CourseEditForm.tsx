import { useFormContext } from "react-hook-form"
import { CourseFormValues } from "/components/Dashboard/Editor2/Course/types"
import { useEditorContext } from "/components/Dashboard/Editor2/EditorContext"
import { Tabs, Tab, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@material-ui/core"
import {
  ControlledHiddenField,
  ControlledTextField,
  ControlledDatePicker,
  ControlledImageInput,
  ControlledModuleList,
  ControlledCheckbox,
  FormFieldGroup,
  FieldController
} from "/components/Dashboard/Editor2/FormFields"
import CourseTranslationForm from "./CourseTranslationForm"
import DisableAutoComplete from "/components/DisableAutoComplete"
import { EnumeratingAnchor } from "/components/Dashboard/Editor/common"
import { PropsWithChildren, useState } from "react"
import { omit } from "lodash"
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
import { Translator } from "/translations"
import CommonTranslations from "/translations/common"

interface TabSectionProps {
  currentTab: number
  tab: number
}

const TabSection = ({
  currentTab,
  tab,
  children,
  ...props
}: PropsWithChildren<TabSectionProps> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => (
  <section
    style={{
      ...(currentTab !== tab ? { display: "none" } : {}),
      ...(props as any)?.style,
    }}
    {...omit(props, "style")}
  >
    {children}
  </section>
)


const SelectLanguageFirstCover = styled.div<{ covered: boolean }>`
  ${(props) => `opacity: ${props.covered ? `0.2` : `1`}`}
`

interface CourseEditFormProps {
  course: CourseDetails_course
  studyModules?: CourseEditorStudyModules_study_modules[]
}


export const statusesT = (t: Translator<any>) => [
  {
    value: CourseStatus.Upcoming,
    label: t("courseUpcoming"),
  },
  {
    value: CourseStatus.Active,
    label: t("courseActive"),
  },
  {
    value: CourseStatus.Ended,
    label: t("courseEnded"),
  },
]

export default function CourseEditForm({
  course,
  studyModules
}: CourseEditFormProps) {
  const t = useTranslator(CoursesTranslations, CommonTranslations)
  const { onSubmit, onError, tab, setTab, initialValues } = useEditorContext<CourseFormValues>()
  const { handleSubmit, watch, setValue } = useFormContext()
  const statuses = statusesT(t)

  const [selectedLanguage, setSelectedLanguage] = useState(
    initialValues?.course_translations.length === 0
      ? ""
      : initialValues?.course_translations.length == 2
        ? "both"
        : initialValues?.course_translations[0].language,
  )

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>

      <EditorContainer<CourseFormValues>>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          style={{ backgroundColor: "white", padding: "2rem" }}
          autoComplete="none"
        >
          <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
            <Tab label="Course info" value={0} />
          </Tabs>
          <TabSection
            currentTab={tab}
            tab={0}
            style={{ paddingTop: "0.5rem" }}
          >
            <DisableAutoComplete />
            <ControlledHiddenField name="id" defaultValue={watch("id")} />
            <ControlledHiddenField name="slug" defaultValue={watch("slug")} />
            <CourseLanguageSelector
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
            />
            <CourseTranslationForm />
            <SelectLanguageFirstCover covered={selectedLanguage === ""}>
              <ControlledTextField
                name="name"
                label={t("courseName")}
                required={true}
              />
              <ControlledTextField
                name="new_slug"
                label={t("courseSlug")}
                required={true}
                tip="A helpful text"
              />
              <ControlledTextField name="ects" label={t("courseECTS")} />
              <ControlledDatePicker
                name="start_date"
                label={t("courseStartDate")}
                required={true}
              />
              <ControlledDatePicker
                name="end_date"
                label={t("courseEndDate")}
                validateOtherFields={["start_date"]}
              />
              <ControlledTextField
                name="teacher_in_charge_name"
                label={t("courseTeacherInChargeName")}
                required={true}
              />
              <ControlledTextField
                name="teacher_in_charge_email"
                label={t("courseTeacherInChargeEmail")}
                required={true}
              />
              <ControlledTextField
                name="support_email"
                label={t("courseSupportEmail")}
              />
              <FormControl component="fieldset">
                <FormLabel component="legend" style={{ color: "#DF7A46" }}>
                  {t("courseStatus")}*
            </FormLabel>
                <EnumeratingAnchor id="status" />
                <FieldController
                  name="status"
                  label={t("courseStatus")}
                  renderComponent={({ value }) => (
                    <RadioGroup
                      aria-label="course status"
                      value={value}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) =>
                        setValue(
                          "status",
                          (event.target as HTMLInputElement).value,
                          { shouldDirty: true },
                        )
                      }
                    >
                      {statuses.map(
                        (option: { value: string; label: string }) => (
                          <FormControlLabel
                            key={`status-${option.value}`}
                            value={option.value}
                            control={<Radio />}
                            label={option.label}
                          />
                        ),
                      )}
                    </RadioGroup>
                  )}
                />
              </FormControl>
              <ControlledModuleList
                name="study_modules"
                label={t("courseModules")}
                modules={studyModules}
              />
              <ControlledImageInput
                name="new_photo"
                label={t("courseNewPhoto")}
              />
              <FormFieldGroup>
                <FormControl>
                  <FormLabel>{t("courseProperties")}</FormLabel>
                  <ControlledCheckbox
                    name="promote"
                    label={t("coursePromote")}
                  />
                  <ControlledCheckbox
                    name="start_point"
                    label={t("courseStartPoint")}
                  />
                </FormControl>
              </FormFieldGroup>
            </SelectLanguageFirstCover>
          </TabSection>
        </form>
      </EditorContainer>
    </LocalizationProvider>
  )
} 