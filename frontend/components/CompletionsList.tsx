import React, { useState } from "react"
import { ApolloClient, gql } from "apollo-boost"
import { AllCompletions as AllCompletionsData } from "../pages/__generated__/AllCompletions"
import { useQuery } from "react-apollo-hooks"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import {Table, TableRow, TableCell, TableHead, Typography} from '@material-ui/core';

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
  const rows = [

  ]
  return (
    <section >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell align='right'>Last Name</TableCell>
            <TableCell align='right'>email</TableCell>
            <TableCell align='right'>Student Number</TableCell>
            <TableCell align='right'>Language</TableCell>
            <TableCell align='right'>Completion time</TableCell>
          </TableRow>
        </TableHead>
        {data.completions.map(c => (
          <TableRow key={c.id}>
            <TableCell component="th" scope="row">
                {c.user.first_name}
            </TableCell>
            <TableCell align="right">{c.user.last_name}</TableCell>
            <TableCell align="right">{c.email}</TableCell>
            <TableCell align="right">{c.user.student_number}</TableCell>
            <TableCell align="right">{c.completion_language}</TableCell>
            <TableCell align="right">{c.created_at}</TableCell>
          </TableRow>
        )
        )}
      </Table>
    </section>
  )
}



export default CompletionsList
