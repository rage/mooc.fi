import { useMemo } from "react"

import { FormGroup } from "@mui/material"

import { FormFieldGroup, FormSubtitleWithMargin } from "../Common"
import {
  ControlledCheckbox,
  ControlledSelect,
  ControlledTextField,
} from "../Common/Fields"
import { useEditorData } from "../EditorContext"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"

function CourseAdvancedOptionsForm() {
  const { course, courses } = useEditorData()
  const t = useTranslator(CoursesTranslations)
  const enableSuperSecret = useQueryParameter("secret", false)

  const sortedCourses = useMemo(
    () =>
      courses
        ?.filter((c) => c.id !== course?.id)
        .sort((a, b) => (a?.name < b?.name ? -1 : 1)) ?? [],
    [courses],
  )

  return (
    <>
      <FormFieldGroup>
        <ControlledTextField
          name="exercise_completions_needed"
          label={t("courseExerciseCompletionsNeeded")}
          type="number"
          defaultValue=""
          tip={t("helpExerciseCompletionsNeeded")}
        />
        <ControlledTextField
          name="points_needed"
          label={t("coursePointsNeeded")}
          type="number"
          defaultValue=""
          tip={t("helpPointsNeeded")}
        />
        <ControlledCheckbox
          name="automatic_completions"
          label={t("courseAutomaticCompletions")}
          tip={t("helpAutomaticCompletions")}
        />
        <ControlledCheckbox
          name="automatic_completions_eligible_for_ects"
          label={t("courseAutomaticCompletionsEligibleForEcts")}
          tip={t("helpCourseAutomaticCompletionsEligibleForEcts")}
        />
      </FormFieldGroup>
      {enableSuperSecret ? (
        <>
          <FormSubtitleWithMargin variant="h6" component="h3" align="center">
            Super secret values
          </FormSubtitleWithMargin>
          <FormFieldGroup>
            <FormGroup>
              <ControlledSelect
                name="completions_handled_by"
                label="completions handled by"
                items={sortedCourses}
              />
              <ControlledTextField name="tier" label="tier" type="number" />
              <ControlledSelect
                name="inherit_settings_from"
                label="inherit settings from"
                items={sortedCourses}
              />
            </FormGroup>
          </FormFieldGroup>
        </>
      ) : null}
    </>
  )
}

export default CourseAdvancedOptionsForm
