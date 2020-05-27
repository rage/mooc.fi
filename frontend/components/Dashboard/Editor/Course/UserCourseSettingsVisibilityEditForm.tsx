import React, { useContext } from "react"
import { CourseFormValues } from "/components/Dashboard/Editor/Course/types"
import { FieldArray, getIn, useFormikContext } from "formik"
import LanguageContext from "/contexes/LanguageContext"
import { useConfirm } from "material-ui-confirm"
import getCoursesTranslator from "/translations/courses"
import {
  StyledFieldWithAnchor,
  StyledTextField,
  inputLabelProps,
} from "/components/Dashboard/Editor/common"
import { FormControl, FormGroup, Typography } from "@material-ui/core"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import styled from "styled-components"
import ChipInput from "material-ui-chip-input"

const ButtonWithWhiteText = styled(StyledButton)`
  color: white;
`

const UserCourseSettingsVisibilityEditForm = () => {
  const {
    errors: { user_course_settings_visibilities: errors },
    values: { user_course_settings_visibilities: values },
    isSubmitting,
  } = useFormikContext<CourseFormValues>()
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const confirm = useConfirm()

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
                      <ChipInput
                        label="languages where user count is visible"
                        value={values}
                        error={false}
                        onAdd={(v: string) => helpers.push(v)}
                        onDelete={(v: string) =>
                          helpers.remove(values.findIndex((t) => t === v))
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

/*
                  <StyledFieldWithAnchor
                    id={`user_course_settings_visibilities`}
                    name={`user_course_settings_visibilities`}
                    type="text"
                    component={() => (
                      <ChipInput
                        type="text"
                        label="languages user count is visible"
                        value={values}
                        error={false}
                        onAdd={(v: string) => helpers.push(v)}
                        onDelete={(v: string) => helpers.remove(values.findIndex(t => t === v))}
                      />
                    )}
                  />
*/
export default UserCourseSettingsVisibilityEditForm
