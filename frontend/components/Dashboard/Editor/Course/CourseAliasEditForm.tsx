import { FieldArray, getIn, useFormikContext } from "formik"
import { useConfirm } from "material-ui-confirm"

import styled from "@emotion/styled"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { FormControl, FormGroup, Typography } from "@mui/material"

import { initialAlias } from "./form-validation"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import {
  inputLabelProps,
  StyledFieldWithAnchor,
  StyledTextField,
} from "/components/Dashboard/Editor/common"
import { CourseFormValues } from "/components/Dashboard/Editor/Course/types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

const ButtonWithWhiteText = styled(StyledButton)`
  color: white;
`

const CourseAliasEditForm = () => {
  const {
    errors: { course_aliases: errors },
    values: { course_aliases: values },
    isSubmitting,
  } = useFormikContext<CourseFormValues>()
  const t = useTranslator(CoursesTranslations)
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
