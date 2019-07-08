import React from "react"
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  checkbox: {
    margin: 3,
  },
}))

function LanguageSelectorForm({ handleLanguageChange, languageValue }) {
  const classes = useStyles()

  return (
    <FormControl component="fieldset">
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
      </RadioGroup>
    </FormControl>
  )
}

export default LanguageSelectorForm
