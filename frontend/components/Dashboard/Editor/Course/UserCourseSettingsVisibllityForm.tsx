import { useCallback } from "react"

import { useController, useFormContext } from "react-hook-form"

import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  Chip,
  TextField,
} from "@mui/material"
import { useEventCallback } from "@mui/material/utils"

import { FormSubtitleWithMargin } from "../Common"
import { useAnchor } from "../EditorContext"
import {
  CourseFormValues,
  UserCourseSettingsVisibilityFormValues,
} from "./types"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"

const isString = (
  value: UserCourseSettingsVisibilityFormValues | string,
): value is string => typeof value === "string"

const options: readonly UserCourseSettingsVisibilityFormValues[] = []

function UserCourseSettingsVisibilityForm() {
  const t = useTranslator(CoursesTranslations)
  const { setValue, getValues } = useFormContext()
  const { field } = useController<
    CourseFormValues,
    "user_course_settings_visibilities"
  >({
    name: "user_course_settings_visibilities",
  })
  const anchor = useAnchor("user_course_settings_visibilities")

  const onChange = useEventCallback(
    (_: any, newValue: (string | UserCourseSettingsVisibilityFormValues)[]) =>
      setValue(
        "user_course_settings_visibilities",
        newValue.map((v: any) => (isString(v) ? { language: v } : v)),
        { shouldDirty: true },
      ),
  )

  const onDelete = useCallback(
    (index: number) => () =>
      setValue(
        "user_course_settings_visibilities",
        getValues("user_course_settings_visibilities").filter(
          (_: any, _index: number) => index !== _index,
        ),
        { shouldDirty: true },
      ),
    [setValue, getValues],
  )

  const renderTags = useCallback(
    (
      value: UserCourseSettingsVisibilityFormValues[],
      getTagProps: AutocompleteRenderGetTagProps,
    ) =>
      value.map((field, index) => (
        <Chip
          {...getTagProps({ index })}
          variant="outlined"
          label={field.language}
          onDelete={onDelete(index)}
        />
      )),
    [setValue, getValues],
  )

  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        {...params}
        inputRef={field.ref}
        variant="outlined"
        label="languages where user count is visible"
      />
    ),
    [field],
  )

  return (
    <>
      <FormSubtitleWithMargin variant="h6" component="h3" align="center">
        {t("courseUserCourseSettingsVisibility")}
      </FormSubtitleWithMargin>

      <Autocomplete
        multiple
        freeSolo
        ref={anchor.ref}
        options={options}
        value={field.value ?? []}
        onChange={onChange}
        renderTags={renderTags}
        renderInput={renderInput}
      />
    </>
  )
}

export default UserCourseSettingsVisibilityForm
