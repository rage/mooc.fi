import { FieldArray, getIn, useFormikContext } from "formik"
import { useConfirm } from "material-ui-confirm"

import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { Button, FormControl, FormGroup, Grid, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { initialVariant } from "./form-validation"
import { ButtonWithPaddingAndMargin } from "/components/Buttons/ButtonWithPaddingAndMargin"
import {
  inputLabelProps,
  StyledFieldWithAnchor,
  StyledTextField,
} from "/components/Dashboard/Editor/common"
import { CourseFormValues } from "/components/Dashboard/Editor/Course/types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

const ButtonWithWhiteText = styled(ButtonWithPaddingAndMargin)`
  color: white;
  width: 100%;
`

export const StyledButton = styled(Button)`
  margin: 0.25rem;
  height: 3rem;
`

const CourseVariantEditForm = () => {
  const {
    values: { course_variants: values },
    errors: { course_variants: errors },
    isSubmitting,
  } = useFormikContext<CourseFormValues>()

  const t = useTranslator(CoursesTranslations)
  const confirm = useConfirm()

  return (
    <section>
      <Grid item xs={12}>
        <FormControl>
          <FormGroup>
            <FieldArray name="course_variants">
              {(helpers) => (
                <>
                  {values.length ? (
                    values.map((variant, index: number) => (
                      <Grid container spacing={2} key={`variant-${index}`}>
                        <Grid item xs={2}>
                          <StyledFieldWithAnchor
                            id={`course_variants[${index}].slug`}
                            name={`course_variants[${index}].slug`}
                            type="text"
                            component={StyledTextField}
                            value={variant.slug}
                            label={t("courseSlug")}
                            errors={[getIn(errors, `[${index}].slug`)]}
                            variant="outlined"
                            InputLabelProps={inputLabelProps}
                            required
                          />
                        </Grid>
                        <Grid item xs={10}>
                          <StyledFieldWithAnchor
                            id={`course_variants[${index}].description`}
                            name={`course_variants[${index}].description`}
                            type="text"
                            component={StyledTextField}
                            value={variant.description}
                            label={t("courseDescription")}
                            errors={[getIn(errors, `[${index}].description`)]}
                            variant="outlined"
                            InputLabelProps={inputLabelProps}
                          />
                        </Grid>
                        <Grid item xs={10}>
                          <StyledFieldWithAnchor
                            id={`course_variants[${index}].instructions`}
                            name={`course_variants[${index}].instructions`}
                            type="text"
                            multiline
                            rows={6}
                            component={StyledTextField}
                            value={variant.instructions}
                            label={t("courseInstructions")}
                            errors={[getIn(errors, `[${index}].instructions`)]}
                            variant="outlined"
                            InputLabelProps={inputLabelProps}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Grid
                            container
                            justifyItems="flex-end"
                            alignItems="center"
                          >
                            <StyledButton
                              style={{ margin: "auto" }}
                              variant="contained"
                              disabled={isSubmitting}
                              color="secondary"
                              onClick={() => {
                                if (!variant.id && variant.slug === "") {
                                  helpers.remove(index)
                                } else {
                                  return confirm({
                                    title: t("confirmationAreYouSure"),
                                    description: t("confirmationRemoveVariant"),
                                    confirmationText: t("confirmationYes"),
                                    cancellationText: t("confirmationNo"),
                                  })
                                    .then(() => helpers.remove(index))
                                    .catch(() => {
                                      // ignore
                                    })
                                }
                              }}
                              endIcon={
                                <RemoveIcon>{t("courseRemove")}</RemoveIcon>
                              }
                            >
                              {t("courseRemove")}
                            </StyledButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))
                  ) : (
                    <Typography
                      variant="h3"
                      component="p"
                      align="center"
                      gutterBottom={true}
                    >
                      {t("courseNoVariants")}
                    </Typography>
                  )}
                  {(values.length === 0 ||
                    (values.length &&
                      values[values.length - 1].slug !== "")) && (
                    <Grid container justifyItems="center">
                      <ButtonWithWhiteText
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={() => helpers.push({ ...initialVariant })}
                        endIcon={<AddIcon>{t("courseAdd")}</AddIcon>}
                      >
                        {t("courseAdd")}
                      </ButtonWithWhiteText>
                    </Grid>
                  )}
                </>
              )}
            </FieldArray>
          </FormGroup>
        </FormControl>
      </Grid>
    </section>
  )
}

export default CourseVariantEditForm
