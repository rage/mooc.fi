import { apiClient } from "/lib/api-client"
import { CurrentUserResponse } from "/lib/api-types"

export default async function fetchUserDetails(
  accessToken?: string,
): Promise<CurrentUserResponse["currentUser"]> {
  try {
    const response = await apiClient.getCurrentUser(accessToken)
    return response.currentUser
  } catch (error) {
    return null
  }
}
