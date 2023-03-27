import React, { useCallback, useState } from "react"

import { Tab, Tabs } from "@mui/material"
import { styled } from "@mui/material/styles"

import { TabSection } from "../Common"
import { ControlledHiddenField } from "../Common/Fields"
import CourseAdvancedOptionsForm from "./CourseAdvancedOptionsForm"
import CourseAliasForm from "./CourseAliasForm"
import { useCourseEditorData } from "./CourseEditorDataContext"
import CourseImageForm from "./CourseImageForm"
import CourseInfoForm from "./CourseInfoForm"
import CourseLanguageSelector from "./CourseLanguageSelector"
import CourseStatusForm from "./CourseStatusForm"
import CourseTagsForm from "./CourseTagsForm"
import CourseTranslationForm from "./CourseTranslationForm"
import CourseVariantForm from "./CourseVariantForm"
import UserCourseSettingsVisibilityForm from "./UserCourseSettingsVisibllityForm"
import {
  useEditorContext,
  useEditorMethods,
} from "/components/Dashboard/Editor/EditorContext"
import DisableAutoComplete from "/components/DisableAutoComplete"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import CoursesTranslations from "/translations/courses"

const SelectLanguageFirstCover = styled("div", {
  shouldForwardProp: (prop) => prop !== "covered",
})<{ covered: boolean }>`
  opacity: ${(props) => (props.covered ? 0.2 : 1)};
`
const StyledTabSection = styled(TabSection)`
  padding-top: 0.5rem;
` as typeof TabSection

function CourseEditForm() {
  const { courses, defaultValues } = useCourseEditorData()
  const t = useTranslator(CoursesTranslations, CommonTranslations)
  const { tab } = useEditorContext()
  const { setTab } = useEditorMethods()

  const [selectedLanguage, setSelectedLanguage] = useState(
    defaultValues?.course_translations.length === 0
      ? ""
      : defaultValues?.course_translations.length == 2
      ? "both"
      : defaultValues?.course_translations[0].language,
  )

  const onChangeTab = useCallback(
    (_: any, newTab: any) => setTab(newTab),
    [setTab],
  )

  return (
    <>
      <DisableAutoComplete key="disableautocomplete" />
      <Tabs key="tabs" variant="fullWidth" value={tab} onChange={onChangeTab}>
        <Tab
          label={t("tabCourseInfo")}
          value={0}
          id="editor-tab-0"
          aria-controls="editor-tabpanel-0"
        />
        <Tab
          label={t("tabCourseStatus")}
          value={1}
          id="editor-tab-1"
          aria-controls="editor-tabpanel-1"
        />
        <Tab
          label={t("tabCourseAdvanced")}
          value={2}
          id="editor-tab-2"
          aria-controls="editor-tabpanel-2"
        />
      </Tabs>
      <StyledTabSection
        tab={0}
        name="editor-tabpanel-0"
        aria-labelledby="editor-tab-0"
      >
        <ControlledHiddenField name="id" />
        <ControlledHiddenField name="slug" />
        <CourseLanguageSelector
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
        <CourseTranslationForm key={selectedLanguage} />
        <SelectLanguageFirstCover covered={selectedLanguage === ""}>
          <CourseInfoForm />
          <CourseImageForm courses={courses} />
        </SelectLanguageFirstCover>
        <CourseTagsForm />
      </StyledTabSection>

      <StyledTabSection
        tab={1}
        name="editor-tabpanel"
        aria-labelledby="editor-tab-1"
      >
        <CourseStatusForm />
      </StyledTabSection>

      <TabSection tab={2} name="editor-tabpanel" aria-labelledby="editor-tab-2">
        <CourseAdvancedOptionsForm />
        <CourseVariantForm />
        <CourseAliasForm />
        <UserCourseSettingsVisibilityForm />
      </TabSection>
    </>
  )
}

export default CourseEditForm
