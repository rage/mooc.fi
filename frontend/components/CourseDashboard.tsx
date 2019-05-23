<<<<<<< HEAD
import React  from 'react';
import { Paper,
        Typography
        } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CompletionsList from './CompletionsList'

=======
import React from "react"
import { Paper } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
<<<<<<< HEAD
     margin: '0.5em',
     display: 'flex',
     align: 'right'

    },
    }),
);



function CourseDashboard() {
    const classes = useStyles()
    return(
      <Paper className={classes.paper}>
          <Typography variant='h4' component='h2'>
             Course Dashboard
          </Typography>
          <CompletionsList />
      </Paper>
        
    )
  }

export default CourseDashboard
=======
      margin: "0.5em",
      height: 500,
      width: "70%",
      display: "flex",
      align: "right",
    },
  }),
)

function CourseDashboard() {
  const classes = useStyles()
  return <Paper className={classes.paper} />
}

export default CourseDashboard
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e
