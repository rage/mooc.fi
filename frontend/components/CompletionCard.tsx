import React from "react"
import { Grid, Card, CardContent, Typography } from "@material-ui/core"
import DoneIcon from "@material-ui/icons/Done"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

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

function formatDateTime(date: string) {
  const dateToFormat = new Date(date)
  const formattedDate = dateToFormat.toUTCString()
  return formattedDate
}

function CardContentGrid({ completer }) {
  const classes = useStyles()
  return (
    <Grid
      container
      spacing={1}
      direction="row"
      alignItems="flex-start"
      className={classes.contentGrid}
    >
      <Grid item>
        <Typography variant="body1">{completer.user.first_name}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">{completer.user.last_name}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">{completer.email}</Typography>
      </Grid>
      {completer.user.student_number ? (
        <Grid item>
          <Typography variant="body1">
            HY SID:{completer.user.student_number}
          </Typography>
        </Grid>
      ) : (
        <Grid item>
          <Typography variant="body1">No student number</Typography>
        </Grid>
      )}
    </Grid>
  )
}

function CompletionDetailGrid({ completer }) {
  return (
    <Grid container spacing={1} direction="row" alignItems="flex-start">
      <Grid item>
        <DoneIcon />
      </Grid>
      <Grid item>
        <Typography variant="body1">HY</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          {formatDateTime(completer.created_at)}
        </Typography>
      </Grid>
    </Grid>
  )
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

export function HeaderCard({}) {
  const classes = useStyles()
  return (
    <Grid item xs={12} sm={12} lg={8}>
      <Card className={classes.titleCard}>
        <CardContent>
          <Typography component="p" variant="h6">
            Elements of Ai
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
