import * as React from "react"
import { SingletonRouter } from "next/router"
import gql from "graphql-tag"
import { Query, ApolloConsumer } from "react-apollo"

interface UserSearchProps {
  namespacesRequired: string[]
  router: SingletonRouter
  t: Function
  i18n: any
  tReady: boolean
}

const UserSearch = (props: UserSearchProps) => {
  const [searchText, setSearchText] = React.useState("")

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
              Name:
              <input type="text" name="name" onChange={onTextBoxChange} />
            </label>
            <button
              onClick={async () => {
                const { data } = await client.query({
                  query: GET_DATA,
                  variables: "",
                })
              }}
            />
          </form>
        </div>
      )}
    </ApolloConsumer>
  )
}

const GET_DATA = gql`
  query UserCourseProgesses($course_slug: String!) {
    UserCourseProgresses(course_slug: $course_slug) {
      id
      user {
        id
        email
        student_number
        real_student_number
        upstream_id
        first_name
        last_name
      }
      progress
      UserCourseSettings {
        course_variant
        country
        language
      }
    }
  }
`

export default UserSearch
