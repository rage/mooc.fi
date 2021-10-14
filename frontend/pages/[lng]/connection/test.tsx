import { gql } from "@apollo/client"
import { useQuery, useMutation } from "@apollo/client"
import { Alert } from "@material-ui/core"
import { useRouter } from "next/router"
import React from "react"
import { useEffect } from "react"
import Container from "/components/Container"
import ErrorMessage from "/components/ErrorMessage"
import OrganizationConnectionList from "../../../components/Profile/OrganizationConnection/OrganizationConnectionList"
import Spinner from "/components/Spinner"
import { useLanguageContext } from "/contexts/LanguageContext"
import withSignedIn from "/lib/with-signed-in"
import { DeleteVerifiedUserTest } from "/static/types/generated/DeleteVerifiedUserTest"
import { useQueryParameter } from "/util/useQueryParameter"
import { CurrentUserUserOverView_currentUser_verified_users } from "/static/types/generated/CurrentUserUserOverView"

export const ConnectionTestQuery = gql`
  query ConnectionTest {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      student_number
      email
      verified_users {
        id
        created_at
        personal_unique_code
        display_name
        home_organization
        person_affiliation
        person_affiliation_updated_at
        updated_at
        mail
        organizational_unit
      }
    }
  }
`

export const DeleteVerifiedUserMutation = gql`
  mutation DeleteVerifiedUserTest($personal_unique_code: String!) {
    deleteVerifiedUser(personal_unique_code: $personal_unique_code) {
      id
      personal_unique_code
    }
  }
`

function ConnectionTest(props: any) {
  console.log(props)
  const { language } = useLanguageContext()

  const { data, error, loading } = useQuery(ConnectionTestQuery)
  const [deleteVerifiedUser, { data: deleteData, error: deleteError }] =
    useMutation<DeleteVerifiedUserTest>(DeleteVerifiedUserMutation, {
      refetchQueries: [
        {
          query: ConnectionTestQuery,
        },
      ],
    })
  const router = useRouter()

  const connectionSuccess = useQueryParameter("success", false)
  const connectionError = useQueryParameter("error", false)

  useEffect(() => {
    // TODO/FIXME: not actually how I want it to be done, but it's there
    if (deleteData?.deleteVerifiedUser) {
      router.replace(
        `/${language}/connection/test?success=${deleteData.deleteVerifiedUser.id}`,
        undefined,
        { shallow: true },
      )
    }
    if (deleteError) {
      router.replace(`/${language}/connection/test?error`)
    }
  }, [deleteData, deleteError])

  const decodedConnectionError = connectionError
    ? JSON.parse(Buffer.from(connectionError, "base64").toString("ascii"))
        ?.error
    : null

  if (error) {
    return <ErrorMessage />
  }

  if (loading) {
    return <Spinner />
  }

  const onDisconnect = async (
    user: CurrentUserUserOverView_currentUser_verified_users,
  ) =>
    deleteVerifiedUser({
      variables: { personal_unique_code: user.personal_unique_code },
    })

  return (
    <Container style={{ maxWidth: 900 }}>
      {connectionSuccess && <Alert severity="success">Success!</Alert>}
      {connectionError && (
        <Alert severity="error">
          Error:
          <pre>
            <code>{JSON.stringify(decodedConnectionError, null, 2)}</code>
          </pre>
        </Alert>
      )}
      <OrganizationConnectionList
        data={data?.currentUser?.verified_users}
        onDisconnect={onDisconnect}
      />
    </Container>
  )
}

export default withSignedIn(ConnectionTest)
