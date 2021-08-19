import { gql, ApolloClient, NormalizedCacheObject } from "@apollo/client"
import { VerifiedUsersFragment } from "/graphql/fragments/verifiedUsersFragment"

export const UserDetailQuery = gql`
  query UserOverView {
    currentUser {
      id
      first_name
      last_name
      email
      upstream_id
      administrator
      ...VerifiedUsersFragment
    }
  }
  ${VerifiedUsersFragment}
`

export default async function fetchUserDetails(
  apollo: ApolloClient<NormalizedCacheObject>,
) {
  const { data } = await apollo.query({
    query: UserDetailQuery,
    fetchPolicy: "cache-first",
  })

  return data.currentUser
}
