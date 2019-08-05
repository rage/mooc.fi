import React from "react"
import { Typography } from "@material-ui/core"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "../../lib/authentication"
import redirect from "../../lib/redirect"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import AdminError from "../../components/Dashboard/AdminError"
import { WideContainer } from "../../components/Container"
import Editor from "../../components/Dashboard/Editor"
import { withRouter, SingletonRouter } from "next/router"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"

export const StudyModuleQuery = gql`
  query StudyModules {
    study_modules {
      id
      name
      slug
    }
  }
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginTop: "1em",
    },
  }),
)

interface NewCourseProps {
  router: SingletonRouter
  admin: boolean
  nameSpacesRequired: string[]
}

const NewCourse = (props: NewCourseProps) => {
  const { admin, router } = props
  const classes = useStyles()

  const { data, loading, error } = useQuery(StudyModuleQuery)

  if (!admin) {
    return <AdminError />
  }

  if (loading) {
    // TODO: spinner
    return null
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
          Create a new course
        </Typography>
        <Editor type="Course" modules={data.study_modules} />
      </WideContainer>
    </section>
  )
}

NewCourse.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default withRouter(NewCourse)
