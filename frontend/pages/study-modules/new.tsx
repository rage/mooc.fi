import React from "react"
import { NextPageContext as NextContext } from "next"
import { SingletonRouter, withRouter } from "next/router"
import AdminError from "../../components/Dashboard/AdminError"
import { WideContainer } from "../../components/Container"
import { Typography } from "@material-ui/core"
import { isAdmin, isSignedIn } from "../../lib/authentication"
import redirect from "../../lib/redirect"
import StudyModuleEdit from "../../components/Dashboard/StudyModuleEdit/StudyModuleEdit"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginTop: "1em",
    },
  }),
)

interface NewStudyModuleProps {
  router: SingletonRouter
  admin: boolean
  nameSpacesRequired: string[]
}

const NewStudyModule = (props: NewStudyModuleProps) => {
  const { admin, router } = props
  const classes = useStyles()

  if (!admin) {
    return <AdminError />
  }

  return (
    <section>
      <WideContainer>
        <Typography
          component="h1"
          variant="h2"
          gutterBottom={true}
          align="center"
          className={classes.header}
        >
          Create a new study module
        </Typography>
        <StudyModuleEdit />
      </WideContainer>
    </section>
  )
}

NewStudyModule.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default withRouter(NewStudyModule)
