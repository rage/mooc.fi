import {
  CourseFormValues,
  UserCourseSettingsVisibilityFormValues,
} from "/components/Dashboard/Editor/Course/types"
import {
  Autocomplete,
  Chip,
  FormControl,
  TextField,
  FormGroup,
} from "@mui/material"
import { useFormikContext } from "formik"

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
              options={[]}
              value={values as any}
              onChange={(_, newValue: any) =>
                setFieldValue(
                  "user_course_settings_visibilities",
                  newValue.map((v: any) => (isString(v) ? { language: v } : v)),
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
                        values.filter(
                          (_: any, _index: number) => index !== _index,
                        ),
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
