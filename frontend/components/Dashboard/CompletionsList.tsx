import React from "react"
import { ApolloClient, gql } from "apollo-boost"
import { Query } from "react-apollo"
import { AllCompletions as AllCompletionsData } from "../__generated__/AllCompletions"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Typography, CircularProgress } from "@material-ui/core"
import CompletionCard from "./CompletionCard"
import HeaderCard from "./HeaderCard"
import { withRouter } from "next/router"
import CompletionPaginator from "./CompletionPaginator"

export const AllCompletionsQuery = gql`
  query AllCompletions($course: String, $cursor: ID) {
    completionsPaginated(course: $course, first: 15, after: $cursor) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
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
        cursor
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
        const cursor = data.completionsPaginated.pageInfo.endCursor

        return (
          <Grid container spacing={3} justify="center">
            <HeaderCard course={"elements-of-ai"} />
            {data.completionsPaginated.edges.map(completer => (
              <CompletionCard
                completer={completer.node}
                key={completer.node.id}
              />
            ))}
            <CompletionPaginator
              getNext={() =>
                fetchMore({
                  query: AllCompletionsQuery,
                  variables: { course: course, cursor: cursor },
                  updateQuery: (previousResult, { fetchMoreResult }) => {
                    const newCompletions = fetchMoreResult.completionsPaginated
                    const newCursor = newCompletions.pageInfo.endCursor
                    return {
                      cursor: newCursor,
                      completionsPaginated: {
                        pageInfo: {
                          hasNextPage: newCompletions.pageInfo.hasNextPage,
                          hasPreviousPage: true,
                          startCursor: newCompletions.pageInfo.startCursor,
                          endCursor: newCompletions.pageInfo.endCursor,
                          __typename: "PageInfo",
                        },
                        edges: newCompletions.edges,
                        __typename: "CompletionConnection",
                      },
                    }
                  },
                })
              }
              isNext={data.completionsPaginated.pageInfo.hasNextPage}
              hasPrevious={data.completionsPaginated.pageInfo.hasPrevious}
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
