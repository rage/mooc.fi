import { FieldArray, useFormikContext } from "formik"

import { Grid, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import CourseTranslationListItem from "./CourseTranslationListItem"
import { CourseFormValues, CourseTranslationFormValues } from "./types"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import { LanguageEntry } from "/components/Surfaces/LanguageEntryGrid"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"

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
                    <LanguageEntry item key={`translation-${value.language}`}>
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
