import { ApolloClient } from "@apollo/client"

import { CurrentUserDocument } from "/graphql/generated"

export default async function fetchUserDetails(apollo: ApolloClient<object>) {
  const { data } = await apollo.query({
    query: CurrentUserDocument,
    fetchPolicy: "cache-first",
  })
  return data.currentUser
}
