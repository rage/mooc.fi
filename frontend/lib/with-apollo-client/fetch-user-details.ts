import { ApolloClient } from "@apollo/client"

import { apiClient } from "/lib/api-client"

import { CurrentUserQuery } from "/graphql/generated"

export default async function fetchUserDetails(
  _pollo: ApolloClient<object>,
): Promise<CurrentUserQuery["currentUser"]> {
  try {
    const response = await apiClient.getCurrentUser()
    return response.currentUser
  } catch (error) {
    return null
  }
}
