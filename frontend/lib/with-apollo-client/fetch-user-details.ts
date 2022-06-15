import { UserDetailQuery } from "/graphql/queries/currentUser"

import { ApolloClient, NormalizedCacheObject } from "@apollo/client"

export default async function fetchUserDetails(
  apollo: ApolloClient<NormalizedCacheObject>,
) {
  const { data } = await apollo.query({
    query: UserDetailQuery,
    fetchPolicy: "cache-first",
  })
  return data.currentUser
}
