import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { AllCompletions_completionsPaginated_edges_node } from "./__generated__/AllCompletions"

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

interface Props {
  completer: AllCompletions_completionsPaginated_edges_node
}

function CardContentGrid(props: Props) {
  const classes = useStyles()
  const { completer } = props

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

export default CardContentGrid
