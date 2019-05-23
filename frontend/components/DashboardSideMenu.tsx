<<<<<<< HEAD
import React  from 'react';
import { 
    List,
    ListItem,
    ListItemText,
    ListItemIcon
    } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ViewListIcon from '@material-ui/icons/ViewList';
=======
import React from "react"
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import ViewListIcon from "@material-ui/icons/ViewList"
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sideMenu: {
<<<<<<< HEAD
        width: '20%',
    }
  }),
);


function DashboardSideMenu() {
    
    const classes = useStyles()
    return(
        <List
        className={classes.sideMenu}>
        <ListItem
            button
            >
            <ListItemIcon>
                <ViewListIcon />
            </ListItemIcon>
            <ListItemText 
                primary='Completions'
                 />
        </ListItem>
     </List>
    )
  }

export default DashboardSideMenu
=======
      width: "20%",
    },
  }),
)

function DashboardSideMenu() {
  const classes = useStyles()
  return (
    <List className={classes.sideMenu}>
      <ListItem button>
        <ListItemIcon>
          <ViewListIcon />
        </ListItemIcon>
        <ListItemText primary="Completions" />
      </ListItem>
    </List>
  )
}

export default DashboardSideMenu
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e
