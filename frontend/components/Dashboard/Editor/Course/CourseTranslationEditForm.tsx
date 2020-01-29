import React, { useState, useContext } from "react"
import { Grid, Typography } from "@material-ui/core"
import { FieldArray, FormikErrors } from "formik"
import { CourseTranslationFormValues } from "./types"
import ConfirmationDialog from "/components/Dashboard/ConfirmationDialog"
import { languages as languagesT, initialTranslation } from "./form-validation"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import { LanguageEntry } from "/components/Surfaces/LanguageEntryGrid"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import CourseTranslationListItem from "/components/Dashboard/Editor/Course/CourseTranslationListItem"

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
                title={t("confirmationAreYouSure")}
                content={t("confirmationRemoveTranslation")}
                acceptText={t("confirmationYes")}
                rejectText={t("confirmationNo")}
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
              {values ? (
                values.map((_: any, index: number) => (
                  <LanguageEntry item key={`translation-${index}`}>
                    <CourseTranslationListItem
                      index={index}
                      errors={errors}
                      isSubmitting={isSubmitting}
                      setRemoveDialogVisible={setRemoveDialogVisible}
                      setRemovableIndex={setRemovableIndex}
                      translationLanguage={_.language}
                    />
                  </LanguageEntry>
                ))
              ) : (
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
