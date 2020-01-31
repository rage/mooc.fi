import React, { useState, useContext } from "react"
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel"
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import MenuItem from "@material-ui/core/MenuItem"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import { Field, getIn } from "formik"
import { StyledTextField } from "/components/Dashboard/Editor/common"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import { languages as languagesT } from "./form-validation"
import styled from "styled-components"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { mapLangToLanguage } from "/components/DataFormatFunctions"

const StyledPanel = styled(MuiExpansionPanel)`
  background-color: #7f3fb2;
  color: white !important;
`

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
  const [expanded, setExpanded] = useState<boolean>(false)
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const languages = languagesT(t)

  return (
    <StyledPanel expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <MuiExpansionPanelSummary
        expandIcon={<ExpandMoreIcon style={{ fill: "white" }} />}
        aria-label="Expand"
        aria-controls="translation-edit-form"
      >
        <Typography>{mapLangToLanguage[translationLanguage]}</Typography>
      </MuiExpansionPanelSummary>
      <MuiExpansionPanelDetails>
        <EntryContainer elevation={2}>
          <Field
            name={`course_translations[${index}].language`}
            type="select"
            label={t("courseLanguage")}
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
      </MuiExpansionPanelDetails>
    </StyledPanel>
  )
}

export default CourseTranslationListItem
