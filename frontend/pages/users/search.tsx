import * as React from "react"
import { SingletonRouter } from "next/router"
import gql from "graphql-tag"
import { Query, ApolloConsumer } from "react-apollo"
import { UserEmailContains } from "../../static/types/generated/UserEmailContains"

interface UserSearchProps {
  namespacesRequired: string[]
  router: SingletonRouter
  t: Function
  i18n: any
  tReady: boolean
}

const UserSearch = (props: UserSearchProps) => {
  const [searchText, setSearchText] = React.useState("")
  const [result, setResult]: [any[], any] = React.useState([])

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
              <input type="text" name="name" onChange={onTextBoxChange} />
            </label>
            <button
              onClick={async (event: any) => {
                event.preventDefault()
                const { data } = await client.query({
                  query: GET_DATA,
                  variables: { email: searchText },
                })
                setResult(data.userEmailContains)
                console.log(data.userEmailContains)
              }}
            >
              Search
            </button>
          </form>
          <RenderResults data={result} />
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
  console.log("DATA IN THING", data)
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
  query UserEmailContains($email: String!) {
    userEmailContains(email: $email) {
      id
      email
      student_number
      real_student_number
      upstream_id
      first_name
      last_name
    }
  }
`

export default UserSearch
