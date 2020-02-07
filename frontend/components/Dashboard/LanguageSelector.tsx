import React from "react"
import Typography from "@material-ui/core/Typography"
import LanguageSelectorForm from "./LanguageSelectorForm"
import styled from "styled-components"

const StyledCard = styled.div`
  margin: 5px;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  border-bottom: 1.5px solid #4d78a3;
`
const StyledText = styled(Typography)`
  font-size: 16px;
  line-height: 30px;
  margin: auto;
`
interface LanguageSelectorProps {
  handleLanguageChange: any
  languageValue: string
}
function LanguageSelector(props: LanguageSelectorProps) {
  const { handleLanguageChange, languageValue } = props
  return (
    <StyledCard>
      <StyledText component="h2">
        Filter results by completion language
      </StyledText>
      <LanguageSelectorForm
        handleLanguageChange={handleLanguageChange}
        languageValue={languageValue}
      />
    </StyledCard>
  )
}

export default LanguageSelector
