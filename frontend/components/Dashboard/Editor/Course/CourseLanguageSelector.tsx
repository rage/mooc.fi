import { useCallback } from "react"

import { useFieldArray } from "react-hook-form"

import { Button, ButtonGroup } from "@mui/material"
import { styled } from "@mui/material/styles"

import { FormSubtitle } from "../../EditorLegacy/common"
import { initialTranslation } from "./form-validation"
import { CourseFormValues } from "./types"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"

const ButtonGroupContainer = styled(ButtonGroup)`
  width: 90%;
  margin: auto;
  display: flex;
  margin-bottom: 1rem;
  margin-top: 1 rem;
  justify-content: space-around;
`
const StyledLanguageButton = styled(Button)`
  width: 33%;
  background-color: #378170;
  margin: 0.5rem;
  color: white;
  @media (max-width: 600px) {
    font-size: 16px;
    padding: 2rem;
  }
  @media (min-width: 600px) {
    font-size: 21px;
    padding: 3rem;
  }
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
    color: white;
    border: 1px solid #354b45;
  }
  &:disabled[data-selected="true"] {
    background-color: #519b8a;
  }
  &:disabled[data-selected="false"] {
    background-color: #354b45;
    color: gray;
  }
`
interface LanguageSelectorProps {
  selectedLanguage: string
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>
}

function CourseLanguageSelector(props: LanguageSelectorProps) {
  const { selectedLanguage, setSelectedLanguage } = props

  const { append } = useFieldArray<CourseFormValues, "course_translations">({
    name: "course_translations",
  })

  const t = useTranslator(CoursesTranslations)

  const onSelectFinnish = useCallback(() => {
    setSelectedLanguage(selectedLanguage === "en_US" ? "both" : "fi_FI")
    append({ ...initialTranslation, language: "fi_FI" })
  }, [selectedLanguage, setSelectedLanguage, append])
  const onSelectEnglish = useCallback(() => {
    setSelectedLanguage(selectedLanguage === "fi_FI" ? "both" : "en_US")
    append({ ...initialTranslation, language: "en_US" })
  }, [selectedLanguage, setSelectedLanguage, append])
  const onSelectBoth = useCallback(() => {
    if (selectedLanguage === "") {
      append({
        ...initialTranslation,
        language: "en_US",
      })
      append({
        ...initialTranslation,
        language: "fi_FI",
      })
    } else if (selectedLanguage === "fi") {
      append({ ...initialTranslation, language: "en_US" })
    } else {
      append({
        ...initialTranslation,
        language: "fi_FI",
      })
    }

    setSelectedLanguage("both")
  }, [selectedLanguage, setSelectedLanguage, append])

  return (
    <>
      <FormSubtitle variant="h3" component="h3" align="center">
        {t("courseLanguageSelectTitle")}
      </FormSubtitle>
      <ButtonGroupContainer
        color="secondary"
        aria-label="course language select button group"
        id={`course_translations`}
        disabled={selectedLanguage == "both"}
      >
        <StyledLanguageButton
          onClick={onSelectFinnish}
          disabled={
            selectedLanguage === "fi_FI" || selectedLanguage === "en_US"
          }
          data-selected={selectedLanguage === "fi_FI"}
        >
          {t("courseFinnish")}
        </StyledLanguageButton>
        <StyledLanguageButton
          disabled={
            selectedLanguage === "en_US" || selectedLanguage === "fi_FI"
          }
          data-selected={selectedLanguage === "en_US"}
          onClick={onSelectEnglish}
        >
          {t("courseEnglish")}
        </StyledLanguageButton>
        <StyledLanguageButton
          data-selected={selectedLanguage === "both"}
          onClick={onSelectBoth}
        >
          {t("courseBoth")}
        </StyledLanguageButton>
      </ButtonGroupContainer>
    </>
  )
}

export default CourseLanguageSelector
