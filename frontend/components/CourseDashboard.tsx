import React  from 'react';
import { Paper,
        Typography
        } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CompletionsList from './CompletionsList'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
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