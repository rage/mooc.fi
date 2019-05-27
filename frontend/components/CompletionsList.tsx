import React, { useState, useEffect } from "react"
import { ApolloClient, gql } from "apollo-boost"
import { AllCompletions as AllCompletionsData } from "../pages/__generated__/AllCompletions"
import { MoreCompletions as MoreCompletionsData } from "./__generated__/MoreCompletions"
import { useQuery } from "react-apollo-hooks"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Typography } from "@material-ui/core"
import CompletionCard, { HeaderCard } from "./CompletionCard"
import { withRouter } from "next/router"
import CompletionPaginator from "./CompletionPaginator"

export const AllCompletionsQuery = gql`
  query AllCompletions($course: String) {
    completions(course: $course, first: 40) {
      id
      email
      completion_language
      created_at
      user {
        first_name
        last_name
        student_number
      }
    }
  }
`
export const MoreCompletionsQuery = gql`
  query MoreCompletions($course: String, $cursor: ID) {
    completions(course: $course, first: 40, after: $cursor) {
      id
      email
      completion_language
      created_at
      user {
        first_name
        last_name
        student_number
      }
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
      padding: "1em",
    },
  }),
)

const CompletionsList = withRouter(props => {
  const course = props.router.query.course
  const [completionsData, setcompletionsData] = useState()

  const { loading, error, data } = useQuery<AllCompletionsData>(
    AllCompletionsQuery,
    {
      variables: {
        course,
      },
    },
  )
  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }
  if (loading || !data) {
    return <div>Loading</div>
  }
  console.log("cursor", data.completions[0].id)

  const onLoadMore = () => {
    const { loading, error, data } = useQuery<MoreCompletionsData>(
      MoreCompletionsQuery,
      {
        variables: {
          course,
          cursor: data.completions[0].id,
        },
      },
    )
  }
  return (
    <section>
      <Typography
        variant="h3"
        component="h2"
        align="center"
        gutterBottom={true}
      >
        Course Completions
      </Typography>
      <Grid container spacing={3}>
        <HeaderCard />
        {data.completions.map(completer => (
          <CompletionCard completer={completer} key={completer.id} />
        ))}
        <CompletionPaginator />
      </Grid>
    </section>
  )
})

export default CompletionsList
