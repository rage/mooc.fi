import { useEffect, useRef } from "react"

import withSignedIn from "/lib/with-signed-in"
import { useQueryParameter } from "/util/useQueryParameter"

import { gql, useMutation } from "@apollo/client"

const userOrganizationJoinConfirmationQuery = gql`
  query UserOrganizationJoinConfirmation($id: ID!) {
    userOrganizationJoinConfirmation(id: $id) {
      id
      expired
      expires_at
      confirmed
      confirmed_at
      user_organization {
        id
        user_id
        organization_id
        confirmed
      }
      email_delivery {
        id
        sent
      }
    }
  }
`

const userOrganizationJoinConfirmationMutation = gql`
  mutation UserOrganizationJoinConfirmation($id: ID!, $code: String!) {
    confirmUserOrganizationJoin(id: $id, code: $code) {
      id
      confirmed
      confirmed_at
      user_organization {
        id
        user_id
        organization_id
        confirmed
      }
    }
  }
`

const OrganizationMembershipActivationPage = () => {
  const joinConfirmationId = useQueryParameter("id")
  const slug = useQueryParameter("slug")
  const code = useQueryParameter("code", false)

  const loaded = useRef(false)

  const [confirmUserOrganizationJoin, { data, loading, error }] = useMutation(
    userOrganizationJoinConfirmationMutation,
    {
      variables: {
        id: joinConfirmationId,
        code,
      },
      refetchQueries: [
        {
          query: userOrganizationJoinConfirmationQuery,
          variables: { id: joinConfirmationId },
        },
      ],
    },
  )

  useEffect(() => {
    if (loaded.current) {
      return
    }

    loaded.current = true

    confirmUserOrganizationJoin()
  }, [confirmUserOrganizationJoin])

  // TODO: redirect to organization register page when ok?

  return (
    <div>
      Placeholder {joinConfirmationId} {code} {slug}
      {loading && <div>Loading...</div>}
      {error && (
        <div>
          Error: <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      {data && (
        <div>
          Mutation data: <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default withSignedIn(OrganizationMembershipActivationPage)
