import { useCallback } from "react"

import { omit } from "lodash"
import { Controller, FieldValues, useFormContext } from "react-hook-form"

import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  Chip,
  TextField,
} from "@mui/material"

import { DefaultFieldRenderProps } from "../Common/Fields"
import { UserCourseSettingsVisibilityFormValues } from "/components/Dashboard/Editor2/Course/types"

const isString = (
  value: UserCourseSettingsVisibilityFormValues | string,
): value is string => typeof value === "string"

export default function UserCourseSettingsVisibilityForm() {
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
      renderProps: DefaultFieldRenderProps<
        FieldValues,
        "user_course_settings_visibilities"
      >,
    ) => (
      <Autocomplete
        {...omit(renderProps, ["formState", "fieldState"])}
        multiple={true}
        freeSolo={true}
        options={[] as string[]}
        value={
          renderProps.field
            ?.value /*?.map((f: UserCourseSettingsVisibilityFormValues) => f.language)*/ ??
          []
        }
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
