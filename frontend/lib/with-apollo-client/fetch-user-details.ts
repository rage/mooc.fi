import gql from "graphql-tag"
import { ApolloClient, NormalizedCacheObject } from "apollo-boost"

export const UserDetailQuery = gql`
  query UserOverView {
    currentUser {
      id
      first_name
      last_name
      email
      organization_memberships {
        id
        role
        organization {
          id
          slug
          organization_translations {
            id
            language
            name
          }
        }
      }
    }
  }
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
