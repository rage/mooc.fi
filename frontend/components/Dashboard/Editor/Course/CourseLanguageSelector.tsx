import { useCallback } from "react"

import { useFieldArray, useFormContext } from "react-hook-form"

import { Button, ButtonGroup } from "@mui/material"
import { styled } from "@mui/material/styles"

import { FormSubtitle } from "../../EditorLegacy/common"
import { initialTranslation } from "./form-validation"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

const ButtonGroupContainer = styled(ButtonGroup)`
  width: 90%;
  margin: auto;
  display: flex;
  margin-bottom: 1rem;
  margin-top: 1 rem;
  justify-content: space-around;
`
interface ButtonProps {
  selected: boolean
}
const StyledLanguageButton = styled(Button)<ButtonProps>`
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

function CourseLanguageSelector(props: LanguageSelectorProps) {
  const { selectedLanguage, setSelectedLanguage } = props

  const { control } = useFormContext()

  const { append } = useFieldArray({
    control,
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
      <FormSubtitle variant="h6" component="h3" align="center">
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
          selected={selectedLanguage === "fi_FI"}
        >
          {t("courseFinnish")}
        </StyledLanguageButton>
        <StyledLanguageButton
          disabled={
            selectedLanguage === "en_US" || selectedLanguage === "fi_FI"
          }
          selected={selectedLanguage === "en_US"}
          onClick={onSelectEnglish}
        >
          {t("courseEnglish")}
        </StyledLanguageButton>
        <StyledLanguageButton
          selected={selectedLanguage === "both"}
          onClick={onSelectBoth}
        >
          {t("courseBoth")}
        </StyledLanguageButton>
      </ButtonGroupContainer>
    </>
  )
}

export default CourseLanguageSelector
