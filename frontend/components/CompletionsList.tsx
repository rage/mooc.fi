import React from "react"
import { ApolloClient, gql } from "apollo-boost"
import { Query } from "react-apollo"
import { AllCompletions as AllCompletionsData } from "../pages/__generated__/AllCompletions"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Typography, CircularProgress } from "@material-ui/core"
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
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      marginTop: "0.7em",
      marginBottom: "0.7em",
    },
  }),
)

interface Variables {
  course: string
}

export interface CompletionsListProps {
  course: string
}
const Completions: React.SFC<CompletionsListProps> = props => {
  const { course } = props

  return (
    <Query<AllCompletionsData, Variables>
      query={AllCompletionsQuery}
      variables={{ course }}
    >
      {({ loading, error, data, fetchMore }) => {
        if (loading) {
          return <CircularProgress color="secondary" />
        }
        if (error || !data) {
          return (
            <div>
              Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
            </div>
          )
        }
        console.log(data)
        return (
          <Grid container spacing={3} justify="center">
            <HeaderCard />
            {data.completions.map(completer => (
              <CompletionCard completer={completer} key={completer.id} />
            ))}
            <CompletionPaginator
              onLoadMore={() =>
                fetchMore({
                  query: AllCompletionsQuery,
                  updateQuery: (previousResult, { fetchMoreResult }) => {
                    const PreviousEntry = previousResult.completions
                    const moreCompletions = fetchMoreResult.completions
                    return {
                      completions: [...PreviousEntry, ...moreCompletions],
                    }
                  },
                })
              }
            />
          </Grid>
        )
      }}
    </Query>
  )
}
const CompletionsList = withRouter(props => {
  const classes = useStyles()
  const { router } = props
  return (
    <section>
      <Typography
        variant="h3"
        component="h2"
        align="center"
        gutterBottom={true}
        className={classes.title}
      >
        Completions
      </Typography>
      <Completions course={router.query.course} />
    </section>
  )
})

export default CompletionsList
