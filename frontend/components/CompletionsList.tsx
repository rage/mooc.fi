import React  from 'react';
import { List,
         ListItem,
         ListItemText,
         ListItemSecondaryAction,
         ListSubheader
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
  },
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
     padding: '0.7em',
     backgroundColor: 'white'
    }
  }),
);

function CompletionsListItem({ completer }) {
  return(
    <ListItem 
      divider={true}
      button={true}
    >
      <ListItemText
        primary={completer.name}
        secondary={completer.SID}
      />
    </ListItem>
  )
}

function CompletionsList() {
    const classes = useStyles()
    
    return(
      <section>
        <List className={classes.list}>
          <ListSubheader>
            Completions for this course
          </ListSubheader>
          {completions.map(c => <CompletionsListItem key={c.SID} completer={c} />)}
        </List>
      </section>
    )
  }

export default CompletionsList