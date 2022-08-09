import { ApolloClient, NormalizedCacheObject } from "@apollo/client"

import { CurrentUserDocument } from "/static/types/generated"

export default async function fetchUserDetails(
  apollo: ApolloClient<NormalizedCacheObject>,
) {
  const { data } = await apollo.query({
    query: CurrentUserDocument,
    fetchPolicy: "cache-first",
  })
  return data.currentUser
}
