import { gql, ApolloClient, NormalizedCacheObject } from "@apollo/client"

export const UserDetailQuery = gql`
  query UserOverView {
    currentUser {
      id
      first_name
      last_name
      email
      verified_users {
        id
        person_affiliation
        person_affiliation_updated_at
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

/*export async function fetchVerifiedUserDetails(
  apollo: ApolloClient<NormalizedCacheObject>,
  personal_unique_code: string
) {
  const { data } = await apollo.query({
    query: VerifiedUserDetailQuery,
    variables: {
      personal_unique_code,
      secret: "whatever" // process.env.VERIFIED_USER_SECRET
    }
  })

  return data.verifiedUser
}*/
