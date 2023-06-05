import { FieldArray, getIn, useFormikContext } from "formik"
import { useConfirm } from "material-ui-confirm"

import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { Button, FormControl, FormGroup, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  inputLabelProps,
  StyledFieldWithAnchor,
  StyledTextField,
} from "../common"
import { initialAlias } from "./form-validation"
import { CourseFormValues } from "./types"
import { ButtonWithPaddingAndMargin } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"

const ButtonWithWhiteText = styled(ButtonWithPaddingAndMargin)`
  color: white;
  width: 100%;
`

const Row = styled("section")`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`

export const StyledButton = styled(Button)`
  margin: 0.25rem;
  height: 3rem;
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
                {values.length ? (
                  values.map((alias, index: number) => (
                    <Row key={alias.course_code}>
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
                        style={{ width: "100%" }}
                        required
                      />
                      <StyledButton
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
                              .catch(() => {
                                // ignore
                              })
                          }
                        }}
                        endIcon={<RemoveIcon>{t("courseRemove")}</RemoveIcon>}
                      >
                        {t("courseRemove")}
                      </StyledButton>
                    </Row>
                  ))
                ) : (
                  <Typography
                    variant="h3"
                    component="p"
                    align="center"
                    gutterBottom
                  >
                    {t("courseNoAliases")}
                  </Typography>
                )}
                {(values.length == 0 ||
                  (values.length > 0 &&
                    values[values.length - 1].course_code !== "")) && (
                  <section
                    style={{ justifyContent: "center", display: "flex" }}
                  >
                    <ButtonWithWhiteText
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={() => helpers.push({ ...initialAlias })}
                      endIcon={<AddIcon>{t("courseAdd")}</AddIcon>}
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
