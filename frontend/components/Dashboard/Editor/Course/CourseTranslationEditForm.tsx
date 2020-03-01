import React, { useContext } from "react"

import { Grid, Typography } from "@material-ui/core"
import { FieldArray, useFormikContext } from "formik"
import { CourseTranslationFormValues, CourseFormValues } from "./types"

import { EntryContainer } from "/components/Surfaces/EntryContainer"
import { LanguageEntry } from "/components/Surfaces/LanguageEntryGrid"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"

import CourseTranslationListItem from "/components/Dashboard/Editor/Course/CourseTranslationListItem"
import styled from "styled-components"

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
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)

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
