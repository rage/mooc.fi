import {
  CoursesResponse,
  CurrentUserResponse,
  FrontpageResponse,
  StudyModulesResponse,
} from "./api-types"
import { getCookie } from "/util/cookie"

export interface ApiError {
  message: string
  status?: number
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = getCookie("access_token")
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  }

  const url = endpoint

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error: ApiError = {
      message: `API request failed: ${response.statusText}`,
      status: response.status,
    }
    throw error
  }

  return response.json()
}

export const apiClient = {
  getFrontpage: (language?: string): Promise<FrontpageResponse> => {
    const params = new URLSearchParams()
    if (language) {
      params.append("language", language)
    }
    const query = params.toString()
    return fetchApi<FrontpageResponse>(
      `/api/public/frontpage${query ? `?${query}` : ""}`,
    )
  },

  getCourses: (language?: string): Promise<CoursesResponse> => {
    const params = new URLSearchParams()
    if (language) {
      params.append("language", language)
    }
    const query = params.toString()
    return fetchApi<CoursesResponse>(
      `/api/public/courses${query ? `?${query}` : ""}`,
    )
  },

  getStudyModules: (language?: string): Promise<StudyModulesResponse> => {
    const params = new URLSearchParams()
    if (language) {
      params.append("language", language)
    }
    const query = params.toString()
    return fetchApi<StudyModulesResponse>(
      `/api/public/study-modules${query ? `?${query}` : ""}`,
    )
  },

  getCurrentUser: (): Promise<CurrentUserResponse> => {
    return fetchApi<CurrentUserResponse>("/api/public/current-user")
  },
}
