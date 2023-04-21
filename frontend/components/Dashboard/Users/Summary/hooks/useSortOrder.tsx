import { useCallback, useEffect, useMemo, useState } from "react"

import { orderBy } from "lodash"
import { useRouter } from "next/router"

import { ApolloError } from "@apollo/client"

import {
  SortOrder,
  sortOrderOptions,
  UserCourseSummarySort,
  userCourseSummarySortOptions,
} from "../types"
import { UserPointsSummaryContext } from "../UserPointsSummaryContext"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface UseSortOrderArgs {
  initialData?: Array<UserCourseSummaryCoreFieldsFragment> | null
  initialSort?: string
  initialOrder?: string
  search?: string | null
  loading?: boolean
  error?: ApolloError
}

function flipOrder(order: SortOrder) {
  return order === "asc" ? "desc" : "asc"
}

const defaultSort = "course_name"
const defaultOrder = "asc"

const useSortOrder = ({
  initialData,
  initialSort,
  initialOrder,
  search,
  loading,
  error,
}: UseSortOrderArgs) => {
  const router = useRouter()

  const t = useTranslator(ProfileTranslations)

  const [sort, setSort] = useState<UserCourseSummarySort>(() => {
    if (
      userCourseSummarySortOptions.includes(
        initialSort as UserCourseSummarySort,
      )
    ) {
      return initialSort as UserCourseSummarySort
    }
    return defaultSort
  })
  const [order, setOrder] = useState<SortOrder>(() => {
    if (sortOrderOptions.includes(initialOrder as SortOrder)) {
      return initialOrder as SortOrder
    }
    return defaultOrder
  })

  const data = useMemo(() => {
    if (!initialData) {
      return []
    }

    let sortedData: Array<UserCourseSummaryCoreFieldsFragment>

    switch (sort) {
      case "activity_date":
        sortedData = orderBy(
          initialData,
          [
            (entry) => {
              const combinedExerciseCompletions = (
                entry.exercise_completions ?? []
              ).concat(
                (entry.tier_summaries ?? []).flatMap(
                  (t) => t.exercise_completions ?? [],
                ),
              )
              return (
                orderBy(combinedExerciseCompletions, "created_at")?.pop()
                  ?.updated_at ?? "2999-01-01"
              )
            },
            "course.name",
          ],
          [flipOrder(order), order],
        )
        break
      case "completion_date":
        sortedData = orderBy(
          initialData,
          [
            (entry) => entry.completion?.updated_at ?? "2999-01-01",
            "course.name",
          ],
          [flipOrder(order), order],
        )
        break
      default:
        sortedData = orderBy(initialData, "course.name", order)
        break
    }

    if (!search) {
      return sortedData
    }

    const searchData = sortedData.filter((entry) =>
      entry?.course?.name
        .trim()
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
    )

    return searchData
  }, [search, order, sort, initialData])

  const onCourseSortChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSort(event.target.value as UserCourseSummarySort)
    },
    [],
  )

  const onSortOrderToggle = useCallback(() => {
    setOrder((v) => flipOrder(v))
  }, [setOrder])

  const sortOptions = useMemo(
    () =>
      userCourseSummarySortOptions.map((o) => ({
        value: o,
        label: t(`courseSortOrder-${o}`),
      })),
    [router.locale],
  )

  useEffect(() => {
    const queryParams = new URLSearchParams()
    if (sort && sort !== defaultSort) {
      queryParams.append("sort", sort)
    }
    if (order && order !== defaultOrder) {
      queryParams.append("order", order)
    }
    const href =
      router.asPath.split("?")[0] +
      (queryParams.toString().length > 0 ? "?" + queryParams : "")
    router.replace(href, undefined, { shallow: true })
  }, [sort, order])

  const value: UserPointsSummaryContext = useMemo(
    () => ({
      data,
      sort,
      order,
      onCourseSortChange,
      onSortOrderToggle,
      sortOptions,
      loading,
      error,
    }),
    [data, sort, order, loading, error],
  )

  return value
}

export default useSortOrder
