import { useCallback } from "react"

import { omit } from "lodash"
import { Controller, FieldValues, useFormContext, UseControllerReturn } from "react-hook-form"

import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  Chip,
  TextField,
} from "@mui/material"

import { UserCourseSettingsVisibilityFormValues } from "./types"

const isString = (
  value: UserCourseSettingsVisibilityFormValues | string,
): value is string => typeof value === "string"

function UserCourseSettingsVisibilityForm() {
  const { control, setValue, getValues } = useFormContext()

  const onChange = useCallback(
    (_: any, newValue: (string | UserCourseSettingsVisibilityFormValues)[]) =>
      setValue(
        "user_course_settings_visibilities",
        newValue.map((v: any) => (isString(v) ? { language: v } : v)),
        { shouldDirty: true },
      ),
    [setValue],
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
    (value: any[], getTagProps: AutocompleteRenderGetTagProps) =>
      value.map((field: UserCourseSettingsVisibilityFormValues, index) => (
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
        variant="outlined"
        label="languages where user count is visible"
      />
    ),
    [],
  )

  const renderAutocomplete = useCallback(
    (
      renderProps: UseControllerReturn<
        FieldValues,
        "user_course_settings_visibilities"
      >,
    ) => (
      <Autocomplete
        {...omit(renderProps, ["formState", "fieldState"])}
        multiple
        freeSolo
        options={[] as string[]}
        value={renderProps.field?.value ?? []}
        onChange={onChange}
        renderTags={renderTags}
        renderInput={renderInput}
      />
    ),
    [onChange, renderTags, renderInput],
  )

  return (
    <Controller
      name="user_course_settings_visibilities"
      control={control}
      render={renderAutocomplete}
    />
  )
}

export default UserCourseSettingsVisibilityForm
