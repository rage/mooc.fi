import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import LanguageSelectorBar from "../components/LanguageSelectorBar"
import CompletionsList from "../components/CompletionsList"
import PointsList from "../components/PointsList"
import LanguageSelector from "../components/LanguageSelector"
import { isSignedIn, isAdmin } from "../lib/authentication"
import redirect from "../lib/redirect"
import AdminError from "../components/AdminError"
import CourseDashboard from "../components/CourseDashboard"
import { NextContext } from "next"
import { WideContainer } from "../components/Container"
import { Breadcrumbs, Link } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  breadcrumb: {
    marginTop: 5,
    marginLeft: 5,
  },
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}))

const MapTypeToComponent = {
  1: <CompletionsList />,
  2: <PointsList />,
  0: <CourseDashboard />,
}

function Course({ admin }) {
  if (!admin) {
    return <AdminError />
  }

  const [languageValue, setLanguageValue] = useState({
    fi: true,
    en: true,
    se: true,
  })
  const [selection, setSelection] = useState(0)

  const classes = useStyles()

  const handleSelectionChange = (event, value) => {
    setSelection(value)
  }
  const handleLanguageChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLanguageValue({ ...languageValue, [name]: event.target.checked })
  }

  return (
    <section>
      <Breadcrumbs
        separator=">"
        aria-label="Breadcrumb"
        className={classes.breadcrumb}
      >
        <Link className={classes.link}>Home</Link>
        <Link className={classes.link} href={`/courses`} underline="hover">
          Courses
        </Link>
        <Link className={classes.link}>Elements of Ai</Link>
      </Breadcrumbs>
      <LanguageSelectorBar
        value={selection}
        handleChange={handleSelectionChange}
      />
      <WideContainer>
        <LanguageSelector
          handleLanguageChange={handleLanguageChange}
          languageValue={languageValue}
        />
        {MapTypeToComponent[selection]}
      </WideContainer>
    </section>
  )
}

Course.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)

  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default Course
