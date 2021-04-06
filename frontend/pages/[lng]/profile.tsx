import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client"
import { ProfileUserOverView as UserOverViewData } from "/static/types/generated/ProfileUserOverView"
import Spinner from "/components/Spinner"
import ErrorMessage from "/components/ErrorMessage"
import ProfilePageHeader from "/components/Profile/ProfilePageHeader"
import StudentDataDisplay from "/components/Profile/StudentDataDisplay"
import Container from "/components/Container"
import withSignedIn from "/lib/with-signed-in"
import { CompletionsRegisteredFragment } from "/graphql/fragments/completionsRegistered"

export const UserOverViewQuery = gql`
  query ProfileUserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      student_number
      email
      completions {
        id
        completion_language
        student_number
        created_at
        tier
        eligible_for_ects
        course {
          id
          slug
          name
          photo {
            uncompressed
          }
          has_certificate
        }
        ...CompletionsRegisteredFragment
      }
      research_consent
    }
  }
  ${CompletionsRegisteredFragment}
`

function Profile() {
  const { data, error, loading } = useQuery<UserOverViewData>(UserOverViewQuery)

  if (error) {
    return <ErrorMessage />
  }
  if (loading) {
    return <Spinner />
  }

  const first_name = data?.currentUser?.first_name || "No first name"
  const last_name = data?.currentUser?.last_name || "No last name"
  const email = data?.currentUser?.email || "no email"
  const studentNumber = data?.currentUser?.student_number || "no student number"

  return (
    <>
      <ProfilePageHeader
        first_name={first_name}
        last_name={last_name}
        email={email}
        student_number={studentNumber}
      />
      <Container style={{ maxWidth: 900 }}>
        <StudentDataDisplay data={data?.currentUser || undefined} />
      </Container>
    </>
  )
}

export default withSignedIn(Profile)
