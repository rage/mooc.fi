import React from "react"
import { Checkbox, FormGroup, FormControlLabel } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  checkbox: {
    margin: 3,
  },
}))

function LanguageSelectorForm({ handleLanguageChange, languageValue }) {
  const classes = useStyles()
  return (
    <FormGroup row>
      <FormControlLabel
        className={classes.checkbox}
        control={
          <Checkbox
            checked={languageValue.en}
            onChange={handleLanguageChange("en")}
          />
        }
        label="EN"
      />
      <FormControlLabel
        className={classes.checkbox}
        control={
          <Checkbox
            checked={languageValue.fi}
            onChange={handleLanguageChange("fi")}
          />
        }
        label="FI"
      />
      <FormControlLabel
        className={classes.checkbox}
        control={
          <Checkbox
            checked={languageValue.se}
            onChange={handleLanguageChange("se")}
          />
        }
        label="SE"
      />
    </FormGroup>
  )
}

export default LanguageSelectorForm
