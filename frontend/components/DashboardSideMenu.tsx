import React from "react"
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import ViewListIcon from "@material-ui/icons/ViewList"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sideMenu: {
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
