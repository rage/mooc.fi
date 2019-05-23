<<<<<<< HEAD
import React  from 'react';
import { 
    Table,
    TableHead,
    TableCell,
    TableRow
        } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';



const completions = [
  {
    name: 'Matti',
    SID: '1234'
  },
  {
    name: 'Minna',
    SID: '12345'
  },
  {
    name: 'Markus',
    SID: '123456'
=======
import React from "react"
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListSubheader,
} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const completions = [
  {
    name: "Matti",
    SID: "1234",
  },
  {
    name: "Minna",
    SID: "12345",
  },
  {
    name: "Markus",
    SID: "123456",
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e
  },
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
<<<<<<< HEAD
     padding: '0.7em',
     backgroundColor: 'white'
    },
    listItem: {
      margin: '0.7em'
    },
    content: {
      margin: '0.5em'
    }
  }),
);

/*function ListItemContent({ student }) {
  const classes = useStyles()
  return(
    <Grid container direction='row'>
      <Grid item className={classes.content}>
        <Typography variant='body1'>
          {student.user.first_name} {student.user.last_name}
        </Typography>
      </Grid>
      <Grid item className={classes.content}>
        <Typography variant='body1'>
          {student.user.student_number}
        </Typography>
      </Grid>
      <Grid item className={classes.content}>
        <Typography variant='body1'>
          {student.created_at}
        </Typography>
      </Grid>
      <Grid item className={classes.content}>
        <Typography variant='body1'>
          {student.completion_language}
        </Typography>
      </Grid>
    </Grid>
  )
}*/

function CompletionsListItem({ student }) {
  const classes = useStyles()
  console.log(student)
  return(
    
   
  )
}

function CompletionsList({ completions }) {
    const classes = useStyles()
    console.log(completions)
    return(
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Name
            </TableCell>
            <TableCell>
              Student ID
            </TableCell>
            <TableCell>
              
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    )
  }
 
export default CompletionsList
=======
      padding: "0.7em",
      backgroundColor: "white",
    },
  }),
)

function CompletionsListItem({ completer }) {
  return (
    <ListItem divider={true} button={true}>
      <ListItemText primary={completer.name} secondary={completer.SID} />
    </ListItem>
  )
}

function CompletionsList() {
  const classes = useStyles()

  return (
    <section>
      <List className={classes.list}>
        <ListSubheader>Completions for this course</ListSubheader>
        {completions.map(c => (
          <CompletionsListItem key={c.SID} completer={c} />
        ))}
      </List>
    </section>
  )
}

export default CompletionsList
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e
