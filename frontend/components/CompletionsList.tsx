import React, { useState } from "react"
import { ApolloClient, gql } from "apollo-boost"
import { AllCompletions as AllCompletionsData } from "../pages/__generated__/AllCompletions"
import { useQuery } from "react-apollo-hooks"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import {Grid, Typography} from '@material-ui/core';
import CompletionCard, { HeaderCard } from './CompletionCard'

export const AllCompletionsQuery = gql`
  query AllCompletions {
    completions(course: "elements-of-ai" first:40) {
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
      padding: '1em'
    }

  }),
)

const CompletionsList = () => {
  const { loading, error, data } = useQuery<AllCompletionsData>(AllCompletionsQuery)
  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }
  if (loading || !data) {
    return <div>Loading</div>
  }
  console.log(data)
  return (
    <section>
    <Typography variant='h3' component='h2' align='center' gutterBottom={true}>
      Course Completions 
    </Typography>
    <Grid container spacing={3}>
      <HeaderCard language='fi' course='Elements of Ai' />
      {data.completions.map(completer => <CompletionCard completer={completer} /> )}
    </Grid>
    </section>
  )
}


export default CompletionsList