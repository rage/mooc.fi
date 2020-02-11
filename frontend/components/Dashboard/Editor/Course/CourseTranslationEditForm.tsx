import React, { useContext } from "react"
import { Grid, MenuItem, Typography } from "@material-ui/core"
import { Field, FieldArray, getIn, FormikErrors } from "formik"
import { CourseTranslationFormValues } from "./types"
import { languages as languagesT, initialTranslation } from "./form-validation"
import { StyledTextField } from "/components/Dashboard/Editor/common"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import { LanguageEntry } from "/components/Surfaces/LanguageEntryGrid"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import { useConfirm } from "material-ui-confirm"

const CourseTranslationEditForm = ({
  values,
  errors,
  isSubmitting,
}: {
  values: CourseTranslationFormValues[]
  errors: (FormikErrors<CourseTranslationFormValues> | undefined)[] | undefined
  isSubmitting: boolean
}) => {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const languages = languagesT(t)
  const confirm = useConfirm()

  return (
    <section>
      <Grid container direction="column">
        <FieldArray
          name="course_translations"
          render={helpers => (
            <>
              {values?.map((_: any, index: number) => (
                <LanguageEntry item key={`translation-${index}`}>
                  <EntryContainer elevation={2}>
                    <Field
                      name={`course_translations[${index}].language`}
                      type="select"
                      label={t("courseLanguage")}
                      errors={[getIn(errors, `[${index}].language`)]}
                      fullWidth
                      variant="outlined"
                      select
                      autoComplete="off"
                      component={StyledTextField}
                    >
                      {languages.map(
                        (option: { value: string; label: string }) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ),
                      )}
                    </Field>
                    <Field
                      name={`course_translations[${index}].name`}
                      type="text"
                      label={t("courseName")}
                      error={getIn(errors, `[${index}].name`)}
                      fullWidth
                      autoComplete="off"
                      variant="outlined"
                      component={StyledTextField}
                    />
                    <Field
                      name={`course_translations[${index}].description`}
                      type="textarea"
                      label={t("courseDescription")}
                      error={getIn(errors, `[${index}].description`)}
                      fullWidth
                      multiline
                      rows={5}
                      autoComplete="off"
                      variant="outlined"
                      component={StyledTextField}
                    />
                    <Field
                      name={`course_translations[${index}].link`}
                      type="text"
                      label={t("courseLink")}
                      error={getIn(errors, `[${index}].link`)}
                      fullWidth
                      autoComplete="off"
                      variant="outlined"
                      component={StyledTextField}
                    />
                    <Field
                      name={`course_translations[${index}].open_university_course_code`}
                      type="text"
                      label={t("courseOpenCode")}
                      error={getIn(
                        errors,
                        `[${index}].open_university_course_code`,
                      )}
                      fullWidth
                      autoComplete="off"
                      variant="outlined"
                      component={StyledTextField}
                    />
                    <br />
                    <Grid container justify="flex-end">
                      <StyledButton
                        variant="contained"
                        disabled={isSubmitting}
                        color="secondary"
                        onClick={() =>
                          confirm({
                            title: t("confirmationAreYouSure"),
                            description: t("confirmationRemoveTranslation"),
                            confirmationText: t("confirmationYes"),
                            cancellationText: t("confirmationNo"),
                          }).then(() => helpers.remove(index))
                        }
                      >
                        {t("courseRemoveTranslation")}
                      </StyledButton>
                    </Grid>
                  </EntryContainer>
                </LanguageEntry>
              )) ?? (
                <EntryContainer elevation={2}>
                  <Typography variant="body1">
                    {t("courseAtLeastOneTranslation")}
                  </Typography>
                </EntryContainer>
              )}
              {values?.length < languages.length && (
                <FormSubmitButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  onClick={() => helpers.push({ ...initialTranslation })}
                >
                  {t("courseAddTranslation")}
                </FormSubmitButton>
              )}
            </>
          )}
        />
      </Grid>
    </section>
  )
}

export default CourseTranslationEditForm
