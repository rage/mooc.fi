import React from "react"
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import ViewListIcon from "@material-ui/icons/ViewList"
import ScatterplotIcon from "@material-ui/icons/ScatterPlot"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sideMenu: {
      flexShrink: 0,
    },
    toolbar: theme.mixins.toolbar,
  })
)

function DashboardSideMenu() {
  const classes = useStyles()
  return (
    <Drawer variant="permanent" className={classes.sideMenu}>
      <div className={classes.toolbar}>
        <List>
          <ListItem>
            <ListItemIcon>
              <ScatterplotIcon />
            </ListItemIcon>
            <ListItemText primary="ELEMENTS OF AI" />
          </ListItem>
          <ListItem button key="Completions">
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText primary="Completions" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ScatterplotIcon />
            </ListItemIcon>
            <ListItemText primary="Points" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  )
}

export default DashboardSideMenu
