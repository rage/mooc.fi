import React from "react"
import NextI18Next from "../i18n"
import { isSignedIn } from "../lib/authentication"
import { NextContext } from "next"
import redirect from "../lib/redirect"
import { ApolloClient, gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import {
  UserOverView as UserOverViewData,
  UserOverView_currentUser_completions,
} from "./__generated__/UserOverView"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import Container from "../components/Container"
import Grid from "@material-ui/core/Grid"
import CompletedCourseCard from "../components/CompletedCourseCard"

export const UserOverViewQuery = gql`
  query UserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      email
      completions {
        id
        completion_language
        student_number
        created_at
        course {
          id
          slug
          name
        }
        completions_registered {
          id
          created_at
          organization {
            slug
          }
        }
      }
    }
  }
`
const Title = styled(Typography)`
  font-family: "Open Sans Condensed", sans-serif !important;
  margin-top: 7rem;
  margin-left: 2rem;
  margin-bottom: 1rem;
  @media (min-width: 320px) {
    font-size: 46px;
  }
  @media (min-width: 600px) {
    font-size: 56px;
  }
  @media (min-width: 960px) {
    font-size: 72px;
  }
`

interface CompletionsProps {
  namespacesRequired: string[]
  t: Function
  i18n: any
  tReady: boolean
}

function Completions(props: CompletionsProps) {
  const { t } = props
  const { loading, error, data } = useQuery<UserOverViewData>(UserOverViewQuery)
  let completions: UserOverView_currentUser_completions[] = []

  if (error) {
    return (
      <div>
        Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
      </div>
    )
  }

  if (loading || !data) {
    return <div>Loading</div>
  }

  if (data.currentUser && data.currentUser.completions) {
    completions = data.currentUser.completions
  }
  return (
    <section>
      <Title component="h1" variant="h2" align="center">
        {t("completionsTitle")}
      </Title>

      <Container>
        <Typography component="p" variant="h5" style={{ marginBottom: "1rem" }}>
          {t("completionNB")}
        </Typography>
        <Grid container spacing={2}>
          {completions.length > 0 ? (
            completions.map(c => <CompletedCourseCard completion={c} />)
          ) : (
            <Typography>{t("nocompletionsText")}</Typography>
          )}
        </Grid>
      </Container>
    </section>
  )
}

Completions.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    namespacesRequired: ["profile"],
  }
}

export default NextI18Next.withTranslation("profile")(Completions)
