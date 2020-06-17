import React from "react"
import { CourseFormValues } from "/components/Dashboard/Editor/Course/types"
import { FieldArray, useFormikContext } from "formik"
import { StyledFieldWithAnchor } from "/components/Dashboard/Editor/common"
import { FormControl, FormGroup } from "@material-ui/core"
import ChipInput from "material-ui-chip-input"

const UserCourseSettingsVisibilityEditForm = () => {
  const {
    errors: { user_course_settings_visibility: errors },
    values: { user_course_settings_visibility: values },
    isSubmitting,
  } = useFormikContext<CourseFormValues>()

  return (
    <section>
      <FormControl>
        <FormGroup>
          <FieldArray name="user_course_settings_visibility">
            {(helpers) => (
              <>
                <section style={{ display: "inline-block" }}>
                  <StyledFieldWithAnchor
                    id={`user_course_settings_visibility`}
                    name={`user_course_settings_visibility`}
                    type="text"
                    component={() => (
                      <ChipInput
                        label="languages where user count is visible"
                        value={values.map((v) => v.language)}
                        variant="outlined"
                        error={(errors && errors.length > 0) || false}
                        disabled={isSubmitting}
                        onAdd={(v: string) => helpers.push({ language: v })}
                        onDelete={(v: string) =>
                          helpers.remove(
                            values.findIndex((t) => t.language === v),
                          )
                        }
                      />
                    )}
                  />
                </section>
              </>
            )}
          </FieldArray>
        </FormGroup>
      </FormControl>
    </section>
  )
}
export default UserCourseSettingsVisibilityEditForm
