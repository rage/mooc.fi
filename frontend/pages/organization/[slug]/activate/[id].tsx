import { useEffect, useRef } from "react"

import { gql, useMutation } from "@apollo/client"

import withSignedIn from "/lib/with-signed-in"
import { useQueryParameter } from "/util/useQueryParameter"

import {
  ConfirmUserOrganizationJoinDocument,
  UserOrganizationJoinConfirmationDocument,
} from "/graphql/generated"

const OrganizationMembershipActivationPage = () => {
  const joinConfirmationId = useQueryParameter("id")
  const slug = useQueryParameter("slug")
  const code = useQueryParameter("code", false)

  const loaded = useRef(false)

  const [confirmUserOrganizationJoin, { data, loading, error }] = useMutation(
    ConfirmUserOrganizationJoinDocument,
    {
      variables: {
        id: joinConfirmationId,
        code,
      },
      refetchQueries: [
        {
          query: UserOrganizationJoinConfirmationDocument,
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
