import { apiClient } from "/lib/api-client"

import { CurrentUserQuery } from "/graphql/generated"

export default async function fetchUserDetails(): Promise<
  CurrentUserQuery["currentUser"]
> {
  try {
    const response = await apiClient.getCurrentUser()
    return response.currentUser
  } catch (error) {
    return null
  }
}
