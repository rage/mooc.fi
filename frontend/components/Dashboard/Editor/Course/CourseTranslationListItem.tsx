import React, { useContext } from "react"
import { getIn, useFormikContext } from "formik"
import {
  StyledTextField,
  StyledFieldWithAnchor,
} from "/components/Dashboard/Editor/common"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import { mapLangToLanguage } from "/components/DataFormatFunctions"
import { CourseFormValues } from "/components/Dashboard/Editor/Course/types"

const LanguageVersionContainer = styled.div`
  padding-top: 1rem;

  padding-bottom: 1.5rem;
  width: 90%;
  margin: auto;
`

const LanguageVersionTitle = styled(Typography)<any>`
  margin-bottom: 1.5rem;
  font-size: 33px;
  line-height: 52px;
  color: #005b5b;
`

const inputLabelProps = {
  fontSize: 16,
  shrink: true,
  classes: { root: "input-label", required: "input-required" },
}

interface Props {
  index: number
  translationLanguage: string
}
const CourseTranslationListItem = (props: Props) => {
  const {
    errors: { course_translations: errors },
  } = useFormikContext<CourseFormValues>()

  const { index, translationLanguage } = props

  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)

  return (
    <LanguageVersionContainer>
      <LanguageVersionTitle component="h2" variant="h3" align="left">
        {`${t("courseLanguageVersion")}: ${
          mapLangToLanguage[translationLanguage]
        }`}
      </LanguageVersionTitle>
      <StyledFieldWithAnchor
        id={`course_translations[${index}].name`}
        name={`course_translations[${index}].name`}
        label={t("courseName")}
        InputLabelProps={inputLabelProps}
        type="text"
        error={getIn(errors, `[${index}].name`)}
        fullWidth
        required
        autoComplete="off"
        variant="outlined"
        component={StyledTextField}
      />
      <StyledFieldWithAnchor
        id={`course_translations[${index}].description`}
        name={`course_translations[${index}].description`}
        type="textarea"
        label={t("courseDescription")}
        InputLabelProps={inputLabelProps}
        error={getIn(errors, `[${index}].description`)}
        fullWidth
        multiline
        rows={5}
        autoComplete="off"
        variant="outlined"
        component={StyledTextField}
      />
      <StyledFieldWithAnchor
        id={`course_translations[${index}].link`}
        name={`course_translations[${index}].link`}
        type="text"
        label={t("courseLink")}
        InputLabelProps={inputLabelProps}
        error={getIn(errors, `[${index}].link`)}
        fullWidth
        autoComplete="off"
        variant="outlined"
        component={StyledTextField}
      />
      <StyledFieldWithAnchor
        label={t("courseOpenCode")}
        InputLabelProps={inputLabelProps}
        id={`course_translations[${index}].open_university_course_link.course_code`}
        name={`course_translations[${index}].open_university_course_link.course_code`}
        type="text"
        error={getIn(
          errors,
          `[${index}].open_university_course_link.course_code`,
        )}
        fullWidth
        autoComplete="off"
        variant="outlined"
        component={StyledTextField}
        style={{ width: "70%" }}
      />
      <StyledFieldWithAnchor
        label={t("courseOpenLink")}
        InputLabelProps={inputLabelProps}
        id={`course_translations[${index}].open_university_course_link.link`}
        name={`course_translations[${index}].open_university_course_link.link`}
        type="text"
        error={getIn(errors, `[${index}].open_university_course_link.link`)}
        fullWidth
        autoComplete="off"
        variant="outlined"
        component={StyledTextField}
        style={{ width: "70%" }}
      />
    </LanguageVersionContainer>
  )
}

export default CourseTranslationListItem
