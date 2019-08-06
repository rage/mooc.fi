import * as React from "react"
import { NextPageContext as NextContext } from "next"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import AdminError from "../components/Dashboard/AdminError"
import {
  Container,
  Grid,
  CircularProgress,
  Typography,
} from "@material-ui/core"
import { WideContainer } from "../components/Container"
import { AllModules } from "/static/types/generated/AllModules"
import { isAdmin, isSignedIn } from "../lib/authentication"
import redirect from "../lib/redirect"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import ModuleGrid from "../components/ModuleGrid"
import { ObjectifiedModule } from "../static/types/moduleTypes"
import {
  filterAndModifyByLanguage,
  mapNextLanguageToLocaleCode,
} from "../util/moduleFunctions"

export const AllModulesQuery = gql`
  query AllModulesWithTranslations {
    study_modules(orderBy: order_ASC) {
      id
      slug
      name
      image
      order
      study_module_translations {
        id
        language
        name
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
  }),
)

const StudyModules = (admin: boolean, language: string) => {
  const classes = useStyles()

  const { loading, error, data } = useQuery<AllModules>(AllModulesQuery)

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  if (!admin) {
    return <AdminError />
  }

  if (loading || !data) {
    return (
      <Container style={{ display: "flex", height: "600px" }}>
        <Grid item container justify="center" alignItems="center">
          <CircularProgress color="primary" size={60} />
        </Grid>
      </Container>
    )
  }

  return (
    <WideContainer>
      <Typography
        component="h1"
        variant="h2"
        gutterBottom={true}
        align="center"
        className={classes.header}
      >
        All Study Modules
      </Typography>
      <ModuleGrid modules={data.study_modules} />
    </WideContainer>
  )
}

StudyModules.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    // @ts-ignore
    language: context && context.req ? context.req.language : "",
    namespacesRequired: ["common"],
  }
}

export default StudyModules
