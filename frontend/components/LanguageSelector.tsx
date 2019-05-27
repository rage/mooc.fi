import React from "react"
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Card,
  FormLabel,
} from "@material-ui/core"

function LanguageSelector({ handleLanguageChange, languageValue }) {
  return (
    <Card>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={languageValue.en}
              onChange={handleLanguageChange("en")}
            />
          }
          label="EN"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={languageValue.fi}
              onChange={handleLanguageChange("fi")}
            />
          }
          label="FI"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={languageValue.se}
              onChange={handleLanguageChange("se")}
            />
          }
          label="SE"
        />
      </FormGroup>
    </Card>
  )
}

export default LanguageSelector
