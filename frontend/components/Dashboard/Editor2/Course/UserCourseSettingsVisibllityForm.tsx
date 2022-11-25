import { omit } from "lodash"
import { Controller, useFormContext } from "react-hook-form"

import { Autocomplete, Chip, TextField } from "@mui/material"

import { UserCourseSettingsVisibilityFormValues } from "/components/Dashboard/Editor2/Course/types"

const isString = (
  value: UserCourseSettingsVisibilityFormValues | string,
): value is string => typeof value === "string"

export default function UserCourseSettingsVisibilityForm() {
  const { control, setValue, getValues } = useFormContext()

  return (
    <Controller
      name="user_course_settings_visibilities"
      control={control}
      render={(renderProps) => (
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
          onChange={(
            _,
            newValue: (string | UserCourseSettingsVisibilityFormValues)[],
          ) =>
            setValue(
              "user_course_settings_visibilities",
              newValue.map((v: any) => (isString(v) ? { language: v } : v)),
              { shouldDirty: true },
            )
          }
          renderTags={(value, getTagProps) =>
            value.map(
              (field: UserCourseSettingsVisibilityFormValues, index) => (
                <Chip
                  {...getTagProps({ index })}
                  variant="outlined"
                  label={field.language}
                  onDelete={() =>
                    setValue(
                      "user_course_settings_visibilities",
                      getValues("user_course_settings_visibilities").filter(
                        (_: any, _index: number) => index !== _index,
                      ),
                      { shouldDirty: true },
                    )
                  }
                />
              ),
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="languages where user count is visible"
            />
          )}
        />
      )}
    />
  )
}
