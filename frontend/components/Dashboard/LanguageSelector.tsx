import React from "react"
import Typography from "@material-ui/core/Typography"
import LanguageSelectorForm from "./LanguageSelectorForm"
import styled from "styled-components"

const StyledCard = styled.div`
  margin: 5px;
  padding: 1rem;
  display: flex;
  flex-direction: row;
`

interface LanguageSelectorProps {
  handleLanguageChange: any
  languageValue: string
}
function LanguageSelector(props: LanguageSelectorProps) {
  const { handleLanguageChange, languageValue } = props
  return (
    <StyledCard>
      <Typography component="h2">Select Course Language</Typography>
      <LanguageSelectorForm
        handleLanguageChange={handleLanguageChange}
        languageValue={languageValue}
      />
    </StyledCard>
  )
}

export default LanguageSelector
