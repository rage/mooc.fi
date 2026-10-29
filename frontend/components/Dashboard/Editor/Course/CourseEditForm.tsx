import React, { useEffect } from "react"

import { useFieldArray } from "react-hook-form"

import { styled } from "@mui/material/styles"

import { TabSection } from "../Common"
import { ControlledHiddenField } from "../Common/Fields"
import CourseAdvancedOptionsForm from "./CourseAdvancedOptionsForm"
import CourseAliasForm from "./CourseAliasForm"
import { useCourseEditorData } from "./CourseEditorDataContext"
import CourseEditorTabs from "./CourseEditorTabs"
import CourseImageForm from "./CourseImageForm"
import CourseInfoForm from "./CourseInfoForm"
import CourseLanguageSelector, {
  useLanguageTagSync,
} from "./CourseLanguageSelector"
import CourseStatusForm from "./CourseStatusForm"
import CourseTagsForm from "./CourseTagsForm"
import CourseTranslationForm from "./CourseTranslationForm"
import CourseVariantForm from "./CourseVariantForm"
import { CourseFormValues } from "./types"
import UserCourseSettingsVisibilityForm from "./UserCourseSettingsVisibilityForm"
import DisableAutoComplete from "/components/DisableAutoComplete"

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
  const translations = useFieldArray<CourseFormValues, "course_translations">({
    name: "course_translations",
  })
  const syncLanguageTag = useLanguageTagSync()

  useEffect(() => {
    if (!defaultValues.id) {
      defaultValues.course_translations.forEach(({ language }) =>
        syncLanguageTag(language, true),
      )
    }
  }, [])

  return (
    <>
      <DisableAutoComplete key="disableautocomplete" />
      <CourseEditorTabs />
      <StyledTabSection
        tab={0}
        name="editor-tabpanel-0"
        aria-labelledby="editor-tab-0"
      >
        <ControlledHiddenField name="id" />
        <ControlledHiddenField name="slug" />
        <CourseLanguageSelector translations={translations} />
        <CourseTranslationForm fields={translations.fields} />
        <SelectLanguageFirstCover covered={translations.fields.length === 0}>
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
