import React from "react"
import { Grid, Typography } from "@material-ui/core"
import DoneIcon from "@material-ui/icons/Done"
import CloseIcon from "@material-ui/icons/Close"

function formatDateTime(date: string) {
  const dateToFormat = new Date(date)
  const formattedDate = dateToFormat.toUTCString()
  return formattedDate
}

function CompletionDetailGrid({ completer }) {
  return (
    <Grid container spacing={1} direction="row" alignItems="flex-start">
      {completer.completions_registered.length > 0 ? (
        <div>
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
        </div>
      ) : (
        <div>
          <Grid item>
            <CloseIcon />
          </Grid>
        </div>
      )}
    </Grid>
  )
}

export default CompletionDetailGrid
