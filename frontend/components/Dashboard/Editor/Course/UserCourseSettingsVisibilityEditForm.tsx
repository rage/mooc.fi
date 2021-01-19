import { CourseFormValues } from "/components/Dashboard/Editor/Course/types"
import { FieldArray, useFormikContext } from "formik"
import { StyledFieldWithAnchor } from "/components/Dashboard/Editor/common"
import { FormControl, FormGroup } from "@material-ui/core"
//import ChipInput from "material-ui-chip-input"

const UserCourseSettingsVisibilityEditForm = () => {
  const {
    errors: { user_course_settings_visibilities: errors },
    values: { user_course_settings_visibilities: values },
    isSubmitting,
  } = useFormikContext<CourseFormValues>()

  return (
    <section>
      <FormControl>
        <FormGroup>
          <FieldArray name="user_course_settings_visibilities">
            {(helpers) => (
              <>
                <section style={{ display: "inline-block" }}>
                  <StyledFieldWithAnchor
                    id={`user_course_settings_visibilities`}
                    name={`user_course_settings_visibilities`}
                    type="text"
                    component={() => (
                      <div />
  /*                    <ChipInput
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
                      />*/
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
