import React from "react"
import { Grid, Card, CardContent, Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import CardContentGrid from "./CardContentGrid"
import CompletionDetailGrid from "./CompletionDetailGrid"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleCard: {
      borderLeft: "7px solid #af52bf",
    },
    contentGrid: {
      borderBottom: "1.5px dotted gray",
    },
    language: {
      marginTop: "0.7em",
      marginBottom: "0.7em",
    },
  }),
)

const MapLangToLanguage = {
  en_US: "English",
  fi_FI: "Finnish",
  se_SE: "Swedish",
}

function CompletionCard({ completer }) {
  const classes = useStyles()
  return (
    <Grid item xs={12} sm={12} lg={8}>
      <Card>
        <CardContent>
          <CardContentGrid completer={completer} />
          <Grid item className={classes.language}>
            <Typography variant="body1">
              Course language:{" "}
              {MapLangToLanguage[completer.completion_language]}
            </Typography>
          </Grid>
          <CompletionDetailGrid completer={completer} />
        </CardContent>
      </Card>
    </Grid>
  )
}

export default CompletionCard
