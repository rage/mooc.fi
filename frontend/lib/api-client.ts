interface ApiError {
  message: string
  status?: number
}

export async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint)

  if (!response.ok) {
    const error: ApiError = {
      message: `API request failed: ${response.statusText}`,
      status: response.status,
    }
    throw error
  }

  return response.json()
}

export type PublicEndpoint = "frontpage" | "courses" | "study-modules"

/**
 * URL of a public data endpoint. Public data is the same for every viewer, so
 * it is fetched without credentials to keep it shareable from HTTP caches.
 */
export function publicEndpointUrl(endpoint: PublicEndpoint, language?: string) {
  const query = language ? `?${new URLSearchParams({ language })}` : ""
  return `/api/public/${endpoint}${query}`
}
