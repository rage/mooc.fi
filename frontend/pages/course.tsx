/*import React, { useState } from "react"
import { Typography, Grid } from "@material-ui/core"
import { NextContext } from "next"
import { isSignedIn, isAdmin } from "../lib/authentication"
import redirect from "../lib/redirect"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { ApolloClient, gql } from "apollo-boost"
import { AllCourses as AllCoursesData } from "./__generated__/AllCourses"
import { useQuery } from "react-apollo-hooks"
import AdminError from "../components/AdminError"
import LanguageSelectorBar from "../components/LanguageSelectorBar"
import DashboardSideMenu from "../components/DashboardSideMenu"
import CourseDashboard from "../components/CourseDashboard"

export const AllCoursesQuery = gql`
  query AllCourses {
    courses {
      id
      name
      slug
    }
    currentUser {
      id
      administrator
    }
  }
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: "auto",
      padding: "0.5em",
    },
    toolbar: { 
      ...theme.mixins.toolbar,
      padding: '1em'
    }

  }),
)

const Course = ({ t, admin }) => {
  const [languageValue, setLanguageValue] = useState(4)
  const [courseDetails, setCourseDetails] = useState({})

  const classes = useStyles()

  const handleChange = (event, value) => {
    setLanguageValue(value)
  }

  const { loading, error, data } = useQuery<AllCoursesData>(AllCoursesQuery)

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  if (!admin) {
    return <AdminError />
  }

  if (loading || !data) {
    return <div>Loading</div>
  }

  return (
    <section className={classes.toolbar}>
      <DashboardSideMenu />
      <LanguageSelectorBar value={languageValue} handleChange={handleChange} />
    </section>
  )
}

Course.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  console.log(admin)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default Course*/

import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ViewListIcon from "@material-ui/icons/ViewList"
import ScatterplotIcon from "@material-ui/icons/ScatterPlot"
import { ListItemAvatar, Avatar, Divider, Typography } from '@material-ui/core';
import LanguageSelectorBar from '../components/LanguageSelectorBar';
import CompletionsList from '../components/CompletionsList'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    padding: '1em'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  headerItem: {
    padding: '1.5em',
  },
  toolbar: theme.mixins.toolbar,
}));

function Courses() {
  const [languageValue, setLanguageValue] = useState(4)
  const [selection, setSelection] = useState('')


  const classes = useStyles()

  const handleChange = (event, value) => {
    setLanguageValue(value)
  }

  const handleSelectionChange = ( value) => {
    console.log(value)
    setSelection(value)
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          <ListItem className={classes.headerItem}>
            <ListItemAvatar>
              <Avatar alt="Course logo" src="/static/images/courseimages/elements-of-ai.png" />
            </ListItemAvatar>
            <ListItemText disableTypography={true}> 
              <Typography variant='body1' >
                Elements of Ai
              </Typography>
            </ListItemText>
          </ListItem>
          <Divider />
          <ListItem button key="Completions" onClick={() => handleSelectionChange('completions')}>
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText primary="Completions" />
          </ListItem>
          <ListItem button onClick={() => handleSelectionChange('points')}>
            <ListItemIcon>
              <ScatterplotIcon />
            </ListItemIcon>
            <ListItemText primary="Points" />
          </ListItem>
        </List>
      </Drawer>
      <section className={classes.content}>
        <div className={classes.toolbar} />
         <LanguageSelectorBar value={languageValue} handleChange={handleChange} />
         {{
           'completions':<CompletionsList />,
           '':<p>STUFF</p>
         }[selection]}
      </section>
    </div>
  );
}

export default Courses;
