import React from "react"
import { Grid, Typography } from "@material-ui/core"
import DoneIcon from "@material-ui/icons/Done"
import CloseIcon from "@material-ui/icons/Close"
import { AllCompletions_completionsPaginated_edges_node as completer } from "./__generated__/AllCompletions"
import { AllCompletions_completionsPaginated_edges_node_completions_registered as completionsRegistered } from "./__generated__/AllCompletions"

function formatDateTime(date: string) {
  const dateToFormat = new Date(date)
  const formattedDate = dateToFormat.toUTCString()
  return formattedDate
}

function CompletionDetailGrid(completer: completer) {
  let completionsregistered: completionsRegistered[] = []

  if (completer.completions_registered) {
    completionsregistered = completer.completions_registered
  }
  return (
    <Grid container spacing={1} direction="row" alignItems="flex-start">
      {completionsregistered.length > 0 ? (
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
