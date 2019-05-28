import React, { useState } from "react"
import { ApolloClient, gql } from "apollo-boost"
import { AllCompletions as AllCompletionsData } from "../pages/__generated__/AllCompletions"
import { useQuery } from "react-apollo-hooks"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  Typography,
  TableBody,
  Grid,
  Card,
  CardContent,
} from "@material-ui/core"
import { VictoryChart, VictoryBar, VictoryAxis } from "victory"

/*export const AllCompletionsQuery = gql`
  query AllCompletions {
    completions(course: "elements-of-ai", first: 40) {
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
`*/
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleCard: {
      borderLeft: "7px solid #ffc107",
    },
    title: {
      textTransform: "uppercase",
      marginTop: "0.7em",
      marginBottom: "0.7em",
    },
  }),
)
function ListHeader() {
  const classes = useStyles()
  return (
    <Grid item xs={12} sm={12} lg={12}>
      <Card className={classes.titleCard}>
        <CardContent>
          <div>
            <Typography variant="h6" component="p">
              Elements of Ai
            </Typography>
            <Typography variant="body1" component="p">
              Students: 50 0000
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell align="right">2</TableCell>
                  <TableCell align="right">3</TableCell>
                  <TableCell align="right">4</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>11/12</TableCell>
                  <TableCell align="right">7/10</TableCell>
                  <TableCell align="right">6/10</TableCell>
                  <TableCell align="right">0/11</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Grid>
  )
}

function ListItemCard() {
  return (
    <Grid item xs={12} sm={12} lg={12}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="p">
            Milla Makkonen
          </Typography>
          <Typography variant="body1" component="p">
            test.mail@test.com
          </Typography>
          <Typography variant="body1" component="p">
            12345678
          </Typography>
          <VictoryChart height={175}>
            <VictoryBar
              horizontal
              style={{ data: { fill: "#c43a31" } }}
              data={[{ y: 12, x: 0.2 }]}
              barWidth={30}
              domain={{ y: [0, 15], x: [0, 1] }}
            />
            <VictoryAxis dependentAxis label="Completed from total exercises" />
          </VictoryChart>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell align="right">2</TableCell>
                <TableCell align="right">3</TableCell>
                <TableCell align="right">4</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>11/12</TableCell>
                <TableCell align="right">7/10</TableCell>
                <TableCell align="right">6/10</TableCell>
                <TableCell align="right">0/11</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Grid>
  )
}
const PointsList = () => {
  const classes = useStyles()
  /*const { loading, error, data } = useQuery<AllCompletionsData>(
    AllCompletionsQuery,
  )
  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }
  if (loading || !data) {
    return <div>Loading</div>
  }*/
  return (
    <section>
      <Typography
        component="h1"
        variant="h3"
        align="center"
        gutterBottom={true}
        className={classes.title}
      >
        Points
      </Typography>
      <Grid container spacing={3}>
        <ListHeader />
        <ListItemCard />
      </Grid>
    </section>
  )
}

export default PointsList
