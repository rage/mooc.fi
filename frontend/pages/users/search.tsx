import * as React from "react"
import { SingletonRouter } from "next/router"
import gql from "graphql-tag"
import { Query, ApolloConsumer } from "react-apollo"
import { UserEmailContains } from "../../static/types/generated/UserEmailContains"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"

interface UserSearchProps {
  namespacesRequired: string[]
  router: SingletonRouter
  t: Function
  i18n: any
  tReady: boolean
}

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}))

const UserSearch = (props: UserSearchProps) => {
  const [searchText, setSearchText] = React.useState("")
  const [result, setResult]: [any[], any] = React.useState([])
  const [cursor, setCursor] = React.useState({ after: null, before: null })
  const classes = useStyles()

  const onTextBoxChange = (event: any) => {
    setSearchText(event.target.value)
    console.log(searchText)
  }
  return (
    <ApolloConsumer>
      {client => (
        <div>
          <form>
            <label>
              Email:
              <TextField
                id="standard-search"
                label="Search field"
                type="search"
                className={classes.textField}
                margin="normal"
                onChange={onTextBoxChange}
              />
            </label>
            <Button
              variant="contained"
              className={classes.button}
              onClick={async (event: any) => {
                event.preventDefault()
                const { data } = await client.query({
                  query: GET_DATA,
                  variables: { email: searchText, first: 50 },
                })
                setResult(data.userEmailContains.edges)
                setCursor({
                  before: data.userEmailContains.edges[0].node.id,
                  after:
                    data.userEmailContains.edges[
                      data.userEmailContains.edges.length - 1
                    ].node.id,
                })
              }}
            >
              Search
            </Button>
          </form>
          <RenderResults data={result} />
          <Button
            variant="contained"
            className={classes.button}
            onClick={async (event: any) => {
              event.preventDefault()
              const { data } = await client.query({
                query: GET_DATA,
                variables: {
                  email: searchText,
                  last: 50,
                  before: cursor.before,
                },
              })
              setResult(data.userEmailContains.edges)
              setCursor({
                before: data.userEmailContains.edges[0].node.id,
                after:
                  data.userEmailContains.edges[
                    data.userEmailContains.edges.length - 1
                  ].node.id,
              })
            }}
          >
            last
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            onClick={async (event: any) => {
              event.preventDefault()
              const { data } = await client.query({
                query: GET_DATA,
                variables: {
                  email: searchText,
                  first: 50,
                  after: cursor.after,
                },
              })
              setResult(data.userEmailContains.edges)
              setCursor({
                before: data.userEmailContains.edges[0].node.id,
                after:
                  data.userEmailContains.edges[
                    data.userEmailContains.edges.length - 1
                  ].node.id,
              })
            }}
          >
            next
          </Button>
        </div>
      )}
    </ApolloConsumer>
  )
}
interface RenderResultsProps {
  data: any[]
}
const RenderResults = (props: RenderResultsProps) => {
  const data = props.data
  if (data.length < 1) return <p>Not found</p>
  return (
    <ol>
      {data.map((p: any) => (
        <li>{JSON.stringify(p)}</li>
      ))}
    </ol>
  )
}

const GET_DATA = gql`
  query UserEmailContains(
    $email: String!
    $before: ID
    $after: ID
    $first: Int
    $last: Int
  ) {
    userEmailContains(
      email: $email
      first: $first
      last: $last
      after: $after
      before: $before
    ) {
      edges {
        node {
          id
          email
          student_number
          real_student_number
          upstream_id
          first_name
          last_name
        }
      }
    }
  }
`

export default UserSearch
