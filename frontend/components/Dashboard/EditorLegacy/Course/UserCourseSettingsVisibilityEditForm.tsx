import { useFormikContext } from "formik"

import {
  Autocomplete,
  Chip,
  FormControl,
  FormGroup,
  TextField,
} from "@mui/material"

import {
  CourseFormValues,
  UserCourseSettingsVisibilityFormValues,
} from "./types"

const isString = (
  value: UserCourseSettingsVisibilityFormValues | string,
): value is string => typeof value === "string"

const UserCourseSettingsVisibilityEditForm = () => {
  const {
    errors: { user_course_settings_visibilities: errors },
    values: { user_course_settings_visibilities: values },
    isSubmitting,
    setFieldValue,
  } = useFormikContext<CourseFormValues>()

  return (
    <section>
      <FormControl>
        <FormGroup>
          <section style={{ display: "inline-block" }}>
            <Autocomplete
              multiple
              freeSolo
              disabled={isSubmitting}
              disableClearable
              options={values}
              value={values}
              onChange={(_, newValue) =>
                setFieldValue(
                  "user_course_settings_visibilities",
                  newValue.map((v) => (isString(v) ? { language: v } : v)),
                )
              }
              renderTags={(_, getTagProps) => {
                return values.map((field, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    variant="outlined"
                    label={field.language}
                    onDelete={() =>
                      setFieldValue(
                        "user_course_settings_visibilities",
                        values.filter((_, _index: number) => index !== _index),
                      )
                    }
                  />
                ))
              }}
              renderInput={(params) => (
                <TextField {...params} error={Boolean(errors)} />
              )}
            />
          </section>
        </FormGroup>
      </FormControl>
    </section>
  )
}
export default UserCourseSettingsVisibilityEditForm
