import { CourseTranslationFormValues, CourseFormValues } from "./types"
import CourseTranslationListItem from "/components/Dashboard/Editor/Course/CourseTranslationListItem"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import { LanguageEntry } from "/components/Surfaces/LanguageEntryGrid"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import styled from "@emotion/styled"
import { Grid, Typography } from "@mui/material"
import { FieldArray, useFormikContext } from "formik"

const AddTranslationNotice = styled(EntryContainer)`
  margin-bottom: 1rem;
  border: 1px solid #88732d;
  background-color: #88732d;
  color: white;
`

const CourseTranslationEditForm = () => {
  const {
    values: { course_translations: values },
  } = useFormikContext<CourseFormValues>()
  const t = useTranslator(CoursesTranslations)

  return (
    <section>
      <Grid container direction="column">
        <FieldArray name="course_translations">
          {() => (
            <>
              {values.length ? (
                values?.map(
                  (value: CourseTranslationFormValues, index: number) => (
                    <LanguageEntry item key={`translation-${index}`}>
                      <CourseTranslationListItem
                        index={index}
                        translationLanguage={value.language}
                      />
                    </LanguageEntry>
                  ),
                )
              ) : (
                <AddTranslationNotice elevation={1}>
                  <Typography variant="body1">
                    {t("courseAtLeastOneTranslation")}
                  </Typography>
                </AddTranslationNotice>
              )}
            </>
          )}
        </FieldArray>
      </Grid>
    </section>
  )
}

export default CourseTranslationEditForm
