import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { styled } from "@mui/material/styles"

const LanguageSelectorFormControl = styled(FormControl)`
  margin: auto auto auto 1rem;
` as typeof FormControl

interface LanguageSelectorProps {
  handleLanguageChange: React.ChangeEventHandler<HTMLInputElement>
  languageValue: string
}

function LanguageSelectorForm(props: LanguageSelectorProps) {
  const { handleLanguageChange, languageValue } = props

  return (
    <LanguageSelectorFormControl component="fieldset">
      <RadioGroup
        aria-label="course language"
        name="courselanguage"
        value={languageValue}
        onChange={handleLanguageChange}
        row
      >
        <FormControlLabel value="fi_FI" control={<Radio />} label="FI" />
        <FormControlLabel value="en_US" control={<Radio />} label="EN" />
        <FormControlLabel value="se_SE" control={<Radio />} label="SE" />
        <FormControlLabel value="" control={<Radio />} label="ALL" />
      </RadioGroup>
    </LanguageSelectorFormControl>
  )
}

export default LanguageSelectorForm
