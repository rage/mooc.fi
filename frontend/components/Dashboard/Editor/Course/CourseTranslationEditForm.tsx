import React, { useState } from "react"
import { Grid, MenuItem, Typography } from "@material-ui/core"
import { Field, FieldArray, getIn, FormikErrors } from "formik"
import { CourseTranslationFormValues } from "./types"
import ConfirmationDialog from "/components/Dashboard/ConfirmationDialog"
import { languages, initialTranslation } from "./form-validation"
import { StyledTextField } from "/components/Dashboard/Editor/common"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import { LanguageEntry } from "/components/Surfaces/LanguageEntryGrid"

const CourseTranslationEditForm = ({
  values,
  errors,
  isSubmitting,
}: {
  values: CourseTranslationFormValues[]
  errors: (FormikErrors<CourseTranslationFormValues> | undefined)[] | undefined
  isSubmitting: boolean
}) => {
  const [removeDialogVisible, setRemoveDialogVisible] = useState(false)
  const [removableIndex, setRemovableIndex] = useState(-1)

  return (
    <section>
      <Grid container direction="column">
        <FieldArray
          name="course_translations"
          render={helpers => (
            <>
              <ConfirmationDialog
                title="Are you sure?"
                content="Do you want to remove this translation?"
                acceptText="Yes"
                rejectText="No"
                onAccept={() => {
                  setRemoveDialogVisible(false)
                  removableIndex >= 0 && helpers.remove(removableIndex)
                  setRemovableIndex(-1)
                }}
                onReject={() => {
                  setRemoveDialogVisible(false)
                  setRemovableIndex(-1)
                }}
                show={removeDialogVisible}
              />
              {values?.map((_: any, index: number) => (
                <LanguageEntry item key={`translation-${index}`}>
                  <EntryContainer elevation={2}>
                    <Field
                      name={`course_translations[${index}].language`}
                      type="select"
                      label="Language"
                      errors={[getIn(errors, `[${index}].language`)]}
                      fullWidth
                      variant="outlined"
                      select
                      autoComplete="off"
                      component={StyledTextField}
                    >
                      {languages.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                    <Field
                      name={`course_translations[${index}].name`}
                      type="text"
                      label="Name"
                      error={getIn(errors, `[${index}].name`)}
                      fullWidth
                      autoComplete="off"
                      variant="outlined"
                      component={StyledTextField}
                    />
                    <Field
                      name={`course_translations[${index}].description`}
                      type="textarea"
                      label="Description"
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
                      label="Link"
                      error={getIn(errors, `[${index}].link`)}
                      fullWidth
                      autoComplete="off"
                      variant="outlined"
                      component={StyledTextField}
                    />
                    <Field
                      name={`course_translations[${index}].open_university_course_code`}
                      type="text"
                      label="Open university course code"
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
                        onClick={() => {
                          setRemoveDialogVisible(true)
                          setRemovableIndex(index)
                        }}
                      >
                        Remove translation
                      </StyledButton>
                    </Grid>
                  </EntryContainer>
                </LanguageEntry>
              )) ?? (
                <EntryContainer elevation={2}>
                  <Typography variant="body1">
                    Please add at least one translation!
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
                  Add translation
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
