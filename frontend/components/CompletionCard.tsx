import React from "react"
import { Grid, Card, CardContent, Typography } from "@material-ui/core"
import DoneIcon from "@material-ui/icons/Done"

function CardContentGrid({ completer }) {
  return (
    <Grid container spacing={1} direction="row" alignItems="flex-start">
      <Grid item>
        <Typography variant="body1">{completer.user.first_name}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">{completer.user.first_name}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">{completer.user.last_name}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">{completer.user.student_number}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">{completer.email}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">{completer.completion_language}</Typography>
      </Grid>
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
        <Typography variant="body1">{completer.created_at}</Typography>
      </Grid>
    </Grid>
  )
}

function CompletionCard({ completer }) {
  return (
    <Grid item xs={12} sm={12} lg={8}>
      <Card>
        <CardContent>
          <CardContentGrid completer={completer} />
          <CompletionDetailGrid completer={completer} />
        </CardContent>
      </Card>
    </Grid>
  )
}

export default CompletionCard

export function HeaderCard({}) {
  return (
    <Grid item xs={12} sm={12} lg={8}>
      <Card>
        <CardContent>
          <Typography component="h2" variant="h4">
            Elements of Ai
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
