
import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { 
        IconButton,  } from "@material-ui/core"
import LanguageSelectorBar from "../components/LanguageSelectorBar"
import CompletionsList from "../components/CompletionsList"
import PointsList from '../components/PointsList'
import LanguageSelector from '../components/LanguageSelector'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  drawerPaper: {
    padding: "1em",
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  headerItem: {
    padding: "1.5em",
  },
  menuButton: {
   
  },
  toolbar: theme.mixins.toolbar,
}))

const MapTypeToComponent = {
  1: <CompletionsList />,
  2:<PointsList />,
  0: <p>STUFF</p>
}

function Courses() {
  const [languageValue, setLanguageValue] = useState({
    fi: true,
    en: true,
    se: true
  })
  const [selection, setSelection] = useState(0)


  const classes = useStyles()

  const handleSelectionChange = (event, value) => {
    setSelection(value)
  }
  const handleLanguageChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguageValue({...languageValue,[name]:event.target.checked})
  }

   
  return (
    <section className={classes.root}>
      <LanguageSelectorBar
          value={selection}
          handleChange={handleSelectionChange}
        />
        {MapTypeToComponent[selection]}
        <LanguageSelector 
          handleLanguageChange={handleLanguageChange}
          languageValue={languageValue} />
      </section>
  )
}

export default Courses
