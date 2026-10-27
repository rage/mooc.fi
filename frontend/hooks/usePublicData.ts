import { useQuery } from "@tanstack/react-query"

import { apiClient } from "/lib/api-client"
import {
  CoursesResponse,
  CurrentUserResponse,
  FrontpageResponse,
  StudyModulesResponse,
} from "/lib/api-types"

export function useFrontpageData(language?: string) {
  return useQuery<FrontpageResponse>({
    queryKey: ["frontpage", language],
    queryFn: () => apiClient.getFrontpage(language),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCoursesData(language?: string) {
  return useQuery<CoursesResponse>({
    queryKey: ["courses", language],
    queryFn: () => apiClient.getCourses(language),
    staleTime: 5 * 60 * 1000,
  })
}

export function useStudyModulesData(language?: string) {
  return useQuery<StudyModulesResponse>({
    queryKey: ["study-modules", language],
    queryFn: () => apiClient.getStudyModules(language),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCurrentUser() {
  return useQuery<CurrentUserResponse>({
    queryKey: ["current-user"],
    queryFn: () => apiClient.getCurrentUser(),
    staleTime: 1 * 60 * 1000,
    retry: false,
  })
}

export function useCurrentUserData(): CurrentUserResponse["currentUser"] {
  const { data } = useCurrentUser()
  return data?.currentUser ?? null
}
