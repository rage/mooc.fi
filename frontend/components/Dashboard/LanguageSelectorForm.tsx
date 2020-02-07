import React from "react"
import {
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
} from "@material-ui/core"

interface LanguageSelectorProps {
  handleLanguageChange: any
  languageValue: string
}

function LanguageSelectorForm(props: LanguageSelectorProps) {
  const { handleLanguageChange, languageValue } = props

  return (
    <FormControl component="fieldset" style={{ margin: "auto auto auto 1rem" }}>
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
    </FormControl>
  )
}

export default LanguageSelectorForm
