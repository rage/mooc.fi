import React from "react"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import { SingletonRouter, withRouter } from "next/router"
import AdminError from "../../../components/Dashboard/AdminError"
import { Paper, Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { WideContainer } from "../../../components/Container"
import NextI18Next from "../../../i18n"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "../../../lib/authentication"
import redirect from "../../../lib/redirect"
import StudyModuleEdit from "../../../components/Dashboard/StudyModuleEdit/StudyModuleEdit"

export const StudyModuleQuery = gql`
  query StudyModuleDetails($id: ID!) {
    study_module(id: $id) {
      id
      courses {
        id
        name
        slug
      }
      study_module_translations {
        id
        name
        language
        description
      }
    }
  }
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginTop: "1em",
    },
    paper: {
      padding: "1em",
    },
  }),
)

interface EditStudyModuleProps {
  router: SingletonRouter
  admin: boolean
  nameSpacesRequired: string[]
  language: string
}

const EditStudyModule = (props: EditStudyModuleProps) => {
  const { admin, router, language } = props
  const id = router.query.id

  const classes = useStyles()

  let redirectTimeout: number | null = null

  const { data, loading, error } = useQuery(StudyModuleQuery, {
    variables: { id },
  })

  if (!admin) {
    return <AdminError />
  }

  if (loading) {
    // TODO: spinner
    return null
  }

  const listLink = `${language ? "/" + language : ""}/study-modules`

  if (!data.study_module) {
    redirectTimeout = setTimeout(() => router.push(listLink), 5000)
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
          Edit study module
        </Typography>
        {data.study_module ? (
          <StudyModuleEdit module={data.study_module} />
        ) : (
          <Paper className={classes.paper} elevation={2}>
            <Typography variant="body1">
              Study module with id <b>{id}</b> not found!
            </Typography>
            <Typography variant="body2">
              You will be redirected back to the module list in 5 seconds -
              press{" "}
              <NextI18Next.Link href={listLink}>
                <a
                  onClick={() =>
                    redirectTimeout && clearTimeout(redirectTimeout)
                  }
                  href={listLink}
                >
                  here
                </a>
              </NextI18Next.Link>{" "}
              to go there now.
            </Typography>
          </Paper>
        )}
      </WideContainer>
    </section>
  )
}

EditStudyModule.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    // @ts-ignore
    language: context.req.language,
    namespacesRequired: ["common"],
  }
}

export default withRouter(EditStudyModule)
