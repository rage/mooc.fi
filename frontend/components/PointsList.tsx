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
  List,
  ListItem,
  Card,
  CardContent,
  CardHeader,
  ListSubheader
} from "@material-ui/core"
import { VictoryPie, VictoryContainer, VictoryArea, VictoryChart } from "victory";

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
function ListHeader() {
    return(
        <Card>
            <CardContent>
            <div>
                <Typography variant='h6' component='p'>
                    Elements of Ai
                </Typography>
                <Typography variant='body1' component='p'>
                    Students: 50 0000
                </Typography>
                <VictoryChart>
                <VictoryArea 
                    style={{ data: {fill: "#c43a31"}}}
                    data={[10,50,75,60, 85 ]}
                    categories={{x: ["1","2","3","4"]}}/>
                </VictoryChart>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell align='right'>2</TableCell>
                            <TableCell align='right'>3</TableCell>
                            <TableCell align='right'>4</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                        <TableCell>11/12</TableCell>
                        <TableCell align='right'>7/10</TableCell>
                        <TableCell align='right'>6/10</TableCell>
                        <TableCell align='right'>0/11</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
    )
}

function ListItemCard() {
    return(
        <Card>
            <CardContent>
                <Typography variant='h5' component='p'>
                    Milla Makkonen
                </Typography>
                <Typography variant='body1' component='p'>
                    test.mail@test.com 
                </Typography>
                <Typography variant='body1' component='p'>
                    12345678
                </Typography>
                <VictoryPie 
                    data={[
                        {x: "Completed", y:11},
                        {x:"Not completed", y:9}
                    ]}
                    colorScale={["cyan", "tomato"]}
                    innerRadius={100}
                    containerComponent={<VictoryContainer/>}/>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell align='right'>2</TableCell>
                            <TableCell align='right'>3</TableCell>
                            <TableCell align='right'>4</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                        <TableCell>11/12</TableCell>
                        <TableCell align='right'>7/10</TableCell>
                        <TableCell align='right'>6/10</TableCell>
                        <TableCell align='right'>0/11</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
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
        <List>
            <ListItem>
                <ListHeader />
            </ListItem>
            <ListItem>
                <ListItemCard />
            </ListItem>
        </List>
      
    </section>
  )
}

export default PointsList
