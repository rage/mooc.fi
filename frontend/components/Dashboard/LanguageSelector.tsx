import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import LanguageSelectorForm from "./LanguageSelectorForm"

const StyledCard = styled("div")`
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
` as typeof Typography

interface LanguageSelectorProps {
  handleLanguageChange: React.ChangeEventHandler<HTMLInputElement>
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
