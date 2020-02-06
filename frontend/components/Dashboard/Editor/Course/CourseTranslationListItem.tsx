import React, { useContext } from "react"
import MenuItem from "@material-ui/core/MenuItem"
import Grid from "@material-ui/core/Grid"

import { Field, getIn } from "formik"
import { StyledTextField } from "/components/Dashboard/Editor/common"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import { languages as languagesT } from "./form-validation"
import styled from "styled-components"
import { StyledLabel } from "./CourseEditForm"

const StyledField = styled(Field)`
  .input-label {
    background-color: white;
    font-size: 23px;
    padding-right: 7px;
    transform: translate(14px, -9px) scale(0.75);
  }
  .input-required {
    color: #df7a46;
  }
`
const inputLabelProps = {
  fontSize: 16,
  shrink: true,
  classes: { root: "input-label", required: "input-required" },
}

interface Props {
  index: number
  errors: any
  isSubmitting: boolean
  setRemoveDialogVisible: any
  setRemovableIndex: any
  translationLanguage: string
}
const CourseTranslationListItem = (props: Props) => {
  const {
    index,
    errors,
    isSubmitting,
    setRemoveDialogVisible,
    setRemovableIndex,
    translationLanguage,
  } = props

  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const languages = languagesT(t)
  console.log(translationLanguage)
  return (
    <EntryContainer elevation={2} style={{ width: "90%", margin: "auto" }}>
      <StyledLabel
        htmlFor={`course_translations[${index}].language`}
        required={true}
      >
        {t("courseLanguage")}
      </StyledLabel>
      <Field
        id={`course_translations[${index}].language`}
        name={`course_translations[${index}].language`}
        type="select"
        errors={getIn(errors, `[${index}].language`)}
        fullWidth
        variant="outlined"
        select
        autoComplete="off"
        component={StyledTextField}
      >
        {languages.map((option: { value: string; label: string }) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Field>
      <StyledField
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
      <StyledField
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
      <StyledLabel
        htmlFor={`course_translations[${index}].link`}
        required={false}
      >
        {t("courseLink")}
      </StyledLabel>
      <StyledField
        id={`course_translations[${index}].link`}
        name={`course_translations[${index}].link`}
        type="text"
        label={t("courseLink")}
        InputLabelprops={inputLabelProps}
        error={getIn(errors, `[${index}].link`)}
        fullWidth
        autoComplete="off"
        variant="outlined"
        component={StyledTextField}
      />
      <StyledLabel
        htmlFor={`course_translations[${index}].open_university_course_code`}
        required={false}
      >
        {t("courseOpenCode")}
      </StyledLabel>
      <Field
        id={`course_translations[${index}].open_university_course_code`}
        name={`course_translations[${index}].open_university_course_code`}
        type="text"
        error={getIn(errors, `[${index}].open_university_course_code`)}
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
          {t("courseRemoveTranslation")}
        </StyledButton>
      </Grid>
    </EntryContainer>
  )
}

export default CourseTranslationListItem
