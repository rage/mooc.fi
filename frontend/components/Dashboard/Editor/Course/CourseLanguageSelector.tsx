import { FieldArray } from "formik"

import { Button, ButtonGroup } from "@mui/material"
import { styled } from "@mui/material/styles"

import { initialTranslation } from "./form-validation"
import { FormSubtitle } from "/components/Dashboard/Editor/common"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

const ButtonGroupContainer = styled(ButtonGroup)`
  width: 90%;
  margin: auto;
  display: flex;
  margin-bottom: 1rem;
  margin-top: 1 rem;
`
interface ButtonProps {
  selected: boolean
}
const StyledLanguageButton = styled(Button)<ButtonProps>`
  width: 33%;
  background-color: #378170;
  margin: 0.5rem;
  padding: 3rem;
  color: white;
  font-size: 21px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.5),
    inset 0px 0px 2px rgba(154, 147, 113, 0.95);
  border: 1px solid #378170;
  &:hover {
    background-color: #83acda;
    border: 1px solid #83acda;
    color: black;
  }
  &:disabled {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.5);
    background-color: #354b45;
    color: white;
    border: 1px solid #354b45;
    ${(props) => `text-decoration: ${props.selected ? `underline` : `none`};`}
  }
`
interface LanguageSelectorProps {
  selectedLanguage: string
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>
}

const CourseLanguageSelector = (props: LanguageSelectorProps) => {
  const { selectedLanguage, setSelectedLanguage } = props
  const t = useTranslator(CoursesTranslations)
  return (
    <>
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("courseLanguageSelectTitle")}
      </FormSubtitle>
      <FieldArray name="course_translations">
        {(helpers) => (
          <ButtonGroupContainer
            color="secondary"
            aria-label="course language select button group"
            id={`course_translations`}
            disabled={selectedLanguage == "both"}
          >
            <StyledLanguageButton
              onClick={() => {
                setSelectedLanguage(
                  selectedLanguage === "en_US" ? "both" : "fi_FI",
                )
                helpers.push({ ...initialTranslation, language: "fi_FI" })
              }}
              disabled={
                selectedLanguage === "fi_FI" || selectedLanguage === "en_US"
              }
              selected={selectedLanguage === "fi_FI"}
            >
              {t("courseFinnish")}
            </StyledLanguageButton>
            <StyledLanguageButton
              disabled={
                selectedLanguage === "en_US" || selectedLanguage === "fi_FI"
              }
              selected={selectedLanguage === "en_US"}
              onClick={() => {
                setSelectedLanguage(
                  selectedLanguage === "fi_FI" ? "both" : "en_US",
                )
                helpers.push({ ...initialTranslation, language: "en_US" })
              }}
            >
              {t("courseEnglish")}
            </StyledLanguageButton>
            <StyledLanguageButton
              selected={selectedLanguage === "both"}
              onClick={() => {
                if (selectedLanguage === "") {
                  helpers.push({
                    ...initialTranslation,
                    language: "en_US",
                  })
                  helpers.push({
                    ...initialTranslation,
                    language: "fi_FI",
                  })
                } else if (selectedLanguage === "fi") {
                  helpers.push({ ...initialTranslation, language: "en_US" })
                } else {
                  helpers.push({
                    ...initialTranslation,
                    language: "fi_FI",
                  })
                }

                setSelectedLanguage("both")
              }}
            >
              {t("courseBoth")}
            </StyledLanguageButton>
          </ButtonGroupContainer>
        )}
      </FieldArray>
    </>
  )
}

export default CourseLanguageSelector
