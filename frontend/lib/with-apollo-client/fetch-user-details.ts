import { ApolloClient } from "@apollo/client"

import { CurrentUserDocument, CurrentUserQuery } from "/graphql/generated"

export default async function fetchUserDetails(
  apollo: ApolloClient<object>,
): Promise<CurrentUserQuery["currentUser"]> {
  const { data } = await apollo.query({
    query: CurrentUserDocument,
    fetchPolicy: "cache-first",
  })
  return data.currentUser
}
