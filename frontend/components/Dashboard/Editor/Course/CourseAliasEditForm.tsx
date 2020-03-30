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
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import styled from "styled-components"
import { initialAlias } from "./form-validation"

const ButtonWithWhiteText = styled(StyledButton)`
  color: white;
`

const CourseAliasEditForm = () => {
  const {
    errors: { course_aliases: errors },
    values: { course_aliases: values },
    isSubmitting,
  } = useFormikContext<CourseFormValues>()
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const confirm = useConfirm()

  return (
    <section>
      <FormControl>
        <FormGroup>
          <FieldArray name="course_aliases">
            {(helpers) => (
              <>
                {values!.length ? (
                  values!.map((alias, index: number) => (
                    <section style={{ display: "inline-block" }}>
                      <StyledFieldWithAnchor
                        id={`course_aliases[${index}].course_code`}
                        name={`course_aliases[${index}].course_code`}
                        type="text"
                        component={StyledTextField}
                        value={alias.course_code}
                        label={t("courseAliasCourseCode")}
                        errors={[getIn(errors, `[${index}].course_code`)]}
                        variant="outlined"
                        InputLabelProps={inputLabelProps}
                        style={{ width: "70%" }}
                        required
                      />
                      <StyledButton
                        style={{ margin: "auto", width: "25%", float: "right" }}
                        variant="contained"
                        disabled={isSubmitting}
                        color="secondary"
                        onClick={() => {
                          if (!alias.id && alias.course_code === "") {
                            helpers.remove(index)
                          } else {
                            confirm({
                              title: t("confirmationAreYouSure"),
                              description: t("confirmationRemoveAlias"),
                              confirmationText: t("confirmationYes"),
                              cancellationText: t("confirmationNo"),
                            })
                              .then(() => helpers.remove(index))
                              .catch(() => {})
                          }
                        }}
                        endIcon={<RemoveIcon>{t("courseRemove")}</RemoveIcon>}
                      >
                        {t("courseRemove")}
                      </StyledButton>
                    </section>
                  ))
                ) : (
                  <Typography
                    variant="h3"
                    component="p"
                    align="center"
                    gutterBottom={true}
                  >
                    {t("courseNoAliases")}
                  </Typography>
                )}
                {(values!.length == 0 ||
                  (values!.length &&
                    values![values!.length - 1].course_code !== "")) && (
                  <section
                    style={{ justifyContent: "center", display: "flex" }}
                  >
                    <ButtonWithWhiteText
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={() => helpers.push({ ...initialAlias })}
                      endIcon={<AddIcon>{t("courseAdd")}</AddIcon>}
                      style={{ width: "45%" }}
                    >
                      {t("courseAdd")}
                    </ButtonWithWhiteText>
                  </section>
                )}
              </>
            )}
          </FieldArray>
        </FormGroup>
      </FormControl>
    </section>
  )
}

export default CourseAliasEditForm
