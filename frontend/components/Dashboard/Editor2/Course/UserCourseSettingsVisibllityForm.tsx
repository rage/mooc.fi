import { Autocomplete, Chip, TextField } from "@material-ui/core"
import { useFormContext, Controller } from "react-hook-form"
import { UserCourseSettingsVisibilityFormValues } from "/components/Dashboard/Editor2/Course/types"

const isString = (
  value: UserCourseSettingsVisibilityFormValues | string,
): value is string => typeof value === "string"

export function UserCourseSettingsVisibilityForm() {
  const { control, setValue, getValues } = useFormContext()

  return (
    <Controller
      name="user_course_settings_visibilities"
      control={control}
      render={(renderProps) => (
        <Autocomplete
          {...renderProps}
          multiple
          freeSolo
          options={[]}
          onChange={(
            _,
            newValue: (UserCourseSettingsVisibilityFormValues | string)[],
          ) =>
            setValue(
              "user_course_settings_visibilities",
              newValue.map((v) => (isString(v) ? { language: v } : v)),
            )
          }
          renderTags={(value, getTagProps) =>
            value.map((field, index) => (
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
                  )
                }
              />
            ))
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
