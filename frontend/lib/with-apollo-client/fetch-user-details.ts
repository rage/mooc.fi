import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client"

import { CurrentUserQuery } from "/graphql/queries/user"

export default async function fetchUserDetails(
  apollo: ApolloClient<NormalizedCacheObject>,
) {
  const { data } = await apollo.query({
    query: CurrentUserQuery,
    fetchPolicy: "cache-first",
  })
  return data.currentUser
}
