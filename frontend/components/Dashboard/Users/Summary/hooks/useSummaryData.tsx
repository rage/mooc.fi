import { useMemo, useState } from "react"

import { sortBy } from "lodash"

import { type UserPointsSummaryContext } from "../contexts/UserPointsSummaryContext"
import { UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment } from "../types"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface UseSummaryDataArgs {
  slug?: string
  data?: Array<UserCourseSummaryCoreFieldsFragment> | null
  loading: boolean
  search?: string | null
}

function mapExerciseCompletionsToExercise(
  data: UserCourseSummaryCoreFieldsFragment,
): UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment {
  return {
    ...data,
    course: {
      ...data?.course,
      exercises: sortBy(
        (data?.course?.exercises ?? []).map((exercise) => ({
          ...exercise,
          exercise_completions: (data?.exercise_completions ?? []).filter(
            (ec) => ec?.exercise_id === exercise.id,
          ),
        })),
        ["part", "section", "name"],
      ),
    },
    tier_summaries:
      data?.tier_summaries?.map((tierEntry) => ({
        ...tierEntry,
        course: {
          ...tierEntry?.course,
          exercises: sortBy(
            (tierEntry?.course?.exercises ?? []).map((exercise) => ({
              ...exercise,
              exercise_completions: (
                tierEntry?.exercise_completions ?? []
              ).filter((ec) => ec?.exercise_id === exercise.id),
            })),
            ["part", "section", "name"],
          ),
        },
      })) ?? null,
  }
}

const useSummaryData = ({ data, loading, search }: UseSummaryDataArgs) => {
  /*const [selectedData, setSelectedData] = useState<
    UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment | undefined
  >(() => {
    const initialSelected = data?.find(
      ({ course }) => course?.slug === slug,
    )

    if (!initialSelected) {
      return undefined
    }

    return mapExerciseCompletionsToExercise(initialSelected)
  })*/

  const processedData = useMemo(() => {
    if (!data) {
      return []
    }

    const mappedData = data?.map(mapExerciseCompletionsToExercise) ?? []

    if (search) {
      return mappedData.filter((entry) =>
        entry?.course?.name
          .trim()
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()),
      )
    }

    return mappedData
  }, [search, data])

  /*const setSelected = useCallback(
    (slug: string) => {
      setSelectedInternal(slug)
      setSelectedData(
        processedData?.find(({ course }) => course?.slug === slug) ?? undefined,
      )
    },
    [processedData],
  )*/

  const value: UserPointsSummaryContext = useMemo(
    () => ({
      data: processedData,
      loading,
    }),
    [processedData, loading],
  )

  return value
}

export default useSummaryData
