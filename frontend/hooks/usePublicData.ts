import { useQuery } from "@tanstack/react-query"

import { fetchApi, PublicEndpoint, publicEndpointUrl } from "/lib/api-client"
import {
  CoursesResponse,
  FrontpageResponse,
  StudyModulesResponse,
} from "/lib/api-types"

const STALE_TIME_MS = 5 * 60 * 1000

function usePublicData<T>(endpoint: PublicEndpoint, language?: string) {
  return useQuery<T>({
    queryKey: [endpoint, language],
    queryFn: () => fetchApi<T>(publicEndpointUrl(endpoint, language)),
    staleTime: STALE_TIME_MS,
  })
}

export const useFrontpageData = (language?: string) =>
  usePublicData<FrontpageResponse>("frontpage", language)

export const useCoursesData = (language?: string) =>
  usePublicData<CoursesResponse>("courses", language)

export const useStudyModulesData = (language?: string) =>
  usePublicData<StudyModulesResponse>("study-modules", language)
