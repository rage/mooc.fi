import React from "react"
import { Card, CardHeader } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import LanguageSelectorForm from "./LanguageSelectorForm"

const useStyles = makeStyles(theme => ({
  baseCard: {
    margin: 5,
  },
}))

function LanguageSelector({ handleLanguageChange, languageValue }) {
  const classes = useStyles()
  return (
    <Card className={classes.baseCard}>
      <CardHeader title="Select course language" />
      <LanguageSelectorForm
        handleLanguageChange={handleLanguageChange}
        languageValue={languageValue}
      />
    </Card>
  )
}

export default LanguageSelector
