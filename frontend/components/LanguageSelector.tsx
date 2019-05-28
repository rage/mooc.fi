import React from "react"
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Card,
  CardHeader,
  Typography,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  baseCard: {
    margin: 5,
  },
  checkbox: {
    margin: 3,
  },
}))

function LanguageSelector({ handleLanguageChange, languageValue }) {
  const classes = useStyles()
  return (
    <Card className={classes.baseCard}>
      <CardHeader title="Select course language" />
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
    </Card>
  )
}

export default LanguageSelector
